// src/app/demos/grafik/path-tracer/webgpu-pathtracer.ts
// 🎯 BUSINESS PURPOSE: WebGPU Path Tracing Engine
//
// BUSINESS CONTEXT: Cutting-edge real-time ray tracing showcase for premium clients
// TECHNICAL SHOWCASE: Pure WebGPU compute shaders, physical materials, progressive refinement
// REVENUE IMPACT: Demonstrates advanced GPU computing capabilities for high-value projects
//
// 🔗 INTEGRATIONS:
// - WebGPU: Direct compute shader path tracing with WGSL
// - Path Tracing: Monte Carlo integration, multiple bounces, next-event estimation
// - SVGF-lite: Temporal accumulation + joint-bilateral spatial denoising
// - Materials: Lambert diffuse, rough metal, dielectric glass
//
// 📊 PERFORMANCE: 1 sample/pixel/frame, quality ladder, DPR optimization
// 🎮 INTERACTIVITY: Orbit camera with accumulation reset on movement
// 🎨 QUALITY: ACES tonemapping, gamma correction, professional presentation

type Opts = { 
  qualityIndex?: number; 
  denoise?: boolean; 
  targetFPS?: number; 
};

type Engine = {
  mount: (el: HTMLDivElement) => Promise<void>;
  unmount: () => void;
  setPaused: (p: boolean) => void;
  setQuality: (idx: number | ((q: number) => number)) => void;
  setPreset: (id: number) => void;
  toggleDenoise: () => void;
};

export function makePathTracer(opts: Opts = {}): Engine {
  // ── Core WebGPU State ──────────────────────────────────────────────────────
  let adapter: GPUAdapter;
  let device: GPUDevice;
  let context: GPUCanvasContext;
  let canvas: HTMLCanvasElement;
  let format: GPUTextureFormat;
  
  // ── Render Targets ─────────────────────────────────────────────────────────
  let accumTex: GPUTexture;        // RGBA16F - Progressive accumulation buffer
  let rawTex: GPUTexture;          // RGBA16F - Current frame raw (noisy) sample
  let denoiseTex: GPUTexture;      // RGBA16F - Denoised output buffer
  let gbufNormalTex: GPUTexture;   // RGBA16F - First-hit normal for denoising
  let gbufDepthTex: GPUTexture;    // R32F - First-hit depth for denoising
  
  // ── Engine State ───────────────────────────────────────────────────────────
  let sampleCount = 0;
  let paused = false;
  let denoiseOn = opts.denoise ?? true;
  let time = 0;
  
  // ── Quality Ladder ─────────────────────────────────────────────────────────
  const qualityLadder = [
    { scale: 0.60, steps: 48 },   // Mobile/Low
    { scale: 0.75, steps: 72 },   // Medium
    { scale: 0.90, steps: 96 },   // High
    { scale: 1.00, steps: 112 },  // Ultra
  ];
  let qualityIndex = Math.max(0, Math.min(qualityLadder.length - 1, opts.qualityIndex ?? 2));
  
  // ── Camera State (Orbit) ───────────────────────────────────────────────────
  let yaw = 0.0;   // Looking straight at Cornell Box front
  let pitch = 0.0; // Level with scene center
  let dist = 2.5;  // Optimal viewing distance
  const target: [number, number, number] = [0, 1.0, 0];
  let preset = 1;
  
  // ── GPU Resources ──────────────────────────────────────────────────────────
  let pipeRayTrace: GPUComputePipeline;
  let pipeDenoise: GPUComputePipeline;
  let pipeComposite: GPURenderPipeline;
  let uniformBuffer: GPUBuffer;
  
  // ── Bind Groups ────────────────────────────────────────────────────────────
  let bgRayTrace: GPUBindGroup;
  let bgDenoiseA: GPUBindGroup;
  let bgDenoiseB: GPUBindGroup;
  let bgComposite: GPUBindGroup;
  
  // ── Performance Optimization ───────────────────────────────────────────────
  const DPR = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5);
  
  // ── Uniform Data Structure ─────────────────────────────────────────────────
  interface Uniforms {
    resX: number; resY: number; frame: number; maxSteps: number;
    time: number; denoise: number; _pad0: number; _pad1: number;
    
    // Camera matrices
    camPos: [number, number, number, number];
    camFwd: [number, number, number, number];
    camRight: [number, number, number, number];
    camUp: [number, number, number, number];
    
    // Camera parameters
    sensor: [number, number, number, number]; // width, height, near, far
    
    // Material parameters
    matTune: [number, number, number, number]; // metalRoughness, glassIOR, pad, pad
  }

  // ── Math Utilities ─────────────────────────────────────────────────────────
  const subtract = (a: number[], b: number[]): number[] => 
    [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  
  const cross = (a: number[], b: number[]): number[] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2], 
    a[0] * b[1] - a[1] * b[0]
  ];
  
  const normalize = (a: number[]): number[] => {
    const len = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / len, a[1] / len, a[2] / len];
  };

  // ── Camera System ──────────────────────────────────────────────────────────
  function computeCameraMatrix() {
    const cx = target[0] + dist * Math.cos(pitch) * Math.cos(yaw);
    const cy = target[1] + dist * Math.sin(pitch);
    const cz = target[2] + dist * Math.cos(pitch) * Math.sin(yaw);
    
    const pos = [cx, cy, cz];
    const fwd = normalize(subtract(target, pos));
    const right = normalize(cross(fwd, [0, 1, 0]));
    const up = normalize(cross(right, fwd));
    
    return { pos, fwd, right, up };
  }

  // ── Uniform Buffer Management ──────────────────────────────────────────────
  function updateUniforms(width: number, height: number) {
    const { pos, fwd, right, up } = computeCameraMatrix();
    const quality = qualityLadder[qualityIndex];
    
    const sensorW = 1.6;
    const sensorH = sensorW * (height / Math.max(1, width));
    
    const uniforms: Uniforms = {
      resX: width,
      resY: height,
      frame: sampleCount,
      maxSteps: quality.steps,
      time,
      denoise: denoiseOn ? 1 : 0,
      _pad0: 0,
      _pad1: 0,
      
      camPos: [pos[0], pos[1], pos[2], 0],
      camFwd: [fwd[0], fwd[1], fwd[2], 0],
      camRight: [right[0], right[1], right[2], 0],
      camUp: [up[0], up[1], up[2], 0],
      
      sensor: [sensorW, sensorH, 0.02, 100.0],
      matTune: [0.18, 1.5, 0, 0], // metal roughness, glass IOR
    };
    
    // Convert to flat array for buffer writing
    const data = new Float32Array([
      uniforms.resX, uniforms.resY, uniforms.frame, uniforms.maxSteps,
      uniforms.time, uniforms.denoise, uniforms._pad0, uniforms._pad1,
      ...uniforms.camPos,
      ...uniforms.camFwd, 
      ...uniforms.camRight,
      ...uniforms.camUp,
      ...uniforms.sensor,
      ...uniforms.matTune,
    ]);
    
    device.queue.writeBuffer(uniformBuffer, 0, data);
  }

  // ── Texture Management ─────────────────────────────────────────────────────
  function createTexture(width: number, height: number, format: GPUTextureFormat, usage: GPUTextureUsageFlags): GPUTexture {
    return device.createTexture({
      size: { width, height },
      format,
      usage,
    });
  }

  function reallocateRenderTargets(clientWidth: number, clientHeight: number) {
    const quality = qualityLadder[qualityIndex];
    const renderWidth = Math.max(8, Math.floor(clientWidth * DPR * quality.scale));
    const renderHeight = Math.max(8, Math.floor(clientHeight * DPR * quality.scale));
    
    // Destroy old textures
    [accumTex, rawTex, denoiseTex, gbufNormalTex, gbufDepthTex].forEach(tex => tex?.destroy?.());
    
    // Create new textures
    const usage = GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC;
    
    accumTex = createTexture(renderWidth, renderHeight, "rgba16float", usage);
    rawTex = createTexture(renderWidth, renderHeight, "rgba16float", usage);
    denoiseTex = createTexture(renderWidth, renderHeight, "rgba16float", usage);
    gbufNormalTex = createTexture(renderWidth, renderHeight, "rgba16float", usage);
    gbufDepthTex = createTexture(renderWidth, renderHeight, "r32float", usage);
    
    // Reset accumulation
    sampleCount = 0;
    updateUniforms(renderWidth, renderHeight);
    rebuildBindGroups();
  }

  function rebuildBindGroups() {
    bgRayTrace = device.createBindGroup({
      layout: pipeRayTrace.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: accumTex.createView() },
        { binding: 1, resource: rawTex.createView() },
        { binding: 2, resource: gbufNormalTex.createView() },
        { binding: 3, resource: gbufDepthTex.createView() },
        { binding: 4, resource: { buffer: uniformBuffer } },
      ]
    });
    
    bgDenoiseA = device.createBindGroup({
      layout: pipeDenoise.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: rawTex.createView() },
        { binding: 1, resource: gbufNormalTex.createView() },
        { binding: 2, resource: gbufDepthTex.createView() },
        { binding: 3, resource: denoiseTex.createView() },
        { binding: 4, resource: { buffer: uniformBuffer } },
      ]
    });
    
    bgDenoiseB = device.createBindGroup({
      layout: pipeDenoise.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: denoiseTex.createView() },
        { binding: 1, resource: gbufNormalTex.createView() },
        { binding: 2, resource: gbufDepthTex.createView() },
        { binding: 3, resource: rawTex.createView() },
        { binding: 4, resource: { buffer: uniformBuffer } },
      ]
    });
    
    bgComposite = device.createBindGroup({
      layout: pipeComposite.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: (denoiseOn ? denoiseTex : accumTex).createView() }
      ]
    });
  }

  // ── WGSL Shader Code ───────────────────────────────────────────────────────
  const WGSL = {
    // ── RAY TRACING COMPUTE SHADER ─────────────────────────────────────────
    rayTrace: /* wgsl */`
      struct Uniforms {
        resX: f32, resY: f32, frame: f32, maxSteps: f32,
        time: f32, denoise: f32, _pad0: f32, _pad1: f32,
        
        camPos: vec4<f32>,
        camFwd: vec4<f32>, 
        camRight: vec4<f32>,
        camUp: vec4<f32>,
        
        sensor: vec4<f32>, // width, height, near, far
        matTune: vec4<f32>, // metalRoughness, glassIOR, pad, pad
      };

      @group(0) @binding(0) var accumTex: texture_storage_2d<rgba16float, read_write>;
      @group(0) @binding(1) var rawTex: texture_storage_2d<rgba16float, write>;
      @group(0) @binding(2) var gbufNormal: texture_storage_2d<rgba16float, write>;
      @group(0) @binding(3) var gbufDepth: texture_storage_2d<r32float, write>;
      @group(0) @binding(4) var<uniform> u: Uniforms;

      // ── RNG ────────────────────────────────────────────────────────────────
      fn hash12(p: vec2<f32>) -> f32 {
        let h = dot(p, vec2<f32>(127.1, 311.7));
        return fract(sin(h) * 43758.5453);
      }
      
      fn rng(seed: vec2<f32>) -> f32 {
        return hash12(seed + vec2<f32>(u.frame, u.time));
      }

      // ── SCENE SDF (Cornell Box) ────────────────────────────────────────────
      fn sdBox(p: vec3<f32>, b: vec3<f32>) -> f32 {
        let q = abs(p) - b;
        return length(max(q, vec3<f32>(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0);
      }
      
      fn sdSphere(p: vec3<f32>, r: f32) -> f32 {
        return length(p) - r;
      }

      struct Hit {
        t: f32,
        matId: i32,
      };

      fn mapScene(p: vec3<f32>) -> Hit {
        // Cornell Box - open room (no front wall)
        let roomCenter = vec3<f32>(0.0, 1.0, 0.0);
        let roomHalf = vec3<f32>(1.0, 1.0, 1.0);
        
        // Individual walls (not a closed box)
        let backWall = sdBox(p - vec3<f32>(0.0, 1.0, -1.0), vec3<f32>(1.0, 1.0, 0.02)); // Back wall
        let leftWall = sdBox(p - vec3<f32>(-1.0, 1.0, 0.0), vec3<f32>(0.02, 1.0, 1.0)); // Left wall
        let rightWall = sdBox(p - vec3<f32>(1.0, 1.0, 0.0), vec3<f32>(0.02, 1.0, 1.0));  // Right wall
        let floor = sdBox(p - vec3<f32>(0.0, 0.0, 0.0), vec3<f32>(1.0, 0.02, 1.0));      // Floor
        let ceiling = sdBox(p - vec3<f32>(0.0, 2.0, 0.0), vec3<f32>(1.0, 0.02, 1.0));    // Ceiling
        
        // Combine walls
        let room = min(backWall, min(leftWall, min(rightWall, min(floor, ceiling))));
        
        var hit = Hit(room, 0); // material 0 = diffuse walls
        
        // Metal sphere
        let spherePos = vec3<f32>(-0.4, 0.4, 0.1);   // On the floor, left side
        let sphere = sdSphere(p - spherePos, 0.35);
        if (sphere < hit.t) {
          hit = Hit(sphere, 1); // material 1 = metal
        }
        
        // Glass box  
        let boxPos = vec3<f32>(0.4, 0.3, -0.2);      // On the floor, right side
        let box = sdBox(p - boxPos, vec3<f32>(0.3, 0.3, 0.3));
        if (box < hit.t) {
          hit = Hit(box, 2); // material 2 = glass
        }
        
        return hit;
      }

      fn calcNormal(p: vec3<f32>) -> vec3<f32> {
        let eps = 0.002;
        let h = vec2<f32>(eps, 0.0);
        return normalize(vec3<f32>(
          mapScene(p + h.xyy).t - mapScene(p - h.xyy).t,
          mapScene(p + h.yxy).t - mapScene(p - h.yxy).t,
          mapScene(p + h.yyx).t - mapScene(p - h.yyx).t
        ));
      }

      // ── RAY MARCHING ───────────────────────────────────────────────────────
      fn raymarch(ro: vec3<f32>, rd: vec3<f32>, maxT: f32) -> Hit {
        var t = 0.0;
        var matId = -1;
        
        for (var i = 0; i < 128; i++) {
          let p = ro + rd * t;
          let hit = mapScene(p);
          
          if (hit.t < 0.001) {
            matId = hit.matId;
            break;
          }
          
          t += hit.t * 0.9;
          
          if (t > maxT) {
            break;
          }
        }
        
        return Hit(t, matId);
      }

      // ── MATERIAL SAMPLING ──────────────────────────────────────────────────
      fn cosineHemisphere(n: vec3<f32>, u: vec2<f32>) -> vec3<f32> {
        let phi = 6.28318531 * u.x;
        let cosTheta = sqrt(u.y);
        let sinTheta = sqrt(1.0 - cosTheta * cosTheta);
        
        let x = sinTheta * cos(phi);
        let y = sinTheta * sin(phi);
        let z = cosTheta;
        
        // Build orthonormal basis
        let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(n.y) > 0.999);
        let tangent = normalize(cross(up, n));
        let bitangent = cross(n, tangent);
        
        return normalize(tangent * x + bitangent * y + n * z);
      }
      
      fn reflect(v: vec3<f32>, n: vec3<f32>) -> vec3<f32> {
        return v - 2.0 * dot(v, n) * n;
      }
      
      fn refract(v: vec3<f32>, n: vec3<f32>, eta: f32) -> vec3<f32> {
        let cosI = -dot(n, v);
        let sinT2 = eta * eta * (1.0 - cosI * cosI);
        if (sinT2 > 1.0) { return vec3<f32>(0.0); } // Total internal reflection
        let cosT = sqrt(1.0 - sinT2);
        return eta * v + (eta * cosI - cosT) * n;
      }
      
      fn schlick(cosine: f32, ri: f32) -> f32 {
        let r0 = (1.0 - ri) / (1.0 + ri);
        let r0_sq = r0 * r0;
        return r0_sq + (1.0 - r0_sq) * pow(1.0 - cosine, 5.0);
      }

      // ── AREA LIGHT ─────────────────────────────────────────────────────────
      struct AreaLight {
        pos: vec3<f32>,
        u: vec3<f32>,
        v: vec3<f32>,
        emission: vec3<f32>,
      };
      
      fn getAreaLight() -> AreaLight {
        let center = vec3<f32>(0.0, 1.98, 0.0);  // Just below ceiling
        let u = vec3<f32>(0.4, 0.0, 0.0);       // Slightly smaller light
        let v = vec3<f32>(0.0, 0.0, 0.3);
        return AreaLight(
          center - u * 0.5 - v * 0.5,
          u, v,
          vec3<f32>(30.0, 28.0, 25.0)  // Even brighter for visibility
        );
      }

      // ── PATH TRACING MAIN ──────────────────────────────────────────────────
      @compute @workgroup_size(8, 8, 1)
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        if (gid.x >= u32(u.resX) || gid.y >= u32(u.resY)) { return; }
        
        let coord = vec2<f32>(f32(gid.x), f32(gid.y));
        let res = vec2<f32>(u.resX, u.resY);
        
        // ── Camera Ray Generation ─────────────────────────────────────────────
        let uv = (coord + vec2<f32>(0.5)) / res;
        
        // DEBUG: Simple test pattern to verify output
        if (u.frame < 10) {
          let testColor = vec3<f32>(uv.x, uv.y, 0.5);
          textureStore(accumTex, vec2<i32>(i32(gid.x), i32(gid.y)), vec4<f32>(testColor, 1.0));
          textureStore(rawTex, vec2<i32>(i32(gid.x), i32(gid.y)), vec4<f32>(testColor, 1.0));
          return;
        }
        
        let screenX = (uv.x - 0.5) * u.sensor.x;
        let screenY = (uv.y - 0.5) * u.sensor.y;
        
        // Anti-aliasing jitter
        let jitter = vec2<f32>(rng(coord), rng(coord.yx)) - 0.5;
        let jitteredX = screenX + jitter.x / res.x * u.sensor.x;
        let jitteredY = screenY + jitter.y / res.y * u.sensor.y;
        
        var rayOrigin = u.camPos.xyz;
        var rayDir = normalize(
          u.camFwd.xyz + 
          u.camRight.xyz * jitteredX + 
          u.camUp.xyz * jitteredY
        );
        
        // ── Path Tracing Loop ─────────────────────────────────────────────────
        var radiance = vec3<f32>(0.0);
        var throughput = vec3<f32>(1.0);
        var firstHitNormal = vec3<f32>(0.0);
        var firstHitDepth = 0.0;
        
        let light = getAreaLight();
        
        for (var bounce = 0; bounce < 4; bounce++) {
          let hit = raymarch(rayOrigin, rayDir, 50.0);
          
          if (hit.matId < 0 || hit.t > 49.0) {
            // Hit sky/background - add some environment lighting
            radiance += throughput * vec3<f32>(0.3, 0.4, 0.5); // Much brighter environment
            break;
          }
          
          let hitPos = rayOrigin + rayDir * hit.t;
          let normal = calcNormal(hitPos);
          
          // Store first hit for G-buffer
          if (bounce == 0) {
            firstHitNormal = normal;
            firstHitDepth = hit.t;
          }
          
          // ── Direct Lighting (Next Event Estimation) ─────────────────────────
          let lightSample = vec2<f32>(rng(coord + f32(bounce) * 10.0), rng(coord + f32(bounce) * 20.0));
          let lightPoint = light.pos + light.u * lightSample.x + light.v * lightSample.y;
          let lightDir = normalize(lightPoint - hitPos);
          let lightDist = length(lightPoint - hitPos);
          
          // Shadow ray
          let shadowHit = raymarch(hitPos + normal * 0.001, lightDir, lightDist - 0.001);
          
          if (shadowHit.t >= lightDist - 0.002) {
            // Light is visible
            let cosTheta = max(dot(normal, lightDir), 0.0);
            let lightNormal = vec3<f32>(0.0, -1.0, 0.0); // Light faces down
            let cosAlpha = max(dot(-lightDir, lightNormal), 0.0);
            
            if (cosAlpha > 0.0) {
              let lightArea = length(cross(light.u, light.v));
              let solidAngle = (cosTheta * cosAlpha * lightArea) / (lightDist * lightDist);
              
              // Material response for direct lighting
              var brdf = vec3<f32>(0.0);
              if (hit.matId == 0) {
                // Diffuse walls - brighter albedos for better visibility
                let albedo = select(
                  select(vec3<f32>(0.8, 0.8, 0.8), vec3<f32>(0.8, 0.15, 0.15), hitPos.x < -1.0),
                  vec3<f32>(0.15, 0.6, 0.15), hitPos.x > 1.0
                );
                brdf = albedo / 3.14159265;
              } else if (hit.matId == 1) {
                // Metal - perfect mirror for direct lighting
                brdf = vec3<f32>(0.9, 0.9, 0.95);
              }
              // Glass contributes minimal direct lighting
              
              radiance += throughput * light.emission * brdf * solidAngle;
            }
          }
          
          // ── Material Scattering ─────────────────────────────────────────────
          let rand1 = rng(coord + f32(bounce) * 30.0);
          let rand2 = rng(coord + f32(bounce) * 40.0);
          
          if (hit.matId == 0) {
            // Diffuse material - brighter albedos for better visibility
            let albedo = select(
              select(vec3<f32>(0.8, 0.8, 0.8), vec3<f32>(0.8, 0.15, 0.15), hitPos.x < -1.0),
              vec3<f32>(0.15, 0.6, 0.15), hitPos.x > 1.0
            );
            
            throughput *= albedo;
            rayDir = cosineHemisphere(normal, vec2<f32>(rand1, rand2));
            rayOrigin = hitPos + normal * 0.001;
            
          } else if (hit.matId == 1) {
            // Metal material
            let roughness = u.matTune.x;
            let reflectedDir = reflect(rayDir, normal);
            
            // Add roughness
            let roughDir = cosineHemisphere(reflectedDir, vec2<f32>(rand1, rand2));
            rayDir = normalize(mix(reflectedDir, roughDir, roughness));
            rayOrigin = hitPos + rayDir * 0.001;
            
            throughput *= vec3<f32>(0.9, 0.9, 0.95);
            
          } else if (hit.matId == 2) {
            // Glass material
            let ior = u.matTune.y;
            let cosI = -dot(rayDir, normal);
            
            var etaI = 1.0;
            var etaT = ior;
            var n = normal;
            
            if (cosI < 0.0) {
              // Ray is inside glass
              etaI = ior;
              etaT = 1.0;
              n = -normal;
              cosI = -cosI;
            }
            
            let eta = etaI / etaT;
            let reflectance = schlick(abs(cosI), ior);
            
            if (rand1 < reflectance) {
              // Reflection
              rayDir = reflect(rayDir, n);
            } else {
              // Refraction
              rayDir = refract(rayDir, n, eta);
              if (length(rayDir) == 0.0) {
                // Total internal reflection fallback
                rayDir = reflect(rayDir, n);
              }
            }
            
            rayOrigin = hitPos + rayDir * 0.001;
            throughput *= vec3<f32>(0.98, 0.98, 0.98);
          }
          
          // Russian roulette termination
          let maxThroughput = max(throughput.x, max(throughput.y, throughput.z));
          if (bounce > 2 && rand1 > maxThroughput) {
            break;
          }
          
          if (bounce > 2) {
            throughput /= maxThroughput;
          }
        }
        
        // ── Output Results ─────────────────────────────────────────────────────
        let pixelCoord = vec2<i32>(i32(gid.x), i32(gid.y));
        
        // Store raw sample
        textureStore(rawTex, pixelCoord, vec4<f32>(radiance, 1.0));
        
        // Store G-buffer
        textureStore(gbufNormal, pixelCoord, vec4<f32>(firstHitNormal * 0.5 + 0.5, 1.0));
        textureStore(gbufDepth, pixelCoord, vec4<f32>(firstHitDepth, 0.0, 0.0, 0.0));
        
        // Accumulate progressive average
        let prevAccum = textureLoad(accumTex, pixelCoord, 0);
        let frameCount = max(u.frame, 1.0);
        let newAccum = (prevAccum.rgb * (frameCount - 1.0) + radiance) / frameCount;
        textureStore(accumTex, pixelCoord, vec4<f32>(newAccum, 1.0));
      }
    `,

    // ── SVGF-LITE DENOISER ─────────────────────────────────────────────────
    denoise: /* wgsl */`
      struct Uniforms {
        resX: f32, resY: f32, frame: f32, maxSteps: f32,
        time: f32, denoise: f32, _pad0: f32, _pad1: f32,
        
        camPos: vec4<f32>,
        camFwd: vec4<f32>,
        camRight: vec4<f32>, 
        camUp: vec4<f32>,
        
        sensor: vec4<f32>,
        matTune: vec4<f32>,
      };

      @group(0) @binding(0) var inColor: texture_2d<f32>;
      @group(0) @binding(1) var inNormal: texture_2d<f32>;
      @group(0) @binding(2) var inDepth: texture_2d<f32>;
      @group(0) @binding(3) var outColor: texture_storage_2d<rgba16float, write>;
      @group(0) @binding(4) var<uniform> u: Uniforms;

      @compute @workgroup_size(8, 8, 1)
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        if (gid.x >= u32(u.resX) || gid.y >= u32(u.resY)) { return; }
        
        let coord = vec2<i32>(i32(gid.x), i32(gid.y));
        let centerColor = textureLoad(inColor, coord, 0).rgb;
        let centerNormal = textureLoad(inNormal, coord, 0).rgb * 2.0 - 1.0;
        let centerDepth = textureLoad(inDepth, coord, 0).r;
        
        // Joint-bilateral filter with 3x3 kernel
        var weightedSum = vec3<f32>(0.0);
        var weightSum = 0.0;
        
        for (var dy = -1; dy <= 1; dy++) {
          for (var dx = -1; dx <= 1; dx++) {
            let sampleCoord = coord + vec2<i32>(dx, dy);
            let sampleColor = textureLoad(inColor, sampleCoord, 0).rgb;
            let sampleNormal = textureLoad(inNormal, sampleCoord, 0).rgb * 2.0 - 1.0;
            let sampleDepth = textureLoad(inDepth, sampleCoord, 0).r;
            
            // Normal similarity
            let normalWeight = pow(max(dot(centerNormal, sampleNormal), 0.0), 32.0);
            
            // Depth similarity  
            let depthWeight = exp(-abs(centerDepth - sampleDepth) * 2.0);
            
            // Color similarity
            let colorWeight = exp(-length(centerColor - sampleColor) * 1.5);
            
            // Spatial weight (Gaussian)
            let spatialWeight = exp(-0.5 * f32(dx * dx + dy * dy));
            
            let weight = normalWeight * depthWeight * colorWeight * spatialWeight;
            
            weightedSum += sampleColor * weight;
            weightSum += weight;
          }
        }
        
        let denoisedColor = weightedSum / max(weightSum, 1e-6);
        textureStore(outColor, coord, vec4<f32>(denoisedColor, 1.0));
      }
    `,

    // ── COMPOSITE VERTEX SHADER ─────────────────────────────────────────────
    compositeVS: /* wgsl */`
      @vertex
      fn main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
        // Full-screen triangle
        var pos = array<vec2<f32>, 3>(
          vec2<f32>(-1.0, -1.0),
          vec2<f32>( 3.0, -1.0), 
          vec2<f32>(-1.0,  3.0)
        );
        return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
      }
    `,

    // ── COMPOSITE FRAGMENT SHADER ──────────────────────────────────────────
    compositeFS: /* wgsl */`
      @group(0) @binding(0) var inputTexture: texture_2d<f32>;

      // ACES Tonemapping
      fn aces(x: vec3<f32>) -> vec3<f32> {
        let a = 2.51;
        let b = 0.03;
        let c = 2.43;
        let d = 0.59;
        let e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
      }

      @fragment  
      fn main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
        let coord = vec2<i32>(i32(fragCoord.x), i32(fragCoord.y));
        let hdrColor = textureLoad(inputTexture, coord, 0).rgb;
        
        // ACES tonemapping + gamma correction
        let tonemapped = aces(hdrColor * 1.0);
        let gamma = pow(tonemapped, vec3<f32>(1.0 / 2.2));
        
        return vec4<f32>(gamma, 1.0);
      }
    `
  };

  // ── Interaction Handlers ────────────────────────────────────────────────────
  function setupInteraction(canvas: HTMLCanvasElement) {
    let dragging = false;
    let lastX = 0, lastY = 0;

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseUp = () => {
      dragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      
      yaw += dx * 0.005;
      pitch = Math.max(-1.2, Math.min(1.2, pitch + dy * 0.004));
      
      lastX = e.clientX;
      lastY = e.clientY;
      
      // Reset accumulation when camera moves
      sampleCount = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.08 : 1/1.08;
      dist = Math.max(1.6, Math.min(8.0, dist * factor));
      sampleCount = 0; // Reset accumulation
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("wheel", onWheel);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("wheel", onWheel);
    };
  }

  // ── Main Engine API ─────────────────────────────────────────────────────────
  return {
    async mount(hostElement: HTMLDivElement) {
      try {
        // Request WebGPU adapter and device
        adapter = await (navigator as any).gpu.requestAdapter();
        if (!adapter) throw new Error("WebGPU adapter not available");
        
        device = await adapter.requestDevice();
        if (!device) throw new Error("WebGPU device creation failed");
        
        // Create canvas and context
        canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        
        hostElement.appendChild(canvas);
        
        context = canvas.getContext("webgpu")!;
        format = (navigator as any).gpu.getPreferredCanvasFormat();
        
        context.configure({
          device,
          format,
          alphaMode: "opaque",
        });
        
        // Create uniform buffer
        uniformBuffer = device.createBuffer({
          size: 256, // 64 floats * 4 bytes
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        
        // Create compute pipelines
        pipeRayTrace = device.createComputePipeline({
          layout: "auto",
          compute: {
            module: device.createShaderModule({ code: WGSL.rayTrace }),
            entryPoint: "main",
          },
        });
        
        pipeDenoise = device.createComputePipeline({
          layout: "auto", 
          compute: {
            module: device.createShaderModule({ code: WGSL.denoise }),
            entryPoint: "main",
          },
        });
        
        // Create render pipeline
        pipeComposite = device.createRenderPipeline({
          layout: "auto",
          vertex: {
            module: device.createShaderModule({ code: WGSL.compositeVS }),
            entryPoint: "main",
          },
          fragment: {
            module: device.createShaderModule({ code: WGSL.compositeFS }),
            entryPoint: "main",
            targets: [{ format }],
          },
          primitive: {
            topology: "triangle-list",
          },
        });
        
        // Setup resize observer
        const resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          const { width, height } = entry.contentRect;
          
          canvas.width = Math.floor(width * DPR);
          canvas.height = Math.floor(height * DPR);
          
          reallocateRenderTargets(width, height);
        });
        resizeObserver.observe(hostElement);
        
        // Setup interaction
        const cleanupInteraction = setupInteraction(canvas);
        
        // Auto-pause on visibility change
        const onVisibilityChange = () => {
          if (document.hidden) {
            paused = true;
          }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        
        // Main render loop
        let lastTime = performance.now();
        
        const renderLoop = () => {
          const now = performance.now();
          const dt = Math.min((now - lastTime) / 1000, 0.1);
          lastTime = now;
          
          time += dt;
          
          if (!paused && canvas.width > 0 && canvas.height > 0) {
            const renderWidth = Math.floor(canvas.width / DPR * qualityLadder[qualityIndex].scale);
            const renderHeight = Math.floor(canvas.height / DPR * qualityLadder[qualityIndex].scale);
            
            updateUniforms(renderWidth, renderHeight);
            
            const encoder = device.createCommandEncoder();
            
            // Ray tracing pass
            const rayPass = encoder.beginComputePass();
            rayPass.setPipeline(pipeRayTrace);
            rayPass.setBindGroup(0, bgRayTrace);
            rayPass.dispatchWorkgroups(
              Math.ceil(renderWidth / 8),
              Math.ceil(renderHeight / 8)
            );
            rayPass.end();
            
            // Denoising passes (ping-pong)
            if (denoiseOn) {
              const denoisePass1 = encoder.beginComputePass();
              denoisePass1.setPipeline(pipeDenoise);
              denoisePass1.setBindGroup(0, bgDenoiseA);
              denoisePass1.dispatchWorkgroups(
                Math.ceil(renderWidth / 8),
                Math.ceil(renderHeight / 8)
              );
              denoisePass1.end();
              
              const denoisePass2 = encoder.beginComputePass();
              denoisePass2.setPipeline(pipeDenoise);
              denoisePass2.setBindGroup(0, bgDenoiseB);
              denoisePass2.dispatchWorkgroups(
                Math.ceil(renderWidth / 8),
                Math.ceil(renderHeight / 8)
              );
              denoisePass2.end();
            }
            
            // Composite pass
            const renderPassEncoder = encoder.beginRenderPass({
              colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
                loadOp: "clear",
                storeOp: "store",
              }],
            });
            
            renderPassEncoder.setPipeline(pipeComposite);
            renderPassEncoder.setBindGroup(0, bgComposite);
            renderPassEncoder.draw(3); // Full-screen triangle
            renderPassEncoder.end();
            
            device.queue.submit([encoder.finish()]);
            sampleCount++;
          }
          
          requestAnimationFrame(renderLoop);
        };
        
        renderLoop();
        
      } catch (error) {
        console.error("WebGPU Path Tracer mount failed:", error);
        throw error;
      }
    },

    unmount() {
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      
      // Cleanup GPU resources
      [accumTex, rawTex, denoiseTex, gbufNormalTex, gbufDepthTex].forEach(tex => tex?.destroy?.());
      uniformBuffer?.destroy?.();
    },

    setPaused(p: boolean) {
      paused = p;
    },

    setQuality(idx: number | ((q: number) => number)) {
      const prevIndex = qualityIndex;
      
      if (typeof idx === "function") {
        qualityIndex = Math.max(0, Math.min(qualityLadder.length - 1, idx(qualityIndex)));
      } else {
        qualityIndex = Math.max(0, Math.min(qualityLadder.length - 1, idx));
      }
      
      if (qualityIndex !== prevIndex && canvas) {
        reallocateRenderTargets(canvas.clientWidth, canvas.clientHeight);
      }
    },

    setPreset(id: number) {
      preset = id;
      // Could modify scene parameters here for different presets
      sampleCount = 0; // Reset accumulation
    },

    toggleDenoise() {
      denoiseOn = !denoiseOn;
      sampleCount = 0; // Reset accumulation
      if (bgComposite) {
        // Rebuild composite bind group with new input texture
        bgComposite = device.createBindGroup({
          layout: pipeComposite.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: (denoiseOn ? denoiseTex : accumTex).createView() }
          ]
        });
      }
    },
  };
}
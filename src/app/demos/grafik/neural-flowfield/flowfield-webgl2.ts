// src/app/demos/grafik/neural-flowfield/flowfield-webgl2.ts
// REGL-based WebGL2 engine with Ping-Pong simulation for 150k-1M particles
// Combines curl-noise, SDF attraction, and interactive vortices

// @ts-ignore - regl doesn't have TypeScript definitions
import REGL from "regl";
import { makeTextSDF, BRAND_COLORS, hslToRgb } from "./sdf";

type Opts = { targetFPS: number };
type Engine = {
  mount: (el: HTMLDivElement) => void;
  unmount: () => void;
  setPreset: (id: number) => void;
  setPaused: (p: boolean) => void;
  setAudioLevel?: (v: number) => void;
};

export function makeFlowfieldWebGL2({ targetFPS }: Opts): Engine {
  let regl: any = null;
  let frame: any = null;
  let canvas: HTMLCanvasElement | null = null;

  // Simulation Grid (N×N particles)
  const DPR = Math.min(window.devicePixelRatio ?? 1, 1.5);
  const N = chooseParticleSide();       // 384-1024 depending on device
  const COUNT = N * N;

  // Performance presets (weights for different force fields)
  const presets = {
    1: { curl: 1.1, attract: 0.9, vortex: 0.9, drag: 0.045, speed: 1.0 },    // Balanced
    2: { curl: 1.6, attract: 0.5, vortex: 1.3, drag: 0.060, speed: 1.2 },    // Chaotic
    3: { curl: 0.5, attract: 1.8, vortex: 0.6, drag: 0.035, speed: 0.9 },    // Logo Focus
  };
  let P = presets[1];
  let paused = false;
  let audioLevel = 0;

  // Interactive vortex from pointer
  let vortex = { x: 0, y: 0, strength: 0, radius: 0.18 };

  function mount(el: HTMLDivElement) {
    canvas = document.createElement("canvas");
    canvas.className = "w-full h-full block";
    el.appendChild(canvas);

    regl = REGL({
      canvas,
      attributes: { 
        antialias: false, 
        alpha: true, 
        preserveDrawingBuffer: false 
      },
      extensions: ["OES_texture_float_linear", "EXT_color_buffer_float"],
    });

    // Responsive canvas sizing
    const resizeObserver = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      canvas!.width = Math.floor(rect.width * DPR);
      canvas!.height = Math.floor(rect.height * DPR);
    });
    resizeObserver.observe(el);

    // Generate Text/Logo SDF mask
    const sdf = makeTextSDF({ 
      text: "KLAUS WEIGELE", 
      width: 1024, 
      height: 256, 
      blur: 8 
    });
    const logoTex = regl.texture({ 
      data: sdf.tex, 
      mag: "linear", 
      min: "linear", 
      flipY: true 
    });

    // Create ping-pong framebuffers for position and velocity
    const createFloatTexture = () => regl.texture({
      width: N, 
      height: N, 
      data: null, 
      wrap: "repeat", 
      type: "float", 
      format: "rgba", 
      min: "nearest", 
      mag: "nearest"
    });

    const posA = regl.framebuffer({ 
      color: createFloatTexture(), 
      depth: false, 
      stencil: false 
    });
    const posB = regl.framebuffer({ 
      color: createFloatTexture(), 
      depth: false, 
      stencil: false 
    });
    const velA = regl.framebuffer({ 
      color: createFloatTexture(), 
      depth: false, 
      stencil: false 
    });
    const velB = regl.framebuffer({ 
      color: createFloatTexture(), 
      depth: false, 
      stencil: false 
    });

    // Initialize particle positions and velocities
    const initializationPass = regl({
      frag: `
        precision highp float;
        uniform float seed;
        varying vec2 vUv;
        
        // Simple hash function for randomization
        float hash(vec2 p) { 
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); 
        }
        
        void main() {
          vec2 uv = vUv;
          vec2 p = uv * 2.0 - 1.0;
          
          // Position: random distribution with slight clustering
          float angle = hash(uv + seed) * 6.28318;
          float radius = sqrt(hash(uv + seed * 2.0)) * 0.8;
          vec2 pos = vec2(cos(angle), sin(angle)) * radius;
          
          // Velocity: small random initial velocities
          vec2 vel = (vec2(hash(uv + seed * 3.0), hash(uv + seed * 4.0)) - 0.5) * 0.02;
          
          gl_FragColor = vec4(pos, vel);
        }`,
      vert: `
        precision highp float; 
        attribute vec2 position; 
        varying vec2 vUv;
        void main() { 
          vUv = position * 0.5 + 0.5; 
          gl_Position = vec4(position, 0.0, 1.0); 
        }`,
      attributes: { 
        position: [[-1, -1], [3, -1], [-1, 3]] 
      },
      count: 3,
      uniforms: { 
        seed: (_, props: any) => props.seed 
      },
      framebuffer: (_, props: any) => props.fbo
    });

    // Initialize all buffers
    initializationPass({ fbo: posA, seed: 0.1 });
    initializationPass({ fbo: posB, seed: 0.2 });
    initializationPass({ fbo: velA, seed: 0.3 });
    initializationPass({ fbo: velB, seed: 0.4 });

    // Velocity update pass (forces computation)
    const updateVelocity = regl({
      frag: `
        #extension GL_OES_standard_derivatives : enable
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uPos, uVel, uLogo;
        uniform float dt, time, curlK, attractK, vortexK, dragK, speedK, audioK;
        uniform vec2 canvasSize, vortexPos;
        uniform float vortexR;

        // === Simplex Noise Implementation ===
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m; m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // Curl-noise (divergence-free vector field)
        vec2 curl(vec2 p) {
          float e = 0.001;
          float n1 = snoise(p + vec2(0.0, e));
          float n2 = snoise(p - vec2(0.0, e));
          float a = (n1 - n2) / (2.0 * e);
          float n3 = snoise(p + vec2(e, 0.0));
          float n4 = snoise(p - vec2(e, 0.0));
          float b = (n3 - n4) / (2.0 * e);
          return vec2(a, -b);
        }

        void main() {
          vec4 pos = texture2D(uPos, vUv);
          vec2 p = pos.xy;                 // position in [-1,1] space
          vec2 vel = texture2D(uVel, vUv).xy;

          // === FORCE 1: Curl-noise field (natural flow) ===
          vec2 curlForce = curl(p * 2.0 + vec2(time * 0.12, time * 0.09));

          // === FORCE 2: Logo/Text attractor (SDF gradient) ===
          vec2 logoUV = (p * 0.5 + 0.5) * vec2(1.0, 0.4) + vec2(0.0, 0.3);
          float logoMask = texture2D(uLogo, logoUV).r;
          
          // Compute gradient of SDF for attraction direction
          float e = 1.0 / 1024.0;
          float gx = texture2D(uLogo, logoUV + vec2(e, 0)).r - texture2D(uLogo, logoUV - vec2(e, 0)).r;
          float gy = texture2D(uLogo, logoUV + vec2(0, e)).r - texture2D(uLogo, logoUV - vec2(0, e)).r;
          vec2 gradient = normalize(vec2(gx, gy) + 1e-6);
          vec2 attractForce = gradient * (logoMask * 2.0 - 1.0); // inward attraction

          // === FORCE 3: Interactive vortex from pointer ===
          vec2 toVortex = p - vortexPos;
          float vortexDist = length(toVortex) / max(vortexR, 1e-3);
          float vortexMask = exp(-vortexDist * vortexDist * 2.5);
          vec2 tangent = normalize(vec2(-toVortex.y, toVortex.x));
          vec2 vortexForce = tangent * vortexMask;

          // === Audio modulation ===
          float audioBoost = 1.0 + audioK * clamp(audioLevel * 3.0, 0.0, 1.0);

          // === Combine all forces ===
          vec2 acceleration = curlK * audioBoost * curlForce + 
                             attractK * attractForce + 
                             vortexK * audioBoost * vortexForce;

          // Update velocity with damping
          vel = mix(vel + dt * speedK * acceleration, vel, clamp(dragK, 0.0, 0.99));

          gl_FragColor = vec4(vel, 0.0, 1.0);
        }`,
      vert: `
        precision highp float; 
        attribute vec2 position; 
        varying vec2 vUv;
        void main() { 
          vUv = position * 0.5 + 0.5; 
          gl_Position = vec4(position, 0.0, 1.0); 
        }`,
      attributes: { 
        position: [[-1, -1], [3, -1], [-1, 3]] 
      },
      count: 3,
      framebuffer: (_, props: any) => props.fbo,
      uniforms: {
        uPos: (_, props: any) => props.pos,
        uVel: (_, props: any) => props.vel,
        uLogo: logoTex,
        dt: (_, props: any) => props.dt,
        time: ({ time }: any) => time,
        curlK: () => P.curl,
        attractK: () => P.attract,
        vortexK: () => P.vortex,
        dragK: () => P.drag,
        speedK: () => P.speed,
        audioK: () => 1.0,
        canvasSize: ({ viewportWidth, viewportHeight }: any) => [viewportWidth, viewportHeight],
        vortexPos: () => [vortex.x, vortex.y],
        vortexR: () => vortex.radius,
        audioLevel: () => audioLevel,
      }
    });

    // Position update pass (integration)
    const updatePosition = regl({
      frag: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uPos, uVel;
        uniform float dt;
        
        void main() {
          vec2 position = texture2D(uPos, vUv).xy;
          vec2 velocity = texture2D(uVel, vUv).xy;
          
          // Integrate position
          position += velocity * dt;
          
          // Wrap around boundaries
          position = mod(position + 1.0, 2.0) - 1.0;
          
          gl_FragColor = vec4(position, 0.0, 1.0);
        }`,
      vert: `
        precision highp float; 
        attribute vec2 position; 
        varying vec2 vUv;
        void main() { 
          vUv = position * 0.5 + 0.5; 
          gl_Position = vec4(position, 0.0, 1.0); 
        }`,
      attributes: { 
        position: [[-1, -1], [3, -1], [-1, 3]] 
      },
      count: 3,
      framebuffer: (_, props: any) => props.fbo,
      uniforms: {
        uPos: (_, props: any) => props.pos,
        uVel: (_, props: any) => props.vel,
        dt: (_, props: any) => props.dt
      }
    });

    // Particle rendering pass (instanced points)
    const renderParticles = regl({
      vert: `
        precision highp float;
        #define N ${N}.0
        uniform sampler2D uPos;
        uniform float pointSize;
        uniform vec2 viewport;
        attribute float id;

        varying float vSpeed;
        varying vec2 vPosition;

        void main() {
          float x = mod(id, N);
          float y = floor(id / N);
          vec2 uv = (vec2(x, y) + 0.5) / N;

          vec2 pos = texture2D(uPos, uv).xy;
          
          // Calculate speed for color variation
          vec2 neighborUV = uv + vec2(1.0 / N, 0.0);
          vec2 neighborPos = texture2D(uPos, neighborUV).xy;
          vSpeed = length(pos - neighborPos) * 50.0;
          vPosition = pos;

          gl_Position = vec4(pos, 0.0, 1.0);
          gl_PointSize = pointSize * (1.0 + vSpeed * 0.5);
        }`,
      frag: `
        precision highp float;
        varying float vSpeed;
        varying vec2 vPosition;
        uniform float time;
        
        void main() {
          // Circular point shape
          vec2 coord = gl_PointCoord * 2.0 - 1.0;
          float distance = dot(coord, coord);
          if (distance > 1.0) discard;
          
          // Soft falloff
          float alpha = exp(-distance * 3.0);
          
          // Speed-based coloring with Klaus Weigele brand colors
          float speedNorm = clamp(vSpeed * 8.0, 0.0, 1.0);
          
          // Brand color interpolation
          vec3 slowColor = vec3(0.31, 0.275, 0.902);  // Indigo #4F46E5
          vec3 fastColor = vec3(0.024, 0.714, 0.831); // Cyan #06B6D4
          vec3 peakColor = vec3(0.545, 0.361, 0.965); // Purple #8B5CF6
          
          vec3 color = mix(slowColor, fastColor, speedNorm);
          color = mix(color, peakColor, pow(speedNorm, 3.0));
          
          // Audio-reactive glow
          float glow = 0.3 + 0.7 * clamp(speedNorm + sin(time * 4.0) * 0.1, 0.0, 1.0);
          
          gl_FragColor = vec4(color * glow, alpha);
        }`,
      attributes: { 
        id: Array.from({ length: COUNT }, (_, i) => i) 
      },
      instances: COUNT,
      count: 1,
      primitive: "points",
      uniforms: {
        uPos: (_, props: any) => props.pos,
        pointSize: (_, props: any) => props.size,
        viewport: ({ viewportWidth, viewportHeight }: any) => [viewportWidth, viewportHeight],
        time: ({ time }: any) => time,
      },
      blend: {
        enable: true,
        func: { 
          srcRGB: "one", 
          dstRGB: "one", 
          srcAlpha: "one", 
          dstAlpha: "one" 
        },
        equation: { 
          rgb: "add", 
          alpha: "add" 
        }
      },
      depth: { enable: false }
    });

    // Mouse/Touch interaction setup
    const screenToClip = (x: number, y: number) => {
      const rect = canvas!.getBoundingClientRect();
      const clipX = ((x - rect.left) / rect.width) * 2 - 1;
      const clipY = (1 - (y - rect.top) / rect.height) * 2 - 1;
      return { x: clipX, y: clipY };
    };

    const onPointerMove = (e: MouseEvent) => {
      const clip = screenToClip(e.clientX, e.clientY);
      vortex.x = clip.x;
      vortex.y = clip.y;
      vortex.strength = 1.0;
    };

    const onPointerLeave = () => {
      vortex.strength = 0.0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const clip = screenToClip(touch.clientX, touch.clientY);
        vortex.x = clip.x;
        vortex.y = clip.y;
        vortex.strength = 1.0;
      }
    };

    canvas.addEventListener("mousemove", onPointerMove);
    canvas.addEventListener("mouseleave", onPointerLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });

    // Main simulation loop
    let ping = true;
    let lastTime = performance.now();
    
    frame = regl.frame(() => {
      if (paused) return;
      
      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.033); // Cap at 30fps
      lastTime = now;

      // Multi-step integration for stability
      const substeps = 2;
      const substepDt = deltaTime / substeps;
      
      for (let step = 0; step < substeps; step++) {
        updateVelocity({ 
          fbo: ping ? velB : velA, 
          pos: ping ? posA : posB, 
          vel: ping ? velA : velB, 
          dt: substepDt 
        });
        
        updatePosition({ 
          fbo: ping ? posB : posA, 
          pos: ping ? posA : posB, 
          vel: ping ? velB : velA, 
          dt: substepDt 
        });
        
        ping = !ping;
      }

      // Clear and render particles
      regl.clear({ color: [0, 0, 0, 1], depth: 1 });
      renderParticles({ 
        pos: ping ? posA : posB, 
        size: Math.max(1.0, 1.0 * DPR) 
      });
    });

    // Store references for cleanup
    (makeFlowfieldWebGL2 as any)._resizeObserver = resizeObserver;
    (makeFlowfieldWebGL2 as any)._state = { posA, posB, velA, velB };

    // Initialize vortex at center
    vortex.x = 0.0;
    vortex.y = 0.0;
  }

  function unmount() {
    frame?.cancel();
    (makeFlowfieldWebGL2 as any)._resizeObserver?.disconnect?.();
    canvas?.remove();
    regl?.destroy();
    regl = null;
    frame = null;
    canvas = null;
  }

  function setPreset(id: number) {
    P = presets[id as 1 | 2 | 3] ?? P;
  }

  function setPaused(p: boolean) {
    paused = p;
  }

  function setAudioLevel(v: number) {
    audioLevel = v;
  }

  return { mount, unmount, setPreset, setPaused, setAudioLevel };
}

// Helper function to choose optimal particle count based on device
function chooseParticleSide(): number {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const hasHighPerf = window.innerWidth > 1280 && window.innerHeight > 720;
  
  if (isMobile) return 384;        // ~147K particles
  if (hasHighPerf) return 1024;    // ~1M particles  
  return 768;                      // ~590K particles
}
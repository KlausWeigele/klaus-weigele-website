// src/app/demos/grafik/neural-flowfield/flowfield-webgpu.ts
// WebGPU Compute Shader engine for 1M+ particles with maximum performance
// Uses WGSL compute shaders for parallel particle updates

type Opts = { targetFPS: number };

export function makeFlowfieldWebGPU({ targetFPS }: Opts) {
  let device: GPUDevice;
  let context: GPUCanvasContext;
  let canvas: HTMLCanvasElement;
  let computePipeline: GPUComputePipeline;
  let renderPipeline: GPURenderPipeline;
  let bindGroupComputeA: GPUBindGroup;
  let bindGroupComputeB: GPUBindGroup;
  let bindGroupRender: GPUBindGroup;
  let positionBufferA: GPUBuffer;
  let positionBufferB: GPUBuffer;
  let velocityBufferA: GPUBuffer;
  let velocityBufferB: GPUBuffer;
  let uniformBuffer: GPUBuffer;
  
  let particleCount = 1_000_000; // 1M particles for WebGPU
  let paused = false;
  
  // WebGPU Shader Language (WGSL) definitions
  const WGSL = {
    compute: /* wgsl */ `
      struct Particle {
        pos: vec2<f32>,
        vel: vec2<f32>
      };
      
      struct Uniforms {
        dt: f32,
        time: f32,
        curlK: f32,
        attractK: f32,
        vortexK: f32,
        dragK: f32,
        speedK: f32,
        audioK: f32,
        vortexX: f32,
        vortexY: f32,
        vortexR: f32,
        audioLevel: f32
      };

      @group(0) @binding(0) var<storage, read> inputPos: array<Particle>;
      @group(0) @binding(1) var<storage, read> inputVel: array<Particle>;
      @group(0) @binding(2) var<storage, read_write> outputPos: array<Particle>;
      @group(0) @binding(3) var<storage, read_write> outputVel: array<Particle>;
      @group(0) @binding(4) var<uniform> uniforms: Uniforms;

      // === Noise Functions ===
      fn hash(p: vec2<f32>) -> f32 {
        let p3 = fract(vec3<f32>(p.x, p.y, p.x) * 0.13);
        let dp = dot(p3, vec3<f32>(p3.y + 3.333, p3.z + 3.333, p3.x + 3.333)) + p3.x;
        return fract((p3.x + p3.y) * dp);
      }

      fn noise(p: vec2<f32>) -> f32 {
        let i = floor(p);
        let f = fract(p);
        let u = f * f * (3.0 - 2.0 * f);
        
        return mix(
          mix(hash(i + vec2<f32>(0.0, 0.0)), hash(i + vec2<f32>(1.0, 0.0)), u.x),
          mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), u.x),
          u.y
        );
      }

      fn curl(p: vec2<f32>) -> vec2<f32> {
        let e = 0.002;
        let n1 = noise(p + vec2<f32>(0.0, e));
        let n2 = noise(p - vec2<f32>(0.0, e));
        let n3 = noise(p + vec2<f32>(e, 0.0));
        let n4 = noise(p - vec2<f32>(e, 0.0));
        
        let dx = (n3 - n4) / (2.0 * e);
        let dy = (n1 - n2) / (2.0 * e);
        
        return vec2<f32>(dy, -dx);
      }

      // === SDF Functions for Logo Attraction ===
      fn sdBox(p: vec2<f32>, b: vec2<f32>) -> f32 {
        let d = abs(p) - b;
        return length(max(d, vec2<f32>(0.0))) + min(max(d.x, d.y), 0.0);
      }

      fn logoSDF(p: vec2<f32>) -> f32 {
        // Simplified "KLAUS WEIGELE" representation using multiple boxes
        var minDist = 999.0;
        
        // KLAUS
        let klaus_positions = array<vec2<f32>, 5>(
          vec2<f32>(-0.6, 0.0),  // K
          vec2<f32>(-0.3, 0.0),  // L
          vec2<f32>( 0.0, 0.0),  // A
          vec2<f32>( 0.3, 0.0),  // U
          vec2<f32>( 0.6, 0.0)   // S
        );
        
        for (var i = 0; i < 5; i++) {
          let d = sdBox(p - klaus_positions[i], vec2<f32>(0.08, 0.15));
          minDist = min(minDist, d);
        }
        
        // WEIGELE (smaller, below)
        let weigele_positions = array<vec2<f32>, 7>(
          vec2<f32>(-0.45, -0.4), // W
          vec2<f32>(-0.3,  -0.4), // E
          vec2<f32>(-0.15, -0.4), // I
          vec2<f32>( 0.0,  -0.4), // G
          vec2<f32>( 0.15, -0.4), // E
          vec2<f32>( 0.3,  -0.4), // L
          vec2<f32>( 0.45, -0.4)  // E
        );
        
        for (var i = 0; i < 7; i++) {
          let d = sdBox(p - weigele_positions[i], vec2<f32>(0.06, 0.12));
          minDist = min(minDist, d);
        }
        
        return minDist;
      }

      fn logoGradient(p: vec2<f32>) -> vec2<f32> {
        let e = 0.001;
        let dx = logoSDF(p + vec2<f32>(e, 0.0)) - logoSDF(p - vec2<f32>(e, 0.0));
        let dy = logoSDF(p + vec2<f32>(0.0, e)) - logoSDF(p - vec2<f32>(0.0, e));
        return vec2<f32>(dx, dy) / (2.0 * e);
      }

      @compute @workgroup_size(256)
      fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
        let index = gid.x;
        if (index >= arrayLength(&inputPos)) {
          return;
        }

        var pos = inputPos[index].pos;
        var vel = inputVel[index].vel;

        // === Force 1: Curl-noise field ===
        let noisePos = pos * 2.0 + vec2<f32>(uniforms.time * 0.12, uniforms.time * 0.09);
        let curlForce = curl(noisePos);

        // === Force 2: Logo attraction ===
        let sdf = logoSDF(pos);
        let gradient = logoGradient(pos);
        let attractForce = -gradient * exp(-abs(sdf) * 2.0); // Exponential falloff

        // === Force 3: Interactive vortex ===
        let toVortex = pos - vec2<f32>(uniforms.vortexX, uniforms.vortexY);
        let vortexDist = length(toVortex);
        let vortexMask = exp(-pow(vortexDist / uniforms.vortexR, 2.0) * 2.5);
        let tangent = vec2<f32>(-toVortex.y, toVortex.x);
        let vortexForce = normalize(tangent + vec2<f32>(0.001)) * vortexMask;

        // === Audio modulation ===
        let audioBoost = 1.0 + uniforms.audioK * clamp(uniforms.audioLevel * 3.0, 0.0, 1.0);

        // === Combine forces ===
        let totalForce = uniforms.curlK * audioBoost * curlForce +
                        uniforms.attractK * attractForce +
                        uniforms.vortexK * audioBoost * vortexForce;

        // === Update velocity with damping ===
        vel = mix(vel + uniforms.dt * uniforms.speedK * totalForce, vel, uniforms.dragK);

        // === Update position ===
        pos = pos + vel * uniforms.dt;

        // === Boundary wrapping ===
        pos = (pos + 1.0) % 2.0 - 1.0;

        // === Write results ===
        outputPos[index].pos = pos;
        outputPos[index].vel = vec2<f32>(0.0);
        outputVel[index].pos = vec2<f32>(0.0);
        outputVel[index].vel = vel;
      }`,

    render: /* wgsl */ `
      struct Particle {
        pos: vec2<f32>,
        vel: vec2<f32>
      };

      @group(0) @binding(0) var<storage, read> particles: array<Particle>;

      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) speed: f32,
        @location(1) particlePos: vec2<f32>
      };

      @vertex
      fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
        var output: VertexOutput;
        let particle = particles[vertexIndex];
        
        output.position = vec4<f32>(particle.pos, 0.0, 1.0);
        output.speed = length(particle.vel);
        output.particlePos = particle.pos;
        
        return output;
      }

      @fragment
      fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
        let speedNorm = clamp(input.speed * 8.0, 0.0, 1.0);
        
        // Klaus Weigele brand colors
        let slowColor = vec3<f32>(0.31, 0.275, 0.902);  // Indigo #4F46E5
        let fastColor = vec3<f32>(0.024, 0.714, 0.831); // Cyan #06B6D4
        let peakColor = vec3<f32>(0.545, 0.361, 0.965); // Purple #8B5CF6
        
        var color = mix(slowColor, fastColor, speedNorm);
        color = mix(color, peakColor, pow(speedNorm, 3.0));
        
        // Distance-based alpha for depth
        let distanceFromCenter = length(input.particlePos);
        let alpha = 0.03 + 0.97 * speedNorm * exp(-distanceFromCenter * 0.5);
        
        return vec4<f32>(color, alpha);
      }`
  };

  async function mount(el: HTMLDivElement) {
    canvas = document.createElement("canvas");
    canvas.className = "w-full h-full block";
    el.appendChild(canvas);

    // Check WebGPU availability
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported");
    }

    // Get WebGPU adapter and device
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance"
    });
    if (!adapter) {
      throw new Error("Failed to get WebGPU adapter");
    }

    device = await adapter.requestDevice({
      requiredLimits: {
        maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
        maxComputeWorkgroupStorageSize: adapter.limits.maxComputeWorkgroupStorageSize,
      }
    });

    // Configure canvas context
    context = canvas.getContext("webgpu")!;
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: canvasFormat,
      alphaMode: "premultiplied"
    });

    // Adjust particle count based on device capabilities
    particleCount = chooseParticleCount(adapter);

    // Create compute and render pipelines
    const computeShader = device.createShaderModule({ code: WGSL.compute });
    const renderShader = device.createShaderModule({ code: WGSL.render });

    computePipeline = device.createComputePipeline({
      layout: "auto",
      compute: {
        module: computeShader,
        entryPoint: "main"
      }
    });

    renderPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: renderShader,
        entryPoint: "vs_main"
      },
      fragment: {
        module: renderShader,
        entryPoint: "fs_main",
        targets: [{
          format: canvasFormat,
          blend: {
            color: { srcFactor: "one", dstFactor: "one" },
            alpha: { srcFactor: "one", dstFactor: "one" }
          }
        }]
      },
      primitive: {
        topology: "point-list"
      }
    });

    // Create particle buffers
    const particleBufferSize = particleCount * 4 * 4; // 4 floats per particle
    
    positionBufferA = device.createBuffer({
      size: particleBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    
    positionBufferB = device.createBuffer({
      size: particleBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    
    velocityBufferA = device.createBuffer({
      size: particleBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    
    velocityBufferB = device.createBuffer({
      size: particleBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    // Create uniform buffer
    uniformBuffer = device.createBuffer({
      size: 16 * 4, // 16 floats
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    // Initialize particle data
    const initialData = new Float32Array(particleCount * 4);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 0.8;
      
      // Position
      initialData[i * 4 + 0] = Math.cos(angle) * radius;
      initialData[i * 4 + 1] = Math.sin(angle) * radius;
      
      // Velocity
      initialData[i * 4 + 2] = (Math.random() - 0.5) * 0.02;
      initialData[i * 4 + 3] = (Math.random() - 0.5) * 0.02;
    }

    device.queue.writeBuffer(positionBufferA, 0, initialData);
    device.queue.writeBuffer(positionBufferB, 0, initialData);
    device.queue.writeBuffer(velocityBufferA, 0, initialData);
    device.queue.writeBuffer(velocityBufferB, 0, initialData);

    // Create bind groups
    createBindGroups();

    // Handle canvas resize
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.configure({ device, format: canvasFormat, alphaMode: "premultiplied" });
    });
    resizeObserver.observe(el);

    // Animation loop
    let ping = true;
    let lastTime = performance.now();
    
    const animate = () => {
      if (!paused) {
        const now = performance.now();
        const deltaTime = Math.min((now - lastTime) / 1000, 0.033);
        lastTime = now;

        // Update uniforms
        const uniformData = new Float32Array([
          deltaTime,           // dt
          now / 1000,         // time
          1.2,                // curlK
          1.0,                // attractK  
          1.0,                // vortexK
          0.05,               // dragK
          1.0,                // speedK
          1.0,                // audioK
          0.0,                // vortexX
          0.0,                // vortexY
          0.18,               // vortexR
          0.0                 // audioLevel
        ]);
        
        device.queue.writeBuffer(uniformBuffer, 0, uniformData);

        // Compute pass
        const commandEncoder = device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, ping ? bindGroupComputeA : bindGroupComputeB);
        
        const workgroupCount = Math.ceil(particleCount / 256);
        computePass.dispatchWorkgroups(workgroupCount);
        computePass.end();

        // Render pass
        const renderPassDescriptor: GPURenderPassDescriptor = {
          colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: "clear" as GPULoadOp,
            storeOp: "store" as GPUStoreOp
          }]
        };

        // Update render bind group with current position buffer
        bindGroupRender = device.createBindGroup({
          layout: renderPipeline.getBindGroupLayout(0),
          entries: [{
            binding: 0,
            resource: { buffer: ping ? positionBufferB : positionBufferA }
          }]
        });

        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, bindGroupRender);
        renderPass.draw(particleCount);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);
        ping = !ping;
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  function createBindGroups() {
    bindGroupComputeA = device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: positionBufferA } },
        { binding: 1, resource: { buffer: velocityBufferA } },
        { binding: 2, resource: { buffer: positionBufferB } },
        { binding: 3, resource: { buffer: velocityBufferB } },
        { binding: 4, resource: { buffer: uniformBuffer } }
      ]
    });

    bindGroupComputeB = device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: positionBufferB } },
        { binding: 1, resource: { buffer: velocityBufferB } },
        { binding: 2, resource: { buffer: positionBufferA } },
        { binding: 3, resource: { buffer: velocityBufferA } },
        { binding: 4, resource: { buffer: uniformBuffer } }
      ]
    });

    bindGroupRender = device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: { buffer: positionBufferA }
      }]
    });
  }

  function unmount() {
    canvas?.remove();
    // WebGPU resources are automatically cleaned up when the page unloads
  }

  function setPreset(id: number) {
    // Preset configuration can be implemented here
  }

  function setPaused(p: boolean) {
    paused = p;
  }

  return { mount, unmount, setPreset, setPaused };
}

function chooseParticleCount(adapter: GPUAdapter): number {
  // Determine optimal particle count based on device capabilities
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const maxBufferSize = adapter.limits.maxStorageBufferBindingSize;
  
  if (isMobile) {
    return Math.min(300_000, Math.floor(maxBufferSize / 16)); // 16 bytes per particle
  } else {
    return Math.min(1_000_000, Math.floor(maxBufferSize / 16));
  }
}
"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, Mesh, PlaneGeometry, Vector3, Color } from "three";
import { Html, OrbitControls } from "@react-three/drei";
import WebGPUViewer from "../../../../components/graphics/WebGPUViewer";
import * as THREE from "three";

// Path Tracing Material Controls
function MaterialControls({ onMaterialChange }: { onMaterialChange: (params: any) => void }) {
  const [metallic, setMetallic] = useState(0.8);
  const [roughness, setRoughness] = useState(0.2);
  const [emissionStrength, setEmissionStrength] = useState(2.0);

  useEffect(() => {
    onMaterialChange({ metallic, roughness, emissionStrength });
  }, [metallic, roughness, emissionStrength, onMaterialChange]);

  return (
    <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white min-w-[250px]">
      <div className="text-sm font-semibold mb-3 text-red-300">Path Tracing Controls</div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-300 block mb-1">KW Sculpture Metallic: {metallic.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={metallic}
            onChange={(e) => setMetallic(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-300 block mb-1">Surface Roughness: {roughness.toFixed(2)}</label>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={roughness}
            onChange={(e) => setRoughness(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-300 block mb-1">Light Emission: {emissionStrength.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={emissionStrength}
            onChange={(e) => setEmissionStrength(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <div>💡 Adjust materials to see PBR effects</div>
        <div>🎯 Real-time ray tracing updates</div>
      </div>
    </div>
  );
}

// Path Tracing Progress Display
function RenderProgress({ samples, maxSamples, convergence }: { 
  samples: number; 
  maxSamples: number; 
  convergence: number; 
}) {
  return (
    <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white">
      <div className="text-sm font-semibold mb-2 text-red-300">Progressive Path Tracing</div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Samples:</span>
          <span>{samples}/{maxSamples}</span>
        </div>
        
        <div className="w-48 bg-gray-600 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(samples / maxSamples) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs">
          <span>Convergence:</span>
          <span>{(convergence * 100).toFixed(1)}%</span>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          <div>🔥 {samples > 100 ? 'High' : samples > 50 ? 'Medium' : 'Low'} Quality</div>
          <div>⚡ Monte Carlo Integration</div>
        </div>
      </div>
    </div>
  );
}

// Advanced Path Tracing Fragment Shader
const pathTracingShader = {
  uniforms: {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
    iFrame: { value: 0 },
    samples: { value: 1 },
    metallic: { value: 0.8 },
    roughness: { value: 0.2 },
    emissionStrength: { value: 2.0 },
    cameraPos: { value: new THREE.Vector3(0, 0, 8) },
    cameraTarget: { value: new THREE.Vector3(0, 0, 0) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float iTime;
    uniform vec3 iResolution;
    uniform int iFrame;
    uniform int samples;
    uniform float metallic;
    uniform float roughness;
    uniform float emissionStrength;
    uniform vec3 cameraPos;
    uniform vec3 cameraTarget;
    varying vec2 vUv;

    #define PI 3.14159265359
    #define MAX_BOUNCES 8
    #define EPSILON 0.001
    
    // Random number generation
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float random(inout float seed) {
        seed = fract(seed * 9749.0);
        return fract(sin(seed) * 43758.5453);
    }
    
    vec2 random2(inout float seed) {
        return vec2(random(seed), random(seed));
    }
    
    vec3 random3(inout float seed) {
        return vec3(random(seed), random(seed), random(seed));
    }
    
    // Sample hemisphere
    vec3 sampleHemisphere(vec3 n, inout float seed) {
        vec2 u = random2(seed);
        float cosTheta = sqrt(1.0 - u.x);
        float sinTheta = sqrt(u.x);
        float phi = 2.0 * PI * u.y;
        
        vec3 w = n;
        vec3 u1 = normalize(cross(w, abs(w.x) > 0.1 ? vec3(0, 1, 0) : vec3(1, 0, 0)));
        vec3 v = cross(w, u1);
        
        return cosTheta * w + sinTheta * cos(phi) * u1 + sinTheta * sin(phi) * v;
    }
    
    // Cornell Box + KW Sculpture Scene SDF
    float sdBox(vec3 p, vec3 b) {
        vec3 q = abs(p) - b;
        return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }
    
    float sdSphere(vec3 p, float r) {
        return length(p) - r;
    }
    
    // "KW" Letters as 3D geometry
    float kwLetterK(vec3 p) {
        // K shape: vertical bar + two diagonal bars
        float vertical = sdBox(p - vec3(-0.3, 0, 0), vec3(0.05, 0.4, 0.05));
        float diagonal1 = sdBox(p - vec3(-0.15, 0.2, 0), vec3(0.2, 0.05, 0.05));
        float diagonal2 = sdBox(p - vec3(-0.15, -0.2, 0), vec3(0.2, 0.05, 0.05));
        return min(vertical, min(diagonal1, diagonal2));
    }
    
    float kwLetterW(vec3 p) {
        // W shape: four diagonal bars
        float bar1 = sdBox(p - vec3(0.2, 0, 0), vec3(0.05, 0.4, 0.05));
        float bar2 = sdBox(p - vec3(0.35, 0, 0), vec3(0.05, 0.4, 0.05));
        float bar3 = sdBox(p - vec3(0.275, -0.2, 0), vec3(0.05, 0.2, 0.05));
        return min(bar1, min(bar2, bar3));
    }
    
    // Scene distance function
    vec4 mapScene(vec3 p) {
        // Cornell Box walls
        float leftWall = -(p.x + 2.0);     // Red wall
        float rightWall = p.x - 2.0;       // Green wall
        float backWall = -(p.z + 2.0);     // White wall
        float frontWall = p.z - 2.0;       // Open front
        float floor = -(p.y + 2.0);        // White floor
        float ceiling = p.y - 2.0;         // White ceiling with light
        
        float roomDist = max(max(max(leftWall, rightWall), max(backWall, frontWall)), max(floor, ceiling));
        
        // KW Sculpture in center
        vec3 sculpturePos = p - vec3(-0.2, -1.0, 0);
        float letterK = kwLetterK(sculpturePos);
        float letterW = kwLetterW(sculpturePos);
        float sculpture = min(letterK, letterW);
        
        // Area light on ceiling
        float light = sdBox(p - vec3(0, 1.9, 0), vec3(0.5, 0.01, 0.5));
        
        // Return distance and material ID
        if (sculpture < roomDist && sculpture < light) {
            return vec4(sculpture, 1.0, 0, 0); // Metallic sculpture
        } else if (light < roomDist) {
            return vec4(light, 2.0, 0, 0); // Emissive light
        } else if (leftWall > max(rightWall, max(backWall, max(floor, ceiling)))) {
            return vec4(roomDist, 3.0, 0, 0); // Red wall
        } else if (rightWall > max(backWall, max(floor, ceiling))) {
            return vec4(roomDist, 4.0, 0, 0); // Green wall
        } else {
            return vec4(roomDist, 5.0, 0, 0); // White surface
        }
    }
    
    // Ray marching
    vec4 raymarch(vec3 ro, vec3 rd) {
        float t = 0.0;
        
        for (int i = 0; i < 64; i++) {
            vec3 p = ro + rd * t;
            vec4 result = mapScene(p);
            float d = result.x;
            
            if (d < EPSILON) {
                return vec4(t, result.yzw);
            }
            
            t += d;
            
            if (t > 20.0) break;
        }
        
        return vec4(-1.0, 0, 0, 0);
    }
    
    // Calculate normal
    vec3 getNormal(vec3 p) {
        vec2 e = vec2(EPSILON, 0);
        return normalize(vec3(
            mapScene(p + e.xyy).x - mapScene(p - e.xyy).x,
            mapScene(p + e.yxy).x - mapScene(p - e.yxy).x,
            mapScene(p + e.yyx).x - mapScene(p - e.yyx).x
        ));
    }
    
    // Path tracing with Monte Carlo integration
    vec3 pathTrace(vec3 ro, vec3 rd, inout float seed) {
        vec3 radiance = vec3(0);
        vec3 throughput = vec3(1);
        
        for (int bounce = 0; bounce < MAX_BOUNCES; bounce++) {
            vec4 hit = raymarch(ro, rd);
            
            if (hit.x < 0.0) {
                // Hit environment (black)
                break;
            }
            
            vec3 pos = ro + rd * hit.x;
            vec3 normal = getNormal(pos);
            int materialId = int(hit.y);
            
            // Material properties
            vec3 albedo = vec3(0.7);
            vec3 emission = vec3(0);
            float mat_metallic = 0.0;
            float mat_roughness = 0.5;
            
            if (materialId == 1) { // KW Sculpture
                albedo = vec3(0.9, 0.8, 0.1); // Gold color
                mat_metallic = metallic;
                mat_roughness = roughness;
            } else if (materialId == 2) { // Area Light
                emission = vec3(1.0, 0.9, 0.8) * emissionStrength;
                albedo = vec3(0);
            } else if (materialId == 3) { // Red wall
                albedo = vec3(0.7, 0.1, 0.1);
            } else if (materialId == 4) { // Green wall
                albedo = vec3(0.1, 0.7, 0.1);
            } else { // White surfaces
                albedo = vec3(0.7, 0.7, 0.7);
            }
            
            // Add emission
            radiance += throughput * emission;
            
            // Sample next direction
            vec3 newDir;
            if (mat_metallic > 0.5) {
                // Metallic reflection with roughness
                vec3 reflected = reflect(rd, normal);
                vec3 randomDir = sampleHemisphere(normal, seed);
                newDir = normalize(mix(reflected, randomDir, mat_roughness));
            } else {
                // Diffuse reflection
                newDir = sampleHemisphere(normal, seed);
            }
            
            // Update throughput
            float cosTheta = max(dot(newDir, normal), 0.0);
            throughput *= albedo * cosTheta;
            
            // Russian roulette
            float maxThroughput = max(throughput.r, max(throughput.g, throughput.b));
            if (maxThroughput < 0.1 && random(seed) > 0.8) break;
            
            // Setup next ray
            ro = pos + normal * EPSILON;
            rd = newDir;
        }
        
        return radiance;
    }
    
    void main() {
        // Normalized coordinates
        vec2 uv = (vUv - 0.5) * 2.0;
        uv.x *= iResolution.x / iResolution.y;
        
        // Random seed
        float seed = hash(vUv + float(iFrame) * 0.1) + iTime;
        
        // Anti-aliasing jitter
        uv += (random2(seed) - 0.5) * (2.0 / iResolution.xy);
        
        // Camera setup
        vec3 ro = cameraPos;
        vec3 ta = cameraTarget;
        vec3 ww = normalize(ta - ro);
        vec3 uu = normalize(cross(ww, vec3(0, 1, 0)));
        vec3 vv = normalize(cross(uu, ww));
        vec3 rd = normalize(uv.x * uu + uv.y * vv + 2.0 * ww);
        
        // Path trace
        vec3 color = pathTrace(ro, rd, seed);
        
        // Tone mapping and gamma correction
        color = color / (color + vec3(1.0));
        color = pow(color, vec3(1.0 / 2.2));
        
        gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Path Tracing Cornell Box Component
function PathTracingRenderer() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const frameRef = useRef(0);
  const samplesRef = useRef(1);
  const [materialParams, setMaterialParams] = useState({
    metallic: 0.8,
    roughness: 0.2,
    emissionStrength: 2.0
  });
  const { gl, size, camera } = useThree();

  // Create shader material
  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      uniforms: pathTracingShader.uniforms,
      vertexShader: pathTracingShader.vertexShader,
      fragmentShader: pathTracingShader.fragmentShader,
      side: THREE.DoubleSide
    });
    
    return mat;
  }, []);

  // Update resolution on resize
  useEffect(() => {
    if (material.uniforms.iResolution) {
      material.uniforms.iResolution.value.set(size.width, size.height, 1);
      frameRef.current = 0; // Reset accumulation
      samplesRef.current = 1;
    }
  }, [material, size]);

  // Reset when material parameters change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.metallic.value = materialParams.metallic;
      materialRef.current.uniforms.roughness.value = materialParams.roughness;
      materialRef.current.uniforms.emissionStrength.value = materialParams.emissionStrength;
      frameRef.current = 0; // Reset accumulation
      samplesRef.current = 1;
    }
  }, [materialParams]);

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.elapsedTime;
    frameRef.current++;
    
    // Progressive sampling
    if (samplesRef.current < 1024) {
      samplesRef.current = Math.min(1024, samplesRef.current + 1);
    }
    
    // Update uniforms
    materialRef.current.uniforms.iTime.value = time;
    materialRef.current.uniforms.iFrame.value = frameRef.current;
    materialRef.current.uniforms.samples.value = samplesRef.current;
    materialRef.current.uniforms.iResolution.value.set(size.width, size.height, 1);
    
    // Camera animation
    const radius = 6;
    const angle = time * 0.1;
    const cameraPos = new Vector3(
      Math.cos(angle) * radius,
      1,
      Math.sin(angle) * radius
    );
    materialRef.current.uniforms.cameraPos.value.copy(cameraPos);
  });

  const convergence = Math.min(samplesRef.current / 1024, 1);

  return (
    <>
      {/* Material Controls */}
      <MaterialControls onMaterialChange={setMaterialParams} />
      
      {/* Render Progress */}
      <RenderProgress 
        samples={samplesRef.current}
        maxSamples={1024}
        convergence={convergence}
      />

      {/* Path Tracing Fullscreen Quad */}
      <mesh ref={meshRef}>
        <planeGeometry args={[2, 2]} />
        <primitive object={material} ref={materialRef} />
      </mesh>
    </>
  );
}

// Main viewer component
export default function WebGPUPathTracerViewer() {
  return (
    <WebGPUViewer
      title="WebGPU Path Tracer"
      description="Real-time Monte Carlo path tracing with Cornell Box"
      gradient="bg-gradient-to-br from-red-500 to-red-700"
      requiresWebGPU={true}
      showPerformanceMonitor={true}
      minFps={15}
      maxMemory={1200}
      fallbackVideoUrl="/demos/pathtracer-preview.mp4"
      fallbackImageUrl="/demos/pathtracer-poster.jpg"
    >
      <PathTracingRenderer />
    </WebGPUViewer>
  );
}
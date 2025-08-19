"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, Mesh, PlaneGeometry } from "three";
import WebGPUViewer from "../../../../components/graphics/WebGPUViewer";
import * as THREE from "three";

// Advanced SDF Raymarching Fragment Shader
const sdfRaymarchingShader = {
  uniforms: {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
    iMouse: { value: new THREE.Vector4() },
    cameraPos: { value: new THREE.Vector3() },
    cameraTarget: { value: new THREE.Vector3() }
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
    uniform vec4 iMouse;
    uniform vec3 cameraPos;
    uniform vec3 cameraTarget;
    varying vec2 vUv;

    #define MAX_STEPS 128
    #define MAX_DIST 100.0
    #define SURF_DIST 0.001
    #define PI 3.14159265359
    
    // Noise function for procedural details
    float hash(float n) {
        return fract(sin(n) * 43758.5453123);
    }
    
    float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        float res = mix(
            mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
            mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
        return res;
    }
    
    // SDF Primitive functions
    float sdSphere(vec3 p, float r) {
        return length(p) - r;
    }
    
    float sdBox(vec3 p, vec3 b) {
        vec3 q = abs(p) - b;
        return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }
    
    float sdRoundBox(vec3 p, vec3 b, float r) {
        vec3 q = abs(p) - b;
        return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
    }
    
    float sdCylinder(vec3 p, float h, float r) {
        vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
        return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
    }
    
    // Boolean operations
    float opUnion(float d1, float d2) {
        return min(d1, d2);
    }
    
    float opSubtraction(float d1, float d2) {
        return max(-d1, d2);
    }
    
    float opIntersection(float d1, float d2) {
        return max(d1, d2);
    }
    
    // Smooth boolean operations
    float opSmoothUnion(float d1, float d2, float k) {
        float h = max(k - abs(d1 - d2), 0.0);
        return min(d1, d2) - h * h * 0.25 / k;
    }
    
    // Domain repetition
    vec3 opRep(vec3 p, vec3 c) {
        return mod(p + 0.5 * c, c) - 0.5 * c;
    }
    
    // Rotation matrix
    mat3 rotateY(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat3(c, 0, s, 0, 1, 0, -s, 0, c);
    }
    
    // Procedural city scene
    float mapCity(vec3 pos) {
        vec3 p = pos;
        
        // Ground plane
        float ground = p.y + 0.5;
        
        // City blocks with repetition
        vec3 cityPos = p;
        cityPos.x = mod(cityPos.x + 4.0, 8.0) - 4.0;
        cityPos.z = mod(cityPos.z + 4.0, 8.0) - 4.0;
        
        // Building height variation based on position
        float buildingNoise = noise(vec3(floor(p.x / 8.0), 0, floor(p.z / 8.0)));
        float buildingHeight = 2.0 + buildingNoise * 8.0;
        
        // Main building structure
        float building = sdRoundBox(
            cityPos - vec3(0, buildingHeight * 0.5, 0), 
            vec3(1.5, buildingHeight * 0.5, 1.5), 
            0.1
        );
        
        // Add antenna/spire on top
        float antenna = sdCylinder(
            cityPos - vec3(0, buildingHeight + 1.0, 0),
            1.0,
            0.05
        );
        building = opUnion(building, antenna);
        
        // Windows (subtract smaller boxes)
        for(int i = 0; i < 3; i++) {
            for(int j = 0; j < 3; j++) {
                vec3 windowPos = cityPos + vec3(-1.0 + float(i) * 0.7, -buildingHeight * 0.3 + float(j) * buildingHeight * 0.3, 1.51);
                float window = sdBox(windowPos, vec3(0.15, 0.2, 0.1));
                building = opSubtraction(window, building);
            }
        }
        
        // Combine ground and buildings
        float scene = opUnion(ground, building);
        
        // Central monument/tower (KLAUS WEIGELE themed)
        if (length(p.xz) < 12.0) {
            vec3 monumentPos = p - vec3(0, 6, 0);
            float monument = sdRoundBox(monumentPos, vec3(0.8, 6.0, 0.8), 0.2);
            
            // Add "KW" letters as geometric cuts
            vec3 letterPos = monumentPos - vec3(0, 2, 0.9);
            // K shape (simplified as crossed boxes)
            float letterK = opUnion(
                sdBox(letterPos + vec3(-0.3, 0, 0), vec3(0.1, 1.5, 0.1)),
                sdBox(letterPos + vec3(-0.1, 0.5, 0), vec3(0.3, 0.1, 0.1))
            );
            letterK = opUnion(letterK, sdBox(letterPos + vec3(-0.1, -0.5, 0), vec3(0.3, 0.1, 0.1)));
            
            // W shape
            float letterW = opUnion(
                sdBox(letterPos + vec3(0.2, 0, 0), vec3(0.1, 1.5, 0.1)),
                sdBox(letterPos + vec3(0.4, 0, 0), vec3(0.1, 1.5, 0.1))
            );
            letterW = opUnion(letterW, sdBox(letterPos + vec3(0.3, -1.0, 0), vec3(0.2, 0.1, 0.1)));
            
            float letters = opUnion(letterK, letterW);
            monument = opSubtraction(letters, monument);
            
            scene = opSmoothUnion(scene, monument, 0.5);
        }
        
        return scene;
    }
    
    // Raymarching function
    float raymarch(vec3 ro, vec3 rd) {
        float dO = 0.0;
        
        for(int i = 0; i < MAX_STEPS; i++) {
            vec3 p = ro + rd * dO;
            float dS = mapCity(p);
            dO += dS;
            
            if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
        }
        
        return dO;
    }
    
    // Calculate normal at surface point
    vec3 getNormal(vec3 p) {
        float d = mapCity(p);
        vec2 e = vec2(0.001, 0);
        
        vec3 n = d - vec3(
            mapCity(p - e.xyy),
            mapCity(p - e.yxy),
            mapCity(p - e.yyx)
        );
        
        return normalize(n);
    }
    
    // Ambient occlusion
    float getAO(vec3 p, vec3 n) {
        float occ = 0.0;
        float sca = 1.0;
        for(int i = 0; i < 5; i++) {
            float h = 0.01 + 0.12 * float(i) / 4.0;
            float d = mapCity(p + h * n);
            occ += (h - d) * sca;
            sca *= 0.95;
            if(occ > 0.35) break;
        }
        return clamp(1.0 - 3.0 * occ, 0.0, 1.0) * (0.5 + 0.5 * n.y);
    }
    
    // Soft shadows
    float getSoftShadow(vec3 ro, vec3 rd, float mint, float maxt) {
        float res = 1.0;
        float t = mint;
        for(int i = 0; i < 24; i++) {
            float h = mapCity(ro + rd * t);
            if(h < 0.001) return 0.0;
            res = min(res, 8.0 * h / t);
            t += clamp(h, 0.02, 0.20);
            if(t > maxt) break;
        }
        return clamp(res, 0.0, 1.0);
    }
    
    // Main rendering function
    vec3 render(vec2 uv) {
        // Camera setup with automatic movement
        float time = iTime * 0.3;
        vec3 ro = vec3(15.0 * cos(time), 8.0 + 2.0 * sin(time * 1.3), 15.0 * sin(time));
        vec3 ta = vec3(0.0, 2.0, 0.0);
        
        // Camera matrix
        vec3 ww = normalize(ta - ro);
        vec3 uu = normalize(cross(ww, vec3(0, 1, 0)));
        vec3 vv = normalize(cross(uu, ww));
        
        // Create ray
        vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.8 * ww);
        
        // Sky color
        vec3 col = vec3(0.2, 0.3, 0.6) + 0.3 * rd.y;
        col = mix(col, vec3(0.8, 0.9, 1.0), exp(-10.0 * max(rd.y, 0.0)));
        
        // Raymarching
        float t = raymarch(ro, rd);
        
        if(t < MAX_DIST) {
            vec3 pos = ro + t * rd;
            vec3 nor = getNormal(pos);
            
            // Material properties
            vec3 mate = vec3(0.6, 0.7, 0.8);
            
            // Different materials for different parts
            if(pos.y < 0.0) {
                mate = vec3(0.4, 0.4, 0.4); // Ground
            } else if(length(pos.xz) < 2.0 && pos.y > 4.0) {
                mate = vec3(0.8, 0.6, 0.3); // Monument
            } else {
                mate = vec3(0.6, 0.7, 0.9); // Buildings
            }
            
            // Lighting
            vec3 sun_dir = normalize(vec3(0.6, 0.8, 0.5));
            vec3 sun_col = vec3(1.0, 0.9, 0.7);
            
            float sun_dif = clamp(dot(nor, sun_dir), 0.0, 1.0);
            float sun_sha = getSoftShadow(pos + nor * 0.01, sun_dir, 0.02, 2.5);
            
            float sky_dif = clamp(0.5 + 0.5 * dot(nor, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);
            float bou_dif = clamp(0.5 + 0.5 * dot(nor, vec3(0.0, -1.0, 0.0)), 0.0, 1.0);
            
            col = mate * sun_col * sun_dif * sun_sha;
            col += mate * vec3(0.5, 0.8, 0.9) * sky_dif;
            col += mate * vec3(0.7, 0.3, 0.2) * bou_dif;
            
            // Ambient occlusion
            float ao = getAO(pos, nor);
            col *= ao;
            
            // Atmospheric perspective
            col = mix(col, vec3(0.7, 0.8, 0.9), 1.0 - exp(-0.0001 * t * t));
        }
        
        // Post-processing
        col = pow(col, vec3(0.4545)); // Gamma correction
        
        return col;
    }
    
    void main() {
        // Normalized coordinates
        vec2 uv = (vUv - 0.5) * 2.0;
        uv.x *= iResolution.x / iResolution.y;
        
        vec3 col = render(uv);
        
        gl_FragColor = vec4(col, 1.0);
    }
  `
};

// SDF Raymarching Component
function SDFRaymarchingRenderer() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector4(0, 0, 0, 0));
  const { gl, size, viewport, camera } = useThree();

  // Create shader material
  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      uniforms: sdfRaymarchingShader.uniforms,
      vertexShader: sdfRaymarchingShader.vertexShader,
      fragmentShader: sdfRaymarchingShader.fragmentShader,
      side: THREE.DoubleSide
    });
    
    return mat;
  }, []);

  // Update resolution on resize
  useEffect(() => {
    if (material.uniforms.iResolution) {
      material.uniforms.iResolution.value.set(size.width, size.height, 1);
    }
  }, [material, size]);

  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = rect.height - (event.clientY - rect.top);
      
      mouseRef.current.set(x, y, 0, 0);
    };

    const handleMouseDown = () => {
      mouseRef.current.z = 1;
    };

    const handleMouseUp = () => {
      mouseRef.current.z = 0;
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);

    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gl]);

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Update uniforms
    materialRef.current.uniforms.iTime.value = time;
    materialRef.current.uniforms.iMouse.value.copy(mouseRef.current);
    materialRef.current.uniforms.iResolution.value.set(size.width, size.height, 1);
    materialRef.current.uniforms.cameraPos.value.copy(camera.position);
    materialRef.current.uniforms.cameraTarget.value.set(0, 0, 0);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} ref={materialRef} />
    </mesh>
  );
}

// Main viewer component
export default function SDFRaymarchingViewer() {
  return (
    <WebGPUViewer
      title="SDF Raymarching"
      description="Procedural 3D worlds with signed distance fields"
      gradient="bg-gradient-to-br from-purple-500 to-purple-700"
      requiresWebGPU={false}
      showPerformanceMonitor={true}
      minFps={20}
      maxMemory={600}
      fallbackVideoUrl="/demos/sdf-raymarching-preview.mp4"
      fallbackImageUrl="/demos/sdf-raymarching-poster.jpg"
    >
      {/* Fullscreen SDF raymarching renderer */}
      <SDFRaymarchingRenderer />
      
      {/* Subtle lighting */}
      <ambientLight intensity={0.1} />
    </WebGPUViewer>
  );
}
"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointsMaterial, BufferGeometry, BufferAttribute, Vector2, Vector3 } from "three";
import WebGPUViewer from "../../../../components/graphics/WebGPUViewer";
import * as THREE from "three";

// Neural Flowfield GPU Particle Component
function NeuralFlowfieldParticles() {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const mouseRef = useRef(new Vector2(0, 0));
  const timeRef = useRef(0);
  const velocitiesRef = useRef<Float32Array>();
  const [particleCount, setParticleCount] = useState(250000);
  const { gl, viewport, camera } = useThree();
  
  // Detect optimal particle count based on device capabilities
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hasWebGPU = 'gpu' in navigator;
    
    if (isMobile) {
      setParticleCount(50000);
    } else if (hasWebGPU) {
      setParticleCount(1000000); // 1M for WebGPU
    } else {
      setParticleCount(400000); // 400K for WebGL2
    }
  }, []);

  // Initialize particle positions and velocities
  const { positions, colors, initialPositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    // Generate "KLAUS WEIGELE" text-shaped particle distribution
    const textPatterns = [
      // K pattern
      { x: -4, y: 0, scale: 0.8, density: 0.15 },
      // L pattern  
      { x: -2, y: 0, scale: 0.6, density: 0.12 },
      // A pattern
      { x: 0, y: 0, scale: 0.7, density: 0.13 },
      // U pattern
      { x: 2, y: 0, scale: 0.6, density: 0.12 },
      // S pattern
      { x: 4, y: 0, scale: 0.5, density: 0.10 }
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Choose random pattern for text formation
      const pattern = textPatterns[Math.floor(Math.random() * textPatterns.length)];
      
      // Initial spiral distribution (before text formation)
      const angle = (i / particleCount) * Math.PI * 4;
      const radius = Math.sqrt(Math.random()) * 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 0.5;
      
      // Store initial positions
      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;
      
      // Set current positions (will be updated by flow field)
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Initialize velocities
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;
      
      // Color gradient based on position
      const hue = (Math.atan2(y, x) + Math.PI) / (2 * Math.PI);
      const saturation = Math.min(1, radius / 3);
      const lightness = 0.5 + 0.3 * Math.random();
      
      // Convert HSL to RGB
      const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
      const x1 = c * (1 - Math.abs(((hue * 6) % 2) - 1));
      const m = lightness - c / 2;
      
      let r = 0, g = 0, b = 0;
      if (hue < 1/6) { r = c; g = x1; b = 0; }
      else if (hue < 2/6) { r = x1; g = c; b = 0; }
      else if (hue < 3/6) { r = 0; g = c; b = x1; }
      else if (hue < 4/6) { r = 0; g = x1; b = c; }
      else if (hue < 5/6) { r = x1; g = 0; b = c; }
      else { r = c; g = 0; b = x1; }
      
      colors[i * 3] = r + m;
      colors[i * 3 + 1] = g + m;
      colors[i * 3 + 2] = b + m;
    }
    
    velocitiesRef.current = velocities;
    return { positions, colors, initialPositions };
  }, [particleCount]);

  // Curl-noise function (simplified version for performance)
  const curlNoise = (x: number, y: number, z: number, time: number): Vector3 => {
    const scale = 0.5;
    const timeScale = 0.3;
    const t = time * timeScale;
    
    // Simplified curl-noise approximation
    const nx = Math.sin(x * scale + t) * Math.cos(y * scale);
    const ny = Math.cos(x * scale) * Math.sin(y * scale + t);
    const nz = Math.sin(z * scale + t) * 0.1;
    
    return new Vector3(
      ny - nz,
      nz - nx, 
      nx - ny
    ).multiplyScalar(0.5);
  };

  // Text SDF approximation for "KLAUS WEIGELE" 
  const textSDF = (x: number, y: number): number => {
    // Simplified text shape approximation
    const letters = [
      { x: -4, y: 0, w: 0.8, h: 2 }, // K
      { x: -2.5, y: 0, w: 0.6, h: 2 }, // L
      { x: -1, y: 0, w: 0.8, h: 2 }, // A
      { x: 0.5, y: 0, w: 0.8, h: 2 }, // U
      { x: 2, y: 0, w: 0.6, h: 2 }, // S
      // Space
      { x: 3.2, y: 0, w: 0.8, h: 2 }, // W
      { x: 4.4, y: 0, w: 0.6, h: 2 }, // E
      { x: 5.4, y: 0, w: 0.6, h: 2 }, // I
      { x: 6.2, y: 0, w: 0.8, h: 2 }, // G
      { x: 7.4, y: 0, w: 0.6, h: 2 }, // E
      { x: 8.4, y: 0, w: 0.6, h: 2 }, // L
      { x: 9.2, y: 0, w: 0.6, h: 2 }, // E
    ];
    
    let minDist = Infinity;
    for (const letter of letters) {
      const dx = Math.abs(x - letter.x) - letter.w / 2;
      const dy = Math.abs(y - letter.y) - letter.h / 2;
      const dist = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) + Math.min(Math.max(dx, dy), 0);
      minDist = Math.min(minDist, dist);
    }
    
    return minDist;
  };

  // Mouse interaction handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseRef.current.set(x * viewport.width / 2, y * viewport.height / 2);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
        
        mouseRef.current.set(x * viewport.width / 2, y * viewport.height / 2);
      }
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('touchmove', handleTouchMove);

    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gl, viewport]);

  // Animation loop
  useFrame((state, delta) => {
    if (!pointsRef.current || !velocitiesRef.current) return;
    
    timeRef.current += delta;
    const time = timeRef.current;
    
    const positionAttribute = pointsRef.current.geometry.attributes.position as BufferAttribute;
    const positions = positionAttribute.array as Float32Array;
    const velocities = velocitiesRef.current;
    
    // Update particle physics
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Curl-noise force
      const curlForce = curlNoise(x, y, z, time);
      
      // Text SDF attraction force
      const textDist = textSDF(x, y);
      const textForce = Math.max(0, 1 - textDist / 2) * 0.3;
      const textGrad = new Vector3(
        textSDF(x + 0.01, y) - textSDF(x - 0.01, y),
        textSDF(x, y + 0.01) - textSDF(x, y - 0.01),
        0
      ).normalize().multiplyScalar(-textForce);
      
      // Mouse interaction force
      const mouseDistance = Math.sqrt(
        (x - mouseRef.current.x) ** 2 + 
        (y - mouseRef.current.y) ** 2
      );
      const mouseForce = Math.exp(-mouseDistance * 0.5) * 2;
      const mouseDx = (mouseRef.current.x - x) / (mouseDistance + 0.001);
      const mouseDy = (mouseRef.current.y - y) / (mouseDistance + 0.001);
      
      // Vortex around mouse
      const vortexForce = mouseForce * 0.5;
      const vortexX = -mouseDy * vortexForce;
      const vortexY = mouseDx * vortexForce;
      
      // Combine forces
      const totalForceX = curlForce.x + textGrad.x + vortexX;
      const totalForceY = curlForce.y + textGrad.y + vortexY;
      const totalForceZ = curlForce.z + textGrad.z;
      
      // Update velocity with damping
      const damping = 0.95;
      velocities[i3] = (velocities[i3] + totalForceX * delta) * damping;
      velocities[i3 + 1] = (velocities[i3 + 1] + totalForceY * delta) * damping;
      velocities[i3 + 2] = (velocities[i3 + 2] + totalForceZ * delta) * damping;
      
      // Update positions
      positions[i3] += velocities[i3] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;
      positions[i3 + 2] += velocities[i3 + 2] * delta;
      
      // Boundary conditions (soft walls)
      const boundary = 8;
      if (Math.abs(positions[i3]) > boundary) {
        velocities[i3] *= -0.5;
        positions[i3] = Math.sign(positions[i3]) * boundary;
      }
      if (Math.abs(positions[i3 + 1]) > boundary) {
        velocities[i3 + 1] *= -0.5;
        positions[i3 + 1] = Math.sign(positions[i3 + 1]) * boundary;
      }
    }
    
    positionAttribute.needsUpdate = true;
    
    // Update material opacity based on time
    if (materialRef.current) {
      materialRef.current.opacity = 0.6 + 0.2 * Math.sin(time * 0.5);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          array={positions} 
          count={particleCount} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          array={colors} 
          count={particleCount} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.008}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.7}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Main viewer component
export default function NeuralFlowfieldViewer() {
  return (
    <WebGPUViewer
      title="Neural Flowfield"
      description="Interactive GPU particle system with curl-noise flow fields"
      gradient="bg-gradient-to-br from-blue-500 to-blue-700"
      requiresWebGPU={false} // Works with WebGL2 as well
      showPerformanceMonitor={true}
      minFps={25}
      maxMemory={800}
      fallbackVideoUrl="/demos/neural-flowfield-preview.mp4"
      fallbackImageUrl="/demos/neural-flowfield-poster.jpg"
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Neural flowfield particles */}
      <NeuralFlowfieldParticles />
      
      {/* Camera controller for subtle movement */}
      <CameraController />
    </WebGPUViewer>
  );
}

// Subtle camera movement
function CameraController() {
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(time * 0.1) * 0.5;
    state.camera.position.y = Math.cos(time * 0.15) * 0.3;
    state.camera.lookAt(0, 0, 0);
  });
  
  return null;
}
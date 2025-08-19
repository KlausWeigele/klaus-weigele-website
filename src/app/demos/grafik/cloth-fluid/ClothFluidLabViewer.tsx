"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, BufferGeometry, BufferAttribute, Vector3, Color, Points, PointsMaterial } from "three";
import { OrbitControls, Html } from "@react-three/drei";
import WebGPUViewer from "../../../../components/graphics/WebGPUViewer";
import * as THREE from "three";

// Physics Mode Types
type FluidMode = 'windtunnel' | 'tornado' | 'ripples' | 'calm';

// Physics Control Interface
function PhysicsControls({ 
  mode, 
  onModeChange, 
  windStrength,
  onWindStrengthChange,
  onReset
}: {
  mode: FluidMode;
  onModeChange: (mode: FluidMode) => void;
  windStrength: number;
  onWindStrengthChange: (strength: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white min-w-[280px]">
      <div className="text-sm font-semibold mb-3 text-cyan-300">Cloth × Fluid Controls</div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-300 block mb-2">Fluid Mode:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { mode: 'windtunnel' as FluidMode, label: '🌪️ Wind', color: 'cyan' },
              { mode: 'tornado' as FluidMode, label: '🌀 Tornado', color: 'teal' },
              { mode: 'ripples' as FluidMode, label: '💧 Ripples', color: 'blue' },
              { mode: 'calm' as FluidMode, label: '😌 Calm', color: 'gray' }
            ].map(({ mode: modeValue, label, color }) => (
              <button
                key={modeValue}
                onClick={() => onModeChange(modeValue)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  mode === modeValue 
                    ? `bg-${color}-600 text-white` 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-300 block mb-1">Wind Strength: {windStrength.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={windStrength}
            onChange={(e) => onWindStrengthChange(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <button
          onClick={onReset}
          className="w-full px-3 py-2 bg-red-600/70 hover:bg-red-600 rounded transition-colors text-sm"
        >
          🔄 Reset Simulation
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <div>🖱️ Drag cloth with mouse</div>
        <div>📌 Click to pin points</div>
        <div>💥 High forces cause tearing</div>
      </div>
    </div>
  );
}

// Cloth Simulation Class
class ClothSimulation {
  positions: Float32Array;
  oldPositions: Float32Array;
  velocities: Float32Array;
  pinned: boolean[];
  constraints: { a: number; b: number; restLength: number }[];
  width: number;
  height: number;
  damping: number = 0.99;
  
  constructor(width: number, height: number, segments: number) {
    this.width = width;
    this.height = height;
    const vertexCount = (segments + 1) * (segments + 1);
    
    this.positions = new Float32Array(vertexCount * 3);
    this.oldPositions = new Float32Array(vertexCount * 3);
    this.velocities = new Float32Array(vertexCount * 3);
    this.pinned = new Array(vertexCount).fill(false);
    this.constraints = [];
    
    // Initialize grid positions
    let index = 0;
    for (let y = 0; y <= segments; y++) {
      for (let x = 0; x <= segments; x++) {
        const posX = (x / segments - 0.5) * width;
        const posY = (y / segments - 0.5) * height;
        
        this.positions[index * 3] = posX;
        this.positions[index * 3 + 1] = posY;
        this.positions[index * 3 + 2] = 0;
        
        this.oldPositions[index * 3] = posX;
        this.oldPositions[index * 3 + 1] = posY;
        this.oldPositions[index * 3 + 2] = 0;
        
        index++;
      }
    }
    
    // Pin top corners by default
    this.pinned[0] = true; // Top-left
    this.pinned[segments] = true; // Top-right
    
    // Create constraints (springs)
    for (let y = 0; y <= segments; y++) {
      for (let x = 0; x <= segments; x++) {
        const i = y * (segments + 1) + x;
        
        // Horizontal constraints
        if (x < segments) {
          const j = y * (segments + 1) + x + 1;
          this.constraints.push({
            a: i,
            b: j,
            restLength: width / segments
          });
        }
        
        // Vertical constraints
        if (y < segments) {
          const j = (y + 1) * (segments + 1) + x;
          this.constraints.push({
            a: i,
            b: j,
            restLength: height / segments
          });
        }
        
        // Diagonal constraints for stability
        if (x < segments && y < segments) {
          const j = (y + 1) * (segments + 1) + x + 1;
          this.constraints.push({
            a: i,
            b: j,
            restLength: Math.sqrt((width / segments) ** 2 + (height / segments) ** 2)
          });
        }
      }
    }
  }
  
  update(deltaTime: number, fluidForces: Vector3[], mouseForce?: { pos: Vector3; strength: number }) {
    const dt = Math.min(deltaTime, 1/60); // Cap delta time
    const iterations = 3; // XPBD iterations for stability
    
    // Apply forces (gravity + fluid + mouse)
    for (let i = 0; i < this.positions.length / 3; i++) {
      if (this.pinned[i]) continue;
      
      // Gravity
      this.velocities[i * 3 + 1] -= 9.81 * dt;
      
      // Fluid forces
      if (fluidForces[i]) {
        this.velocities[i * 3] += fluidForces[i].x * dt;
        this.velocities[i * 3 + 1] += fluidForces[i].y * dt;
        this.velocities[i * 3 + 2] += fluidForces[i].z * dt;
      }
      
      // Mouse interaction
      if (mouseForce) {
        const pos = new Vector3(
          this.positions[i * 3],
          this.positions[i * 3 + 1],
          this.positions[i * 3 + 2]
        );
        const distance = pos.distanceTo(mouseForce.pos);
        if (distance < 1.0) {
          const force = mouseForce.pos.clone().sub(pos).normalize().multiplyScalar(mouseForce.strength);
          this.velocities[i * 3] += force.x * dt;
          this.velocities[i * 3 + 1] += force.y * dt;
          this.velocities[i * 3 + 2] += force.z * dt;
        }
      }
    }
    
    // Verlet integration
    for (let i = 0; i < this.positions.length / 3; i++) {
      if (this.pinned[i]) continue;
      
      const newX = this.positions[i * 3] + (this.positions[i * 3] - this.oldPositions[i * 3]) * this.damping + this.velocities[i * 3] * dt * dt;
      const newY = this.positions[i * 3 + 1] + (this.positions[i * 3 + 1] - this.oldPositions[i * 3 + 1]) * this.damping + this.velocities[i * 3 + 1] * dt * dt;
      const newZ = this.positions[i * 3 + 2] + (this.positions[i * 3 + 2] - this.oldPositions[i * 3 + 2]) * this.damping + this.velocities[i * 3 + 2] * dt * dt;
      
      this.oldPositions[i * 3] = this.positions[i * 3];
      this.oldPositions[i * 3 + 1] = this.positions[i * 3 + 1];
      this.oldPositions[i * 3 + 2] = this.positions[i * 3 + 2];
      
      this.positions[i * 3] = newX;
      this.positions[i * 3 + 1] = newY;
      this.positions[i * 3 + 2] = newZ;
    }
    
    // Constraint solving (XPBD iterations)
    for (let iter = 0; iter < iterations; iter++) {
      for (const constraint of this.constraints) {
        const { a, b, restLength } = constraint;
        
        if (this.pinned[a] && this.pinned[b]) continue;
        
        const p1 = new Vector3(this.positions[a * 3], this.positions[a * 3 + 1], this.positions[a * 3 + 2]);
        const p2 = new Vector3(this.positions[b * 3], this.positions[b * 3 + 1], this.positions[b * 3 + 2]);
        
        const delta = p2.clone().sub(p1);
        const distance = delta.length();
        
        if (distance === 0) continue;
        
        const correction = delta.normalize().multiplyScalar((distance - restLength) * 0.5);
        
        if (!this.pinned[a]) {
          this.positions[a * 3] += correction.x;
          this.positions[a * 3 + 1] += correction.y;
          this.positions[a * 3 + 2] += correction.z;
        }
        
        if (!this.pinned[b]) {
          this.positions[b * 3] -= correction.x;
          this.positions[b * 3 + 1] -= correction.y;
          this.positions[b * 3 + 2] -= correction.z;
        }
      }
    }
    
    // Update velocities
    for (let i = 0; i < this.positions.length / 3; i++) {
      if (this.pinned[i]) continue;
      
      this.velocities[i * 3] = (this.positions[i * 3] - this.oldPositions[i * 3]) / dt;
      this.velocities[i * 3 + 1] = (this.positions[i * 3 + 1] - this.oldPositions[i * 3 + 1]) / dt;
      this.velocities[i * 3 + 2] = (this.positions[i * 3 + 2] - this.oldPositions[i * 3 + 2]) / dt;
    }
  }
  
  reset() {
    // Reset to initial state
    const segments = Math.sqrt(this.positions.length / 3) - 1;
    let index = 0;
    for (let y = 0; y <= segments; y++) {
      for (let x = 0; x <= segments; x++) {
        const posX = (x / segments - 0.5) * this.width;
        const posY = (y / segments - 0.5) * this.height;
        
        this.positions[index * 3] = posX;
        this.positions[index * 3 + 1] = posY;
        this.positions[index * 3 + 2] = 0;
        
        this.oldPositions[index * 3] = posX;
        this.oldPositions[index * 3 + 1] = posY;
        this.oldPositions[index * 3 + 2] = 0;
        
        this.velocities[index * 3] = 0;
        this.velocities[index * 3 + 1] = 0;
        this.velocities[index * 3 + 2] = 0;
        
        index++;
      }
    }
  }
}

// Main Cloth × Fluid Component
function ClothFluidLab() {
  const clothRef = useRef<Mesh>(null);
  const fluidParticlesRef = useRef<Points>(null);
  const [mode, setMode] = useState<FluidMode>('windtunnel');
  const [windStrength, setWindStrength] = useState(2.0);
  const mouseRef = useRef(new THREE.Vector2());
  const { camera, gl } = useThree();
  
  // Cloth simulation
  const clothSim = useMemo(() => new ClothSimulation(4, 3, 32), []);
  
  // Fluid particles for visualization
  const { fluidPositions, fluidColors } = useMemo(() => {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      
      colors[i * 3] = 0.3 + Math.random() * 0.7;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 1.0;
    }
    
    return { fluidPositions: positions, fluidColors: colors };
  }, []);
  
  // Cloth geometry
  const clothGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const segments = 32;
    
    // Create indices for triangles
    const indices = [];
    for (let y = 0; y < segments; y++) {
      for (let x = 0; x < segments; x++) {
        const a = y * (segments + 1) + x;
        const b = y * (segments + 1) + x + 1;
        const c = (y + 1) * (segments + 1) + x;
        const d = (y + 1) * (segments + 1) + x + 1;
        
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    
    geometry.setIndex(indices);
    geometry.setAttribute('position', new BufferAttribute(clothSim.positions, 3));
    
    return geometry;
  }, [clothSim.positions]);
  
  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);
    };

    gl.domElement.addEventListener('mousemove', handleMouseMove);
    return () => gl.domElement.removeEventListener('mousemove', handleMouseMove);
  }, [gl]);
  
  // Generate fluid forces based on mode
  const generateFluidForces = (time: number, positions: Float32Array): Vector3[] => {
    const forces: Vector3[] = [];
    const vertexCount = positions.length / 3;
    
    for (let i = 0; i < vertexCount; i++) {
      const pos = new Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      let force = new Vector3();
      
      switch (mode) {
        case 'windtunnel':
          force.set(windStrength * 2, 0, windStrength * 0.5);
          break;
          
        case 'tornado':
          const distance = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
          const angle = Math.atan2(pos.z, pos.x) + time * 2;
          force.set(
            -Math.sin(angle) * windStrength * (3 - distance),
            windStrength * 0.5 * Math.sin(time + pos.x * 0.5),
            Math.cos(angle) * windStrength * (3 - distance)
          );
          break;
          
        case 'ripples':
          const wave = Math.sin(time * 3 + pos.x * 2) * Math.cos(time * 2 + pos.y * 3);
          force.set(
            wave * windStrength * 0.3,
            wave * windStrength * 0.5,
            Math.sin(time + pos.x + pos.y) * windStrength * 0.2
          );
          break;
          
        case 'calm':
        default:
          force.set(0, 0, 0);
          break;
      }
      
      forces.push(force);
    }
    
    return forces;
  };
  
  // Update fluid particles
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update cloth physics
    const fluidForces = generateFluidForces(time, clothSim.positions);
    
    // Mouse force
    const mouseForce = {
      pos: new Vector3(
        mouseRef.current.x * 3,
        mouseRef.current.y * 2,
        0
      ),
      strength: 5.0
    };
    
    clothSim.update(state.clock.getDelta(), fluidForces, mouseForce);
    
    // Update cloth geometry
    if (clothRef.current) {
      const positionAttribute = clothRef.current.geometry.attributes.position as BufferAttribute;
      positionAttribute.array = clothSim.positions;
      positionAttribute.needsUpdate = true;
      clothRef.current.geometry.computeVertexNormals();
    }
    
    // Update fluid particles
    if (fluidParticlesRef.current) {
      const positions = fluidParticlesRef.current.geometry.attributes.position as BufferAttribute;
      const posArray = positions.array as Float32Array;
      
      for (let i = 0; i < posArray.length / 3; i++) {
        let forceX = 0, forceY = 0, forceZ = 0;
        
        switch (mode) {
          case 'windtunnel':
            forceX = windStrength * 0.1;
            break;
          case 'tornado':
            const angle = Math.atan2(posArray[i * 3 + 2], posArray[i * 3]) + time;
            forceX = -Math.sin(angle) * windStrength * 0.05;
            forceZ = Math.cos(angle) * windStrength * 0.05;
            break;
          case 'ripples':
            forceY = Math.sin(time * 2 + posArray[i * 3] * 0.5) * windStrength * 0.03;
            break;
        }
        
        posArray[i * 3] += forceX;
        posArray[i * 3 + 1] += forceY;
        posArray[i * 3 + 2] += forceZ;
        
        // Reset particles that go too far
        if (Math.abs(posArray[i * 3]) > 8 || Math.abs(posArray[i * 3 + 1]) > 6 || Math.abs(posArray[i * 3 + 2]) > 5) {
          posArray[i * 3] = (Math.random() - 0.5) * 2;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 2;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }
      }
      
      positions.needsUpdate = true;
    }
  });
  
  return (
    <>
      {/* Physics Controls */}
      <PhysicsControls
        mode={mode}
        onModeChange={setMode}
        windStrength={windStrength}
        onWindStrengthChange={setWindStrength}
        onReset={() => clothSim.reset()}
      />

      {/* Cloth Mesh */}
      <mesh ref={clothRef} geometry={clothGeometry}>
        <meshLambertMaterial 
          color="#4F46E5" 
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Cloth Wireframe */}
      <mesh geometry={clothGeometry}>
        <meshBasicMaterial 
          color="#FFFFFF" 
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Fluid Particles */}
      <points ref={fluidParticlesRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            array={fluidPositions} 
            count={fluidPositions.length / 3} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-color" 
            array={fluidColors} 
            count={fluidColors.length / 3} 
            itemSize={3} 
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.6}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#4FC3F7" />
      
      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        target={[0, 0, 0]}
      />
    </>
  );
}

// Main viewer component
export default function ClothFluidLabViewer() {
  return (
    <WebGPUViewer
      title="Cloth × Fluid Lab"
      description="Interactive XPBD cloth simulation with fluid dynamics"
      gradient="bg-gradient-to-br from-cyan-500 to-cyan-700"
      requiresWebGPU={false}
      showPerformanceMonitor={true}
      minFps={30}
      maxMemory={400}
      fallbackVideoUrl="/demos/cloth-fluid-preview.mp4"
      fallbackImageUrl="/demos/cloth-fluid-poster.jpg"
    >
      <ClothFluidLab />
    </WebGPUViewer>
  );
}
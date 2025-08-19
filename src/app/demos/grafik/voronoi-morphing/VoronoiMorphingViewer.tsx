"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, BufferGeometry, BufferAttribute, Vector3, Color, Group, Points, PointsMaterial } from "three";
import { OrbitControls, Html } from "@react-three/drei";
import WebGPUViewer from "../../../../components/graphics/WebGPUViewer";
import * as THREE from "three";

// Voronoi Pattern Controls
function VoronoiControls({ 
  morphFactor,
  onMorphChange,
  extrusionHeight,
  onExtrusionChange,
  lloydIterations,
  onLloydChange,
  onRegenerate,
  seedCount
}: {
  morphFactor: number;
  onMorphChange: (value: number) => void;
  extrusionHeight: number;
  onExtrusionChange: (value: number) => void;
  lloydIterations: number;
  onLloydChange: (value: number) => void;
  onRegenerate: () => void;
  seedCount: number;
}) {
  return (
    <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white min-w-[300px]">
      <div className="text-sm font-semibold mb-3 text-emerald-300">Voronoi Morphing Controls</div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-300 block mb-1">
            Pattern Morph: {morphFactor === 0 ? 'Organic' : morphFactor === 1 ? 'Geometric' : 'Mixed'}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={morphFactor}
            onChange={(e) => onMorphChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>🌳 Organic</span>
            <span>{(morphFactor * 100).toFixed(0)}%</span>
            <span>🏢 Geometric</span>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-300 block mb-1">3D Extrusion: {extrusionHeight.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={extrusionHeight}
            onChange={(e) => onExtrusionChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-300 block mb-1">Lloyd Iterations: {lloydIterations}</label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={lloydIterations}
            onChange={(e) => onLloydChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <button
          onClick={onRegenerate}
          className="w-full px-3 py-2 bg-emerald-600/70 hover:bg-emerald-600 rounded transition-colors text-sm"
        >
          🔄 Regenerate Pattern ({seedCount} seeds)
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <div>🎯 Real-time procedural generation</div>
        <div>🔄 Poisson-disk → Voronoi → Lloyd</div>
        <div>📐 Dynamic 3D extrusion</div>
      </div>
    </div>
  );
}

// Poisson Disk Sampling Implementation
function poissonDiskSampling(width: number, height: number, radius: number, maxAttempts: number = 30): Vector3[] {
  const points: Vector3[] = [];
  const activeList: Vector3[] = [];
  
  // Add initial point
  const firstPoint = new Vector3(
    (Math.random() - 0.5) * width,
    0,
    (Math.random() - 0.5) * height
  );
  points.push(firstPoint);
  activeList.push(firstPoint);
  
  while (activeList.length > 0) {
    const randomIndex = Math.floor(Math.random() * activeList.length);
    const currentPoint = activeList[randomIndex];
    
    let found = false;
    for (let i = 0; i < maxAttempts; i++) {
      // Generate random point in annulus around current point
      const angle = Math.random() * Math.PI * 2;
      const distance = radius + Math.random() * radius;
      
      const newPoint = new Vector3(
        currentPoint.x + Math.cos(angle) * distance,
        0,
        currentPoint.z + Math.sin(angle) * distance
      );
      
      // Check bounds
      if (Math.abs(newPoint.x) > width/2 || Math.abs(newPoint.z) > height/2) continue;
      
      // Check minimum distance to all existing points
      let valid = true;
      for (const existingPoint of points) {
        if (newPoint.distanceTo(existingPoint) < radius) {
          valid = false;
          break;
        }
      }
      
      if (valid) {
        points.push(newPoint);
        activeList.push(newPoint);
        found = true;
        break;
      }
    }
    
    if (!found) {
      activeList.splice(randomIndex, 1);
    }
  }
  
  return points;
}

// Create geometric grid pattern
function createGeometricGrid(width: number, height: number, rows: number, cols: number): Vector3[] {
  const points: Vector3[] = [];
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j / (cols - 1) - 0.5) * width;
      const z = (i / (rows - 1) - 0.5) * height;
      
      points.push(new Vector3(x, 0, z));
    }
  }
  
  return points;
}

// Simple 2D Voronoi approximation using distance fields
function generateVoronoiMesh(seeds: Vector3[], width: number, height: number, resolution: number = 64): {
  positions: Float32Array;
  indices: number[];
  colors: Float32Array;
} {
  const positions: number[] = [];
  const indices: number[] = [];
  const colors: number[] = [];
  
  const step = Math.max(width, height) / resolution;
  let vertexIndex = 0;
  
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (j / (resolution - 1) - 0.5) * width;
      const z = (i / (resolution - 1) - 0.5) * height;
      
      // Find closest seed
      let minDistance = Infinity;
      let closestSeedIndex = 0;
      
      for (let k = 0; k < seeds.length; k++) {
        const distance = Math.sqrt((x - seeds[k].x) ** 2 + (z - seeds[k].z) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestSeedIndex = k;
        }
      }
      
      // Add vertex
      positions.push(x, 0, z);
      
      // Color based on seed index
      const hue = (closestSeedIndex * 137.508) % 360; // Golden angle
      const color = new Color().setHSL(hue / 360, 0.6, 0.7);
      colors.push(color.r, color.g, color.b);
      
      // Add triangles
      if (i < resolution - 1 && j < resolution - 1) {
        const a = i * resolution + j;
        const b = i * resolution + (j + 1);
        const c = (i + 1) * resolution + j;
        const d = (i + 1) * resolution + (j + 1);
        
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
      
      vertexIndex++;
    }
  }
  
  return {
    positions: new Float32Array(positions),
    indices,
    colors: new Float32Array(colors)
  };
}

// Lloyd Relaxation simplified
function lloydRelaxation(seeds: Vector3[], iterations: number): Vector3[] {
  let currentSeeds = [...seeds];
  
  for (let iter = 0; iter < iterations; iter++) {
    const newSeeds: Vector3[] = [];
    
    for (let i = 0; i < currentSeeds.length; i++) {
      const seed = currentSeeds[i];
      
      // Simple centroid approximation (in real implementation, would use actual Voronoi cell)
      let centroidX = seed.x;
      let centroidZ = seed.z;
      let neighborCount = 0;
      
      // Find nearby seeds and approximate centroid
      for (let j = 0; j < currentSeeds.length; j++) {
        if (i === j) continue;
        
        const distance = seed.distanceTo(currentSeeds[j]);
        if (distance < 2.0) { // Neighborhood threshold
          const weight = 1.0 / (1.0 + distance);
          centroidX += currentSeeds[j].x * weight;
          centroidZ += currentSeeds[j].z * weight;
          neighborCount += weight;
        }
      }
      
      if (neighborCount > 0) {
        centroidX /= (1 + neighborCount);
        centroidZ /= (1 + neighborCount);
      }
      
      // Move towards centroid with damping
      const damping = 0.3;
      const newX = seed.x + (centroidX - seed.x) * damping;
      const newZ = seed.z + (centroidZ - seed.z) * damping;
      
      newSeeds.push(new Vector3(newX, 0, newZ));
    }
    
    currentSeeds = newSeeds;
  }
  
  return currentSeeds;
}

// Main Voronoi Morphing Component
function VoronoiMorphingPattern() {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const seedPointsRef = useRef<Points>(null);
  
  const [morphFactor, setMorphFactor] = useState(0.0);
  const [extrusionHeight, setExtrusionHeight] = useState(1.0);
  const [lloydIterations, setLloydIterations] = useState(3);
  const [regenerateFlag, setRegenerateFlag] = useState(0);
  
  const width = 16;
  const height = 12;
  const seedCount = 150;
  
  // Generate patterns
  const { organicSeeds, geometricSeeds, morphedSeeds } = useMemo(() => {
    // Generate organic Poisson-disk pattern
    const organic = poissonDiskSampling(width, height, 0.8);
    
    // Generate geometric grid pattern
    const gridSize = Math.ceil(Math.sqrt(organic.length));
    const geometric = createGeometricGrid(width, height, gridSize, gridSize).slice(0, organic.length);
    
    // Apply Lloyd relaxation to organic pattern
    const relaxedOrganic = lloydRelaxation(organic, lloydIterations);
    
    // Morph between patterns
    const morphed: Vector3[] = [];
    for (let i = 0; i < Math.min(relaxedOrganic.length, geometric.length); i++) {
      const org = relaxedOrganic[i];
      const geo = geometric[i] || org;
      
      const morphedPoint = new Vector3(
        org.x + (geo.x - org.x) * morphFactor,
        org.y,
        org.z + (geo.z - org.z) * morphFactor
      );
      morphed.push(morphedPoint);
    }
    
    return {
      organicSeeds: relaxedOrganic,
      geometricSeeds: geometric,
      morphedSeeds: morphed
    };
  }, [morphFactor, lloydIterations, regenerateFlag]);
  
  // Generate Voronoi mesh
  const voronoiMesh = useMemo(() => {
    return generateVoronoiMesh(morphedSeeds, width, height, 48);
  }, [morphedSeeds]);
  
  // Seed points visualization
  const seedPointsGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(morphedSeeds.length * 3);
    const colors = new Float32Array(morphedSeeds.length * 3);
    
    for (let i = 0; i < morphedSeeds.length; i++) {
      positions[i * 3] = morphedSeeds[i].x;
      positions[i * 3 + 1] = morphedSeeds[i].y + 0.1;
      positions[i * 3 + 2] = morphedSeeds[i].z;
      
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;
    }
    
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    
    return geometry;
  }, [morphedSeeds]);
  
  // Update mesh with extrusion
  useFrame(() => {
    if (meshRef.current) {
      const positionAttribute = meshRef.current.geometry.attributes.position as BufferAttribute;
      const positions = positionAttribute.array as Float32Array;
      
      // Apply extrusion based on Voronoi cell properties
      for (let i = 0; i < positions.length / 3; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        
        // Find closest seed for height variation
        let minDistance = Infinity;
        for (const seed of morphedSeeds) {
          const distance = Math.sqrt((x - seed.x) ** 2 + (z - seed.z) ** 2);
          if (distance < minDistance) {
            minDistance = distance;
          }
        }
        
        // Height based on distance to nearest seed and morphing factor
        const baseHeight = extrusionHeight;
        const variation = Math.sin(minDistance * 2 + morphFactor * Math.PI) * 0.3;
        positions[i * 3 + 1] = baseHeight * (0.5 + variation);
      }
      
      positionAttribute.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });
  
  return (
    <>
      {/* Voronoi Controls */}
      <VoronoiControls
        morphFactor={morphFactor}
        onMorphChange={setMorphFactor}
        extrusionHeight={extrusionHeight}
        onExtrusionChange={setExtrusionHeight}
        lloydIterations={lloydIterations}
        onLloydChange={setLloydIterations}
        onRegenerate={() => setRegenerateFlag(prev => prev + 1)}
        seedCount={morphedSeeds.length}
      />

      <group ref={groupRef}>
        {/* Voronoi Mesh */}
        <mesh ref={meshRef}>
          <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position" 
              array={voronoiMesh.positions} 
              count={voronoiMesh.positions.length / 3} 
              itemSize={3} 
            />
            <bufferAttribute 
              attach="attributes-color" 
              array={voronoiMesh.colors} 
              count={voronoiMesh.colors.length / 3} 
              itemSize={3} 
            />
          </bufferGeometry>
          <meshLambertMaterial 
            vertexColors
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Voronoi Wireframe */}
        <mesh>
          <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position" 
              array={voronoiMesh.positions} 
              count={voronoiMesh.positions.length / 3} 
              itemSize={3} 
            />
          </bufferGeometry>
          <meshBasicMaterial 
            color="#FFFFFF" 
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Seed Points */}
        <points ref={seedPointsRef} geometry={seedPointsGeometry}>
          <pointsMaterial
            size={0.1}
            sizeAttenuation={true}
            transparent
            opacity={0.9}
            vertexColors
          />
        </points>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#4FC3F7" />
      
      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={25}
        target={[0, 0, 0]}
      />
    </>
  );
}

// Main viewer component
export default function VoronoiMorphingViewer() {
  return (
    <WebGPUViewer
      title="Voronoi Morphing"
      description="Procedural pattern generation with Poisson-disk sampling and Lloyd relaxation"
      gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
      requiresWebGPU={false}
      showPerformanceMonitor={true}
      minFps={30}
      maxMemory={300}
      fallbackVideoUrl="/demos/voronoi-morphing-preview.mp4"
      fallbackImageUrl="/demos/voronoi-morphing-poster.jpg"
    >
      <VoronoiMorphingPattern />
    </WebGPUViewer>
  );
}
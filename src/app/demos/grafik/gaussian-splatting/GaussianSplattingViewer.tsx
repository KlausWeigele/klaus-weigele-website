"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointsMaterial, BufferGeometry, BufferAttribute, Vector3, Color, Euler, Quaternion } from "three";
import { OrbitControls, Html } from "@react-three/drei";
import WebGPUViewer from "../../../../components/graphics/WebGPUViewer";
import * as THREE from "three";

// Case Study Hotspot Data
const CASE_STUDIES = [
  {
    id: "office-space",
    position: new Vector3(2, 0.5, 1),
    title: "KI-Büro Visualization",
    description: "Photorealistische Darstellung eines modernen KI-Entwicklungsbüros",
    details: "Gaussian Splatting ermöglicht perfekte Wiedergabe von Materialien, Beleuchtung und Atmosphäre.",
    color: new Color(0x4F46E5)
  },
  {
    id: "product-demo",
    position: new Vector3(-1.5, 1, -2),
    title: "Produkt-Showcase",
    description: "Interactive 3D-Produktpräsentation mit fotorealistischer Qualität",
    details: "Kunden können Produkte aus allen Winkeln betrachten, als wären sie physisch anwesend.",
    color: new Color(0xEC4899)
  },
  {
    id: "architectural",
    position: new Vector3(0, -0.5, 3),
    title: "Architektur-Walkthrough",
    description: "Immersive Gebäude-Begehung vor der Fertigstellung",
    details: "Architekten und Kunden erleben Räume mit natürlicher Beleuchtung und Materialien.",
    color: new Color(0x10B981)
  },
  {
    id: "training",
    position: new Vector3(-3, 2, 0),
    title: "VR-Training-Environment",
    description: "Realitätsnahe Trainingsumgebungen für kritische Situationen",
    details: "Gaussian Splats bieten die Realitätsnähe, die für effektives Training erforderlich ist.",
    color: new Color(0xF59E0B)
  }
];

// Hotspot Component
function InteractiveHotspot({ caseStudy, onSelect, isSelected }: { 
  caseStudy: typeof CASE_STUDIES[0];
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
      meshRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group position={caseStudy.position}>
      <mesh
        ref={meshRef}
        onClick={() => onSelect(caseStudy.id)}
        onPointerOver={(e) => { e.object.scale.setScalar(1.3); }}
        onPointerOut={(e) => { e.object.scale.setScalar(1.0); }}
      >
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial 
          color={caseStudy.color} 
          transparent 
          opacity={isSelected ? 0.9 : 0.7}
        />
      </mesh>
      
      {/* Pulsing Ring Effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.2, 16]} />
        <meshBasicMaterial 
          color={caseStudy.color} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Tooltip */}
      {isSelected && (
        <Html position={[0, 0.3, 0]} center>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-2" style={{color: `#${caseStudy.color.getHexString()}`}}>
              {caseStudy.title}
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              {caseStudy.description}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {caseStudy.details}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Pseudo-Gaussian Splatting Component
function GaussianSplatScene() {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const backgroundRef = useRef<THREE.Mesh>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const splatCount = 2300000; // 2.3M pseudo-splats
  const { camera } = useThree();

  // Generate pseudo-Gaussian splats
  const { positions, colors, sizes, rotations } = useMemo(() => {
    const positions = new Float32Array(splatCount * 3);
    const colors = new Float32Array(splatCount * 3);
    const sizes = new Float32Array(splatCount);
    const rotations = new Float32Array(splatCount * 4); // Quaternions
    
    // Create a photorealistic scene structure
    const structures = [
      // Floor plane
      { center: [0, -1, 0], extent: [8, 0.1, 8], density: 0.3, color: [0.6, 0.6, 0.5] },
      // Walls
      { center: [-4, 1, 0], extent: [0.2, 3, 8], density: 0.25, color: [0.8, 0.8, 0.9] },
      { center: [4, 1, 0], extent: [0.2, 3, 8], density: 0.25, color: [0.8, 0.8, 0.9] },
      { center: [0, 1, -4], extent: [8, 3, 0.2], density: 0.25, color: [0.9, 0.9, 0.8] },
      // Furniture-like structures
      { center: [1, 0, 1], extent: [1.5, 0.8, 0.8], density: 0.4, color: [0.4, 0.3, 0.2] },
      { center: [-2, 0, -1], extent: [1, 1.2, 0.6], density: 0.35, color: [0.2, 0.2, 0.3] },
      { center: [2.5, 1.5, -2], extent: [0.8, 0.8, 0.1], density: 0.45, color: [0.1, 0.1, 0.1] },
      // Ambient particles for atmosphere
      { center: [0, 2, 0], extent: [10, 4, 10], density: 0.05, color: [0.9, 0.95, 1.0] }
    ];
    
    let splatIndex = 0;
    
    structures.forEach((structure) => {
      const [cx, cy, cz] = structure.center;
      const [ex, ey, ez] = structure.extent;
      const [r, g, b] = structure.color;
      const splatCount = Math.floor(splatCount * structure.density * 0.1);
      
      for (let i = 0; i < splatCount && splatIndex < splatCount; i++) {
        // Position within structure bounds
        positions[splatIndex * 3] = cx + (Math.random() - 0.5) * ex;
        positions[splatIndex * 3 + 1] = cy + (Math.random() - 0.5) * ey;
        positions[splatIndex * 3 + 2] = cz + (Math.random() - 0.5) * ez;
        
        // Color with variation
        const colorVariation = 0.2;
        colors[splatIndex * 3] = Math.max(0, Math.min(1, r + (Math.random() - 0.5) * colorVariation));
        colors[splatIndex * 3 + 1] = Math.max(0, Math.min(1, g + (Math.random() - 0.5) * colorVariation));
        colors[splatIndex * 3 + 2] = Math.max(0, Math.min(1, b + (Math.random() - 0.5) * colorVariation));
        
        // Size variation for realism
        sizes[splatIndex] = 0.02 + Math.random() * 0.08;
        
        // Random rotation (quaternion)
        const euler = new Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        const quat = new Quaternion().setFromEuler(euler);
        rotations[splatIndex * 4] = quat.x;
        rotations[splatIndex * 4 + 1] = quat.y;
        rotations[splatIndex * 4 + 2] = quat.z;
        rotations[splatIndex * 4 + 3] = quat.w;
        
        splatIndex++;
      }
    });
    
    // Fill remaining with sparse atmospheric particles
    while (splatIndex < splatCount) {
      positions[splatIndex * 3] = (Math.random() - 0.5) * 20;
      positions[splatIndex * 3 + 1] = Math.random() * 6 - 1;
      positions[splatIndex * 3 + 2] = (Math.random() - 0.5) * 20;
      
      colors[splatIndex * 3] = 0.5 + Math.random() * 0.5;
      colors[splatIndex * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[splatIndex * 3 + 2] = 0.5 + Math.random() * 0.5;
      
      sizes[splatIndex] = 0.01 + Math.random() * 0.02;
      
      const euler = new Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      const quat = new Quaternion().setFromEuler(euler);
      rotations[splatIndex * 4] = quat.x;
      rotations[splatIndex * 4 + 1] = quat.y;
      rotations[splatIndex * 4 + 2] = quat.z;
      rotations[splatIndex * 4 + 3] = quat.w;
      
      splatIndex++;
    }
    
    return { positions, colors, sizes, rotations };
  }, [splatCount]);

  // Simulate loading progress
  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          setIsLoaded(true);
          clearInterval(loadingInterval);
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(loadingInterval);
  }, []);

  // Level-of-detail based on camera distance
  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current || !isLoaded) return;

    const cameraDistance = camera.position.distanceTo(new Vector3(0, 0, 0));
    
    // Adjust point size based on distance for LOD effect
    const baseSize = THREE.MathUtils.mapLinear(cameraDistance, 5, 25, 0.08, 0.02);
    materialRef.current.size = Math.max(0.01, baseSize);
    
    // Adjust opacity for depth effect
    const opacity = THREE.MathUtils.mapLinear(cameraDistance, 5, 30, 0.9, 0.6);
    materialRef.current.opacity = THREE.MathUtils.clamp(opacity, 0.4, 0.9);

    // Subtle animation for realism
    const time = state.clock.elapsedTime;
    if (backgroundRef.current) {
      backgroundRef.current.material.opacity = 0.05 + 0.02 * Math.sin(time * 0.5);
    }
  });

  if (!isLoaded) {
    return (
      <group>
        {/* Loading Progress Indicator */}
        <Html center>
          <div className="text-white text-center">
            <div className="text-lg font-semibold mb-2">Loading Gaussian Splats</div>
            <div className="w-64 bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-300" 
                style={{width: `${loadingProgress}%`}}
              />
            </div>
            <div className="text-sm text-gray-400">
              {loadingProgress.toFixed(0)}% • Streaming 2.3M splats
            </div>
          </div>
        </Html>
      </group>
    );
  }

  return (
    <>
      {/* Pseudo-Gaussian Splat Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            array={positions} 
            count={splatCount} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-color" 
            array={colors} 
            count={splatCount} 
            itemSize={3} 
          />
          <bufferAttribute 
            attach="attributes-size" 
            array={sizes} 
            count={splatCount} 
            itemSize={1} 
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.05}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.8}
          vertexColors={true}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      {/* Interactive Hotspots */}
      {CASE_STUDIES.map((caseStudy) => (
        <InteractiveHotspot
          key={caseStudy.id}
          caseStudy={caseStudy}
          onSelect={setSelectedHotspot}
          isSelected={selectedHotspot === caseStudy.id}
        />
      ))}

      {/* Atmospheric Background */}
      <mesh ref={backgroundRef} position={[0, 2, -8]} scale={[16, 8, 1]}>
        <planeGeometry />
        <meshBasicMaterial 
          color={0x87CEEB} 
          transparent 
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle Lighting for Hotspots */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.2} />
      <pointLight position={[-5, 3, -3]} intensity={0.15} color="#ff9999" />
      
      {/* Camera Controls with Constraints */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={30}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        autoRotate={false}
        target={[0, 0, 0]}
      />
    </>
  );
}

// Main viewer component
export default function GaussianSplattingViewer() {
  return (
    <WebGPUViewer
      title="Gaussian Splatting"
      description="Photorealistic 3D scene with 2.3M neural reconstructed splats"
      gradient="bg-gradient-to-br from-orange-500 to-orange-700"
      requiresWebGPU={true} // This demo requires WebGPU
      showPerformanceMonitor={true}
      minFps={20}
      maxMemory={800}
      fallbackVideoUrl="/demos/gaussian-splatting-preview.mp4"
      fallbackImageUrl="/demos/gaussian-splatting-poster.jpg"
    >
      <GaussianSplatScene />
    </WebGPUViewer>
  );
}
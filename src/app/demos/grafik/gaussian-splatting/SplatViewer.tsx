// src/app/demos/grafik/gaussian-splatting/SplatViewer.tsx
// 🎯 BUSINESS PURPOSE: Photorealistic Gaussian Splatting Point Cloud Renderer
//
// BUSINESS CONTEXT: Premium 3D visualization showcasing neural reconstruction technology
// USER INTERACTIONS: Orbit controls, interactive hotspots, point cloud visualization
// REVENUE IMPACT: Demonstrates advanced 3D capabilities for high-value client projects

"use client";

import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import { loadPlyFromUrl, PLYParseResult } from './parsePly';

/**
 * 🎯 GAUSSIAN SPLAT POINTS: Core rendering component
 * 
 * Renders PLY point cloud data as points with direct Three.js approach.
 * Maximum compatibility and stability.
 */
function GaussianSplatPoints({ plyData }: { plyData: PLYParseResult }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  
  // Interactive Leva controls
  const {
    pointSize,
    opacity
  } = useControls('Gaussian Splats', {
    pointSize: { value: 3.0, min: 0.5, max: 10.0, step: 0.1 },
    opacity: { value: 0.8, min: 0.1, max: 1.0, step: 0.05 }
  });
  
  // Create geometry and material
  const { geometry, material } = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    
    // Set position attribute
    geom.setAttribute('position', new THREE.Float32BufferAttribute(plyData.positions, 3));
    
    // Set color attribute (normalized to 0-1 range)
    const normalizedColors = new Float32Array(plyData.colors.length);
    for (let i = 0; i < plyData.colors.length; i++) {
      normalizedColors[i] = plyData.colors[i] / 255.0;
    }
    geom.setAttribute('color', new THREE.Float32BufferAttribute(normalizedColors, 3));
    
    // Create material
    const mat = new THREE.PointsMaterial({
      size: pointSize,
      sizeAttenuation: true,
      transparent: true,
      opacity: opacity,
      vertexColors: true,
      depthWrite: false
    });
    
    // Compute bounding sphere for camera positioning
    geom.computeBoundingSphere();
    
    console.log(`Gaussian Splats: ${plyData.vertexCount} points, bounding sphere radius: ${geom.boundingSphere?.radius.toFixed(2)}`);
    
    return { geometry: geom, material: mat };
  }, [plyData, pointSize, opacity]);
  
  // Update material properties
  useEffect(() => {
    if (material) {
      material.size = pointSize;
      material.opacity = opacity;
      material.needsUpdate = true;
    }
  }, [material, pointSize, opacity]);
  
  // Auto-focus camera on load
  useEffect(() => {
    if (geometry.boundingSphere && camera) {
      const sphere = geometry.boundingSphere;
      const distance = sphere.radius * 3;
      
      // Position camera to view entire point cloud
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.position.set(distance * 0.7, distance * 0.5, distance * 0.7);
        camera.lookAt(sphere.center);
        camera.updateProjectionMatrix();
        
        console.log(`Camera positioned at distance: ${distance.toFixed(2)}`);
      }
    }
  }, [geometry, camera]);
  
  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}

/**
 * 📊 PLY LOADER HOOK: Async data loading with error handling
 * 
 * Loads PLY files from public/assets/splats/ with state management.
 * Returns loading, error, and data states for external UI handling.
 */
function usePlyLoader(url: string) {
  const [plyData, setPlyData] = useState<PLYParseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Loading PLY file: ${url}`);
        const data = await loadPlyFromUrl(url);
        
        if (mounted) {
          setPlyData(data);
          setLoading(false);
          console.log(`PLY loaded successfully: ${data.vertexCount} vertices`);
        }
      } catch (err) {
        if (mounted) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error loading PLY file';
          setError(errorMsg);
          setLoading(false);
          console.error('PLY loading failed:', errorMsg);
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [url]);
  
  return { plyData, loading, error };
}

/**
 * 🎮 SIMPLE DEMO SCENE: Basic 3D scene for testing
 * 
 * Fallback scene in case PLY loading fails.
 */
function SimpleDemoScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="orange" wireframe />
    </mesh>
  );
}

/**
 * 🎯 MAIN COMPONENT: Gaussian Splatting Viewer
 * 
 * Complete 3D viewer with PLY loading and interactive controls.
 * UI states handled outside Canvas to avoid R3F namespace conflicts.
 */
export default function SplatViewer() {
  // Performance optimization - clamp device pixel ratio
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2);
  
  // Asset configuration
  const plyUrl = '/assets/splats/scene.ply';
  
  // Load PLY data with custom hook
  const { plyData, loading, error } = usePlyLoader(plyUrl);
  
  // Loading state - show outside Canvas
  if (loading) {
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="animate-spin w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full mb-4"></div>
          <div className="text-lg font-semibold">Loading Gaussian Splats...</div>
          <div className="text-sm text-gray-400 mt-2">Parsing PLY point cloud data...</div>
        </div>
      </div>
    );
  }
  
  // Error state - show outside Canvas
  if (error) {
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-red-900/20 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-red-500/20">
        <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-lg font-semibold mb-2">Failed to load PLY file</div>
          <div className="text-sm text-gray-400 max-w-md text-center mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }
  
  // No data state
  if (!plyData) {
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-center h-full text-gray-400">
          <div>No PLY data available</div>
        </div>
      </div>
    );
  }
  
  // Success state - render 3D scene
  return (
    <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl relative">
      <Canvas
        dpr={dpr}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        camera={{ position: [5, 3, 5], fov: 60 }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        
        {/* Render PLY data - no HTML elements inside Canvas */}
        <Suspense fallback={<SimpleDemoScene />}>
          <GaussianSplatPoints plyData={plyData} />
        </Suspense>
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.8}
          rotateSpeed={0.4}
          minDistance={1}
          maxDistance={50}
          maxPolarAngle={Math.PI}
        />
        
        {/* Development helpers */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <axesHelper args={[2]} />
            <gridHelper args={[10, 10]} />
          </>
        )}
      </Canvas>
      
      {/* UI Overlay - positioned outside Canvas */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <div className="font-semibold mb-1">Gaussian Splatting Demo</div>
        <div className="text-xs text-gray-300">Drag to orbit • Scroll to zoom • Leva panel for controls</div>
      </div>
      
      {/* Performance indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-300">
        DPR: {dpr.toFixed(1)} • WebGL Optimized
      </div>
    </div>
  );
}
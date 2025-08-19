"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import FallbackPoster from "./FallbackPoster";
import PerformanceMonitor from "./PerformanceMonitor";

interface WebGPUViewerProps {
  title: string;
  description: string;
  gradient: string;
  children: React.ReactNode;
  requiresWebGPU?: boolean;
  showPerformanceMonitor?: boolean;
  fallbackVideoUrl?: string;
  fallbackImageUrl?: string;
  minFps?: number;
  maxMemory?: number;
  onPerformanceIssue?: (reason: string) => void;
}

interface WebGPUCapabilities {
  webgl: boolean;
  webgl2: boolean;
  webgpu: boolean;
  hardwareAcceleration: boolean;
}

export default function WebGPUViewer({
  title,
  description,
  gradient,
  children,
  requiresWebGPU = false,
  showPerformanceMonitor = true,
  fallbackVideoUrl,
  fallbackImageUrl,
  minFps = 30,
  maxMemory = 1000,
  onPerformanceIssue
}: WebGPUViewerProps) {
  const [capabilities, setCapabilities] = useState<WebGPUCapabilities>({
    webgl: false,
    webgl2: false,
    webgpu: false,
    hardwareAcceleration: false
  });
  const [isReady, setIsReady] = useState(false);
  const [shouldShowFallback, setShouldShowFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState<'webgl' | 'webgpu' | 'performance' | 'reduced-motion' | 'mobile'>('webgl');
  const [dpr, setDpr] = useState(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const performanceHistoryRef = useRef<number[]>([]);
  const lastPerformanceCheckRef = useRef(Date.now());

  // Detect capabilities
  useEffect(() => {
    const detectCapabilities = async () => {
      const caps: WebGPUCapabilities = {
        webgl: false,
        webgl2: false,
        webgpu: false,
        hardwareAcceleration: false
      };

      // Test WebGL
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const gl2 = canvas.getContext('webgl2');
        
        caps.webgl = !!gl;
        caps.webgl2 = !!gl2;
        
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            caps.hardwareAcceleration = !renderer.includes('SwiftShader') && !renderer.includes('Microsoft');
          }
        }
      } catch (e) {
        console.warn('WebGL detection failed:', e);
      }

      // Test WebGPU
      try {
        if ('gpu' in navigator) {
          const adapter = await (navigator as any).gpu.requestAdapter();
          caps.webgpu = !!adapter;
        }
      } catch (e) {
        console.warn('WebGPU detection failed:', e);
      }

      setCapabilities(caps);
      return caps;
    };

    detectCapabilities();
  }, []);

  // Check reduced motion and device pixel ratio
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMotionChange);

    // Set initial DPR with performance considerations
    const isMobile = window.innerWidth < 768;
    const baseDpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    setDpr(baseDpr);

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Determine if we should show fallback
  useEffect(() => {
    let shouldFallback = false;
    let reason: typeof fallbackReason = 'webgl';

    if (prefersReducedMotion) {
      shouldFallback = true;
      reason = 'reduced-motion';
    } else if (requiresWebGPU && !capabilities.webgpu) {
      shouldFallback = true;
      reason = 'webgpu';
    } else if (!capabilities.webgl) {
      shouldFallback = true;
      reason = 'webgl';
    } else if (window.innerWidth < 768 && !capabilities.hardwareAcceleration) {
      shouldFallback = true;
      reason = 'mobile';
    }

    setShouldShowFallback(shouldFallback);
    setFallbackReason(reason);
    setIsReady(true);
  }, [capabilities, prefersReducedMotion, requiresWebGPU]);

  // Performance monitoring
  const handlePerformanceUpdate = useCallback((metrics: any) => {
    const now = Date.now();
    
    // Only check performance every 5 seconds to avoid too frequent switches
    if (now - lastPerformanceCheckRef.current < 5000) return;
    
    performanceHistoryRef.current.push(metrics.fps);
    
    // Keep last 12 samples (1 minute at 5s intervals)
    if (performanceHistoryRef.current.length > 12) {
      performanceHistoryRef.current.shift();
    }
    
    // If we have enough samples and consistent low performance
    if (performanceHistoryRef.current.length >= 6) {
      const avgFps = performanceHistoryRef.current.reduce((a, b) => a + b, 0) / performanceHistoryRef.current.length;
      const memoryIssue = metrics.memory > maxMemory;
      
      if (avgFps < minFps || memoryIssue) {
        const reason = memoryIssue ? 'Memory usage too high' : 'Consistent low FPS';
        onPerformanceIssue?.(reason);
        
        // Automatically reduce quality
        setDpr(prev => Math.max(0.5, prev * 0.8));
      }
    }
    
    lastPerformanceCheckRef.current = now;
  }, [minFps, maxMemory, onPerformanceIssue]);

  const handleLaunchAttempt = () => {
    // Try to force launch even with compatibility issues
    setShouldShowFallback(false);
  };

  if (!isReady) {
    return (
      <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm">Detecting capabilities...</p>
        </div>
      </div>
    );
  }

  if (shouldShowFallback) {
    return (
      <FallbackPoster
        title={title}
        description={description}
        gradient={gradient}
        reason={fallbackReason}
        onLaunch={requiresWebGPU && !capabilities.webgpu ? undefined : handleLaunchAttempt}
        launchDisabled={requiresWebGPU && !capabilities.webgpu}
        videoUrl={fallbackVideoUrl}
        staticImageUrl={fallbackImageUrl}
      />
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black">
      {/* Performance Monitor */}
      {showPerformanceMonitor && !prefersReducedMotion && (
        <PerformanceMonitor
          show={true}
          position="top-right"
          onMetricsUpdate={handlePerformanceUpdate}
        />
      )}

      {/* 3D Canvas */}
      <Canvas
        dpr={dpr}
        gl={{ 
          antialias: dpr <= 1,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000);
        }}
      >
        <color attach="background" args={[0, 0, 0]} />
        {children}
      </Canvas>

      {/* Capability Info (Dev Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white p-2 rounded text-xs font-mono">
          <div>WebGL: {capabilities.webgl ? '✓' : '✗'}</div>
          <div>WebGL2: {capabilities.webgl2 ? '✓' : '✗'}</div>
          <div>WebGPU: {capabilities.webgpu ? '✓' : '✗'}</div>
          <div>HW Accel: {capabilities.hardwareAcceleration ? '✓' : '✗'}</div>
          <div>DPR: {dpr.toFixed(1)}</div>
        </div>
      )}
    </div>
  );
}
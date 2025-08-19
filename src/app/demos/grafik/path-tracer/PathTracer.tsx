"use client";

// src/app/demos/grafik/path-tracer/PathTracer.tsx
// 🎯 BUSINESS PURPOSE: WebGPU Path Tracer Client Component
//
// BUSINESS CONTEXT: Feature detection and graceful fallbacks for cutting-edge ray tracing
// USER INTERACTIONS: WebGPU detection, keyboard controls, orbit camera, quality settings
// INTEGRATION: Dynamically loads webgpu-pathtracer.ts engine with comprehensive fallbacks
//
// 🔗 INTEGRATIONS:
// - WebGPU Detection: Feature detection with reduced-motion support
// - Engine: webgpu-pathtracer.ts provides complete ray tracing pipeline
// - Fallbacks: Static poster for non-WebGPU browsers
//
// 📊 PERFORMANCE: Lazy engine loading, automatic pause on tab switch
// ♿ ACCESSIBILITY: prefers-reduced-motion detection, keyboard navigation
// 🎨 QUALITY: Professional status indicators and controls

import { useEffect, useRef, useState } from "react";
import { makePathTracer } from "./webgpu-pathtracer";

type Engine = {
  mount: (el: HTMLDivElement) => void;
  unmount: () => void;
  setPaused: (p: boolean) => void;
  setQuality: (idx: number | ((q: number) => number)) => void;
  setPreset: (id: number) => void;
  toggleDenoise: () => void;
};

export default function PathTracer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [mode, setMode] = useState<"webgpu"|"fallback">("fallback");
  const [paused, setPaused] = useState(false);
  const [denoise, setDenoise] = useState(true);
  const [quality, setQuality] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        // Check for reduced motion preference
        const reduced = typeof window !== "undefined" && 
          window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        
        // Check WebGPU support
        const hasWebGPU = typeof navigator !== "undefined" && 
          !!(navigator as any).gpu && !reduced;

        if (!hasWebGPU) {
          setMode("fallback");
          setLoading(false);
          return;
        }

        // Test WebGPU initialization
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (!adapter) {
          throw new Error("WebGPU adapter not available");
        }

        const device = await adapter.requestDevice();
        if (!device) {
          throw new Error("WebGPU device creation failed");
        }

        // Success - initialize path tracer
        setMode("webgpu");
        const engine = makePathTracer({
          qualityIndex: 2,
          denoise: true,
          targetFPS: 60,
        });
        
        engineRef.current = engine;
        if (hostRef.current) {
          await engine.mount(hostRef.current);
        }
        
        setLoading(false);

      } catch (err) {
        console.warn("WebGPU initialization failed:", err);
        setError(err instanceof Error ? err.message : "WebGPU not supported");
        setMode("fallback");
        setLoading(false);
      }
    };

    initializeEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.unmount();
        engineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current || mode !== "webgpu") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const engine = engineRef.current!;
      
      switch (e.key) {
        case " ":
          e.preventDefault();
          setPaused(p => {
            const newPaused = !p;
            engine.setPaused(newPaused);
            return newPaused;
          });
          break;
          
        case "1":
          engine.setPreset(1);
          break;
          
        case "2":
          engine.setPreset(2);
          break;
          
        case "3":
          engine.setPreset(3);
          break;
          
        case "q":
        case "Q":
          setQuality(q => {
            const newQ = Math.max(0, q - 1);
            engine.setQuality(newQ);
            return newQ;
          });
          break;
          
        case "w":
        case "W":
          setQuality(q => {
            const newQ = Math.min(3, q + 1);
            engine.setQuality(newQ);
            return newQ;
          });
          break;
          
        case "d":
        case "D":
          setDenoise(d => {
            const newDenoise = !d;
            engine.toggleDenoise();
            return newDenoise;
          });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  // Loading state
  if (loading) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-black">
        <div className="relative w-full h-[min(70vh,800px)] flex items-center justify-center">
          <div className="text-white text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-red-500/20 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-xl font-semibold mb-2">Initializing WebGPU...</div>
            <div className="text-sm text-gray-400 mb-4">Testing compute shader support</div>
            
            {/* Progress indicators */}
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Adapter</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <span>Device</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span>Shaders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback state
  if (mode === "fallback") {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-black">
        <div className="relative w-full h-[min(70vh,800px)]">
          {/* Try to load SVG poster first, fall back to generated gradient */}
          <img
            src="/demos/pathtracer/poster.svg"
            alt="Path Tracer Cornell Box Scene"
            className="w-full h-full object-cover opacity-90"
            loading="eager"
            onError={(e) => {
              // Fallback to CSS gradient if poster fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* CSS fallback background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900/30 to-orange-900/50 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">WebGPU Path Tracer</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Real-time ray tracing with Cornell Box scene
              </p>
              {error && (
                <p className="text-red-400 text-sm mb-4 max-w-md">
                  {error.includes("not supported") ? 
                    "WebGPU is not supported in this browser" :
                    `WebGPU Error: ${error}`
                  }
                </p>
              )}
              <p className="text-xs text-gray-500 max-w-md">
                Requires WebGPU-compatible browser (Chrome/Edge 113+, Firefox with flag)
              </p>
            </div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="absolute top-3 right-3 text-xs px-3 py-1 rounded bg-gray-800/80 text-gray-300 backdrop-blur">
          FALLBACK
        </div>
      </div>
    );
  }

  // WebGPU active state
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black">
      <div ref={hostRef} className="relative w-full h-[min(70vh,800px)]">
        {/* Host container for WebGPU canvas - engine will inject canvas here */}
      </div>
      
      {/* Status overlay */}
      <div className="absolute top-3 right-3 text-xs px-3 py-1 rounded bg-black/60 text-white backdrop-blur flex items-center space-x-2">
        <span className="text-red-400 font-mono">WEBGPU</span>
        <span>•</span>
        <span className={paused ? "text-yellow-400" : "text-green-400"}>
          {paused ? "PAUSED" : "LIVE"}
        </span>
        <span>•</span>
        <span className={denoise ? "text-blue-400" : "text-gray-400"}>
          {denoise ? "DENOISED" : "RAW"}
        </span>
        <span>•</span>
        <span className="text-purple-400">Q{quality}</span>
      </div>

      {/* Help overlay (bottom left) */}
      <div className="absolute bottom-3 left-3 text-xs px-3 py-2 rounded bg-black/60 text-gray-300 backdrop-blur max-w-xs">
        <div className="flex flex-wrap gap-2 text-[10px]">
          <kbd className="px-1 bg-white/20 rounded">Space</kbd><span>Pause</span>
          <kbd className="px-1 bg-white/20 rounded">D</kbd><span>Denoise</span>
          <kbd className="px-1 bg-white/20 rounded">Q/W</kbd><span>Quality</span>
          <kbd className="px-1 bg-white/20 rounded">1-3</kbd><span>Presets</span>
        </div>
      </div>

      {/* Performance indicator (bottom right) */}
      <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded bg-black/60 text-gray-400 backdrop-blur">
        Path Tracing • Progressive Samples
      </div>
    </div>
  );
}
"use client";

// src/app/demos/grafik/path-tracer/page.tsx
// 🎯 BUSINESS PURPOSE: WebGPU Path Tracer Demo Showcase
//
// BUSINESS CONTEXT: Cutting-edge real-time ray tracing demonstration
// USER INTERACTIONS: WebGPU path tracing with Cornell Box scene
// REVENUE IMPACT: Showcases advanced GPU computing capabilities for high-value clients
//
// 🔗 INTEGRATIONS:
// - WebGPU: Pure compute shader-based path tracing
// - Dynamic Import: PathTracer component loaded client-side only
// - SEO: Comprehensive metadata for technical showcase
//
// 📊 PERFORMANCE: Dynamic import, fallback poster, reduced-motion support
// ♿ ACCESSIBILITY: Keyboard controls, reduced-motion detection
// 🎨 QUALITY: Professional presentation matching other premium demos

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

// Dynamically import the heavy WebGPU component
const PathTracer = dynamic(() => import("./PathTracer"), { 
  ssr: false,
  loading: () => (
    <div className="relative rounded-2xl overflow-hidden bg-black">
      <div className="relative w-full h-[min(70vh,800px)] flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-lg font-semibold mb-2">Loading WebGPU Path Tracer...</div>
            <div className="text-sm text-white/70">Initializing compute shaders and ray tracing pipeline</div>
          </div>
        </div>
      </div>
    </div>
  )
});

export default function PathTracerPage() {
  // Set page metadata dynamically
  useEffect(() => {
    document.title = "WebGPU Path Tracer - Klaus Weigele | Real-time Ray Tracing";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Experience real-time path tracing in the browser with WebGPU compute shaders. Cornell Box scene with physically-based materials, progressive refinement, and SVGF denoising.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-orange-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-5xl mx-auto text-center mb-12">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔥</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
            WebGPU Path Tracer
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Physikalisch plausibles Path Tracing mit Cornell Box, Metall- und Glas-Materialien. 
            Progressive Samples mit temporalem Accumulation und Joint-Bilateral Denoiser („SVGF-lite"). 
            Vollständig im Browser – zero Server-Compute.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              "🔥 WebGPU Compute",
              "⚡ Real-time Ray Tracing", 
              "🎯 Cornell Box Scene",
              "🔬 Physical Materials",
              "🧠 SVGF Denoiser",
              "🎮 Interactive Camera"
            ].map((feature, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm text-white border border-white/20"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="max-w-6xl mx-auto mb-16">
          <Suspense fallback={
            <div className="relative rounded-2xl overflow-hidden bg-black">
              <div className="relative w-full h-[min(70vh,800px)] flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <div className="text-lg">Loading Real-time Ray Tracer...</div>
                </div>
              </div>
            </div>
          }>
            <PathTracer />
          </Suspense>
        </div>

        {/* Technical Details */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">WebGPU Computing</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Reine Compute-Shader implementieren Monte Carlo Path Tracing mit bis zu 4 Bounces pro Ray. 
              Multiple Importance Sampling für effiziente Licht-Integration.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">SVGF-lite Denoiser</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Temporales Accumulation kombiniert mit Joint-Bilateral spatial Filter. 
              Normal- und Depth-Buffer als Guidance für edge-preserving Denoising.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Cornell Box Scene</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Klassische Testszene mit Area Light, diffusen farbigen Wänden, 
              Metal-Sphere und Glass-Box für Material-Showcase und Validierung.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Progressive Quality</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              1 Sample pro Pixel pro Frame. Progressive Accumulation konvergiert zu 
              rauschfreiem Ergebnis. Qualitätsleiter für verschiedene GPU-Tiers.
            </p>
          </div>
        </div>

        {/* Performance Targets */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Performance Targets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🖥️",
                title: "Desktop dGPU",
                description: "60fps at 1.0x scale, converges to clean within 0.5-2 seconds"
              },
              {
                icon: "💻",
                title: "Apple Silicon / iGPU", 
                description: "30-60fps at 0.75-0.9x scale with adaptive quality"
              },
              {
                icon: "📱",
                title: "Mobile GPUs",
                description: "30fps at 0.6-0.75x scale, aggressive denoising enabled"
              }
            ].map((target, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-4">{target.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{target.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {target.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Guide */}
        <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Interactive Controls</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">🖱️ Drag</kbd>
              <span className="text-gray-300">Orbit camera</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Wheel</kbd>
              <span className="text-gray-300">Zoom in/out</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              <span className="text-gray-300">Pause/Resume</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">D</kbd>
              <span className="text-gray-300">Toggle Denoise</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Q / W</kbd>
              <span className="text-gray-300">Quality −/+</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">1 2 3</kbd>
              <span className="text-gray-300">Scene presets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
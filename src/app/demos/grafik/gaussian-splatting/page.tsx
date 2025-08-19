"use client";

// src/app/demos/grafik/gaussian-splatting/page.tsx
// Gaussian Splatting - Photorealistic 3D Reconstruction
// Modern client-side page with dynamic import and professional presentation

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

// Dynamically import the heavy 3D component
const GaussianSplattingViewer = dynamic(() => import("./GaussianSplattingViewer"), { 
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-orange-900 rounded-2xl flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <div className="text-lg font-semibold mb-2">Loading Gaussian Splats...</div>
        <div className="text-sm text-white/70">Photorealistic PLY Point Cloud</div>
      </div>
    </div>
  )
});

export default function GaussianSplattingPage() {
  // Set page metadata dynamically
  useEffect(() => {
    document.title = "Gaussian Splatting - Klaus Weigele | Photorealistic 3D Reconstruction";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Experience photorealistic 3D reconstruction through Gaussian Splatting technology - neural networks convert photography into navigable 3D worlds with unprecedented realism.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-orange-950 to-red-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📊</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
            Gaussian Splatting
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Photorealistic 3D reconstruction from neural networks and multi-view photography.
            Navigate through real scenes converted to interactive 3D worlds.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              "📊 2.3M Splats",
              "🧠 Neural Reconstruction", 
              "📷 Multi-View Synthesis",
              "🎯 Interactive Hotspots",
              "💡 Photorealistic Rendering",
              "🔍 Depth-of-Field"
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
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-orange-900 rounded-2xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg">Loading Photorealistic 3D...</div>
              </div>
            </div>
          }>
            <GaussianSplattingViewer />
          </Suspense>
        </div>

        {/* Technical Details */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Neural Reconstruction</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Advanced neural networks process multi-view photography to create millions of 3D Gaussian primitives
              that represent real-world scenes with unprecedented fidelity.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Gaussian Primitives</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Instead of traditional polygons, millions of 3D Gaussian discs provide smooth,
              photorealistic rendering with natural depth-of-field and volumetric effects.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Performance</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              WebGL optimization and progressive level-of-detail ensure smooth 60fps navigation
              through photorealistic scenes on consumer hardware.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Interactive Hotspots</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Contextual information points within the 3D scene provide business insights
              and technical details about the reconstruction process.
            </p>
          </div>
        </div>

        {/* Applications */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Business Applications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏢",
                title: "Virtual Showrooms",
                description: "Photorealistic product presentation with full 360° navigation capability"
              },
              {
                icon: "🏠",
                title: "Real Estate Tours",
                description: "Immersive property walkthroughs that feel like physical visits"
              },
              {
                icon: "🎓",
                title: "Training Environments",
                description: "Realistic training scenarios captured from real-world locations"
              }
            ].map((app, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-4">{app.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{app.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {app.description}
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
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Click</kbd>
              <span className="text-gray-300">Select hotspots</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Leva</kbd>
              <span className="text-gray-300">Adjust parameters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
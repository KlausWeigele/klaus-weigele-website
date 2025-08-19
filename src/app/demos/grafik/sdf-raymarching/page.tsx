"use client";

// src/app/demos/grafik/sdf-raymarching/page.tsx
// SDF Raymarching - Procedural 3D Worlds
// Client-side page with dynamic import and demo introduction

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

const Raymarcher = dynamic(() => import("./Raymarcher"), { 
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏗️</span>
        </div>
        <div className="text-lg font-semibold mb-2">Loading Procedural 3D Worlds...</div>
        <div className="text-sm text-white/70">ChatGPT5 SDF Raymarcher</div>
      </div>
    </div>
  )
});

export default function SDFRaymarchingPage() {
  // Set page metadata dynamically
  useEffect(() => {
    document.title = "SDF Raymarching - Klaus Weigele | Procedural 3D Worlds";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore procedural 3D worlds generated entirely in fragment shaders using Signed Distance Fields (SDF) and sphere tracing raymarching techniques.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🏗️</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            SDF Raymarching
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Procedural 3D worlds generated entirely with mathematics in fragment shaders.
            Experience real-time raymarching through Signed Distance Fields.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              "🎯 Sphere Tracing",
              "🌆 City Blocks",
              "🔬 Microstructure",
              "🎨 Minimal Sculpt",
              "💡 Cinematic Lighting",
              "🌅 Time-of-Day"
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
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg">Loading Procedural Worlds...</div>
              </div>
            </div>
          }>
            <Raymarcher />
          </Suspense>
        </div>

        {/* Technical Details */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📐</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Signed Distance Fields</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Every object is defined by mathematical functions that return the distance to the nearest surface.
              This enables perfect procedural geometry without polygons.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Sphere Tracing</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Raymarching technique that steps through space using distance field values.
              Guarantees no surface intersections are missed while maintaining performance.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Cinematic Lighting</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Advanced shading with soft shadows, ambient occlusion, and specular highlights.
              ACES tonemapping provides professional color grading.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Performance</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              5-level quality scaling from mobile to desktop. Adaptive LOD ensures smooth 
              60fps performance across devices.
            </p>
          </div>
        </div>

        {/* World Presets */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Procedural Worlds</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏙️",
                title: "City Blocks",
                description: "Urban landscape with procedural buildings, windows, and architectural details"
              },
              {
                icon: "🔬",
                title: "Chip Microstructure",
                description: "Silicon wafer surface with circuit patterns and microscopic electronic structures"
              },
              {
                icon: "🎨",
                title: "Minimal Sculpt",
                description: "Abstract geometric forms with smooth transitions and artistic compositions"
              }
            ].map((preset, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center">
                <div className="text-4xl mb-4">{preset.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{preset.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {preset.description}
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
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">1-3</kbd>
              <span className="text-gray-300">Switch worlds</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              <span className="text-gray-300">Pause/Resume</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Q/A</kbd>
              <span className="text-gray-300">Quality up/down</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">H</kbd>
              <span className="text-gray-300">Toggle controls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
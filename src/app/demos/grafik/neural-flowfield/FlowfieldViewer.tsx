"use client";

import { useEffect, useRef, useState } from "react";
import { makeFlowfieldWebGL2 } from "./flowfield-webgl2";
import { makeFlowfieldWebGPU } from "./flowfield-webgpu";
import { useAudioRMS, AudioModulator } from "./useAudio";

type Engine = {
  mount: (el: HTMLDivElement) => void;
  unmount: () => void;
  setPreset: (id: number) => void;
  setPaused: (p: boolean) => void;
  setAudioLevel?: (v: number) => void;
};

type RenderMode = "auto" | "webgpu" | "webgl2" | "fallback";

export default function FlowfieldViewer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const audioModulatorRef = useRef(new AudioModulator());
  
  const [mode, setMode] = useState<RenderMode>("auto");
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(1);

  // Audio level handler
  const handleAudioLevel = (level: number) => {
    const modulator = audioModulatorRef.current;
    modulator.updateLevel(level);
    
    // Pass modulated audio to engine
    if (engineRef.current?.setAudioLevel) {
      engineRef.current.setAudioLevel(modulator.getTurbulenceBoost());
    }
  };

  // Initialize audio system
  const { stop: stopAudio } = useAudioRMS(audioEnabled ? handleAudioLevel : () => {});

  // Engine initialization and capability detection
  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion) {
      setMode("fallback");
      return;
    }

    // Detect WebGPU capability
    const hasWebGPU = typeof navigator !== "undefined" && !!(navigator as any).gpu;
    const chosenMode: RenderMode = hasWebGPU ? "webgpu" : "webgl2";
    setMode(chosenMode);

    // Initialize engine
    const initializeEngine = async () => {
      if (!hostRef.current) return;

      try {
        let engine: Engine;
        
        if (chosenMode === "webgpu") {
          console.log("🚀 Initializing WebGPU Neural Flowfield (1M+ particles)");
          engine = makeFlowfieldWebGPU({ targetFPS: 60 });
        } else {
          console.log("⚡ Initializing WebGL2 Neural Flowfield (512K particles)");
          engine = makeFlowfieldWebGL2({ targetFPS: 60 });
        }

        engineRef.current = engine;
        await engine.mount(hostRef.current);

        // Set initial preset
        engine.setPreset(currentPreset);
        
      } catch (error) {
        console.error("Engine initialization failed:", error);
        setMode("fallback");
      }
    };

    initializeEngine();

    // Event listeners
    const handleVisibilityChange = () => {
      if (engineRef.current) {
        engineRef.current.setPaused(document.hidden);
        setPaused(document.hidden);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          const newPaused = !paused;
          setPaused(newPaused);
          engineRef.current.setPaused(newPaused);
          break;
          
        case "1":
        case "2": 
        case "3":
          const preset = parseInt(e.key);
          setCurrentPreset(preset);
          engineRef.current.setPreset(preset);
          break;
          
        case "h":
        case "H":
          e.preventDefault();
          setShowControls(!showControls);
          break;
          
        case "a":
        case "A":
          e.preventDefault();
          setAudioEnabled(!audioEnabled);
          break;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      if (engineRef.current) {
        engineRef.current.unmount();
        engineRef.current = null;
      }
      
      stopAudio();
    };
  }, [paused, showControls, audioEnabled, currentPreset]);

  // Fallback for unsupported devices or reduced motion
  if (mode === "fallback") {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="aspect-[16/9] w-full flex items-center justify-center">
          <div className="text-white text-center p-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Neural Flowfield Preview</h3>
            <p className="text-white/70 mb-4">
              Interactive GPU particle system with 1M+ particles forming "KLAUS WEIGELE" logo
            </p>
            <p className="text-sm text-white/50">
              Enable hardware acceleration or use a modern browser for the full experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black">
      {/* Main rendering canvas */}
      <div 
        ref={hostRef} 
        className="relative w-full aspect-[16/9] cursor-crosshair"
        style={{ minHeight: "400px" }}
      />
      
      {/* Status indicator */}
      <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-white/10 text-white backdrop-blur">
        {mode.toUpperCase()}
        {paused && " · PAUSED"}
        {audioEnabled && " · 🎵"}
      </div>

      {/* Loading indicator */}
      {!engineRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm">
              Initializing {mode === "webgpu" ? "WebGPU" : "WebGL2"} Neural Flowfield...
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {mode === "webgpu" ? "Computing 1M+ particles..." : "Loading particle system..."}
            </p>
          </div>
        </div>
      )}

      {/* Controls panel */}
      {showControls && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white min-w-[280px]">
          <h3 className="text-sm font-semibold mb-3 text-blue-300">Neural Flowfield Controls</h3>
          
          <div className="space-y-3">
            {/* Presets */}
            <div>
              <label className="text-xs text-gray-300 block mb-2">Force Field Presets:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 1, name: "Balanced", desc: "🌊 Natural" },
                  { id: 2, name: "Chaotic", desc: "⚡ Energy" },
                  { id: 3, name: "Logo", desc: "📝 Formation" }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setCurrentPreset(preset.id);
                      engineRef.current?.setPreset(preset.id);
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentPreset === preset.id 
                        ? "bg-blue-600 text-white" 
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {preset.desc}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio toggle */}
            <div>
              <label className="text-xs text-gray-300 block mb-2">Audio Reactivity:</label>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`w-full px-3 py-2 rounded transition-colors text-sm ${
                  audioEnabled 
                    ? "bg-green-600/70 hover:bg-green-600" 
                    : "bg-gray-600/70 hover:bg-gray-600"
                }`}
              >
                {audioEnabled ? "🎵 Audio ON" : "🔇 Audio OFF"}
              </button>
            </div>

            {/* Pause toggle */}
            <button
              onClick={() => {
                const newPaused = !paused;
                setPaused(newPaused);
                engineRef.current?.setPaused(newPaused);
              }}
              className="w-full px-3 py-2 bg-purple-600/70 hover:bg-purple-600 rounded transition-colors text-sm"
            >
              {paused ? "▶️ Resume" : "⏸️ Pause"}
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <div>🖱️ Mouse/Touch: Create vortex</div>
            <div>⌨️ Space: Pause/Resume</div>
            <div>⌨️ 1-3: Change preset</div>
            <div>⌨️ H: Toggle controls</div>
            <div>⌨️ A: Toggle audio</div>
          </div>
        </div>
      )}

      {/* Help hint */}
      {!showControls && engineRef.current && (
        <div className="absolute bottom-4 left-4 text-xs text-white/70">
          Press <kbd className="bg-white/20 px-1 rounded">H</kbd> for controls
        </div>
      )}

      {/* Particle count indicator */}
      {engineRef.current && (
        <div className="absolute bottom-4 right-4 text-xs text-white/70">
          {mode === "webgpu" ? "1M+" : "512K"} particles
        </div>
      )}
    </div>
  );
}
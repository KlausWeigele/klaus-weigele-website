// src/app/demos/grafik/neural-flowfield/useAudio.ts
// Simple RMS audio meter for microphone input (optional)
// Modulates particle turbulence, size, and glow based on audio amplitude

import { useEffect, useRef } from "react";

export function useAudioRMS(onLevel: (level: number) => void) {
  const stopRef = useRef<(() => void) | null>(null);
  const isActiveRef = useRef(false);
  
  useEffect(() => {
    let ctx: AudioContext | undefined;
    let rafId = 0;
    
    const initAudio = async () => {
      try {
        // Request user permission for microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          }
        });
        
        ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        
        // Configure analyser for RMS measurement
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.3;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        source.connect(analyser);
        
        // RMS calculation loop
        const computeRMS = () => {
          if (!isActiveRef.current) return;
          
          analyser.getByteTimeDomainData(dataArray);
          
          // Calculate RMS (Root Mean Square)
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const sample = (dataArray[i] - 128) / 128; // Normalize to [-1, 1]
            sum += sample * sample;
          }
          
          const rms = Math.sqrt(sum / dataArray.length);
          
          // Smooth and amplify the signal
          const smoothed = Math.min(rms * 3, 1.0);
          onLevel(smoothed);
          
          rafId = requestAnimationFrame(computeRMS);
        };
        
        isActiveRef.current = true;
        computeRMS();
        
        // Cleanup function
        stopRef.current = () => {
          isActiveRef.current = false;
          cancelAnimationFrame(rafId);
          stream.getTracks().forEach(track => track.stop());
          ctx?.close();
        };
        
      } catch (error) {
        // Audio permission denied or not available
        // Still allow demo to run without audio-reactivity
        console.log("Audio access not available:", error);
        onLevel(0);
      }
    };
    
    initAudio();
    
    return () => {
      stopRef.current?.();
    };
  }, [onLevel]);
  
  return {
    stop: () => stopRef.current?.(),
    isActive: isActiveRef.current
  };
}

// Audio-reactive parameter modulation
export class AudioModulator {
  private level = 0;
  private smoothedLevel = 0;
  private peak = 0;
  private peakDecay = 0.95;
  private smoothing = 0.1;
  
  updateLevel(rawLevel: number) {
    this.level = rawLevel;
    
    // Smooth the audio level for gradual changes
    this.smoothedLevel += (this.level - this.smoothedLevel) * this.smoothing;
    
    // Track peaks for sudden audio spikes
    if (this.level > this.peak) {
      this.peak = this.level;
    } else {
      this.peak *= this.peakDecay;
    }
  }
  
  // Get modulated parameters for different effects
  getTurbulenceBoost(): number {
    return 1.0 + this.smoothedLevel * 2.0;
  }
  
  getSizeMultiplier(): number {
    return 1.0 + this.peak * 0.5;
  }
  
  getGlowIntensity(): number {
    return 0.3 + this.smoothedLevel * 0.7;
  }
  
  getColorShift(): number {
    return this.peak * 0.2; // Subtle hue shift on audio peaks
  }
  
  // For WebGPU compute shader uniforms
  getUniformValues() {
    return {
      audioLevel: this.smoothedLevel,
      audioPeak: this.peak,
      turbulenceBoost: this.getTurbulenceBoost(),
      sizeMultiplier: this.getSizeMultiplier(),
      glowIntensity: this.getGlowIntensity(),
      colorShift: this.getColorShift(),
    };
  }
}

// Preset audio-reactive behaviors
export const AUDIO_PRESETS = {
  subtle: {
    turbulenceMultiplier: 0.5,
    sizeMultiplier: 0.3,
    colorIntensity: 0.2,
  },
  moderate: {
    turbulenceMultiplier: 1.0,
    sizeMultiplier: 0.6,
    colorIntensity: 0.4,
  },
  intense: {
    turbulenceMultiplier: 2.0,
    sizeMultiplier: 1.0,
    colorIntensity: 0.8,
  },
} as const;
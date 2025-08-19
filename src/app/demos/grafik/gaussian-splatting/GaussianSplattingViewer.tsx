// src/app/demos/grafik/gaussian-splatting/GaussianSplattingViewer.tsx
// 🎯 BUSINESS PURPOSE: Main Gaussian Splatting demonstration component
//
// BUSINESS CONTEXT: Primary showcase for photorealistic 3D reconstruction technology
// USER INTERACTIONS: Full-featured 3D viewer with PLY asset loading and interactive controls
// INTEGRATION: Bridges page.tsx layout with SplatViewer.tsx core functionality
//
// 🔗 INTEGRATIONS:
// - Layout: Used by page.tsx as dynamically imported component
// - Rendering: Wraps SplatViewer.tsx with error boundaries and loading states
// - Assets: Loads scene.ply from public/assets/splats/
//
// 📊 PERFORMANCE: Lazy loading, error boundaries, graceful degradation
// ♿ ACCESSIBILITY: Screen reader support, keyboard navigation
// 🎨 QUALITY: Consistent with other demo components, professional presentation

"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the heavy SplatViewer component
const SplatViewer = dynamic(() => import('./SplatViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex flex-col items-center justify-center h-full text-white">
        {/* Loading animation */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <div className="text-xl font-semibold mb-2">Loading Gaussian Splats...</div>
        <div className="text-sm text-gray-400 mb-4">Initializing WebGL renderer and parsing PLY data</div>
        
        {/* Progress indicators */}
        <div className="flex space-x-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>WebGL Context</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <span>PLY Parser</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span>Shader Compilation</span>
          </div>
        </div>
      </div>
    </div>
  )
});

/**
 * 🚨 ERROR FALLBACK: Graceful failure handling
 * 
 * Provides user-friendly error messages and recovery options.
 * Handles WebGL compatibility issues and asset loading failures.
 */
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  console.error('Gaussian Splatting Error:', error);
  
  // Determine error type for user-friendly messages
  const getErrorMessage = (error: Error) => {
    const message = error.message.toLowerCase();
    
    if (message.includes('webgl')) {
      return {
        title: 'WebGL Not Available',
        description: 'This demo requires WebGL support. Please try a different browser or enable hardware acceleration.',
        suggestion: 'Chrome, Firefox, or Safari with WebGL enabled'
      };
    }
    
    if (message.includes('ply') || message.includes('fetch')) {
      return {
        title: 'Asset Loading Failed',
        description: 'Could not load the PLY point cloud data. Please check your network connection.',
        suggestion: 'Try refreshing the page or check your internet connection'
      };
    }
    
    if (message.includes('memory') || message.includes('buffer')) {
      return {
        title: 'Insufficient GPU Memory',
        description: 'Your device may not have enough GPU memory for this demo.',
        suggestion: 'Try closing other browser tabs or use a device with more GPU memory'
      };
    }
    
    return {
      title: 'Rendering Error',
      description: 'An unexpected error occurred while rendering the 3D scene.',
      suggestion: 'Try refreshing the page or contact support if the issue persists'
    };
  };
  
  const errorInfo = getErrorMessage(error);
  
  return (
    <div className="w-full aspect-[16/9] bg-gradient-to-br from-red-900/20 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-red-500/20">
      <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
        {/* Error icon */}
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        
        {/* Error message */}
        <h3 className="text-xl font-semibold mb-3">{errorInfo.title}</h3>
        <p className="text-gray-300 mb-4 max-w-md leading-relaxed">{errorInfo.description}</p>
        <p className="text-sm text-gray-400 mb-6 max-w-md">{errorInfo.suggestion}</p>
        
        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>
        
        {/* Technical details (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left max-w-md">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
              Technical Details
            </summary>
            <pre className="text-xs text-red-400 mt-2 bg-black/30 p-3 rounded overflow-x-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * 💡 CAPABILITY DETECTION: WebGL and device compatibility
 * 
 * Checks browser capabilities and device specifications.
 * Provides warnings for sub-optimal configurations.
 */
function CapabilityCheck({ children }: { children: React.ReactNode }) {
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const checkCapabilities = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        setSupported(false);
        return;
      }
      
      setSupported(true);
      
      const newWarnings: string[] = [];
      
      // Check GPU memory (rough estimation)
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer.toLowerCase().includes('software') || renderer.toLowerCase().includes('llvmpipe')) {
          newWarnings.push('Software rendering detected - performance may be limited');
        }
      }
      
      // Check device pixel ratio for high-DPI displays
      if (window.devicePixelRatio > 2) {
        newWarnings.push('High-DPI display detected - performance may be reduced');
      }
      
      // Check available memory (if available)
      const memory = (performance as any).memory;
      if (memory && memory.usedJSHeapSize > 100 * 1024 * 1024) { // > 100MB
        newWarnings.push('High memory usage detected - close other tabs for best performance');
      }
      
      setWarnings(newWarnings);
    };
    
    checkCapabilities();
  }, []);
  
  if (supported === false) {
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/20">
        <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🚫</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">WebGL Not Supported</h3>
          <p className="text-gray-300 mb-4 max-w-md">
            Your browser or device doesn't support WebGL, which is required for this 3D demo.
          </p>
          <p className="text-sm text-gray-400 mb-6 max-w-md">
            Please try Chrome, Firefox, or Safari with hardware acceleration enabled.
          </p>
          <a
            href="https://get.webgl.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
          >
            Check WebGL Support
          </a>
        </div>
      </div>
    );
  }
  
  if (supported === null) {
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-center h-full text-white">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div>Checking device capabilities...</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {children}
      
      {/* Performance warnings */}
      {warnings.length > 0 && (
        <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3 text-yellow-100 text-sm max-w-xs">
          <div className="font-semibold mb-1">⚠️ Performance Notes:</div>
          <ul className="text-xs space-y-1">
            {warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * 🎯 MAIN COMPONENT: Gaussian Splatting Viewer
 * 
 * Complete demo component with error handling, capability detection, and loading states.
 * Integrates all sub-components for a polished user experience.
 */
export default function GaussianSplattingViewer() {
  // Check if react-error-boundary is available, otherwise use a simple try-catch approach
  try {
    // Try to use ErrorBoundary if available
    const { ErrorBoundary } = require('react-error-boundary');
    
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CapabilityCheck>
          <Suspense fallback={
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <div className="text-lg">Loading 3D Engine...</div>
                </div>
              </div>
            </div>
          }>
            <SplatViewer />
          </Suspense>
        </CapabilityCheck>
      </ErrorBoundary>
    );
  } catch (e) {
    // Fallback if ErrorBoundary is not available
    return (
      <CapabilityCheck>
        <Suspense fallback={
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-lg">Loading 3D Engine...</div>
              </div>
            </div>
          </div>
        }>
          <SplatViewer />
        </Suspense>
      </CapabilityCheck>
    );
  }
}
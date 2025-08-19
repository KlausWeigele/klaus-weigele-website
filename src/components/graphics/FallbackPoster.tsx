"use client";

import { useEffect, useState } from "react";
import { Play, AlertTriangle, Monitor, Zap } from "lucide-react";

interface FallbackPosterProps {
  title: string;
  description: string;
  gradient: string;
  onLaunch?: () => void;
  launchDisabled?: boolean;
  reason?: 'webgl' | 'webgpu' | 'performance' | 'reduced-motion' | 'mobile';
  staticImageUrl?: string;
  videoUrl?: string;
}

export default function FallbackPoster({
  title,
  description,
  gradient,
  onLaunch,
  launchDisabled = false,
  reason = 'webgl',
  staticImageUrl,
  videoUrl
}: FallbackPosterProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const reasonMessages = {
    webgl: {
      icon: AlertTriangle,
      title: "WebGL Not Supported",
      message: "Your browser doesn't support WebGL or it's disabled. Try updating your browser or enabling hardware acceleration.",
      color: "text-red-600"
    },
    webgpu: {
      icon: Zap,
      title: "WebGPU Not Available",
      message: "This demo requires WebGPU. Try Chrome 113+ with experimental features enabled, or view the fallback video.",
      color: "text-orange-600"
    },
    performance: {
      icon: Monitor,
      title: "Performance Mode",
      message: "Running in compatibility mode for better performance on your device.",
      color: "text-blue-600"
    },
    'reduced-motion': {
      icon: AlertTriangle,
      title: "Reduced Motion",
      message: "Animations disabled based on your accessibility preferences. Static preview shown.",
      color: "text-green-600"
    },
    mobile: {
      icon: Monitor,
      title: "Mobile Optimized",
      message: "Showing optimized experience for mobile devices.",
      color: "text-blue-600"
    }
  };

  const reasonConfig = reasonMessages[reason];
  const ReasonIcon = reasonConfig.icon;

  return (
    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${gradient} opacity-20`} />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px, 30px 30px'
        }} />
      </div>

      {/* Video Background (if available and motion allowed) */}
      {videoUrl && showVideo && !prefersReducedMotion && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={() => setShowVideo(false)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Static Image (if available) */}
      {staticImageUrl && !showVideo && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${staticImageUrl})` }}
        />
      )}

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white p-8 max-w-md">
        <div className="mb-6">
          <div className={`w-20 h-20 ${gradient} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
            <ReasonIcon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Reason Message */}
        <div className="mb-6 p-4 bg-black/30 rounded-xl backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ReasonIcon className={`w-4 h-4 ${reasonConfig.color}`} />
            <span className={`text-sm font-semibold ${reasonConfig.color}`}>
              {reasonConfig.title}
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {reasonConfig.message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Launch Button */}
          {onLaunch && (
            <button
              onClick={onLaunch}
              disabled={launchDisabled}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                launchDisabled 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{launchDisabled ? 'Demo Unavailable' : 'Try Launch Anyway'}</span>
            </button>
          )}

          {/* Video Toggle */}
          {videoUrl && !prefersReducedMotion && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors duration-200 backdrop-blur-sm"
            >
              {showVideo ? 'Show Static View' : 'Show Preview Video'}
            </button>
          )}
        </div>

        {/* System Info */}
        <div className="mt-6 text-xs text-gray-400 text-center">
          <p>For best experience: Chrome 113+, Firefox 110+, Safari 16.4+</p>
        </div>
      </div>

      {/* Corner Tech Badge */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
        Fallback Mode
      </div>
    </div>
  );
}
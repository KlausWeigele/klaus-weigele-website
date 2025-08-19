"use client";

import { useState, useRef } from "react";
import { Brain } from "lucide-react";

interface MousePosition {
  x: number;
  y: number;
}

export default function InteractiveHeroVisual() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ 
      x: x * 6, // Max 6px movement
      y: y * 6 
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative">
      {/* Radial Glow Background */}
      <div className="absolute inset-0 -m-16 rounded-full bg-gradient-radial from-blue-500/15 via-blue-600/10 to-transparent opacity-60 blur-xl"></div>
      
      {/* Main Card */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-square bg-gradient-to-br from-blue-100 to-gray-100 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden hover-micro-lift will-change-transform backface-hidden"
      >
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 mesh-gradient"></div>
        
        {/* Interactive Brain Icon */}
        <div 
          className="relative transition-transform duration-150 ease-out will-change-transform"
          style={{ 
            transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)` 
          }}
        >
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center radial-glow">
            <Brain className="w-16 h-16 text-white animate-subtle-float" />
          </div>
        </div>
        
        {/* Light Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
        
        {/* Professional Details */}
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <p className="text-gray-700 font-medium">Max Mustermann</p>
          <p className="text-sm text-gray-500">Diplom-Ingenieur Informatik</p>
        </div>
        
        {/* Floating Success Indicators */}
        <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl hover-micro-lift">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <div>
              <div className="font-bold text-gray-900 text-sm">4.9/5.0</div>
              <div className="text-xs text-gray-600">Kundenbewertung</div>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl hover-micro-lift">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <div>
              <div className="font-bold text-gray-900 text-sm">100%</div>
              <div className="text-xs text-gray-600">Projekterfolg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon, Zap, AlertTriangle, Monitor } from "lucide-react";

interface AdvancedDemoCardProps {
  title: string;
  subtitle: string;
  description: string;
  complexity: 'medium' | 'high' | 'extreme';
  performance: string;
  technologies: string[];
  href: string;
  icon: LucideIcon;
  gradient: string;
  webgpuRequired?: boolean;
  systemRequirements?: string;
}

export default function AdvancedDemoCard({
  title,
  subtitle,
  description,
  complexity,
  performance,
  technologies,
  href,
  icon: Icon,
  gradient,
  webgpuRequired = false,
  systemRequirements
}: AdvancedDemoCardProps) {
  const complexityConfig = {
    medium: { color: 'text-green-700', bg: 'bg-green-100', label: 'Medium' },
    high: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'High' },
    extreme: { color: 'text-red-700', bg: 'bg-red-100', label: 'Extreme' }
  };

  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        {/* Header with Icon and WebGPU Badge */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          
          {webgpuRequired && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              WebGPU
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
          {description}
        </p>

        {/* Complexity & Performance */}
        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
          <div className={`p-3 rounded-xl ${complexityConfig[complexity].bg}`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-4 h-4 ${complexityConfig[complexity].color}`} />
              <span className={`text-xs font-semibold ${complexityConfig[complexity].color}`}>
                Complexity
              </span>
            </div>
            <div className={`text-sm font-bold ${complexityConfig[complexity].color} mt-1`}>
              {complexityConfig[complexity].label}
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-semibold text-blue-700">Performance</span>
            </div>
            <div className="text-sm font-bold text-blue-700 mt-1">{performance}</div>
          </div>
        </div>

        {/* System Requirements */}
        {systemRequirements && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl relative z-10">
            <div className="text-xs font-semibold text-yellow-800 mb-1">System Requirements:</div>
            <div className="text-xs text-yellow-700">{systemRequirements}</div>
          </div>
        )}

        {/* Technologies */}
        <div className="mb-6 relative z-10">
          <div className="text-sm text-gray-600 mb-3 font-medium">Technologies:</div>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between text-blue-600 font-semibold relative z-10">
          <span>Launch 3D Demo</span>
          <div className="flex items-center">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>

        {/* Hover Animation Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </Link>
  );
}
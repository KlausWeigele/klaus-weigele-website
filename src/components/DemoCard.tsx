"use client";

import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface DemoCardProps {
  title: string;
  description: string;
  technologies: string[];
  businessValue: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  previewImage?: string;
}

export default function DemoCard({
  title,
  description,
  technologies,
  businessValue,
  href,
  icon: Icon,
  gradient,
  previewImage
}: DemoCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
        {/* Header with Icon and Gradient */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        {/* Preview Visual (if provided) */}
        {previewImage && (
          <div className="mb-6 h-32 bg-gray-100 rounded-xl overflow-hidden">
            <div className={`w-full h-full ${gradient} opacity-20 flex items-center justify-center`}>
              <Icon className="w-12 h-12 text-gray-600" />
            </div>
          </div>
        )}

        {/* Title and Description */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Business Value */}
        <div className="mb-6 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
          <div className="text-sm text-green-700 font-medium mb-1">Business Value:</div>
          <div className="text-sm text-green-800">{businessValue}</div>
        </div>

        {/* Technologies */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-3 font-medium">Key Technologies:</div>
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
        <div className="flex items-center justify-between text-blue-600 font-semibold">
          <span>Live Demo ansehen</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}
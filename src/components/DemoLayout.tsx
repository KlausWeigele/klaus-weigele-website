"use client";

import Link from "next/link";
import Navigation from "./Navigation";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface DemoLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  children: React.ReactNode;
}

export default function DemoLayout({
  title,
  description,
  icon: Icon,
  gradient,
  children
}: DemoLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full filter blur-xl opacity-60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#demos" className="hover:text-blue-600 transition-colors">
              Demo-Projekte
            </Link>
            <span>/</span>
            <span className="text-gray-900">{title}</span>
          </div>

          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-6">
              <div className={`w-20 h-20 ${gradient} rounded-3xl flex items-center justify-center`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {title}
                </h1>
                <p className="text-xl text-gray-700 max-w-2xl">
                  {description}
                </p>
              </div>
            </div>
            
            <Link
              href="/#demos"
              className="hidden lg:flex items-center px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Zurück zu Demos
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {children}
      </main>

      {/* Back to Demos CTA - Mobile */}
      <div className="lg:hidden sticky bottom-4 mx-4 mb-4">
        <Link
          href="/#demos"
          className="flex items-center justify-center w-full px-6 py-4 bg-blue-600 text-white rounded-xl shadow-xl font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück zu Demo-Projekten
        </Link>
      </div>
    </div>
  );
}
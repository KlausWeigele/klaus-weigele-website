"use client";

import { Suspense } from "react";
import DemoLayout from "../../../../components/DemoLayout";
import { Cube } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the heavy 3D component
const SDFRaymarchingViewer = dynamic(() => import("./SDFRaymarchingViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm">Loading SDF Raymarcher...</p>
        <p className="text-xs text-gray-400 mt-2">Compiling fragment shaders...</p>
      </div>
    </div>
  )
});

export default function SDFRaymarchingDemo() {
  return (
    <DemoLayout
      title="SDF Raymarching"
      description="Prozedurale 3D-Welten mit Sphere Tracing und Signed Distance Fields"
      icon={Cube}
      gradient="bg-gradient-to-br from-purple-500 to-purple-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Mathematisch perfekte 3D-Welten
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Diese Demo zeigt das Raymarching von Signed Distance Fields (SDF) - eine Technik, 
            die vollständig mathematisch definierte 3D-Welten in Echtzeit rendert. Statt klassischer 
            Polygon-Geometrie werden 3D-Objekte durch mathematische Funktionen beschrieben, 
            die den Abstand zu den nächsten Oberflächen berechnen.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sphere Tracing Algorithm</h3>
                <p className="text-gray-600">Intelligent ray stepping basierend auf SDF-Distanzwerten für präzises Rendering</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Prozedurale Geometrie</h3>
                <p className="text-gray-600">Komplexe 3D-Strukturen entstehen durch Kombination primitiver SDF-Funktionen</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Advanced Lighting</h3>
                <p className="text-gray-600">Soft Shadows, Ambient Occlusion und Global Illumination durch Volumen-Sampling</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Infinite Detail</h3>
                <p className="text-gray-600">Mathematische Perfektion ohne Polygon-Limitierungen oder Textur-Auflösung</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Rendering Specs</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">2K</div>
              <div className="text-sm text-gray-700">Target Resolution</div>
              <div className="text-xs text-gray-500 mt-1">Fragment Shader</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">128</div>
              <div className="text-sm text-gray-700">Max Ray Steps</div>
              <div className="text-xs text-gray-500 mt-1">Sphere Tracing</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-violet-600">16</div>
              <div className="text-sm text-gray-700">Shadow Samples</div>
              <div className="text-xs text-gray-500 mt-1">Soft Shadows</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <div className="text-xs font-semibold text-indigo-800 mb-1">GPU Requirements:</div>
            <div className="text-xs text-indigo-700 space-y-1">
              <div>• Fragment Performance Focus</div>
              <div>• High Memory Bandwidth</div>
              <div>• WebGL2 Float Textures</div>
              <div>• Modern Shader Cores</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive SDF Raymarching</h3>
          <p className="text-gray-700">
            Explore die prozedurale 3D-Welt. Die Kamera bewegt sich automatisch durch verschiedene SDF-Strukturen. 
            Das gesamte Rendering läuft in einem Fragment-Shader - keine Polygone, nur Mathematik.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse w-16 h-16 bg-purple-600/20 rounded-full mx-auto mb-4"></div>
              <p>Compiling SDF Fragment Shaders...</p>
            </div>
          </div>
        }>
          <SDFRaymarchingViewer />
        </Suspense>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          SDF Raymarching Pipeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">SDF</span>
            </div>
            <h4 className="font-semibold text-gray-900">Distance Functions</h4>
            <p className="text-sm text-gray-600 mt-2">Mathematische Primitive (Sphere, Box, Torus) als Bausteine</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">CSG</span>
            </div>
            <h4 className="font-semibold text-gray-900">Boolean Operations</h4>
            <p className="text-sm text-gray-600 mt-2">Union, Subtraction, Intersection für komplexe Formen</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">RAY</span>
            </div>
            <h4 className="font-semibold text-gray-900">Sphere Tracing</h4>
            <p className="text-sm text-gray-600 mt-2">Adaptive ray stepping mit SDF-guided marching</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">AO</span>
            </div>
            <h4 className="font-semibold text-gray-900">Ambient Occlusion</h4>
            <p className="text-sm text-gray-600 mt-2">Volume-based occlusion sampling für realistic lighting</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Interessiert an prozeduralen 3D-Welten für Ihr Projekt?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
          >
            SDF Raymarching Projekt besprechen
            <Cube className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Algorithm Deep Dive */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">GLSL Fragment Shader Code</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">1. SDF Primitive Functions</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Basic SDF primitives in GLSL
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">2. Scene Composition with CSG</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Combine SDFs with boolean operations
float opUnion(float d1, float d2) { return min(d1, d2); }
float opSubtraction(float d1, float d2) { return max(-d1, d2); }
float opIntersection(float d1, float d2) { return max(d1, d2); }

float map(vec3 pos) {
    float city = sdBox(pos - vec3(0, -2, 0), vec3(8, 1, 8));
    float towers = sdBox(pos - vec3(2, 0, 2), vec3(0.5, 3, 0.5));
    return opUnion(city, towers);
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">3. Sphere Tracing Algorithm</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Raymarching with sphere tracing
float raymarch(vec3 ro, vec3 rd) {
    float dO = 0.0;
    
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        float dS = map(p);
        dO += dS;
        
        if(dO > MAX_DIST || abs(dS) < SURF_DIST) break;
    }
    
    return dO;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
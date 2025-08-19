"use client";

import { Suspense } from "react";
import DemoLayout from "../../../../components/DemoLayout";
import { Cube } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the heavy 3D component
const GaussianSplattingViewer = dynamic(() => import("./GaussianSplattingViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm">Loading Gaussian Splats...</p>
        <p className="text-xs text-gray-400 mt-2">Streaming 30MB photorealistic data...</p>
      </div>
    </div>
  )
});

export default function GaussianSplattingDemo() {
  return (
    <DemoLayout
      title="Gaussian Splatting"
      description="Fotorealistische 3D-Navigation durch Gaussian Splat Reconstruction"
      icon={Cube}
      gradient="bg-gradient-to-br from-orange-500 to-orange-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Die Zukunft der fotorealistischen 3D-Darstellung
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Gaussian Splatting revolutioniert 3D-Rendering durch fotorealistische Rekonstruktion 
            echter Szenen. Statt traditioneller Meshes verwendet diese Technik millionen von 
            3D-Gaussian-Primitiven, die echte Fotografien als navigierbare 3D-Welten darstellen. 
            Das Ergebnis ist unvergleichliche Fotorealismus bei Echtzeit-Performance.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">3D Gaussian Primitives</h3>
                <p className="text-gray-600">Millionen von 3D-Gaussians statt Polygonen für perfekte Fotorealismus</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Neural Reconstruction</h3>
                <p className="text-gray-600">AI-basierte Rekonstruktion aus Multi-View-Fotografien</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Rendering</h3>
                <p className="text-gray-600">Echtzeit-Navigation mit Depth-of-Field und volumetrischen Effekten</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Hotspots</h3>
                <p className="text-gray-600">Case-Study-Tooltips und interaktive Punkte in der 3D-Szene</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Splat Metrics</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-orange-600">2.3M</div>
              <div className="text-sm text-gray-700">Gaussian Splats</div>
              <div className="text-xs text-gray-500 mt-1">Neural Reconstruction</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-red-600">30MB</div>
              <div className="text-sm text-gray-700">Scene Assets</div>
              <div className="text-xs text-gray-500 mt-1">Streaming LOD</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-amber-600">∞</div>
              <div className="text-sm text-gray-700">View Angles</div>
              <div className="text-xs text-gray-500 mt-1">6DOF Navigation</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="text-xs font-semibold text-red-800 mb-1">⚡ WebGPU Required:</div>
            <div className="text-xs text-red-700 space-y-1">
              <div>• Chrome 113+ Mandatory</div>
              <div>• 4GB+ GPU Memory</div>
              <div>• High Memory Bandwidth</div>
              <div>• Dedicated Graphics Card</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Gaussian Splat Scene</h3>
          <p className="text-gray-700 mb-4">
            Navigiere frei durch die fotorealistische 3D-Rekonstruktion. Die Szene besteht aus 
            millionen von 3D-Gaussians, die eine echte Fotographie als navigierbare Welt darstellen. 
            Klicke auf Hotspots für Case-Study-Details.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
              <div className="font-semibold text-orange-800">🎯 Interactive Hotspots</div>
              <div className="text-sm text-orange-700 mt-1">Klickbare Punkte mit Case Studies</div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl">
              <div className="font-semibold text-red-800">🔍 Depth of Field</div>
              <div className="text-sm text-red-700 mt-1">Fotorealistische Tiefenschärfe</div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
              <div className="font-semibold text-amber-800">📐 6DOF Navigation</div>
              <div className="text-sm text-amber-700 mt-1">Vollständige 3D-Bewegungsfreiheit</div>
            </div>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse w-16 h-16 bg-orange-600/20 rounded-full mx-auto mb-4"></div>
              <p>Streaming Gaussian Splat Data...</p>
              <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto mt-3">
                <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>
        }>
          <GaussianSplattingViewer />
        </Suspense>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Gaussian Splatting Pipeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">📸</span>
            </div>
            <h4 className="font-semibold text-gray-900">Multi-View Capture</h4>
            <p className="text-sm text-gray-600 mt-2">Structure-from-Motion aus mehreren Kamerawinkeln</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">🧠</span>
            </div>
            <h4 className="font-semibold text-gray-900">Neural Training</h4>
            <p className="text-sm text-gray-600 mt-2">3D-Gaussian-Parameter durch Gradient Descent optimiert</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900">WebGPU Rendering</h4>
            <p className="text-sm text-gray-600 mt-2">Echtzeit-Splatting mit Compute Shaders</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">🎮</span>
            </div>
            <h4 className="font-semibold text-gray-900">Interactive UI</h4>
            <p className="text-sm text-gray-600 mt-2">Hotspots, Tooltips und Depth-of-Field-Kontrollen</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Interessiert an fotorealistischen 3D-Experiences?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-lg"
          >
            Gaussian Splatting Projekt besprechen
            <Cube className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Gaussian Splatting Algorithm</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">1. 3D Gaussian Representation</h4>
            <p className="text-gray-700 mb-4">
              Jeder 3D-Gaussian wird durch 14 Parameter beschrieben: Position (3D), Rotation (4D Quaternion), 
              Skalierung (3D), Opazität (1D) und spherische harmonische Koeffizienten (3D RGB).
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// 3D Gaussian Parameters
struct GaussianSplat {
    vec3 position;        // World space center
    vec4 rotation;        // Quaternion orientation  
    vec3 scale;           // Anisotropic scaling
    float opacity;        // Alpha transparency
    vec3 color;           // RGB appearance
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">2. Differentiable Rendering</h4>
            <p className="text-gray-700 mb-4">
              Das Rendering ist vollständig differenzierbar, wodurch Gradient-basierte Optimierung 
              der Gaussian-Parameter durch Backpropagation möglich wird.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Splatting Rendering Pipeline
vec4 renderPixel(vec2 screenPos, GaussianSplat[] splats) {
    vec4 color = vec4(0);
    float T = 1.0; // Transmittance
    
    for (auto splat : sortedSplats) {
        float alpha = computeAlpha(splat, screenPos);
        color += T * alpha * splat.color;
        T *= (1.0 - alpha);
        if (T < 0.001) break; // Early termination
    }
    return color;
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">3. Adaptive Density Control</h4>
            <p className="text-gray-700 mb-4">
              Während des Trainings werden automatisch neue Gaussians hinzugefügt oder entfernt 
              basierend auf Gradienten-Magnitudes und Opacity-Thresholds.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Adaptive Gaussian Management
if (gradient_magnitude > threshold_high) {
    // Split large Gaussians
    createNewGaussian(splat.position + offset);
} else if (splat.opacity < threshold_low) {
    // Remove transparent Gaussians  
    removeSplat(splat);
}`}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-2">🚀 Warum Gaussian Splatting revolutionär ist:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>• <strong>Fotorealismus:</strong> Unvergleichliche Bildqualität vs. Meshes</div>
            <div>• <strong>Performance:</strong> Echtzeit-Rendering bei hoher Auflösung</div>
            <div>• <strong>Speicher-Effizienz:</strong> Kompaktere Darstellung als Voxel</div>
            <div>• <strong>View Synthesis:</strong> Perfekte Novel-View-Generation</div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
"use client";

import { Suspense } from "react";
import DemoLayout from "../../../../components/DemoLayout";
import { Waves } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the heavy 3D component
const NeuralFlowfieldViewer = dynamic(() => import("./NeuralFlowfieldViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm">Loading Neural Flowfield...</p>
        <p className="text-xs text-gray-400 mt-2">Initializing GPU compute shaders...</p>
      </div>
    </div>
  )
});

export default function NeuralFlowfieldDemo() {
  return (
    <DemoLayout
      title="Neural Flowfield"
      description="Millionen GPU-Partikel in curl-noise Vektorfeldern mit Logo-Formation"
      icon={Waves}
      gradient="bg-gradient-to-br from-blue-500 to-blue-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            GPU-Partikel-System der nächsten Generation
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Diese Demo zeigt ein hochmodernes GPU-Partikel-System mit bis zu 4 Millionen Partikeln 
            auf Desktop-Systemen. Die Partikel folgen curl-noise Vektorfeldern und können dynamisch 
            "KLAUS WEIGELE" oder andere Logos formen. Die Implementierung nutzt WebGPU Compute Shaders 
            für maximale Performance oder fällt elegant auf WebGL2 Float-Textures zurück.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Massive Parallelisierung</h3>
                <p className="text-gray-600">WebGPU Compute Shaders verarbeiten Millionen Partikel parallel auf der GPU</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Curl-Noise Algorithmus</h3>
                <p className="text-gray-600">Mathematisch elegante Strömungsfelder für natürliche Partikelbewegungen</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Logo-Formation SDF</h3>
                <p className="text-gray-600">Signed Distance Fields für präzise Text- und Logo-Formationen</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Vortizes</h3>
                <p className="text-gray-600">Maus/Touch-gesteuerte Wirbel beeinflussen das Partikelfeld in Echtzeit</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Specs</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">4M</div>
              <div className="text-sm text-gray-700">Partikel (Desktop)</div>
              <div className="text-xs text-gray-500 mt-1">WebGPU</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">150K</div>
              <div className="text-sm text-gray-700">Partikel (Mobile)</div>
              <div className="text-xs text-gray-500 mt-1">WebGL2</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">60fps</div>
              <div className="text-sm text-gray-700">Target Performance</div>
              <div className="text-xs text-gray-500 mt-1">Adaptive Quality</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="text-xs font-semibold text-yellow-800 mb-1">System Requirements:</div>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>• WebGPU: Chrome 113+</div>
              <div>• WebGL2: Modern Browser</div>
              <div>• Hardware Acceleration</div>
              <div>• 2GB+ GPU Memory</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Neural Flowfield</h3>
          <p className="text-gray-700">
            Move your mouse over the demo to create vortices. The particles will flow around your cursor 
            and form the "KLAUS WEIGELE" logo. On touch devices, tap and drag to interact.
          </p>
        </div>
        
        <Suspense fallback={
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse w-16 h-16 bg-blue-600/20 rounded-full mx-auto mb-4"></div>
              <p>Initializing GPU Compute Pipeline...</p>
            </div>
          </div>
        }>
          <NeuralFlowfieldViewer />
        </Suspense>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Technical Implementation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">GPU</span>
            </div>
            <h4 className="font-semibold text-gray-900">Compute Shaders</h4>
            <p className="text-sm text-gray-600 mt-2">WebGPU WGSL pipeline for particle position and velocity updates</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">SDF</span>
            </div>
            <h4 className="font-semibold text-gray-900">Distance Fields</h4>
            <p className="text-sm text-gray-600 mt-2">Signed Distance Functions for precise text and logo formation</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">∇</span>
            </div>
            <h4 className="font-semibold text-gray-900">Curl Noise</h4>
            <p className="text-sm text-gray-600 mt-2">Divergence-free vector fields for natural fluid-like motion</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">R3F</span>
            </div>
            <h4 className="font-semibold text-gray-900">React Three Fiber</h4>
            <p className="text-sm text-gray-600 mt-2">Modern React integration with Three.js instanced rendering</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Interessiert an GPU-Computing für Ihr nächstes Projekt?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            WebGPU Projekt besprechen
            <Waves className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Algorithm Deep Dive</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">1. Particle Initialization</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Initialize particles in circular distribution
for (let i = 0; i < particleCount; i++) {
  const angle = (i / particleCount) * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * initialRadius;
  positions[i * 3] = Math.cos(angle) * radius;
  positions[i * 3 + 1] = Math.sin(angle) * radius;
  positions[i * 3 + 2] = 0;
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">2. Curl-Noise Vector Field</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// WGSL Compute Shader for curl-noise
fn curlNoise(pos: vec3<f32>) -> vec3<f32> {
  let epsilon = 0.0001;
  let n1 = noise(pos + vec3<f32>(epsilon, 0.0, 0.0));
  let n2 = noise(pos - vec3<f32>(epsilon, 0.0, 0.0));
  let n3 = noise(pos + vec3<f32>(0.0, epsilon, 0.0));
  let n4 = noise(pos - vec3<f32>(0.0, epsilon, 0.0));
  
  return vec3<f32>((n3 - n4), (n1 - n2), 0.0) / (2.0 * epsilon);
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">3. Logo SDF Integration</h4>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Signed distance field for text attraction
fn textSDF(pos: vec2<f32>, text: &str) -> f32 {
  // Sample distance texture for "KLAUS WEIGELE"
  let uv = (pos * 0.5 + 0.5) * textureScale;
  let distance = textureSample(textSDF, sampler, uv).r;
  return (distance - 0.5) * attractionRadius;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
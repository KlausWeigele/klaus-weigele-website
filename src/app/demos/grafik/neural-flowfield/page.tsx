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
            <strong>Revolutionäre ChatGPT5-Implementation:</strong> Ein außergewöhnliches GPU-Partikel-System 
            mit bis zu 1M+ Partikeln, die durch drei kombinierbare Kraftfelder gesteuert werden. 
            Echte WebGPU Compute Shaders für Desktop-Performance, REGL WebGL2-Engine für Kompatibilität, 
            und Canvas-basierte SDF-Textures für präzise "KLAUS WEIGELE" Logo-Formation. 
            Mit Audio-Reaktivität und intelligenten Fallbacks.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">WebGPU Compute Shaders</h3>
                <p className="text-gray-600">Echte WGSL compute shaders mit 1M+ Partikeln auf modernen GPUs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Drei Kraftfelder (kombinierbar)</h3>
                <p className="text-gray-600">Curl-noise + SDF Logo-Attractor + Interactive Vortices</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Audio-Reaktivität</h3>
                <p className="text-gray-600">Mikrofon-Input moduliert Turbulenz und Partikel-Größe (opt-in)</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Intelligente Fallbacks</h3>
                <p className="text-gray-600">REGL WebGL2 → Static Poster → prefers-reduced-motion Support</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Specs</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">1M+</div>
              <div className="text-sm text-gray-700">Partikel (WebGPU)</div>
              <div className="text-xs text-gray-500 mt-1">WGSL Compute</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">512K</div>
              <div className="text-sm text-gray-700">Partikel (WebGL2)</div>
              <div className="text-xs text-gray-500 mt-1">REGL Engine</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">60fps</div>
              <div className="text-sm text-gray-700">Target Performance</div>
              <div className="text-xs text-gray-500 mt-1">Auto-Detection</div>
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
          <p className="text-gray-700 mb-4">
            <strong>Interaktive Controls:</strong> Bewege die Maus für Wirbel-Effekte, drücke <kbd className="bg-gray-200 px-1 rounded">H</kbd> für 
            erweiterte Controls, <kbd className="bg-gray-200 px-1 rounded">1-3</kbd> für Kraft-Presets, 
            <kbd className="bg-gray-200 px-1 rounded">A</kbd> für Audio-Reaktivität (Mikrofon-Zugriff), 
            und <kbd className="bg-gray-200 px-1 rounded">Space</kbd> zum Pausieren.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-center">
              <div className="font-semibold text-blue-800">🌊 Balanced</div>
              <div className="text-xs text-blue-700">Natürliche Strömung</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl text-center">
              <div className="font-semibold text-purple-800">⚡ Chaotic</div>
              <div className="text-xs text-purple-700">Energetische Turbulenzen</div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-center">
              <div className="font-semibold text-green-800">📝 Logo Focus</div>
              <div className="text-xs text-green-700">KLAUS WEIGELE Formation</div>
            </div>
          </div>
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
          ChatGPT5 Advanced Architecture 
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">WGSL</span>
            </div>
            <h4 className="font-semibold text-gray-900">WebGPU Compute</h4>
            <p className="text-sm text-gray-600 mt-2">Echte WGSL compute shaders mit 256 threads per workgroup</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">REGL</span>
            </div>
            <h4 className="font-semibold text-gray-900">WebGL2 Engine</h4>
            <p className="text-sm text-gray-600 mt-2">REGL ping-pong framebuffer simulation für broad compatibility</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">SDF</span>
            </div>
            <h4 className="font-semibold text-gray-900">Canvas SDF</h4>
            <p className="text-sm text-gray-600 mt-2">Canvas-blur pseudo-SDF für "KLAUS WEIGELE" logo attraction</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">🎵</span>
            </div>
            <h4 className="font-semibold text-gray-900">Audio RMS</h4>
            <p className="text-sm text-gray-600 mt-2">Web Audio API für microphone-driven particle turbulence</p>
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
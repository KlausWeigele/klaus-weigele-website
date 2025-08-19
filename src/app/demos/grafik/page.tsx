"use client";

import DemoLayout from "../../../components/DemoLayout";
import AdvancedDemoCard from "../../../components/graphics/AdvancedDemoCard";
import { BarChart3, Waves, Box, Sparkles, Zap, Droplets, Hexagon } from "lucide-react";

export default function GrafikDemo() {
  return (
    <DemoLayout
      title="Advanced Graphics & Visualization"
      description="7 hochmoderne WebGPU/WebGL2 Demos mit GPU-Computing und Real-time Rendering"
      icon={BarChart3}
      gradient="bg-gradient-to-br from-blue-500 to-blue-700"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white shadow-lg mb-6">
          🚀 Next-Generation Graphics Demos
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          GPU-Computing meets{' '}
          <span className="bg-purple-600 bg-clip-text text-transparent">
            Visual Excellence
          </span>
        </h1>
        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          7 technisch anspruchsvolle Demos zeigen moderne GPU-Computing, WebGPU Compute Shaders, 
          Real-time Ray Tracing und interactive Physik-Simulationen. Jede Demo repräsentiert 
          cutting-edge Web-Technologie für maximalen Wow-Effekt.
        </p>
      </div>

      {/* System Requirements Warning */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-12">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">High-Performance Demos</h3>
            <p className="text-yellow-800 mb-4">
              Diese Demos nutzen modernste GPU-Features für maximale Performance und Qualität. 
              Für beste Erfahrung empfohlen: Chrome 113+, Hardware-Beschleunigung aktiviert, 
              dedizierte Grafikkarte.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white rounded-lg px-3 py-2">
                <div className="font-semibold text-gray-900">WebGPU</div>
                <div className="text-gray-600">Chrome 113+</div>
              </div>
              <div className="bg-white rounded-lg px-3 py-2">
                <div className="font-semibold text-gray-900">WebGL2</div>
                <div className="text-gray-600">Fallback</div>
              </div>
              <div className="bg-white rounded-lg px-3 py-2">
                <div className="font-semibold text-gray-900">GPU Memory</div>
                <div className="text-gray-600">2GB+</div>
              </div>
              <div className="bg-white rounded-lg px-3 py-2">
                <div className="font-semibold text-gray-900">Target FPS</div>
                <div className="text-gray-600">60fps</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Demos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
        
        {/* Neural Flowfield - Signature Piece */}
        <div className="xl:col-span-2">
          <AdvancedDemoCard
            title="Neural Flowfield"
            subtitle="GPU Particle System (Signature Piece)"
            description="Millionen GPU-Partikel fließen durch curl-noise Vektorfelder und formen 'KLAUS WEIGELE' Logo mit Interactive Vortices und Audio-Reaktivität."
            complexity="extreme"
            performance="1M Particles"
            technologies={["WebGPU", "Compute Shaders", "Curl-Noise", "SDF", "R3F"]}
            href="/demos/grafik/neural-flowfield"
            icon={Waves}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            webgpuRequired={false}
            systemRequirements="Hardware acceleration, 2GB+ GPU memory"
          />
        </div>

        {/* SDF Raymarching */}
        <AdvancedDemoCard
          title="SDF Raymarching"
          subtitle="Procedural 3D Worlds"
          description="Vollbild Fragment-Shader mit Sphere Tracing auf Signed Distance Fields. Prozedurale Städte, Soft Shadows und Ambient Occlusion."
          complexity="high"
          performance="2K Resolution"
          technologies={["Fragment Shader", "GLSL", "SDF", "Ray Marching", "AO"]}
          href="/demos/grafik/sdf-raymarching"
          icon={Box}
          gradient="bg-gradient-to-br from-purple-500 to-purple-700"
          systemRequirements="Modern GPU with good fragment performance"
        />

        {/* Embedding Galaxy */}
        <AdvancedDemoCard
          title="Embedding Galaxy"
          subtitle="AI-Thema Interactive Pointcloud"
          description="10-50k Punkte in UMAP/t-SNE Layout zeigen AI-Themen als interaktive Galaxie mit Such-Interface und Cluster-Highlights."
          complexity="medium"
          performance="50K Points"
          technologies={["UMAP", "t-SNE", "Spatial Hashing", "WebGL2", "Instancing"]}
          href="/demos/grafik/embedding-galaxy"
          icon={Sparkles}
          gradient="bg-gradient-to-br from-green-500 to-green-700"
          systemRequirements="WebGL2 support, decent CPU for spatial queries"
        />

        {/* Gaussian Splatting */}
        <AdvancedDemoCard
          title="Gaussian Splatting"
          subtitle="Fotorealistische 3D Navigation"
          description="3D-Foto als Gaussian Splats mit freier Navigation, Depth-of-Field und Hotspots mit Case-Study-Tooltips für ultra-realistische Darstellung."
          complexity="extreme"
          performance="30MB Assets"
          technologies={["Gaussian Splats", ".splat", "LOD", "Frustum Culling", "Streaming"]}
          href="/demos/grafik/gaussian-splatting"
          icon={Box}
          gradient="bg-gradient-to-br from-orange-500 to-orange-700"
          webgpuRequired={true}
          systemRequirements="WebGPU, high memory bandwidth, 4GB+ GPU memory"
        />

        {/* WebGPU Path Tracer */}
        <AdvancedDemoCard
          title="WebGPU Path Tracer"
          subtitle="Physikalisch korrektes Rendering"
          description="Real-time Path Tracing mit SVGF Denoiser, Cornell-Box mit 'KW'-Skulptur, Metal-Roughness PBR und Area Lights für fotorealistische Ergebnisse."
          complexity="extreme"
          performance="Progressive"
          technologies={["Path Tracing", "SVGF", "BVH", "PBR", "Monte Carlo"]}
          href="/demos/grafik/pathtracer"
          icon={Zap}
          gradient="bg-gradient-to-br from-red-500 to-red-700"
          webgpuRequired={true}
          systemRequirements="WebGPU mandatory, RTX-class GPU recommended"
        />

        {/* Cloth × Fluid Lab */}
        <AdvancedDemoCard
          title="Cloth × Fluid Lab"
          subtitle="Interactive Physics Simulation"
          description="XPBD-Cloth (Logo-Flagge) in Fluid-Vortex-Field mit Tearing, Pin-Constraints und Textur-Upload. Windtunnel, Tornado und Micro-Ripples Modi."
          complexity="high"
          performance="256² Grid"
          technologies={["XPBD", "Fluid Sim", "Compute", "Physics", "Constraints"]}
          href="/demos/grafik/cloth-fluid"
          icon={Droplets}
          gradient="bg-gradient-to-br from-cyan-500 to-cyan-700"
          webgpuRequired={false}
          systemRequirements="Good compute performance, WebGL2 or WebGPU"
        />

        {/* Voronoi-Morphing */}
        <AdvancedDemoCard
          title="Voronoi-Morphing"
          subtitle="Organic to Geometric Patterns"
          description="Poisson-Disk Seeds → Voronoi → Lloyd-Relaxation. Morphing zwischen 'Obstgarten-Muster' und 'Stadt-Block-Raster' mit 3D-Extrusion."
          complexity="medium"
          performance="Realtime"
          technologies={["Voronoi", "Poisson-Disk", "Lloyd", "Morphing", "Extrusion"]}
          href="/demos/grafik/voronoi-morphing"
          icon={Hexagon}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          systemRequirements="Standard WebGL2, CPU-intensive algorithms"
        />

      </div>

      {/* Performance Recommendations */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Performance Guide & Browser Compatibility
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Optimal Experience</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Chrome 113+ (WebGPU)</div>
              <div>RTX 3060+ / RX 6600+</div>
              <div>16GB+ System RAM</div>
              <div>Hardware Acceleration ON</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">~</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Compatible</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Chrome 90+, Firefox 78+</div>
              <div>GTX 1060+ / RX 580+</div>
              <div>8GB+ System RAM</div>
              <div>WebGL2 Fallback</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">!</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Limited Support</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Mobile Browsers</div>
              <div>Integrated Graphics</div>
              <div>Safari &lt; 16.4</div>
              <div>Static Fallbacks</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="text-sm text-blue-800">
            <strong>💡 Pro Tip:</strong> Jede Demo bietet intelligente Fallbacks und Performance-Monitoring. 
            Bei niedrigerer Performance werden automatisch Partikel-Anzahl, Auflösung oder Qualitäts-Settings angepasst.
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Bereit für Ihr GPU-Computing Projekt?</h3>
        <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
          Diese Demos zeigen nur einen Bruchteil dessen, was mit modernen Web-GPU-Technologies möglich ist. 
          Von Real-time Simulationen bis hin zu fotorealistischem Rendering - lassen Sie uns gemeinsam 
          Ihre Vision umsetzen.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            WebGPU Projekt besprechen
          </a>
          
          <a
            href="/case-studies"
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-400 transition-colors border-2 border-white/20"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Erfolgsgeschichten ansehen
          </a>
        </div>
      </div>
    </DemoLayout>
  );
}
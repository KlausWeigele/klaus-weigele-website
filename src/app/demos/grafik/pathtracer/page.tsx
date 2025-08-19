"use client";

import { Suspense } from "react";
import DemoLayout from "../../../../components/DemoLayout";
import { Zap } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the heavy 3D component
const WebGPUPathTracerViewer = dynamic(() => import("./WebGPUPathTracerViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm">Loading Path Tracer...</p>
        <p className="text-xs text-gray-400 mt-2">Initializing WebGPU compute pipelines...</p>
      </div>
    </div>
  )
});

export default function PathTracerDemo() {
  return (
    <DemoLayout
      title="WebGPU Path Tracer"
      description="Physikalisch korrektes Real-time Ray Tracing mit Monte Carlo Path Tracing"
      icon={Zap}
      gradient="bg-gradient-to-br from-red-500 to-red-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Die nächste Stufe des fotorealistischen Renderings
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Unser WebGPU Path Tracer implementiert physikalisch basiertes Rendering mit Monte Carlo 
            Path Tracing in Echtzeit. Die klassische Cornell Box mit 'KW'-Skulptur demonstriert 
            Global Illumination, weiche Schatten, Caustics und perfekte Material-Interaktionen. 
            Jeder Pixel wird durch Millionen von Lichtstrahlen berechnet.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Monte Carlo Path Tracing</h3>
                <p className="text-gray-600">Unbiased physically-based light transport mit multiple bounces</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">PBR Material System</h3>
                <p className="text-gray-600">Metallische, dielektrische und emissive Materialien mit Mikrofacet-BRDF</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SVGF Denoising</h3>
                <p className="text-gray-600">Spatiotemporal Variance-Guided Filtering für noise-freie Bilder</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Progressive Rendering</h3>
                <p className="text-gray-600">Accumulation Buffer sammelt Samples für rauschfreie Konvergenz</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ray Tracing Specs</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-red-600">∞</div>
              <div className="text-sm text-gray-700">Light Bounces</div>
              <div className="text-xs text-gray-500 mt-1">Global Illumination</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-orange-600">1024</div>
              <div className="text-sm text-gray-700">Samples/Pixel</div>
              <div className="text-xs text-gray-500 mt-1">Progressive</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-pink-600">BVH</div>
              <div className="text-sm text-gray-700">Acceleration</div>
              <div className="text-xs text-gray-500 mt-1">O(log n) Traversal</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="text-xs font-semibold text-red-800 mb-1">⚡ RTX-Class Required:</div>
            <div className="text-xs text-red-700 space-y-1">
              <div>• WebGPU Mandatory</div>
              <div>• RT Cores Recommended</div>
              <div>• 8GB+ VRAM</div>
              <div>• High Compute Performance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Cornell Box Path Tracer</h3>
          <p className="text-gray-700 mb-4">
            Erlebe physikalisch korrektes Ray Tracing in Echtzeit. Die Cornell Box ist der goldstandard 
            für Path-Tracing-Demonstrations. Beobachte wie Licht realistisch von den farbigen Wänden 
            reflektiert wird und die 'KW'-Skulptur beleuchtet.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl">
              <div className="font-semibold text-red-800">🎯 Cornell Box Classic</div>
              <div className="text-sm text-red-700 mt-1">Rot/Grün Wände für Color Bleeding</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl">
              <div className="font-semibold text-orange-800">💎 PBR Materials</div>
              <div className="text-sm text-orange-700 mt-1">Metal, Glass, Diffuse Surfaces</div>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-xl">
              <div className="font-semibold text-pink-800">✨ Global Illumination</div>
              <div className="text-sm text-pink-700 mt-1">Indirekte Beleuchtung & Caustics</div>
            </div>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse w-16 h-16 bg-red-600/20 rounded-full mx-auto mb-4"></div>
              <p>Compiling Path Tracing Shaders...</p>
              <div className="mt-3 text-xs text-gray-400">
                <div>• Building BVH Acceleration Structure</div>
                <div>• Loading Material Definitions</div>
                <div>• Initializing Monte Carlo Sampler</div>
              </div>
            </div>
          </div>
        }>
          <WebGPUPathTracerViewer />
        </Suspense>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Path Tracing Rendering Pipeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">BVH</span>
            </div>
            <h4 className="font-semibold text-gray-900">Acceleration Structure</h4>
            <p className="text-sm text-gray-600 mt-2">Bounding Volume Hierarchy für O(log n) Ray-Triangle Tests</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">MC</span>
            </div>
            <h4 className="font-semibold text-gray-900">Monte Carlo Sampling</h4>
            <p className="text-sm text-gray-600 mt-2">Importance-Sampling für effiziente Light Transport</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">BRDF</span>
            </div>
            <h4 className="font-semibold text-gray-900">Material System</h4>
            <p className="text-sm text-gray-600 mt-2">Physically-based BRDF mit Mikrofacet-Modell</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h4 className="font-semibold text-gray-900">SVGF Denoiser</h4>
            <p className="text-sm text-gray-600 mt-2">ML-basiertes Denoising für saubere Ergebnisse</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Bereit für fotorealistische Rendering-Projekte?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg"
          >
            Path Tracing Projekt besprechen
            <Zap className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Algorithm Deep Dive */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Path Tracing Algorithm Implementation</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">1. Monte Carlo Path Integration</h4>
            <p className="text-gray-700 mb-4">
              Der Rendering-Equation wird durch Monte Carlo Integration gelöst. Jeder Lichtpfad 
              sammelt Radiance durch multiple Bounces und konvergiert gegen das physikalisch korrekte Ergebnis.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// WGSL Path Tracing Compute Shader
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let pixel = vec2<i32>(global_id.xy);
    let uv = (vec2<f32>(pixel) + random2()) / resolution;
    
    var ray = camera_ray(uv);
    var radiance = vec3<f32>(0.0);
    var throughput = vec3<f32>(1.0);
    
    for (var bounce = 0; bounce < MAX_BOUNCES; bounce++) {
        let hit = intersect_scene(ray);
        if (!hit.valid) { 
            radiance += throughput * sample_environment(ray.dir);
            break;
        }
        
        let material = materials[hit.material_id];
        radiance += throughput * material.emission;
        
        let sample = sample_brdf(material, hit.normal, -ray.dir);
        throughput *= sample.brdf / sample.pdf;
        
        ray = Ray(hit.position + hit.normal * 0.001, sample.direction);
        
        // Russian roulette termination
        if (max_component(throughput) < 0.1 && random() > 0.8) break;
    }
    
    // Accumulate samples
    let prev_color = textureLoad(accumulation_buffer, pixel, 0);
    let new_color = mix(prev_color.rgb, radiance, 1.0 / sample_count);
    textureStore(accumulation_buffer, pixel, vec4(new_color, 1.0));
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">2. PBR Material System</h4>
            <p className="text-gray-700 mb-4">
              Physically-based Materials mit Mikrofacet BRDF implementieren realistische Materialeigenschaften 
              für Metalle, Dielektrika und emissive Oberflächen.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// PBR Material BRDF Evaluation
fn evaluate_brdf(material: Material, wo: vec3<f32>, wi: vec3<f32>, n: vec3<f32>) -> vec3<f32> {
    let h = normalize(wo + wi);
    let NdotV = max(dot(n, wo), 0.0);
    let NdotL = max(dot(n, wi), 0.0);
    let VdotH = max(dot(wo, h), 0.0);
    let NdotH = max(dot(n, h), 0.0);
    
    // Fresnel reflectance
    let F = fresnel_schlick(VdotH, material.f0);
    
    // Distribution function (GGX)
    let D = distribution_ggx(NdotH, material.roughness);
    
    // Geometric shadowing/masking
    let G = geometry_smith(NdotV, NdotL, material.roughness);
    
    // Specular BRDF
    let specular = D * F * G / (4.0 * NdotV * NdotL + 0.001);
    
    // Diffuse BRDF (Lambertian)
    let diffuse = material.albedo * (1.0 - F) * (1.0 - material.metallic) / PI;
    
    return diffuse + specular;
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">3. BVH Acceleration Structure</h4>
            <p className="text-gray-700 mb-4">
              Bounding Volume Hierarchy ermöglicht effiziente Ray-Scene-Intersection Tests mit 
              logarithmischer Komplexität statt linearer Suche.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// BVH Traversal Stack-based Algorithm
fn intersect_bvh(ray: Ray) -> HitInfo {
    var stack: array<u32, 64>;
    var stack_ptr = 0u;
    stack[0] = 0u; // Root node
    
    var closest_hit = HitInfo(false, 1e30, vec3(0), vec3(0), 0u);
    
    while (stack_ptr < 64u) {
        let node_idx = stack[stack_ptr];
        stack_ptr -= 1u;
        
        let node = bvh_nodes[node_idx];
        
        if (!intersect_aabb(ray, node.bbox_min, node.bbox_max)) {
            continue;
        }
        
        if (node.primitive_count > 0u) {
            // Leaf node: test primitives
            for (var i = 0u; i < node.primitive_count; i++) {
                let hit = intersect_triangle(ray, primitives[node.first_primitive + i]);
                if (hit.valid && hit.t < closest_hit.t) {
                    closest_hit = hit;
                }
            }
        } else {
            // Internal node: push children to stack
            stack[stack_ptr + 1u] = node.left_child;
            stack[stack_ptr + 2u] = node.right_child;
            stack_ptr += 2u;
        }
    }
    
    return closest_hit;
}`}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-2">🚀 Warum Path Tracing die Zukunft ist:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>• <strong>Physikalisch korrekt:</strong> Unbiased light transport simulation</div>
            <div>• <strong>Unified Rendering:</strong> Ein Algorithmus für alle Lichteffekte</div>
            <div>• <strong>Fotorealismus:</strong> Indistinguishable from photography</div>
            <div>• <strong>Future-proof:</strong> Scaliert mit GPU-Performance</div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
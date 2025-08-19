"use client";

import { Suspense } from "react";
import DemoLayout from "../../../../components/DemoLayout";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the heavy 3D component
const EmbeddingGalaxyViewer = dynamic(() => import("./EmbeddingGalaxyViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm">Loading AI Embedding Galaxy...</p>
        <p className="text-xs text-gray-400 mt-2">Generating 50,000 semantic clusters...</p>
      </div>
    </div>
  )
});

export default function EmbeddingGalaxyDemo() {
  return (
    <DemoLayout
      title="Embedding Galaxy"
      description="Interaktive AI-Konzept-Galaxy mit UMAP/t-SNE Clustering und semantischer Suche"
      icon={Sparkles}
      gradient="bg-gradient-to-br from-green-500 to-green-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Das AI-Wissen-Universum erkunden
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Diese Demo visualisiert AI- und Machine Learning-Konzepte als interaktive 3D-Galaxy. 
            50.000 semantisch verwandte Begriffe werden durch UMAP-Dimensionsreduktion in einem 
            3D-Raum angeordnet, wo ähnliche Konzepte natürliche Cluster bilden. Navigiere durch 
            das Wissen-Universum und entdecke Verbindungen zwischen AI-Technologien.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">UMAP Dimensionsreduktion</h3>
                <p className="text-gray-600">Hochdimensionale AI-Embeddings auf 3D reduziert für intuitive Navigation</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Semantische Cluster</h3>
                <p className="text-gray-600">Ähnliche AI-Konzepte bilden natürliche Cluster-Formationen im 3D-Raum</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Search</h3>
                <p className="text-gray-600">Semantische Suche mit smooth camera transitions zu relevanten Bereichen</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Spatial Hashing</h3>
                <p className="text-gray-600">Optimierte Performance für 50k+ Punkte durch intelligente Raumaufteilung</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Galaxy Metrics</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">50K</div>
              <div className="text-sm text-gray-700">AI Concepts</div>
              <div className="text-xs text-gray-500 mt-1">Semantic Points</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">∞</div>
              <div className="text-sm text-gray-700">3D Navigation</div>
              <div className="text-xs text-gray-500 mt-1">Smooth Camera</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-teal-600">1ms</div>
              <div className="text-sm text-gray-700">Search Latency</div>
              <div className="text-xs text-gray-500 mt-1">Spatial Hash</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="text-xs font-semibold text-green-800 mb-1">AI Knowledge Base:</div>
            <div className="text-xs text-green-700 space-y-1">
              <div>• Machine Learning Algorithms</div>
              <div>• Neural Network Architectures</div>
              <div>• Data Science Techniques</div>
              <div>• AI Ethics & Philosophy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive AI Knowledge Galaxy</h3>
          <p className="text-gray-700 mb-4">
            Erkunde das AI-Universum! Verwende die Maus zum Navigieren, klicke auf interessante Cluster 
            oder nutze die Suchfunktion um spezifische AI-Konzepte zu finden. Jeder Punkt repräsentiert 
            ein AI-Konzept und ist semantisch zu ähnlichen Begriffen gruppiert.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-600">Neural Networks</div>
              <div className="text-xs text-blue-500">Central Cluster</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-purple-600">Computer Vision</div>
              <div className="text-xs text-purple-500">Visual AI</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-orange-600">NLP</div>
              <div className="text-xs text-orange-500">Language Models</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-green-600">Reinforcement</div>
              <div className="text-xs text-green-500">Learning Agents</div>
            </div>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse w-16 h-16 bg-green-600/20 rounded-full mx-auto mb-4"></div>
              <p>Initializing AI Knowledge Graph...</p>
            </div>
          </div>
        }>
          <EmbeddingGalaxyViewer />
        </Suspense>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          UMAP + Spatial Hashing Pipeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h4 className="font-semibold text-gray-900">Embedding Generation</h4>
            <p className="text-sm text-gray-600 mt-2">Sentence transformers für semantische AI-Konzept-Embeddings</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">3D</span>
            </div>
            <h4 className="font-semibold text-gray-900">UMAP Reduction</h4>
            <p className="text-sm text-gray-600 mt-2">Hochdimensionale Embeddings auf 3D-Koordinaten reduziert</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">🔍</span>
            </div>
            <h4 className="font-semibold text-gray-900">Spatial Indexing</h4>
            <p className="text-sm text-gray-600 mt-2">3D-Hashing für O(1) nearest neighbor queries</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">GPU</span>
            </div>
            <h4 className="font-semibold text-gray-900">Instanced Rendering</h4>
            <p className="text-sm text-gray-600 mt-2">GPU-instancing für 50k+ Punkte bei 60fps Performance</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Interessiert an AI-Datenvisualisierung für Ihr Unternehmen?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
          >
            AI Visualization Projekt besprechen
            <Sparkles className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Search & Navigation Guide */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Navigation & Search Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🎮 Navigation Controls</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xs">🖱️</span>
                </div>
                <div>
                  <div className="font-medium">Mouse Drag</div>
                  <div className="text-sm text-gray-600">Orbit around galaxy center</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xs">🔍</span>
                </div>
                <div>
                  <div className="font-medium">Mouse Wheel</div>
                  <div className="text-sm text-gray-600">Zoom into clusters</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xs">👆</span>
                </div>
                <div>
                  <div className="font-medium">Click Points</div>
                  <div className="text-sm text-gray-600">Show concept details</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🔍 Semantic Search</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xs">AI</span>
                </div>
                <div>
                  <div className="font-medium">"Neural Networks"</div>
                  <div className="text-sm text-gray-600">Core ML architectures cluster</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-pink-600 text-xs">👁️</span>
                </div>
                <div>
                  <div className="font-medium">"Computer Vision"</div>
                  <div className="text-sm text-gray-600">Image processing techniques</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-teal-600 text-xs">💬</span>
                </div>
                <div>
                  <div className="font-medium">"Transformer"</div>
                  <div className="text-sm text-gray-600">Attention mechanisms and LLMs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-2">💡 Pro Tips für die Exploration:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>• Dense Cluster = Aktive Forschungsbereiche</div>
            <div>• Isolierte Punkte = Spezielle Nischentechniken</div>
            <div>• Brücken zwischen Clustern = Interdisziplinäre Konzepte</div>
            <div>• Farbintensität = Populärity in der AI-Community</div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
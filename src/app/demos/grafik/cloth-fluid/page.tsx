"use client";

import { Suspense } from "react";
import DemoLayout from "../../../../components/DemoLayout";
import { Droplets } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the heavy 3D component
const ClothFluidLabViewer = dynamic(() => import("./ClothFluidLabViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm">Loading Physics Simulation...</p>
        <p className="text-xs text-gray-400 mt-2">Initializing XPBD cloth solver...</p>
      </div>
    </div>
  )
});

export default function ClothFluidDemo() {
  return (
    <DemoLayout
      title="Cloth × Fluid Lab"
      description="Interactive XPBD-Cloth-Simulation mit Fluid-Vortex-Fields und Physik-Engine"
      icon={Droplets}
      gradient="bg-gradient-to-br from-cyan-500 to-cyan-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Realistische Physik-Simulation in Echtzeit
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Dieses Demo kombiniert Advanced Cloth Physics mit Fluid Dynamics für eine 
            realistische Simulation von Stoff-Verhalten in Flüssigkeitsströmungen. 
            Die "KLAUS WEIGELE" Logo-Flagge reagiert physikalisch korrekt auf verschiedene 
            Fluid-Modi: Windtunnel, Tornado-Wirbel und Micro-Ripples.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">XPBD Cloth Solver</h3>
                <p className="text-gray-600">Extended Position Based Dynamics für stabile Stoff-Simulation</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Navier-Stokes Fluid</h3>
                <p className="text-gray-600">Vereinfachte Fluiddynamik mit Vortex-Fields und Turbulenz</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Constraints</h3>
                <p className="text-gray-600">Pin-Constraints, Tearing-Mechanics und Textur-Upload</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multi-Mode Physics</h3>
                <p className="text-gray-600">Windtunnel, Tornado-Wirbel und Micro-Ripples Modi</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Physics Specs</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-cyan-600">256²</div>
              <div className="text-sm text-gray-700">Fluid Grid</div>
              <div className="text-xs text-gray-500 mt-1">65k Cells</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-teal-600">32×24</div>
              <div className="text-sm text-gray-700">Cloth Vertices</div>
              <div className="text-xs text-gray-500 mt-1">768 Points</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">60fps</div>
              <div className="text-sm text-gray-700">Physics Rate</div>
              <div className="text-xs text-gray-500 mt-1">XPBD Stable</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
            <div className="text-xs font-semibold text-cyan-800 mb-1">🌊 Simulation Features:</div>
            <div className="text-xs text-cyan-700 space-y-1">
              <div>• Real-time Cloth Deformation</div>
              <div>• Fluid-Structure Interaction</div>
              <div>• Constraint-based Physics</div>
              <div>• Interactive Force Fields</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Cloth × Fluid Laboratory</h3>
          <p className="text-gray-700 mb-4">
            Interagiere mit der Physik-Simulation! Wähle verschiedene Fluid-Modi, platziere 
            Pin-Constraints zum Fixieren der Flagge oder teste die Tearing-Mechanik bei 
            extremen Kräften. Die "KLAUS WEIGELE" Logo-Flagge reagiert realistisch auf alle Einflüsse.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-xl">
              <div className="font-semibold text-cyan-800">🌪️ Windtunnel</div>
              <div className="text-sm text-cyan-700 mt-1">Gleichmäßiger Luftstrom</div>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-xl">
              <div className="font-semibold text-teal-800">🌀 Tornado Mode</div>
              <div className="text-sm text-teal-700 mt-1">Wirbelnde Vortex-Felder</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
              <div className="font-semibold text-blue-800">💧 Micro-Ripples</div>
              <div className="text-sm text-blue-700 mt-1">Feine Wellenbewegungen</div>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
              <div className="font-semibold text-indigo-800">📌 Pin & Tear</div>
              <div className="text-sm text-indigo-700 mt-1">Interactive Constraints</div>
            </div>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse w-16 h-16 bg-cyan-600/20 rounded-full mx-auto mb-4"></div>
              <p>Initializing Physics Engine...</p>
              <div className="mt-3 text-xs text-gray-400">
                <div>• Loading XPBD Cloth Solver</div>
                <div>• Initializing Fluid Grid 256²</div>
                <div>• Setting up Constraint System</div>
              </div>
            </div>
          </div>
        }>
          <ClothFluidLabViewer />
        </Suspense>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          XPBD + Fluid Physics Pipeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">XPBD</span>
            </div>
            <h4 className="font-semibold text-gray-900">Extended PBD</h4>
            <p className="text-sm text-gray-600 mt-2">Position Based Dynamics mit verbesserter Stabilität</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">NS</span>
            </div>
            <h4 className="font-semibold text-gray-900">Fluid Solver</h4>
            <p className="text-sm text-gray-600 mt-2">Navier-Stokes mit Vortex-Confinement</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">FSI</span>
            </div>
            <h4 className="font-semibold text-gray-900">Coupling System</h4>
            <p className="text-sm text-gray-600 mt-2">Fluid-Structure-Interaction zwischen Medien</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">GPU</span>
            </div>
            <h4 className="font-semibold text-gray-900">Compute Pipeline</h4>
            <p className="text-sm text-gray-600 mt-2">Parallelisierte Physics-Berechnung</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Interessiert an Physics-Simulation für Ihr Projekt?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors shadow-lg"
          >
            Cloth × Fluid Projekt besprechen
            <Droplets className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Interactive Controls Guide */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Physics Interaction Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🎮 Fluid Control Modes</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-600 text-xs">🌪️</span>
                </div>
                <div>
                  <div className="font-medium">Windtunnel Mode</div>
                  <div className="text-sm text-gray-600">Konstanter horizontaler Luftstrom</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-teal-600 text-xs">🌀</span>
                </div>
                <div>
                  <div className="font-medium">Tornado Mode</div>
                  <div className="text-sm text-gray-600">Wirbelnde Vortex-Felder</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xs">💧</span>
                </div>
                <div>
                  <div className="font-medium">Micro-Ripples</div>
                  <div className="text-sm text-gray-600">Feine Wellenbewegungen</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🔧 Interactive Physics</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 text-xs">📌</span>
                </div>
                <div>
                  <div className="font-medium">Pin Constraints</div>
                  <div className="text-sm text-gray-600">Fixiere Stoff-Punkte in Position</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xs">🎯</span>
                </div>
                <div>
                  <div className="font-medium">Mouse Forces</div>
                  <div className="text-sm text-gray-600">Direkte Krafteinwirkung mit Maus</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-pink-600 text-xs">💥</span>
                </div>
                <div>
                  <div className="font-medium">Tearing Physics</div>
                  <div className="text-sm text-gray-600">Stoff-Risse bei extremen Kräften</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-2">💡 Physics-Simulation Tips:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>• <strong>Cloth Stabilität:</strong> XPBD löst Jittering-Probleme</div>
            <div>• <strong>Fluid-Kopplung:</strong> Realistische Strömungsinteraktion</div>
            <div>• <strong>Performance:</strong> 60fps durch GPU-Parallelisierung</div>
            <div>• <strong>Interactive:</strong> Real-time Parameter-Updates</div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
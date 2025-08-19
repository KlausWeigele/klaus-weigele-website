"use client";

import { Suspense } from "react";
import DemoLayout from "../../../../components/DemoLayout";
import { Hexagon } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the heavy 3D component
const VoronoiMorphingViewer = dynamic(() => import("./VoronoiMorphingViewer"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm">Loading Voronoi Generator...</p>
        <p className="text-xs text-gray-400 mt-2">Computing Poisson-disk distributions...</p>
      </div>
    </div>
  )
});

export default function VoronoiMorphingDemo() {
  return (
    <DemoLayout
      title="Voronoi-Morphing"
      description="Procedural Pattern Generation mit Poisson-Disk, Lloyd-Relaxation und 3D-Extrusion"
      icon={Hexagon}
      gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Von der Natur zur Stadt: Procedural Pattern Design
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Dieses Demo zeigt die Evolution von organischen zu geometrischen Mustern durch 
            algorithmische Pattern-Generation. Ausgehend von Poisson-Disk-Sampling für 
            natürliche Verteilungen wird über Voronoi-Diagramme und Lloyd-Relaxation 
            ein smooth Übergang von 'Obstgarten-Mustern' zu 'Stadt-Block-Rastern' generiert.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Poisson-Disk Sampling</h3>
                <p className="text-gray-600">Gleichmäßig verteilte Seeds ohne Clustering für natürliche Muster</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Voronoi Generation</h3>
                <p className="text-gray-600">Tessellation des Raums basierend auf nearest neighbor distances</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lloyd Relaxation</h3>
                <p className="text-gray-600">Iterative Optimierung für gleichmäßigere Zellgrößen</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pattern Morphing</h3>
                <p className="text-gray-600">Smooth Übergang zwischen organischen und geometrischen Layouts</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pattern Specs</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">500</div>
              <div className="text-sm text-gray-700">Voronoi Seeds</div>
              <div className="text-xs text-gray-500 mt-1">Poisson-Disk</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">∞</div>
              <div className="text-sm text-gray-700">Morphing States</div>
              <div className="text-xs text-gray-500 mt-1">Smooth Transition</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-teal-600">10</div>
              <div className="text-sm text-gray-700">Lloyd Iterations</div>
              <div className="text-xs text-gray-500 mt-1">Optimization</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-xs font-semibold text-emerald-800 mb-1">🌿 Pattern Applications:</div>
            <div className="text-xs text-emerald-700 space-y-1">
              <div>• Procedural City Generation</div>
              <div>• Natural Texture Synthesis</div>
              <div>• Architectural Space Planning</div>
              <div>• Game Level Generation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Voronoi Pattern Morphing</h3>
          <p className="text-gray-700 mb-4">
            Beobachte den fließenden Übergang von natürlichen, organischen Mustern (wie ein Obstgarten) 
            zu strukturierten, geometrischen Rastern (wie Stadt-Blocks). Die 3D-Extrusion verdeutlicht 
            die Zellstrukturen und kann für Architektur-Planung oder Spiel-Level-Design verwendet werden.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
              <div className="font-semibold text-emerald-800">🌳 Organic Mode</div>
              <div className="text-sm text-emerald-700 mt-1">Natürliche Poisson-Verteilung</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl">
              <div className="font-semibold text-green-800">🔄 Morphing</div>
              <div className="text-sm text-green-700 mt-1">Smooth Pattern-Transition</div>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl">
              <div className="font-semibold text-teal-800">🏢 Geometric Mode</div>
              <div className="text-sm text-teal-700 mt-1">Regelmäßiges Raster-Layout</div>
            </div>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl">
              <div className="font-semibold text-cyan-800">📐 3D Extrusion</div>
              <div className="text-sm text-cyan-700 mt-1">Höhen-basierte Visualisierung</div>
            </div>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse w-16 h-16 bg-emerald-600/20 rounded-full mx-auto mb-4"></div>
              <p>Computing Voronoi Tessellations...</p>
              <div className="mt-3 text-xs text-gray-400">
                <div>• Generating Poisson-disk distribution</div>
                <div>• Computing Delaunay triangulation</div>
                <div>• Running Lloyd relaxation iterations</div>
              </div>
            </div>
          </div>
        }>
          <VoronoiMorphingViewer />
        </Suspense>
      </div>

      {/* Technical Implementation */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Procedural Pattern Generation Pipeline
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">PDS</span>
            </div>
            <h4 className="font-semibold text-gray-900">Poisson-Disk Sampling</h4>
            <p className="text-sm text-gray-600 mt-2">Dart-throwing algorithm für gleichmäßige Point-Distribution</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">VOR</span>
            </div>
            <h4 className="font-semibold text-gray-900">Voronoi Tessellation</h4>
            <p className="text-sm text-gray-600 mt-2">Delaunay-duale Raumaufteilung basierend auf Seeds</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">LR</span>
            </div>
            <h4 className="font-semibold text-gray-900">Lloyd Relaxation</h4>
            <p className="text-sm text-gray-600 mt-2">Iterative Zentroid-Optimierung für bessere Zellenformen</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-sm">3D</span>
            </div>
            <h4 className="font-semibold text-gray-900">Mesh Extrusion</h4>
            <p className="text-sm text-gray-600 mt-2">Höhen-basierte 3D-Geometrie-Generation aus 2D-Polygonen</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Interessiert an proceduraler Pattern-Generation?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg"
          >
            Voronoi-Morphing Projekt besprechen
            <Hexagon className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Algorithm Deep Dive */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Procedural Algorithm Implementation</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">1. Poisson-Disk Sampling Algorithm</h4>
            <p className="text-gray-700 mb-4">
              Der Dart-throwing Algorithmus generiert gleichmäßig verteilte Punkte ohne Clustering. 
              Jeder neue Punkt hat einen Mindestabstand zu allen existierenden Punkten.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Poisson-disk sampling implementation
function poissonDiskSampling(width, height, radius, maxAttempts = 30) {
    const cellSize = radius / Math.sqrt(2);
    const grid = [];
    const activeList = [];
    const points = [];
    
    // Add initial point
    const firstPoint = [Math.random() * width, Math.random() * height];
    points.push(firstPoint);
    activeList.push(firstPoint);
    
    while (activeList.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeList.length);
        const currentPoint = activeList[randomIndex];
        
        let found = false;
        for (let i = 0; i < maxAttempts; i++) {
            const newPoint = generateRandomPointAround(currentPoint, radius);
            if (isValidPoint(newPoint, points, radius)) {
                points.push(newPoint);
                activeList.push(newPoint);
                found = true;
                break;
            }
        }
        
        if (!found) {
            activeList.splice(randomIndex, 1);
        }
    }
    
    return points;
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">2. Voronoi Tessellation via Delaunay</h4>
            <p className="text-gray-700 mb-4">
              Die Voronoi-Tessellation wird als Dual der Delaunay-Triangulation berechnet. 
              Jede Voronoi-Zelle repräsentiert den Bereich, der einem Seed-Punkt am nächsten ist.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Voronoi cell generation from Delaunay triangulation
function generateVoronoiCells(points) {
    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    
    const cells = [];
    for (let i = 0; i < points.length; i++) {
        const cell = voronoi.cellPolygon(i);
        if (cell) {
            cells.push({
                site: points[i],
                polygon: cell,
                centroid: calculateCentroid(cell),
                area: calculateArea(cell)
            });
        }
    }
    
    return cells;
}

function calculateCentroid(polygon) {
    let cx = 0, cy = 0;
    let area = 0;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const cross = polygon[i][0] * polygon[j][1] - polygon[j][0] * polygon[i][1];
        area += cross;
        cx += (polygon[i][0] + polygon[j][0]) * cross;
        cy += (polygon[i][1] + polygon[j][1]) * cross;
    }
    
    area *= 0.5;
    cx /= (6 * area);
    cy /= (6 * area);
    
    return [cx, cy];
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">3. Lloyd Relaxation Optimization</h4>
            <p className="text-gray-700 mb-4">
              Lloyd-Relaxation verbessert die Voronoi-Tessellation durch iteratives Verschieben 
              der Sites zu den Zentroiden ihrer Zellen, wodurch gleichmäßigere Zellformen entstehen.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-800">
{`// Lloyd relaxation iterations
function lloydRelaxation(points, iterations = 10) {
    let currentPoints = [...points];
    
    for (let iter = 0; iter < iterations; iter++) {
        const cells = generateVoronoiCells(currentPoints);
        const newPoints = [];
        
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            // Move site towards centroid
            const centroid = cell.centroid;
            const site = cell.site;
            
            // Smoothing factor for gradual convergence
            const smoothing = 0.8;
            const newX = site[0] + (centroid[0] - site[0]) * smoothing;
            const newY = site[1] + (centroid[1] - site[1]) * smoothing;
            
            newPoints.push([newX, newY]);
        }
        
        currentPoints = newPoints;
    }
    
    return currentPoints;
}

// Pattern morphing between organic and geometric layouts
function morphPatterns(organicPoints, geometricPoints, t) {
    const morphedPoints = [];
    
    for (let i = 0; i < organicPoints.length; i++) {
        const organic = organicPoints[i];
        const geometric = geometricPoints[i] || organic;
        
        const morphedX = organic[0] + (geometric[0] - organic[0]) * t;
        const morphedY = organic[1] + (geometric[1] - organic[1]) * t;
        
        morphedPoints.push([morphedX, morphedY]);
    }
    
    return morphedPoints;
}`}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-2">🌟 Warum Voronoi-Patterns so mächtig sind:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>• <strong>Natürliche Muster:</strong> Simuliert biologische Zellteilung</div>
            <div>• <strong>Optimale Raumaufteilung:</strong> Minimiert Distanzen zu Zentren</div>
            <div>• <strong>Flexible Morphing:</strong> Smooth transitions zwischen Patterns</div>
            <div>• <strong>Endlos skalierbar:</strong> Funktioniert von Mikrometern bis Kilometern</div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
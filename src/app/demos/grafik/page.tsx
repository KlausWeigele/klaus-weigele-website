"use client";

import { useState } from "react";
import DemoLayout from "../../../components/DemoLayout";
import InteractiveChart from "../../../components/InteractiveChart";
import { BarChart3, TrendingUp, Filter, Download, RefreshCw } from "lucide-react";

export default function GrafikDemo() {
  const [selectedDataset, setSelectedDataset] = useState('sales');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  const datasets = {
    sales: {
      title: "Verkaufsdaten 2024",
      data: [
        { label: "Q1", value: 250000, color: "#3b82f6" },
        { label: "Q2", value: 320000, color: "#10b981" },
        { label: "Q3", value: 380000, color: "#f59e0b" },
        { label: "Q4", value: 420000, color: "#ef4444" }
      ]
    },
    regions: {
      title: "Umsatz nach Regionen",
      data: [
        { label: "Nord", value: 340000, color: "#3b82f6" },
        { label: "Süd", value: 280000, color: "#10b981" },
        { label: "Ost", value: 220000, color: "#f59e0b" },
        { label: "West", value: 460000, color: "#ef4444" }
      ]
    },
    products: {
      title: "Top Produkte",
      data: [
        { label: "KI-Beratung", value: 450000, color: "#3b82f6" },
        { label: "ML-Implementierung", value: 380000, color: "#10b981" },
        { label: "Data Analytics", value: 320000, color: "#f59e0b" },
        { label: "Schulungen", value: 180000, color: "#ef4444" }
      ]
    }
  };

  const currentDataset = datasets[selectedDataset as keyof typeof datasets];

  return (
    <DemoLayout
      title="Grafik & Datenvisualisierung"
      description="Interactive Dashboards und Charts für bessere Business-Entscheidungen"
      icon={BarChart3}
      gradient="bg-gradient-to-br from-blue-500 to-blue-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Datenvisualisierung, die überzeugt
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Diese Demo zeigt, wie komplexe Geschäftsdaten durch intelligente Visualisierungen 
            verständlich und actionable gemacht werden. Interaktive Charts ermöglichen es 
            Stakeholdern, schnell Insights zu gewinnen und datenbasierte Entscheidungen zu treffen.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Insights</h3>
                <p className="text-gray-600">Live Updates und interaktive Filterung für aktuelle Geschäftsdaten</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Filter className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Dynamic Filtering</h3>
                <p className="text-gray-600">Flexible Datenauswahl nach Zeitraum, Region oder Produktkategorie</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Download className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Export & Reporting</h3>
                <p className="text-gray-600">Automatische Report-Generierung für Präsentationen und Meetings</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Impact */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Business Impact</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">40%</div>
              <div className="text-sm text-gray-700">Schnellere Entscheidungen</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">25%</div>
              <div className="text-sm text-gray-700">Weniger Meeting-Zeit</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">€50K</div>
              <div className="text-sm text-gray-700">Jährliche Einsparung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Interactive Dashboard Demo</h3>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Neu laden
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Dataset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datenset auswählen:
            </label>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="sales">Verkaufsdaten 2024</option>
              <option value="regions">Umsatz nach Regionen</option>
              <option value="products">Top Produkte</option>
            </select>
          </div>
          
          {/* Chart Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visualisierungstyp:
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'bar' | 'pie' | 'line')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bar">Balkendiagramm</option>
              <option value="pie">Kreisdiagramm</option>
              <option value="line">Liniendiagramm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <InteractiveChart
          title={currentDataset.title}
          data={currentDataset.data}
          type={chartType}
          animated={true}
        />
        
        {/* Additional Chart with different type */}
        <InteractiveChart
          title={`${currentDataset.title} - Alternative Ansicht`}
          data={currentDataset.data}
          type={chartType === 'bar' ? 'pie' : 'bar'}
          animated={true}
        />
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Verwendete Technologien
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">D3</span>
            </div>
            <h4 className="font-semibold text-gray-900">D3.js</h4>
            <p className="text-sm text-gray-600">Data-driven documents</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">📊</span>
            </div>
            <h4 className="font-semibold text-gray-900">Chart.js</h4>
            <p className="text-sm text-gray-600">Responsive Charts</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">🐍</span>
            </div>
            <h4 className="font-semibold text-gray-900">Python</h4>
            <p className="text-sm text-gray-600">Data Processing</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">📈</span>
            </div>
            <h4 className="font-semibold text-gray-900">Plotly</h4>
            <p className="text-sm text-gray-600">Interactive Visualizations</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Interessiert an einer individuellen Dashboard-Lösung für Ihr Unternehmen?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            Kostenlose Beratung vereinbaren
            <TrendingUp className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </DemoLayout>
  );
}
"use client";

import { useState } from "react";
import DemoLayout from "../../../components/DemoLayout";
import InteractiveChart from "../../../components/InteractiveChart";
import { TrendingUp, BarChart3, Calculator, Target, CheckCircle, AlertCircle, Info } from "lucide-react";

interface StatTestResult {
  testName: string;
  pValue: number;
  significant: boolean;
  interpretation: string;
  recommendation: string;
}

export default function StatistikDemo() {
  const [selectedTest, setSelectedTest] = useState<'ab' | 'correlation' | 'regression'>('ab');
  const [testData, setTestData] = useState({
    ab: {
      groupA: { size: 1000, conversions: 85 },
      groupB: { size: 1000, conversions: 92 }
    },
    correlation: {
      marketing: [20, 35, 50, 65, 80, 95, 110],
      sales: [150, 280, 420, 580, 750, 890, 1020]
    }
  });
  
  const [results, setResults] = useState<StatTestResult | null>(null);

  const runStatisticalTest = () => {
    let result: StatTestResult;
    
    if (selectedTest === 'ab') {
      const { groupA, groupB } = testData.ab;
      const convRateA = (groupA.conversions / groupA.size) * 100;
      const convRateB = (groupB.conversions / groupB.size) * 100;
      const difference = Math.abs(convRateB - convRateA);
      
      // Simulate Chi-square test
      const pValue = difference > 1 ? 0.023 : 0.156;
      const significant = pValue < 0.05;
      
      result = {
        testName: 'A/B Test (Chi-Quadrat)',
        pValue,
        significant,
        interpretation: `Conversion Rate A: ${convRateA.toFixed(1)}%, B: ${convRateB.toFixed(1)}% (${difference.toFixed(1)}pp Unterschied)`,
        recommendation: significant 
          ? `Variante B ist signifikant besser. Implementation empfohlen.`
          : `Kein signifikanter Unterschied. Weitere Tests nötig oder A/B gleich gut.`
      };
    } else if (selectedTest === 'correlation') {
      // Simulate correlation analysis
      const correlation = 0.947; // Strong positive correlation
      const pValue = 0.001;
      
      result = {
        testName: 'Pearson Korrelation',
        pValue,
        significant: true,
        interpretation: `Korrelationskoeffizient: r = ${correlation} (sehr starke positive Korrelation)`,
        recommendation: `Marketing Budget und Umsatz sind stark korreliert. Budget-Erhöhung empfohlen.`
      };
    } else {
      // Simulate regression analysis
      const rSquared = 0.892;
      const pValue = 0.002;
      
      result = {
        testName: 'Lineare Regression',
        pValue,
        significant: true,
        interpretation: `R² = ${rSquared} (${(rSquared * 100).toFixed(1)}% der Varianz erklärt)`,
        recommendation: `Modell erklärt Daten gut. Für Prognosen geeignet.`
      };
    }
    
    setResults(result);
  };

  const marketingData = [
    { label: 'Jan', value: 25000, color: '#3b82f6' },
    { label: 'Feb', value: 32000, color: '#10b981' },
    { label: 'Mär', value: 28000, color: '#f59e0b' },
    { label: 'Apr', value: 45000, color: '#ef4444' },
    { label: 'Mai', value: 52000, color: '#8b5cf6' },
    { label: 'Jun', value: 48000, color: '#06b6d4' }
  ];

  const salesCorrelation = [
    { label: 'Jan', value: 180000, color: '#3b82f6' },
    { label: 'Feb', value: 235000, color: '#10b981' },
    { label: 'Mär', value: 210000, color: '#f59e0b' },
    { label: 'Apr', value: 320000, color: '#ef4444' },
    { label: 'Mai', value: 385000, color: '#8b5cf6' },
    { label: 'Jun', value: 358000, color: '#06b6d4' }
  ];

  return (
    <DemoLayout
      title="Statistik & Analytics"
      description="Statistical Analysis für fundierte Geschäftsentscheidungen"
      icon={TrendingUp}
      gradient="bg-gradient-to-br from-orange-500 to-orange-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Datenbasierte Entscheidungen treffen
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Diese Demo zeigt statistische Tests und Analysemethoden für Business Intelligence. 
            Von A/B-Testing über Korrelationsanalysen bis hin zu Regressionsmodellen - 
            erfahren Sie, wie statistische Methoden Ihnen helfen, fundierte 
            Geschäftsentscheidungen zu treffen.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Target className="w-6 h-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">A/B Testing</h3>
                <p className="text-gray-600">Statistische Signifikanz von Experimenten bewerten</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Korrelationsanalyse</h3>
                <p className="text-gray-600">Zusammenhänge zwischen Variablen identifizieren</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Calculator className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Regressionsmodelle</h3>
                <p className="text-gray-600">Vorhersagemodelle für Business-Metriken entwickeln</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Impact */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Business Impact</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-orange-600">30%</div>
              <div className="text-sm text-gray-700">Bessere Erfolgsrate</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">50%</div>
              <div className="text-sm text-gray-700">Weniger Fehlentscheidungen</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">€150K</div>
              <div className="text-sm text-gray-700">Vermiedene Verluste</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Statistical Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Test Configuration */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistischer Test auswählen</h3>
          
          {/* Test Type Selection */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="testType"
                value="ab"
                checked={selectedTest === 'ab'}
                onChange={(e) => setSelectedTest(e.target.value as any)}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="font-medium">A/B Test Auswertung</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="testType"
                value="correlation"
                checked={selectedTest === 'correlation'}
                onChange={(e) => setSelectedTest(e.target.value as any)}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="font-medium">Korrelationsanalyse</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="testType"
                value="regression"
                checked={selectedTest === 'regression'}
                onChange={(e) => setSelectedTest(e.target.value as any)}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="font-medium">Regressionsanalyse</span>
            </label>
          </div>

          {/* A/B Test Configuration */}
          {selectedTest === 'ab' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">A/B Test Parameter</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gruppe A Teilnehmer</label>
                  <input
                    type="number"
                    value={testData.ab.groupA.size}
                    onChange={(e) => setTestData(prev => ({
                      ...prev,
                      ab: { ...prev.ab, groupA: { ...prev.ab.groupA, size: parseInt(e.target.value) || 0 }}
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gruppe A Conversions</label>
                  <input
                    type="number"
                    value={testData.ab.groupA.conversions}
                    onChange={(e) => setTestData(prev => ({
                      ...prev,
                      ab: { ...prev.ab, groupA: { ...prev.ab.groupA, conversions: parseInt(e.target.value) || 0 }}
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gruppe B Teilnehmer</label>
                  <input
                    type="number"
                    value={testData.ab.groupB.size}
                    onChange={(e) => setTestData(prev => ({
                      ...prev,
                      ab: { ...prev.ab, groupB: { ...prev.ab.groupB, size: parseInt(e.target.value) || 0 }}
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Gruppe B Conversions</label>
                  <input
                    type="number"
                    value={testData.ab.groupB.conversions}
                    onChange={(e) => setTestData(prev => ({
                      ...prev,
                      ab: { ...prev.ab, groupB: { ...prev.ab.groupB, conversions: parseInt(e.target.value) || 0 }}
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Statistical Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Statistische Grundlagen:</p>
                <p>• p-Wert &lt; 0.05: Statistisch signifikant</p>
                <p>• α = 0.05: 5% Irrtumswahrscheinlichkeit</p>
                <p>• Effektgröße: Praktische Relevanz der Unterschiede</p>
              </div>
            </div>
          </div>

          <button
            onClick={runStatisticalTest}
            className="w-full mt-6 bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg"
          >
            Statistische Analyse starten
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Analyseergebnisse</h3>
          
          {!results ? (
            <div className="text-center py-12">
              <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Wählen Sie einen Test aus und starten Sie die statistische Analyse
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Test Type */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">{results.testName}</h4>
                <p className="text-gray-700">{results.interpretation}</p>
              </div>

              {/* Statistical Significance */}
              <div className={`p-4 rounded-xl ${results.significant ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {results.significant ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className={`font-semibold ${results.significant ? 'text-green-900' : 'text-yellow-900'}`}>
                    {results.significant ? 'Statistisch signifikant' : 'Nicht signifikant'}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className={results.significant ? 'text-green-800' : 'text-yellow-800'}>
                    p-Wert: {results.pValue.toFixed(4)} {results.significant ? '< 0.05' : '≥ 0.05'}
                  </p>
                  <p className={results.significant ? 'text-green-700' : 'text-yellow-700'}>
                    Konfidenzintervall: 95%
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">📊 Handlungsempfehlung</h4>
                <p className="text-blue-800">{results.recommendation}</p>
              </div>

              {/* Statistical Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">
                    {results.pValue < 0.001 ? '<0.001' : results.pValue.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-600">p-Value</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">95%</div>
                  <div className="text-xs text-gray-600">Confidence Level</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Visualization Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <InteractiveChart
          title="Marketing Budget (€)"
          data={marketingData}
          type="line"
          animated={true}
        />
        
        <InteractiveChart
          title="Umsatz Korrelation (€)"
          data={salesCorrelation}
          type="line"
          animated={true}
        />
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Statistical Computing Tools
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">R</span>
            </div>
            <h4 className="font-semibold text-gray-900">R</h4>
            <p className="text-sm text-gray-600">Statistical Computing</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">🐍</span>
            </div>
            <h4 className="font-semibold text-gray-900">Python scipy</h4>
            <p className="text-sm text-gray-600">Scientific Computing</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">📊</span>
            </div>
            <h4 className="font-semibold text-gray-900">Statistical Modeling</h4>
            <p className="text-sm text-gray-600">Advanced Analytics</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">A/B</span>
            </div>
            <h4 className="font-semibold text-gray-900">A/B Testing</h4>
            <p className="text-sm text-gray-600">Experiment Design</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Benötigen Sie statistische Beratung für Ihr Projekt?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-lg"
          >
            Statistical Consulting anfragen
            <TrendingUp className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </DemoLayout>
  );
}
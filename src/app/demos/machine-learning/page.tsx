"use client";

import { useState } from "react";
import DemoLayout from "../../../components/DemoLayout";
import { Bot, Brain, TrendingUp, CheckCircle, AlertTriangle, Target } from "lucide-react";

export default function MachineLearningDemo() {
  const [customerData, setCustomerData] = useState({
    age: 35,
    income: 50000,
    purchaseHistory: 12,
    websiteVisits: 25,
    emailOpens: 18
  });

  const [predictionResult, setPredictionResult] = useState<{
    churnProbability: number;
    purchaseProbability: number;
    lifetimeValue: number;
    recommendation: string;
  } | null>(null);

  const runPrediction = () => {
    // Simulate ML prediction based on customer data
    const normalizedAge = Math.max(0, Math.min(1, (customerData.age - 18) / 62));
    const normalizedIncome = Math.max(0, Math.min(1, customerData.income / 150000));
    const normalizedHistory = Math.max(0, Math.min(1, customerData.purchaseHistory / 50));
    const normalizedVisits = Math.max(0, Math.min(1, customerData.websiteVisits / 100));
    const normalizedEmails = Math.max(0, Math.min(1, customerData.emailOpens / 50));

    // Simple weighted prediction algorithm
    const engagementScore = (normalizedHistory * 0.3 + normalizedVisits * 0.3 + normalizedEmails * 0.4);
    const valueScore = (normalizedIncome * 0.6 + normalizedAge * 0.2 + engagementScore * 0.2);
    
    const churnProbability = Math.max(0, Math.min(100, 100 * (1 - engagementScore + Math.random() * 0.2 - 0.1)));
    const purchaseProbability = Math.max(0, Math.min(100, 100 * (engagementScore + Math.random() * 0.2 - 0.1)));
    const lifetimeValue = Math.round(customerData.income * 0.15 * engagementScore + Math.random() * 1000);

    let recommendation = "Standard-Kundenbetreuung";
    if (churnProbability > 60) {
      recommendation = "Retention-Campaign starten";
    } else if (purchaseProbability > 70) {
      recommendation = "Cross-selling Opportunity";
    } else if (lifetimeValue > 10000) {
      recommendation = "Premium-Service anbieten";
    }

    setPredictionResult({
      churnProbability: Math.round(churnProbability),
      purchaseProbability: Math.round(purchaseProbability),
      lifetimeValue,
      recommendation
    });
  };

  const handleInputChange = (field: string, value: number) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
    setPredictionResult(null); // Reset prediction when data changes
  };

  return (
    <DemoLayout
      title="Machine Learning"
      description="Predictive Analytics für datengetriebene Geschäftsentscheidungen"
      icon={Bot}
      gradient="bg-gradient-to-br from-green-500 to-green-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Kundenverhalten vorhersagen mit ML
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Diese Demo zeigt ein Customer Churn Prediction Modell, das Kundenabwanderung 
            vorhersagt und Handlungsempfehlungen gibt. Basierend auf Kundendaten werden 
            Wahrscheinlichkeiten für verschiedene Szenarien berechnet.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Target className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Churn Prediction</h3>
                <p className="text-gray-600">Identifiziert Kunden mit hohem Abwanderungsrisiko</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Purchase Probability</h3>
                <p className="text-gray-600">Berechnet Kaufwahrscheinlichkeit für Cross-selling</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Brain className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Customer Lifetime Value</h3>
                <p className="text-gray-600">Schätzt den langfristigen Kundenwert</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Impact */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Business Impact</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">25%</div>
              <div className="text-sm text-gray-700">Weniger Kundenabwanderung</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">35%</div>
              <div className="text-sm text-gray-700">Höhere Cross-sell Rate</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">€200K</div>
              <div className="text-sm text-gray-700">Jährlicher Mehrwert</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive ML Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Input Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Kundendaten eingeben</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alter: {customerData.age} Jahre
              </label>
              <input
                type="range"
                min="18"
                max="80"
                value={customerData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jahreseinkommen: €{customerData.income.toLocaleString()}
              </label>
              <input
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={customerData.income}
                onChange={(e) => handleInputChange('income', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anzahl Käufe (letztes Jahr): {customerData.purchaseHistory}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={customerData.purchaseHistory}
                onChange={(e) => handleInputChange('purchaseHistory', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website-Besuche (letzter Monat): {customerData.websiteVisits}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={customerData.websiteVisits}
                onChange={(e) => handleInputChange('websiteVisits', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email-Öffnungen (letzter Monat): {customerData.emailOpens}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={customerData.emailOpens}
                onChange={(e) => handleInputChange('emailOpens', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <button
              onClick={runPrediction}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              ML-Vorhersage starten
            </button>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Vorhersage-Ergebnisse</h3>
          
          {!predictionResult ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Passen Sie die Kundendaten an und starten Sie die ML-Vorhersage
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Churn Probability */}
              <div className="p-4 border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Abwanderungsrisiko</span>
                  <span className={`font-bold ${predictionResult.churnProbability > 60 ? 'text-red-600' : 'text-green-600'}`}>
                    {predictionResult.churnProbability}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${predictionResult.churnProbability > 60 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${predictionResult.churnProbability}%` }}
                  />
                </div>
                <div className="flex items-center mt-2">
                  {predictionResult.churnProbability > 60 ? (
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm text-gray-600">
                    {predictionResult.churnProbability > 60 ? 'Hoches Risiko' : 'Niedriges Risiko'}
                  </span>
                </div>
              </div>

              {/* Purchase Probability */}
              <div className="p-4 border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Kaufwahrscheinlichkeit</span>
                  <span className="font-bold text-blue-600">{predictionResult.purchaseProbability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${predictionResult.purchaseProbability}%` }}
                  />
                </div>
              </div>

              {/* Lifetime Value */}
              <div className="p-4 border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Customer Lifetime Value</span>
                  <span className="font-bold text-purple-600">€{predictionResult.lifetimeValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="font-semibold text-green-900 mb-2">💡 Handlungsempfehlung</h4>
                <p className="text-green-800">{predictionResult.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ML Technologies & Frameworks
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">SK</span>
            </div>
            <h4 className="font-semibold text-gray-900">scikit-learn</h4>
            <p className="text-sm text-gray-600">Machine Learning Library</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">XG</span>
            </div>
            <h4 className="font-semibold text-gray-900">XGBoost</h4>
            <p className="text-sm text-gray-600">Gradient Boosting</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">🐼</span>
            </div>
            <h4 className="font-semibold text-gray-900">Pandas</h4>
            <p className="text-sm text-gray-600">Data Analysis</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">TF</span>
            </div>
            <h4 className="font-semibold text-gray-900">TensorFlow</h4>
            <p className="text-sm text-gray-600">Deep Learning</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Bereit für Machine Learning in Ihrem Unternehmen?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
          >
            ML-Projekt besprechen
            <Bot className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </DemoLayout>
  );
}
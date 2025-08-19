"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Brain, Rocket, Building2, Euro, Clock, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  investment: { min: number; max: number };
  duration: string;
  roiPotential: string;
  successRate: string;
  deliverables: string[];
  processSteps: string[];
  targetCompanySize: string[];
  problemStatement: string;
  solutionHighlight: string;
}

const services: Service[] = [
  {
    id: 'strategy',
    title: 'KI-Strategieberatung',
    subtitle: 'Vom KI-Hype zur messbaren Wertschöpfung',
    description: 'Entwickeln Sie eine fundierte KI-Strategie mit klarem ROI-Fokus und konkretem Umsetzungsplan.',
    icon: <Brain className="w-10 h-10 text-white" />,
    investment: { min: 15000, max: 50000 },
    duration: '4-8 Wochen',
    roiPotential: '200-500%',
    successRate: '95%',
    deliverables: [
      'KI-Readiness Assessment Ihres Unternehmens',
      'Identifikation der Top-3 KI-Use-Cases mit höchstem ROI',
      'Roadmap von Quick-Wins bis zur strategischen KI-Transformation',
      'Business Case mit konkreten Zahlen für Ihr Management'
    ],
    processSteps: [
      'Ist-Analyse und Potentialbewertung',
      'Use-Case Identifikation und Priorisierung',
      'ROI-Kalkulation und Business Case',
      'Strategische Roadmap-Entwicklung'
    ],
    targetCompanySize: ['50-200 Mitarbeiter', '200-1000 Mitarbeiter', '1000+ Mitarbeiter'],
    problemStatement: 'Wir wissen, dass KI uns helfen könnte, aber wo fangen wir an?',
    solutionHighlight: 'Klare Strategie mit messbaren Zielen und priorisierten Quick-Wins'
  },
  {
    id: 'prototyping',
    title: 'ML-Prototyping & Proof-of-Concept',
    subtitle: 'Von der Idee zum funktionierenden KI-System',
    description: 'Validieren Sie Ihre KI-Ideen durch professionelle Prototypen mit Ihren echten Daten.',
    icon: <Rocket className="w-10 h-10 text-white" />,
    investment: { min: 8000, max: 25000 },
    duration: '4-6 Wochen',
    roiPotential: '300-800%',
    successRate: '90%',
    deliverables: [
      'Rapid Prototyping mit Ihren echten Daten (DSGVO-konform)',
      'Technische Machbarkeitsprüfung',
      'Interactive Demo für Management und Key-Stakeholder',
      'Produktionsreife Architektur und Implementierungsplan'
    ],
    processSteps: [
      'Datenanalyse und Aufbereitung',
      'Algorithmus-Entwicklung und Training',
      'Prototyp-Implementierung',
      'Demo und Produktionsplanung'
    ],
    targetCompanySize: ['20-100 Mitarbeiter', '100-500 Mitarbeiter', '500+ Mitarbeiter'],
    problemStatement: 'Wir haben eine KI-Idee, aber funktioniert das überhaupt?',
    solutionHighlight: 'Funktionsfähiger Prototyp in 4-6 Wochen mit klarem Produktionsplan'
  },
  {
    id: 'enterprise',
    title: 'Enterprise-KI-Integration',
    subtitle: 'Skalierbare KI-Lösungen für Ihr Unternehmen',
    description: 'Vollständige Umsetzung von der Architektur bis zum Go-Live mit Mitarbeiter-Training.',
    icon: <Building2 className="w-10 h-10 text-white" />,
    investment: { min: 25000, max: 200000 },
    duration: '8-16 Wochen',
    roiPotential: '150-400%',
    successRate: '85%',
    deliverables: [
      'End-to-End Implementation von der Architektur bis zum Go-Live',
      'Integration in bestehende IT-Infrastruktur',
      'Mitarbeiter-Training und Change Management',
      'Monitoring, Wartung und kontinuierliche Optimierung'
    ],
    processSteps: [
      'Architektur-Design und Systemintegration',
      'Entwicklung und Testing',
      'Deployment und Go-Live',
      'Training und kontinuierliche Optimierung'
    ],
    targetCompanySize: ['100-500 Mitarbeiter', '500-2000 Mitarbeiter', '2000+ Mitarbeiter'],
    problemStatement: 'Der Prototyp funktioniert, aber wie wird daraus ein Enterprise-System?',
    solutionHighlight: '40-70% Prozessautomatisierung mit vollständiger Systemintegration'
  }
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string>('strategy');
  const [companySize, setCompanySize] = useState<string>('100-500');
  const [budget, setBudget] = useState<number>(50000);

  const getRecommendedService = () => {
    const sizeNum = parseInt(companySize.split('-')[0]);
    if (budget < 15000) return 'prototyping';
    if (sizeNum < 100) return 'prototyping';
    if (budget > 100000) return 'enterprise';
    return 'strategy';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50 py-24 pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full filter blur-xl opacity-60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
              🚀 Premium Enterprise Services
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              Ihr Partner für Enterprise-KI, die{' '}
              <span className="text-green-600">
                ROI generiert
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
              Von der ersten Idee bis zur skalierbaren Lösung - Ihr Erfolg ist unser Maßstab
            </p>
            
            {/* Quick Service Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcher Service passt zu Ihnen?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unternehmensgröße</label>
                  <select 
                    value={companySize} 
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="10-50">10-50 Mitarbeiter</option>
                    <option value="50-200">50-200 Mitarbeiter</option>
                    <option value="200-1000">200-1000 Mitarbeiter</option>
                    <option value="1000+">1000+ Mitarbeiter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (ca.)</label>
                  <select 
                    value={budget} 
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="10000">€10.000 - €25.000</option>
                    <option value="35000">€25.000 - €50.000</option>
                    <option value="75000">€50.000 - €100.000</option>
                    <option value="150000">€100.000 - €200.000</option>
                    <option value="200000">€200.000+</option>
                  </select>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-green-800 font-medium">
                    Empfehlung für Sie: <strong>{services.find(s => s.id === getRecommendedService())?.title}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Comparison Matrix */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">Service-Vergleich</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Alle drei Services können eigenständig oder als aufeinander aufbauende Lösung genutzt werden
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Aspekt</th>
                  <th className="px-6 py-4 text-center font-semibold">KI-Strategie</th>
                  <th className="px-6 py-4 text-center font-semibold">ML-Prototyping</th>
                  <th className="px-6 py-4 text-center font-semibold">Enterprise-Integration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Investition</td>
                  <td className="px-6 py-4 text-center">€15K - €50K</td>
                  <td className="px-6 py-4 text-center">€8K - €25K</td>
                  <td className="px-6 py-4 text-center">€25K - €200K+</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Dauer</td>
                  <td className="px-6 py-4 text-center">4-8 Wochen</td>
                  <td className="px-6 py-4 text-center">4-6 Wochen</td>
                  <td className="px-6 py-4 text-center">8-16 Wochen</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">ROI-Potential</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">200-500%</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">300-800%</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">150-400%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Erfolgsrate</td>
                  <td className="px-6 py-4 text-center">95%</td>
                  <td className="px-6 py-4 text-center">90%</td>
                  <td className="px-6 py-4 text-center">85%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Zielgruppe</td>
                  <td className="px-6 py-4 text-center text-sm">C-Suite, Strategieverantwortliche</td>
                  <td className="px-6 py-4 text-center text-sm">CTOs, Produktmanager</td>
                  <td className="px-6 py-4 text-center text-sm">IT-Leiter, Projektmanager</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Unternehmensgröße</td>
                  <td className="px-6 py-4 text-center text-sm">50+ Mitarbeiter</td>
                  <td className="px-6 py-4 text-center text-sm">20+ Mitarbeiter</td>
                  <td className="px-6 py-4 text-center text-sm">100+ Mitarbeiter</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/contact"
              className="group inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Kostenlose Beratung buchen
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Detailed Service Sections */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">Detaillierte Service-Übersicht</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Klicken Sie auf einen Service für weitere Details
            </p>
          </div>

          {/* Service Selection Tabs */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedService === service.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Selected Service Detail */}
          {services.map((service) => (
            <div
              key={service.id}
              className={`${selectedService === service.id ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Service Overview */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 font-poppins">{service.title}</h3>
                        <p className="text-gray-600">{service.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">{service.description}</p>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{service.roiPotential}</div>
                        <div className="text-sm text-blue-800">ROI-Potential</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{service.successRate}</div>
                        <div className="text-sm text-green-800">Erfolgsrate</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-lg font-bold text-purple-600">{formatCurrency(service.investment.min)} - {formatCurrency(service.investment.max)}</div>
                        <div className="text-sm text-purple-800">Investition</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <div className="text-lg font-bold text-orange-600">{service.duration}</div>
                        <div className="text-sm text-orange-800">Dauer</div>
                      </div>
                    </div>

                    <Link 
                      href={`/contact?service=${service.id}`}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {service.title} anfragen
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="lg:col-span-2">
                    <div className="space-y-8">
                      {/* Problem Statement */}
                      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                        <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                          <span className="text-red-500 mr-2">⚠️</span>
                          Ihre Herausforderung:
                        </h4>
                        <p className="text-red-700 italic text-lg">"{service.problemStatement}"</p>
                      </div>

                      {/* Solution Highlight */}
                      <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <span className="text-green-500 mr-2">✨</span>
                          Meine Lösung:
                        </h4>
                        <p className="text-green-700 font-medium text-lg mb-4">{service.solutionHighlight}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Deliverables */}
                          <div>
                            <h5 className="font-semibold text-green-800 mb-3">Was Sie erhalten:</h5>
                            <ul className="space-y-2">
                              {service.deliverables.map((deliverable, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-green-700 text-sm">{deliverable}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Process Steps */}
                          <div>
                            <h5 className="font-semibold text-green-800 mb-3">Unser Vorgehen:</h5>
                            <ol className="space-y-2">
                              {service.processSteps.map((step, index) => (
                                <li key={index} className="flex items-start">
                                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                                    {index + 1}
                                  </div>
                                  <span className="text-green-700 text-sm">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 font-poppins">Bereit für Ihr KI-Projekt?</h2>
            <p className="text-xl opacity-90">
              Lassen Sie uns in einem kostenlosen Strategiegespräch klären, 
              welcher Service optimal zu Ihren Zielen passt.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/contact"
              className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Kostenloses Strategiegespräch buchen
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="/resources#roi-calculator"
              className="group inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 border-2 border-white"
            >
              ROI berechnen
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="mt-8 text-white/80 text-sm">
            <p>✅ 30 Minuten • ✅ Unverbindlich • ✅ Sofortige Insights für Ihr Business</p>
          </div>
        </div>
      </section>
    </div>
  );
}
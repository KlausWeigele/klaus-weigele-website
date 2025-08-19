"use client";

import Link from "next/link";
import Navigation from "../../components/Navigation";
import { ArrowRight, Award, Users, TrendingUp, Shield, CheckCircle, Brain, Rocket, Building2, Globe, Star, Calendar } from "lucide-react";
import { useState } from "react";

interface Credential {
  type: 'education' | 'certification' | 'experience' | 'achievement';
  title: string;
  organization: string;
  year: string;
  description: string;
  icon: React.ReactNode;
}

interface Methodology {
  phase: number;
  title: string;
  duration: string;
  description: string;
  activities: string[];
  deliverables: string[];
}

const credentials: Credential[] = [
  {
    type: 'education',
    title: 'Diplom-Ingenieur Informatik',
    organization: 'Technische Universität Musterstadt',
    year: '2010',
    description: 'Schwerpunkt: Künstliche Intelligenz und Machine Learning, Abschlussnote: 1,2',
    icon: <Award className="w-6 h-6" />
  },
  {
    type: 'certification',
    title: 'Certified AI Ethics Professional',
    organization: 'IEEE Standards Association',
    year: '2023',
    description: 'Zertifizierung für ethische KI-Entwicklung und GDPR-konforme Implementierung',
    icon: <Shield className="w-6 h-6" />
  },
  {
    type: 'experience',
    title: 'Senior Data Scientist & AI Architect',
    organization: 'Muster AG',
    year: '2015-2020',
    description: 'Leitung von 12+ KI-Projekten in der Automobilindustrie mit €50M+ Gesamtbudget',
    icon: <Building2 className="w-6 h-6" />
  },
  {
    type: 'achievement',
    title: 'AI Innovation Award',
    organization: 'German AI Association',
    year: '2022',
    description: 'Auszeichnung für herausragende KI-Implementierung im deutschen Mittelstand',
    icon: <Star className="w-6 h-6" />
  },
  {
    type: 'certification',
    title: 'Google Cloud Professional ML Engineer',
    organization: 'Google Cloud',
    year: '2023',
    description: 'Zertifizierung für Cloud-basierte ML-Lösungen und Produktionsumgebungen',
    icon: <Globe className="w-6 h-6" />
  },
  {
    type: 'experience',
    title: 'Gründer & Geschäftsführer',
    organization: 'Mustermann AI Consulting',
    year: '2020-heute',
    description: 'Beratung von 80+ Unternehmen bei KI-Transformation mit durchschnittlich 340% ROI',
    icon: <Rocket className="w-6 h-6" />
  }
];

const methodology: Methodology[] = [
  {
    phase: 1,
    title: 'Discovery & Assessment',
    duration: '1-2 Wochen',
    description: 'Tiefgreifende Analyse Ihrer aktuellen Situation und Identifikation der größten KI-Potentiale',
    activities: [
      'Stakeholder-Interviews mit Management und Fachabteilungen',
      'Analyse der aktuellen Dateninfrastruktur',
      'Assessment der organisatorischen KI-Reife',
      'Identifikation von Quick-Win Opportunities'
    ],
    deliverables: [
      'KI-Readiness Report mit Scoring',
      'Priorisierte Use-Case Matrix',
      'Stakeholder-Landkarte',
      'Quick-Win Opportunities Overview'
    ]
  },
  {
    phase: 2,
    title: 'Strategy & Planning',
    duration: '2-3 Wochen',
    description: 'Entwicklung einer maßgeschneiderten KI-Strategie mit klarem Business Case',
    activities: [
      'Business Case Entwicklung für Top-Use-Cases',
      'ROI-Kalkulation mit konservativen Annahmen',
      'Technische Architektur-Planung',
      'Change Management Strategie'
    ],
    deliverables: [
      'Strategische KI-Roadmap (12-24 Monate)',
      'Detaillierte Business Cases',
      'Technische Architektur-Blueprints',
      'Implementierungs-Zeitplan'
    ]
  },
  {
    phase: 3,
    title: 'Prototyping & Validation',
    duration: '4-6 Wochen',
    description: 'Entwicklung funktionsfähiger Prototypen mit Ihren echten Daten',
    activities: [
      'Datenanalyse und Qualitätsbewertung',
      'ML-Modell Entwicklung und Training',
      'Prototyp-Implementation mit User Interface',
      'Testing mit realen Anwendern'
    ],
    deliverables: [
      'Funktionsfähige Prototypen',
      'Technische Dokumentation',
      'User Testing Ergebnisse',
      'Produktions-Deployment Plan'
    ]
  },
  {
    phase: 4,
    title: 'Implementation & Integration',
    duration: '8-12 Wochen',
    description: 'Vollständige Umsetzung in Ihre Produktionsumgebung',
    activities: [
      'Produktions-System Entwicklung',
      'Integration in bestehende IT-Infrastruktur',
      'Mitarbeiter-Training und Change Management',
      'Go-Live Support und Überwachung'
    ],
    deliverables: [
      'Produktionsreife KI-Systeme',
      'Integrations-Documentation',
      'Geschulte Mitarbeiter',
      'Monitoring & Maintenance Setup'
    ]
  },
  {
    phase: 5,
    title: 'Optimization & Scaling',
    duration: 'Ongoing',
    description: 'Kontinuierliche Verbesserung und Ausweitung auf weitere Anwendungsfälle',
    activities: [
      'Performance Monitoring und Optimierung',
      'Datenqualitäts-Verbesserung',
      'Modell-Updates und Retraining',
      'Skalierung auf neue Use Cases'
    ],
    deliverables: [
      'Optimierte Modell-Performance',
      'Erweiterte Funktionalitäten',
      'Neue Use Case Implementations',
      'ROI-Tracking und Reporting'
    ]
  }
];

export default function AboutPage() {
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [activeMethodologyPhase, setActiveMethodologyPhase] = useState<number>(1);

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'education': return 'bg-blue-100 text-blue-600';
      case 'certification': return 'bg-green-100 text-green-600';
      case 'experience': return 'bg-gray-100 text-gray-600';
      case 'achievement': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCredentialTypeLabel = (type: string) => {
    switch (type) {
      case 'education': return 'Ausbildung';
      case 'certification': return 'Zertifizierung';
      case 'experience': return 'Berufserfahrung';
      case 'achievement': return 'Auszeichnung';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50 py-24 pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full filter blur-xl opacity-60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
                🎯 Ihr KI-Strategieberater
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
                Max Mustermann
              </h1>
              <p className="text-2xl text-gray-700 mb-6 font-medium">
                Diplom-Ingenieur für <span className="text-blue-600">KI-Transformation</span> im deutschen Mittelstand
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Seit 2010 helfe ich Unternehmen dabei, KI erfolgreich zu implementieren. 
                Mit über 80 abgeschlossenen Projekten und einem durchschnittlichen ROI von 340% 
                verwandle ich KI-Visionen in messbare Geschäftsergebnisse.
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">80+</div>
                  <div className="text-sm text-gray-600">Erfolgreiche Projekte</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">340%</div>
                  <div className="text-sm text-gray-600">Durchschnittlicher ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">13+</div>
                  <div className="text-sm text-gray-600">Jahre Erfahrung</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact"
                  className="group inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Kostenloses Strategiegespräch
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link 
                  href="/case-studies"
                  className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md border border-gray-200"
                >
                  Erfolgsgeschichten ansehen
                  <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Profile Image Placeholder */}
            <div className="lg:order-last">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-gray-100 rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Max Mustermann</p>
                    <p className="text-sm text-gray-500">Diplom-Ingenieur Informatik</p>
                  </div>
                </div>
                {/* Floating Cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <div>
                      <div className="font-bold text-gray-900">4.9/5.0</div>
                      <div className="text-xs text-gray-600">Kundenbewertung</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <div className="font-bold text-gray-900">100%</div>
                      <div className="text-xs text-gray-600">Projekterfolg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">Qualifikationen & Expertise</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Fundierte Ausbildung, kontinuierliche Weiterbildung und bewährte Praxiserfahrung
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {credentials.map((credential, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedCredential === credential.title ? 'ring-2 ring-blue-600 transform scale-105' : 'hover:-translate-y-1'
                }`}
                onClick={() => setSelectedCredential(selectedCredential === credential.title ? null : credential.title)}
              >
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${getCredentialIcon(credential.type)}`}>
                    {credential.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCredentialIcon(credential.type)}`}>
                        {getCredentialTypeLabel(credential.type)}
                      </span>
                      <span className="text-sm text-gray-500">{credential.year}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{credential.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{credential.organization}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">{credential.description}</p>
                
                {selectedCredential === credential.title && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-blue-600 text-sm font-medium">
                      Klicken Sie erneut, um zu schließen
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">Mein bewährter Ansatz</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ein strukturierter 5-Phasen-Prozess, der seit Jahren zu messbaren Erfolgen führt
            </p>
          </div>

          {/* Phase Navigation */}
          <div className="flex justify-center mb-12 overflow-x-auto">
            <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-lg">
              {methodology.map((phase) => (
                <button
                  key={phase.phase}
                  onClick={() => setActiveMethodologyPhase(phase.phase)}
                  className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeMethodologyPhase === phase.phase
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                    activeMethodologyPhase === phase.phase
                      ? 'bg-white text-blue-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {phase.phase}
                  </span>
                  {phase.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Phase Detail */}
          {methodology.map((phase) => (
            <div
              key={phase.phase}
              className={`${activeMethodologyPhase === phase.phase ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full font-semibold mb-4">
                    Phase {phase.phase} • {phase.duration}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">{phase.title}</h3>
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto">{phase.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Activities */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Rocket className="w-5 h-5 mr-2 text-blue-600" />
                      Aktivitäten
                    </h4>
                    <div className="space-y-4">
                      {phase.activities.map((activity, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Ergebnisse
                    </h4>
                    <div className="space-y-4">
                      {phase.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{deliverable}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Process Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Messbare Erfolge</h4>
              <p className="text-gray-600 text-sm">
                Jede Phase liefert konkrete, messbare Ergebnisse mit klarem Business Value
              </p>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Risikominimierung</h4>
              <p className="text-gray-600 text-sm">
                Strukturiertes Vorgehen mit kontinuierlicher Validierung reduziert Projektrisiken
              </p>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Team-Integration</h4>
              <p className="text-gray-600 text-sm">
                Ihr Team wird von Anfang an einbezogen und befähigt, die Lösung selbst zu betreiben
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Approach */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">Meine Arbeitsweise</h2>
            <p className="text-xl text-gray-700">
              Was Sie von der Zusammenarbeit mit mir erwarten können
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Strategisch & Praktisch
                </h3>
                <p className="text-blue-800 text-sm">
                  Ich verbinde strategisches Denken mit handfester Umsetzung. Keine Powerpoint-Strategie, 
                  sondern funktionsfähige Systeme, die sofort Wert schaffen.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  ROI-Fokussiert
                </h3>
                <p className="text-green-800 text-sm">
                  Jedes Projekt muss sich rechnen. Ich entwickle Lösungen mit klarem Business Case 
                  und tracke den tatsächlichen ROI vom ersten Tag an.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Partnerschaftlich
                </h3>
                <p className="text-purple-800 text-sm">
                  Ich arbeite als Ihr Partner, nicht als externer Berater. Ihr Team wird von Anfang an 
                  einbezogen und befähigt, die Lösungen eigenständig weiterzuentwickeln.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Sicherheit & Compliance
                </h3>
                <p className="text-orange-800 text-sm">
                  DSGVO-Konformität und Datenschutz stehen von Beginn an im Fokus. 
                  Alle Lösungen werden nach deutschen und europäischen Standards entwickelt.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Transparenz & Ehrlichkeit
                </h3>
                <p className="text-gray-800 text-sm">
                  Sie erhalten regelmäßige Updates und ehrliches Feedback. Wenn etwas nicht funktioniert, 
                  sage ich das direkt und entwickle Alternativen.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Innovativ & Bewährt
                </h3>
                <p className="text-yellow-800 text-sm">
                  Ich setze auf bewährte Technologien und Methoden, bin aber immer bereit, 
                  innovative Ansätze zu testen, wenn sie klaren Mehrwert bieten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 font-poppins">Bereit für Ihr KI-Projekt?</h2>
            <p className="text-xl opacity-90">
              Lassen Sie uns in einem kostenlosen Gespräch klären, wie KI Ihr Unternehmen voranbringen kann
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/contact"
              className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Kostenloses Strategiegespräch
              <Calendar className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="/case-studies"
              className="group inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 border-2 border-white"
            >
              Erfolgsgeschichten ansehen
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
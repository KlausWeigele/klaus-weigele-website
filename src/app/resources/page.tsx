"use client";

import Link from "next/link";
import { ArrowRight, Download, Calculator, CheckCircle, Brain, Target, Shield, Users, TrendingUp, Clock, BookOpen, Play, Star } from "lucide-react";
import { useState, useEffect } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'tool' | 'guide' | 'template' | 'assessment';
  targetPersona: string[];
  category: string;
  downloadCount: number;
  rating: number;
  estimatedTime: string;
  outcomes: string[];
  ctaText: string;
  ctaAction: string;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  options: { text: string; weight: number }[];
  category: 'strategy' | 'data' | 'technology' | 'culture';
}

interface ROIInputs {
  companySize: string;
  industry: string;
  currentProcessCost: number;
  timeSpent: number;
  errorRate: number;
  expectedAutomation: number;
}

const resources: Resource[] = [
  {
    id: 'ki-readiness-assessment',
    title: 'KI-Readiness Assessment',
    description: 'Bewerten Sie in 5 Minuten die KI-Reife Ihres Unternehmens und erhalten Sie eine personalisierte Roadmap.',
    type: 'assessment',
    targetPersona: ['C-Suite', 'CTO', 'Project Manager'],
    category: 'Strategie',
    downloadCount: 1247,
    rating: 4.8,
    estimatedTime: '5 Minuten',
    outcomes: [
      'KI-Readiness Score (0-100)',
      'Personalisierte Empfehlungen',
      'Quick-Win Opportunities',
      'Strategische Roadmap'
    ],
    ctaText: 'Assessment starten',
    ctaAction: 'assessment'
  },
  {
    id: 'roi-calculator',
    title: 'KI-ROI Calculator',
    description: 'Berechnen Sie das Einsparpotential und den ROI Ihrer geplanten KI-Projekte mit branchenspezifischen Daten.',
    type: 'tool',
    targetPersona: ['C-Suite', 'Project Manager'],
    category: 'Business Case',
    downloadCount: 892,
    rating: 4.9,
    estimatedTime: '8 Minuten',
    outcomes: [
      'Präzise ROI-Projektion',
      'Break-Even Analyse',
      'Risiko-Assessment',
      'Management-Präsentation'
    ],
    ctaText: 'ROI berechnen',
    ctaAction: 'calculator'
  },
  {
    id: 'implementation-guide',
    title: 'KI-Implementierungs-Leitfaden',
    description: 'Schritt-für-Schritt Anleitung für erfolgreiche KI-Projekte von der Strategie bis zum Go-Live.',
    type: 'guide',
    targetPersona: ['CTO', 'Project Manager'],
    category: 'Implementation',
    downloadCount: 634,
    rating: 4.7,
    estimatedTime: '20 Minuten',
    outcomes: [
      '8-Phasen Implementation Framework',
      'Checklisten und Templates',
      'Risk Mitigation Strategies',
      'Change Management Plan'
    ],
    ctaText: 'Guide herunterladen',
    ctaAction: 'download'
  },
  {
    id: 'dsgvo-checklist',
    title: 'DSGVO-KI Compliance Checklist',
    description: 'Vollständige Checkliste für datenschutzkonforme KI-Projekte mit rechtlichen Anforderungen.',
    type: 'template',
    targetPersona: ['CTO', 'Project Manager'],
    category: 'Compliance',
    downloadCount: 421,
    rating: 4.9,
    estimatedTime: '15 Minuten',
    outcomes: [
      'DSGVO-Compliance Verification',
      'Privacy-by-Design Framework',
      'Audit-Ready Documentation',
      'Legal Risk Assessment'
    ],
    ctaText: 'Checklist herunterladen',
    ctaAction: 'download'
  },
  {
    id: 'business-case-template',
    title: 'KI Business Case Template',
    description: 'Professionelle Vorlage für überzeugende KI-Business Cases mit Kostenkalkulationen und ROI-Prognosen.',
    type: 'template',
    targetPersona: ['C-Suite', 'Project Manager'],
    category: 'Business Case',
    downloadCount: 789,
    rating: 4.6,
    estimatedTime: '30 Minuten',
    outcomes: [
      'Executive-Ready Presentation',
      'Financial Modeling Framework',
      'Risk/Benefit Analysis',
      'Implementation Timeline'
    ],
    ctaText: 'Template herunterladen',
    ctaAction: 'download'
  },
  {
    id: 'technical-architecture-guide',
    title: 'KI-Architektur Best Practices',
    description: 'Technische Richtlinien für skalierbare und wartbare KI-Systeme in Unternehmensumgebungen.',
    type: 'guide',
    targetPersona: ['CTO'],
    category: 'Technik',
    downloadCount: 356,
    rating: 4.8,
    estimatedTime: '25 Minuten',
    outcomes: [
      'Architecture Design Patterns',
      'Scalability Guidelines',
      'Security Best Practices',
      'Integration Strategies'
    ],
    ctaText: 'Guide herunterladen',
    ctaAction: 'download'
  }
];

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'data-quality',
    question: 'Wie würden Sie die Qualität Ihrer aktuellen Dateninfrastruktur bewerten?',
    category: 'data',
    options: [
      { text: 'Exzellent - Vollständig digitalisiert und strukturiert', weight: 10 },
      { text: 'Gut - Größtenteils digital, einige Datenlücken', weight: 7 },
      { text: 'Befriedigend - Gemischte Systeme, manuelle Prozesse', weight: 4 },
      { text: 'Mangelhaft - Hauptsächlich papierbasiert oder fragmentiert', weight: 1 }
    ]
  },
  {
    id: 'strategic-commitment',
    question: 'Wie stark ist das Management-Commitment für KI-Investitionen?',
    category: 'strategy',
    options: [
      { text: 'Sehr stark - KI ist strategische Priorität mit Budget', weight: 10 },
      { text: 'Stark - Interesse vorhanden, Budget in Planung', weight: 7 },
      { text: 'Moderat - Interesse da, aber keine konkreten Pläne', weight: 4 },
      { text: 'Gering - Nur explorative Gespräche', weight: 1 }
    ]
  },
  {
    id: 'technical-expertise',
    question: 'Wie ist die interne KI/ML-Expertise in Ihrem Unternehmen?',
    category: 'technology',
    options: [
      { text: 'Sehr gut - Eigenes Data Science Team vorhanden', weight: 10 },
      { text: 'Gut - Einzelne Experten, aber kein Team', weight: 7 },
      { text: 'Basic - Grundlagenwissen vorhanden', weight: 4 },
      { text: 'Keine - Komplett neues Terrain', weight: 1 }
    ]
  },
  {
    id: 'change-readiness',
    question: 'Wie aufgeschlossen sind Ihre Mitarbeiter gegenüber neuen Technologien?',
    category: 'culture',
    options: [
      { text: 'Sehr aufgeschlossen - Innovation wird gefördert', weight: 10 },
      { text: 'Aufgeschlossen - Nach Einführung positive Akzeptanz', weight: 7 },
      { text: 'Gemischt - Teilweise Widerstand zu erwarten', weight: 4 },
      { text: 'Skeptisch - Hoher Change Management Bedarf', weight: 1 }
    ]
  },
  {
    id: 'process-automation',
    question: 'Welcher Anteil Ihrer Geschäftsprozesse ist bereits automatisiert?',
    category: 'technology',
    options: [
      { text: '80-100% - Hochgradig automatisiert', weight: 10 },
      { text: '50-79% - Gut automatisiert', weight: 7 },
      { text: '20-49% - Teilweise automatisiert', weight: 4 },
      { text: '0-19% - Hauptsächlich manuelle Prozesse', weight: 1 }
    ]
  }
];

export default function ResourcesPage() {
  const [selectedPersona, setSelectedPersona] = useState<string>('Alle');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [activeTab, setActiveTab] = useState<'resources' | 'assessment' | 'calculator'>('resources');
  
  // Assessment State
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);
  
  // ROI Calculator State
  const [roiInputs, setROIInputs] = useState<ROIInputs>({
    companySize: '100-500',
    industry: 'Manufacturing',
    currentProcessCost: 50000,
    timeSpent: 40,
    errorRate: 5,
    expectedAutomation: 70
  });
  const [roiResults, setROIResults] = useState<any>(null);

  const personas = ['Alle', 'C-Suite', 'CTO', 'Project Manager'];
  const categories = ['Alle', 'Strategie', 'Business Case', 'Implementation', 'Compliance', 'Technik'];

  const filteredResources = resources.filter(resource => {
    const personaMatch = selectedPersona === 'Alle' || resource.targetPersona.includes(selectedPersona);
    const categoryMatch = selectedCategory === 'Alle' || resource.category === selectedCategory;
    return personaMatch && categoryMatch;
  });

  const calculateAssessment = () => {
    const totalScore = Object.values(assessmentAnswers).reduce((sum, score) => sum + score, 0);
    const maxScore = assessmentQuestions.length * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);
    setAssessmentScore(percentage);
    setAssessmentComplete(true);
  };

  const calculateROI = () => {
    const { currentProcessCost, timeSpent, errorRate, expectedAutomation } = roiInputs;
    
    // Industry multipliers
    const industryMultipliers = {
      'Manufacturing': 1.2,
      'Logistics': 1.1,
      'Healthcare': 1.3,
      'Finance': 1.4,
      'Technology': 1.0
    };
    
    const multiplier = industryMultipliers[roiInputs.industry as keyof typeof industryMultipliers] || 1.0;
    
    const automationSavings = (currentProcessCost * (expectedAutomation / 100)) * multiplier;
    const timeSavings = (timeSpent * 52 * 50) * 0.7; // 52 weeks, €50/hour
    const errorReduction = (currentProcessCost * (errorRate / 100)) * 0.8;
    
    const totalSavings = automationSavings + timeSavings + errorReduction;
    const implementationCost = currentProcessCost * 0.6; // Estimated implementation cost
    const roi = ((totalSavings - implementationCost) / implementationCost) * 100;
    
    setROIResults({
      totalSavings: Math.round(totalSavings),
      implementationCost: Math.round(implementationCost),
      roi: Math.round(roi),
      paybackMonths: Math.round((implementationCost / (totalSavings / 12))),
      automationSavings: Math.round(automationSavings),
      timeSavings: Math.round(timeSavings),
      errorReduction: Math.round(errorReduction)
    });
  };

  const getAssessmentRecommendation = (score: number) => {
    if (score >= 80) return {
      level: 'KI-Ready',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      recommendation: 'Ihr Unternehmen ist bereit für ambitionierte KI-Projekte. Fokus auf Enterprise-Integration und Skalierung.',
      nextSteps: ['Enterprise KI-Strategie entwickeln', 'Pilot-Projekte mit hohem ROI starten', 'Internes KI-Center of Excellence aufbauen']
    };
    if (score >= 60) return {
      level: 'KI-Bereit',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      recommendation: 'Solide Grundlage vorhanden. Beginnen Sie mit strukturierten Pilotprojekten und gezieltem Capacity Building.',
      nextSteps: ['KI-Strategie Workshop buchen', 'Pilot-Projekt mit ML-Prototyping starten', 'Team-Training organisieren']
    };
    if (score >= 40) return {
      level: 'KI-Vorbereitung',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      recommendation: 'Wichtige Grundlagen fehlen noch. Investieren Sie zuerst in Dateninfrastruktur und Change Management.',
      nextSteps: ['Datenqualität verbessern', 'Management Alignment schaffen', 'Externe KI-Beratung hinzuziehen']
    };
    return {
      level: 'KI-Aufbau',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      recommendation: 'Starten Sie mit den Fundamenten: Datenstrategie, organisatorische Vorbereitung und Kompetenzaufbau.',
      nextSteps: ['KI-Grundlagen Workshop', 'Datenstrategie entwickeln', 'Quick-Win Identifikation']
    };
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
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full filter blur-xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full filter blur-xl opacity-60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
              🚀 Kostenlose KI-Tools & Ressourcen
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              Ihr KI-Success{' '}
              <span className="text-green-600">
                Toolkit
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
              Bewährte Tools und Vorlagen für erfolgreiche KI-Projekte - sofort anwendbar
            </p>
            
            {/* Quick Tool Access */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <button
                onClick={() => setActiveTab('assessment')}
                className="group flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Target className="w-5 h-5 mr-2" />
                KI-Readiness Check (5 Min)
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className="group flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Calculator className="w-5 h-5 mr-2" />
                ROI Calculator (8 Min)
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-xl p-2 flex space-x-2">
              {[
                { id: 'resources', label: 'Ressourcen-Bibliothek', icon: BookOpen },
                { id: 'assessment', label: 'KI-Readiness Assessment', icon: Target },
                { id: 'calculator', label: 'ROI Calculator', icon: Calculator }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Library Tab */}
      {activeTab === 'resources' && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">Zielgruppe</label>
                <div className="flex flex-wrap gap-2">
                  {personas.map(persona => (
                    <button
                      key={persona}
                      onClick={() => setSelectedPersona(persona)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedPersona === persona
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {persona}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">Kategorie</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resource.type === 'tool' ? 'bg-blue-100 text-blue-800' :
                          resource.type === 'assessment' ? 'bg-green-100 text-green-800' :
                          resource.type === 'guide' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {resource.type === 'tool' ? 'Tool' :
                           resource.type === 'assessment' ? 'Assessment' :
                           resource.type === 'guide' ? 'Guide' : 'Template'}
                        </span>
                        <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                          {resource.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{resource.title}</h3>
                      <p className="text-gray-600 mb-4">{resource.description}</p>
                    </div>
                  </div>

                  {/* Resource Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center bg-blue-50 rounded-lg p-3">
                      <div className="font-bold text-blue-600">{resource.downloadCount.toLocaleString()}</div>
                      <div className="text-xs text-blue-800">Downloads</div>
                    </div>
                    <div className="text-center bg-yellow-50 rounded-lg p-3">
                      <div className="font-bold text-yellow-600 flex items-center justify-center">
                        {resource.rating} <Star className="w-3 h-3 ml-1 fill-current" />
                      </div>
                      <div className="text-xs text-yellow-800">Bewertung</div>
                    </div>
                    <div className="text-center bg-purple-50 rounded-lg p-3">
                      <div className="font-bold text-gray-600">{resource.estimatedTime}</div>
                      <div className="text-xs text-purple-800">Zeitaufwand</div>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Was Sie erhalten:</h4>
                    <ul className="space-y-2">
                      {resource.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => {
                      if (resource.ctaAction === 'assessment') {
                        setActiveTab('assessment');
                      } else if (resource.ctaAction === 'calculator') {
                        setActiveTab('calculator');
                      }
                    }}
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {resource.ctaText}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KI-Readiness Assessment Tab */}
      {activeTab === 'assessment' && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {!assessmentComplete ? (
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">KI-Readiness Assessment</h2>
                  <p className="text-gray-600">
                    Bewerten Sie in 5 Minuten die KI-Reife Ihres Unternehmens
                  </p>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(Object.keys(assessmentAnswers).length / assessmentQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {Object.keys(assessmentAnswers).length} von {assessmentQuestions.length} Fragen beantwortet
                  </p>
                </div>

                <div className="space-y-8">
                  {assessmentQuestions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {index + 1}. {question.question}
                      </h3>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={option.weight}
                              onChange={(e) => setAssessmentAnswers(prev => ({
                                ...prev,
                                [question.id]: parseInt(e.target.value)
                              }))}
                              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 mr-3"
                            />
                            <span className="text-gray-700">{option.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={calculateAssessment}
                    disabled={Object.keys(assessmentAnswers).length !== assessmentQuestions.length}
                    className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assessment auswerten
                    <ArrowRight className="ml-2 w-5 h-5 inline" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-3xl font-bold text-green-600">{assessmentScore}%</div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Ihr KI-Readiness Score</h2>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getAssessmentRecommendation(assessmentScore).bgColor} ${getAssessmentRecommendation(assessmentScore).color}`}>
                    {getAssessmentRecommendation(assessmentScore).level}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Empfehlung:</h3>
                    <p className="text-gray-700">{getAssessmentRecommendation(assessmentScore).recommendation}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nächste Schritte:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {getAssessmentRecommendation(assessmentScore).nextSteps.map((step, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-4">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
                            {index + 1}
                          </div>
                          <p className="text-blue-800 text-sm font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 pt-8 border-t border-gray-200">
                  <p className="text-gray-600 mb-4">Bereit für den nächsten Schritt?</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Kostenloses Strategiegespräch buchen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ROI Calculator Tab */}
      {activeTab === 'calculator' && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">KI-ROI Calculator</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Berechnen Sie das Einsparpotential und den ROI Ihrer geplanten KI-Projekte mit branchenspezifischen Daten
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Input Form */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Projektdaten eingeben</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unternehmensgröße</label>
                      <select
                        value={roiInputs.companySize}
                        onChange={(e) => setROIInputs(prev => ({ ...prev, companySize: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="10-50">10-50 Mitarbeiter</option>
                        <option value="50-200">50-200 Mitarbeiter</option>
                        <option value="200-1000">200-1000 Mitarbeiter</option>
                        <option value="1000+">1000+ Mitarbeiter</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Branche</label>
                      <select
                        value={roiInputs.industry}
                        onChange={(e) => setROIInputs(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Technology">Technology</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aktuelle Prozesskosten pro Jahr (€)
                    </label>
                    <input
                      type="number"
                      value={roiInputs.currentProcessCost}
                      onChange={(e) => setROIInputs(prev => ({ ...prev, currentProcessCost: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="z.B. 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zeitaufwand pro Woche (Stunden)
                    </label>
                    <input
                      type="number"
                      value={roiInputs.timeSpent}
                      onChange={(e) => setROIInputs(prev => ({ ...prev, timeSpent: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="z.B. 40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Geschätzte Fehlerrate (%)
                    </label>
                    <input
                      type="number"
                      value={roiInputs.errorRate}
                      onChange={(e) => setROIInputs(prev => ({ ...prev, errorRate: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="z.B. 5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Erwartete Automatisierung (%)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="10"
                        value={roiInputs.expectedAutomation}
                        onChange={(e) => setROIInputs(prev => ({ ...prev, expectedAutomation: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold text-blue-600">{roiInputs.expectedAutomation}%</span>
                    </div>
                  </div>

                  <button
                    onClick={calculateROI}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    ROI berechnen
                    <Calculator className="ml-2 w-5 h-5 inline" />
                  </button>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  {roiResults ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900">Ihre ROI-Projektion</h3>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-xl p-6 text-center">
                          <div className="text-3xl font-bold text-green-600">{roiResults.roi}%</div>
                          <div className="text-sm text-green-800">Return on Investment</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 text-center">
                          <div className="text-2xl font-bold text-blue-600">{roiResults.paybackMonths}</div>
                          <div className="text-sm text-blue-800">Monate bis Break-Even</div>
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Jährliche Gesamteinsparungen:</span>
                            <span className="font-bold text-green-600">{formatCurrency(roiResults.totalSavings)}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Geschätzte Implementierungskosten:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(roiResults.implementationCost)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Savings Breakdown */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Einsparungsaufschlüsselung:</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Prozessautomatisierung:</span>
                            <span className="font-medium">{formatCurrency(roiResults.automationSavings)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Zeitersparnis:</span>
                            <span className="font-medium">{formatCurrency(roiResults.timeSavings)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-600">Fehlerreduzierung:</span>
                            <span className="font-medium">{formatCurrency(roiResults.errorReduction)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p className="text-blue-700 text-sm">
                          <strong>Hinweis:</strong> Diese Kalkulation basiert auf Durchschnittswerten und Erfahrungsdaten. 
                          Die tatsächlichen Ergebnisse können je nach spezifischen Umständen variieren.
                        </p>
                      </div>

                      <div className="text-center pt-4 border-t border-gray-200">
                        <Link
                          href="/contact"
                          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Detailierte Analyse anfragen
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Geben Sie Ihre Projektdaten ein und klicken Sie auf "ROI berechnen"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 font-poppins">Bereit für Ihr KI-Projekt?</h2>
            <p className="text-xl opacity-90">
              Nutzen Sie die Erkenntnisse aus unseren Tools für ein strategisches Beratungsgespräch
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/contact"
              className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Kostenloses Strategiegespräch
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
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
            <p>✅ Unverbindlich • ✅ 30 Minuten • ✅ Personalisierte Empfehlungen</p>
          </div>
        </div>
      </section>
    </div>
  );
}
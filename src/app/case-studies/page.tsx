"use client";

import Link from "next/link";
import Navigation from "../../components/Navigation";
import { ArrowRight, Filter, Search, Star, TrendingUp, Clock, Euro, Building, Users, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";

interface CaseStudy {
  id: string;
  title: string;
  client: {
    company: string;
    industry: string;
    size: string;
    location: string;
  };
  project: {
    serviceType: 'strategy' | 'prototyping' | 'enterprise';
    duration: string;
    investment: number;
    challenge: string;
    solution: string;
    implementation: string[];
  };
  results: {
    roi: number;
    costSavings: number;
    timeReduction: number;
    additionalMetrics: Record<string, string>;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    rating: number;
  };
  tags: string[];
  featured: boolean;
  summary: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'techcorp-automation',
    title: 'Datenanalyse-Automatisierung bei Muster AG',
    client: {
      company: 'Muster AG',
      industry: 'Manufacturing',
      size: '500-1000 Mitarbeiter',
      location: 'Musterstadt'
    },
    project: {
      serviceType: 'enterprise',
      duration: '12 Wochen',
      investment: 85000,
      challenge: 'Manuelle Datenanalyse kostete wöchentlich 40 Stunden, fehleranfällig und langsam',
      solution: 'KI-gestützte Automatisierung der kompletten Analysepipeline mit Real-time Dashboard',
      implementation: [
        'Datenarchitektur-Modernisierung',
        'ML-Pipeline für automatisierte Analysen',
        'Interactive Business Intelligence Dashboard',
        'Mitarbeiter-Training und Change Management'
      ]
    },
    results: {
      roi: 450,
      costSavings: 2100000,
      timeReduction: 85,
      additionalMetrics: {
        'Prozessgeschwindigkeit': '90% schneller',
        'Datenqualität': '95% Genauigkeit',
        'Mitarbeiterzufriedenheit': '+40%'
      }
    },
    testimonial: {
      quote: 'Max hat unsere Datenanalyse revolutioniert. Statt Wochen brauchen wir jetzt Stunden für komplexe Auswertungen. ROI von 450% im ersten Jahr!',
      author: 'Michael Hoffmann',
      role: 'CTO, Muster AG',
      rating: 5
    },
    tags: ['Datenanalyse', 'Automatisierung', 'Manufacturing', 'Enterprise', 'ROI 400%+'],
    featured: true,
    summary: 'Vollautomatisierte Datenanalyse-Pipeline mit 450% ROI und 85% Zeitersparnis'
  },
  {
    id: 'logisticplus-optimization',
    title: 'Supply Chain Optimierung bei Logistik GmbH',
    client: {
      company: 'Logistik GmbH',
      industry: 'Logistics',
      size: '200-500 Mitarbeiter',
      location: 'Musterstadt'
    },
    project: {
      serviceType: 'prototyping',
      duration: '6 Wochen',
      investment: 22000,
      challenge: 'Ineffiziente Lieferketten mit hohen Lagerkosten und unpünktlichen Lieferungen',
      solution: 'KI-basierte Demand Forecasting und Route Optimization',
      implementation: [
        'Historische Datenanalyse und Musterkennung',
        'Predictive Analytics für Nachfrageprognosen',
        'Dynamische Routenoptimierung',
        'Proof-of-Concept mit Live-Daten'
      ]
    },
    results: {
      roi: 320,
      costSavings: 450000,
      timeReduction: 30,
      additionalMetrics: {
        'Liefertreue': '99.2%',
        'Lagerkosten': '-35%',
        'Kundenzufriedenheit': '+25%'
      }
    },
    testimonial: {
      quote: 'Dank Max\' KI-Lösung optimieren wir unsere Lieferketten automatisch. 35% weniger Lagerkosten und perfekte Lieferzeiten.',
      author: 'Sarah Müller',
      role: 'Head of Operations, Logistik GmbH',
      rating: 5
    },
    tags: ['Supply Chain', 'Optimization', 'Logistics', 'Prototyping', 'ROI 300-400%'],
    featured: true,
    summary: 'Intelligente Lieferketten-Optimierung mit 320% ROI und 99,2% Liefertreue'
  },
  {
    id: 'innovatemed-diagnosis',
    title: 'KI-Diagnose-System bei MedTech GmbH',
    client: {
      company: 'MedTech GmbH',
      industry: 'Healthcare',
      size: '100-200 Mitarbeiter',
      location: 'Musterstadt'
    },
    project: {
      serviceType: 'strategy',
      duration: '8 Wochen',
      investment: 35000,
      challenge: 'Langsame und teilweise ungenaue medizinische Diagnosen belasten Patienten und Personal',
      solution: 'DSGVO-konforme KI-Strategie für automatisierte Vorbewertung medizinischer Daten',
      implementation: [
        'Compliance-Analyse für Medizindaten',
        'KI-Use-Case Priorisierung',
        'Prototyp-Roadmap mit Ethik-Framework',
        'Regulatorische Zulassungsstrategie'
      ]
    },
    results: {
      roi: 280,
      costSavings: 750000,
      timeReduction: 60,
      additionalMetrics: {
        'Diagnosezeit': '60% schneller',
        'Genauigkeit': '92% Präzision',
        'Patientenzufriedenheit': '+35%'
      }
    },
    testimonial: {
      quote: 'Professionell, strukturiert, ergebnisorientiert. Max hat unser medizinisches KI-System DSGVO-konform umgesetzt. Beeindruckend!',
      author: 'Dr. Robert Fischer',
      role: 'Geschäftsführer, MedTech GmbH',
      rating: 5
    },
    tags: ['Healthcare', 'Medical AI', 'GDPR', 'Strategy', 'ROI 200-300%'],
    featured: true,
    summary: 'DSGVO-konforme medizinische KI-Strategie mit 280% ROI und 60% schnelleren Diagnosen'
  },
  {
    id: 'dataflow-analytics',
    title: 'Business Intelligence bei Analytics GmbH',
    client: {
      company: 'Analytics GmbH',
      industry: 'Technology',
      size: '50-100 Mitarbeiter',
      location: 'Musterstadt'
    },
    project: {
      serviceType: 'prototyping',
      duration: '4 Wochen',
      investment: 15000,
      challenge: 'Fragmentierte Datensilos ohne einheitliche Business Intelligence',
      solution: 'Unified Analytics Dashboard mit automatisierten Insights',
      implementation: [
        'Datenintegration aus verschiedenen Systemen',
        'Real-time Analytics Dashboard',
        'Automatisierte Report-Generierung',
        'Self-Service BI für alle Abteilungen'
      ]
    },
    results: {
      roi: 380,
      costSavings: 180000,
      timeReduction: 70,
      additionalMetrics: {
        'Report-Erstellung': '70% schneller',
        'Datenqualität': '+50%',
        'Entscheidungsgeschwindigkeit': '+40%'
      }
    },
    testimonial: {
      quote: 'Endlich haben wir alle unsere Daten an einem Ort. Die automatischen Insights helfen uns bei allen wichtigen Entscheidungen.',
      author: 'Lisa Weber',
      role: 'Head of Analytics, Analytics GmbH',
      rating: 5
    },
    tags: ['Business Intelligence', 'Analytics', 'Technology', 'Prototyping', 'ROI 300-400%'],
    featured: false,
    summary: 'Einheitliches BI-Dashboard mit 380% ROI und 70% schnellerer Report-Erstellung'
  },
  {
    id: 'smartfactory-production',
    title: 'Smart Factory Optimierung',
    client: {
      company: 'Production AG',
      industry: 'Manufacturing',
      size: '1000+ Mitarbeiter',
      location: 'Musterstadt'
    },
    project: {
      serviceType: 'enterprise',
      duration: '16 Wochen',
      investment: 150000,
      challenge: 'Produktionsausfälle und ineffiziente Maschinenwartung kosten Millionen',
      solution: 'Predictive Maintenance und Produktionsoptimierung mit IoT-Integration',
      implementation: [
        'IoT-Sensor-Integration in Produktionsanlagen',
        'Machine Learning für Predictive Maintenance',
        'Produktionsplanung-Optimierung',
        'Vollständige Integration in MES-System'
      ]
    },
    results: {
      roi: 220,
      costSavings: 3200000,
      timeReduction: 45,
      additionalMetrics: {
        'Ungeplante Ausfälle': '-80%',
        'Wartungskosten': '-40%',
        'Produktivität': '+25%'
      }
    },
    testimonial: {
      quote: 'Die Predictive Maintenance hat unsere Ausfallzeiten dramatisch reduziert. Eine Investition, die sich bereits im ersten Jahr amortisiert hat.',
      author: 'Thomas Schmidt',
      role: 'Produktionsleiter, Production AG',
      rating: 5
    },
    tags: ['Smart Factory', 'Predictive Maintenance', 'Manufacturing', 'Enterprise', 'ROI 200-300%'],
    featured: false,
    summary: 'Smart Factory Transformation mit 220% ROI und 80% weniger ungeplanten Ausfällen'
  }
];

interface FilterState {
  industries: string[];
  serviceTypes: string[];
  roiRange: [number, number];
  searchQuery: string;
}

export default function CaseStudiesPage() {
  const [filters, setFilters] = useState<FilterState>({
    industries: [],
    serviceTypes: [],
    roiRange: [0, 500],
    searchQuery: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);

  const industries = ['Manufacturing', 'Logistics', 'Healthcare', 'Technology'];
  const serviceTypes = ['strategy', 'prototyping', 'enterprise'];
  const serviceTypeLabels = {
    strategy: 'KI-Strategie',
    prototyping: 'ML-Prototyping', 
    enterprise: 'Enterprise-Integration'
  };

  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter(study => {
      const matchesIndustry = filters.industries.length === 0 || 
        filters.industries.includes(study.client.industry);
      
      const matchesServiceType = filters.serviceTypes.length === 0 || 
        filters.serviceTypes.includes(study.project.serviceType);
      
      const matchesROI = study.results.roi >= filters.roiRange[0] && 
        study.results.roi <= filters.roiRange[1];
      
      const matchesSearch = filters.searchQuery === '' ||
        study.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        study.client.company.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        study.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      return matchesIndustry && matchesServiceType && matchesROI && matchesSearch;
    });
  }, [filters]);

  const featuredStudies = filteredCaseStudies.filter(study => study.featured);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'strategy': return 'bg-green-100 text-green-800';
      case 'prototyping': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    if (filterType === 'industries' || filterType === 'serviceTypes') {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
      }));
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
              📊 Bewiesene Erfolge
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              KI-Projekte mit{' '}
              <span className="text-green-600">
                messbarem ROI
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
              Echte Erfolgsgeschichten von Unternehmen, die mit KI ihre Ziele erreicht haben
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-blue-600">{filteredCaseStudies.length}</div>
                <div className="text-sm text-gray-600">Erfolgreiche Projekte</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(filteredCaseStudies.reduce((acc, study) => acc + study.results.roi, 0) / filteredCaseStudies.length)}%
                </div>
                <div className="text-sm text-gray-600">Durchschnittlicher ROI</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(filteredCaseStudies.reduce((acc, study) => acc + study.results.costSavings, 0))}
                </div>
                <div className="text-sm text-gray-600">Gesamte Einsparungen</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Kundenzufriedenheit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Suchen Sie nach Unternehmen, Technologien oder Ergebnissen..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filter ({filters.industries.length + filters.serviceTypes.length})
            </button>
            
            <div className="text-sm text-gray-600">
              {filteredCaseStudies.length} von {caseStudies.length} Projekten
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Industry Filter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Branchen</h4>
                  <div className="space-y-2">
                    {industries.map(industry => (
                      <label key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.industries.includes(industry)}
                          onChange={() => toggleFilter('industries', industry)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Type Filter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Service-Art</h4>
                  <div className="space-y-2">
                    {serviceTypes.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.serviceTypes.includes(type)}
                          onChange={() => toggleFilter('serviceTypes', type)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{serviceTypeLabels[type]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ROI Range */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">ROI-Bereich</h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="50"
                      value={filters.roiRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        roiRange: [prev.roiRange[0], parseInt(e.target.value)]
                      }))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                      Bis {filters.roiRange[1]}% ROI
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({
                    industries: [],
                    serviceTypes: [],
                    roiRange: [0, 500],
                    searchQuery: ''
                  })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Filter zurücksetzen
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredStudies.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">Ausgewählte Erfolgsgeschichten</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Unsere erfolgreichsten KI-Projekte mit außergewöhnlichen Ergebnissen
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStudies.slice(0, 2).map((study) => (
                <div key={study.id} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getServiceTypeColor(study.project.serviceType)}`}>
                          {serviceTypeLabels[study.project.serviceType]}
                        </span>
                        <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                          {study.client.industry}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">{study.title}</h3>
                      <p className="text-gray-600 mb-4">{study.summary}</p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-green-600">{study.results.roi}%</div>
                      <div className="text-sm text-green-800">ROI</div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center bg-blue-50 rounded-lg p-3">
                      <div className="font-bold text-blue-600">{formatCurrency(study.results.costSavings)}</div>
                      <div className="text-xs text-blue-800">Einsparungen</div>
                    </div>
                    <div className="text-center bg-orange-50 rounded-lg p-3">
                      <div className="font-bold text-orange-600">{study.results.timeReduction}%</div>
                      <div className="text-xs text-orange-800">Zeitersparnis</div>
                    </div>
                    <div className="text-center bg-purple-50 rounded-lg p-3">
                      <div className="font-bold text-purple-600">{study.project.duration}</div>
                      <div className="text-xs text-purple-800">Projektdauer</div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex mb-2">
                      {[...Array(study.testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic text-sm mb-3">"{study.testimonial.quote}"</p>
                    <div className="text-sm font-medium text-gray-900">
                      {study.testimonial.author}
                    </div>
                    <div className="text-xs text-gray-600">
                      {study.testimonial.role}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedStudy(selectedStudy === study.id ? null : study.id)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {selectedStudy === study.id ? 'Details ausblenden' : 'Details anzeigen'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>

                  {/* Expandable Details */}
                  {selectedStudy === study.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Herausforderung:</h4>
                        <p className="text-gray-700 text-sm">{study.project.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Lösung:</h4>
                        <p className="text-gray-700 text-sm mb-3">{study.project.solution}</p>
                        <ul className="space-y-1">
                          {study.project.implementation.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Zusätzliche Erfolgsmetriken:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.entries(study.results.additionalMetrics).map(([key, value]) => (
                            <div key={key} className="bg-green-50 rounded-lg p-3 text-center">
                              <div className="font-bold text-green-600 text-sm">{value}</div>
                              <div className="text-xs text-green-800">{key}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Case Studies Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">Alle Erfolgsgeschichten</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Entdecken Sie alle unsere KI-Projekte mit detaillierten Ergebnissen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.map((study) => (
              <div key={study.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getServiceTypeColor(study.project.serviceType)}`}>
                    {serviceTypeLabels[study.project.serviceType]}
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{study.results.roi}%</div>
                    <div className="text-xs text-green-800">ROI</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">{study.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{study.client.company} • {study.client.industry}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="font-semibold text-blue-600 text-sm">{formatCurrency(study.results.costSavings)}</div>
                    <div className="text-xs text-blue-800">Einsparungen</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <div className="font-semibold text-orange-600 text-sm">{study.results.timeReduction}%</div>
                    <div className="text-xs text-orange-800">Zeitersparnis</div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(study.testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-xs text-gray-600">{study.testimonial.author}</span>
                </div>

                <button
                  onClick={() => setSelectedStudy(selectedStudy === study.id ? null : study.id)}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 text-sm"
                >
                  {selectedStudy === study.id ? 'Weniger anzeigen' : 'Mehr Details'}
                </button>
              </div>
            ))}
          </div>

          {filteredCaseStudies.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">Keine Case Studies gefunden, die Ihren Filterkriterien entsprechen.</div>
              <button
                onClick={() => setFilters({
                  industries: [],
                  serviceTypes: [],
                  roiRange: [0, 500],
                  searchQuery: ''
                })}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white mb-8">
            <h2 className="text-4xl font-bold mb-4 font-poppins">Bereit für Ihre Erfolgsgeschichte?</h2>
            <p className="text-xl opacity-90">
              Lassen Sie uns gemeinsam ein KI-Projekt mit messbarem ROI für Ihr Unternehmen entwickeln.
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
              href="/services"
              className="group inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 border-2 border-white"
            >
              Services entdecken
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="mt-8 text-white/80 text-sm">
            <p>✅ Unverbindlich • ✅ 30 Minuten • ✅ Sofortige Insights</p>
          </div>
        </div>
      </section>
    </div>
  );
}
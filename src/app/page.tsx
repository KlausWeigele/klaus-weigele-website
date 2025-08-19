"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import CountUpNumber from "../components/CountUpNumber";
import InteractiveHeroVisual from "../components/InteractiveHeroVisual";
import RoleToggle from "../components/RoleToggle";
import { ArrowRight, CheckCircle, Brain, Rocket, Building2, Phone, Mail, Calendar, Linkedin, Star, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden mesh-gradient space-hero-section">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-xl opacity-60 animate-subtle-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-400/10 rounded-full filter blur-xl opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-blue-500/5 to-transparent rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg hover-micro-lift">
                  🎓 Diplom-Ingenieur Technische Informatik
                </span>
              </div>
              
              {/* Optimized Headline */}
              <h1 className="text-5xl lg:text-6xl text-luxury-heading mb-8 leading-tight">
                KI-Projekte, die liefern –{' '}
                <span className="text-elegant-accent">
                  nicht nur Demos
                </span>
              </h1>
              
              <p className="text-xl text-premium-body mb-12 max-w-2xl leading-relaxed">
                Strategie, Prototyping, Integration. Made in Germany. Nachweisbar wirksam.
              </p>
              
              {/* Social Proof - Immediate Results Strip */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 rounded-xl p-4 text-center hover-micro-lift">
                  <div className="text-2xl font-bold text-green-600">
                    <CountUpNumber target={330} suffix="%" />
                  </div>
                  <div className="text-xs text-green-700">Ø ROI</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center hover-micro-lift">
                  <div className="text-2xl font-bold text-green-600">
                    <CountUpNumber target={6} suffix=",68M €" prefix="" />
                  </div>
                  <div className="text-xs text-green-700">Einsparungen</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center hover-micro-lift">
                  <div className="text-2xl font-bold text-green-600">
                    <CountUpNumber target={95} suffix="%" />
                  </div>
                  <div className="text-xs text-green-700">Zufriedenheit</div>
                </div>
              </div>
              
              {/* Role-based Features */}
              <div className="mb-8">
                <RoleToggle />
              </div>
              
              {/* Premium CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link 
                  href="/contact"
                  className="relative group inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:bg-blue-700 transition-all duration-300 cta-sweep overflow-hidden"
                >
                  <span className="relative z-10">Kostenlos 30 Min. KI-Strategie</span>
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
                </Link>
                
                <Link 
                  href="/resources#roi-calculator"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover-micro-lift"
                >
                  ROI in 2 Min. abschätzen
                </Link>
              </div>
              
              {/* Risk Reversal */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600">
                  ✅ 30 Min. • ✅ Unverbindlich • ✅ DSGVO-konform
                </p>
              </div>
              
              {/* Availability Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
                🔥 3 Slots diese Woche
              </div>
              
              {/* Logo Wall - Social Proof */}
              <div className="mt-12">
                <p className="text-sm text-gray-500 text-center mb-6">Vertrauen von:</p>
                <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                  <div className="text-gray-400 font-semibold text-sm">Muster AG</div>
                  <div className="text-gray-400 font-semibold text-sm">MedTech GmbH</div>
                  <div className="text-gray-400 font-semibold text-sm">Logistik GmbH</div>
                  <div className="text-gray-400 font-semibold text-sm">Analytics GmbH</div>
                  <div className="text-gray-400 font-semibold text-sm">Production AG</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Interactive Visual */}
            <div className="relative flex justify-center lg:justify-end">
              <InteractiveHeroVisual />
              
              {/* Mini Case Study Teaser */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:left-0">
                <Link 
                  href="/case-studies"
                  className="bg-white rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover-micro-lift border border-gray-100 max-w-xs"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">Muster AG</div>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">450% ROI in 9 Monaten</div>
                  <div className="text-xs text-blue-600 font-medium">→ Case Study lesen</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Building Section */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
              🏆 Vertrauen durch Ergebnisse
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              Warum Unternehmen auf{' '}
              <span className="bg-blue-600 bg-clip-text text-transparent">
                Max Mustermann
              </span>{' '}
              vertrauen
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Messbare Erfolge, bewährte Expertise, nachweisbare ROI-Steigerungen
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">10+</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">Jahre</div>
              <div className="text-gray-600">Technische Informatik</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">300%</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">ROI</div>
              <div className="text-gray-600">Durchschnittlich in 12 Monaten</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">€500K</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">Projekte</div>
              <div className="text-gray-600">Bis zu €500K Volumen</div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">100%</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">DSGVO</div>
              <div className="text-gray-600">Konform & Made in Germany</div>
            </div>
          </div>
          
          {/* Detailed Trust Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">Diplom-Ingenieur mit KI-Spezialisierung</h3>
                  <p className="text-gray-600">Fundierte technische Ausbildung kombiniert mit jahrelanger praktischer Erfahrung in Artificial Intelligence und Machine Learning.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">Enterprise-Projekte erfolgreich umgesetzt</h3>
                  <p className="text-gray-600">Von €10K Proof-of-Concepts bis hin zu €500K Enterprise-Lösungen - bewährte Expertise in allen Projektgrößen.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">Von Proof-of-Concept bis Production</h3>
                  <p className="text-gray-600">Kompletter Entwicklungszyklus: Ideenfindung, Prototyping, Testing, Integration und Produktionsdeployment.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">Nachweisbare ROI-Erfolge</h3>
                  <p className="text-gray-600">Durchschnittlich 300% Return on Investment in den ersten 12 Monaten durch optimierte KI-Implementierungen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
              🚀 Premium Enterprise Services
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              Ihr Partner für Enterprise-KI, die{' '}
              <span className="text-green-600">
                ROI generiert
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Von der ersten Idee bis zur skalierbaren Lösung - Ihr Erfolg ist unser Maßstab
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service 1: KI-Strategieberatung */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">KI-Strategieberatung</h3>
                <p className="text-gray-600 mb-8 text-lg">Vom KI-Hype zur messbaren Wertschöpfung</p>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                      <span className="text-red-500 mr-2">⚠️</span>
                      Ihre Herausforderung:
                    </h4>
                    <p className="text-red-700 italic">"Wir wissen, dass KI uns helfen könnte, aber wo fangen wir an?"</p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <span className="text-green-500 mr-2">✨</span>
                      Meine Lösung:
                    </h4>
                    <ul className="text-green-700 space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        KI-Readiness Assessment Ihres Unternehmens
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Identifikation der Top-3 KI-Use-Cases mit höchstem ROI
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Roadmap von Quick-Wins bis zur strategischen KI-Transformation
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Business Case mit konkreten Zahlen für Ihr Management
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Typischer ROI</div>
                      <div className="text-2xl font-bold text-green-600">200-500%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Investition</div>
                      <div className="text-2xl font-bold text-gray-900">€15K - €50K</div>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/services#strategy"
                  className="group/btn w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Mehr zur KI-Strategie
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Service 2: ML-Prototyping */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">ML-Prototyping & Proof-of-Concept</h3>
                <p className="text-gray-600 mb-8 text-lg">Von der Idee zum funktionierenden KI-System</p>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">🤔</span>
                      Ihre Herausforderung:
                    </h4>
                    <p className="text-orange-700 italic">"Wir haben eine KI-Idee, aber funktioniert das überhaupt?"</p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <span className="text-green-500 mr-2">🚀</span>
                      Meine Lösung:
                    </h4>
                    <ul className="text-green-700 space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Rapid Prototyping mit Ihren echten Daten (DSGVO-konform)
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Technische Machbarkeitsprüfung in 4-6 Wochen
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Interactive Demo für Ihr Management und Key-Stakeholder
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Produktionsreife Architektur und Implementierungsplan
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Erfolgsrate</div>
                      <div className="text-2xl font-bold text-green-600">90%+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Investition</div>
                      <div className="text-2xl font-bold text-gray-900">€8K - €25K</div>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/services#prototyping"
                  className="group/btn w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Mehr zum Prototyping
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Service 3: Enterprise-KI-Integration */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Enterprise-KI-Integration</h3>
                <p className="text-gray-600 mb-8 text-lg">Skalierbare KI-Lösungen für Ihr Unternehmen</p>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <span className="text-purple-500 mr-2">🏢</span>
                      Ihre Herausforderung:
                    </h4>
                    <p className="text-purple-700 italic">"Der Prototyp funktioniert, aber wie wird daraus ein Enterprise-System?"</p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <span className="text-blue-500 mr-2">⚙️</span>
                      Meine Lösung:
                    </h4>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        End-to-End Implementation von der Architektur bis zum Go-Live
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        Integration in Ihre bestehende IT-Infrastruktur
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        Mitarbeiter-Training und Change Management
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        Monitoring, Wartung und kontinuierliche Optimierung
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Automatisierung</div>
                      <div className="text-2xl font-bold text-green-600">40-70%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Investition</div>
                      <div className="text-2xl font-bold text-gray-900">€25K - €200K+</div>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/services#enterprise"
                  className="group/btn w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Mehr zur Enterprise-Integration
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>

          {/* Services CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
                Welcher Service ist der richtige für Ihr Unternehmen?
              </h3>
              <p className="text-gray-600 mb-8">
                Nutzen Sie unseren interaktiven Service-Vergleich und ROI-Rechner 
                für eine fundierte Entscheidung
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/services"
                  className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-2 focus:outline-blue-100 font-semibold transition-all duration-200"
                >
                  Services vergleichen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link 
                  href="/resources#roi-calculator"
                  className="inline-flex items-center rounded-md border border-blue-200 px-6 py-3 text-blue-700 hover:border-blue-300 focus:outline-2 focus:outline-blue-100 font-semibold transition-all duration-200"
                >
                  ROI berechnen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
              ⭐ Kundenstimmen
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 font-poppins">
              Was unsere{' '}
              <span className="bg-blue-600 bg-clip-text text-transparent">
                Kunden sagen
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Echte Erfahrungen von Unternehmen, die mit KI ihren Erfolg transformiert haben
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">MH</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Hoffmann</div>
                  <div className="text-sm text-gray-600">CTO, Muster AG</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Max hat unsere Datenanalyse revolutioniert. Statt Wochen brauchen wir jetzt Stunden für komplexe Auswertungen. ROI von 450% im ersten Jahr!"
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div className="text-green-800 font-semibold">Ergebnis:</div>
                <div className="text-green-700">€2.1M Kosteneinsparung durch KI-Automatisierung</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Müller</div>
                  <div className="text-sm text-gray-600">Head of Operations, Logistik GmbH</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Dank Max' KI-Lösung optimieren wir unsere Lieferketten automatisch. 35% weniger Lagerkosten und perfekte Lieferzeiten."
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="text-blue-800 font-semibold">Ergebnis:</div>
                <div className="text-blue-700">35% Kostensenkung + 99.2% Liefertreue</div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">DR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Dr. Robert Fischer</div>
                  <div className="text-sm text-gray-600">Geschäftsführer, MedTech GmbH</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Professionell, strukturiert, ergebnisorientiert. Max hat unser medizinisches KI-System DSGVO-konform umgesetzt. Beeindruckend!"
              </p>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                <div className="text-purple-800 font-semibold">Ergebnis:</div>
                <div className="text-purple-700">60% schnellere Diagnosen, 100% DSGVO-konform</div>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-20 text-center">
            <p className="text-gray-300 mb-8">Vertrauen von Unternehmen aus verschiedenen Branchen:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-semibold">Muster AG</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-semibold">Logistik GmbH</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-semibold">MedTech GmbH</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-semibold">Analytics GmbH</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-semibold">Production AG</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6">
              🎁 Kostenlose KI-Ressourcen
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              Bereiten Sie Ihr Unternehmen auf{' '}
              <span className="text-green-600">
                KI vor
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Kostenlose Tools und Guides für Ihre KI-Transformation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* AI Readiness Assessment */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-poppins">KI-Readiness Check</h3>
                  <p className="text-gray-600">Kostenlose Bewertung in 5 Minuten</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Bewertung Ihrer KI-Bereitschaft</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Top-3 Use-Cases für Ihr Unternehmen</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Konkrete Handlungsempfehlungen</span>
                </div>
              </div>

              <Link 
                href="/resources#readiness-assessment"
                className="group w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Jetzt Assessment starten
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* ROI Calculator */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">€</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-poppins">ROI-Rechner</h3>
                  <p className="text-gray-600">Berechnen Sie Ihr KI-Potential</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">Kosteneinsparungen projizieren</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">Break-Even-Point berechnen</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">Business Case für Ihr Management</span>
                </div>
              </div>

              <Link 
                href="/resources#roi-calculator"
                className="group w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ROI berechnen
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/resources"
              className="group inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Alle kostenlosen Ressourcen entdecken
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg mb-6 animate-pulse">
              🔥 Nur 3 Plätze im Dezember verfügbar
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 font-poppins">
              Bereit für Ihr{' '}
              <span className="bg-blue-600 bg-clip-text text-transparent">
                KI-Projekt?
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Starten Sie mit einem kostenlosen KI-Strategiegespräch und erhalten Sie sofort verwertbare Insights für Ihr Business
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Lead Magnet */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">🎁</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">
                  KOSTENLOSER KI-Readiness Check
                </h3>
                <p className="text-gray-600 text-lg">
                  Erhalten Sie eine professionelle Bewertung Ihres KI-Potentials inkl. konkreter Handlungsempfehlungen
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">✅ <strong>15-minütige KI-Analyse</strong> Ihres Unternehmens</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">💰 <strong>ROI-Potential Bewertung</strong> für Top-3 Use-Cases</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">🎯 <strong>Konkrete Roadmap</strong> für Ihre KI-Transformation</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">📊 <strong>Executive Summary</strong> für Ihr Management</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">€2.500 Wert</div>
                  <div className="text-green-600 font-medium mb-2">Heute kostenlos für Sie</div>
                  <div className="text-sm text-green-600">Nur bei Buchung eines Strategiegesprächs</div>
                </div>
              </div>

              <Link 
                href="https://calendly.com/max-mustermann"
                className="w-full bg-white text-blue-600 py-5 px-8 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105 group border-2 border-blue-600"
              >
                <Calendar className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                JETZT KI-Readiness Check sichern
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Contact Options */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 font-poppins">
                  In einem 30-minütigen Strategiegespräch klären wir:
                </h3>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <span>Wo steht Ihr Unternehmen bei der KI-Nutzung?</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <span>Welche Use-Cases haben das höchste ROI-Potential?</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <span>Was ist der nächste konkrete Schritt für Ihr KI-Projekt?</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <span>Wie können wir optimal zusammenarbeiten?</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold text-lg mb-2">100% Kostenlos & Unverbindlich</div>
                    <div className="text-blue-100">Sie erhalten sofort verwertbare Insights für Ihr Business</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <a 
                    href="mailto:max@maxmustermann.de"
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center border border-white/30"
                  >
                    <Mail className="mr-3 w-5 h-5" />
                    E-Mail: max@maxmustermann.de
                  </a>
                  
                  <a 
                    href="https://linkedin.com/in/maxmustermann"
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center border border-white/30"
                  >
                    <Linkedin className="mr-3 w-5 h-5" />
                    LinkedIn: /in/maxmustermann
                  </a>
                </div>
              </div>

              {/* Trust & Urgency */}
              <div className="bg-yellow-400 rounded-2xl p-6 text-center">
                <div className="text-gray-900 font-bold text-lg mb-2">⚡ Begrenzte Verfügbarkeit</div>
                <div className="text-gray-800">Nur 3 neue Projekte pro Quartal für optimale Qualität</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-blue-100 text-sm max-w-4xl mx-auto">
              🛡️ Alle Gespräche und Projektinhalte unterliegen strenger Vertraulichkeit. 
              DSGVO-konform und Made in Germany. Über 50 erfolgreiche KI-Projekte umgesetzt.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">KW</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold font-poppins">Max Mustermann</h3>
                  <p className="text-gray-400">Premium KI-Consultant</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Diplom-Ingenieur Technische Informatik<br />
                Spezialist für Enterprise-KI-Projekte mit nachweisbarem ROI
              </p>
              <div className="flex space-x-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Deutsche Expertise
                </div>
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  DSGVO-konform
                </div>
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  300% ROI
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 font-poppins">Premium Services</h4>
              <ul className="space-y-3">
                <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                  💡 KI-Strategieberatung
                </li>
                <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                  🚀 ML-Prototyping
                </li>
                <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                  🏢 Enterprise-Integration
                </li>
                <li className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                  📊 KI-Readiness Assessment
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 font-poppins">Kontakt & Social</h4>
              <div className="space-y-4">
                <a 
                  href="mailto:max@maxmustermann.de"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <Mail className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  max@maxmustermann.de
                </a>
                <a 
                  href="https://linkedin.com/in/maxmustermann"
                  className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <Linkedin className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  LinkedIn
                </a>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-3" />
                  Mo-Fr 9:00-18:00
                </div>
              </div>
              <div className="mt-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-white font-semibold mb-1">Verfügbarkeit</div>
                <div className="text-green-400 text-sm">✅ 3 Plätze frei</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 mb-4 md:mb-0">
                &copy; 2025 Max Mustermann. Alle Rechte vorbehalten.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#impressum" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Impressum
                </a>
                <a href="#datenschutz" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Datenschutz
                </a>
                <a href="#agb" className="text-gray-400 hover:text-white transition-colors duration-200">
                  AGB
                </a>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                🇩🇪 Proudly Made in Germany • 🛡️ 100% DSGVO-konform • 🏆 Über 50 erfolgreiche KI-Projekte
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
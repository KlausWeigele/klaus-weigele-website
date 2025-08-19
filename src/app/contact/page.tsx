"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail, Calendar, MessageSquare, CheckCircle, Clock, Euro, Users, Shield, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactForm {
  name: string;
  email: string;
  company: string;
  companySize: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface ConsultationBooking {
  type: 'strategy' | 'technical' | 'implementation';
  duration: string;
  preparation: string[];
  outcomes: string[];
}

const consultationTypes: Record<string, ConsultationBooking> = {
  strategy: {
    type: 'strategy',
    duration: '45 Minuten',
    preparation: [
      'Aktuelle Herausforderungen dokumentieren',
      'Geschäftsziele definieren',
      'Verfügbares Budget grob einschätzen',
      'Key-Stakeholder identifizieren'
    ],
    outcomes: [
      'KI-Potentialanalyse für Ihr Unternehmen',
      'Priorisierte Use-Case Empfehlungen',
      'Grobe ROI-Schätzung',
      'Nächste Schritte Roadmap'
    ]
  },
  technical: {
    type: 'technical',
    duration: '60 Minuten',
    preparation: [
      'Aktuelle IT-Infrastruktur dokumentieren',
      'Verfügbare Datenquellen auflisten',
      'Technische Anforderungen sammeln',
      'Compliance-Anforderungen definieren'
    ],
    outcomes: [
      'Technische Machbarkeitsanalyse',
      'Architektur-Empfehlungen',
      'Integrationsstrategie',
      'Prototyping-Plan'
    ]
  },
  implementation: {
    type: 'implementation',
    duration: '45 Minuten',
    preparation: [
      'Projektumfang definieren',
      'Team-Ressourcen bewerten',
      'Zeitrahmen festlegen',
      'Change Management Überlegungen'
    ],
    outcomes: [
      'Detaillierter Projektplan',
      'Resource-Allocation Strategie',
      'Risiko-Assessment',
      'Go-Live Strategie'
    ]
  }
};

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'consultation' | 'contact' | 'quick'>('consultation');
  const [selectedConsultation, setSelectedConsultation] = useState<string>('strategy');
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    companySize: '100-500',
    projectType: 'strategy',
    budget: '25000-50000',
    timeline: '3-6-months',
    message: '',
    priority: 'medium'
  });
  const [submitted, setSubmitted] = useState(false);
  
  // Check for URL parameters to pre-select form fields
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const service = urlParams.get('service');
      const path = urlParams.get('path');
      
      if (service) {
        setContactForm(prev => ({ ...prev, projectType: service }));
        setSelectedConsultation(service);
      }
      
      if (path) {
        if (path === 'strategic') {
          setActiveTab('consultation');
          setSelectedConsultation('strategy');
        } else if (path === 'technical') {
          setActiveTab('consultation');
          setSelectedConsultation('technical');
        }
      }
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be actual form submission logic
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'strategy': return 'bg-green-100 text-green-800 border-green-300';
      case 'prototyping': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'enterprise': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'technical': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'implementation': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityInfo = (form: ContactForm) => {
    if (form.timeline === 'asap' || form.budget === '200000+') return 'urgent';
    if (form.projectType === 'enterprise' || form.companySize === '1000+') return 'high';
    if (form.timeline === '1-3-months') return 'high';
    return 'medium';
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
              🚀 Ihr Weg zum KI-Erfolg beginnt hier
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-poppins">
              Lassen Sie uns über Ihr{' '}
              <span className="text-blue-600">
                KI-Projekt
              </span>{' '}sprechen
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
              Kostenlose Beratung, maßgeschneiderte Lösungen, messbare Ergebnisse
            </p>
            
            {/* Quick Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setActiveTab('consultation')}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50"
              >
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Strategieberatung</h3>
                <p className="text-gray-600 text-sm mb-4">45 Min. Beratung, unverbindlich</p>
                <div className="text-green-600 font-semibold flex items-center justify-center">
                  Termin buchen <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('contact')}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Projektanfrage</h3>
                <p className="text-gray-600 text-sm mb-4">Detaillierte Anfrage, 24h Antwort</p>
                <div className="text-blue-600 font-semibold flex items-center justify-center">
                  Anfrage senden <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('quick')}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sofortkontakt</h3>
                <p className="text-gray-600 text-sm mb-4">Direkt anrufen oder E-Mail</p>
                <div className="text-gray-600 font-semibold flex items-center justify-center">
                  Jetzt kontaktieren <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
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
                { id: 'consultation', label: 'Beratungstermin', icon: Calendar },
                { id: 'contact', label: 'Projektanfrage', icon: MessageSquare },
                { id: 'quick', label: 'Direktkontakt', icon: Phone }
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

      {/* Consultation Booking Tab */}
      {activeTab === 'consultation' && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">Kostenlose Strategieberatung</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Wählen Sie die Art der Beratung, die am besten zu Ihren aktuellen Bedürfnissen passt
              </p>
            </div>

            {/* Consultation Type Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {Object.entries(consultationTypes).map(([key, consultation]) => (
                <div
                  key={key}
                  className={`bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                    selectedConsultation === key
                      ? 'ring-2 ring-blue-600 shadow-2xl transform scale-105'
                      : 'shadow-lg hover:shadow-xl hover:-translate-y-1'
                  }`}
                  onClick={() => setSelectedConsultation(key)}
                >
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                      key === 'strategy' ? 'bg-green-600' :
                      key === 'technical' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {key === 'strategy' && <Calendar className="w-8 h-8 text-white" />}
                      {key === 'technical' && <MessageSquare className="w-8 h-8 text-white" />}
                      {key === 'implementation' && <CheckCircle className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                      {key === 'strategy' ? 'KI-Strategieberatung' :
                       key === 'technical' ? 'Technische Beratung' : 'Implementierungs-Beratung'}
                    </h3>
                    <div className="text-blue-600 font-semibold mb-4">{consultation.duration}</div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Vorbereitung:</h4>
                      <ul className="space-y-2">
                        {consultation.preparation.slice(0, 2).map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                        {consultation.preparation.length > 2 && (
                          <li className="text-gray-500 text-sm">
                            +{consultation.preparation.length - 2} weitere Punkte
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Sie erhalten:</h4>
                      <ul className="space-y-2">
                        {consultation.outcomes.slice(0, 2).map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <ArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{outcome}</span>
                          </li>
                        ))}
                        {consultation.outcomes.length > 2 && (
                          <li className="text-gray-500 text-sm">
                            +{consultation.outcomes.length - 2} weitere Ergebnisse
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Consultation Details */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-poppins">
                {selectedConsultation === 'strategy' ? 'KI-Strategieberatung' :
                 selectedConsultation === 'technical' ? 'Technische Beratung' : 'Implementierungs-Beratung'} buchen
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Consultation Details */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Was Sie erwartet
                    </h4>
                    <ul className="space-y-2">
                      {consultationTypes[selectedConsultation].outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-800 text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6">
                    <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Optimal vorbereiten
                    </h4>
                    <ul className="space-y-2">
                      {consultationTypes[selectedConsultation].preparation.map((prep, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowRight className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800 text-sm">{prep}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Booking Form Placeholder */}
                <div className="bg-gray-50 rounded-xl p-8">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Termin vereinbaren</h4>
                    <p className="text-gray-600 mb-6">
                      Wählen Sie einen für Sie passenden Termin aus meinem Kalender
                    </p>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Nächster verfügbarer Termin:</div>
                        <div className="font-semibold text-gray-900">Morgen, 14:00 - 15:00 Uhr</div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                        Kalendar öffnen & Termin buchen
                        <Calendar className="ml-2 w-4 h-4 inline" />
                      </button>
                      <p className="text-xs text-gray-500">
                        Nach der Buchung erhalten Sie eine Bestätigung mit Vorbereitung-Checkliste
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Inquiry Tab */}
      {activeTab === 'contact' && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Projektanfrage</h2>
                <p className="text-gray-600">
                  Erzählen Sie mir von Ihrem Projekt - Sie erhalten innerhalb von 24h eine detaillierte Antwort
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Vielen Dank für Ihre Anfrage!</h3>
                  <p className="text-gray-600 mb-6">
                    Sie erhalten innerhalb der nächsten 24 Stunden eine detaillierte Antwort von mir.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-blue-800 text-sm">
                      <strong>Nächste Schritte:</strong> Ich analysiere Ihre Anfrage und melde mich mit einer 
                      ersten Einschätzung und konkreten nächsten Schritten bei Ihnen.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ihr vollständiger Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ihre.email@unternehmen.de"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unternehmen</label>
                      <input
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ihr Unternehmen"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unternehmensgröße</label>
                      <select
                        value={contactForm.companySize}
                        onChange={(e) => setContactForm(prev => ({ ...prev, companySize: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="10-50">10-50 Mitarbeiter</option>
                        <option value="50-200">50-200 Mitarbeiter</option>
                        <option value="200-1000">200-1000 Mitarbeiter</option>
                        <option value="1000+">1000+ Mitarbeiter</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Projekttyp</label>
                      <select
                        value={contactForm.projectType}
                        onChange={(e) => setContactForm(prev => ({ ...prev, projectType: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="strategy">KI-Strategieberatung</option>
                        <option value="prototyping">ML-Prototyping</option>
                        <option value="enterprise">Enterprise-Integration</option>
                        <option value="technical">Technische Beratung</option>
                        <option value="implementation">Implementierung</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget-Rahmen</label>
                      <select
                        value={contactForm.budget}
                        onChange={(e) => setContactForm(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="15000-25000">€15.000 - €25.000</option>
                        <option value="25000-50000">€25.000 - €50.000</option>
                        <option value="50000-100000">€50.000 - €100.000</option>
                        <option value="100000-200000">€100.000 - €200.000</option>
                        <option value="200000+">€200.000+</option>
                        <option value="unknown">Noch unklar</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gewünschter Zeitrahmen</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'asap', label: 'ASAP', urgent: true },
                        { value: '1-3-months', label: '1-3 Monate', urgent: false },
                        { value: '3-6-months', label: '3-6 Monate', urgent: false },
                        { value: '6+ months', label: '6+ Monate', urgent: false }
                      ].map(({ value, label, urgent }) => (
                        <label key={value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="timeline"
                            value={value}
                            checked={contactForm.timeline === value}
                            onChange={(e) => setContactForm(prev => ({ ...prev, timeline: e.target.value }))}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
                          />
                          <span className={`text-sm ${urgent ? 'font-semibold text-red-600' : 'text-gray-700'}`}>
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projektbeschreibung *</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                      placeholder="Beschreiben Sie Ihr Projekt, Ihre Herausforderungen und Ziele so detailliert wie möglich..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Je detaillierter Ihre Beschreibung, desto gezielter kann ich Ihnen helfen.
                    </p>
                  </div>

                  {/* Project Priority Indicator */}
                  <div className={`rounded-lg p-4 border ${
                    getPriorityInfo(contactForm) === 'urgent' ? 'bg-red-50 border-red-200' :
                    getPriorityInfo(contactForm) === 'high' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        getPriorityInfo(contactForm) === 'urgent' ? 'bg-red-500' :
                        getPriorityInfo(contactForm) === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      <span className={`font-medium ${
                        getPriorityInfo(contactForm) === 'urgent' ? 'text-red-800' :
                        getPriorityInfo(contactForm) === 'high' ? 'text-orange-800' : 'text-blue-800'
                      }`}>
                        {getPriorityInfo(contactForm) === 'urgent' ? 'Express-Bearbeitung' :
                         getPriorityInfo(contactForm) === 'high' ? 'Hohe Priorität' : 'Standard-Bearbeitung'}
                      </span>
                      <span className={`ml-2 text-sm ${
                        getPriorityInfo(contactForm) === 'urgent' ? 'text-red-600' :
                        getPriorityInfo(contactForm) === 'high' ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {getPriorityInfo(contactForm) === 'urgent' ? '• Antwort innerhalb 4h' :
                         getPriorityInfo(contactForm) === 'high' ? '• Antwort innerhalb 12h' : '• Antwort innerhalb 24h'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      getPriorityInfo(contactForm) === 'urgent' ? 'bg-red-600 hover:bg-red-700' :
                      getPriorityInfo(contactForm) === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
                      'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {getPriorityInfo(contactForm) === 'urgent' ? 'Express-Anfrage senden' :
                     getPriorityInfo(contactForm) === 'high' ? 'Prioritäts-Anfrage senden' :
                     'Projektanfrage senden'}
                    <ArrowRight className="ml-2 w-5 h-5 inline" />
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      <Shield className="w-4 h-4 inline mr-1" />
                      DSGVO-konform • Ihre Daten werden vertraulich behandelt
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Direct Contact Tab */}
      {activeTab === 'quick' && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">Direkter Kontakt</h2>
              <p className="text-xl text-gray-700">
                Manchmal ist ein direktes Gespräch der schnellste Weg zur Lösung
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Phone Contact */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Anrufen</h3>
                  <p className="text-gray-600 mb-6">
                    Direktes Gespräch für dringende Fragen oder komplexe Projekte
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600 mb-2">+49 (0) 123 456 789</div>
                      <div className="text-sm text-green-800">Montag - Freitag, 9:00 - 18:00 Uhr</div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p className="mb-2"><strong>Beste Anrufzeiten:</strong></p>
                      <ul className="space-y-1">
                        <li>• Morgens: 9:00 - 11:00 Uhr</li>
                        <li>• Nachmittags: 14:00 - 16:00 Uhr</li>
                        <li>• Express-Beratung nach Vereinbarung</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Jetzt anrufen
                    <Phone className="ml-2 w-4 h-4 inline" />
                  </button>
                </div>
              </div>

              {/* Email Contact */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">E-Mail schreiben</h3>
                  <p className="text-gray-600 mb-6">
                    Detaillierte Anfragen mit Dokumenten und Hintergrundinformationen
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-lg font-bold text-blue-600 mb-2">max@mustermann-ai.de</div>
                      <div className="text-sm text-blue-800">Antwort innerhalb von 24h garantiert</div>
                    </div>
                    
                    <div className="text-sm text-gray-600 text-left">
                      <p className="mb-2"><strong>Optimal für:</strong></p>
                      <ul className="space-y-1">
                        <li>• Detaillierte Projektbeschreibungen</li>
                        <li>• Dokumenten-Austausch</li>
                        <li>• Technische Spezifikationen</li>
                        <li>• Ausführliche Anfragen</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => window.location.href = 'mailto:max@mustermann-ai.de?subject=KI-Projekt Anfrage&body=Hallo Max,%0A%0Aich interessiere mich für...'}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    E-Mail öffnen
                    <Mail className="ml-2 w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            </div>

            {/* Office Information */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Persönlicher Termin</h3>
                <p className="text-gray-600">
                  Für besonders komplexe Projekte oder strategische Workshops
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Büro Musterstadt</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Maximilianstraße 123<br />
                    12345 Musterstadt<br />
                    Deutschland
                  </p>
                  <p className="text-sm text-gray-500">
                    S-Bahn: Marienplatz (5 Min. Fußweg)
                  </p>
                </div>
                
                <div className="text-center">
                  <Users className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Vor-Ort Termine</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Strategische Workshops<br />
                    Team-Schulungen<br />
                    Executive-Präsentationen
                  </p>
                  <p className="text-sm text-gray-500">
                    Deutschland & DACH-Region
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={() => setActiveTab('consultation')}
                  className="bg-gray-600 text-white py-3 px-8 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Persönlichen Termin vereinbaren
                  <Calendar className="ml-2 w-4 h-4 inline" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Security Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Warum Sie mir vertrauen können</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">DSGVO-konform</div>
              <div className="text-xs text-gray-600">Vollständige Compliance</div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">24h Antwort</div>
              <div className="text-xs text-gray-600">Garantierte Reaktionszeit</div>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">Unverbindlich</div>
              <div className="text-xs text-gray-600">Kostenlose Erstberatung</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">100+ Projekte</div>
              <div className="text-xs text-gray-600">Bewährte Expertise</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
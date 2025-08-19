"use client";

import { useState } from "react";
import { Building2, Users, TrendingUp, CheckCircle } from "lucide-react";

type Role = 'ceo' | 'cto' | 'pm';

interface RoleContent {
  title: string;
  icon: React.ReactNode;
  bullets: string[];
}

const roleContent: Record<Role, RoleContent> = {
  ceo: {
    title: "Für CEOs & Geschäftsführer",
    icon: <TrendingUp className="w-5 h-5" />,
    bullets: [
      "ROI-fokussierte KI-Strategie mit messbaren Ergebnissen",
      "Business Case Development für nachhaltiges Wachstum", 
      "Competitive Advantage durch strategische KI-Implementierung"
    ]
  },
  cto: {
    title: "Für CTOs & Tech-Leads",
    icon: <Building2 className="w-5 h-5" />,
    bullets: [
      "Technische Machbarkeitsanalyse und Architektur-Design",
      "DSGVO-konforme Integration in bestehende IT-Landschaft",
      "Skalierbare ML-Pipelines für Produktionsumgebungen"
    ]
  },
  pm: {
    title: "Für Projekt- & Produktmanager",
    icon: <Users className="w-5 h-5" />,
    bullets: [
      "Strukturierte Umsetzung mit klaren Meilensteinen",
      "Change Management und Team-Integration",
      "Risikominimierung durch bewährte Implementierungsprozesse"
    ]
  }
};

export default function RoleToggle() {
  const [activeRole, setActiveRole] = useState<Role>('ceo');

  return (
    <div className="space-y-6">
      {/* Role Toggle Buttons */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(roleContent).map(([role, content]) => (
          <button
            key={role}
            onClick={() => setActiveRole(role as Role)}
            className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              activeRole === role
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {content.icon}
            <span className="ml-2 text-sm">
              {role === 'ceo' ? 'CEO' : role === 'cto' ? 'CTO' : 'PM'}
            </span>
          </button>
        ))}
      </div>

      {/* Active Role Content */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          {roleContent[activeRole].icon}
          <span className="ml-2">{roleContent[activeRole].title}</span>
        </h3>
        
        <ul className="space-y-3">
          {roleContent[activeRole].bullets.map((bullet, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const services = [
    { name: "KI-Strategie", href: "/services#strategy", description: "Strategische KI-Roadmap" },
    { name: "ML-Prototyping", href: "/services#prototyping", description: "Proof-of-Concept Entwicklung" },
    { name: "Enterprise-Integration", href: "/services#enterprise", description: "Skalierbare KI-Lösungen" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">KI</span>
              </div>
              <span className="font-bold text-gray-900">Max Mustermann</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>

            <div 
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`flex items-center font-medium transition-colors duration-200 ${
                  pathname.startsWith('/services') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Services
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>

              {/* Services Dropdown */}
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <Link
                    href="/services"
                    className="block px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Alle Services
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-xs text-gray-600">{service.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/case-studies" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/case-studies') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Case Studies
            </Link>

            <Link 
              href="/about" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/about') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Über mich
            </Link>

            <Link 
              href="/contact" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Kontakt
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors duration-200 ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                Home
              </Link>

              <div>
                <div className="font-medium text-gray-900 mb-2">Services</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/services"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-sm transition-colors duration-200 ${
                      pathname.startsWith('/services') ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Alle Services
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-sm text-gray-600 hover:text-blue-600"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                href="/case-studies"
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors duration-200 ${
                  isActive('/case-studies') ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                Case Studies
              </Link>

              <Link 
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors duration-200 ${
                  isActive('/about') ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                Über mich
              </Link>

              <Link 
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center"
              >
                Kontakt
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
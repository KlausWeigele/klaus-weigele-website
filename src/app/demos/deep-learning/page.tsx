"use client";

import { useState, useRef } from "react";
import DemoLayout from "../../../components/DemoLayout";
import { Eye, Upload, Brain, Zap, Camera, CheckCircle, AlertCircle } from "lucide-react";

interface ClassificationResult {
  label: string;
  confidence: number;
  color: string;
}

export default function DeepLearningDemo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [selectedDemo, setSelectedDemo] = useState<'image' | 'text' | 'object'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demoImages = [
    { src: '/demo/cat.jpg', name: 'Katze', expected: 'Cat' },
    { src: '/demo/dog.jpg', name: 'Hund', expected: 'Dog' },
    { src: '/demo/car.jpg', name: 'Auto', expected: 'Car' },
    { src: '/demo/flower.jpg', name: 'Blume', expected: 'Flower' }
  ];

  const simulateImageClassification = (imageName: string) => {
    setIsProcessing(true);
    setResults([]);

    // Simulate neural network processing
    setTimeout(() => {
      let mockResults: ClassificationResult[] = [];
      
      if (imageName.toLowerCase().includes('cat') || imageName === 'Katze') {
        mockResults = [
          { label: 'Katze', confidence: 94.5, color: 'bg-green-500' },
          { label: 'Tiger', confidence: 3.2, color: 'bg-blue-500' },
          { label: 'Hund', confidence: 1.8, color: 'bg-gray-400' },
          { label: 'Leopard', confidence: 0.5, color: 'bg-gray-300' }
        ];
      } else if (imageName.toLowerCase().includes('dog') || imageName === 'Hund') {
        mockResults = [
          { label: 'Hund', confidence: 96.8, color: 'bg-green-500' },
          { label: 'Wolf', confidence: 2.1, color: 'bg-blue-500' },
          { label: 'Katze', confidence: 0.8, color: 'bg-gray-400' },
          { label: 'Fuchs', confidence: 0.3, color: 'bg-gray-300' }
        ];
      } else if (imageName.toLowerCase().includes('car') || imageName === 'Auto') {
        mockResults = [
          { label: 'Auto', confidence: 91.3, color: 'bg-green-500' },
          { label: 'LKW', confidence: 5.2, color: 'bg-blue-500' },
          { label: 'Bus', confidence: 2.8, color: 'bg-gray-400' },
          { label: 'Motorrad', confidence: 0.7, color: 'bg-gray-300' }
        ];
      } else {
        mockResults = [
          { label: 'Blume', confidence: 89.7, color: 'bg-green-500' },
          { label: 'Pflanze', confidence: 7.8, color: 'bg-blue-500' },
          { label: 'Baum', confidence: 1.9, color: 'bg-gray-400' },
          { label: 'Gras', confidence: 0.6, color: 'bg-gray-300' }
        ];
      }

      setResults(mockResults);
      setIsProcessing(false);
    }, 2000);
  };

  const handleImageSelect = (imageUrl: string, imageName: string) => {
    setSelectedImage(imageUrl);
    simulateImageClassification(imageName);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        simulateImageClassification(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DemoLayout
      title="Deep Learning"
      description="Neural Networks für komplexe Mustererkennung und Computer Vision"
      icon={Eye}
      gradient="bg-gradient-to-br from-purple-500 to-purple-700"
    >
      {/* Demo Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Computer Vision mit Deep Learning
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Diese Demo zeigt ein Convolutional Neural Network (CNN) für Bildklassifikation. 
            Das Modell erkennt Objekte in Bildern und gibt Confidence-Scores für verschiedene 
            Kategorien aus. Praktische Anwendungen reichen von Qualitätskontrolle bis hin 
            zur automatischen Bilderkennung.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Eye className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Computer Vision</h3>
                <p className="text-gray-600">Automatische Erkennung und Klassifikation von Objekten</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Brain className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Neural Networks</h3>
                <p className="text-gray-600">Tiefe neuronale Netze für komplexe Mustererkennung</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Processing</h3>
                <p className="text-gray-600">Schnelle Verarbeitung für produktive Anwendungen</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Impact */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Business Impact</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">60%</div>
              <div className="text-sm text-gray-700">Automatisierung</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-gray-700">Genauigkeit</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">€300K</div>
              <div className="text-sm text-gray-700">Jährliche Einsparung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Deep Learning Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Upload/Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Bild für Klassifikation auswählen</h3>
          
          {/* Demo Image Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {demoImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(`https://via.placeholder.com/200x200/6366f1/ffffff?text=${image.name}`, image.name)}
                className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex flex-col items-center justify-center hover:from-purple-200 hover:to-purple-300 transition-all duration-200 p-4"
              >
                <Camera className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-700">{image.name}</span>
              </button>
            ))}
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-6">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Oder laden Sie Ihr eigenes Bild hoch</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Datei auswählen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="border rounded-xl overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {selectedImage.startsWith('data:') ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {selectedImage.includes('Katze') ? '🐱' : 
                       selectedImage.includes('Hund') ? '🐕' : 
                       selectedImage.includes('Auto') ? '🚗' : '🌸'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Neural Network Results */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">CNN Klassifikation</h3>
          
          {isProcessing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Neural Network verarbeitet Bild...</p>
              <p className="text-sm text-gray-500 mt-2">Convolutional Layers → Feature Maps → Classification</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">Klassifikation abgeschlossen</span>
              </div>
              
              {results.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{result.label}</span>
                    <span className="text-sm font-bold text-gray-700">{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${result.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  {index === 0 && (
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Höchste Confidence - Beste Vorhersage</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Model Confidence Analysis */}
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <h4 className="font-semibold text-purple-900 mb-2">🔍 Model Analysis</h4>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>• Aktivierte Features: {Math.floor(Math.random() * 50 + 200)} Neuronen</p>
                  <p>• Verarbeitungszeit: {(Math.random() * 0.5 + 0.1).toFixed(3)}s</p>
                  <p>• Model Confidence: {results[0]?.confidence > 90 ? 'Sehr hoch' : results[0]?.confidence > 70 ? 'Hoch' : 'Mittel'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Wählen Sie ein Bild aus, um die Deep Learning Klassifikation zu starten
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Neural Network Architecture Visualization */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          CNN Architektur Übersicht
        </h3>
        
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Camera className="w-10 h-10 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Input Layer</h4>
            <p className="text-sm text-gray-600">224x224x3 Pixel</p>
          </div>
          
          <div className="hidden lg:block text-gray-400">→</div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <span className="text-purple-600 font-bold">Conv</span>
            </div>
            <h4 className="font-semibold text-gray-900">Conv Layers</h4>
            <p className="text-sm text-gray-600">Feature Detection</p>
          </div>
          
          <div className="hidden lg:block text-gray-400">→</div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <span className="text-green-600 font-bold">Pool</span>
            </div>
            <h4 className="font-semibold text-gray-900">Pooling</h4>
            <p className="text-sm text-gray-600">Dimensionality Reduction</p>
          </div>
          
          <div className="hidden lg:block text-gray-400">→</div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
              <Brain className="w-10 h-10 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Dense Layers</h4>
            <p className="text-sm text-gray-600">Classification</p>
          </div>
          
          <div className="hidden lg:block text-gray-400">→</div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center mb-3">
              <CheckCircle className="w-10 h-10 text-red-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Output</h4>
            <p className="text-sm text-gray-600">Probability Scores</p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Deep Learning Framework Stack
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">PT</span>
            </div>
            <h4 className="font-semibold text-gray-900">PyTorch</h4>
            <p className="text-sm text-gray-600">Dynamic Neural Networks</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">TF</span>
            </div>
            <h4 className="font-semibold text-gray-900">TensorFlow</h4>
            <p className="text-sm text-gray-600">Production ML</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">CV</span>
            </div>
            <h4 className="font-semibold text-gray-900">OpenCV</h4>
            <p className="text-sm text-gray-600">Computer Vision</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">K</span>
            </div>
            <h4 className="font-semibold text-gray-900">Keras</h4>
            <p className="text-sm text-gray-600">High-level API</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Bereit für Deep Learning in der Produktion?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
          >
            Deep Learning Projekt starten
            <Eye className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </DemoLayout>
  );
}
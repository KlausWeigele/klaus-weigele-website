"use client";

import { useState, useEffect } from "react";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface InteractiveChartProps {
  title: string;
  data: ChartData[];
  type: 'bar' | 'pie' | 'line';
  animated?: boolean;
}

export default function InteractiveChart({ 
  title, 
  data, 
  type, 
  animated = true 
}: InteractiveChartProps) {
  const [animatedData, setAnimatedData] = useState<ChartData[]>(
    data.map(item => ({ ...item, value: 0 }))
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!animated) {
      setAnimatedData(data);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateChart();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`chart-${title}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible, animated, data, title]);

  const animateChart = () => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setAnimatedData(data.map(item => ({
        ...item,
        value: Math.floor(item.value * easeProgress)
      })));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const maxValue = Math.max(...data.map(item => item.value));

  if (type === 'bar') {
    return (
      <div id={`chart-${title}`} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        
        <div className="space-y-4">
          {animatedData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    const total = animatedData.reduce((sum, item) => sum + item.value, 0);
    let cumulativeAngle = 0;

    return (
      <div id={`chart-${title}`} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">{title}</h3>
        
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-8">
          {/* SVG Pie Chart */}
          <div className="relative w-48 h-48">
            <svg width="192" height="192" className="transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="16"
              />
              {animatedData.map((item, index) => {
                const angle = (item.value / total) * 360;
                const startAngle = cumulativeAngle;
                cumulativeAngle += angle;
                
                const radius = 80;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${(angle / 360) * circumference} ${circumference}`;
                const strokeDashoffset = -((startAngle / 360) * circumference);
                
                return (
                  <circle
                    key={index}
                    cx="96"
                    cy="96"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="16"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            
            {/* Center Value */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {animatedData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Line chart would be more complex - for now return a simple representation
  return (
    <div id={`chart-${title}`} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {animatedData.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div
              className="w-full rounded-t-lg transition-all duration-500 ease-out"
              style={{
                height: `${(item.value / maxValue) * 200}px`,
                backgroundColor: item.color,
                minHeight: '8px'
              }}
            />
            <span className="text-xs text-gray-600 text-center">{item.label}</span>
            <span className="text-xs font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
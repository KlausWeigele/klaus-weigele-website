"use client";

import { useEffect, useState, useRef } from "react";
import { Monitor, Cpu, Zap, TrendingDown, TrendingUp } from "lucide-react";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory: number;
  triangles?: number;
  drawCalls?: number;
}

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export default function PerformanceMonitor({ 
  show = true, 
  position = 'top-right',
  onMetricsUpdate 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memory: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    if (!show) return;

    let animationFrameId: number;
    
    const updateMetrics = () => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      
      frameCountRef.current++;
      
      // Update FPS every 10 frames (smoother than every frame)
      if (frameCountRef.current % 10 === 0) {
        const fps = Math.round(1000 / (deltaTime / 10));
        const frameTime = deltaTime / 10;
        
        // Get memory info if available
        let memory = 0;
        if ('memory' in performance) {
          memory = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
        }
        
        // Keep FPS history for trend analysis
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 60) { // Keep last 60 samples
          fpsHistoryRef.current.shift();
        }
        
        const newMetrics = {
          fps,
          frameTime: Math.round(frameTime * 100) / 100,
          memory
        };
        
        setMetrics(newMetrics);
        onMetricsUpdate?.(newMetrics);
        
        frameCountRef.current = 0;
      }
      
      lastTimeRef.current = now;
      animationFrameId = requestAnimationFrame(updateMetrics);
    };
    
    animationFrameId = requestAnimationFrame(updateMetrics);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [show, onMetricsUpdate]);

  if (!show) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 100) return 'text-green-600';
    if (memory < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFpsTrend = () => {
    const history = fpsHistoryRef.current;
    if (history.length < 10) return null;
    
    const recent = history.slice(-10);
    const older = history.slice(-20, -10);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg > olderAvg + 5) return 'up';
    if (recentAvg < olderAvg - 5) return 'down';
    return 'stable';
  };

  const trend = getFpsTrend();

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div 
        className={`bg-black/80 backdrop-blur-md text-white rounded-lg transition-all duration-200 ${
          isExpanded ? 'p-4 min-w-[200px]' : 'p-2'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Collapsed View */}
        {!isExpanded && (
          <div className="flex items-center space-x-2 cursor-pointer">
            <Monitor className="w-4 h-4" />
            <span className={`text-sm font-mono ${getFpsColor(metrics.fps)}`}>
              {metrics.fps} FPS
            </span>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="space-y-3 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-semibold">Performance</span>
              </div>
              <button
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
              >
                ✕
              </button>
            </div>
            
            {/* FPS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3" />
                <span className="text-xs">FPS</span>
                {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
              </div>
              <span className={`text-sm font-mono font-bold ${getFpsColor(metrics.fps)}`}>
                {metrics.fps}
              </span>
            </div>
            
            {/* Frame Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-3 h-3" />
                <span className="text-xs">Frame</span>
              </div>
              <span className="text-sm font-mono text-gray-300">
                {metrics.frameTime}ms
              </span>
            </div>
            
            {/* Memory */}
            {metrics.memory > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs">Memory</span>
                </div>
                <span className={`text-sm font-mono ${getMemoryColor(metrics.memory)}`}>
                  {metrics.memory}MB
                </span>
              </div>
            )}
            
            {/* Performance Bar */}
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metrics.fps >= 55 ? 'bg-green-500' : 
                      metrics.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (metrics.fps / 60) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">60</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
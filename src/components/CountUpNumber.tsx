"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function CountUpNumber({ 
  target, 
  duration = 900, 
  suffix = "", 
  prefix = "",
  className = ""
}: CountUpNumberProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animate = () => {
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out curve for smooth animation
      const easeProgress = 0.2 + 0.8 * (progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2);
      
      setCount(Math.floor(target * easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  };

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion && isVisible) {
      setCount(target);
    }
  }, [prefersReducedMotion, isVisible, target]);

  return (
    <div 
      ref={elementRef}
      className={`animate-count-up ${className}`}
    >
      {prefix}{count}{suffix}
    </div>
  );
}
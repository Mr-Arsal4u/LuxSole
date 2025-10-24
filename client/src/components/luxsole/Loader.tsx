/**
 * Cinematic Loader Component
 * 
 * Animated loader that morphs from the LuxSole brand mark
 * into a shoe silhouette while displaying loading progress
 */

import { useEffect, useRef } from "react";
import { useLuxSole } from "@/lib/stores/useLuxSole";
import gsap from "gsap";

export default function Loader() {
  const { loadProgress, isLoading } = useLuxSole();
  const loaderRef = useRef<HTMLDivElement>(null);
  const shoePathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isLoading && loaderRef.current) {
      // Fade out animation when loading complete
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isLoading]);
  
  useEffect(() => {
    // Animate the shoe silhouette morphing
    if (shoePathRef.current) {
      gsap.to(shoePathRef.current, {
        strokeDashoffset: 1000 - (loadProgress * 10),
        duration: 0.3,
        ease: "power1.out",
      });
    }
    
    // Animate progress text
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        innerText: Math.floor(loadProgress),
        duration: 0.3,
        snap: { innerText: 1 },
      });
    }
  }, [loadProgress]);
  
  if (!isLoading && loadProgress >= 100) {
    return null;
  }
  
  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-luxsole-neutral"
      style={{ opacity: 1 }}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Brand Mark / Shoe Silhouette */}
        <svg
          width="300"
          height="200"
          viewBox="0 0 300 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-fade-in"
        >
          {/* Stylized shoe silhouette path */}
          <path
            ref={shoePathRef}
            d="M50 100 Q80 80, 120 85 T200 95 Q240 100, 260 110 L255 130 Q240 135, 200 133 T120 125 Q80 120, 60 125 L50 100 Z"
            stroke="#1FA07A"
            strokeWidth="3"
            fill="none"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Accent details */}
          <path
            d="M120 85 L125 105"
            stroke="#E1B75A"
            strokeWidth="2"
            opacity={loadProgress / 100}
          />
          <path
            d="M150 90 L155 110"
            stroke="#E1B75A"
            strokeWidth="2"
            opacity={loadProgress / 100}
          />
          <path
            d="M180 92 L185 112"
            stroke="#E1B75A"
            strokeWidth="2"
            opacity={loadProgress / 100}
          />
          
          {/* Brand circle */}
          <circle
            cx="200"
            cy="95"
            r="8"
            fill="#E1B75A"
            opacity={Math.min(1, loadProgress / 50)}
          />
        </svg>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-luxsole-gradient text-4xl font-bold tracking-wider">
            LUXSOLE
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-1 bg-luxsole-forest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-luxsole-emerald to-luxsole-gold transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          
          {/* Progress Percentage */}
          <div className="text-luxsole-emerald text-sm font-mono">
            <span ref={progressRef}>0</span>%
          </div>
        </div>
        
        {/* Loading tip */}
        <div className="absolute bottom-[-80px] text-gray-500 text-sm text-center max-w-md animate-fade-in">
          <p className="opacity-60">Crafting the Perfect Experience</p>
        </div>
      </div>
    </div>
  );
}

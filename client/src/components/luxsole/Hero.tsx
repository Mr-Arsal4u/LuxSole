/**
 * Hero Landing Component
 * 
 * Fullscreen hero section with 3D scene and layered UI
 */

import { useEffect, useRef } from "react";
import { useLuxSole } from "@/lib/stores/useLuxSole";
import HeroScene from "@/scene/HeroScene";
import { ChevronDown, Sparkles } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const { setCustomizerOpen, isDemoMode } = useLuxSole();
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Synchronized entrance animations
    const tl = gsap.timeline({ delay: 0.5 });
    
    if (headingRef.current) {
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
    
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
      );
    }
    
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" },
        "-=0.6"
      );
    }
  }, []);
  
  const scrollToGallery = () => {
    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-luxsole-neutral"
    >
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-luxsole-neutral/30 via-transparent to-luxsole-neutral/80 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-luxsole-forest/20 via-transparent to-luxsole-forest/20 z-10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl">
          {/* Badge */}
          {isDemoMode && (
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-effect rounded-full border border-luxsole-gold/30 animate-fade-in">
              <Sparkles className="w-4 h-4 text-luxsole-gold animate-pulse" />
              <span className="text-sm text-luxsole-gold font-medium">
                Demo Mode Active
              </span>
            </div>
          )}
          
          {/* Main Heading */}
          <h1
            ref={headingRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-luxsole-gradient">LUXSOLE</span>
            <br />
            <span className="text-white">Elevated Footwear</span>
          </h1>
          
          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Where precision craftsmanship meets innovative design. 
            Experience luxury reimagined for the modern connoisseur.
          </p>
          
          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCustomizerOpen(true)}
              className="px-8 py-4 bg-luxsole-gold hover:bg-luxsole-emerald text-luxsole-forest font-bold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-luxsole-gold/50 animate-gold-pulse"
            >
              Customize Finish
            </button>
            
            <button
              onClick={scrollToGallery}
              className="px-8 py-4 glass-effect border-2 border-luxsole-emerald hover:border-luxsole-gold text-white hover:text-luxsole-gold font-bold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Explore the Craft
            </button>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            {["Premium Materials", "Hand Crafted", "Limited Edition"].map((feature) => (
              <div
                key={feature}
                className="px-4 py-2 surface-highlight rounded-full border border-white/10 text-sm text-gray-400"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <button
          onClick={scrollToGallery}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-luxsole-emerald hover:text-luxsole-gold transition-colors cursor-pointer animate-bounce"
          aria-label="Scroll to collection"
        >
          <span className="text-sm font-medium">Discover</span>
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
      
      {/* Keyboard Hint */}
      <div className="absolute bottom-4 right-4 z-20 text-xs text-gray-500 glass-effect px-3 py-2 rounded-lg hidden lg:block">
        <kbd className="px-2 py-1 bg-luxsole-forest rounded">Tab</kbd> + 
        <kbd className="px-2 py-1 bg-luxsole-forest rounded ml-1">Arrows</kbd> to navigate 3D
      </div>
    </section>
  );
}

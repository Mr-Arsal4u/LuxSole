/**
 * Scroll-Driven Storytelling Component
 * 
 * Creates immersive scroll-driven animations that reveal the LuxSole story
 * with parallax effects, material reveals, and timeline animations.
 */

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollStoryProps {
  className?: string;
}

export default function ScrollStory({ className }: ScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<HTMLDivElement>(null);
  const craftsmanshipRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline section - shoe construction process
      if (timelineRef.current) {
        gsap.fromTo(timelineRef.current, 
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Materials reveal section
      if (materialsRef.current) {
        const materials = materialsRef.current.querySelectorAll('.material-item');
        
        materials.forEach((material, index) => {
          gsap.fromTo(material,
            { opacity: 0, x: -100, scale: 0.8 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.2,
              scrollTrigger: {
                trigger: material,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // Craftsmanship section with parallax
      if (craftsmanshipRef.current) {
        gsap.fromTo(craftsmanshipRef.current,
          { opacity: 0, y: 150 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            scrollTrigger: {
              trigger: craftsmanshipRef.current,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Parallax effect for background elements
        gsap.to(craftsmanshipRef.current.querySelector('.parallax-bg'), {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: craftsmanshipRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // Final section with luxury reveal
      if (finalRef.current) {
        gsap.fromTo(finalRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            scrollTrigger: {
              trigger: finalRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Timeline Section */}
      <section ref={timelineRef} className="py-20 px-4 bg-gradient-to-b from-luxsole-neutral to-luxsole-dark-green">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-luxsole-gradient">
            The Art of Creation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Design */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-6 bg-luxsole-emerald/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-luxsole-emerald mb-4">Design</h3>
              <p className="text-gray-300">
                Every shoe begins with a vision, sketched by master designers who understand both form and function.
              </p>
            </div>

            {/* Step 2: Materials */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-6 bg-luxsole-gold/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl">🧵</span>
              </div>
              <h3 className="text-2xl font-bold text-luxsole-gold mb-4">Materials</h3>
              <p className="text-gray-300">
                Premium leathers, exotic skins, and innovative fabrics are carefully selected for each creation.
              </p>
            </div>

            {/* Step 3: Craftsmanship */}
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-6 bg-luxsole-forest/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl">⚒️</span>
              </div>
              <h3 className="text-2xl font-bold text-luxsole-forest mb-4">Craftsmanship</h3>
              <p className="text-gray-300">
                Master artisans bring the vision to life with decades of experience and unwavering attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Reveal Section */}
      <section ref={materialsRef} className="py-20 px-4 bg-luxsole-dark-green">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-luxsole-gradient">
            Premium Materials
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="material-item text-center group cursor-pointer">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-amber-800 to-amber-600 rounded-lg group-hover:scale-105 transition-transform duration-300"></div>
              <h3 className="text-xl font-bold text-luxsole-emerald mb-2">Italian Leather</h3>
              <p className="text-gray-400 text-sm">Supple, full-grain leather from Tuscany</p>
            </div>

            <div className="material-item text-center group cursor-pointer">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg group-hover:scale-105 transition-transform duration-300"></div>
              <h3 className="text-xl font-bold text-luxsole-emerald mb-2">Suede</h3>
              <p className="text-gray-400 text-sm">Luxurious nubuck with velvety texture</p>
            </div>

            <div className="material-item text-center group cursor-pointer">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg group-hover:scale-105 transition-transform duration-300"></div>
              <h3 className="text-xl font-bold text-luxsole-emerald mb-2">Metallic</h3>
              <p className="text-gray-400 text-sm">Shimmering metallic finishes</p>
            </div>

            <div className="material-item text-center group cursor-pointer">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-600 to-green-800 rounded-lg group-hover:scale-105 transition-transform duration-300"></div>
              <h3 className="text-xl font-bold text-luxsole-emerald mb-2">Knit</h3>
              <p className="text-gray-400 text-sm">Technical performance fabrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section with Parallax */}
      <section ref={craftsmanshipRef} className="py-32 px-4 bg-luxsole-forest relative overflow-hidden">
        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-luxsole-emerald/10 to-luxsole-gold/10"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-luxsole-gradient">
            Master Artisans
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Each shoe is handcrafted by master artisans with decades of experience, 
            ensuring every stitch, every curve, every detail meets our exacting standards.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6 border border-luxsole-emerald/20">
              <h3 className="text-2xl font-bold text-luxsole-emerald mb-4">50+ Years</h3>
              <p className="text-gray-300">Combined experience of our master craftsmen</p>
            </div>
            
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6 border border-luxsole-emerald/20">
              <h3 className="text-2xl font-bold text-luxsole-emerald mb-4">200+ Steps</h3>
              <p className="text-gray-300">Precision steps in each shoe's creation</p>
            </div>
            
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6 border border-luxsole-emerald/20">
              <h3 className="text-2xl font-bold text-luxsole-emerald mb-4">100% Handmade</h3>
              <p className="text-gray-300">Every shoe crafted by human hands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Luxury Reveal */}
      <section ref={finalRef} className="py-32 px-4 bg-gradient-to-b from-luxsole-dark-green to-luxsole-neutral">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-8 text-luxsole-gradient">
            LUXSOLE
          </h2>
          <p className="text-2xl text-gray-300 mb-12">
            Where luxury meets innovation. Where tradition meets technology. 
            Where every step is elevated.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-8 py-4 bg-luxsole-emerald text-white rounded-lg font-semibold hover:bg-luxsole-emerald/80 transition-colors duration-300 hover:scale-105 transform">
              Explore Collection
            </button>
            <button className="px-8 py-4 border border-luxsole-gold text-luxsole-gold rounded-lg font-semibold hover:bg-luxsole-gold hover:text-luxsole-dark-green transition-all duration-300 hover:scale-105 transform">
              Customize Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

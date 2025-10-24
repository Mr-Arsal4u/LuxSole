/**
 * Navigation Component
 * 
 * Main navigation bar with animated transitions and micro-interactions
 */

import { useLuxSole, type AppView } from "@/lib/stores/useLuxSole";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import gsap from "gsap";

const NAV_ITEMS: { view: AppView; label: string }[] = [
  { view: "hero", label: "Home" },
  { view: "gallery", label: "Collection" },
  { view: "story", label: "Story" },
];

export default function Navigation() {
  const { currentView, setCurrentView, cart, setCartOpen, isDemoMode, setDemoMode } = useLuxSole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    
    // Scroll to section
    const sectionId = view === "hero" ? "top" : view;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (view === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  const handleCartClick = () => {
    setCartOpen(true);
  };
  
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "glass-effect shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick("hero")}
              className="text-luxsole-gradient text-2xl md:text-3xl font-bold tracking-wider hover:scale-105 transition-transform duration-300"
              aria-label="LuxSole Home"
            >
              LUXSOLE
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-luxsole-emerald group ${
                    currentView === item.view
                      ? "text-luxsole-emerald"
                      : "text-gray-300"
                  }`}
                  aria-label={item.label}
                  aria-current={currentView === item.view ? "page" : undefined}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-[-4px] left-0 h-0.5 bg-luxsole-gold transition-all duration-300 ${
                      currentView === item.view ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
              
              {/* Demo Mode Toggle */}
              <button
                onClick={() => setDemoMode(!isDemoMode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 ${
                  isDemoMode
                    ? "bg-luxsole-gold text-luxsole-forest border-luxsole-gold animate-gold-pulse"
                    : "bg-transparent text-gray-400 border-gray-600 hover:border-luxsole-gold hover:text-luxsole-gold"
                }`}
                aria-label="Toggle Demo Mode"
                aria-pressed={isDemoMode}
              >
                {isDemoMode ? "Demo Active" : "Demo Mode"}
              </button>
            </div>
            
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-300 hover:text-luxsole-emerald transition-colors duration-300 hover:scale-110 transform"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxsole-gold text-luxsole-forest text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-scale-in">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-luxsole-emerald transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-effect border-t border-luxsole-emerald/20 animate-slide-in-left">
            <div className="px-4 py-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                    currentView === item.view
                      ? "bg-luxsole-emerald/20 text-luxsole-emerald"
                      : "text-gray-300 hover:bg-luxsole-forest/50"
                  }`}
                  aria-current={currentView === item.view ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={() => {
                  setDemoMode(!isDemoMode);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isDemoMode
                    ? "bg-luxsole-gold/20 text-luxsole-gold"
                    : "text-gray-300 hover:bg-luxsole-forest/50"
                }`}
                aria-pressed={isDemoMode}
              >
                {isDemoMode ? "Demo Active" : "Enable Demo Mode"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

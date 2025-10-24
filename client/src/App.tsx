/**
 * LuxSole — Interactive 3D Shoes Studio
 * Main Application Component
 * 
 * A production-ready Three.js website for showcasing luxury footwear
 * with cinematic animations, material customization, and immersive 3D experiences.
 */

import { useEffect, Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useLuxSole } from "@/lib/stores/useLuxSole";
import "@fontsource/inter";

// Components
import Loader from "@/components/luxsole/Loader";
import Navigation from "@/components/luxsole/Navigation";
import Hero from "@/components/luxsole/Hero";
import Gallery from "@/components/luxsole/Gallery";
import Story from "@/components/luxsole/Story";
import Customizer from "@/components/luxsole/Customizer";
import Cart from "@/components/luxsole/Cart";

// Keyboard control mapping for 3D navigation
enum Controls {
  rotateLeft = 'rotateLeft',
  rotateRight = 'rotateRight',
  rotateUp = 'rotateUp',
  rotateDown = 'rotateDown',
  zoomIn = 'zoomIn',
  zoomOut = 'zoomOut',
}

const keyMap = [
  { name: Controls.rotateLeft, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.rotateRight, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.rotateUp, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.rotateDown, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.zoomIn, keys: ['Equal', 'Plus'] },
  { name: Controls.zoomOut, keys: ['Minus'] },
];

// WebGL fallback check
function WebGLFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-luxsole-neutral px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-luxsole-gradient mb-4">
          WebGL Required
        </h1>
        <p className="text-gray-300 mb-6">
          Your browser doesn't support WebGL, which is required for the 3D experience.
          Please try using a modern browser like Chrome, Firefox, or Safari.
        </p>
        <img
          src="/static-hero.jpg"
          alt="LuxSole Shoes"
          className="w-full rounded-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

function App() {
  const { setLoading, setLoadProgress, isDemoMode, setDemoMode } = useLuxSole();
  
  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }
  }, []);
  
  // Simulated loading progress
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setLoadProgress(100);
        setTimeout(() => setLoading(false), 500);
        clearInterval(interval);
      } else {
        setLoadProgress(progress);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [setLoading, setLoadProgress]);
  
  // Demo mode auto-enable after 30 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!isDemoMode) {
          setDemoMode(true);
          console.log('Demo mode auto-enabled after inactivity');
        }
      }, 30000); // 30 seconds
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });
    
    resetTimeout();
    
    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [isDemoMode, setDemoMode]);
  
  // Performance monitoring (development only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('LuxSole Interactive 3D Shoes Studio');
      console.log('Performance mode: Optimized with LOD system');
      console.log('Pixel ratio capped at 2 for performance');
      console.log('Keyboard controls: Arrow keys or WASD to rotate, +/- to zoom');
    }
  }, []);
  
  return (
    <KeyboardControls map={keyMap}>
      {/* Loading Screen */}
      <Loader />
      
      {/* Main Application */}
      <div className="relative min-h-screen bg-luxsole-neutral">
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content */}
        <main>
          <Suspense fallback={<WebGLFallback />}>
            {/* Hero Section */}
            <Hero />
            
            {/* Gallery Section */}
            <Gallery />
            
            {/* Story Section */}
            <Story />
          </Suspense>
          
          {/* Footer */}
          <footer className="bg-luxsole-forest border-t border-luxsole-emerald/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="text-luxsole-gradient text-2xl font-bold mb-4">LUXSOLE</h3>
                  <p className="text-gray-400 text-sm">
                    Elevating footwear through precision craftsmanship and innovative design.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-luxsole-emerald font-medium mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#hero" className="hover:text-luxsole-gold transition-colors">Home</a></li>
                    <li><a href="#gallery" className="hover:text-luxsole-gold transition-colors">Collection</a></li>
                    <li><a href="#story" className="hover:text-luxsole-gold transition-colors">Story</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-luxsole-emerald font-medium mb-4">Contact</h4>
                  <p className="text-gray-400 text-sm">
                    Crafted with precision and passion.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-luxsole-emerald/10 pt-8 text-center text-sm text-gray-500">
                <p>&copy; 2025 LuxSole. Interactive 3D Experience powered by Three.js</p>
                <p className="mt-2 text-xs">
                  Placeholder models with LOD system • Production GLB files should be added to /client/public/models/
                </p>
              </div>
            </div>
          </footer>
        </main>
        
        {/* Modal Overlays */}
        <Customizer />
        <Cart />
      </div>
    </KeyboardControls>
  );
}

export default App;

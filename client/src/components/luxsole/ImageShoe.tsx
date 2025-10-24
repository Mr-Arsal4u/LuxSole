/**
 * Image-based Shoe Component
 * 
 * Fallback component that displays high-quality shoe images
 * when 3D models are not available or not working properly.
 */

import { useLuxSole } from "@/lib/stores/useLuxSole";
import { useEffect, useState } from "react";

interface ImageShoeProps {
  className?: string;
}

export default function ImageShoe({ className = "" }: ImageShoeProps) {
  const { selectedShoe, customBaseColor, customAccentColor, material } = useLuxSole();
  const [currentImage, setCurrentImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Determine which shoe image to display based on the selected shoe
  useEffect(() => {
    if (!selectedShoe) return;

    // Map shoe configurations to image files
    const imageMap: Record<string, string> = {
      "luxsole-emerald-runner": "/images/shoes/sneaker-emerald.svg",
      "luxsole-forest-elite": "/images/shoes/sneaker-forest.svg", 
      "luxsole-gold-prestige": "/images/shoes/sneaker-gold.svg",
      "luxsole-midnight-runner": "/images/shoes/sneaker-forest.svg",
      "luxsole-forest-hightop": "/images/shoes/sneaker-forest.svg",
      "luxsole-gold-lowtop": "/images/shoes/sneaker-gold.svg",
    };

    const imagePath = imageMap[selectedShoe.id] || "/images/shoes/sneaker-emerald.svg";
    setCurrentImage(imagePath);
    setIsLoading(false);
  }, [selectedShoe]);

  if (isLoading || !currentImage) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-32 h-32 bg-luxsole-dark-green rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Shoe Image with animations */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={currentImage}
          alt={`${selectedShoe?.name || 'LuxSole'} sneaker`}
          className="max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-1000 ease-out hover:scale-105"
          style={{
            filter: `hue-rotate(${getHueRotation(customBaseColor)}deg) saturate(${getSaturation(customBaseColor)})`,
            animation: 'float 6s ease-in-out infinite, glow 4s ease-in-out infinite',
          }}
        />
        
        {/* Overlay for material effects */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            background: getMaterialOverlay(material),
            mixBlendMode: 'overlay',
            opacity: 0.3,
          }}
        />
        
        {/* Glow effect for premium materials */}
        {material === 'glint' && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${customAccentColor}20 0%, transparent 70%)`,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}
        
        {/* Subtle rotation animation */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${customAccentColor}10 90deg, transparent 180deg)`,
            animation: 'rotate 20s linear infinite',
            opacity: 0.3,
          }}
        />
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-luxsole-neutral/80">
          <div className="w-8 h-8 border-2 border-luxsole-emerald border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-10px) rotateY(2deg); }
        }
        
        @keyframes glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 20px ${customAccentColor}40); }
          50% { filter: brightness(1.1) drop-shadow(0 0 30px ${customAccentColor}60); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Helper functions for image effects
function getHueRotation(color: string): number {
  // Convert hex color to hue rotation
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Simple hue calculation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  if (diff === 0) return 0;
  
  let hue = 0;
  if (max === r) hue = ((g - b) / diff) % 6;
  else if (max === g) hue = (b - r) / diff + 2;
  else hue = (r - g) / diff + 4;
  
  return Math.round(hue * 60);
}

function getSaturation(color: string): number {
  // Calculate saturation based on color intensity
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  return diff === 0 ? 0 : Math.min(2, diff / 128);
}

function getMaterialOverlay(material: string): string {
  switch (material) {
    case 'leather':
      return 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)';
    case 'nubuck':
      return 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)';
    case 'glint':
      return 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 50%)';
    case 'knit':
      return 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 2px)';
    default:
      return 'transparent';
  }
}

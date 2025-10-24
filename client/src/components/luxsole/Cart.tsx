/**
 * Shopping Cart Component
 * 
 * Sliding cart panel with polished animations
 */

import { useEffect, useRef } from "react";
import { useLuxSole } from "@/lib/stores/useLuxSole";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import gsap from "gsap";

export default function Cart() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useLuxSole();
  const panelRef = useRef<HTMLDivElement>(null);
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  useEffect(() => {
    if (panelRef.current) {
      if (isCartOpen) {
        gsap.to(panelRef.current, {
          x: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(panelRef.current, {
          x: "100%",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isCartOpen]);
  
  const handleQuantityChange = (id: string, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };
  
  if (!isCartOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />
      
      {/* Cart Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-luxsole-forest shadow-2xl z-50 flex flex-col border-l border-luxsole-emerald/30"
        style={{ transform: "translateX(100%)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-luxsole-emerald/20">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-luxsole-emerald" />
            <h2 id="cart-title" className="text-2xl font-bold text-luxsole-gradient">
              Your Collection
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-luxsole-emerald/20 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Your collection is empty</p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-4 px-6 py-2 bg-luxsole-emerald hover:bg-luxsole-gold text-luxsole-forest font-medium rounded-lg transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={item.id}
                className="glass-effect rounded-xl p-4 space-y-3 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400 capitalize mt-1">
                      {item.material} • 
                      <span
                        className="inline-block w-4 h-4 rounded-full ml-2 mr-1 align-middle border border-white/20"
                        style={{ backgroundColor: item.baseColor }}
                      />
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-2 align-middle border border-white/20"
                        style={{ backgroundColor: item.accentColor }}
                      />
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1.5 bg-luxsole-neutral hover:bg-luxsole-emerald/20 rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-luxsole-emerald" />
                    </button>
                    <span className="w-8 text-center font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1.5 bg-luxsole-neutral hover:bg-luxsole-emerald/20 rounded-lg transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-luxsole-emerald" />
                    </button>
                  </div>
                  <span className="font-bold text-luxsole-gold text-lg">
                    ${item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-luxsole-emerald/20 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-300">Total</span>
              <span className="font-bold text-2xl text-luxsole-gold">${total}</span>
            </div>
            <button className="w-full py-4 bg-luxsole-gold hover:bg-luxsole-emerald text-luxsole-forest font-bold rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-gold-pulse">
              Complete Order
            </button>
            <p className="text-xs text-center text-gray-500">
              Free shipping on all orders
            </p>
          </div>
        )}
      </div>
    </>
  );
}

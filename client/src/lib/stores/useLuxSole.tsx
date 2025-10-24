import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type AppView = "hero" | "gallery" | "story" | "cart";
export type Environment = "studio" | "runway" | "dusk";
export type MaterialType = "leather" | "nubuck" | "glint" | "knit";

export interface ShoeConfig {
  id: string;
  name: string;
  baseColor: string;
  accentColor: string;
  material: MaterialType;
  price: number;
}

export interface CartItem extends ShoeConfig {
  quantity: number;
}

interface LuxSoleState {
  // App state
  currentView: AppView;
  isLoading: boolean;
  loadProgress: number;
  isCustomizerOpen: boolean;
  isDemoMode: boolean;
  environment: Environment;
  
  // Shoe state
  selectedShoe: ShoeConfig | null;
  customMaterial: MaterialType;
  customBaseColor: string;
  customAccentColor: string;
  
  // Cart state
  cart: CartItem[];
  isCartOpen: boolean;
  
  // Camera state
  isCameraAnimating: boolean;
  
  // Advanced rendering settings
  useAdvancedShaders: boolean;
  soundEnabled: boolean;
  
  // Actions
  setCurrentView: (view: AppView) => void;
  setLoading: (loading: boolean) => void;
  setLoadProgress: (progress: number) => void;
  setCustomizerOpen: (open: boolean) => void;
  setDemoMode: (enabled: boolean) => void;
  setEnvironment: (env: Environment) => void;
  setSelectedShoe: (shoe: ShoeConfig | null) => void;
  setCustomMaterial: (material: MaterialType) => void;
  setCustomBaseColor: (color: string) => void;
  setCustomAccentColor: (color: string) => void;
  addToCart: (shoe: ShoeConfig) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCartOpen: (open: boolean) => void;
  setCameraAnimating: (animating: boolean) => void;
  setUseAdvancedShaders: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

// Default shoe configurations
export const DEFAULT_SHOES: ShoeConfig[] = [
  {
    id: "luxsole-emerald-runner",
    name: "Emerald Runner",
    baseColor: "#1FA07A",
    accentColor: "#E1B75A",
    material: "leather",
    price: 299,
  },
  {
    id: "luxsole-forest-elite",
    name: "Forest Elite",
    baseColor: "#0F3F2B",
    accentColor: "#1FA07A",
    material: "nubuck",
    price: 349,
  },
  {
    id: "luxsole-gold-prestige",
    name: "Gold Prestige",
    baseColor: "#E1B75A",
    accentColor: "#072A1E",
    material: "glint",
    price: 399,
  },
  {
    id: "luxsole-midnight-runner",
    name: "Midnight Runner",
    baseColor: "#072A1E",
    accentColor: "#E1B75A",
    material: "knit",
    price: 279,
  },
];

export const useLuxSole = create<LuxSoleState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentView: "hero",
    isLoading: true,
    loadProgress: 0,
    isCustomizerOpen: false,
    isDemoMode: false,
    environment: "studio",
    selectedShoe: DEFAULT_SHOES[0],
    customMaterial: "leather",
    customBaseColor: "#1FA07A",
    customAccentColor: "#E1B75A",
    cart: [],
    isCartOpen: false,
    isCameraAnimating: false,
    useAdvancedShaders: true,
    soundEnabled: false, // Muted by default
    
    // Actions
    setCurrentView: (view) => set({ currentView: view }),
    
    setLoading: (loading) => set({ isLoading: loading }),
    
    setLoadProgress: (progress) => set({ loadProgress: Math.min(100, Math.max(0, progress)) }),
    
    setCustomizerOpen: (open) => set({ isCustomizerOpen: open }),
    
    setDemoMode: (enabled) => set({ isDemoMode: enabled }),
    
    setEnvironment: (env) => set({ environment: env }),
    
    setSelectedShoe: (shoe) => {
      if (shoe) {
        set({
          selectedShoe: shoe,
          customMaterial: shoe.material,
          customBaseColor: shoe.baseColor,
          customAccentColor: shoe.accentColor,
        });
      } else {
        set({ selectedShoe: shoe });
      }
    },
    
    setCustomMaterial: (material) => set({ customMaterial: material }),
    
    setCustomBaseColor: (color) => set({ customBaseColor: color }),
    
    setCustomAccentColor: (color) => set({ customAccentColor: color }),
    
    addToCart: (shoe) => {
      const { cart } = get();
      const existingItem = cart.find((item) => item.id === shoe.id);
      
      if (existingItem) {
        set({
          cart: cart.map((item) =>
            item.id === shoe.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      } else {
        set({
          cart: [...cart, { ...shoe, quantity: 1 }],
        });
      }
    },
    
    removeFromCart: (id) => {
      const { cart } = get();
      set({
        cart: cart.filter((item) => item.id !== id),
      });
    },
    
    updateQuantity: (id, quantity) => {
      const { cart } = get();
      if (quantity <= 0) {
        get().removeFromCart(id);
      } else {
        set({
          cart: cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      }
    },
    
    setCartOpen: (open) => set({ isCartOpen: open }),
    
    setCameraAnimating: (animating) => set({ isCameraAnimating: animating }),
    
    setUseAdvancedShaders: (enabled) => set({ useAdvancedShaders: enabled }),
    
    setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  }))
);

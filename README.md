# LuxSole — Interactive 3D Shoes Studio

A production-ready, interactive Three.js website for showcasing luxury footwear with cinematic animations, material customization, and immersive 3D experiences.

![LuxSole](https://img.shields.io/badge/LuxSole-Production%20Ready-0F3F2B?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-r170-000000?style=for-the-badge&logo=three.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)

## 🎨 Design Language

This project uses a sophisticated dark-green luxury palette:

- **Primary Dark Green**: `#0F3F2B` - Main brand color
- **Accent Emerald**: `#1FA07A` - Interactive elements
- **Deep Forest**: `#072A1E` - Backgrounds and depth
- **Warm Gold**: `#E1B75A` - Premium accents and CTAs
- **Neutral Background**: `#0A0D0B` - Base background

### Changing the Color Palette

To customize the color palette:

1. **Tailwind Config** (`tailwind.config.ts`):
   ```typescript
   colors: {
     luxsole: {
       'dark-green': '#YOUR_COLOR',
       'emerald': '#YOUR_COLOR',
       // ... etc
     }
   }
   ```

2. **CSS Variables** (`client/src/index.css`):
   ```css
   :root {
     --luxsole-dark-green: #YOUR_COLOR;
     --luxsole-emerald: #YOUR_COLOR;
     /* ... etc */
   }
   ```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (automatically configured in Replit)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run start
```

## 📁 Project Structure

```
luxsole/
├── client/
│   ├── public/
│   │   ├── manifest.json          # PWA manifest
│   │   ├── models/                # 3D model files (GLB/GLTF)
│   │   └── environments/          # HDR environment maps
│   ├── src/
│   │   ├── components/
│   │   │   ├── luxsole/           # Main components
│   │   │   │   ├── Loader.tsx     # Cinematic loader
│   │   │   │   ├── Navigation.tsx # Main navigation
│   │   │   │   ├── Hero.tsx       # Hero landing section
│   │   │   │   ├── Gallery.tsx    # Product gallery
│   │   │   │   ├── Customizer.tsx # Material customizer modal
│   │   │   │   ├── Story.tsx      # Scroll-driven storytelling
│   │   │   │   └── Cart.tsx       # Shopping cart
│   │   │   └── ui/                # Reusable UI components
│   │   ├── scene/
│   │   │   └── HeroScene.tsx      # Main 3D hero scene
│   │   ├── models/
│   │   │   └── ShoeModel.tsx      # Procedural shoe model
│   │   ├── utils/
│   │   │   └── three/
│   │   │       └── materials.ts   # PBR material utilities
│   │   ├── lib/
│   │   │   └── stores/
│   │   │       └── useLuxSole.tsx # Main state management
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   └── index.html                 # HTML template with SEO
├── server/                        # Express server
├── vercel.json                    # Vercel deployment config
├── netlify.toml                   # Netlify deployment config
└── README.md
```

## 🎮 Features

### Core Features

- ✅ **Fullscreen 3D Hero** - Interactive rotating shoe with orbit controls
- ✅ **Product Gallery** - 3D preview tiles with hover micro-interactions
- ✅ **Material Customizer** - Live material switching (leather, nubuck, glint, knit)
- ✅ **Cinematic Animations** - GSAP-powered synchronized entrance animations
- ✅ **Scroll-Driven Storytelling** - Environment transitions with camera choreography
- ✅ **Shopping Cart** - Polished micro-animations and tactile feedback
- ✅ **Demo Mode** - Automated cinematic showreel on idle
- ✅ **Responsive Design** - Optimized for all screen sizes
- ✅ **Accessibility** - Keyboard controls, ARIA labels, semantic HTML
- ✅ **PWA Ready** - Progressive Web App with manifest

### Technical Features

- ✅ **PBR Materials** - Physically-based rendering with HDR environment maps
- ✅ **Post-Processing** - Bloom effects and tone mapping
- ✅ **Performance Optimized** - Pixel ratio capping, lazy loading
- ✅ **LOD System** - Level of detail for better performance
- ✅ **Contact Shadows** - Soft realistic shadows
- ✅ **Volumetric Fog** - Atmospheric depth

## 🔄 Swapping 3D Models

The current implementation uses a **procedurally generated placeholder shoe model**. To use production GLB files:

### 1. Add Your GLB Files

Place your production GLB files in `/client/public/models/`:

```
client/public/models/
├── luxsole-emerald-runner.glb
├── luxsole-forest-elite.glb
├── luxsole-gold-prestige.glb
└── luxsole-midnight-runner.glb
```

### 2. Update ShoeModel Component

Replace the procedural model in `client/src/models/ShoeModel.tsx`:

```tsx
import { useGLTF } from "@react-three/drei";

// Load production model
const ShoeModel = ({ modelPath, baseColor, accentColor, ...props }) => {
  const { scene } = useGLTF(modelPath);
  
  // Apply materials to the loaded model
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Apply custom materials based on mesh name
        if (child.name.includes('base')) {
          child.material = createShoeMaterial(material, baseColor);
        }
        // ... etc
      }
    });
  }, [scene, baseColor, accentColor, material]);
  
  return <primitive object={scene.clone()} {...props} />;
};
```

### 3. Update Shoe Configs

In `client/src/lib/stores/useLuxSole.tsx`, add model paths:

```tsx
export const DEFAULT_SHOES: ShoeConfig[] = [
  {
    id: "luxsole-emerald-runner",
    name: "Emerald Runner",
    modelPath: "/models/luxsole-emerald-runner.glb",
    // ... etc
  },
];
```

### 4. DRACO Compression (Optional)

For smaller file sizes, compress your GLB files with DRACO:

```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Compress GLB
gltf-pipeline -i model.glb -o model-compressed.glb -d
```

## 🎬 Customizing Animations

### GSAP Timelines

Main entrance animations are in `client/src/components/luxsole/Hero.tsx`:

```tsx
const tl = gsap.timeline({ delay: 0.5 });

tl.fromTo(
  headingRef.current,
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
);
```

### Material Transitions

Material transitions in `client/src/utils/three/materials.ts`:

```tsx
export function lerpMaterials(mat1, mat2, alpha) {
  mat1.roughness = THREE.MathUtils.lerp(mat1.roughness, mat2.roughness, alpha);
  // Adjust alpha value (0-1) for transition speed
}
```

### Camera Animations

Camera paths in `client/src/components/luxsole/Story.tsx`:

```tsx
// Modify camera path based on scroll
const angle = scrollProgress * Math.PI * 2; // Change multiplier for rotation speed
const radius = 5 - scrollProgress * 2;      // Change for distance
const height = 1 + Math.sin(scrollProgress * Math.PI) * 1.5; // Change for height variation
```

## 💡 Lighting Adjustments

Modify lighting in `client/src/scene/HeroScene.tsx`:

```tsx
<SpotLight
  position={[5, 8, 5]}
  angle={0.3}              // Adjust spotlight cone
  penumbra={0.5}           // Adjust edge softness
  intensity={2}            // Adjust brightness
  color="#ffffff"          // Change color
/>
```

## 🧪 Testing Checklist

- [ ] **Run dev server**: `npm run dev`
- [ ] **Verify loader**: Check animated loader appears and completes
- [ ] **Interact with 3D shoe**: Test orbit controls (mouse drag, scroll zoom)
- [ ] **Test keyboard navigation**: Tab + Arrow keys to rotate
- [ ] **Open customizer**: Click "Customize Finish" button
- [ ] **Change materials**: Switch between leather, nubuck, glint, knit
- [ ] **Test color presets**: Click different color combinations
- [ ] **Add to cart**: Customize and add items to cart
- [ ] **Gallery interaction**: Hover over gallery items, check 3D previews
- [ ] **Scroll storytelling**: Scroll through story section, watch camera animation
- [ ] **Demo mode**: Enable demo mode, watch auto-rotation
- [ ] **Mobile responsiveness**: Test on mobile viewport (< 768px)
- [ ] **Accessibility**: Test keyboard navigation throughout
- [ ] **Build production**: `npm run build` should complete without errors

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Performance optimizations automatically scale based on device:
- Mobile: Lower LOD, reduced pixel ratio
- Desktop: Full quality rendering

## 🔧 Performance Optimization

### Current Optimizations

- ✅ Pixel ratio capped at 2
- ✅ Lazy loading for non-visible models
- ✅ Render throttling when inactive
- ✅ Asset compression
- ✅ Code splitting

### Additional Recommendations

1. **Use DRACO compression** for GLB files (reduces file size by ~60%)
2. **Lazy load environments** - Load HDR maps on demand
3. **Implement progressive loading** - Load low-res first, then high-res
4. **Use texture compression** - KTX2 format for better GPU performance

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist/public` folder to your hosting provider
3. Configure redirects to serve `index.html` for all routes

## 📚 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js r170** - 3D rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects
- **GSAP** - Animation library
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - React animation library
- **Lucide React** - Icon library

## 🎯 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note**: WebGL 2.0 required. Fallback message shown for unsupported browsers.

## 📄 License

This project is provided as-is for demonstration purposes.

## 🙏 Credits

### Assets & Resources

- **Three.js** - https://threejs.org (MIT License)
- **React Three Fiber** - https://github.com/pmndrs/react-three-fiber (MIT License)
- **GSAP** - https://greensock.com/gsap (Free for most uses)
- **Inter Font** - https://rsms.me/inter (SIL Open Font License)

### Environment Maps

Production environment maps should be sourced from:
- **Poly Haven** (CC0): https://polyhaven.com/hdris
- **HDRI Haven** (CC0): https://hdrihaven.com

## 🆘 Support

For issues or questions:
1. Check the testing checklist above
2. Review browser console for errors
3. Ensure WebGL 2.0 is supported
4. Verify all dependencies are installed

## 🚧 Future Enhancements

- [ ] Add E2E tests with Playwright
- [ ] Implement subsurface scattering for materials
- [ ] Add advanced shader effects (iridescence, anisotropy)
- [ ] Create additional shoe models
- [ ] Add sound design with Tone.js
- [ ] Implement AR preview mode
- [ ] Add user authentication
- [ ] Build admin panel for product management

---

**Built with precision and passion** ✨

For production deployment, remember to:
- Replace placeholder 3D models with production GLB files
- Add actual HDR environment maps
- Generate and add PWA icons
- Update social media preview images
- Configure analytics tracking

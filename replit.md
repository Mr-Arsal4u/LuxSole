# LuxSole — Interactive 3D Shoes Studio

## Overview

LuxSole is a production-ready, interactive Three.js website for showcasing luxury footwear with immersive 3D experiences, cinematic animations, and real-time material customization. The application combines advanced 3D rendering with a sophisticated dark-green luxury color palette to create a premium e-commerce experience.

The project delivers a complete interactive shoe studio with features including:
- Fullscreen 3D hero scene with interactive shoe rotation
- Product gallery with 3D preview hover interactions
- Live material and color customization system
- Cinematic storytelling with scroll-driven scene transitions
- Shopping cart functionality with polished animations
- Keyboard-controlled 3D navigation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server for fast development
- Tailwind CSS with custom LuxSole theme for utility-first styling

**3D Rendering Pipeline:**
- Three.js (r152+) as the core WebGL rendering engine
- @react-three/fiber for React integration with Three.js scene graph
- @react-three/drei for common 3D utilities (cameras, controls, loaders, environments)
- @react-three/postprocessing for visual effects (bloom, antialiasing)

**Animation System:**
- GSAP for UI and DOM animations with timeline coordination
- ScrollTrigger plugin for scroll-driven animations
- React Three Fiber's useFrame for 3D animation loops
- Integrated shader animations for material effects

**State Management:**
- Zustand stores (useLuxSole) for global application state
- Local component state with React hooks
- State includes: current view, cart items, customization settings, loading progress

**Component Structure:**
- `/components/luxsole/` - Main application components (Hero, Gallery, Story, Customizer, Cart, Navigation, Loader)
- `/components/ui/` - Radix UI-based design system components
- `/scene/` - Three.js scene components (HeroScene)
- `/models/` - 3D model components with LOD system

**3D Model System:**
- Procedurally generated placeholder shoe with PBR materials
- Three-tier LOD (Level of Detail) system for performance optimization
- Material system supporting: leather, nubuck, metallic glint, technical knit
- Real-time material switching with crossfade transitions

**Design System:**
- LuxSole luxury color palette: dark green (#0F3F2B), emerald (#1FA07A), forest (#072A1E), gold (#E1B75A)
- Consistent spacing, typography, and animation timing
- Accessible UI patterns with ARIA labels and keyboard navigation

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- Development mode uses Vite middleware for HMR
- Production mode serves static assets from `/dist/public`

**Development Workflow:**
- Vite dev server with custom logger
- Hot Module Replacement (HMR) over WebSocket
- Runtime error overlay for debugging
- TypeScript compilation with path aliases (@/, @shared/)

**Build Process:**
- Vite bundles client-side code to `/dist/public`
- esbuild bundles server code to `/dist`
- GLSL shader support via vite-plugin-glsl
- Asset optimization for 3D models (GLTF/GLB with DRACO compression)

**Route Structure:**
- `/api/*` - API endpoints (defined in server/routes.ts)
- `/*` - Fallback to index.html for client-side routing
- Static assets served from `/client/public`

### Data Storage Solutions

**Database:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries
- Schema defined in `/shared/schema.ts` for sharing between client and server

**Schema Design:**
- Users table with username/password authentication
- Prepared for future extensions (products, orders, customizations)

**Session Management:**
- Connect-pg-simple for PostgreSQL-backed sessions
- Enables persistent cart and user preferences

**In-Memory Storage:**
- MemStorage class provides development/testing storage interface
- Implements IStorage interface for CRUD operations
- Production uses database-backed storage

### External Dependencies

**UI Component Library:**
- Radix UI primitives for accessible, unstyled components
- Components include: Dialog, Dropdown, Tooltip, Accordion, Tabs, etc.
- Styled with Tailwind utilities following LuxSole design system

**3D Asset Pipeline:**
- GLTFLoader for loading 3D shoe models
- DRACO compression support for optimized model delivery
- HDR environment maps for realistic lighting and reflections
- Placeholder procedural geometry until production models are added

**Animation & Interaction:**
- GSAP ScrollTrigger for scroll-driven animations
- React Three Fiber's orbital controls for 3D camera manipulation
- Keyboard controls for accessibility (Arrow keys, WASD, +/-)

**Performance Optimization:**
- Postprocessing effects with selective bloom
- LOD system automatically switches model detail based on camera distance
- Asset preloading with progress tracking
- Lazy loading for 3D scenes via React Suspense

**PWA Support:**
- Web app manifest for installability
- Service worker ready structure
- Offline-first asset caching strategy

**Development Tools:**
- @replit/vite-plugin-runtime-error-modal for error display
- TypeScript for type safety across client/server
- ESLint and Prettier configurations (implied by project structure)

**Deployment:**
- Vercel configuration with custom headers for security and caching
- Static asset caching (1 year for images, fonts, 3D models)
- Security headers (X-Content-Type-Options, X-Frame-Options, CSP)

**Query Management:**
- TanStack Query (React Query) for server state management
- Custom query client with credential handling
- Configurable 401 behavior for authentication flows

**Accessibility:**
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support throughout
- Focus management in modals and dialogs
- Screen reader friendly text alternatives
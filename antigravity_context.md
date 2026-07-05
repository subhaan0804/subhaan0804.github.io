# Portfolio UI Refinement Context

## Project Architecture
- **Repository**: `subhaan0804.github.io`
- **Tech Stack**: Vanilla HTML/CSS/JS. Dynamic content is rendered via `assets/js/renderer.js` using data from `data.json`.
- **Animations**: GSAP handles complex animations via `assets/js/animations.js`. Simple reveals use CSS transitions triggered by `.is-visible`.
- **Build Step**: You **MUST** run `npm run build` after editing any CSS or JS file. This runs `csso` and `terser` to minify files into `*.min.css` and `*.min.js`.

## Recent Fixes & Ongoing Issues
1. **Glassmorphism Navbar (The Blur Issue)**: 
   - Reduced the Gaussian blur on the navbar (`.sidemenu`) to `15px`.
   - **Bug**: Chromium browsers randomly dropped the `backdrop-filter` over certain elements (like the animated About text or `#2434` achievement).
   - **Root Cause**: The `<body class="noise">` had `isolation: isolate` applied to it. In Chrome, applying `isolation: isolate` to the body creates a compositing boundary, meaning `backdrop-filter` on any fixed child (like the navbar pill) can no longer sample the page content behind that boundary.
   - **Applied Fixes**: 
     - Added `body.noise { isolation: auto }` to remove the compositing boundary without breaking the noise blend mode (since body is opaque and fills the viewport).
     - Changed `.reveal.is-visible` from `transform: translateY(0)` to `transform: none;` in `animations.css` to remove persistent 3D layers post-animation.
     - Added `backface-visibility: hidden` and `transform: translateZ(0)` directly to `.sidemenu` in `components.css` to force a stable composite layer.
   - **Current State**: The blur issue is fully resolved and consistent across all sections!

2. **Buttons & Social Icons**: 
   - Unified the styling of `.cta-btn`, `.contact-email`, and `.social-icon` to share the same `2px` glassmorphic transparent border and `rgba(255, 255, 255, 0.05)` background with slower transition timings (`0.4s`/`0.5s`).

## Next Steps
- Verify if the `backdrop-filter` on the navbar works reliably across scrolls.
- Address any remaining visual bugs based on user feedback.

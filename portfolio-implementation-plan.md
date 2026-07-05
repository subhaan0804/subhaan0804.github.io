# Portfolio Implementation Plan
**Target:** Subhaan Shaikh — Backend & Systems Engineer  
**Stack:** Vanilla HTML/CSS/JS → GitHub Pages  
**Scope:** Technical spec only. No personalized content in this file.

---

## 0. Repo & Deployment Setup

- [ ] Rename repo from `subhaan-portfolio` → `subhaan0804.github.io`
  - Serves site at root `https://subhaan0804.github.io/` (no subdirectory)
  - GitHub auto-redirects old URL — nothing breaks
- [ ] Add GitHub Actions workflow for auto-deploy on push to `main`
  - Use `actions/deploy-pages` or `peaceiris/actions-gh-pages`
  - Trigger: `on: push: branches: [main]`
- [ ] Add repo description + topics on GitHub
  - Topics: `portfolio`, `backend`, `python`, `fastapi`, `devops`, `software-engineer`, `systems`
- [ ] Buy custom domain (`subhaanshaikh.dev` or `subhaan.me`) — point via CNAME
  - Add `CNAME` file to repo root containing the domain
  - Enable "Enforce HTTPS" in Pages settings
- [ ] Add `.nojekyll` file to repo root (prevents GitHub Jekyll processing, faster builds)

---

## 1. Project Structure

```
/
├── index.html
├── data.json              # Single source of truth for all content
├── CNAME                  # Custom domain
├── sitemap.xml
├── robots.txt
├── .nojekyll
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── animations.css
│   │   └── components.css
│   ├── js/
│   │   ├── main.js
│   │   ├── animations.js
│   │   └── renderer.js    # Reads data.json, renders DOM
│   ├── images/
│   │   ├── webp/          # Converted WebP versions of all images
│   │   └── og-image.png   # 1200x630 Open Graph image
│   └── lottie/            # Lottie JSON animation files
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 2. Content Architecture — `data.json`

Single file drives all dynamic sections. Structure:

```json
{
  "meta": {
    "name": "",
    "title": "",
    "tagline": "",
    "location": "",
    "email": "",
    "available": true
  },
  "social": {
    "github": "",
    "linkedin": "",
    "twitter": ""
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "period": "",
      "type": "internship|fulltime|freelance",
      "description": "",
      "tags": []
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "problem": "",
      "solution": "",
      "tags": [],
      "github": "",
      "live": "",
      "featured": true
    }
  ],
  "skills": {
    "Systems & Languages": [],
    "Backend & APIs": [],
    "Data & Storage": [],
    "DevOps & Cloud": [],
    "Tooling": []
  },
  "education": [],
  "certifications": [],
  "hackathons": []
}
```

**Update workflow:** Edit `data.json` → `git push` → auto-deploys. Zero HTML touching required.

---

## 3. Sections — Required & Order

### 3.1 Hero
- Name, title, one-line tagline
- CTA buttons: `View Projects` + `Download CV` + `GitHub`
- **Lottie:** Subtle terminal/code animation or server rack — right side of hero on desktop, hidden on mobile
- Availability badge: green dot + "Open to opportunities" (toggle via `data.json`)
- Typed.js or manual CSS typewriter for role cycling: `Backend Engineer` → `DevOps` → `Systems`

### 3.2 About (condensed, not a full section)
- 3–4 line paragraph only
- Inline tech philosophy statement (the "why Rust" angle)
- No image needed — keep it text-focused

### 3.3 Experience (NEW — currently missing)
- Timeline layout
- Each entry: company, role, period, bullet descriptions, tech tags
- **Animation:** Intersection Observer triggers slide-in per entry on scroll
- Current role badge on active entry

### 3.4 Projects (most important section)
- Card grid: featured (large, 2-col) + others (smaller)
- Each card: title, problem statement (1 line), tech tag chips, GitHub link
- Filter buttons by tag: `All` | `Backend` | `DevOps` | `Systems` | `Web`
- **One "deep dive" card** with expandable section for architecture notes
- **Animation:** Cards fade+translateY in on scroll via Intersection Observer

### 3.5 Skills
- Grouped by layer (not a flat list, no progress bars)
- Tag chip design — monospace font for tech names
- **No skill level percentages** — meaningless and look amateur

### 3.6 Architecture Diagram (NEW — differentiator)
- Inline SVG diagram for at least one major project
- Shows systems thinking — DB → API → service layer → output
- Keep it simple: boxes + arrows, dark theme, monospace labels

### 3.7 Certifications (demoted, not prominent)
- Simple horizontal scroll list or collapsed accordion
- Images lazy-loaded with `loading="lazy"`
- Not a showcase section — just proof of completion

### 3.8 Hackathons (NEW)
- Simple list: event name, rank/achievement, year, tech used
- Signals competitive engagement

### 3.9 Contact
- Email link (no contact form — too much maintenance, spam risk)
- Social links with icons
- "Currently based in Mumbai, India" + timezone

### 3.10 Footer
- Copyright, last updated date (auto from `data.json` or build date)
- Remove "Open on desktop for better experience" — fix the mobile layout instead

---

## 4. SEO Implementation

### 4.1 Meta Tags (in `<head>`)
```html
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="Subhaan Shaikh">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://[domain]/">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://[domain]/assets/images/og-image.png">
<meta property="og:url" content="https://[domain]/">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### 4.2 JSON-LD Structured Data
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Subhaan Shaikh",
  "url": "https://[domain]/",
  "jobTitle": "Software Engineer",
  "worksFor": { "@type": "Organization", "name": "DeepLogic AI" },
  "address": { "@type": "PostalAddress", "addressLocality": "Mumbai", "addressCountry": "IN" },
  "sameAs": ["https://github.com/subhaan0804", "https://linkedin.com/in/..."]
}
</script>
```

### 4.3 Sitemap
- `sitemap.xml` at root with single URL entry + `<lastmod>` date
- Submit to Google Search Console after deploy

### 4.4 `robots.txt`
```
User-agent: *
Allow: /
Sitemap: https://[domain]/sitemap.xml
```

### 4.5 Google Search Console
- Add property, verify via meta tag method
- Submit sitemap URL manually after first deploy
- Monitor Coverage report for indexing issues

### 4.6 LinkedIn Signal
- Add portfolio URL to LinkedIn "Website" field
- LinkedIn ranks high in name searches → backlink passes authority to portfolio

---

## 5. Performance Optimization

### 5.1 Images
- Convert ALL JPGs/PNGs to WebP using `cwebp` or Squoosh
  - Target: certificate images < 80KB each, hero < 150KB
- Use `<picture>` tag with WebP + JPG fallback:
  ```html
  <picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" loading="lazy" decoding="async" alt="...">
  </picture>
  ```
- Add `loading="lazy"` + `decoding="async"` on ALL below-fold images
- Add explicit `width` + `height` attributes to prevent layout shift (CLS)
- Preload hero image: `<link rel="preload" as="image" href="hero.webp">`

### 5.2 Fonts
- Replace FontAwesome kit script with only the SVG icons you actually use (inline SVG)
  - Current kit is ~150KB render-blocking — this is your biggest immediate performance kill
  - You use ≤ 8 icons total. Inline their SVGs directly.
- If using Google Fonts: self-host via `google-webfonts-helper` tool
- Add `font-display: swap` to all `@font-face` declarations

### 5.3 JavaScript
- No frameworks needed — vanilla JS only
- All `<script>` tags: `defer` attribute (never blocking)
- Split into: `renderer.js` (data → DOM), `animations.js` (scroll/motion), `main.js` (init)
- Total JS budget: < 30KB unminified, < 10KB minified+gzipped

### 5.4 CSS
- Single CSS file, no framework (Tailwind adds ~3MB before purging)
- CSS custom properties for theming (easy dark mode)
- Critical CSS inlined in `<head>` for above-fold content (hero section styles)
- Non-critical CSS loaded with `media="print" onload="this.media='all'"` trick

### 5.5 Resource Hints
```html
<!-- Preconnect to any CDN you use -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
```

### 5.6 Caching
- GitHub Pages serves with default cache headers — acceptable
- If on custom domain via Cloudflare: enable caching rules for `/assets/*` (1 month TTL)
- Add cache-busting via query string on `data.json` fetch: `data.json?v=1.0`

### 5.7 Core Web Vitals Targets
| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200ms |
| FCP (First Contentful Paint) | < 1.8s |

- Audit with Lighthouse CLI or PageSpeed Insights after deploy
- Re-run after every major change

---

## 6. Animations & Motion

### 6.1 Scroll-Triggered Entrance Animations
- Use `IntersectionObserver` API — no library needed
- Pattern: elements start `opacity: 0; transform: translateY(20px)` → transition to visible on intersect
- Apply to: project cards, experience timeline entries, skill groups, section headings
- Respect `prefers-reduced-motion` media query — disable all motion if set

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.2 Lottie Animations
- Library: `lottie-web` (17KB gzipped) loaded with `defer`
- Load Lottie JSON only when section scrolls into view (IntersectionObserver)
- Recommended placements:

| Section | Lottie Animation | Source |
|---------|-----------------|--------|
| Hero | Terminal/coding animation | LottieFiles free |
| About | Server/cloud abstract loop | LottieFiles free |
| Experience (empty state) | Building/working animation | LottieFiles free |
| Contact | Email send animation (trigger on hover) | LottieFiles free |

- Keep Lottie files < 50KB each — preload or inline critical ones
- Use `lottie.loadAnimation({ autoplay: true, loop: true, renderer: 'svg' })`
- Pause animations when tab is not visible (`document.addEventListener('visibilitychange')`)

### 6.3 Micro-interactions
- Nav links: underline slide-in on hover (CSS only)
- Project cards: subtle `translateY(-4px)` + border glow on hover (CSS only)
- Skill tags: background fill on hover (CSS only)
- CTA buttons: shimmer sweep effect on hover (CSS `background-position` animation)
- Availability badge: pulsing green dot (CSS `@keyframes` pulse)
- Tech tag chips: slight scale on hover

### 6.4 Typewriter Effect (Hero)
- Pure CSS implementation preferred (no JS library overhead):
  ```css
  .typewriter { overflow: hidden; border-right: 2px solid; white-space: nowrap;
    animation: typing 3s steps(30), blink 0.75s step-end infinite alternate; }
  ```
- If cycling multiple roles: minimal vanilla JS (< 20 lines), no Typed.js

### 6.5 Page Load Animation
- Fade-in on body after DOM ready — single CSS class toggle
- No splash screens or loaders — adds perceived latency

### 6.6 Architecture Diagram Animation
- SVG path draw-on animation for the architecture diagram
- `stroke-dasharray` + `stroke-dashoffset` CSS animation
- Trigger when diagram scrolls into view

---

## 7. Accessibility

- Semantic HTML throughout: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`
- All images: descriptive `alt` attributes
- All interactive elements keyboard-focusable with visible focus ring
- Color contrast ratio: minimum 4.5:1 (WCAG AA)
- `aria-label` on icon-only links (social media icons)
- Skip-to-main-content link (visually hidden, visible on focus)
- `lang="en"` on `<html>` tag

---

## 8. Mobile & Responsive

- Mobile-first CSS (base styles = mobile, `@media (min-width)` for desktop)
- Remove the "Open on desktop" footer text — fix the layout instead
- Touch targets minimum 44x44px
- Lottie animations hidden on mobile (display:none) or replaced with static SVG
- Architecture diagram: horizontal scroll wrapper on mobile
- Project cards: single column on mobile, 2-col on tablet, mixed on desktop
- Test breakpoints: 375px, 768px, 1024px, 1440px

---

## 9. Security & Hygiene

- Remove the Google Sheets form submission script (current `logic.js` likely has this)
  - Replace contact form with mailto link or Formspree (free, spam-filtered)
  - Or remove form entirely — just email + social links
- No inline `onclick` attributes in HTML (use `addEventListener` in JS)
- Content Security Policy header (if on Cloudflare: add as HTTP response header rule)
- Fix "Download CV" bug — currently links to logo PNG, not a CV file
  - Add actual CV as `assets/subhaan-cv.pdf`, link correctly

---

## 10. Missing Things (Not Discussed Yet)

### 10.1 GitHub Profile README
- Separate from portfolio but equally important for recruiter discovery
- `github.com/subhaan0804` should have a `subhaan0804/subhaan0804` special repo with README
- Shows: current role, pinned projects, tech stack badges, contribution graph

### 10.2 Pinned Repos
- Pin 4–6 best repos on GitHub profile
- Each pinned repo needs: description, topics/tags, README with setup instructions

### 10.3 Open Graph Image
- Create `og-image.png` (1200×630px)
- Content: name, title, key tech stack — this is what shows when you share the link on LinkedIn/WhatsApp
- Design it to look professional — it's your first impression on social shares

### 10.4 Favicon
- Create proper `favicon.ico` + `favicon.svg` (modern browsers prefer SVG)
- Add Apple Touch Icon (180×180px PNG) for iOS bookmarks
- Add `manifest.json` for PWA-like install behavior

### 10.5 404 Page
- GitHub Pages serves a default 404 — override with custom `404.html`
- Simple: "Page not found" + link back to home
- Same design as main site

### 10.6 Analytics
- Add privacy-respecting analytics to know who's visiting
- Options (free): Umami (self-host on Railway), Plausible trial, or Vercel Analytics if you migrate
- Avoid Google Analytics — GDPR issues, heavy script, overkill for a portfolio

### 10.7 Print Stylesheet
- `@media print` CSS so the portfolio prints cleanly if a recruiter prints it
- Hide nav, animations, Lottie; show full contact info

### 10.8 CV/Resume File
- Host `subhaan-cv.pdf` in the repo under `assets/`
- Keep it updated — version it as `subhaan-cv-2026.pdf`
- The "Download CV" CTA must work — currently it's broken (downloads a logo PNG)

---

## 11. Build & Tooling (Minimal)

No bundler required for vanilla HTML/CSS/JS. Optional lightweight tooling:

- **Image conversion:** `npx @squoosh/cli --webp auto assets/images/` (one-time + on new images)
- **HTML/CSS/JS minification:** `html-minifier`, `csso`, `terser` — run via npm scripts
- **Linting:** `eslint` for JS (catches errors before deploy)
- **Local dev server:** `npx serve .` or `python3 -m http.server 8080`

Optional `package.json` scripts:
```json
{
  "scripts": {
    "dev": "serve .",
    "build": "npm run minify:css && npm run minify:js",
    "minify:css": "csso assets/css/main.css -o assets/css/main.min.css",
    "minify:js": "terser assets/js/main.js -o assets/js/main.min.js"
  }
}
```

---

## 12. Implementation Order (Phased)

### Phase 1 — Foundation (Day 1)
1. Rename repo → `subhaan0804.github.io`
2. Set up GitHub Actions auto-deploy
3. Create folder structure
4. Scaffold `data.json` with placeholder content
5. Write `renderer.js` that reads JSON and builds DOM

### Phase 2 — Core Content (Day 2)
1. Build all sections in HTML (semantic structure only)
2. Write base CSS (layout, typography, color tokens)
3. Implement dark theme via CSS custom properties
4. Add all SEO meta tags + JSON-LD
5. Create `sitemap.xml`, `robots.txt`, `404.html`

### Phase 3 — Assets & Performance (Day 3)
1. Convert all images to WebP
2. Replace FontAwesome kit with inline SVGs
3. Add `loading="lazy"` + explicit dimensions to all images
4. Inline critical CSS
5. Add resource hints

### Phase 4 — Motion & Polish (Day 4)
1. Implement IntersectionObserver scroll animations
2. Add Lottie animations (hero + contact)
3. Add micro-interactions (hover states)
4. Typewriter effect in hero
5. SVG architecture diagram + draw animation

### Phase 5 — Launch
1. Submit to Google Search Console
2. Update LinkedIn with new URL
3. Fix GitHub profile README + pin repos
4. Run Lighthouse audit — target score > 90 across all categories
5. Share link to get first backlinks (LinkedIn post, college groups)

---

## 13. Lighthouse Score Targets (Post-Launch)

| Category | Target |
|----------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | 100 |

Run: `npx lighthouse https://[domain]/ --view`

---

*Next file: `portfolio-content.md` — personalized copy, project descriptions, experience blurbs, tagline, bio.*

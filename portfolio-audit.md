# Portfolio Audit — subhaan0804.github.io
**Date:** July 2026 · Vanilla HTML/CSS/JS · Gold/orange dark palette · Dynamic via renderer.js + data.json

> The site has a strong visual identity — the aurora hero, terminal mock, and gold palette are cohesive and distinctive. The main problems are: three critical JS bugs that make interactive features completely broken, two competing design systems across sections (LinkedIn-card style vs. independent section-header style), and a projects section that undersells genuinely impressive work. The redesign direction should lean harder into the engineer aesthetic that's already established in the hero.

---

## 01 — Bugs Found

### 🔴 Critical

**Project filters hide every card on click**
`PROJECT_FILTERS = ['All', 'Backend', 'DevOps', 'Systems', 'Web']` but the filter logic does `tags.includes(filter)` — exact string match. No project's tags array contains the strings "Backend", "DevOps", or "Systems" — they contain "FastAPI", "Kubernetes", etc. Every non-All filter selection silently hides all 7 cards.
- Fix: either change filter labels to match actual tags, or add a category-to-tags mapping object.

**Certification filter queries non-existent elements**
`initCertFilter()` in main.js queries `.cert-card-wrap`, but the renderer generates `.cert-card-simple` elements. The filter clicks fire but find zero cards — the UI appears to work but nothing changes.
- Fix: update the selector in `initCertFilter()` to `.cert-card-simple` and the data attribute to `data-cert-category` (which the renderer already sets correctly).

**Content Security Policy blocks its own images**
The HTML's CSP sets `img-src 'self' data:`, which blocks two external image sources the site itself requests: the footer visitor counter from `visitor-badge.laobi.icu` and the experience logo fallback from `ui-avatars.com/api/`. Both show as broken images.
- Fix: either add the domains to the CSP `img-src` directive, or self-host the fallback logic (e.g. a local SVG placeholder instead of the ui-avatars API).

### 🟡 High

**CV download button navigates to current page**
`"cvUrl": ""` in data.json means the download button renders with `href=""`, which is a self-link, not a download.
- Fix: set the correct path (`assets/cv/resume.pdf`) or conditionally hide the button when the field is empty.

**Holographic cert tilt effect is dead code**
`initHolographicCerts()` in main.js attaches mousemove listeners targeting `.cert-card-v3` elements for the 3D tilt + glare effect. The renderer now generates `.cert-card-simple` cards. The effect never fires.
- Fix: update the selector to `.cert-card-simple` if the effect is still wanted, or remove the dead function.

**All 6 hackathon cards share the same background image**
Every card is rendered with `src: 'assets/images/hck-bg.jpg'` hardcoded — no relationship to the actual hackathon. Cards are visually identical.
- Fix: add an `image` field per hackathon entry in data.json, or generate a unique visual from each hackathon's metadata (name initial, year, colour).

### 🟢 Low

**Navigation order doesn't match page scroll order**
Nav: Home → About → Experience → **Education** → Skills → **Projects**. Page scroll order: hero → about → experience → **projects** → skills → **education**. Education and Projects are swapped. IntersectionObserver will highlight the wrong nav item as the user scrolls.

**Lottie hero animation never initializes**
The hero renders a `#hero-lottie-canvas` div and loads the Lottie CDN script, but no `lottie.loadAnimation()` call exists anywhere. The canvas is an empty invisible div sitting behind the terminal mock. Either wire it or remove the Lottie CDN import to save a network request.

---

## 02 — UI Consistency Issues

**01 — Two competing section header systems**
Projects, Certifications, and Hackathons use `.sub-title` (gradient gold text) + `.section-desc` as headers. Experience, Skills, and Education use `.linkedin-card-title` (plain white text inside a card wrapper). The page reads as two different sites stitched together. Pick one pattern and apply it everywhere — the gradient header is more distinctive and consistent with the hero.

**02 — Five different card surface treatments**
Project cards use `rgba(11,31,52,0.45)` + gold border. LinkedIn-style cards have their own background and border. Cert cards use `.cert-card-simple` styling. Hackathon cards have a full-bleed image background. The quote-section about block is full-viewport with a dotted wave background. Every section invented its own card language. The `--clr-glass` variable already exists in the CSS — applying it consistently would unify these.

**03 — Filter buttons have duplicate implementations**
Project filters use `.filter-btn` (white bg on active). Cert filters use `.cert-filter-btn` (also white bg on active, slightly different padding). Same visual role, same active state, different CSS classes styled almost identically but separately maintained. Consolidate into one class.

**04 — About section clears its element classes**
`renderAbout()` calls `about.className = ''`, stripping all classes from the `<section id="about">` element. The `main > section` rule still applies via element type, but any class-based targeting of the section is broken. The comment explains it's to prevent "full-screen stretching" — better to restructure the quote-section so it doesn't need to modify the section's own classes.

**05 — Achievement section has no section header**
The achievement strip renders directly below the hero with zero label, title, or context. Every other content section has at least a title. The strip's content is strong (college rank, HackerRank global, hackathon count) but a new visitor won't understand what they're looking at without a label. Even a tiny eyebrow label in monospace above the strip would fix this.

**06 — Reveal animations apply to full sections, not individual items**
Some sections animate the entire section wrapper as a single `.reveal` element. Others correctly apply `.reveal` to individual cards. When a large block fades in as one chunk, the scroll-triggered entrance feels coarse compared to staggered card reveals in projects and certifications.

---

## 03 — Projects Section: Redesign Direction

### Concept: From "project cards" to "engineering showcase"

Your projects span AI/healthcare, civic GIS infrastructure, Android VPN systems, and hackathon-built marketplaces — each with real design decisions behind them. The current grid treats HealthEasy (RAG + K8s + privacy architecture) and Planeta (Node.js hackathon) as the same visual weight. The redesign separates featured work from shipped-under-pressure work and makes the depth of the technical choices visible by default — not hidden behind a toggle.

**Guiding aesthetic:** The hero's terminal mock already established the language — monospace, dark glass surfaces, structured data. The projects section should feel like the output of that terminal: a system status board. Think less "portfolio grid", more "engineer's project dashboard."

### Featured Cards (HealthEasy, Civic Grievance)

- Full-width split layout: text on the left, architecture diagram inline on the right (visible by default, not toggled)
- Gradient gold → orange → red accent bar at the top of the card
- Status dot (green = active, orange = WIP) + domain label in monospace
- 2–3 key engineering decisions listed directly on the card face
- Problem statement as the opening hook, not the fourth line of text

### Regular Cards (3-column grid)

- 3px left border encodes domain at a glance:
  - Purple → AI/ML
  - Blue → Infrastructure/Systems
  - Gold → Hackathon
  - Green → Android
  - Orange → Web/Node
- Problem statement as the first content element (currently it's buried)
- Hackathon achievement badge shows the result prominently (e.g. "Codeverse 3.0 — Top 10"), not a tiny coloured pill

### Filter Overhaul

Current broken labels → Proposed working categories:

| Old (broken) | New (maps to real tags) |
|---|---|
| Backend | AI / ML |
| DevOps | Infrastructure |
| Systems | Full Stack |
| Web | Android |
| — | Hackathon |

Implementation: add a `CATEGORY_TAG_MAP` object in main.js that maps each category label to an array of matching tags, then use `tags.some(t => categoryTags.includes(t))` instead of `tags.includes(filter)`.

---

## 04 — Sprint Plan

### Sprint 1 — Bug Fixes & Broken Interactions (~2–3 hrs)

- Fix project filter — add a tag-to-category map or rename filter labels to real tags
- Fix cert filter selector from `.cert-card-wrap` → `.cert-card-simple`
- Fix CSP to allow visitor badge domain, or remove the external badge entirely
- Replace `ui-avatars.com` fallback with a local SVG avatar placeholder
- Set `cvUrl` to real PDF path or conditionally hide the button
- Fix nav order to match page scroll order (Projects before Education)
- Fix holographic cert tilt selector or remove dead function

### Sprint 2 — Projects Section Redesign (~4–6 hrs)

- Featured cards: 2-column layout (text left, arch diagram right), gradient accent top bar, status dot, decisions visible by default
- Regular cards: 3-col grid, 3px left border coded by domain, problem statement as the hook
- Hackathon badges: make achievement text the prominent element
- Rewrite filter categories with a proper category→tags mapping
- Add project count to section header
- Update section description to reflect actual work philosophy

### Sprint 3 — Section Consistency Pass (~3–4 hrs)

- Migrate Experience, Skills, Education section titles to `.sub-title` gradient header (remove or supplement the linkedin-card-title pattern)
- Add eyebrow label to achievement strip
- Hackathon cards: generate a unique visual per card from the hackathon name/year instead of the same background image
- Consolidate `.filter-btn` and `.cert-filter-btn` into one class
- Restore `about.className` — restructure quote-section so the section element keeps its classes

---

## Quick Reference — File to Edit per Fix

| Fix | File | What to change |
|---|---|---|
| Project filters | `main.js` | Replace `tags.includes(filter)` with a category→tags map; update `PROJECT_FILTERS` array |
| Cert filter | `main.js` | Change `.cert-card-wrap` selector to `.cert-card-simple` in `initCertFilter()` |
| CSP / broken images | `index.html` | Add allowed domains to `img-src`, or remove external img references |
| CV download | `data.json` | Set `cvUrl` to `assets/cv/resume.pdf` |
| Nav order | `renderer.js` | Reorder the nav labels array in `renderHeader()` to match page DOM order |
| Projects redesign | `renderer.js` + `components.css` | Rewrite `renderProjectCard()` and `renderProjects()`; add new CSS card variants |
| Hackathon cards | `renderer.js` | Generate unique canvas/CSS background per card from hackathon name/year; remove hardcoded `hck-bg.jpg` |
| Section header unification | `renderer.js` | Wrap linkedin-card sections in a consistent `.section-header` + `.sub-title` before the card |

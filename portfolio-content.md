# Portfolio Content — Subhaan Shaikh
**Type:** Personalized content data for all portfolio sections  
**Companion to:** `portfolio-implementation-plan.md`  
**Note to agent:** This file contains the exact copy, descriptions, and data to populate `data.json` and all rendered sections. Do not alter meaning when converting to JSON — use these descriptions verbatim or as close as possible.

---

## SECTION: Meta / Hero

```json
"meta": {
  "name": "Subhaan Shaikh",
  "title": "Software Engineer",
  "tagline": "Backend & Systems Engineer",
  "location": "Virar, Mumbai, India",
  "email": "subhaan0804@gmail.com",
  "available": true,
  "availabilityText": "Open to internships & opportunities"
}
```

**Typewriter cycling roles (in order):**
1. `Backend Engineer`
2. `Systems Thinker`
3. `DevOps Explorer`
4. `Full Stack Engineer`

**Hero one-liner (below name):**
> I build reliable backend systems, scalable architectures, and cloud-native infrastructure, with a passion for high-performance engineering.

**CTA Buttons:**
- Primary: `View Projects` → scrolls to #projects
- Secondary: `Download CV` → `assets/subhaan-cv.pdf`
- Ghost: `GitHub` → `https://github.com/subhaan0804`

---

## SECTION: Social Links

```json
"social": {
  "github": "https://github.com/subhaan0804",
  "linkedin": "https://www.linkedin.com/in/subhaan-shaikh-38532b286/",
  "twitter": "https://twitter.com/Subhaan_0804",
  "leetcode": "https://leetcode.com/subhaan0804",
  "hackerrank": "https://hackerrank.com/subhaan0804",
  "email": "subhaan0804@gmail.com"
}
```

---

## SECTION: About

**Short bio (3–4 lines, no fluff):**
> I'm a third-year Computer Engineering student at VCET, Vasai (Mumbai University), currently interning at DeepLogic AI where I work on production document processing pipelines, e-invoicing validation, and backend microservices. I'm drawn to systems where correctness and performance both matter — which is why I'm learning Rust alongside my day-to-day Python and JavaScript work.
>
> Outside of the internship, I build civic tech, AI-powered tools, and have competed in 6+ hackathons across Maharashtra. I run CachyOS (Arch-based) as my daily driver, contribute to open source tooling, and care deeply about how systems actually work under the hood — not just that they work.

**Philosophy statement (one line, displayed as a callout):**
> "I pick tools for correctness and performance — not hype. That's why I'm learning Rust."

---

## SECTION: Experience

### 1. DeepLogic AI
```json
{
  "company": "DeepLogic AI",
  "role": "Software Development Intern",
  "type": "internship",
  "location": "Delhi, India (Remote)",
  "period": "December 2024 – Present",
  "current": true,
  "bullets": [
    "Building production document processing pipelines for ZUGFeRD/Factur-X e-invoicing standards (EN 16931, German BR rules, French CIUS-FR/EXTENDED-CTC-FR/DGFiP specs) — XML validation, PDF extraction, and multi-country compliance logic",
    "Developed DocRadar — a PDF template-matching algorithm using IoU/Dice scoring with SQLite persistence and PyMuPDF optimizations for high-accuracy document classification",
    "Architected internal engineering tools and backend microservices with senior engineers; implemented API documentation, automated code-review processes, and security protocols",
    "Built task orchestration and automation frameworks for complex backend workflows; engineered code obfuscation and minification strategies for secure IP protection in on-premises enterprise deployments",
    "Set up and managed a Kubernetes/KEDA monitoring stack (Grafana + InfluxDB) for autoscaling LLM query services; learned K8s via minikube, HPA, Ingress, PVC, and load testing with k6",
    "Authored a custom fps_watcher.py systemd service that auto-routes DeepLogic downloads based on file patterns"
  ],
  "tags": ["Python", "FastAPI", "Kubernetes", "KEDA", "XML", "PDF", "Docker", "systemd", "SQLite", "PyMuPDF"]
}
```

### 2. Aspiring Media Tech Pvt Ltd.
```json
{
  "company": "Aspiring Media Tech Pvt Ltd.",
  "role": "Software Development Intern",
  "type": "internship",
  "location": "Vasai, Maharashtra (Offsite)",
  "period": "June 2024 – August 2024",
  "current": false,
  "bullets": [
    "Built a unified cross-platform push notification API integrating Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNs) for Android, iOS, and Web",
    "Designed and integrated a client grading system with Weighted Recency Scoring algorithm",
    "Configured Linux server environments and Docker containers for automation",
    "Integrated and certified third-party logistics APIs (FedEx, DHL) for production-ready shipping and tracking",
    "Built frontend components in Vue.js for internal dashboard interfaces"
  ],
  "tags": ["Node.js", "Vue.js", "Firebase", "Docker", "Linux", "REST APIs"]
}
```

---

## SECTION: Projects

### Featured Projects (large cards)

#### 1. HealthEasy — AI-Powered Healthcare Ecosystem
```json
{
  "title": "HealthEasy",
  "subtitle": "AI-Powered Healthcare Ecosystem",
  "featured": true,
  "period": "April 2026",
  "problem": "Healthcare professionals need fast, AI-assisted clinical decisions without compromising patient data privacy.",
  "description": "Full-stack hospital management system with RAG-based clinical assistant, voice-to-text prescriptions, drug interaction checker, dosage calculator, and chest X-ray ML analysis with local GPU inference. Built across web (React) and mobile (Expo React Native) with a Convex BaaS backend and real-time data access. Patient data stays on-device via Tailscale VPN tunnel — no cloud exposure for sensitive records. Evaluated retrieval quality across 5 RAGAS metrics (Faithfulness, Answer Relevancy, Context Precision, Context Recall, Answer Correctness) to benchmark production readiness.",
  "deepDive": [
    "Chose local GPU inference over cloud APIs to ensure patient data never leaves the device — HIPAA-aligned by design",
    "Used Tailscale to create an end-to-end encrypted VPN tunnel between the inference server and clients — zero open ports",
    "RAGAS evaluation pipeline benchmarked the RAG system before any clinical demo — not as an afterthought",
    "ChromaDB vector store with semantic chunking for medical document retrieval"
  ],
  "tags": ["FastAPI", "React", "Expo", "Convex", "ChromaDB", "RAG", "LangChain", "RAGAS", "Tailscale", "AWS S3", "Python", "Ollama"],
  "github": "https://github.com/subhaan0804",
  "live": ""
}
```

#### 2. Civic Grievance Platform *(in progress)*
```json
{
  "title": "Civic Grievance Platform",
  "subtitle": "Geo-tagged Issue Routing for Indian Municipalities",
  "featured": true,
  "period": "2026 – Present",
  "problem": "Public complaints about potholes, sewage, and civic issues in India have no reliable routing to the correct authority — they fall into generic portals and get lost.",
  "description": "Rule-based grievance routing engine that maps geo-tagged citizen reports (pothole, sewage, public infrastructure) to the correct municipal, district, or state authority using PostGIS jurisdiction polygons loaded with Maharashtra and Palghar district data. AI acts as a tiebreaker when jurisdiction boundaries overlap — not the primary router. Geospatial backend already live with PostgreSQL/PostGIS.",
  "deepDive": [
    "Chose PostGIS over simple lat/lng lookup because jurisdiction boundaries are polygons, not points — a pothole 2m across a border needs to go to the right ward",
    "Rule-based routing first — AI only invoked as tiebreaker for boundary-overlap cases, keeping inference costs near zero for 90%+ of complaints",
    "Palghar district and Maharashtra jurisdiction polygon data loaded and indexed",
    "Designed routing engine to be extensible across all Indian states — not Maharashtra-only"
  ],
  "tags": ["Python", "FastAPI", "PostgreSQL", "PostGIS", "Docker", "GIS", "REST API"],
  "github": "https://github.com/subhaan0804",
  "live": "",
  "wip": true
}
```

### Standard Projects (regular cards)

#### 3. CampusEasy — Unified AI-Driven Academic Ecosystem
```json
{
  "title": "CampusEasy",
  "subtitle": "Agentic Academic Platform — Codeverse 3.0",
  "featured": false,
  "period": "January 2026",
  "hackathon": "Codeverse 3.0 — Top 10 Finish",
  "description": "Cross-platform SaaS ecosystem centralizing fragmented institutional data (notices, marks, deadlines) across Android, iOS, and Web. Agentic voice RAG system using LangChain and FastAPI lets students query institutional data via natural language. Anti-spoof attendance with 6-second QR refresh + DeviceID tracking. Local LLM inference via Ollama for institutional deployment without cloud dependency.",
  "tags": ["FastAPI", "LangChain", "Ollama", "React Native", "Expo", "Convex", "Firebase", "Clerk", "RAG"],
  "github": "https://github.com/subhaan0804"
}
```

#### 4. KrushiNet — Digital Farmers Marketplace
```json
{
  "title": "KrushiNet",
  "subtitle": "Farmers Marketplace — Techathon 2.0",
  "featured": false,
  "period": "February 2025",
  "hackathon": "InnovateYou Techathon 2.0 — National Round 2",
  "description": "Full-stack agricultural marketplace with real-time commodity price APIs (government data), MongoDB inventory management, and Cloudinary image uploads for product catalogs. JWT + Bcrypt auth. Built under 24-hour hackathon constraints to production-ready quality — advanced to National Round 2.",
  "tags": ["Node.js", "Express.js", "MongoDB", "Cloudinary", "JWT", "REST API"],
  "github": "https://github.com/subhaan0804"
}
```

#### 5. EVI — Electronic Verification Interface
```json
{
  "title": "EVI",
  "subtitle": "Document Verification System — Codeverse 2.0",
  "featured": false,
  "period": "October 2024",
  "hackathon": "Codeverse 2.0 — Top 10 Finish",
  "description": "Automated credential verification pipeline using Tesseract.js OCR for image-based extraction and PDF Parse for document handling. Validates educational certificates, work experience proofs, and qualifications in real-time. Structured audit logs for compliance. Significantly reduced manual review effort in recruitment pipelines.",
  "tags": ["Node.js", "Express.js", "MongoDB", "Tesseract.js", "OCR", "PDF"],
  "github": "https://github.com/subhaan0804"
}
```

#### 6. Planeta — Eco-Tourism Platform
```json
{
  "title": "Planeta",
  "subtitle": "Sustainable Tourism App — BitNBuild 2024",
  "featured": false,
  "period": "November 2024",
  "hackathon": "BitNBuild Around The World — State Finalist",
  "description": "Eco-tourism platform with carbon emission calculator across multiple transport modes (flights, cars, ships, trains), interactive eco-certified hotel discovery via Leaflet.js maps, and verified carbon offset marketplace. Built with Node.js/Express + MongoDB. State-level finalist.",
  "tags": ["Node.js", "Express.js", "MongoDB", "Leaflet.js", "OpenCage API", "bcrypt"],
  "github": "https://github.com/subhaan0804"
}
```

#### 7. Stealth Android Network Blocker
```json
{
  "title": "Android Network Blocker",
  "subtitle": "Stealth DNS-based VPN App",
  "featured": false,
  "period": "2025",
  "description": "Stealth Android app built in Kotlin using VpnService and DNS-only architecture. Blocks network traffic at the DNS level without root access. Includes a Learn Mode that observes app traffic patterns before enforcing rules. No UI visible in recent apps — designed for silent background operation.",
  "tags": ["Kotlin", "Android", "VpnService", "DNS", "Systems"],
  "github": "https://github.com/subhaan0804"
}
```

#### 8. Chrome Extension — CCR (Content Character Replacement)
```json
{
  "title": "CCR Chrome Extension",
  "subtitle": "Content Character Replacement for SPAs",
  "featured": false,
  "period": "2025",
  "description": "Chrome extension fixing \\u0001 control character rendering issues on an internal enterprise dashboard (DeepLogic). Built with MutationObserver to catch dynamically injected content and SPA navigation handling via History API — works across React/Vue SPAs without page reload triggers. Shipped to production internal use.",
  "tags": ["JavaScript", "Chrome Extension", "MutationObserver", "SPA"],
  "github": ""
}
```

#### 9. Marketplace — E-commerce Platform
```json
{
  "title": "Marketplace",
  "subtitle": "Cross-Platform E-commerce System",
  "featured": false,
  "period": "2025",
  "description": "Modular e-commerce marketplace with web (React + Vite), mobile (Flutter/Dart), and backend (Node.js/Express) layers. Fuzzy search with autocomplete for product discovery. Controller-Service-Route architecture with custom middleware for auth and validation. Consistent UX across iOS, Android, Desktop, and Web.",
  "tags": ["React", "Flutter", "Dart", "Node.js", "Express.js", "Vite", "JavaScript"],
  "github": "https://github.com/subhaan0804"
}
```

---

## SECTION: Skills

**Grouped by layer — no progress bars, no percentages.**

```json
"skills": {
  "Systems & Languages": ["Python", "JavaScript", "TypeScript", "C/C++", "Java", "SQL", "Rust (learning)", "Bash"],
  "Backend & APIs": ["FastAPI", "Node.js", "Express.js", "REST APIs", "XML/e-invoicing (ZUGFeRD, Factur-X)", "JWT", "WebSockets"],
  "Data & Storage": ["PostgreSQL", "PostGIS", "MongoDB", "MySQL", "Oracle PL/SQL", "ChromaDB", "Pinecone", "Redis", "SQLite"],
  "AI & ML": ["RAG", "LangChain", "Ollama", "HuggingFace", "RAGAS", "ChromaDB", "Local LLM Inference"],
  "DevOps & Cloud": ["Docker", "Kubernetes", "KEDA", "Helm", "GitHub Actions (CI/CD)", "AWS", "GCP", "Vercel", "Netlify", "Cloudflare", "Tailscale", "systemd", "minikube"],
  "Frontend": ["React.js", "React Native (Expo)", "Vue.js", "Flutter", "Tailwind CSS", "HTML/CSS/JS"],
  "Tools & Platforms": ["Git/GitHub", "Postman", "Figma", "Power BI", "VS Code", "PyMuPDF", "Convex", "Firebase", "Adobe Suite", "uv", "pyenv", "paru"]
}
```

**Systems & OS Experience** *(display as a subtle callout or timeline, not a skill group)*:
- **CachyOS (Arch-based)** — current daily driver, KDE Plasma, Fish shell, i3 10th Gen + RX 550 GPU desktop
- **Ubuntu / Debian** — server environments, Docker, Kubernetes (minikube), Linux sysadmin work
- **Windows 11** — secondary laptop, development via WSL; set up lan-mouse for KVM sharing between desktop and laptop
- **Embedded** — ESP32 (hardware projects, drone assembly)

*Subtext to display under this callout:*
> Comfortable at every layer — from systemd services and EFI partition repair to Kubernetes KEDA autoscalers and cloud deployments.

---

## SECTION: Education

```json
"education": [
  {
    "institution": "Vidyavardhini's College of Engineering & Technology (VCET)",
    "degree": "B.E. Computer Engineering (DSE — Lateral Entry)",
    "location": "Vasai, Mumbai",
    "period": "2024 – Present",
    "note": "Third Year via Direct Second Year Entry (DSE) — Mumbai University"
  },
  {
    "institution": "Bhausaheb Vartak Polytechnic",
    "degree": "Diploma in Computer Engineering",
    "location": "Vasai, Mumbai",
    "period": "August 2023 – May 2026",
    "aggregate": "98.00% in 5th Semester — 1st Rank in College (two consecutive semesters)",
    "highlight": true
  },
  {
    "institution": "Utkarsha Vidyalaya",
    "degree": "Secondary Education (Class 10th)",
    "location": "Virar, Mumbai",
    "period": "March 2023",
    "aggregate": "96.20%"
  }
]
```

---

## SECTION: Achievements / Highlights

*Display as a compact stat-strip or highlight cards below hero or in About section.*

```json
"achievements": [
  {
    "label": "1st Rank in College",
    "detail": "Two consecutive semesters — 98.00% in 5th Semester Diploma"
  },
  {
    "label": "6+ Hackathons",
    "detail": "Top 10 finishes at Codeverse 2.0, 3.0 | State Finalist at BitNBuild | National Round at Techathon 2.0"
  },
  {
    "label": "HackerRank Global Rank 2434",
    "detail": "Mathematics Problem Solving — Indian Rank 1195"
  },
  {
    "label": "70+ LeetCode Problems",
    "detail": "Data Structures & Algorithms — C, C++, JavaScript"
  },
  {
    "label": "MSBTE State Finalist",
    "detail": "Selected from 80+ college projects — recommended for SaaS commercialization by state-level judges"
  },
  {
    "label": "Judge Appreciation",
    "detail": "MEGAHACK 6.0, HackCelestial 2.0, InnovateYou Techathon 2.0 (Pune)"
  }
]
```

---

## SECTION: Hackathons

```json
"hackathons": [
  {
    "name": "Codeverse 3.0",
    "result": "Top 10 Finish",
    "project": "CampusEasy",
    "year": "2026",
    "tags": ["FastAPI", "RAG", "Ollama", "React Native"]
  },
  {
    "name": "InnovateYou Techathon 2.0",
    "result": "National Round 2 + Judge Appreciation",
    "project": "KrushiNet",
    "year": "2025",
    "tags": ["Node.js", "MongoDB", "REST API"]
  },
  {
    "name": "BitNBuild Around The World",
    "result": "State-Level Finalist",
    "project": "Planeta",
    "year": "2024",
    "tags": ["Node.js", "Leaflet.js", "MongoDB"]
  },
  {
    "name": "Codeverse 2.0",
    "result": "Top 10 Finish",
    "project": "EVI",
    "year": "2024",
    "tags": ["Node.js", "Tesseract.js", "OCR"]
  },
  {
    "name": "MEGAHACK 6.0",
    "result": "Judge Appreciation",
    "project": "",
    "year": "2024",
    "tags": []
  },
  {
    "name": "HackCelestial 2.0",
    "result": "Judge Appreciation",
    "project": "",
    "year": "2024",
    "tags": []
  }
]
```

---

## SECTION: Architecture Diagram

**Project to diagram:** Civic Grievance Platform  
**Reason:** Best demonstrates systems thinking — geospatial backend, rule engine, AI tiebreaker, authority routing.

**Diagram nodes (left → right flow):**
```
[Citizen App]
    ↓ POST /report {lat, lng, category, description}
[FastAPI Backend]
    ↓ Geo query
[PostGIS / PostgreSQL]
    ↓ Jurisdiction polygon lookup
[Rule Engine]
    ├── Clear match → [Authority Router]
    └── Boundary overlap → [AI Tiebreaker (LLM)]
                               ↓
                        [Authority Router]
                               ↓
        ┌──────────────────────────────────┐
        │  Municipal │  District │  State  │
        └──────────────────────────────────┘
```

**Annotation labels to add on diagram:**
- On PostGIS node: `Maharashtra + Palghar jurisdiction polygons loaded`
- On Rule Engine: `90%+ complaints resolved here — zero AI cost`
- On AI Tiebreaker: `Invoked only on boundary overlaps`

---

## SECTION: Contact

```json
"contact": {
  "email": "subhaan0804@gmail.com",
  "location": "Virar, Mumbai, India",
  "timezone": "IST (UTC+5:30)",
  "note": "Available for internships, backend/systems roles, and open source collaboration."
}
```

**No contact form.** Email link only + social icons.  
Social icons to show: GitHub, LinkedIn, Twitter, LeetCode, HackerRank.

---

## SECTION: Certifications

*Demoted section — compact horizontal scroll or accordion. Not a showcase.*

```json
"certifications": [
  { "title": "Advanced Microsoft Excel", "issuer": "Microsoft Certified Trainer — Jatan Shah", "type": "course" },
  { "title": "Microsoft Power BI", "issuer": "Microsoft Certified Trainer — Jatan Shah", "type": "course" },
  { "title": "2nd Place — All India Calendar Art Competition", "issuer": "Faber Castell", "type": "competition" },
  { "title": "15th — Maharashtra State English Marathon", "issuer": "State Level", "type": "competition" },
  { "title": "1st — School Level English Marathon", "issuer": "School Level", "type": "competition" },
  { "title": "20th — MPSP Maharashtra State", "issuer": "State Level", "type": "competition" }
]
```

*Note to agent: Do NOT display MPSP rank 72nd, 150th, or the duplicate English Marathon entries — they dilute the section. Show only the best ranks.*

---

## SECTION: Meta Tags Content (for SEO)

```html
<!-- Primary -->
<title>Subhaan Shaikh — Backend & Systems Engineer</title>
<meta name="description" content="Subhaan Shaikh is a Backend & Systems Engineer from Mumbai, India. Building document pipelines, cloud-native infrastructure, and civic tech. Software Dev Intern at DeepLogic AI. Computer Engineering student at VCET.">
<meta name="keywords" content="Subhaan Shaikh, backend developer, software engineer, Mumbai, India, Python, FastAPI, DevOps, Kubernetes, systems engineer, VCET, DeepLogic AI">
<meta name="author" content="Subhaan Shaikh">

<!-- Open Graph -->
<meta property="og:title" content="Subhaan Shaikh — Backend & Systems Engineer">
<meta property="og:description" content="Building reliable backend systems, document pipelines, and cloud-native infrastructure. Interning at DeepLogic AI. Based in Mumbai, India.">
<meta property="og:image" content="https://[domain]/assets/images/og-image.png">

<!-- Twitter -->
<meta name="twitter:title" content="Subhaan Shaikh — Backend & Systems Engineer">
<meta name="twitter:description" content="Backend & Systems Engineer | DeepLogic AI Intern | Mumbai">
```

**OG Image design brief** (for creation separately):
- Background: dark (`#0d1117` or similar)
- Left: Name in bold white, title in muted accent color
- Right: compact tech stack tags — Python, FastAPI, Kubernetes, PostGIS, Rust
- Bottom right: domain URL
- Size: 1200×630px

---

## SECTION: Footer

```
Copyright © Subhaan Shaikh, 2026. All rights reserved.
```

- Remove "Open on desktop for better experience" entirely
- Add: `Built with vanilla HTML/CSS/JS — no framework needed.` *(subtle, small text — signals intentional choice)*
- Last updated: auto-generated from build date or `data.json` field

---

## CONTENT DECISIONS — Notes for Agent

| Decision | Rationale |
|----------|-----------|
| Title: "Backend & Systems Engineer" not "Full Stack" | Differentiates from generic profiles; signals depth over breadth |
| No GFX Design / Services section | Irrelevant to engineering hiring context |
| MS Office certs not featured | Do not remove from JSON but do not render prominently |
| Rust listed as "learning" | Honest signal — more valuable than pretending proficiency |
| No contact form | Maintenance overhead, spam risk — mailto is sufficient |
| Architecture diagram for Civic Platform | Strongest systems-thinking signal across all projects |
| RAGAS evaluation called out explicitly | Shows production mindset — most students skip evaluation |
| OS/systems callout in About | Rare differentiator — sysadmin + K8s + EFI repair level comfort signals genuine systems engineer |
| DeepLogic bullets focus on real work | ZUGFeRD/Factur-X, DocRadar, KEDA stack — not generic "architected microservices" language |

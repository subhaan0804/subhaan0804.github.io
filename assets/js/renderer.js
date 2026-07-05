/**
 * Reads data.json and renders portfolio sections into the DOM.
 */
const PortfolioRenderer = (() => {
  const SITE_URL = 'https://subhaan0804.github.io/';

  function companyInitialSvg(name) {
    const initial = (name || '?')[0].toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="6" fill="#1e2d40"/><text x="20" y="27" text-anchor="middle" font-family="monospace" font-size="18" font-weight="bold" fill="#f4d35e">${initial}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (key === 'className') {
        node.className = value;
      } else if (key === 'text') {
        node.textContent = value;
      } else if (key === 'html') {
        node.innerHTML = value;
      } else if (key === 'hidden') {
        node.hidden = value;
      } else {
        node.setAttribute(key, value);
      }
    });
    children.flat().forEach((child) => {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function renderTags(tags, className = 'tag') {
    return (tags || []).map((tag) => el('span', { className, text: tag }));
  }

  function pictureImage(imagePath, alt, { width = '200', height = '140', lazy = true, decoding = 'async' } = {}) {
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return el('picture', {}, [
      el('source', { srcset: webpPath, type: 'image/webp' }),
      el('img', { src: imagePath, alt, loading: lazy ? 'lazy' : 'eager', decoding, width, height }),
    ]);
  }

  function renderTerminalMock() {
    const lines = [
      { cmd: true,  text: '$ kubectl get pods -n production' },
      { cmd: false, text: 'api-gateway    3/3   Running   0   2d' },
      { cmd: false, text: 'worker-queue   2/2   Running   0   2d' },
      { cmd: false, text: 'doc-parser     1/1   Running   0   6h' },
      { cmd: true,  text: '$ python -m uvicorn main:app --reload' },
      { cmd: false, text: 'INFO: Uvicorn running on :8000' },
      { cmd: false, text: 'INFO: Application startup complete.' },
      { cmd: true,  text: '$ git log --oneline -3' },
      { cmd: false, text: 'a3f21bc feat: ZUGFeRD e-invoice parser' },
      { cmd: false, text: '9c4d8e1 fix: K8s HPA memory threshold' },
    ];

    return el('div', { className: 'terminal-mock', 'aria-hidden': 'true' }, [
      el('div', { className: 'terminal-bar' }, [
        el('span', { className: 'terminal-dot terminal-dot--red' }),
        el('span', { className: 'terminal-dot terminal-dot--yellow' }),
        el('span', { className: 'terminal-dot terminal-dot--green' }),
        el('span', { className: 'terminal-title', text: 'subhaan@dev  ~  zsh' }),
      ]),
      el('pre', { className: 'terminal-body' }, [
        ...lines.map(l => {
          let content = l.text;
          if (l.cmd) {
            const parts = l.text.split(' ');
            if (parts.length >= 2) {
              const prompt = parts[0];
              const cmd = parts[1];
              const args = parts.slice(2).join(' ');
              content = `<span class="term-prompt">${prompt}</span><span class="term-cmd">${cmd}</span> <span class="term-args">${args}</span>`;
            }
          } else if (l.text.startsWith('INFO:')) {
            content = `<span class="term-info">INFO:</span>${l.text.substring(5)}`;
          } else if (/^[a-f0-9]{7} /.test(l.text)) {
            const hash = l.text.substring(0, 7);
            const rest = l.text.substring(7);
            content = `<span class="term-hash">${hash}</span>${rest}`;
          }
          return el('code', { className: `terminal-line${l.cmd ? '' : ' terminal-output'}`, html: content });
        }),
        el('span', { className: 'terminal-cursor' }),
      ]),
    ]);
  }

  function renderArchitectureDiagram(architecture) {
    if (!architecture?.steps?.length) return null;

    const steps = architecture.steps;
    const boxW = 108;
    const boxH = 44;
    const gap = 36;
    const padX = 24;
    const padY = 36;
    const width = padX * 2 + steps.length * boxW + (steps.length - 1) * gap;
    const height = padY * 2 + boxH + 20;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'arch-diagram');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', architecture.title || 'Architecture diagram');

    steps.forEach((label, i) => {
      const x = padX + i * (boxW + gap);
      const y = padY;

      if (i < steps.length - 1) {
        const line = document.createElementNS(svgNS, 'line');
        const x1 = x + boxW + 4;
        const x2 = x + boxW + gap - 4;
        const cy = y + boxH / 2;
        line.setAttribute('x1', x1);
        line.setAttribute('y1', cy);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', cy);
        line.setAttribute('class', 'arch-path');
        svg.appendChild(line);

        const head = document.createElementNS(svgNS, 'polygon');
        head.setAttribute(
          'points',
          `${x2},${cy} ${x2 - 8},${cy - 5} ${x2 - 8},${cy + 5}`
        );
        head.setAttribute('class', 'arch-arrow');
        svg.appendChild(head);
      }

      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', boxW);
      rect.setAttribute('height', boxH);
      rect.setAttribute('rx', '6');
      rect.setAttribute('class', 'arch-box');
      svg.appendChild(rect);

      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', x + boxW / 2);
      text.setAttribute('y', y + boxH / 2 + 5);
      text.setAttribute('class', 'arch-label');
      text.textContent = label;
      svg.appendChild(text);
    });

    return el('div', { className: 'arch-diagram-wrap reveal' }, [
      architecture.title ? el('h4', { className: 'arch-title', text: architecture.title }) : null,
      svg,
    ]);
  }

  function renderHeader(data) {
    const header = document.getElementById('site-header');
    if (!header) return;

    header.replaceChildren(
      el('nav', { className: 'navbar', 'aria-label': 'Main navigation' }, [
        el('a', { href: '#', className: 'nav-logo', 'aria-label': `${data.meta.name} — home` }, [
          el('span', { className: 'nav-logo-accent', 'aria-hidden': 'true', text: 'S' }),
          el('span', { 'aria-hidden': 'true', text: 'ubhaan' }),
          el('span', { className: 'nav-logo-dot', 'aria-hidden': 'true', text: '.' }),
        ]),
        el('ul', { id: 'sidebar', className: 'sidemenu' }, [
          el('li', { className: 'menu-close-item' }, [
            el('button', {
              type: 'button',
              className: 'menu-close',
              id: 'menu-close',
              'aria-label': 'Close menu',
              html: '&times;',
            }),
          ]),
          ...['Home', 'About', 'Experience', 'Projects', 'Skills', 'Education', 'Certifications', 'Hackathons', 'Contact'].map((label) => {
            const id = label.toLowerCase();
            return el('li', {}, [el('a', { href: id === 'home' ? '#' : `#${id}`, text: label })]);
          }),
        ]),
        el('button', {
          type: 'button',
          className: 'menu-toggle',
          id: 'menu-toggle',
          'aria-label': 'Open menu',
          html: '&#9776;',
        }),
      ])
    );
  }

  function renderHero(data) {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const { meta } = data;

    const cvBtn = meta.cvUrl ? el('a', {
      href: meta.cvUrl,
      className: 'cta-btn cta-fill',
      html: `${Icons.download} <span>Download CV</span>`,
      download: '',
    }) : null;

    hero.className = 'hero-section';
    hero.replaceChildren(
      el('div', { id: 'homepage-main' }, [
        el('div', { className: 'hero-aurora-ribbons' }, [
          el('div', { className: 'ribbon ribbon-1' }),
          el('div', { className: 'ribbon ribbon-2' }),
          el('div', { className: 'ribbon ribbon-3' }),
        ]),
        el('div', { className: 'hero-inner' }, [
          el('div', { className: 'homepage-header-text' }, [
            el('h1', { className: 'load-animation' }, [
              document.createTextNode("Hi, I'm "),
              el('span', { text: meta.name }),
            ]),
            el('h2', { className: 'load-animation hero-role' }, [
              el('span', {
                id: 'role-cycle',
                className: 'role-cycle typewriter-text',
                'data-roles': (meta.roles || []).join('|'),
                text: (meta.roles || [meta.title])[0] || meta.title,
              }),
            ]),
            el('p', { className: 'hero-tagline load-animation', text: meta.tagline }),
            el('div', { className: 'hero-ctas' }, [
              cvBtn,
            ]),
          ]),
          el('div', { id: 'hero-lottie', className: 'hero-visual' }, [
            el('div', { id: 'hero-lottie-canvas', className: 'hero-lottie-canvas' }),
            renderTerminalMock(),
          ]),
        ]),
      ])
    );
  }

  function renderAchievements(data) {
    const section = document.getElementById('achievements');
    if (!section || !(data.achievements || []).length) return;

    section.replaceChildren(
      el('div', { className: 'achievement-strip reveal' },
        data.achievements.map((item) => {
          const prefix = item.prefix || '';
          const suffix = item.suffix || '';
          const hasStat = item.stat !== null && item.stat !== undefined;

          const statEl = hasStat
            ? el('div', { className: 'achievement-stat' }, [
                el('span', {
                  className: 'achievement-number',
                  'data-count-to': String(item.stat),
                  'data-prefix': prefix,
                  'data-suffix': suffix,
                  text: prefix + item.stat + suffix,
                }),
              ])
            : el('div', { className: 'achievement-stat achievement-stat--text' }, [
                el('span', { className: 'achievement-number', text: item.label }),
              ]);

          return el('div', { className: 'achievement-item' }, [
            statEl,
            el('p', { className: 'achievement-label', text: hasStat ? item.label : item.detail }),
            hasStat ? el('p', { className: 'achievement-detail', text: item.detail }) : null,
          ]);
        })
      )
    );
  }  function initProfileMorph(canvas, crispA, crispB, items) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let images = [], loadedCount = 0;
    let particles = [], state = 'IDLE', progress = 0, width, height;
    let currentIndex = 0, nextIndex = 1;
    const CONFIG = {
      targetParticleCount: 12000, minSampleGap: 3, maxParticleSize: 1.5,
      dispMin: 28, dispMax: 60, alphaThreshold: 12
    };

    function resize() {
      width = 800; height = 800;
      canvas.width = width; canvas.height = height; return true;
    }

    function drawCover(targetCtx, img, dx, dy, dw, dh) {
      if(!img.complete || img.naturalWidth === 0) return;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const imgRatio = iw / ih, rectRatio = dw / dh;
      let sx, sy, sw, sh;
      if (imgRatio > rectRatio) { sh = ih; sw = ih * rectRatio; sx = (iw - sw) / 2; sy = 0; } 
      else { sw = iw; sh = iw / rectRatio; sx = 0; sy = (ih - sh) / 2; }
      targetCtx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    class Grain {
      constructor(x, y, rA, gA, bA, aA, rB, gB, bB, aB) {
        this.x = x; this.y = y; this.rA = rA; this.gA = gA; this.bA = bA; this.aA = aA / 255;
        this.rB = rB; this.gB = gB; this.bB = bB; this.aB = aB / 255;
        const angle = Math.random() * Math.PI * 2;
        const mag = CONFIG.dispMin + Math.random() * (CONFIG.dispMax - CONFIG.dispMin);
        this.dx = Math.cos(angle) * mag + (Math.random() - 0.3) * 10;
        this.dy = Math.sin(angle) * mag + (Math.random() - 0.6) * 10;
        const tierRoll = Math.random();
        const tierMul = tierRoll < 0.34 ? 1.0 : (tierRoll < 0.67 ? 0.8 : 0.6);
        this.size = CONFIG.maxParticleSize * tierMul * (0.92 + Math.random() * 0.08);
        this.timeOffsetFrac = (Math.random() - 0.5) * 0.16;

        const nx = Math.abs((x - width / 2) / (width / 2));
        const ny = Math.abs((y - height / 2) / (height / 2));
        // Form an oval mapping to the user's red marked area (roughly 55% width, 70% height)
        const coreDist = Math.sqrt(Math.pow(nx / 0.55, 2) + Math.pow(ny / 0.70, 2));
        
        if (coreDist <= 1.0) {
          this.distFade = 1.0;
        } else {
          // Fade drops drastically and smoothly hits exactly 0% before reaching the furthest corners
          let fade = 1.0 / Math.pow(1.0 + (coreDist - 1.0) * 3.0, 2);
          fade = (fade - 0.05) / 0.95;
          this.distFade = fade < 0 ? 0 : fade;
        }

        // Guarantee exactly 0% at the extreme top/bottom/left/right edges
        const edgeMargin = Math.min(1.0 - nx, 1.0 - ny);
        let edgeFade = Math.min(1, Math.max(0, edgeMargin / 0.15));
        edgeFade = edgeFade * edgeFade * (3 - 2 * edgeFade); // smoothstep
        this.distFade *= edgeFade;
      }
    }

    function buildParticles() {
      const imgA = images[currentIndex], imgB = images[nextIndex];
      if (!imgA || !imgB || !imgA.complete || !imgB.complete || width <= 0 || height <= 0) return;
      const offA = document.createElement('canvas'); offA.width = width; offA.height = height;
      const offB = document.createElement('canvas'); offB.width = width; offB.height = height;
      const actxA = offA.getContext('2d'), actxB = offB.getContext('2d');
      drawCover(actxA, imgA, 0, 0, width, height); drawCover(actxB, imgB, 0, 0, width, height);
      const dataA = actxA.getImageData(0, 0, width, height).data;
      const dataB = actxB.getImageData(0, 0, width, height).data;
      const pts = [], gap = Math.max(CONFIG.minSampleGap, Math.sqrt((width * height) / CONFIG.targetParticleCount));
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          const aA = dataA[idx + 3], aB = dataB[idx + 3];
          if (aA > CONFIG.alphaThreshold || aB > CONFIG.alphaThreshold) {
            pts.push(new Grain(x + (Math.random() - 0.5) * gap * 0.7, y + (Math.random() - 0.5) * gap * 0.7, dataA[idx], dataA[idx+1], dataA[idx+2], aA, dataB[idx], dataB[idx+1], dataB[idx+2], aB));
          }
        }
      }
      particles = pts;
    }

    function smoothstep(e0, e1, x){ const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }

    function drawParticles(t, particleOp) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let pt = t - p.timeOffsetFrac; if (pt < 0) pt = 0; else if (pt > 1) pt = 1;
        const bump = Math.sin(Math.PI * pt), eased = pt < 0.5 ? 4 * pt * pt * pt : 1 - Math.pow(-2 * pt + 2, 3) / 2;
        let r = p.rA + (p.rB - p.rA)*eased, g = p.gA + (p.gB - p.gA)*eased, b = p.bA + (p.bB - p.bA)*eased, a = p.aA + (p.aB - p.aA)*eased;
        const alpha = a * particleOp * p.distFade;
        if (alpha > 0.02) {
          ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},${alpha})`;
          ctx.fillRect(p.x + p.dx * bump - p.size, p.y + p.dy * bump - p.size, p.size * 2, p.size * 2);
        }
      }
    }

    function renderFrame() {
      ctx.clearRect(0, 0, width, height);
      if (state === 'IDLE') { 
        crispA.style.opacity = 1;
        crispB.style.opacity = 0;
      } else {
        const crispOut = 1 - smoothstep(0, 0.16, progress), crispIn = smoothstep(1 - 0.16, 1, progress), particleOp = 1 - crispOut - crispIn;
        crispA.style.opacity = crispOut;
        crispB.style.opacity = crispIn;
        if (particleOp > 0.01) drawParticles(progress, particleOp);
      }
    }

    function checkLoad() { 
      loadedCount++; 
      if (loadedCount === items.length) { 
        if(resize()){ 
          crispA.src = items[currentIndex].img;
          document.getElementById('maskImageA').setAttribute('href', items[currentIndex].mask);
          renderFrame(); 
        } else { setTimeout(checkLoad, 100); loadedCount--; } 
      } 
    }

    items.forEach(item => {
      let img = new Image();
      img.onload = checkLoad;
      img.src = item.img;
      images.push(img);
    });

    let animId = null, animStartTime = 0;
    function animate(time) {
      if (!animStartTime) animStartTime = time;
      progress = Math.min((time - animStartTime) / 2000, 1);
      renderFrame();
      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        currentIndex = nextIndex;
        state = 'IDLE';
        crispA.src = items[currentIndex].img;
        document.getElementById('maskImageA').setAttribute('href', items[currentIndex].mask);
        crispA.style.opacity = 1;
        crispB.style.opacity = 0;
      }
    }

    return {
      triggerMorph: () => {
        if (state !== 'IDLE' || images.length < 2) return;
        state = 'MORPHING'; 
        nextIndex = (currentIndex + 1) % images.length;
        crispB.src = items[nextIndex].img;
        document.getElementById('maskImageB').setAttribute('href', items[nextIndex].mask);
        progress = 0; animStartTime = 0;
        if(animId) cancelAnimationFrame(animId);
        resize(); buildParticles();
        animId = requestAnimationFrame(animate);
      }
    };
  }

  function renderAbout(data) {
    const about = document.getElementById('about');
    if (!about) return;

    // Cinematic quote section quotes
    const quotes = [
      "A guy who codes. I started exploring systems before I even knew what an OS was.",
      "My earliest talent was drawing. Winning an All-India art competition shaped the way I see digital design today.",
      "I build things. Whether it's assembling drones with ESP32 or spinning up Kubernetes clusters.",
      "I love watching YouTube, diving deep into how Linux kernels work and how other people think.",
      "I learned to code when I realized the terminal is just a canvas with infinite possibilities.",
      "I play around with embedded hardware, mostly to feel the bridge between physical machines and pure logic.",
      "I am fascinated by systems: what happens under the hood when everything just works.",
      "Before my first line of code, there was art. That eye for detail never left me.",
      "When I am not building web apps, I'm probably ricing my CachyOS setup.",
      "Bhausaheb Vartak Polytechnic gave me the foundation; curiosity gave me the hunger."
    ];
    let currentQuote = 0;

    const quoteTextEl = el('h2', { className: 'quote-text reveal', text: quotes[currentQuote] });

    // "Another" button
    const nextBtn = el('button', { className: 'cta-btn cta-outline quote-next-btn reveal' }, [
      el('span', { innerHTML: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-15a9 9 0 019 9"/></svg>' }),
      el('span', { text: 'ANOTHER' })
    ]);

    nextBtn.onclick = () => {
      currentQuote = (currentQuote + 1) % quotes.length;
      if (window.gsap) {
        gsap.to(quoteTextEl, { opacity: 0, filter: 'blur(12px)', y: -10, duration: 0.21, onComplete: () => {
          quoteTextEl.textContent = quotes[currentQuote];
          gsap.fromTo(quoteTextEl, { opacity: 0, filter: 'blur(12px)', y: 10 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.35 });
        }});
      } else {
        quoteTextEl.textContent = quotes[currentQuote];
      }
    };

    about.className = ''; // Remove quote-section class from the wrapper to avoid full-screen stretching on the paragraphs
    
    const quoteBlock = el('div', { className: 'quote-section' }, [
      el('div', { className: 'quote-wave-bg' }),
      el('div', { className: 'quote-content' }, [
        el('div', { className: 'quote-eyebrow reveal', html: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> <span style="margin-left: 8px;">ABOUT</span>' }),
        quoteTextEl,
        nextBtn
      ])
    ]);

    // Restore original About Me content below the quote
    const paragraphs = (data.meta.about || '').split('\n\n').filter(Boolean);
    
    // Magic stick feature
    const magicStick = el('img', { 
      className: 'magic-stick', 
      src: 'assets/images/magic-stick.png'
    });
    
    const magicBtn = el('button', { 
      className: 'magic-btn', 
      text: 'Press'
    });
    
    const pointerHand = el('div', {
      className: 'pointer-hand',
      text: '👈'
    });

    const originalAboutBlock = el('div', { className: 'about-original-wrapper', style: 'padding-top: 5rem; padding-bottom: 2rem;' }, [
      el('div', { className: 'section-header' }, [
        el('h2', { className: 'sub-title', text: 'More About Me' }),
      ]),
      el('div', { className: 'about-grid reveal' }, [
        el('div', { className: 'about-content' }, [
          ...paragraphs.map((p) => el('p', { className: 'about-text', text: p })),
          data.meta.philosophy
            ? el('p', { className: 'philosophy', text: data.meta.philosophy })
            : null,
        ]),
        el('div', { className: 'about-right-column' }, [
          el('div', { html: `
            <svg width="0" height="0" style="position: absolute;">
              <filter id="invertMask">
                <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" />
                <feComponentTransfer>
                  <feFuncR type="linear" slope="1.5" intercept="-0.15" />
                  <feFuncG type="linear" slope="1.5" intercept="-0.15" />
                  <feFuncB type="linear" slope="1.5" intercept="-0.15" />
                </feComponentTransfer>
              </filter>
              <mask id="paintMaskA" maskContentUnits="objectBoundingBox">
                <image id="maskImageA" href="assets/images/paintsplash2.jpeg" width="1" height="1" preserveAspectRatio="xMidYMid meet" filter="url(#invertMask)" />
              </mask>
              <mask id="paintMaskB" maskContentUnits="objectBoundingBox">
                <image id="maskImageB" href="assets/images/paintsplash3.jpeg" width="1" height="1" preserveAspectRatio="xMidYMid meet" filter="url(#invertMask)" />
              </mask>
            </svg>
          ` }),
          el('div', { className: 'about-image-wrap' }, (() => {
            const placeholder = el('img', { src: 'assets/images/subhaanprofilephoto3.png', className: 'profile-placeholder' });
            const crispA = el('img', { className: 'profile-layer-a' });
            const crispB = el('img', { className: 'profile-layer-b' });
            const particleCanvas = el('canvas', { className: 'particle-layer' });
            
            const morphController = initProfileMorph(particleCanvas, crispA, crispB, [
              { img: 'assets/images/subhaanprofilephoto3.png', mask: 'assets/images/paintsplash2.jpeg' },
              { img: 'assets/images/subhaanprofilephoto.jpeg', mask: 'assets/images/paintsplash3.jpeg' }
            ]);
            
            magicBtn.onclick = () => {
              // Hide the pointer hand once clicked
              pointerHand.style.opacity = '0';
              if (window.gsap) {
                const tl = gsap.timeline();
                tl.to(magicStick, { rotation: -20, x: 10, y: 10, duration: 0.15 })
                  .to(magicStick, { rotation: -70, x: -30, y: -20, duration: 0.15, ease: "power2.in", onComplete: () => morphController.triggerMorph() })
                  .to(magicStick, { rotation: -45, x: 0, y: 0, duration: 0.15, ease: "power2.out" });
              }
            };
            
            return [
              placeholder,
              crispA,
              crispB,
              particleCanvas,
              magicStick,
            el('div', { className: 'top-stickers-row' }, [
              el('img', { src: 'assets/images/arch.png', alt: 'Arch Linux', className: 'sticker-big', onerror: "this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/archlinux/archlinux-original.svg'" }),
              el('img', { src: 'assets/images/windows11.png', alt: 'Windows 11', className: 'sticker-big' }),
              el('img', { src: 'assets/images/ubuntu.png', alt: 'Ubuntu', className: 'sticker-big' }),
              el('img', { src: 'assets/images/android.png', alt: 'Android', className: 'sticker-big' })
            ])
            ];
          })()),
          el('div', { className: 'magic-btn-container' }, [ magicBtn, pointerHand ])
        ])
      ])
    ]);

    about.replaceChildren(quoteBlock, originalAboutBlock);
  }

  function renderExperience(data) {
    const section = document.getElementById('experience');
    if (!section) return;

    const entries = data.experience || [];

    section.replaceChildren(
      el('div', { className: 'linkedin-card reveal' }, [
        el('div', { className: 'linkedin-card-header' }, [
          el('h2', { className: 'linkedin-card-title', text: 'Experience' })
        ]),
        entries.length
          ? el('div', { className: 'linkedin-experience-list' }, 
              entries.map((entry, index) => {
                const logoUrl = entry.logo || companyInitialSvg(entry.company);
                
                return el('article', { className: 'linkedin-exp-item' + (index < entries.length - 1 ? ' has-divider' : '') }, [
                  el('div', { className: 'linkedin-exp-logo-wrap' }, [
                    el('img', { className: 'linkedin-exp-logo', src: logoUrl, alt: `${entry.company} logo` })
                  ]),
                  el('div', { className: 'linkedin-exp-content' }, [
                    el('h3', { className: 'linkedin-exp-role', text: entry.role }),
                    el('p', { className: 'linkedin-exp-company', text: `${entry.company}${entry.type ? ' · ' + entry.type.charAt(0).toUpperCase() + entry.type.slice(1) : ''}` }),
                    el('p', { className: 'linkedin-exp-meta', text: entry.period }),
                    entry.location ? el('p', { className: 'linkedin-exp-meta', text: entry.location }) : null,
                    (entry.bullets || []).length
                      ? el('div', { className: 'linkedin-exp-description' }, 
                          entry.bullets.map((bullet) => el('p', { className: 'linkedin-bullet', text: `• ${bullet}` }))
                        )
                      : entry.description
                        ? el('div', { className: 'linkedin-exp-description' }, [el('p', { className: 'linkedin-bullet', text: entry.description })])
                        : null
                  ])
                ]);
              })
            )
          : el('p', { className: 'empty-state', text: 'Add experience entries in data.json.' })
      ])
    );
  }

  function inferProjectDomain(project) {
    const tags = project.tags || [];
    const aiTags = ['RAG', 'LangChain', 'LLM', 'Ollama', 'ChromaDB', 'RAGAS', 'HuggingFace'];
    const infraTags = ['Kubernetes', 'KEDA', 'PostGIS', 'GIS', 'systemd'];
    const androidTags = ['Kotlin', 'Android', 'VpnService'];
    if (tags.some(t => aiTags.includes(t))) return 'ai';
    if (tags.some(t => infraTags.includes(t))) return 'infra';
    if (tags.some(t => androidTags.includes(t))) return 'android';
    return 'web';
  }

  function projectDomainLabel(domain, project) {
    const tags = project.tags || [];
    if (domain === 'ai') return tags.includes('RAG') ? 'AI / ML · RAG' : 'AI / ML';
    if (domain === 'infra') return (tags.includes('PostGIS') || tags.includes('GIS')) ? 'Infrastructure · GIS' : 'Infrastructure · DevOps';
    if (domain === 'android') return 'Android · Systems';
    return 'Full Stack · Web';
  }

  function projectLinks(project) {
    const links = [];
    if (project.github) links.push(el('a', { href: project.github, className: 'project-link', html: `${Icons.github} GitHub`, target: '_blank', rel: 'noopener noreferrer' }));
    if (project.live)   links.push(el('a', { href: project.live,   className: 'project-link', html: `${Icons.external} Live`,   target: '_blank', rel: 'noopener noreferrer' }));
    return links;
  }

  function renderFeaturedProjectCard(project) {
    const domain = inferProjectDomain(project);
    const label  = projectDomainLabel(domain, project);
    const decisions = Array.isArray(project.deepDive) ? project.deepDive.slice(0, 3) : [];
    const hasArch = (project.architecture?.steps || []).length > 0;
    const links = projectLinks(project);

    const rightPanel = el('div', { className: 'pcf-right-panel' }, [
      el('p', { className: 'pcf-right-label', text: hasArch ? 'System Architecture' : 'Project Overview' }),
      hasArch
        ? renderArchitectureDiagram(project.architecture)
        : el('p', { className: 'pcf-desc', text: project.description }),
      hasArch && project.architecture.notes
        ? el('p', { className: 'pcf-arch-notes', text: project.architecture.notes })
        : null,
    ]);

    return el('article', {
      className: 'project-card-featured reveal',
      'data-tags': (project.tags || []).join(','),
      'data-domain': domain,
      'data-hackathon': project.hackathon ? 'true' : null,
    }, [
      el('div', { className: 'pcf-accent-bar' }),
      el('div', { className: 'pcf-inner' }, [
        el('div', { className: 'pcf-left' }, [
          el('div', { className: 'pcf-meta-row' }, [
            el('span', { className: `pcf-status-dot ${project.wip ? 'pcf-status-dot--wip' : 'pcf-status-dot--active'}` }),
            el('span', { className: 'pcf-domain-label', text: label }),
            el('span', { className: 'pcf-chip pcf-chip--featured', text: 'Featured' }),
            project.wip ? el('span', { className: 'pcf-chip pcf-chip--wip', text: 'WIP' }) : null,
          ]),
          el('h3', { className: 'pcf-title', text: project.title }),
          project.subtitle ? el('p', { className: 'pcf-subtitle', text: project.subtitle }) : null,
          project.problem  ? el('p', { className: 'pcf-problem',  text: project.problem  }) : null,
          decisions.length
            ? el('ul', { className: 'pcf-decisions' }, decisions.map(d => el('li', { text: d })))
            : null,
          el('div', { className: 'pcf-footer' }, [
            project.tags?.length ? el('div', { className: 'tag-list' }, renderTags(project.tags.slice(0, 5), 'tag tag-mono')) : null,
            links.length ? el('div', { className: 'pcf-links' }, links) : null,
          ]),
        ]),
        el('div', { className: 'pcf-right' }, [rightPanel]),
      ]),
    ]);
  }

  function renderRegularProjectCard(project) {
    const domain = inferProjectDomain(project);
    const label  = projectDomainLabel(domain, project);
    const links  = projectLinks(project);

    return el('article', {
      className: `project-card-v2 domain-${domain} reveal`,
      'data-tags': (project.tags || []).join(','),
      'data-domain': domain,
      'data-hackathon': project.hackathon ? 'true' : null,
    }, [
      el('div', { className: 'pcv2-body' }, [
        el('div', { className: 'pcv2-domain', text: label }),
        el('h3', { className: 'pcv2-title', text: project.title }),
        project.subtitle ? el('p', { className: 'pcv2-subtitle', text: project.subtitle }) : null,
        project.problem  ? el('p', { className: 'pcv2-problem',  text: project.problem  }) : null,
        project.hackathon
          ? el('div', { className: 'pcv2-hackathon-badge', html: `&#x1F3C6; ${project.hackathon}` })
          : null,
        el('div', { className: 'pcv2-footer' }, [
          project.tags?.length ? el('div', { className: 'tag-list' }, renderTags(project.tags.slice(0, 4), 'tag tag-mono')) : null,
          links.length ? el('div', { className: 'pcv2-links' }, links) : null,
        ]),
      ]),
    ]);
  }

  function renderProjects(data) {
    const section = document.getElementById('projects');
    if (!section) return;

    const projects = data.projects || [];
    const featured = projects.filter(p => p.featured);
    const regular  = projects.filter(p => !p.featured);

    section.replaceChildren(
      el('div', { className: 'section-header' }, [
        el('h2', { className: 'sub-title', text: 'Projects' }),
      ]),
      el('div', { className: 'project-filters', id: 'project-filters', 'aria-label': 'Filter projects by category' }),
      projects.length
        ? el('div', { className: 'projects-showcase', id: 'projects-grid' }, [
            featured.length ? el('div', { className: 'projects-featured-section' }, featured.map(renderFeaturedProjectCard)) : null,
            regular.length  ? el('div', { className: 'projects-regular-grid'    }, regular.map(renderRegularProjectCard))  : null,
          ])
        : el('p', { className: 'empty-state reveal', text: 'Add projects in data.json.' })
    );
  }

  function renderSkills(data) {
    const section = document.getElementById('skills');
    if (!section) return;

    const osExp = data.osExperience;

    section.replaceChildren(
      el('div', { className: 'linkedin-card reveal' }, [
        el('div', { className: 'linkedin-card-header' }, [
          el('h2', { className: 'linkedin-card-title', text: 'Skills' })
        ]),
        el('div', { style: 'padding: 0 24px 24px;' }, [
          el(
            'div',
            { className: 'linkedin-experience-list', style: 'margin-top: 16px;' },
            Object.entries(data.skills || {}).map(([category, items]) => {
              const iconHtml = `<img src="assets/images/geometry-abstract-simple.png" class="linkedin-exp-logo" alt="${category} icon">`;
              return el('div', { className: 'linkedin-exp-item' }, [
                el('div', { className: 'linkedin-exp-icon-wrap', html: iconHtml }),
                el('div', { className: 'linkedin-exp-content' }, [
                  el('h3', { className: 'linkedin-exp-title', text: category }),
                  el('p', { className: 'linkedin-exp-company', style: 'margin-top: 4px; line-height: 1.5;', text: items.join(' • ') }),
                ])
              ]);
            })
          ),
          osExp
            ? el('div', { className: 'os-callout', style: 'margin-top: 24px;' }, [
                el('p', { className: 'os-note', text: osExp.note }),
                el('div', { className: 'os-list' },
                  (osExp.systems || []).map((sys) =>
                    el('div', { className: 'os-item' }, [
                      el('strong', { className: 'os-name', text: sys.name }),
                      el('span', { className: 'os-detail', text: sys.detail }),
                    ])
                  )
                ),
              ])
            : null
        ])
      ])
    );
  }

  function renderEducation(data) {
    const section = document.getElementById('education');
    if (!section || !(data.education || []).length) return;

    const entries = data.education || [];

    section.replaceChildren(
      el('div', { className: 'linkedin-card reveal' }, [
        el('div', { className: 'linkedin-card-header' }, [
          el('h2', { className: 'linkedin-card-title', text: 'Education' })
        ]),
        entries.length
          ? el('div', { className: 'linkedin-experience-list' },
              entries.map((entry, index) => {
                const iconHtml = `<img src="${entry.logo || 'assets/images/geometry-abstract-simple.png'}" class="linkedin-exp-logo" alt="${entry.institution} icon">`;
                
                return el('article', { className: 'linkedin-exp-item' + (index < entries.length - 1 ? ' has-divider' : '') }, [
                  el('div', { className: 'linkedin-exp-logo-wrap', html: iconHtml }),
                  el('div', { className: 'linkedin-exp-content' }, [
                    el('h3', { className: 'linkedin-exp-role', text: entry.institution }),
                    el('p', { className: 'linkedin-exp-company', text: entry.degree }),
                    entry.period ? el('p', { className: 'linkedin-exp-meta', text: entry.period }) : null,
                    entry.location ? el('p', { className: 'linkedin-exp-meta', text: entry.location }) : null,
                    entry.description ? el('div', { className: 'linkedin-exp-description' }, [el('p', { className: 'linkedin-bullet', text: entry.description })]) : null
                  ])
                ]);
              })
            )
          : null
      ])
    );
  }

  function renderCertifications(data) {
    const section = document.getElementById('certifications');
    if (!section || !(data.certifications || []).length) return;

    section.className = '';

    const certs = data.certifications;
    const categories = ['All', ...new Set(certs.map(c => c.category).filter(Boolean))];

    const filterBar = el('div', {
      className: 'cert-filter-bar',
      role: 'group',
      'aria-label': 'Filter certifications by category',
    }, categories.map((cat, i) =>
      el('button', {
        type: 'button',
        className: `cert-filter-btn${i === 0 ? ' active' : ''}`,
        'data-cert-filter': cat,
        text: cat,
      })
    ));

    const certGrid = el('div', { className: 'cert-section-grid-simple', id: 'cert-grid' },
      certs.map((cert) =>
        el('article', {
          className: 'cert-card-simple reveal',
          'data-cert-category': cert.category || 'Other',
        }, [
          el('div', { className: 'cert-image-wrap' }, [
            el('img', { className: 'cert-image-bg', src: cert.image, alt: '' }),
            pictureImage(cert.image, cert.title)
          ]),
          el('div', { className: 'cert-content-simple' }, [
            el('div', { className: 'cert-meta-simple' }, [
              el('span', { className: 'cert-category-tag tag tag-mono', text: cert.category }),
              cert.year ? el('span', { className: 'cert-year-simple', text: cert.year }) : null,
            ]),
            el('h3', { className: 'cert-title-simple', text: cert.title }),
            cert.achievement ? el('p', { className: 'cert-achievement-simple', text: cert.achievement }) : null,
          ])
        ])
      )
    );

    section.replaceChildren(
      el('div', { className: 'section-header' }, [
        el('h2', { className: 'sub-title', text: 'Certifications' }),
      ]),
      filterBar,
      certGrid
    );
  }

  function renderHackathons(data) {
    const section = document.getElementById('hackathons');
    if (!section) return;

    const items = data.hackathons || [];
    section.hidden = !items.length;

    if (!items.length) return;

    let currentIndex = 0;

    const track = el('div', { className: 'hackathon-slider-track' },
      items.map((item) =>
        el('article', { className: 'hackathon-card-full reveal' }, [
          el('div', { className: 'hackathon-image-wrap' }, [
            el('img', { src: 'assets/images/hck-bg.jpg', alt: item.name })
          ]),
          el('div', { className: 'hackathon-content-wrap' }, [
            el('div', { className: 'hackathon-header-simple' }, [
              el('strong', { className: 'hackathon-title-simple', text: item.name }),
              item.year ? el('span', { className: 'hackathon-year-simple', text: item.year }) : null,
            ]),
            el('p', { className: 'hackathon-achievement-simple', text: item.result }),
            item.project
              ? el('p', { className: 'hackathon-project-simple', text: `Project: ${item.project}` })
              : null,
            item.tags?.length ? el('div', { className: 'tag-list', style: 'margin-top: auto; padding-top: 1rem;' }, renderTags(item.tags, 'tag tag-mono')) : null,
          ])
        ])
      )
    );

    const chevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
    const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

    const prevBtn = el('button', { className: 'hackathon-nav-btn', html: chevronLeft, 'aria-label': 'Previous' });
    const nextBtn = el('button', { className: 'hackathon-nav-btn', html: chevronRight, 'aria-label': 'Next' });

    function getCardsToShow() {
      return parseInt(getComputedStyle(section).getPropertyValue('--cards-to-show')) || 3;
    }

    function updateSlider() {
      track.style.transform = `translateX(calc(-${currentIndex} * (100% / var(--cards-to-show) + var(--gap) / var(--cards-to-show))))`;
      
      const maxIndex = Math.max(0, items.length - getCardsToShow());
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.onclick = () => {
      if (currentIndex > 0) currentIndex--;
      updateSlider();
    };

    nextBtn.onclick = () => {
      const maxIndex = Math.max(0, items.length - getCardsToShow());
      if (currentIndex < maxIndex) currentIndex++;
      updateSlider();
    };
    
    // Initial button state
    setTimeout(updateSlider, 0);
    window.addEventListener('resize', () => {
      const maxIndex = Math.max(0, items.length - getCardsToShow());
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      updateSlider();
    });

    const controls = el('div', { className: 'hackathon-controls' }, [prevBtn, nextBtn]);

    section.replaceChildren(
      el('div', { className: 'section-header' }, [
        el('h2', { className: 'sub-title', text: 'Hackathons' }),
      ]),
      el('div', { className: 'hackathon-slider-container' }, [
        track
      ]),
      controls
    );
  }

  function renderContact(data) {
    const section = document.getElementById('contact');
    if (!section) return;

    const { meta, social } = data;
    const networks = [
      ['github', social.github, 'GitHub'],
      ['linkedin', social.linkedin, 'LinkedIn'],
      ['leetcode', social.leetcode, 'LeetCode'],
      ['hackerrank', social.hackerrank, 'HackerRank'],
    ].filter(([, url]) => url);

    section.replaceChildren(
      el('canvas', { id: 'rain-canvas', className: 'rain-canvas' }),
      el('div', { className: 'contact-section-centered' }, [
        el('div', { className: 'quote-eyebrow contact-eyebrow-center reveal', html: `${Icons.mail} <span style="margin-left: 8px;">CONTACT</span>` }),
        el('h2', {
            className: 'contact-lead-hero reveal',
            html: '<span class="highlight-green">Available</span> for full stack development, backend engineering, and open source.'
        }),
        el('div', { className: 'contact-actions-center reveal' }, [
            el('a', {
                href: `mailto:${meta.email}`,
                className: 'contact-email',
                html: `${Icons.mail} ${meta.email}`,
            }),
            el('div', { className: 'social-media-icons social-center' }, networks.map(([n, url, label]) => iconLink(n, url, label)))
        ])
      ])
    );
  }

  function renderFooter(data) {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.replaceChildren(
      el('div', { className: 'footer-left', style: 'flex: 1; display: flex; align-items: center; justify-content: flex-start;' }, [
        el('a', { href: 'https://visitor-badge.laobi.icu', target: '_blank', rel: 'noopener noreferrer', style: 'opacity: 0.8; transition: opacity 0.2s ease;', onmouseover: "this.style.opacity='1'", onmouseout: "this.style.opacity='0.8'" }, [
          el('img', {
            src: 'https://visitor-badge.laobi.icu/badge?page_id=subhaan0804.subhaan0804.github.io&left_color=%23454545&right_color=%230084ff&height=25&format=true&radius=10',
            alt: 'Visitor Count',
            style: 'display: block;'
          })
        ])
      ]),
      el('div', { className: 'footer-center', style: 'flex: 2; text-align: center;' }, [
        el('p', { text: `Copyright © ${data.meta.name}, ${new Date().getFullYear()}. All rights reserved.`, style: 'margin-bottom: 4px;' }),
        data.meta.lastUpdated
          ? el('p', { className: 'last-updated', text: `Last updated: ${data.meta.lastUpdated}` })
          : null
      ]),
      el('div', { className: 'footer-right', style: 'flex: 1;' })
    );
  }

  function updateDocumentMeta(data) {
    const { meta, social } = data;
    document.title = `${meta.name} — ${meta.title}`;
    const desc = `${meta.name} is a ${meta.title} from ${meta.location}. Building document pipelines, cloud-native infrastructure, and civic tech. Software Dev Intern at DeepLogic AI.`;

    setMeta('description', desc);
    setMeta('author', meta.name);
    setMetaProperty('og:title', document.title);
    setMetaProperty('og:description', desc);
    setMetaProperty('og:url', SITE_URL);
    setMetaProperty('og:image', `${SITE_URL}assets/images/og-image.png`);
    setMetaProperty('og:type', 'website');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', document.title);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', `${SITE_URL}assets/images/og-image.png`);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = SITE_URL;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: meta.name,
      url: SITE_URL,
      jobTitle: meta.title,
      email: meta.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: meta.location.split(',')[0]?.trim() || meta.location,
        addressCountry: 'IN',
      },
      sameAs: Object.values(social || {}).filter(Boolean),
    };

    let script = document.getElementById('json-ld');
    if (!script) {
      script = el('script', { id: 'json-ld', type: 'application/ld+json' });
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }

  function setMeta(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = el('meta', { name, content });
      document.head.appendChild(tag);
    } else {
      tag.content = content;
    }
  }

  function setMetaProperty(property, content) {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = el('meta', { property, content });
      document.head.appendChild(tag);
    } else {
      tag.content = content;
    }
  }

  function renderAll(data) {
    updateDocumentMeta(data);
    renderHeader(data);
    renderHero(data);
    renderAchievements(data);
    renderAbout(data);
    renderExperience(data);
    renderProjects(data);
    renderSkills(data);
    renderEducation(data);
    renderCertifications(data);
    renderHackathons(data);
    renderContact(data);
    renderFooter(data);
  }

  async function load(version = '1.0') {
    const response = await fetch(`data.json?v=${version}`);
    if (!response.ok) throw new Error(`Failed to load data.json (${response.status})`);
    const data = await response.json();
    renderAll(data);
    return data;
  }

  return { load, renderAll, renderArchitectureDiagram };
})();

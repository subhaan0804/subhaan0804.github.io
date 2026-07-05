/**
 * GSAP-powered animations — ClickUp / Framer-inspired.
 * GSAP ScrollTrigger adds .is-visible (CSS handles transitions).
 * Direct GSAP tweens only on elements that don't have .reveal class.
 */
document.addEventListener('portfolio:ready', () => {
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    initScrollReveal();
    initHeroEntrance();
    initCountUp();
    initParallax();
    initTimelineFlowLines();
  } else {
    initFallbackReveal();
  }

  initNavScroll();
  initSlidingNavIndicator();
  initCursorGlow();
  initParticleNetwork();
  initMagneticButtons();
  initRoleCycle();
  initHeroLottie();
  initArchitectureDraw();

  document.addEventListener('portfolio:cert-filter-changed', () => {
    if (hasGSAP) initTimelineFlowLines();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (hasGSAP) initTimelineFlowLines();
    }, 150);
  });
});

/* ══════════════════════════════════════════════════════════════
   CORE REVEAL — add is-visible via ScrollTrigger
   CSS transitions handle the visual (no opacity conflict)
   ══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  gsap.utils.toArray('.reveal').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none',
      onEnter: () => el.classList.add('is-visible'),
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   HERO ENTRANCE — sequential stagger (elements have no .reveal)
   ══════════════════════════════════════════════════════════════ */
function initHeroEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.timeline({ delay: 0.08 })
    .from('.availability-badge', { y: 28, opacity: 0, duration: 0.65, ease: 'power3.out' })
    .from('.hero-eyebrow',       { y: 22, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.38')
    .from('#homepage-main h1',  { y: 32, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.4')
    .from('.hero-role',          { y: 20, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.42')
    .from('.hero-tagline',       { y: 16, opacity: 0, duration: 0.52, ease: 'power2.out' }, '-=0.36')
    .from('.hero-ctas > *',      { y: 14, opacity: 0, duration: 0.4,  ease: 'power2.out', stagger: 0.1 }, '-=0.3')
    .from('.hero-visual',        { x: 48, opacity: 0, duration: 0.85, ease: 'power2.out' }, '-=0.6');
}

/* ══════════════════════════════════════════════════════════════
   COUNT-UP — achievement stats
   ══════════════════════════════════════════════════════════════ */
function initCountUp() {
  const stats = document.querySelectorAll('[data-count-to]');
  if (!stats.length) return;

  stats.forEach(el => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isInt   = Number.isInteger(target);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            const v = isInt ? Math.round(this.targets()[0].val) : this.targets()[0].val.toFixed(1);
            el.textContent = prefix + v + suffix;
          },
          onComplete() {
            el.textContent = prefix + (isInt ? target : target.toFixed(1)) + suffix;
          },
        });
      },
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   PARALLAX — hero text drifts at different speeds on scroll
   ══════════════════════════════════════════════════════════════ */
function initParallax() {
  // Disabled per user request: stops section headers from gliding on Y axis on scroll
}

/* ══════════════════════════════════════════════════════════════
   FALLBACK (no GSAP)
   ══════════════════════════════════════════════════════════════ */
function initFallbackReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   NAV: .is-scrolled glass deepens after 60px
   ══════════════════════════════════════════════════════════════ */
function initNavScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  let last = false;
  const check = () => {
    const scrolled = window.scrollY > 60;
    if (scrolled !== last) { last = scrolled; header.classList.toggle('is-scrolled', scrolled); }
  };
  window.addEventListener('scroll', check, { passive: true });
  check();
}

/* ══════════════════════════════════════════════════════════════
   SLIDING NAV INDICATOR — moves under the active link
   ══════════════════════════════════════════════════════════════ */
function initSlidingNavIndicator() {
  const pill = document.getElementById('sidebar');
  if (!pill) return;

  let indicator = pill.querySelector('.nav-indicator');
  if (!indicator) {
    indicator = document.createElement('li');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    pill.prepend(indicator);
  }

  let hoverTarget = null;

  function moveIndicator(element) {
    if (!element) {
      indicator.style.opacity = '0';
      return;
    }
    const li = element.closest('li');
    if (!li || li.classList.contains('nav-indicator')) {
      indicator.style.opacity = '0';
      return;
    }
    indicator.style.width   = li.offsetWidth  + 'px';
    indicator.style.height  = li.offsetHeight + 'px';
    indicator.style.left    = li.offsetLeft   + 'px';
    indicator.style.top     = li.offsetTop    + 'px';
    indicator.style.opacity = '1';
  }

  const observer = new MutationObserver(() => {
    if (!hoverTarget) {
      const active = pill.querySelector('.nav-active');
      moveIndicator(active);
    }
  });
  observer.observe(pill, { attributes: true, subtree: true, attributeFilter: ['class'] });

  const links = pill.querySelectorAll('li a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      hoverTarget = link;
      moveIndicator(link);
    });
  });

  pill.addEventListener('mouseleave', () => {
    hoverTarget = null;
    const active = pill.querySelector('.nav-active');
    moveIndicator(active);
  });

  setTimeout(() => {
    const active = pill.querySelector('.nav-active');
    moveIndicator(active);
  }, 120);

  window.addEventListener('resize', () => {
    const active = hoverTarget || pill.querySelector('.nav-active');
    moveIndicator(active);
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════════
   CURSOR GLOW — warm light follows mouse on hero
   ══════════════════════════════════════════════════════════════ */
function initCursorGlow() {
  const hero = document.getElementById('homepage-main');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  let raf;
  let tx = -999, ty = -999;

  hero.addEventListener('mousemove', e => {
    if (window.gsap) gsap.killTweensOf(hero);
    tx = e.clientX;
    ty = e.clientY + window.scrollY;
    if (!raf) {
      raf = requestAnimationFrame(() => {
        hero.style.setProperty('--gx', tx + 'px');
        hero.style.setProperty('--gy', ty + 'px');
        raf = null;
      });
    }
  });

  hero.addEventListener('mouseleave', () => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.top + window.scrollY + (rect.height / 2);
    
    if (window.gsap) {
      gsap.to(hero, {
        '--gx': cx + 'px',
        '--gy': cy + 'px',
        duration: 1.2,
        ease: 'power2.out'
      });
    } else {
      hero.style.setProperty('--gx', cx + 'px');
      hero.style.setProperty('--gy', cy + 'px');
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   MAGNETIC BUTTONS — CTAs drift slightly toward cursor
   ══════════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.primary-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-1px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ROLE CYCLE
   ══════════════════════════════════════════════════════════════ */
function initRoleCycle() {
  const node = document.getElementById('role-cycle');
  if (!node) return;
  const roles = (node.dataset.roles || '').split('|').filter(Boolean);
  if (roles.length <= 1) return;
  let i = 0;
  node.textContent = roles[0];
  node.style.display = 'inline-block'; // Ensure transforms work
  setInterval(() => {
    if (window.gsap) {
      gsap.to(node, { opacity: 0, filter: 'blur(12px)', y: -4, duration: 0.32, onComplete: () => {
        i = (i + 1) % roles.length;
        node.textContent = roles[i];
        gsap.fromTo(node, { opacity: 0, filter: 'blur(12px)', y: 4 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.44 });
      }});
    } else {
      node.classList.add('role-fade-out');
      setTimeout(() => {
        i = (i + 1) % roles.length;
        node.textContent = roles[i];
        node.classList.remove('role-fade-out');
        node.classList.add('role-fade-in');
        setTimeout(() => node.classList.remove('role-fade-in'), 300);
      }, 280);
    }
  }, 3200);
}

/* ══════════════════════════════════════════════════════════════
   LOTTIE HERO
   ══════════════════════════════════════════════════════════════ */
function initHeroLottie() {
  const container = document.getElementById('hero-lottie-canvas');
  if (!container || typeof lottie === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    fetch('assets/lottie/hero-terminal.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        container.closest('.hero-visual')?.querySelector('.terminal-mock')?.remove();
        const anim = lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: true, animationData: data });
        document.addEventListener('visibilitychange', () => document.hidden ? anim.pause() : anim.play());
      }).catch(() => {});
  }, { threshold: 0.1 });
  obs.observe(container);
}

/* ══════════════════════════════════════════════════════════════
   ARCHITECTURE SVG DRAW
   ══════════════════════════════════════════════════════════════ */
function initArchitectureDraw() {
  const draw = (root = document) => {
    root.querySelectorAll('.arch-path').forEach(path => {
      const len = path.getTotalLength?.() || 100;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      requestAnimationFrame(() => path.classList.add('is-drawn'));
    });
  };
  draw();
  document.addEventListener('portfolio:deepdive-open', e => draw(e.detail.panel));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { draw(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  document.querySelectorAll('.arch-diagram-wrap').forEach(el => obs.observe(el));
}

document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('is-tab-hidden', document.hidden);
});

/* ══════════════════════════════════════════════════════════════
   TIMELINE SVG FLOW LINES (Google Stitch & Sketch Pen drawing)
   ══════════════════════════════════════════════════════════════ */
function initTimelineFlowLines() {
  const setupLine = (containerId, pathClassActive, pathClassPulse) => {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;

    // Clear any existing svg inside the flow line container
    wrap.innerHTML = '';

    const height = wrap.offsetHeight;
    if (!height) return; // container is hidden or collapsed

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', height);
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.height = height + 'px';
    svg.style.width = '20px';
    svg.style.overflow = 'visible';

    // Defs for gradients
    const defs = document.createElementNS(svgNS, 'defs');
    const grad = document.createElementNS(svgNS, 'linearGradient');
    const gradId = `timeline-grad-${containerId}`;
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '0%');
    grad.setAttribute('y2', '100%');

    const stops = [
      { offset: '0%', color: 'var(--clr-gold)' },
      { offset: '50%', color: 'var(--clr-orange)' },
      { offset: '100%', color: 'var(--clr-red)' }
    ];
    stops.forEach(s => {
      const stop = document.createElementNS(svgNS, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    const d = `M 10 0 L 10 ${height}`;

    // Background line (path)
    const bg = document.createElementNS(svgNS, 'path');
    bg.setAttribute('d', d);
    bg.setAttribute('stroke', 'rgba(244, 211, 94, 0.08)');
    bg.setAttribute('stroke-width', '2');
    bg.setAttribute('fill', 'none');
    svg.appendChild(bg);

    // Active drawn line (path)
    const active = document.createElementNS(svgNS, 'path');
    active.setAttribute('d', d);
    active.setAttribute('stroke', `url(#${gradId})`);
    active.setAttribute('stroke-width', '2.5');
    active.setAttribute('fill', 'none');
    active.setAttribute('class', pathClassActive);
    svg.appendChild(active);

    // Pulse line (continuous flow animation)
    const pulse = document.createElementNS(svgNS, 'path');
    pulse.setAttribute('d', d);
    pulse.setAttribute('stroke', 'var(--clr-orange)');
    pulse.setAttribute('stroke-width', '3.5');
    pulse.setAttribute('stroke-linecap', 'round');
    pulse.setAttribute('fill', 'none');
    pulse.setAttribute('class', pathClassPulse);
    pulse.setAttribute('filter', 'drop-shadow(0 0 4px var(--clr-orange))');
    svg.appendChild(pulse);

    wrap.appendChild(svg);

    // Setup GSAP scroll trigger for active path (Sketch Pen drawing effect)
    const pathLength = height;
    active.style.strokeDasharray = pathLength;
    active.style.strokeDashoffset = pathLength;

    gsap.to(active, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });
  };

  setupLine('experience-flow-line', 'exp-active', 'exp-pulse');
  setupLine('cert-flow-line', 'cert-active', 'cert-pulse');
}

/* ══════════════════════════════════════════════════════════════
   HERO CANVAS PARTICLE NETWORK
   ══════════════════════════════════════════════════════════════ */
function initParticleNetwork() {
  const hero = document.getElementById('homepage-main');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles-canvas';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0;
  let height = 0;
  let points = [];
  let animationFrameId = null;
  let isIntersecting = false;

  const mouse = { x: -1000, y: -1000, active: false };

  const spacing = 35; // Distance between grid points
  const mouseRadius = 260; // Interaction radius

  const resize = () => {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    generateGrid();
  };

  const generateGrid = () => {
    points = [];
    const cols = Math.floor(width / spacing) + 2;
    const rows = Math.floor(height / spacing) + 2;

    const offsetX = (width - (cols - 1) * spacing) / 2;
    const offsetY = (height - (rows - 1) * spacing) / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const baseX = offsetX + i * spacing;
        const baseY = offsetY + j * spacing;
        
        points.push({
          baseX: baseX,
          baseY: baseY,
          x: baseX,
          y: baseY,
          vx: 0,
          vy: 0,
          col: i,
          row: j
        });
      }
    }
  };

  const update = () => {
    points.forEach(p => {
      // Magnetic interaction
      let dx = mouse.x - p.x;
      let dy = mouse.y - p.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      // Repulsion force (Fluid & Gentle)
      if (mouse.active && dist < mouseRadius) {
        const force = Math.pow((mouseRadius - dist) / mouseRadius, 2);
        const angle = Math.atan2(dy, dx);
        
        // Push points away
        const push = force * -3.5;
        p.vx += Math.cos(angle) * push;
        p.vy += Math.sin(angle) * push;
      }

      // Spring back to base position
      let bx = p.baseX - p.x;
      let by = p.baseY - p.y;
      
      // Spring constant
      p.vx += bx * 0.05; // Softer spring
      p.vy += by * 0.05;
      
      // Friction
      p.vx *= 0.85; // More glide
      p.vy *= 0.85;

      p.x += p.vx;
      p.y += p.vy;
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw only fluid point dots (Stitch style)
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      
      let mdx = mouse.x - p1.baseX;
      let mdy = mouse.y - p1.baseY;
      let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      
      let pointIntensity = 0;
      if (mouse.active) {
        pointIntensity = Math.max(0, 1 - (mdist / mouseRadius));
      }
      
      // Base subtle grid
      let baseAlpha = 0.15;
      let baseSize = 1.2;
      
      if (pointIntensity > 0) {
        baseAlpha = 0.15 + (pointIntensity * 0.7);
        baseSize = 1.2 + (pointIntensity * 1.5);
      }
      
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, baseSize, 0, Math.PI * 2);
      
      if (pointIntensity > 0.7) {
        ctx.fillStyle = `rgba(0, 229, 255, ${baseAlpha})`; // Cyan glow
      } else if (pointIntensity > 0.3) {
        ctx.fillStyle = `rgba(162, 50, 255, ${baseAlpha})`; // Purple glow
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha})`; // Subtle white
      }
      
      ctx.fill();
    }
  };

  const loop = () => {
    if (!isIntersecting) return;
    update();
    draw();
    animationFrameId = requestAnimationFrame(loop);
  };

  const observer = new IntersectionObserver(entries => {
    isIntersecting = entries[0].isIntersecting;
    if (isIntersecting) {
      loop();
    } else if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }, { threshold: 0.01 });
  observer.observe(hero);

  hero.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  window.addEventListener('resize', resize, { passive: true });
}


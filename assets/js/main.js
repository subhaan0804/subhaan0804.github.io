/**
 * App initialization — loads portfolio data and wires UI interactions.
 */
const CATEGORY_TAG_MAP = {
  'All':            null,
  'AI / ML':        ['RAG', 'LangChain', 'LLM', 'Ollama', 'ChromaDB', 'RAGAS', 'HuggingFace'],
  'Infrastructure': ['Kubernetes', 'KEDA', 'PostGIS', 'GIS', 'systemd', 'Docker'],
  'Full Stack':     ['Node.js', 'Express.js', 'React', 'Vue.js', 'MongoDB', 'Convex', 'Firebase', 'JWT', 'Cloudinary'],
  'Android':        ['Kotlin', 'Android', 'VpnService', 'DNS'],
  'Hackathon':      '__hackathon__',
};

document.addEventListener('DOMContentLoaded', async () => {
  document.body.classList.add('is-loading');

  try {
    const data = await PortfolioRenderer.load('1.0');
    initNavigation();
    initActiveNav();
    initProjectFilters();
    initDeepDiveToggles();
    initCertFilter();
    initButtonAnimations();
    initRainEffect();
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    document.dispatchEvent(new CustomEvent('portfolio:ready', { detail: data }));
  } catch (error) {
    console.error('Portfolio failed to load:', error);
    document.body.classList.add('has-error');
  }
});

function initNavigation() {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');

  menuToggle?.addEventListener('click', () => sidebar?.classList.add('active'));
  menuClose?.addEventListener('click', () => sidebar?.classList.remove('active'));

  document.addEventListener('click', (event) => {
    if (!sidebar?.classList.contains('active')) return;
    const target = event.target;
    if (target === menuToggle || target === menuClose || sidebar.contains(target)) return;
    sidebar.classList.remove('active');
  });

  sidebar?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => sidebar.classList.remove('active'));
  });
}

function initActiveNav() {
  const navLinks = Array.from(document.querySelectorAll('.sidemenu li a[href^="#"]'));
  if (!navLinks.length) return;

  const validIds = navLinks.map(link => {
    const href = link.getAttribute('href');
    return href === '#' ? 'hero' : href.substring(1);
  });

  const allSections = document.querySelectorAll('main > section[id]');
  const validSections = Array.from(allSections).filter(sec => validIds.includes(sec.id));

  if (!validSections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('nav-active', href === `#${id}` || (id === 'hero' && href === '#'));
        });
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  validSections.forEach((section) => observer.observe(section));
}

function initProjectFilters() {
  const filtersContainer = document.getElementById('project-filters');
  const grid = document.getElementById('projects-grid');
  if (!filtersContainer || !grid) return;

  Object.entries(CATEGORY_TAG_MAP).forEach(([category, matchTags]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `filter-btn${category === 'All' ? ' active' : ''}`;
    btn.textContent = category;
    btn.dataset.filter = category;

    btn.addEventListener('click', () => {
      filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      grid.querySelectorAll('[data-tags]').forEach(card => {
        if (category === 'All') { card.hidden = false; return; }

        if (matchTags === '__hackathon__') {
          card.hidden = card.dataset.hackathon !== 'true';
          return;
        }

        const tags = (card.dataset.tags || '').split(',').filter(Boolean);
        card.hidden = !tags.some(t => matchTags.includes(t));
      });
    });

    filtersContainer.appendChild(btn);
  });

  // Animate arch paths in featured cards once they enter the viewport
  const archObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.arch-path').forEach(path => path.classList.add('is-drawn'));
      archObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  grid.querySelectorAll('.project-card-featured').forEach(card => archObserver.observe(card));
}

function initDeepDiveToggles() {
  document.querySelectorAll('.deep-dive-toggle').forEach((btn) => {
    const card = btn.closest('.project-card');
    const panel = card?.querySelector('.deep-dive-panel');
    if (!panel) return;

    btn.addEventListener('click', () => {
      const isOpen = !panel.hidden;
      panel.hidden = isOpen;
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.classList.toggle('is-open', !isOpen);
      if (!isOpen) {
        panel.querySelectorAll('.arch-path').forEach((path) => {
          path.classList.remove('is-drawn');
          requestAnimationFrame(() => path.classList.add('is-drawn'));
        });
        document.dispatchEvent(new CustomEvent('portfolio:deepdive-open', { detail: { panel } }));
      }
    });
  });
}

function initCertFilter() {
  const filterBar = document.querySelector('.cert-filter-bar');
  const grid = document.getElementById('cert-grid');
  if (!filterBar || !grid) return;

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.cert-filter-btn');
    if (!btn) return;

    filterBar.querySelectorAll('.cert-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.certFilter;
    grid.querySelectorAll('.cert-card-simple').forEach(card => {
      const match = filter === 'All' || card.dataset.certCategory === filter;
      card.style.display = match ? '' : 'none';
    });

    // Trigger timeline flow redraw!
    document.dispatchEvent(new CustomEvent('portfolio:cert-filter-changed'));
  });
}

function initButtonAnimations() {
  document.addEventListener('mousemove', (e) => {
    const btn = e.target.closest('.cta-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--x', (e.clientX - rect.left) + 'px');
    btn.style.setProperty('--y', (e.clientY - rect.top) + 'px');
  });
}


function initRainEffect() {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w, h;
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const drops = [];
  const ripples = [];
  
  function createDrop() {
    drops.push({
      x: 30 + Math.random() * (w - 60),
      y: -20,
      length: Math.random() * 15 + 10,
      speed: Math.random() * 8 + 6,
      targetY: h * 0.45 + 20 + Math.random() * (h * 0.55 - 20),
      opacity: Math.random() * 0.3 + 0.1
    });
  }

  function createRipple(x, y) {
    ripples.push({
      x, y,
      radiusX: 0,
      radiusY: 0,
      maxRadiusX: Math.random() * 30 + 20,
      speed: Math.random() * 0.5 + 0.3,
      opacity: 0.4
    });
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    
    if (Math.random() < 0.4) createDrop();
    if (Math.random() < 0.4) createDrop();

    // Update and draw drops
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.y += d.speed;
      
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.length);
      ctx.strokeStyle = `rgba(255, 255, 255, ${d.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      if (d.y > d.targetY) {
        createRipple(d.x, d.y);
        drops.splice(i, 1);
      }
    }

    // Update and draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radiusX += r.speed;
      r.radiusY = r.radiusX * 0.3; // Perspective flatten for 3D look
      r.opacity -= 0.005;
      
      if (r.opacity <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radiusX, r.radiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    requestAnimationFrame(loop);
  }
  
  loop();
}

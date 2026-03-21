/* ============================================================
   SANJAY S — PORTFOLIO SCRIPT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR + TRAIL
  ---------------------------------------------------------- */
  const dot        = document.querySelector('.cursor-dot');
  const ring       = document.querySelector('.cursor-ring');
  const trailCanvas = document.getElementById('cursor-trail');
  const ctx        = trailCanvas ? trailCanvas.getContext('2d') : null;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  const trail = [];

  if (trailCanvas) {
    const resize = () => { trailCanvas.width = window.innerWidth; trailCanvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
  }

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  if (dot && ring) {
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    document.querySelectorAll('a, button, .portfolio-item, .skill-card, .comp-badge, .hamburger, .contact-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('expand'));
      el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
    });
  }

  (function animateCursor() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    if (dot)  { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    if (ctx && trailCanvas) {
      trail.push({ x: mx, y: my });
      if (trail.length > 18) trail.shift();
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      trail.forEach((p, i) => {
        const a = (i / trail.length) * 0.28;
        const r = (i / trail.length) * 3;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,184,75,${a})`; ctx.fill();
      });
    }
    requestAnimationFrame(animateCursor);
  })();

  /* ----------------------------------------------------------
     2. NAVBAR SCROLL
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ----------------------------------------------------------
     3. HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     4. SCROLL REVEAL
  ---------------------------------------------------------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ----------------------------------------------------------
     5. HERO CANVAS PARTICLES
  ---------------------------------------------------------- */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const hc = heroCanvas.getContext('2d');
    const resizeHero = () => { heroCanvas.width = window.innerWidth; heroCanvas.height = window.innerHeight; };
    resizeHero(); window.addEventListener('resize', resizeHero);
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * heroCanvas.width, y: Math.random() * heroCanvas.height,
      r: Math.random() * 1.3 + 0.2, dx: (Math.random() - .5) * .22,
      dy: -Math.random() * .32 - .04, a: Math.random() * .4 + .07,
    }));
    (function drawHero() {
      hc.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      pts.forEach(p => {
        hc.beginPath(); hc.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        hc.fillStyle = `rgba(232,184,75,${p.a})`; hc.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -4) { p.y = heroCanvas.height + 4; p.x = Math.random() * heroCanvas.width; }
        if (p.x < 0 || p.x > heroCanvas.width) p.dx *= -1;
      });
      requestAnimationFrame(drawHero);
    })();
  }

  /* ----------------------------------------------------------
     6. ACTIVE NAV LINK ON SCROLL
  ---------------------------------------------------------- */
  const navAnchors = document.querySelectorAll('.nav-links a');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     8. HERO VIDEO PARALLAX
  ---------------------------------------------------------- */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight)
        heroVideo.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.2}px))`;
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     9. SKILL CARD STAGGER
  ---------------------------------------------------------- */
  document.querySelectorAll('.skills-category').forEach(cat => {
    cat.querySelectorAll('.skill-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.06}s`;
    });
  });

  /* ----------------------------------------------------------
     10. PORTFOLIO MODAL
     Exact image lists based on actual folder contents
  ---------------------------------------------------------- */
  const modal    = document.getElementById('project-modal');
  const mTitle   = document.getElementById('modal-title');
  const mDesc    = document.getElementById('modal-desc');
  const mGal     = document.getElementById('modal-gallery');
  const closeBtn = document.querySelector('.close-modal');
  const backdrop = document.querySelector('.modal-backdrop');

  const projects = {
    batmobile: {
      title: 'Batmobile',
      desc:  'Hard Surface Modeling — Detailed recreation of the iconic Batmobile with intricate mechanical components and game-ready optimization.',
      images: ['Portfolio/image/projects/batmobile/1.jpg','Portfolio/image/projects/batmobile/2.jpg','Portfolio/image/projects/batmobile/3.jpg'],
    },
    bear: {
      title: 'Bear Character',
      desc:  '3D Character Sculpt — Stylized bear character sculpted with attention to anatomy, fur surface detail, and expressive form.',
      images: ['Portfolio/image/projects/bear/1.jpg','Portfolio/image/projects/bear/2.jpg'],
    },
    demon: {
      title: 'Demon Character',
      desc:  'ZBrush Sculpt — High-resolution creature sculpt focusing on menacing silhouette, organic surface detail, and secondary form refinement.',
      images: ['Portfolio/image/projects/demon/1.jpg','Portfolio/image/projects/demon/2.jpg','Portfolio/image/projects/demon/3.jpg'],
    },
    'detailed-robot': {
      title: 'Detailed Robot',
      desc:  'Hard Surface Model — Fully modeled robotic character with clean topology, intricate mechanical parts, and PBR-ready surfaces.',
      images: ['Portfolio/image/projects/detailed-robot/1.jpg','Portfolio/image/projects/detailed-robot/2.jpg','Portfolio/image/projects/detailed-robot/3.jpg'],
    },
    dino: {
      title: 'Dinosaur',
      desc:  'Creature Sculpt — High-detail dinosaur sculpt with realistic skin texture, muscular anatomy, and dynamic pose.',
      images: ['Portfolio/image/projects/dino/1.jpg'],
    },
    elf: {
      title: 'Elf Character',
      desc:  'Fantasy Character — Stylized elf design blending organic character modeling with hard-surface armor detailing.',
      images: ['elf/1.jpg','elf/2.jpg','elf/3.jpg','elf/4.jpg'],
    },
    samurai: {
      title: 'Samurai',
      desc:  'Character Design — Fully realized samurai warrior combining intricate armor hard-surface elements with organic facial and body sculpting.',
      images: ['samurai/1.jpg','samurai/2.jpg','samurai/3.jpg','samurai/4.jpg','samurai/5.jpg'],
    },
    scfi: {
      title: 'Sci-Fi Asset',
      desc:  'Game Ready Asset — Sci-fi prop with clean UV mapping, optimized topology, and fully baked PBR textures for real-time engine use.',
      images: ['scfi/1.jpg','scfi/2.jpg','scfi/3.jpg'],
    },
    spaceship: {
      title: 'Spaceship',
      desc:  'Vehicle Design — Detailed spaceship model with hard-surface panel work, engine detailing, and cinematic lighting renders.',
      images: ['spaceship/space%20(1).jpg','spaceship/space%20(2).jpg','spaceship/space%20(3).jpg','spaceship/space%20(4).jpg','spaceship/space%20(5).jpg','spaceship/space%20(6).jpg'],
    },
    witch: {
      title: 'Witch Character',
      desc:  'Stylized Character — Witch character with expressive design, dynamic cloth simulation elements, and rich surface detailing.',
      images: ['witch/1.jpg','witch/2.jpg','witch/3.jpg'],
    },
    face: {
      title: 'Face Study',
      desc:  'Character Sculpt — Detailed facial anatomy study focusing on realistic skin surface, expression, and secondary forms.',
      images: ['face/1.jpg','face/2.jpg','face/3.jpg','face/4.jpg'],
    },
    yearsprojects: {
      title: '1st & 2nd Year Projects',
      desc:  'Early Works Collection — A showcase of projects from the first and second year, demonstrating growth in 3D modeling, sculpting, and design fundamentals.',
      images: [
        '1st%20and%202nd%20year%20projects/1.jpg',
        '1st%20and%202nd%20year%20projects/2.jpg',
        '1st%20and%202nd%20year%20projects/3.jpg',
        '1st%20and%202nd%20year%20projects/4.jpg',
        '1st%20and%202nd%20year%20projects/5.jpg',
        '1st%20and%202nd%20year%20projects/6.jpg',
        '1st%20and%202nd%20year%20projects/7.jpg',
        '1st%20and%202nd%20year%20projects/8.jpg',
        '1st%20and%202nd%20year%20projects/9.jpg',
        '1st%20and%202nd%20year%20projects/10.jpg',
      ],
    },
    vrhospital: {
      title: 'Medical VR Anatomy',
      desc:  'VR Project — Interactive VR application for medical students. Sculpted anatomical models in ZBrush and integrated into Unreal Engine for immersive VR interaction.',
      images: ['VrHospital/1.jpg','VrHospital/2.jpg','VrHospital/3.jpg','VrHospital/4.jpg','VrHospital/5.jpg','VrHospital/6.jpg','VrHospital/7.jpg','VrHospital/8.jpg'],
    },
  };

  const openModal = key => {
    const d = projects[key];
    if (!d || !modal) return;
    mTitle.textContent = d.title;
    mDesc.textContent  = d.desc;
    mGal.innerHTML = '';
    d.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src; img.alt = d.title; img.loading = 'lazy';
      img.onerror = () => img.remove();
      mGal.appendChild(img);
    });
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { mGal.innerHTML = ''; }, 300);
  };

  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => openModal(item.dataset.project));
  });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ----------------------------------------------------------
     11. PAGE TRANSITION INTRO
  ---------------------------------------------------------- */
  const pt = document.getElementById('pt');
  if (pt) { pt.classList.add('in'); setTimeout(() => pt.classList.remove('in'), 700); }

  /* ----------------------------------------------------------
     12. FOOTER YEAR
  ---------------------------------------------------------- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

});

  /* EMAIL — set via JS to prevent Cloudflare obfuscation */
  const u = 'sanjay34178';
  const d = 'gmail.com';
  const el = document.getElementById('email-link');
  const et = document.getElementById('email-text');
  if (el && et) {
    el.href = 'mailto:' + u + '@' + d;
    et.textContent = u + '@' + d;
  }

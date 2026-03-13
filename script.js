/* ============================================================
   SANJAY S — CINEMATIC PORTFOLIO SCRIPT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. CURSOR — dot + ring + canvas trail
  ---------------------------------------------------------- */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const trailCanvas = document.getElementById('cursor-trail');
  const ctx = trailCanvas ? trailCanvas.getContext('2d') : null;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  const trail = [];
  const TRAIL_LEN = 22;

  if (trailCanvas) {
    trailCanvas.width  = window.innerWidth;
    trailCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      trailCanvas.width  = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    });
  }

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  if (dot && ring) {
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

    const hoverEls = document.querySelectorAll('a,button,.port-item,.badge,.contact-card,.hamburger');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  function animateCursor() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;

    if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }

    if (ctx) {
      trail.push({ x: mx, y: my, life: 1 });
      if (trail.length > TRAIL_LEN) trail.shift();

      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        const alpha = (i / trail.length) * 0.35;
        const radius = (i / trail.length) * 4;
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,197,24,${alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ----------------------------------------------------------
     2. NAVBAR SCROLL
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ----------------------------------------------------------
     3. HAMBURGER
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
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
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ----------------------------------------------------------
     5. HERO PARTICLE CANVAS
  ---------------------------------------------------------- */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const hctx = heroCanvas.getContext('2d');
    heroCanvas.width  = window.innerWidth;
    heroCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      heroCanvas.width  = window.innerWidth;
      heroCanvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * heroCanvas.width,
      y: Math.random() * heroCanvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function drawParticles() {
      hctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach(p => {
        hctx.beginPath();
        hctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        hctx.fillStyle = `rgba(245,197,24,${p.alpha})`;
        hctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.y < -5) { p.y = heroCanvas.height + 5; p.x = Math.random() * heroCanvas.width; }
        if (p.x < 0 || p.x > heroCanvas.width) p.dx *= -1;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ----------------------------------------------------------
     6. HERO COUNTER ANIMATION
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.count');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.target;
        let current = 0;
        const step  = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          e.target.textContent = Math.floor(current);
        }, 35);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  /* ----------------------------------------------------------
     7. SKILL BAR ANIMATION
  ---------------------------------------------------------- */
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-group').forEach(g => barObs.observe(g));

  /* ----------------------------------------------------------
     8. ACTIVE NAV
  ---------------------------------------------------------- */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObs.observe(s));

  /* ----------------------------------------------------------
     9. SMOOTH SCROLL
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (navbar ? navbar.offsetHeight : 70) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     10. HERO VIDEO PARALLAX
  ---------------------------------------------------------- */
  const heroVid = document.querySelector('.hero-video');
  if (heroVid) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroVid.style.transform = `translate(-50%,calc(-50% + ${window.scrollY * 0.2}px))`;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     11. PORTFOLIO MODAL
  ---------------------------------------------------------- */
  const modal   = document.getElementById('modal');
  const mTitle  = document.getElementById('modal-title');
  const mDesc   = document.getElementById('modal-desc');
  const mGal    = document.getElementById('modal-gallery');
  const mClose  = document.querySelector('.modal-close');
  const mBack   = document.querySelector('.modal-backdrop');

  const projects = {
    batmobile:       { title:'Batmobile',        desc:'Hard Surface Modeling — Detailed recreation of the iconic Batmobile.', images: Array.from({length:4},(_,i)=>`images/projects/batmobile/${i+1}.jpg`) },
    bear:            { title:'Bear Character',   desc:'3D Character Sculpt — Stylized bear with anatomical detail.', images: Array.from({length:4},(_,i)=>`images/projects/bear/${i+1}.jpg`) },
    demon:           { title:'Demon Character',  desc:'ZBrush Sculpt — High-res creature with organic surface detail.', images: Array.from({length:4},(_,i)=>`images/projects/demon/${i+1}.jpg`) },
    'detailed-robot':{ title:'Detailed Robot',   desc:'Hard Surface Model — Robotic character with clean topology.', images: Array.from({length:4},(_,i)=>`images/projects/detailed%20robot/${i+1}.jpg`) },
    dino:            { title:'Dinosaur',         desc:'Creature Sculpt — High-detail dinosaur with realistic skin.', images: Array.from({length:4},(_,i)=>`images/projects/dino/${i+1}.jpg`) },
    elf:             { title:'Elf Character',    desc:'Fantasy Character — Stylized elf with armor detailing.', images: Array.from({length:4},(_,i)=>`images/projects/elf/${i+1}.jpg`) },
    samurai:         { title:'Samurai',          desc:'Character Design — Warrior combining armor and organic sculpting.', images: Array.from({length:4},(_,i)=>`images/projects/samurai/${i+1}.jpg`) },
    scfi:            { title:'Sci-Fi Asset',     desc:'Game Ready Asset — Sci-fi prop with baked PBR textures.', images: Array.from({length:4},(_,i)=>`images/projects/scfi/${i+1}.jpg`) },
    spaceship:       { title:'Spaceship',        desc:'Vehicle Design — Hard-surface spaceship with cinematic renders.', images: Array.from({length:4},(_,i)=>`images/projects/spaceship/${i+1}.jpg`) },
    witch:           { title:'Witch Character',  desc:'Stylized Character — Witch with expressive design and cloth detail.', images: Array.from({length:4},(_,i)=>`images/projects/witch/${i+1}.jpg`) },
  };

  const openModal = key => {
    const d = projects[key]; if (!d || !modal) return;
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
    setTimeout(() => { if (mGal) mGal.innerHTML = ''; }, 300);
  };

  document.querySelectorAll('.port-item').forEach(item => {
    item.addEventListener('click', () => openModal(item.dataset.project));
  });
  if (mClose) mClose.addEventListener('click', closeModal);
  if (mBack)  mBack.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ----------------------------------------------------------
     12. PAGE TRANSITION on internal links
  ---------------------------------------------------------- */
  const pt = document.querySelector('.page-transition');
  // Subtle flash on first load
  if (pt) {
    pt.classList.add('active');
    setTimeout(() => pt.classList.remove('active'), 600);
  }

  /* ----------------------------------------------------------
     13. FOOTER YEAR
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

/* scrollToTop used by logo click */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

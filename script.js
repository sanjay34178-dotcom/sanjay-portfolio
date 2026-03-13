/* ============================================================
   SANJAY S — PORTFOLIO SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursor = document.querySelector('.cursor-glow');

  if (cursor) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor follow
    const animateCursor = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .portfolio-item, .skill-card, .comp-badge, .hamburger'
    );

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }

  /* ----------------------------------------------------------
     2. NAVBAR SCROLL BEHAVIOUR
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ----------------------------------------------------------
     3. HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
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
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     5. PORTFOLIO MODAL
  ---------------------------------------------------------- */
  const modal        = document.getElementById('project-modal');
  const modalTitle   = document.getElementById('modal-title');
  const modalDesc    = document.getElementById('modal-desc');
  const modalGallery = document.getElementById('modal-gallery');
  const closeBtn     = document.querySelector('.close-modal');
  const backdrop     = document.querySelector('.modal-backdrop');

  // FIX: "detailed robot" renamed to "detailed-robot" (no spaces in folder name)
  // Make sure you also rename the actual folder on disk to "detailed-robot"
  const projects = {
    batmobile: {
      title: 'Batmobile',
      desc: 'Hard Surface Modeling — A detailed recreation of the iconic Batmobile with intricate mechanical components and game-ready optimization.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/batmobile/${i + 1}.jpg`),
    },
    bear: {
      title: 'Bear Character',
      desc: '3D Character Sculpt — A stylized bear character sculpted with attention to anatomy, fur surface detail, and expressive form.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/bear/${i + 1}.jpg`),
    },
    demon: {
      title: 'Demon Character',
      desc: 'ZBrush Sculpt — High-resolution creature sculpt focusing on menacing silhouette, organic surface detail, and secondary form refinement.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/demon/${i + 1}.jpg`),
    },
    'detailed-robot': {
      title: 'Detailed Robot',
      desc: 'Hard Surface Model — A fully modeled robotic character with clean topology, intricate mechanical parts, and PBR-ready surfaces.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/detailed%20robot/${i + 1}.jpg`),
    },
    dino: {
      title: 'Dinosaur',
      desc: 'Creature Sculpt — A high-detail dinosaur sculpt with realistic skin texture, muscular anatomy, and dynamic pose.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/dino/${i + 1}.jpg`),
    },
    elf: {
      title: 'Elf Character',
      desc: 'Fantasy Character — A stylized elf design blending organic character modeling with hard-surface armor detailing.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/elf/${i + 1}.jpg`),
    },
    samurai: {
      title: 'Samurai',
      desc: 'Character Design — A fully realized samurai warrior combining intricate armor hard-surface elements with organic facial and body sculpting.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/samurai/${i + 1}.jpg`),
    },
    scfi: {
      title: 'Sci-Fi Asset',
      desc: 'Game Ready Asset — A sci-fi prop with clean UV mapping, optimized topology, and fully baked PBR textures for real-time engine use.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/scfi/${i + 1}.jpg`),
    },
    spaceship: {
      title: 'Spaceship',
      desc: 'Vehicle Design — A detailed spaceship model with hard-surface panel work, engine detailing, and cinematic lighting renders.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/spaceship/${i + 1}.jpg`),
    },
    witch: {
      title: 'Witch Character',
      desc: 'Stylized Character — A stylized witch character with expressive design, dynamic cloth simulation elements, and rich surface detailing.',
      images: Array.from({ length: 4 }, (_, i) => `images/projects/witch/${i + 1}.jpg`),
    },
  };

  const openModal = (key) => {
    const data = projects[key];
    if (!data || !modal) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent  = data.desc;

    // Build gallery
    modalGallery.innerHTML = '';
    data.images.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = data.title;
      img.loading = 'lazy';
      // Gracefully remove image element if file doesn't exist
      img.onerror = () => { if (img.parentElement) img.remove(); };
      modalGallery.appendChild(img);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalGallery.innerHTML = ''; }, 300);
  };

  // FIX: Use data-project attribute instead of parsing the img src path
  // This avoids issues with spaces or special characters in folder names
  document.querySelectorAll('.portfolio-item').forEach((item) => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-project');
      if (key) openModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ----------------------------------------------------------
     6. SMOOTH SCROLL FOR NAV LINKS
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     7. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
  ---------------------------------------------------------- */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ----------------------------------------------------------
     8. PARALLAX HERO VIDEO
  ---------------------------------------------------------- */
  const heroVideo = document.querySelector('.hero-video');

  if (heroVideo) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const offset = scrolled * 0.25;
        heroVideo.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     9. SKILL CARD STAGGER ON REVEAL
  ---------------------------------------------------------- */
  document.querySelectorAll('.skills-category').forEach((category) => {
    const cards = category.querySelectorAll('.skill-card');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.06}s`;
    });
  });

  /* ----------------------------------------------------------
     10. FOOTER YEAR (future-proof)
  ---------------------------------------------------------- */
  const yearEl = document.querySelector('footer p');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace(/\d{4}/, year);
  }

});


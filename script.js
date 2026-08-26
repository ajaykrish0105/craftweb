(() => {
  'use strict';

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isFinePointer) document.body.classList.add('has-fine-pointer');

  /* ================= Preloader ================= */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-done'), 500);
  });

  /* ================= Scroll progress bar + back-to-top ================= */
  const progressBar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    nav.classList.toggle('scrolled', scrollTop > 40);
    backToTop.classList.toggle('is-visible', scrollTop > 560);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ================= Mobile nav ================= */
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  navBurger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  /* ================= Active nav link on scroll ================= */
  const sections = ['work', 'process', 'pricing', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.nav-links a[data-nav="${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  sections.forEach(s => sectionObs.observe(s));

  /* =================================================================
     Scroll reveal — re-triggers on BOTH scroll directions.
     Fix from previous version: we no longer unobserve() after the
     first reveal, so leaving the viewport removes .is-visible and
     re-entering (from either direction) adds it back.
     ================================================================= */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ================= Counter animation (re-runs each time visible) ================= */
  const counters = document.querySelectorAll('.stat-num');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.animating === '1') return;
      el.dataset.animating = '1';
      const target = parseInt(el.dataset.count, 10);
      const duration = 1500;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          el.dataset.animating = '0';
        }
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObs.observe(c));

  /* ================= Typing effect ================= */
  const typeTarget = document.getElementById('typeTarget');
  const words = ['Grow.', 'Sell.', 'Shine.', 'Scale.'];
  let wi = 0, ci = 0, deleting = false;
  function typeLoop() {
    const word = words[wi];
    if (!deleting) {
      ci++;
      typeTarget.textContent = word.slice(0, ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      ci--;
      typeTarget.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(typeLoop, deleting ? 60 : 110);
  }
  typeLoop();

  /* ================= Custom cursor (fine pointer only, rAF-smoothed) ================= */
  if (isFinePointer) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`;
    }, { passive: true });

    function ringLoop() {
      rx += (mx - rx) * 0.09;
      ry += (my - ry) * 0.09;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
      requestAnimationFrame(ringLoop);
    }
    requestAnimationFrame(ringLoop);

    document.querySelectorAll('a, button, .price-card, .service-card, .work-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ================= Magnetic buttons (fine pointer only) ================= */
  if (isFinePointer) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${relX * 0.15}px, ${relY * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ================= 3D tilt on service cards (fine pointer only) ================= */
  if (isFinePointer) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ================= Particle canvas (hero background) ================= */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let pMouse = { x: null, y: null };

  function resizeCanvas() {
    const hero = document.querySelector('.hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
    const count = Math.min(70, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.6 + 0.6
    }));
  }
  resizeCanvas();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 200);
  });

  if (isFinePointer) {
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      pMouse.x = e.clientX - r.left;
      pMouse.y = e.clientY - r.top;
    });
    document.querySelector('.hero').addEventListener('mouseleave', () => { pMouse.x = null; pMouse.y = null; });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      if (pMouse.x !== null) {
        const dx = p.x - pMouse.x, dy = p.y - pMouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232,163,61,0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(79,209,197,${0.14 * (1 - d / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ================= Blueprint SVG draw trigger (also re-triggers) ================= */
  const heroRight = document.querySelector('.hero-right');
  new IntersectionObserver((entries) => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.2 }).observe(heroRight);

  /* ================= Testimonial carousel (auto-plays, swipe/click dots) ================= */
  const testiTrack = document.getElementById('testiTrack');
  const testiDotsWrap = document.getElementById('testiDots');
  if (testiTrack && testiDotsWrap) {
    const slides = testiTrack.children.length;
    let current = 0;
    let autoTimer;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('span');
      dot.className = 'testi-dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', () => goTo(i));
      testiDotsWrap.appendChild(dot);
    }
    const dots = testiDotsWrap.querySelectorAll('.testi-dot');

    function goTo(i) {
      current = (i + slides) % slides;
      testiTrack.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === current));
    }
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    }
    startAuto();

    const testiWrap = document.querySelector('.testi-wrap');
    testiWrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    testiWrap.addEventListener('mouseleave', startAuto);

    // basic touch swipe
    let touchStartX = null;
    testiWrap.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    testiWrap.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 40) goTo(current - 1);
      else if (dx < -40) goTo(current + 1);
      touchStartX = null;
      startAuto();
    }, { passive: true });
  }

  /* ================= Button ripple on click ================= */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(r.width, r.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

})();

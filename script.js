/* ════════════════════════════════════════════
   CraftedWeb Studio — Ultra Smooth JS
   ════════════════════════════════════════════ */

/* ── SMOOTH SCROLL (Lenis-style) ── */
let lenis;
function initSmoothScroll() {
  const html = document.documentElement;
  let current = 0, target = 0, ease = 0.085;
  let ticking = false;
  const scrollable = document.body;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    target = window.scrollY;
    current = lerp(current, target, ease);
    const diff = Math.abs(target - current);
    ticking = diff > 0.05;
    if (ticking) requestAnimationFrame(tick);
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }, { passive: true });
}

/* ── CURSOR ── */
const blob = document.getElementById('cursorBlob');
const dot = document.getElementById('cursorDot');
let mx = window.innerWidth/2, my = window.innerHeight/2;
let bx = mx, by = my, dx = mx, dy = my;
let isHovering = false;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  bx += (mx - bx) * 0.07;
  by += (my - by) * 0.07;
  dx += (mx - dx) * 0.22;
  dy += (my - dy) * 0.22;

  blob.style.left = bx + 'px';
  blob.style.top = by + 'px';
  dot.style.left = dx + 'px';
  dot.style.top = dy + 'px';

  if (isHovering) {
    blob.style.transform = 'translate(-50%,-50%) scale(1.5)';
    dot.style.transform = 'translate(-50%,-50%) scale(0.4)';
  } else {
    blob.style.transform = 'translate(-50%,-50%) scale(1)';
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
  }
  requestAnimationFrame(animCursor);
}

document.querySelectorAll('a, button, .service-card, .price-card, .work-card').forEach(el => {
  el.addEventListener('mouseenter', () => { isHovering = true; });
  el.addEventListener('mouseleave', () => { isHovering = false; });
});

if ('ontouchstart' in window) {
  blob.style.display = 'none';
  if (dot) dot.style.display = 'none';
} else {
  animCursor();
}

/* ── NAV ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary, .btn-ghost, .btn-outline, .btn-whatsapp, .btn-instagram, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * 0.28;
    const dy = (e.clientY - cy) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
    setTimeout(() => btn.style.transition = '', 500);
  });
});

/* ── SERVICE CARD 3D TILT ── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const cx2 = r.left + r.width / 2;
    const cy2 = r.top + r.height / 2;
    const dx = (e.clientX - cx2) / r.width;
    const dy = (e.clientY - cy2) / r.height;
    card.style.transform = `translateY(-6px) perspective(900px) rotateX(${-dy*8}deg) rotateY(${dx*8}deg)`;
    card.style.transition = 'transform 0.1s';

    // Moving shine
    const shine = card.querySelector('.card-shine');
    if (shine) {
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      shine.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124,92,252,0.12) 0%, transparent 60%)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(.16,1,.3,1)';
  });
});

/* ── WORK CARD PARALLAX ── */
document.querySelectorAll('.work-thumb').forEach(thumb => {
  thumb.addEventListener('mousemove', e => {
    const r = thumb.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 20;
    thumb.style.backgroundPosition = `calc(50% + ${dx}px) calc(50% + ${dy}px)`;
  });
  thumb.addEventListener('mouseleave', () => {
    thumb.style.backgroundPosition = '50% 50%';
    thumb.style.transition = 'background-position 0.8s ease';
    setTimeout(() => thumb.style.transition = '', 800);
  });
});

/* ── PRICING CARD GLOW ── */
document.querySelectorAll('.price-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--gx', x + '%');
    card.style.setProperty('--gy', y + '%');
  });
});

/* ── COUNTER ANIMATION ── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function animateCounter(el, rawText, duration = 1800) {
  const num = parseFloat(rawText.replace(/[^\d.]/g, ''));
  const isPlus = rawText.includes('+');
  const isPct = rawText.includes('%');
  const isStar = rawText.includes('★');
  if (isNaN(num)) return;

  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const v = easeOutCubic(p) * num;
    if (isStar) el.textContent = v.toFixed(1) + '★';
    else if (isPct) el.textContent = Math.round(v) + '%';
    else el.textContent = Math.round(v) + (isPlus ? '+' : '');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = rawText;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, el.dataset.val || el.textContent.trim());
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => {
  el.dataset.val = el.textContent.trim();
  statObs.observe(el);
});

/* ── SCROLL PROGRESS BAR ── */
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;z-index:9999;background:linear-gradient(90deg,#7c5cfc,#c84fff);width:0%;pointer-events:none;';
document.body.appendChild(bar);
window.addEventListener('scroll', () => {
  bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
}, { passive: true });

/* ── PARTICLES (hero) ── */
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,92,252,${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 8000), 90);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawLines() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,92,252,${0.08 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animParticles);
  }

  resize();
  initParticles();
  animParticles();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  // Mouse repel
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx2 = e.clientX - rect.left;
    const my2 = e.clientY - rect.top;
    particles.forEach(p => {
      const dx = p.x - mx2, dy = p.y - my2;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 80) {
        p.vx += (dx / dist) * 0.4;
        p.vy += (dy / dist) * 0.4;
      }
    });
  });
}

/* ── TYPING EFFECT (hero title) ── */
function initTyping() {
  const el = document.getElementById('typeTarget');
  if (!el) return;
  const words = ['Sell.', 'Convert.', 'Grow.', 'Impress.'];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    const w = words[wi];
    if (!deleting) {
      el.textContent = w.slice(0, ci + 1);
      ci++;
      if (ci === w.length) { deleting = true; setTimeout(type, 1600); return; }
    } else {
      el.textContent = w.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 90);
  }
  type();
}

/* ── SMOOTH ANCHOR ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── SECTION ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));

/* ── STAGGER CHILDREN ── */
document.querySelectorAll('.stagger-children').forEach(parent => {
  const children = parent.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = (i * 0.08) + 's';
  });
});

/* ── INIT ── */
initTyping();
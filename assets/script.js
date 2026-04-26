/* ═══════════════════════════════════════════════════════
   MOTION SYSTEM — Vanilla JS, no libraries
   Rules: const by default, let only when reassignment needed
          No var. rAF for animations. No layout thrashing.
   ═══════════════════════════════════════════════════════ */

/* ─── Scroll Progress Bar ─── */
function initScrollBar() {
  const bar = document.querySelector('.scroll-bar');
  if (!bar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const progress = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ─── Back To Top ─── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      btn.classList.toggle('visible', window.scrollY > 500);
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── Contact Form (demo) ─── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#formName').value.trim();
    const message = form.querySelector('#formMessage').value.trim();
    if (!name || !message) return;

    form.classList.add('submitted');

    setTimeout(() => {
      form.classList.remove('submitted');
      form.reset();
    }, 4000);
  });
}

/* ─── Navbar Scroll State ─── */
function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      header.classList.toggle('header--scrolled', window.scrollY > 30);
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ─── Burger / Mobile Menu ─── */
function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  let isOpen = false;

  const toggle = () => {
    isOpen = !isOpen;
    menu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    menu.setAttribute('aria-hidden', !isOpen);

    const lines = burger.querySelectorAll('.header__burger-line');
    if (isOpen) {
      lines[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      lines[0].style.transform = '';
      lines[1].style.opacity = '';
      lines[2].style.transform = '';
    }
  };

  burger.addEventListener('click', toggle);

  menu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggle();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) toggle();
  });
}

/* ─── Scroll-triggered Reveals with directional entrance ───
  Usage in HTML:
    data-reveal="left"   — slide from left
    data-reveal="right"  — from right
    data-reveal="top"    — from top
    data-reveal="bottom" — from bottom
    data-reveal="tl"     — from top-left corner
    data-reveal="tr"     — from top-right corner
    data-reveal="bl"     — from bottom-left corner
    data-reveal="br"     — from bottom-right corner
    (no data-reveal)     — simple fade + lift from bottom

  Stagger via data-delay="80" (ms)
*/
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const transforms = {
    left:   'translateX(-56px) rotateY(16deg)',
    right:  'translateX(56px)  rotateY(-16deg)',
    top:    'translateY(-48px) rotateX(18deg)',
    bottom: 'translateY(52px)  rotateX(-14deg)',
    tl:     'translate(-44px, -36px) rotate(-4deg) scale(0.94)',
    tr:     'translate( 44px, -36px) rotate( 4deg) scale(0.94)',
    bl:     'translate(-44px,  36px) rotate( 3deg) scale(0.94)',
    br:     'translate( 44px,  36px) rotate(-3deg) scale(0.94)',
  };

  const origins = {
    left:   'left center',
    right:  'right center',
    top:    'center top',
    bottom: 'center bottom',
    tl:     'top left',
    tr:     'top right',
    bl:     'bottom left',
    br:     'bottom right',
  };

  document.querySelectorAll('.reveal').forEach(el => {
    const dir = el.dataset.reveal;
    const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;

    el.style.opacity = '0';
    el.style.willChange = 'transform, opacity';
    el.style.transitionDelay = `${delay}ms`;

    if (dir && transforms[dir]) {
      el.style.transform = transforms[dir];
      el.style.transformOrigin = origins[dir];
    } else {
      el.style.transform = 'translateY(24px)';
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('revealed');
        el.style.transform = '';
        el.style.opacity = '';
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── Parallax Blobs ─── */
function initParallax() {
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;

  let scrollY = 0;
  let ticking = false;

  const update = () => {
    layers.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ─── FAQ Accordion ─── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ─── Active Nav Link Highlighting ─── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');
  if (!navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('header__nav-link--active', href === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
}

/* ─── Smooth Anchor Scroll ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navHeight = document.getElementById('header')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Stat Counter Animation ─── */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const text = el.textContent.trim();
        const num = parseInt(text.replace(/\D/g, ''), 10);
        const suffix = text.replace(/[\d]/g, '');
        if (isNaN(num)) return;

        observer.unobserve(el);

        const duration = 1400;
        const start = performance.now();
        const startVal = Math.max(0, num - Math.round(num * 0.3));

        const step = now => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(startVal + (num - startVal) * eased);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(el => observer.observe(el));
}

/* ─── Init All ─── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollBar();
  initNavbar();
  initMobileMenu();
  initFaq();
  initSmoothScroll();
  initActiveNav();
  initReveal();
  initParallax();
  initStatCounters();
  initBackToTop();
  initContactForm();
});

// Navbar scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// Burger menu
const burger = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  });
});

// FAQ accordion
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    document
      .querySelectorAll(".faq-item")
      .forEach((i) => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
    btn.setAttribute("aria-expanded", !isOpen);
  });
});

// Subtle scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(
    ".concern-item, .process-step, .service-card, .testimonial-card",
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity .5s ease, transform .5s ease";
    observer.observe(el);
  });

// ─── HERO ANIMATION ENGINE ───
(() => {
  const bgImg = document.querySelector(".hero-bg__img");
  const bgOverlay = document.querySelector(".hero-bg__overlay");
  const imagePanel = document.querySelector(".hero-image-panel");
  const eyebrow = document.querySelector(".hero-eyebrow");
  const line1 = document.querySelector(".hero-heading__line--1");
  const line2 = document.querySelector(".hero-heading__line--2");
  const sub = document.querySelector(".hero-sub");
  const ctaRow = document.querySelector(".hero-cta-row");
  const statsRow = document.querySelector(".hero-stats-row");
  const scrollHint = document.querySelector(".hero-scroll-hint");

  const allAnimated = [
    imagePanel,
    eyebrow,
    line1,
    line2,
    sub,
    ctaRow,
    statsRow,
    scrollHint,
  ];

  const revealHero = () => {
    bgImg?.classList.add("loaded");
    bgOverlay?.classList.add("loaded");

    allAnimated.forEach((el) => {
      el?.classList.add("visible");
    });
  };

  const resetHero = () => {
    allAnimated.forEach((el) => {
      el?.classList.remove("visible");
    });
  };

  // Trigger on bg image load or immediately if cached
  const initReveal = () => {
    if (bgImg) {
      if (bgImg.complete) {
        setTimeout(revealHero, 80);
      } else {
        bgImg.addEventListener("load", () => {
          setTimeout(revealHero, 80);
        });

        // Fallback if image never fires load
        setTimeout(revealHero, 400);
      }
    } else {
      setTimeout(revealHero, 80);
    }
  };

  const heroSection = document.getElementById("header");
  let firstLoad = true;

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (firstLoad) {
            initReveal();
            firstLoad = false;
          } else {
            // Soft re-animation on scroll back
            setTimeout(revealHero, 60);
          }
        } else if (!firstLoad) {
          resetHero();
        }
      });
    },
    { threshold: 0.2 },
  );

  if (heroSection) {
    heroObserver.observe(heroSection);
  } else {
    initReveal();
  }
})();

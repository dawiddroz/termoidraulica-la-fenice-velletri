/* ============================================================
   Termoidraulica La Fenice — main.js
   Tutto ciò che NON è GSAP: Lenis (retry-loop), nav, burger,
   anchor smooth, sticky CTA, safety net.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Lenis smooth scroll: UNA istanza ---------- */
  (function initLenis() {
    if (typeof Lenis === 'undefined') {
      if (window.__lenisRetries === undefined) window.__lenisRetries = 0;
      if (++window.__lenisRetries > 40) return;
      setTimeout(initLenis, 250);
      return;
    }

    window.lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return 1 - Math.pow(1 - t, 3); },
      smoothWheel: true
    });

    function raf(time) {
      window.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined' && !window.__lenisSynced) {
      window.lenis.on('scroll', ScrollTrigger.update);
      window.__lenisSynced = true;
    }
  })();

  /* ---------- Nav scrolled + sticky CTA ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    document.body.classList.toggle('is-scrolled', y > 12);

    var sticky = document.querySelector('.sticky-cta');
    var hero = document.querySelector('.hero');
    if (sticky) {
      var limit = hero ? hero.offsetHeight - 100 : 260;
      sticky.classList.toggle('is-visible', y > limit);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Burger mobile ---------- */
  var burger = document.querySelector('.nav__burger');
  var menu = document.querySelector('.nav__menu');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('is-open');
        burger.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Anchor link smooth (via Lenis se attivo) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      var raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
      var offset = (parseInt(raw, 10) || 80) * -1;

      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: offset, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Safety net: rivela tutto se GSAP non è mai partito ---------- */
  setTimeout(function () {
    if (window.__gsapReady) return;
    var els = document.querySelectorAll(
      '.reveal, .hero__badge, .hero__title .word > span, .hero__subtitle, .hero__cta, .hero__stats, .hero__scroll, .service-card, .trust__stat'
    );
    for (var i = 0; i < els.length; i++) {
      els[i].style.opacity = '1';
      els[i].style.transform = 'none';
    }
  }, 4000);
})();

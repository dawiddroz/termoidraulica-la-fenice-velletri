/* ============================================================
   Termoidraulica La Fenice — animations.js
   GSAP + ScrollTrigger: reveal bulletproof, stagger di gruppo,
   parallax sottile. Retry-loop 250ms (max 32).
   ============================================================ */
(function () {
  'use strict';

  var retries = 0;

  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      if (++retries > 32) return;
      setTimeout(initGSAP, 250);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (window.lenis && !window.__lenisSynced) {
      window.lenis.on('scroll', ScrollTrigger.update);
      window.__lenisSynced = true;
    }

    /* Pre-hide: il CSS ha .reveal { opacity: 1 } — questo evita il blink */
    gsap.set('.reveal', { opacity: 0, y: 40 });

    /* Reveal individuale bulletproof: fromTo in onEnter, set in onLeaveBack */
    document.querySelectorAll('.reveal').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: function () {
          gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        },
      });
    });

    /* Service cards: stagger di gruppo (niente classe .reveal su di loro) */
    gsap.set('.service-card', { opacity: 0, y: 44 });
    ScrollTrigger.create({
      trigger: '.services__grid',
      start: 'top 82%',
      once: true,
      onEnter: function () {
        gsap.fromTo('.service-card', { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out' });
      },
    });

    /* Trust stats: stagger di gruppo */
    gsap.set('.trust__stat', { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: '.trust__card',
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.fromTo('.trust__stat', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out' });
      },
    });

    /* Parallax sottile sull'immagine "chi siamo" */
    gsap.to('.about__media .img-placeholder img', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about__media',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    window.__gsapReady = true;
    ScrollTrigger.refresh();
  }

  initGSAP();
})();

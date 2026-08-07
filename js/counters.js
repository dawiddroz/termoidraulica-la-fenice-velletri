/* ============================================================
   Termoidraulica La Fenice — counters.js
   Contatori: IntersectionObserver + rAF + performance.now()
   Zero GSAP. Dati reali via data-attributi.
   ============================================================ */
(function () {
  'use strict';

  function initCounters() {
    document.querySelectorAll('.counter').forEach(function (el) {
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
      var animated = false;

      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            obs.disconnect();

            var start = performance.now();

            function tick() {
              var p = Math.min((performance.now() - start) / 1800, 1);
              var v = target * (1 - Math.pow(1 - p, 3));
              el.textContent = v.toFixed(decimals) + suffix;
              if (p < 1) {
                requestAnimationFrame(tick);
              } else {
                el.textContent = target.toFixed(decimals) + suffix;
              }
            }

            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.3 }).observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();

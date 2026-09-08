/* ==========================================================================
   BIOPI — Accessible FAQ accordion (single-open, animated, reduced-motion aware)
   ========================================================================== */
(function (w, d) {
  'use strict';

  function init() {
    var items = Array.prototype.slice.call(d.querySelectorAll('.faq__item'));
    if (!items.length) return;

    var reduce = function () {
      return w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    var panels = items.map(function (item) {
      return {
        btn: item.querySelector('.faq__q'),
        panel: item.querySelector('.faq__a')
      };
    }).filter(function (p) { return p.btn && p.panel; });

    function close(p) {
      p.btn.setAttribute('aria-expanded', 'false');
      p.panel.setAttribute('aria-hidden', 'true');
      if (reduce()) { p.panel.style.height = '0px'; return; }
      p.panel.style.height = p.panel.scrollHeight + 'px';
      void p.panel.offsetHeight;
      p.panel.style.height = '0px';
    }

    function open(p) {
      p.btn.setAttribute('aria-expanded', 'true');
      p.panel.setAttribute('aria-hidden', 'false');
      var target = p.panel.firstElementChild.offsetHeight;
      if (reduce()) { p.panel.style.height = 'auto'; return; }
      p.panel.style.height = target + 'px';
      var done = function (ev) {
        if (ev.propertyName !== 'height') return;
        if (p.btn.getAttribute('aria-expanded') === 'true') p.panel.style.height = 'auto';
        p.panel.removeEventListener('transitionend', done);
      };
      p.panel.addEventListener('transitionend', done);
    }

    panels.forEach(function (p, i) {
      close(p);

      p.btn.addEventListener('click', function () {
        var isOpen = p.btn.getAttribute('aria-expanded') === 'true';
        /* Single-open behaviour */
        panels.forEach(function (other) {
          if (other !== p && other.btn.getAttribute('aria-expanded') === 'true') close(other);
        });
        if (isOpen) close(p); else open(p);
      });

      /* Arrow-key roving between questions */
      p.btn.addEventListener('keydown', function (ev) {
        var next = null;
        if (ev.key === 'ArrowDown') next = panels[(i + 1) % panels.length];
        else if (ev.key === 'ArrowUp') next = panels[(i - 1 + panels.length) % panels.length];
        else if (ev.key === 'Home') next = panels[0];
        else if (ev.key === 'End') next = panels[panels.length - 1];
        if (next) { ev.preventDefault(); next.btn.focus(); }
      });
    });

    /* Re-measure open panels after a language change alters the text length */
    d.addEventListener('biopi:languagechange', function () {
      panels.forEach(function (p) {
        if (p.btn.getAttribute('aria-expanded') === 'true') p.panel.style.height = 'auto';
      });
    });

    /* Re-measure on resize */
    var t;
    w.addEventListener('resize', function () {
      clearTimeout(t);
      t = w.setTimeout(function () {
        panels.forEach(function (p) {
          if (p.btn.getAttribute('aria-expanded') === 'true') p.panel.style.height = 'auto';
        });
      }, 150);
    }, { passive: true });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);

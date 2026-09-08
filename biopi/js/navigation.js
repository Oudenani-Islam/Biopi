/* ==========================================================================
   BIOPI — Navigation: sticky state, accessible mobile menu, current page
   ========================================================================== */
(function (w, d) {
  'use strict';

  function init() {
    var header = d.querySelector('.site-header');
    var toggle = d.querySelector('.nav-toggle');
    var menu   = d.getElementById('mobile-menu');

    /* ---- Scrolled state on the floating navbar ---- */
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-scrolled', w.scrollY > 12);
      };
      onScroll();
      w.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Mark the current page in both navs ---- */
    var here = d.body.getAttribute('data-page');
    d.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.getAttribute('data-nav') === here) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (!toggle || !menu) return;

    /* ---- Mobile menu ---- */
    var open = false;
    var reduce = function () {
      return w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    function labelToggle() {
      var i18n = w.BIOPI && w.BIOPI.i18n;
      var key = open ? 'nav.aria.toggleClose' : 'nav.aria.toggleOpen';
      toggle.setAttribute('aria-label', i18n ? i18n.t(key) : (open ? 'Close menu' : 'Open menu'));
    }

    function setOpen(state) {
      open = state;
      toggle.setAttribute('aria-expanded', String(open));
      labelToggle();

      if (open) {
        menu.classList.add('is-open');
        menu.style.height = reduce() ? 'auto' : menu.scrollHeight + 'px';
        if (!reduce()) {
          w.setTimeout(function () { if (open) menu.style.height = 'auto'; }, 340);
        }
      } else {
        if (!reduce() && menu.style.height === 'auto') {
          menu.style.height = menu.scrollHeight + 'px';
          void menu.offsetHeight; /* force reflow before collapsing */
        }
        menu.classList.remove('is-open');
        menu.style.height = '0px';
      }
    }

    setOpen(false);
    labelToggle();
    d.addEventListener('biopi:languagechange', labelToggle);

    toggle.addEventListener('click', function () { setOpen(!open); });

    /* Close on link activation, Escape, outside click, or resize to desktop */
    menu.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) setOpen(false);
    });

    d.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && open) { setOpen(false); toggle.focus(); }
    });

    d.addEventListener('click', function (ev) {
      if (!open) return;
      if (menu.contains(ev.target) || toggle.contains(ev.target)) return;
      setOpen(false);
    });

    var mq = w.matchMedia('(min-width: 901px)');
    var onChange = function (e) { if (e.matches && open) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);

    /* Keep the panel height accurate when the language (and text) changes */
    d.addEventListener('biopi:languagechange', function () {
      if (open) menu.style.height = 'auto';
    });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);

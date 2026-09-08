/* ==========================================================================
   BIOPI — Custom lightweight i18n (vanilla JS, no dependencies)
   --------------------------------------------------------------------------
   Usage in markup:
     <span data-i18n="nav.home">Home</span>          → textContent
     <p data-i18n-html="x.y">…</p>                   → innerHTML (limited markup)
     <input data-i18n-attr="placeholder:form.ph">    → attribute(s), comma-sep
     <body data-page="home">                         → selects meta.<page>.* keys
   ========================================================================== */
(function (w, d) {
  'use strict';

  var STORAGE_KEY = 'biopi.lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'fr'];

  var I18n = {
    lang: DEFAULT_LANG,

    dict: function (lang) {
      return (w.BIOPI_I18N && w.BIOPI_I18N[lang]) || {};
    },

    /** Translate a key with fallback to English, then to the key itself. */
    t: function (key, lang) {
      var l = lang || this.lang;
      var v = this.dict(l)[key];
      if (v === undefined) v = this.dict(DEFAULT_LANG)[key];
      return v === undefined ? key : v;
    },

    /** Read the stored preference, else the browser hint, else the default. */
    resolveInitial: function () {
      var stored = null;
      try { stored = w.localStorage.getItem(STORAGE_KEY); } catch (e) {}
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;

      var nav = (w.navigator.language || w.navigator.userLanguage || '').toLowerCase();
      if (nav.indexOf('fr') === 0) return 'fr';
      return DEFAULT_LANG;
    },

    persist: function (lang) {
      try { w.localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    },

    /** Apply translations across the current document. */
    apply: function (lang) {
      var self = this;
      this.lang = SUPPORTED.indexOf(lang) !== -1 ? lang : DEFAULT_LANG;

      /* Document language attribute */
      d.documentElement.setAttribute('lang', this.lang);

      /* Text nodes */
      d.querySelectorAll('[data-i18n]').forEach(function (el) {
        el.textContent = self.t(el.getAttribute('data-i18n'));
      });

      /* Rich text nodes */
      d.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        el.innerHTML = self.t(el.getAttribute('data-i18n-html'));
      });

      /* Attributes: "aria-label:key, placeholder:key2" */
      d.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
        el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
          var parts = pair.split(':');
          if (parts.length !== 2) return;
          el.setAttribute(parts[0].trim(), self.t(parts[1].trim()));
        });
      });

      this.applyMeta();
      this.syncSwitchers();

      /* Notify other modules (nav labels, form messages, accordions…) */
      d.dispatchEvent(new CustomEvent('biopi:languagechange', { detail: { lang: this.lang } }));
    },

    /** Translate SEO metadata for the current page. */
    applyMeta: function () {
      var page = d.body && d.body.getAttribute('data-page');
      if (!page) return;

      var title = this.t('meta.' + page + '.title');
      if (title.indexOf('meta.') !== 0) d.title = title;

      var map = [
        ['meta[name="description"]',        'content', 'meta.' + page + '.description'],
        ['meta[property="og:title"]',       'content', 'meta.' + page + '.ogTitle'],
        ['meta[property="og:description"]', 'content', 'meta.' + page + '.ogDescription'],
        ['meta[property="og:locale"]',      'content', null],
        ['meta[name="twitter:title"]',      'content', 'meta.' + page + '.ogTitle'],
        ['meta[name="twitter:description"]','content', 'meta.' + page + '.ogDescription']
      ];

      var self = this;
      map.forEach(function (row) {
        var el = d.querySelector(row[0]);
        if (!el) return;
        if (row[2] === null) {
          el.setAttribute(row[1], self.lang === 'fr' ? 'fr_FR' : 'en_GB');
          return;
        }
        var val = self.t(row[2]);
        if (val.indexOf('meta.') !== 0) el.setAttribute(row[1], val);
      });

      /* og:title on the home page falls back to the document title */
      var ogT = d.querySelector('meta[property="og:title"]');
      if (ogT && !ogT.getAttribute('content')) ogT.setAttribute('content', d.title);
    },

    /** Keep every switcher in the page (nav + footer) in the same state. */
    syncSwitchers: function () {
      var lang = this.lang;
      d.querySelectorAll('[data-lang-switch]').forEach(function (group) {
        group.setAttribute('data-active', lang);
        group.querySelectorAll('[data-lang]').forEach(function (btn) {
          btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
        });
      });
    },

    /** Public setter used by the UI. */
    set: function (lang) {
      if (lang === this.lang) return;
      var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduce) {
        this.persist(lang);
        this.apply(lang);
        return;
      }

      var self = this;
      d.body.classList.add('lang-fading');
      w.setTimeout(function () {
        self.persist(lang);
        self.apply(lang);
        w.setTimeout(function () { d.body.classList.remove('lang-fading'); }, 20);
      }, 130);
    },

    init: function () {
      var initial = this.resolveInitial();
      this.apply(initial);
      this.persist(initial);

      /* Delegate clicks from any switcher, anywhere in the page. */
      d.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-lang]');
        if (!btn) return;
        ev.preventDefault();
        I18n.set(btn.getAttribute('data-lang'));
      });

      /* Keep tabs in sync if the user changes language elsewhere. */
      w.addEventListener('storage', function (ev) {
        if (ev.key === STORAGE_KEY && ev.newValue && ev.newValue !== I18n.lang) {
          I18n.apply(ev.newValue);
        }
      });
    }
  };

  w.BIOPI = w.BIOPI || {};
  w.BIOPI.i18n = I18n;

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', function () { I18n.init(); });
  } else {
    I18n.init();
  }
})(window, document);

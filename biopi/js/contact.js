/* ==========================================================================
   BIOPI — Contact form: accessible validation, error/success states.
   No submission is faked: the form reports honestly that no backend is wired,
   and is structured so `submitToBackend()` can be implemented later.
   ========================================================================== */
(function (w, d) {
  'use strict';

  function init() {
    var form = d.getElementById('contact-form');
    if (!form) return;

    var statusBox = d.getElementById('form-status');
    var i18n = function (k) {
      return (w.BIOPI && w.BIOPI.i18n) ? w.BIOPI.i18n.t(k) : k;
    };

    var rules = {
      name:    function (v) { return v.trim().length >= 2 ? null : 'contact.form.err.name'; },
      email:   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'contact.form.err.email'; },
      subject: function (v) { return v ? null : 'contact.form.err.subject'; },
      message: function (v) { return v.trim().length >= 20 ? null : 'contact.form.err.message'; }
    };

    function fieldOf(input) { return input.closest('.field'); }

    function showError(input, key) {
      var wrap = fieldOf(input);
      wrap.classList.add('field--error');
      input.setAttribute('aria-invalid', 'true');
      var msg = wrap.querySelector('.field__error');
      if (msg) { msg.textContent = i18n(key); msg.setAttribute('data-i18n', key); }
    }

    function clearError(input) {
      var wrap = fieldOf(input);
      wrap.classList.remove('field--error');
      input.removeAttribute('aria-invalid');
      var msg = wrap.querySelector('.field__error');
      if (msg) { msg.textContent = ''; msg.removeAttribute('data-i18n'); }
    }

    function validateField(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var err = rule(input.value);
      if (err) { showError(input, err); return false; }
      clearError(input);
      return true;
    }

    function setStatus(key, tone) {
      if (!statusBox) return;
      statusBox.textContent = i18n(key);
      statusBox.setAttribute('data-i18n', key);
      statusBox.setAttribute('data-tone', tone);
      statusBox.classList.add('is-visible');
    }

    /* Validate on blur once the user has left a field; re-validate as they fix it */
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input).classList.contains('field--error')) validateField(input);
      });
    });

    /**
     * Placeholder for a future backend integration, e.g.:
     *   return fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'},
     *                                  body: JSON.stringify(payload) });
     * Returns null while no endpoint is configured.
     */
    function submitToBackend(/* payload */) {
      return null;
    }

    form.setAttribute('novalidate', 'novalidate');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        setStatus('contact.form.status.invalid', 'err');
        firstInvalid.focus();
        return;
      }

      var payload = {
        name: form.elements.name.value.trim(),
        organisation: form.elements.organisation ? form.elements.organisation.value.trim() : '',
        email: form.elements.email.value.trim(),
        subject: form.elements.subject.value,
        message: form.elements.message.value.trim(),
        lang: (w.BIOPI && w.BIOPI.i18n) ? w.BIOPI.i18n.lang : 'en'
      };

      var request = submitToBackend(payload);

      if (!request) {
        /* Honest state — nothing was transmitted. */
        setStatus('contact.form.status.pending', 'err');
        if (statusBox) statusBox.focus && statusBox.focus();
        return;
      }

      request
        .then(function () { setStatus('contact.form.status.ok', 'ok'); form.reset(); })
        .catch(function () { setStatus('contact.form.status.pending', 'err'); });
    });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);

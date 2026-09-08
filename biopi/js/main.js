/* ==========================================================================
   BIOPI — Shared behaviour: scroll reveal, hero video handling, footer year
   ========================================================================== */
(function (w, d) {
  'use strict';

  var reduce = function () {
    return w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* ---- Remove deprecated recognition strip and clinical statistics note -- */
  function removeDeprecatedContent() {
    d.querySelectorAll('.recognition').forEach(function (el) {
      el.remove();
    });

    d.querySelectorAll('[data-i18n="need.note"], .placeholder-note[data-i18n="need.note"]').forEach(function (el) {
      el.remove();
    });
  }

  /* ---- Unmet Need: restore the original editorial reveal sequence -------- */
  function initNeedReveal() {
    var section = d.querySelector('[aria-labelledby="need-h"]');
    if (!section) return;

    var eyebrow = section.querySelector('.eyebrow');
    var heading = section.querySelector('#need-h');
    var paragraphs = section.querySelectorAll('.prose p');
    var items = section.querySelectorAll('.annot-list li');

    if (eyebrow) {
      eyebrow.setAttribute('data-reveal', 'left');
      eyebrow.setAttribute('data-reveal-delay', '1');
    }
    if (heading) {
      heading.setAttribute('data-reveal', 'fade');
      heading.setAttribute('data-reveal-delay', '2');
    }
    paragraphs.forEach(function (p, index) {
      p.setAttribute('data-reveal', 'fade');
      p.setAttribute('data-reveal-delay', String(index + 3));
    });
    items.forEach(function (item, index) {
      item.setAttribute('data-reveal', 'fade');
      item.setAttribute('data-reveal-delay', String(index + 6));
    });
  }

  /* ---- Awards / Recognition ------------------------------------------- */
  function initAwards() {
    var hero = d.querySelector('.hero');
    var main = d.querySelector('main');
    if (!main || !hero || d.querySelector('.awards-section')) return;

    var section = d.createElement('section');
    section.className = 'section section--white awards-section';
    section.setAttribute('aria-labelledby', 'awards-h');
    section.innerHTML = [
      '<div class="shell">',
        '<div class="awards__intro" data-reveal>',
          '<p class="eyebrow">Awards / Recognition</p>',
          '<h2 id="awards-h">Recognition milestones</h2>',
        '</div>',
        '<ol class="awards__list">',
          '<li class="award" data-reveal data-reveal-delay="1">',
            '<div class="award__year">2024</div>',
            '<div class="award__content"><h3>Deep Impact Award — Jury Special Prize</h3></div>',
          '</li>',
          '<li class="award" data-reveal data-reveal-delay="2">',
            '<div class="award__year">2025</div>',
            '<div class="award__content"><h3>Selected Top 5 MedTech/Biotech at Tech&amp;Fest</h3></div>',
          '</li>',
          '<li class="award" data-reveal data-reveal-delay="3">',
            '<div class="award__year">2026</div>',
            '<div class="award__content"><h3>SATT Linksium incubation approved</h3></div>',
          '</li>',
        '</ol>',
      '</div>'
    ].join('');

    hero.insertAdjacentElement('afterend', section);

    var translations = {
      en: {
        eyebrow: 'Awards / Recognition',
        heading: 'Recognition milestones',
        titles: [
          'Deep Impact Award — Jury Special Prize',
          'Selected Top 5 MedTech/Biotech at Tech&Fest',
          'SATT Linksium incubation approved'
        ]
      },
      fr: {
        eyebrow: 'Prix / Reconnaissance',
        heading: 'Jalons de reconnaissance',
        titles: [
          'Deep Impact Award — Jury Special Prize',
          'Selected Top 5 MedTech/Biotech at Tech&Fest',
          'SATT Linksium incubation approved'
        ]
      }
    };

    function applyAwardsLanguage() {
      var lang = w.BIOPI && w.BIOPI.i18n ? w.BIOPI.i18n.lang : 'en';
      var copy = translations[lang] || translations.en;
      var eyebrow = section.querySelector('.eyebrow');
      var heading = section.querySelector('#awards-h');
      var titles = section.querySelectorAll('.award h3');
      if (eyebrow) eyebrow.textContent = copy.eyebrow;
      if (heading) heading.textContent = copy.heading;
      titles.forEach(function (title, index) {
        if (copy.titles[index]) title.textContent = copy.titles[index];
      });
    }

    applyAwardsLanguage();
    d.addEventListener('biopi:languagechange', applyAwardsLanguage);
  }

  /* ---- Home Team ------------------------------------------------------- */
  function initTeam() {
    var section = d.querySelector('[aria-labelledby="lead-h"]');
    if (!section || d.body.dataset.page !== 'home') return;

    var team = d.createElement('section');
    team.className = 'section section--white team-section';
    team.id = 'team';
    team.setAttribute('aria-labelledby', 'team-h');
    team.innerHTML = [
      '<div class="shell">',
        '<div class="team-intro" data-reveal>',
          '<p class="eyebrow">Team</p>',
          '<h2 id="team-h">The people behind BIOPI</h2>',
          '<p class="lede">BIOPI brings together entrepreneurial and scientific leadership to advance its implantable bioartificial pancreas platform.</p>',
        '</div>',
        '<div class="team-profiles">',
          '<article class="team-profile" data-reveal data-reveal-delay="1">',
            '<div class="team-profile__media">',
              '<span class="team-profile__index" aria-hidden="true">01</span>',
              '<img src="assets/img/ibrahim-shalalel.webp" alt="Ibrahim Shalalel" loading="lazy" decoding="async">',
            '</div>',
            '<div class="team-profile__body">',
              '<h3>Ibrahim Shalalel</h3>',
              '<p class="team-profile__role">ENTREPRENEUR · RESEARCHER</p>',
              '<div class="team-profile__bio">',
                '<p>Science should not remain in the lab when it can change lives and create a lasting impact on society. After decades of research toward an effective implantable bioartificial pancreas, BIOPI is bringing this vision closer to reality. While many focus on encapsulating cells, we focus on creating a home for them; where they can survive and function.</p>',
                '<p>We are not simply developing a technology... we are building a French deeptech company with the ambition to offer a brighter future for people living with type 1 diabetes.</p>',
              '</div>',
            '</div>',
          '</article>',
          '<article class="team-profile" data-reveal data-reveal-delay="2">',
            '<div class="team-profile__media">',
              '<span class="team-profile__index" aria-hidden="true">02</span>',
              '<img src="assets/img/abdelkader-zebda.webp" alt="Pr. Abdelkader Zebda" loading="lazy" decoding="async">',
            '</div>',
            '<div class="team-profile__body">',
              '<h3>Pr. Abdelkader Zebda</h3>',
              '<p class="team-profile__role">PROJECT SCIENTIFIC LEADER (PI) · TIMC · UNIVERSITÉ GRENOBLE ALPES</p>',
              '<div class="team-profile__bio">',
                '<p>The BIOPI project builds on years of research in bioelectrochemistry and implantable systems. Our objective is to design a robust and reliable platform capable of protecting insulin-secreting cells while ensuring their long-term function.</p>',
                '<p>Building on promising in vitro and in vivo results, our priority is now to translate this laboratory innovation into meaningful clinical impact.</p>',
              '</div>',
            '</div>',
          '</article>',
        '</div>',
      '</div>'
    ].join('');

    section.replaceWith(team);

    function applyTeamLanguage() {
      var lang = w.BIOPI && w.BIOPI.i18n ? w.BIOPI.i18n.lang : 'en';
      var intro = team.querySelector('.team-intro');
      var eyebrow = team.querySelector('.eyebrow');
      var heading = team.querySelector('#team-h');
      var lede = team.querySelector('.lede');
      if (lang === 'fr') {
        if (eyebrow) eyebrow.textContent = 'Équipe';
        if (heading) heading.textContent = 'Les personnes derrière BIOPI';
        if (lede) lede.textContent = 'BIOPI réunit un leadership entrepreneurial et scientifique pour faire progresser sa plateforme de pancréas bioartificiel implantable.';
      } else {
        if (eyebrow) eyebrow.textContent = 'Team';
        if (heading) heading.textContent = 'The people behind BIOPI';
        if (lede) lede.textContent = 'BIOPI brings together entrepreneurial and scientific leadership to advance its implantable bioartificial pancreas platform.';
      }
      if (intro) intro.setAttribute('data-lang', lang);
    }

    applyTeamLanguage();
    d.addEventListener('biopi:languagechange', applyTeamLanguage);
  }

  /* ---- Remove the standalone Team destination everywhere ---------------- */
  function cleanTeamNavigation() {
    d.querySelectorAll('a[href="team.html"], a[href="./team.html"], a[href="/team.html"]').forEach(function (link) {
      link.setAttribute('href', d.body.dataset.page === 'home' ? '#team' : 'index.html#team');
    });
  }

  /* ---- Scroll reveal --------------------------------------------------- */
  function initReveal() {
    var nodes = d.querySelectorAll('[data-reveal], .visual-frame');
    if (!nodes.length) return;

    if (reduce() || !('IntersectionObserver' in w)) {
      nodes.forEach(function (n) { n.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---- Hero video ------------------------------------------------------ */
  function initVideo() {
    var video = d.getElementById('hero-video');
    var frame = d.querySelector('.visual-frame');
    if (!video || !frame) return;

    var toggle = d.querySelector('.video-toggle');
    var fallback = frame.querySelector('.visual-fallback');

    function showFallback() {
      video.style.display = 'none';
      if (fallback) fallback.hidden = false;
      if (toggle) toggle.hidden = true;
    }

    if (reduce()) {
      video.removeAttribute('autoplay');
      video.pause();
      showFallback();
      return;
    }

    video.addEventListener('error', showFallback, true);
    var src = video.querySelector('source');
    if (src) src.addEventListener('error', showFallback);

    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        if (toggle) {
          toggle.hidden = false;
          toggle.textContent = (w.BIOPI && w.BIOPI.i18n) ? w.BIOPI.i18n.t('home.hero.videoPlay') : 'Play';
        }
      });
    }

    if (toggle) {
      var syncLabel = function () {
        var i18n = w.BIOPI && w.BIOPI.i18n;
        var key = video.paused ? 'home.hero.videoPlay' : 'home.hero.videoPause';
        toggle.textContent = i18n ? i18n.t(key) : (video.paused ? 'Play' : 'Pause');
      };
      toggle.addEventListener('click', function () {
        if (video.paused) video.play(); else video.pause();
        syncLabel();
      });
      video.addEventListener('play', syncLabel);
      video.addEventListener('pause', syncLabel);
      d.addEventListener('biopi:languagechange', syncLabel);
      syncLabel();
    }

    if ('IntersectionObserver' in w) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (video.dataset.userPaused === 'true') return;
          if (e.isIntersecting) { video.play().catch(function () {}); }
          else { video.pause(); }
        });
      }, { threshold: 0.15 });
      io.observe(frame);
    }
  }

  /* ---- Footer year ----------------------------------------------------- */
  function initYear() {
    d.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---- Partner logos: fall back to the institution name if a file is absent -- */
  function initPartners() {
    d.querySelectorAll('.partner__logo').forEach(function (img) {
      var fail = function () { img.closest('.partner').classList.add('partner--nologo'); };
      if (img.complete && img.naturalWidth === 0) { fail(); return; }
      img.addEventListener('error', fail);
    });
  }

  function init() {
    removeDeprecatedContent();
    cleanTeamNavigation();
    initNeedReveal();
    initAwards();
    initTeam();
    initReveal();
    initVideo();
    initYear();
    initPartners();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);

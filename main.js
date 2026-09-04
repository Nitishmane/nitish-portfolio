/* Portfolio behavior: theme toggle, reading progress, staggered reveal,
   active nav, sticky header. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme toggle ────────────────────────────────────────
     No stored value means "follow the system", which is the
     default state; the toggle then pins the opposite of
     whatever is currently on screen. */
  var toggle = document.querySelector('.theme-toggle');

  function currentTheme() {
    var pinned = root.getAttribute('data-theme');
    if (pinned === 'dark' || pinned === 'light') return pinned;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncToggle() {
    if (toggle) toggle.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggle();
    });
    syncToggle();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncToggle);
  }

  /* ── Scroll reveal, staggered within each group ──────────
     Siblings that animate together get an incrementing --i so
     they arrive in sequence rather than all at once. */
  var revealables = document.querySelectorAll('.reveal');

  Array.prototype.forEach.call(document.querySelectorAll('.cards, .timeline, .skills, .hero'),
    function (group) {
      Array.prototype.forEach.call(group.querySelectorAll(':scope > .reveal'),
        function (el, i) { el.style.setProperty('--i', Math.min(i, 6)); });
    });

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(revealables, function (el) { revealer.observe(el); });
  }

  /* ── Active nav link ── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__list a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      var on = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ── Reading progress + header hairline ──────────────────
     One scroll listener drives both, rAF-throttled. */
  var header = document.querySelector('.site-header');
  var progress = document.querySelector('.progress');
  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.scrollY;

    if (header) header.classList.toggle('is-stuck', y > 8);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    // Called through window: a detached requestAnimationFrame reference throws.
    if (reduced) onFrame();
    else window.requestAnimationFrame(onFrame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onFrame();

  /* ── Footer year ── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

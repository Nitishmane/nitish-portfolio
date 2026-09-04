/* Portfolio behavior: theme toggle, scroll reveal, active nav, sticky header. */
(function () {
  'use strict';

  var root = document.documentElement;

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

  /* ── Scroll reveal ── */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ── Active nav link ── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__list a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ── Header hairline appears once the page scrolls ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Footer year ── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

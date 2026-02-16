/* ============================================================
   BillionaireCasual.com — Main JavaScript
   Interactions, animations, language switcher, scroll effects
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navigation ---- */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    if (!nav) return;

    // Add/remove scrolled state
    if (currentScrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Hide/show nav on scroll direction
    if (currentScrollY > 400) {
      if (currentScrollY > lastScrollY + 5) {
        nav.classList.add('nav--hidden');
      } else if (currentScrollY < lastScrollY - 5) {
        nav.classList.remove('nav--hidden');
      }
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('nav__toggle--open');
      mobileMenu.classList.toggle('mobile-menu--open');
      document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('nav__toggle--open');
        mobileMenu.classList.remove('mobile-menu--open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll Reveal Animations ---- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Brand Chart Bar Animation ---- */
  function initBrandCharts() {
    var bars = document.querySelectorAll('.brand-chart__bar-fill');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var width = target.getAttribute('data-width');
          if (width) {
            target.style.width = width + '%';
          }
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  /* ---- Counter Animation ---- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  /* ---- Tabs ---- */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (tabGroup) {
      var tabs = tabGroup.querySelectorAll('.tab');
      var panelContainer = document.querySelector('[data-tab-panels="' + tabGroup.getAttribute('data-tabs') + '"]');
      if (!panelContainer) return;
      var panels = panelContainer.querySelectorAll('.tab-panel');

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = this.getAttribute('data-tab');

          tabs.forEach(function (t) { t.classList.remove('tab--active'); });
          this.classList.add('tab--active');

          panels.forEach(function (p) {
            p.classList.remove('tab-panel--active');
            if (p.getAttribute('data-panel') === target) {
              p.classList.add('tab-panel--active');
            }
          });
        });
      });
    });
  }

  /* ---- Back to Top ---- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        btn.classList.add('back-to-top--visible');
      } else {
        btn.classList.remove('back-to-top--visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Ticker / Marquee Duplication ---- */
  function initTicker() {
    document.querySelectorAll('.ticker__track').forEach(function (track) {
      // Duplicate content for seamless loop
      var clone = track.innerHTML;
      track.innerHTML = clone + clone;
    });
  }

  /* ---- Interactive Uniform Preview ---- */
  function initUniformPreviews() {
    document.querySelectorAll('[data-uniform-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.querySelector('[data-uniform="' + this.getAttribute('data-uniform-toggle') + '"]');
        if (target) {
          target.classList.toggle('uniform-detail--open');
        }
      });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var hash = this.getAttribute('href');
        if (hash === '#') return;
        var target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          var offset = 80; // nav height
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });

          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
            navToggle.classList.remove('nav__toggle--open');
            mobileMenu.classList.remove('mobile-menu--open');
            document.body.style.overflow = '';
          }
        }
      });
    });
  }

  /* ---- Image lazy loading fallback ---- */
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) return; // native support

    var images = document.querySelectorAll('img[loading="lazy"]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src || img.src;
          observer.unobserve(img);
        }
      });
    });

    images.forEach(function (img) { observer.observe(img); });
  }

  /* ---- Language Switcher ---- */
  function initLanguageSwitcher() {
    document.querySelectorAll('.lang-switcher__btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var lang = this.getAttribute('data-lang');
        var currentPath = window.location.pathname;

        // Determine base and page
        var pathParts = currentPath.split('/').filter(Boolean);
        var knownLangs = ['en', 'es', 'fr'];
        var page = '';

        if (knownLangs.indexOf(pathParts[0]) !== -1) {
          page = pathParts.slice(1).join('/');
        } else {
          page = pathParts.join('/');
        }

        var newPath;
        if (lang === 'en') {
          // English is root
          newPath = '/' + (page || 'index.html');
        } else {
          newPath = '/' + lang + '/' + (page || 'index.html');
        }

        // Normalize
        if (newPath.indexOf('.html') === -1 && newPath.charAt(newPath.length - 1) !== '/') {
          newPath += '.html';
        }

        window.location.href = newPath;
      });
    });
  }

  /* ---- Initialize Everything ---- */
  function init() {
    initReveal();
    initBrandCharts();
    initCounters();
    initTabs();
    initBackToTop();
    initTicker();
    initUniformPreviews();
    initSmoothScroll();
    initLazyImages();
    initLanguageSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

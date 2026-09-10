/* ============================================
   KIDS PLAY ZONE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const preloader = document.querySelector('.preloader');

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(function () {
        preloader.style.display = 'none';
        preloader.style.pointerEvents = 'none';
      }, 400);
    }
  }

  if (preloader) {
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 300);
    } else {
      window.addEventListener('load', function () {
        setTimeout(hidePreloader, 400);
      });
    }
    // Fallback: hide after 2s max
    setTimeout(hidePreloader, 2000);
  }

  // ========== Theme Toggle (Dark/Light) ==========
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const html = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem('kpz-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('kpz-theme', theme);
    themeToggleBtns.forEach(function (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    });
  }

  setTheme(getPreferredTheme());

  themeToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // ========== RTL/LTR Toggle ==========
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');

  function getPreferredDir() {
    return localStorage.getItem('kpz-dir') || 'ltr';
  }

  function setDirection(dir) {
    html.setAttribute('dir', dir);
    html.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem('kpz-dir', dir);
    rtlToggleBtns.forEach(function (btn) {
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  setDirection(getPreferredDir());

  rtlToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const current = html.getAttribute('dir');
      setDirection(current === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  // ========== Navbar Scroll Effect ==========
  const navbar = document.querySelector('.navbar-playzone');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ========== Active Nav Link on Scroll ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-playzone .nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ========== Mobile Menu ==========
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenuClose = document.querySelector('.mobile-close-btn');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  function openMobileMenu() {
    if (navbarCollapse) navbarCollapse.classList.add('show');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (navbarCollapse) navbarCollapse.classList.remove('show');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openMobileMenu();
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  // Mobile dropdown toggle handling without closing menu
  document.querySelectorAll('.navbar-collapse .dropdown-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth < 1200) {
        e.preventDefault();
        e.stopPropagation();
        const parent = toggle.closest('.dropdown');
        if (parent) {
          const isOpen = parent.classList.toggle('show');
          toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          const menu = parent.querySelector('.dropdown-menu');
          if (menu) {
            menu.classList.toggle('show', isOpen);
          }
        }
      }
    });
  });

  // Handle mobile menu navigation cleanly
  document.querySelectorAll('.navbar-collapse .nav-link:not(.dropdown-toggle), .navbar-collapse .dropdown-item, .navbar-collapse .mobile-nav-actions a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth < 1200) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            closeMobileMenu();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (href && href !== '#') {
          // Let browser begin page navigation, then close menu smoothly
          setTimeout(closeMobileMenu, 250);
        }
      }
    });
  });

  // ========== Back to Top ==========
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== Scroll Animations ==========
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  function checkScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    animateElements.forEach(function (el) {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('animated');
      }
    });
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // ========== Counter Animation ==========
  function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        counter.dataset.animated = 'true';
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function updateCounter() {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        }

        updateCounter();
      }
    });
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  // ========== Smooth Scroll for Anchor Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.querySelector('.navbar-playzone')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== Newsletter Form ==========
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check me-2"></i>Subscribed!';
        btn.classList.add('btn-accent-custom');
        btn.classList.remove('btn-white-custom');
        input.value = '';
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-accent-custom');
          btn.classList.add('btn-white-custom');
        }, 3000);
      }
    });
  });

  // ========== Contact Form ==========
  const contactForms = document.querySelectorAll('.contact-form');
  contactForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
        btn.classList.add('btn-accent-custom');
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-accent-custom');
          btn.disabled = false;
          form.reset();
        }, 3000);
      }, 1500);
    });
  });

  // ========== Bootstrap Tooltips & Popovers ==========
  const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggers.forEach(function (el) {
    new bootstrap.Tooltip(el);
  });

  const popoverTriggers = document.querySelectorAll('[data-bs-toggle="popover"]');
  popoverTriggers.forEach(function (el) {
    new bootstrap.Popover(el);
  });

  // ========== Testimonial Slider (Simple) ==========
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    const items = testimonialSlider.querySelectorAll('.testimonial-item');
    const prevBtn = testimonialSlider.querySelector('.slider-prev');
    const nextBtn = testimonialSlider.querySelector('.slider-next');
    let currentIndex = 0;

    function showTestimonial(index) {
      items.forEach(function (item, i) {
        item.style.display = i === index ? 'block' : 'none';
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showTestimonial(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % items.length;
        showTestimonial(currentIndex);
      });
    }

    showTestimonial(0);
  }

  // ========== Fun Facts Animation ==========
  const funFacts = document.querySelectorAll('.fun-fact-item');
  funFacts.forEach(function (fact) {
    fact.addEventListener('mouseenter', function () {
      const icon = this.querySelector('.fun-fact-icon');
      if (icon) {
        icon.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(function () {
          icon.style.transform = '';
        }, 600);
      }
    });
  });

  // ========== Parallax Effect for Hero ==========
  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const heroShapes = document.querySelectorAll('.hero-section .playful-shape');
    heroShapes.forEach(function (shape, index) {
      const speed = (index + 1) * 0.05;
      shape.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
  });

  // ========== Gallery Lightbox (Simple) ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (img) {
        const overlay = document.createElement('div');
        overlay.className = 'gallery-lightbox';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:fadeIn 0.3s ease;';

        const bigImg = document.createElement('img');
        bigImg.src = img.src;
        bigImg.alt = img.alt;
        bigImg.style.cssText = 'max-width:90%;max-height:90%;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = 'position:absolute;top:20px;right:20px;width:48px;height:48px;border-radius:50%;border:none;background:rgba(255,255,255,0.15);color:#fff;font-size:1.2rem;cursor:pointer;transition:all 0.3s;';

        overlay.appendChild(bigImg);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        function closeLightbox() {
          overlay.remove();
          document.body.style.overflow = '';
        }

        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeLightbox();
        });
        closeBtn.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', function handler(e) {
          if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handler);
          }
        });
      }
    });
  });

  // ========== Page Transition ==========
  document.body.classList.add('page-loaded');
});

// ========== Utility: Detect Touch Device ==========
if ('ontouchstart' in window) {
  document.documentElement.classList.add('touch-device');
}


// ========== Shared Navbar Active State ==========
document.addEventListener('DOMContentLoaded', function () {
  const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const links = nav.querySelectorAll('a.nav-link[href], .dropdown-menu a.dropdown-item[href]');
  links.forEach(function (link) {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });

  let matched = false;
  links.forEach(function (link) {
    const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
    if (!href || href === '#') return;
    const target = href.split('/').pop();
    if (target === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      matched = true;
      const dropdown = link.closest('.dropdown');
      if (dropdown) {
        const parent = dropdown.querySelector(':scope > .nav-link.dropdown-toggle');
        if (parent) parent.classList.add('active');
      }
    }
  });

  // Home is a grouped dropdown: keep it active on both Home pages.
  if (current === 'index.html' || current === 'home2.html' || current === '') {
    const home = nav.querySelector('.dropdown > .nav-link.dropdown-toggle');
    if (home) home.classList.add('active');
    const homeItem = nav.querySelector('.dropdown-menu a[href="' + current + '"], .dropdown-menu a[href="index.html"]');
    if (homeItem) homeItem.classList.add('active');
  }
});

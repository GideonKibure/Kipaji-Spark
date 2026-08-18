/**
 * assets/js/pages/donate.js
 * Kipaji Spark — Donate Page Specific Interactivity
 * Handles progress bar animations, form validation,
 * and interactive card enhancements.
 */

(function () {
  'use strict';

  /**
   * Utility: Safely select a single element or null
   */
  const $ = (selector, parent = document) => parent.querySelector(selector);

  /**
   * Utility: Safely select all elements
   */
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  /**
   * Bootstrap: only run if we're on the donate page
   */
  const donatePage = $('.donate-page');
  if (!donatePage) return;

  document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initNewsletterForm();
    initCTANewsletterForm();
    initCardTriggers();
    initInViewEnhancements();
    initParallaxShapes();
  });

  /* ----------------------------------------------------------------
   * 1. Progress Bar Animation
   * ---------------------------------------------------------------- */
  function initProgressBar() {
    const progressFill = $('.progress-fill');
    if (!progressFill) return;

    const targetWidth = progressFill.style.width || '78%';

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            setTimeout(function() {
              progressFill.style.width = targetWidth;
            }, 300);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.3
      });

      const progressSection = $('.progress-section');
      if (progressSection) {
        observer.observe(progressSection);
      }
    } else {
      // Fallback: animate immediately
      setTimeout(function() {
        progressFill.style.width = targetWidth;
      }, 300);
    }
  }

  /* ----------------------------------------------------------------
   * 2. Main Newsletter Form (Footer)
   * ---------------------------------------------------------------- */
  function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('.btn');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = input.value.trim();
      
      if (!email) {
        input.style.borderColor = '#ff4444';
        input.style.boxShadow = '0 0 0 4px rgba(255, 68, 68, 0.1)';
        input.placeholder = 'Please enter your email';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
          input.placeholder = 'Your email';
        }, 3000);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        input.style.borderColor = '#ff4444';
        input.style.boxShadow = '0 0 0 4px rgba(255, 68, 68, 0.1)';
        input.value = '';
        input.placeholder = 'Please enter a valid email';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
          input.placeholder = 'Your email';
        }, 3000);
        return;
      }

      const originalText = button.textContent;
      button.textContent = '✓ Subscribed!';
      button.style.background = '#4CAF50';
      button.style.borderColor = '#4CAF50';
      input.value = '';
      input.placeholder = 'Thanks for subscribing!';

      const successMessage = document.createElement('div');
      successMessage.className = 'subscribe-success';
      successMessage.textContent = '🎉 Thank you for subscribing!';
      successMessage.style.cssText = `
        margin-top: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        color: #4CAF50;
        animation: fadeInUp 0.5s ease;
      `;
      form.appendChild(successMessage);

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.borderColor = '';
        input.placeholder = 'Your email';
        successMessage.remove();
      }, 4000);
    });

    input.addEventListener('focus', function() {
      this.style.borderColor = '#2E1065';
      this.style.boxShadow = '0 0 0 4px rgba(46, 16, 101, 0.1)';
    });

    input.addEventListener('blur', function() {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });
  }

  /* ----------------------------------------------------------------
   * 3. CTA Newsletter Form (Donate Page)
   * ---------------------------------------------------------------- */
  function initCTANewsletterForm() {
    const form = document.getElementById('ctaNewsletterForm');
    if (!form) return;

    const input = document.getElementById('ctaEmail');
    const button = form.querySelector('.btn');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = input.value.trim();
      
      if (!email) {
        input.style.borderColor = '#ff4444';
        input.style.boxShadow = '0 0 0 4px rgba(255, 68, 68, 0.2)';
        input.placeholder = 'Please enter your email';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
          input.placeholder = 'Enter your email address';
        }, 3000);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        input.style.borderColor = '#ff4444';
        input.style.boxShadow = '0 0 0 4px rgba(255, 68, 68, 0.2)';
        input.value = '';
        input.placeholder = 'Please enter a valid email';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
          input.placeholder = 'Enter your email address';
        }, 3000);
        return;
      }

      const originalText = button.textContent;
      button.textContent = '✅ Subscribed!';
      button.style.background = '#4CAF50';
      button.style.borderColor = '#4CAF50';
      input.value = '';
      input.placeholder = 'You\'re on the list!';

      const successMessage = document.createElement('div');
      successMessage.className = 'cta-subscribe-success';
      successMessage.textContent = '🎉 Thank you! We\'ll notify you when we launch.';
      successMessage.style.cssText = `
        margin-top: 16px;
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        color: #4CAF50;
        animation: fadeInUp 0.5s ease;
      `;
      form.appendChild(successMessage);

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.borderColor = '';
        input.placeholder = 'Enter your email address';
        successMessage.remove();
      }, 4000);
    });

    input.addEventListener('focus', function() {
      this.style.borderColor = '#F4B400';
      this.style.boxShadow = '0 0 0 4px rgba(244, 180, 0, 0.15)';
    });

    input.addEventListener('blur', function() {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });
  }

  /* ----------------------------------------------------------------
   * 4. Card Triggers & Interactions
   * ---------------------------------------------------------------- */
  function initCardTriggers() {
    const cards = $$('.donate-spotlight-card, .donate-feature-card, .intro-focus-card');
    
    cards.forEach(card => {
      // Add keyboard support
      card.setAttribute('tabindex', '0');
      
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const link = this.querySelector('.spotlight-card-link, a');
          if (link) {
            link.click();
          }
        }
      });
    });
  }

  /* ----------------------------------------------------------------
   * 5. In-View Enhancements
   * ---------------------------------------------------------------- */
  function initInViewEnhancements() {
    const elements = $$('.donate-spotlight-card, .donate-feature-card, .donate-cta-card, .quote-strip-item');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------------
   * 6. Parallax Decorative Shapes
   * ---------------------------------------------------------------- */
  function initParallaxShapes() {
    const shapes = $$('.deco-shape, .deco-purple-blob, .deco-yellow-blob');
    if (!shapes.length) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrolled = window.pageYOffset;
          shapes.forEach(function(shape, index) {
            const speed = 0.03 + (index * 0.01);
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------------
   * 7. Add fadeInUp animation if not already in styles
   * ---------------------------------------------------------------- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .subscribe-success,
    .cta-subscribe-success {
      animation: fadeInUp 0.5s ease forwards;
    }
  `;
  document.head.appendChild(style);

})();
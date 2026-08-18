/**
 * assets/js/pages/events.js
 * Kipaji Spark — Events Page Specific Interactivity
 * Handles event card interactions, filtering, FAQ accordion,
 * spotlight enhancements, and optional modal support.
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
   * Bootstrap: only run if we're on the events page
   */
  const eventsPage = $('.events-page');
  if (!eventsPage) return;

  document.addEventListener('DOMContentLoaded', () => {
    initEventCardInteractions();
    initEventFilters();
    initFaqAccordion();
    initSpotlightEnhancements();
    initEventModal();
    initParticipationHelpers();
  });

  /* ----------------------------------------------------------------
   * 1. Featured Event Card Click Enhancement
   * ---------------------------------------------------------------- */
  function initEventCardInteractions() {
    const cards = $$('.event-card');

    cards.forEach(card => {
      const primaryLink = $('.event-card-link', card);
      if (!primaryLink) return;

      // Make card clickable, but only if click target is not already interactive
      card.addEventListener('click', (e) => {
        const target = e.target;
        const interactiveSelectors = 'a, button, input, select, textarea, [role="button"]';
        if (target.closest(interactiveSelectors)) return;

        primaryLink.click();
      });

      // Keyboard support: treat card as focusable region
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', primaryLink.textContent?.trim() || 'View event details');

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          primaryLink.click();
        }
      });

      // Prevent double activation from native link
      primaryLink.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }

  /* ----------------------------------------------------------------
   * 2. Event Filter Tabs
   * ---------------------------------------------------------------- */
  function initEventFilters() {
    const filterContainer = $('.event-filter-tabs');
    if (!filterContainer) return;

    const filterButtons = $$('.event-filter-button', filterContainer);
    const eventCards = $$('[data-event-category]');

    if (filterButtons.length === 0 || eventCards.length === 0) return;

    function applyFilter(category) {
      eventCards.forEach(card => {
        const cardCategory = card.getAttribute('data-event-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    }

    function setActiveButton(activeBtn) {
      filterButtons.forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      activeBtn.classList.add('is-active');
      activeBtn.setAttribute('aria-pressed', 'true');
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.getAttribute('data-filter') || 'all';
        applyFilter(category);
        setActiveButton(button);
      });
    });

    // Initialize with "All" active if present
    const allButton = filterButtons.find(btn => btn.getAttribute('data-filter') === 'all');
    if (allButton) {
      applyFilter('all');
      setActiveButton(allButton);
    }
  }

  /* ----------------------------------------------------------------
   * 3. FAQ Accordion
   * ---------------------------------------------------------------- */
  function initFaqAccordion() {
    const faqSection = $('.event-faq');
    if (!faqSection) return;

    const faqItems = $$('.faq-item', faqSection);

    faqItems.forEach(item => {
      const question = $('.faq-question', item);
      const answer = $('.faq-answer', item);
      if (!question || !answer) return;

      // Set initial state
      question.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');
      answer.style.maxHeight = '0px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'max-height 0.35s ease';

      question.addEventListener('click', () => {
        const isOpen = question.getAttribute('aria-expanded') === 'true';

        // Close all other items (single open accordion)
        faqItems.forEach(otherItem => {
          const otherQuestion = $('.faq-question', otherItem);
          const otherAnswer = $('.faq-answer', otherItem);
          if (otherQuestion && otherAnswer && otherItem !== item) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.setAttribute('aria-hidden', 'true');
            otherAnswer.style.maxHeight = '0px';
          }
        });

        if (isOpen) {
          question.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
          answer.style.maxHeight = '0px';
        } else {
          question.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });

      // Recalculate max-height on resize
      window.addEventListener('resize', () => {
        if (question.getAttribute('aria-expanded') === 'true') {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ----------------------------------------------------------------
   * 4. Event Spotlight Progressive Enhancement
   * ---------------------------------------------------------------- */
  function initSpotlightEnhancements() {
    const spotlights = $$('.event-spotlight');
    if (spotlights.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const spotlight = entry.target;
          if (entry.isIntersecting) {
            spotlight.classList.add('is-in-view');
          } else {
            spotlight.classList.remove('is-in-view');
          }
        });
      },
      { threshold: 0.25 }
    );

    spotlights.forEach(spotlight => observer.observe(spotlight));
  }

  /* ----------------------------------------------------------------
   * 5. Event Modal / Drawer Support
   * ---------------------------------------------------------------- */
  function initEventModal() {
    const modal = $('.event-modal');
    if (!modal) return;

    const overlay = $('.event-modal-overlay', modal);
    const closeBtn = $('.event-modal-close', modal);
    const content = $('.event-modal-content', modal);
    const openTriggers = $$('[data-event-modal-open]');

    function openModal() {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Open via triggers
    openTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        // Optionally load content by data-event-id here
        openModal();
      });
    });

    // Close via overlay
    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    // Close via close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Prevent content clicks from closing
    if (content) {
      content.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  /* ----------------------------------------------------------------
   * 6. Participation / CTA Helpers
   * ---------------------------------------------------------------- */
  function initParticipationHelpers() {
    // Light uniform height for participation cards on desktop
    const cards = $$('.participate-card');
    if (cards.length === 0) return;

    function equalizeCardHeights() {
      if (window.innerWidth < 768) {
        cards.forEach(card => (card.style.minHeight = ''));
        return;
      }
      const heights = cards.map(card => card.getBoundingClientRect().height);
      const maxHeight = Math.max(...heights);
      cards.forEach(card => (card.style.minHeight = maxHeight + 'px'));
    }

    equalizeCardHeights();
    window.addEventListener('resize', equalizeCardHeights);
  }

})();
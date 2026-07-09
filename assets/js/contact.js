/**
 * assets/js/pages/contact.js
 * Kipaji Spark — Contact Page Specific Interactivity
 * Handles form validation, field state enhancement, inquiry guidance,
 * FAQ accordion, character counter, and in-view enhancements.
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
   * Bootstrap: only run if we're on the contact page
   */
  const contactPage = $('.contact-page');
  if (!contactPage) return;

  document.addEventListener('DOMContentLoaded', () => {
    initFormEnhancement();
    initRealTimeFieldState();
    initInquiryGuidance();
    initFaqAccordion();
    initCharacterCounter();
    initInViewEnhancements();
  });

  /* ----------------------------------------------------------------
   * 1. Form Enhancement & Lightweight Validation
   * ---------------------------------------------------------------- */
  function initFormEnhancement() {
    const form = $('.contact-form');
    if (!form) return;

    const statusEl = $('.contact-form-status');
    const isDemo = form.hasAttribute('data-demo-form') || form.getAttribute('data-demo-form') === 'true';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous status
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.classList.remove('is-error', 'is-success');
      }

      // Gather field values
      const fullName = ($('[name="fullName"]', form) || $('[name="full-name"]', form));
      const email = ($('[name="email"]', form));
      const message = ($('[name="message"]', form));

      const nameValue = fullName ? fullName.value.trim() : '';
      const emailValue = email ? email.value.trim() : '';
      const messageValue = message ? message.value.trim() : '';

      // Validate required fields
      const errors = [];

      if (!nameValue) {
        errors.push('Please enter your full name.');
        if (fullName) markFieldInvalid(fullName, true);
      } else {
        if (fullName) markFieldInvalid(fullName, false);
      }

      if (!emailValue) {
        errors.push('Please enter your email address.');
        if (email) markFieldInvalid(email, true);
      } else if (!isValidEmail(emailValue)) {
        errors.push('Please enter a valid email address.');
        if (email) markFieldInvalid(email, true);
      } else {
        if (email) markFieldInvalid(email, false);
      }

      if (!messageValue) {
        errors.push('Please enter your message.');
        if (message) markFieldInvalid(message, true);
      } else {
        if (message) markFieldInvalid(message, false);
      }

      if (errors.length > 0) {
        if (statusEl) {
          statusEl.textContent = errors.join(' ');
          statusEl.classList.add('is-error');
        }
        return;
      }

      // If demo mode, show success and optionally reset
      if (isDemo) {
        if (statusEl) {
          statusEl.textContent = 'Thank you! Your message has been received. (Demo mode)';
          statusEl.classList.add('is-success');
        }
        form.reset();
        // Remove has-value classes
        $$('.form-group input, .form-group textarea, .form-group select', form).forEach(field => {
          field.classList.remove('has-value');
        });
        return;
      }

      // Real backend mode: allow submission
      if (statusEl) {
        statusEl.textContent = 'Sending your message...';
        statusEl.classList.add('is-success');
      }
      // Optionally disable submit button briefly
      const submitBtn = $('button[type="submit"]', form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }, 3000);
      }
      // For actual backend integration, form.submit() would be called here
      // after the async request completes. Currently prevented by e.preventDefault().
    });

    function markFieldInvalid(field, isInvalid) {
      if (isInvalid) {
        field.classList.add('is-invalid');
      } else {
        field.classList.remove('is-invalid');
      }
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }

  /* ----------------------------------------------------------------
   * 2. Real-Time Field State Enhancement
   * ---------------------------------------------------------------- */
  function initRealTimeFieldState() {
    const fields = $$('.form-group input, .form-group textarea, .form-group select');
    if (fields.length === 0) return;

    fields.forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim().length > 0) {
          field.classList.add('has-value');
        } else {
          field.classList.remove('has-value');
        }
        // Remove invalid state on correction
        if (field.classList.contains('is-invalid') && field.value.trim().length > 0) {
          field.classList.remove('is-invalid');
        }
      });

      // Initialize state for pre-filled fields
      if (field.value.trim().length > 0) {
        field.classList.add('has-value');
      }
    });
  }

  /* ----------------------------------------------------------------
   * 3. Inquiry Type Conditional Guidance
   * ---------------------------------------------------------------- */
  function initInquiryGuidance() {
    const inquirySelect = $('[name="inquiryType"]') || $('[name="inquiry-type"]') || $('#inquiry-type');
    const helpTarget = $('.contact-inquiry-help');
    if (!inquirySelect || !helpTarget) return;

    const guidanceMap = {
      programs: 'Feel free to include the participant\'s age and area of interest so we can guide you to the right program.',
      events: 'Let us know the type of event, preferred dates, or how you\'d like us to be involved.',
      partnership: 'Please include your organization name and a brief idea of how you\'d like to collaborate.',
      volunteering: 'Share your skills, availability, and how you\'d like to contribute — we\'d love to hear from you.',
      mentorship: 'Tell us a bit about your background and how you\'d like to support young talent through mentorship.',
      support: 'Thank you for your generosity. Let us know if you have a specific area you\'d like to support.',
      general: 'We\'re happy to answer any questions. Feel free to share as much detail as you\'d like.',
      other: 'Let us know what\'s on your mind and how we can assist you.'
    };

    function updateGuidance() {
      const value = inquirySelect.value;
      const helpText = guidanceMap[value] || 'Please select an inquiry type, and we\'ll guide you on what to include.';
      helpTarget.textContent = helpText;
    }

    inquirySelect.addEventListener('change', updateGuidance);
    // Initial call
    updateGuidance();
  }

  /* ----------------------------------------------------------------
   * 4. FAQ Accordion
   * ---------------------------------------------------------------- */
  function initFaqAccordion() {
    const faqSection = $('.contact-faq-section');
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

        // Close all other items
        faqItems.forEach(otherItem => {
          const otherQuestion = $('.faq-question', otherItem);
          const otherAnswer = $('.faq-answer', otherItem);
          if (otherQuestion && otherAnswer && otherItem !== item) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.setAttribute('aria-hidden', 'true');
            otherAnswer.style.maxHeight = '0px';
            otherItem.classList.remove('is-open');
          }
        });

        if (isOpen) {
          question.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
          answer.style.maxHeight = '0px';
          item.classList.remove('is-open');
        } else {
          question.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          item.classList.add('is-open');
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
   * 5. Message Character Counter
   * ---------------------------------------------------------------- */
  function initCharacterCounter() {
    const messageField = $('[name="message"]');
    const counterEl = $('.contact-field-counter');
    if (!messageField || !counterEl) return;

    const maxLength = messageField.getAttribute('maxlength') ? parseInt(messageField.getAttribute('maxlength'), 10) : null;

    function updateCounter() {
      const current = messageField.value.length;
      if (maxLength) {
        counterEl.textContent = `${current} / ${maxLength}`;
      } else {
        counterEl.textContent = `${current} characters`;
      }
    }

    messageField.addEventListener('input', updateCounter);
    updateCounter();
  }

  /* ----------------------------------------------------------------
   * 6. In-View Enhancements
   * ---------------------------------------------------------------- */
  function initInViewEnhancements() {
    const elements = $$('.contact-overview-card, .contact-reason-card, .contact-info-card, .faq-item');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
          } else {
            entry.target.classList.remove('is-in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
  }

})();


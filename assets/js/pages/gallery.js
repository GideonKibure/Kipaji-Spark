/**
 * assets/js/pages/gallery.js
 * Kipaji Spark — Gallery Page Specific Interactivity
 * Handles gallery filtering, lightbox viewer, in-view enhancements,
 * and gallery card interactions.
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
   * Bootstrap: only run if we're on the gallery page
   */
  const galleryPage = $('.gallery-page');
  if (!galleryPage) return;

  document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilters();
    initGalleryLightbox();
    initGalleryCardTriggers();
    initInViewEnhancements();
    initGalleryCounter();
  });

  /* ----------------------------------------------------------------
   * 1. Gallery Filtering
   * ---------------------------------------------------------------- */
  function initGalleryFilters() {
    const filterContainer = $('.gallery-filter-tabs');
    if (!filterContainer) return;

    const filterButtons = $$('.gallery-filter-button', filterContainer);
    const galleryItems = $$('.gallery-item[data-category]');

    if (filterButtons.length === 0 || galleryItems.length === 0) return;

    function applyFilter(category) {
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
      // Update counter if present
      updateGalleryCounter(category);
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

    // Initialize with "All" active
    const allButton = filterButtons.find(btn => btn.getAttribute('data-filter') === 'all');
    if (allButton) {
      applyFilter('all');
      setActiveButton(allButton);
    }
  }

  /* ----------------------------------------------------------------
   * 2. Gallery Lightbox / Expanded Viewer
   * ---------------------------------------------------------------- */
  function initGalleryLightbox() {
    const lightbox = $('.gallery-lightbox');
    if (!lightbox) return;

    const overlay = $('.gallery-lightbox-overlay', lightbox);
    const closeBtn = $('.gallery-lightbox-close', lightbox);
    const content = $('.gallery-lightbox-content', lightbox);
    const imageEl = $('.gallery-lightbox-image', lightbox);
    const captionEl = $('.gallery-lightbox-caption', lightbox);
    const prevBtn = $('.gallery-lightbox-prev', lightbox);
    const nextBtn = $('.gallery-lightbox-next', lightbox);

    const galleryItems = $$('.gallery-item[data-category]');
    let currentIndex = -1;

    function openLightbox(index) {
      if (index < 0 || index >= galleryItems.length) return;
      currentIndex = index;
      const item = galleryItems[index];
      const imageSrc = item.getAttribute('data-gallery-image');
      const caption = item.getAttribute('data-caption') || '';

      if (imageEl && imageSrc) {
        imageEl.src = imageSrc;
        imageEl.alt = caption || 'Gallery image';
      }
      if (captionEl) {
        captionEl.textContent = caption;
      }
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      currentIndex = -1;
    }

    function showNext() {
      if (galleryItems.length === 0) return;
      const nextIndex = (currentIndex + 1) % galleryItems.length;
      openLightbox(nextIndex);
    }

    function showPrev() {
      if (galleryItems.length === 0) return;
      const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(prevIndex);
    }

    // Attach click handlers to gallery items
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        // Don't open lightbox if click originated from a filter or other interactive element
        if (e.target.closest('a, button, input, select, textarea, [role="button"]')) return;
        if (item.hasAttribute('data-gallery-image')) {
          openLightbox(index);
        }
      });
      // Keyboard support for gallery items
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'View image in lightbox');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (item.hasAttribute('data-gallery-image')) {
            openLightbox(index);
          }
        }
      });
    });

    // Close handlers
    if (overlay) overlay.addEventListener('click', closeLightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Prevent content clicks from closing
    if (content) content.addEventListener('click', (e) => e.stopPropagation());

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    });
  }

  /* ----------------------------------------------------------------
   * 3. Gallery Card Click Triggers
   * ---------------------------------------------------------------- */
  function initGalleryCardTriggers() {
    const galleryItems = $$('.gallery-item');

    galleryItems.forEach(item => {
      // If lightbox is not present and items have links, make card clickable
      const lightboxExists = !!$('.gallery-lightbox');
      if (lightboxExists) return; // Lightbox handles its own click behavior

      const primaryLink = $('a', item);
      if (!primaryLink) return;

      item.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('a, button, input, select, textarea')) return;
        primaryLink.click();
      });

      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'link');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          primaryLink.click();
        }
      });
    });
  }

  /* ----------------------------------------------------------------
   * 4. In-View Enhancements
   * ---------------------------------------------------------------- */
  function initInViewEnhancements() {
    const elements = $$('.gallery-spotlight-card, .gallery-story, .gallery-item');
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
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------------
   * 5. Optional Gallery Counter / State Helper
   * ---------------------------------------------------------------- */
  function initGalleryCounter() {
    const counterEl = $('.gallery-counter');
    if (!counterEl) return;

    const galleryItems = $$('.gallery-item[data-category]');

    function updateCounter() {
      const visibleItems = galleryItems.filter(item => !item.classList.contains('is-hidden'));
      counterEl.textContent = `Showing ${visibleItems.length} of ${galleryItems.length} moments`;
    }

    updateCounter();

    // Observe filter changes via MutationObserver on gallery grid
    const grid = $('.gallery-masonry-grid') || $('.gallery-grid');
    if (grid) {
      const observer = new MutationObserver(() => updateCounter());
      observer.observe(grid, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }

    // Also update when filter buttons are clicked
    const filterButtons = $$('.gallery-filter-button');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(updateCounter, 100);
      });
    });
  }

  /**
   * Helper: update counter when filters are applied
   */
  function updateGalleryCounter(category) {
    const counterEl = $('.gallery-counter');
    if (!counterEl) return;

    const galleryItems = $$('.gallery-item[data-category]');
    let visibleCount;

    if (category === 'all') {
      visibleCount = galleryItems.length;
    } else {
      visibleCount = galleryItems.filter(item => item.getAttribute('data-category') === category).length;
    }

    counterEl.textContent = `Showing ${visibleCount} of ${galleryItems.length} moments`;
  }

})();
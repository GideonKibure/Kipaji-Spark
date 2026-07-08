/* ==========================================================
   assets/js/main.js
   Kipaji Spark — Global Site Interactions
   ========================================================== */

(function() {
    'use strict';

    // Wait for the DOM to be fully loaded before initializing
    document.addEventListener('DOMContentLoaded', function() {

        // ==========================================================
        // 1. DOM CACHING & HELPER FUNCTIONS
        // ==========================================================

        // Cache frequently accessed DOM elements
        const header = document.querySelector('.site-header');
        const hamburger = document.querySelector('.hamburger-menu');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.nav-link');
        const revealElements = document.querySelectorAll('.reveal');
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .card, .program-card, .value-card, .impact-feature, .hero-content, .hero-image-wrapper');

        // Helper: Create overlay element for mobile menu if not present
        function getOrCreateOverlay() {
            let overlay = document.querySelector('.nav-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'nav-overlay';
                document.body.appendChild(overlay);
            }
            return overlay;
        }

        // Helper: Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            return rect.top <= windowHeight - 80 && rect.bottom >= 80;
        }

        // ==========================================================
        // 2. STICKY HEADER ON SCROLL
        // ==========================================================
        function initStickyHeader() {
            if (!header) return;

            const scrollThreshold = 50;

            function handleScroll() {
                if (window.scrollY > scrollThreshold) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            let ticking = false;
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            handleScroll();
        }

        // ==========================================================
        // 3. MOBILE MENU TOGGLE
        // ==========================================================
        function initMobileMenu() {
            if (!hamburger || !mainNav) return;

            const overlay = getOrCreateOverlay();

            function toggleMenu(open) {
                const isOpen = open !== undefined ? open : !mainNav.classList.contains('open');
                mainNav.classList.toggle('open', isOpen);
                hamburger.classList.toggle('open', isOpen);
                overlay.classList.toggle('open', isOpen);
                hamburger.setAttribute('aria-expanded', isOpen);

                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                    // Animate menu items when menu opens
                    const menuItems = mainNav.querySelectorAll('.nav-link, .btn');
                    menuItems.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(20px)';
                        setTimeout(() => {
                            item.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, 100 + (index * 50));
                    });
                } else {
                    document.body.style.overflow = '';
                    // Reset menu item styles
                    mainNav.querySelectorAll('.nav-link, .btn').forEach(item => {
                        item.style.opacity = '';
                        item.style.transform = '';
                        item.style.transition = '';
                    });
                }
            }

            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu();
            });

            overlay.addEventListener('click', function() {
                toggleMenu(false);
            });

            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    toggleMenu(false);
                });
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                    toggleMenu(false);
                }
            });

            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (window.innerWidth > 991 && mainNav.classList.contains('open')) {
                        toggleMenu(false);
                    }
                }, 250);
            });
        }

        // ==========================================================
        // 4. ACTIVE NAVIGATION LINK HIGHLIGHTING
        // ==========================================================
        function initActiveNavLink() {
            if (!navLinks.length) return;

            let currentPath = window.location.pathname;
            let currentFile = currentPath.split('/').pop();

            if (!currentFile || currentFile === '' || currentFile === 'index.html' || currentPath === '/') {
                currentFile = 'index.html';
            }

            if (!currentFile.includes('.')) {
                currentFile += '.html';
            }

            navLinks.forEach(function(link) {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (!href) return;

                let linkFile = href.split('/').pop();
                if (!linkFile.includes('.')) {
                    linkFile += '.html';
                }

                if (linkFile === currentFile) {
                    link.classList.add('active');
                }
            });
        }

        // ==========================================================
        // 5. SMOOTH ANCHOR SCROLLING WITH OFFSET
        // ==========================================================
        function initSmoothScroll() {
            const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
            if (!anchorLinks.length) return;

            function getHeaderOffset() {
                const headerEl = document.querySelector('.site-header');
                return headerEl ? headerEl.offsetHeight + 20 : 80;
            }

            anchorLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (!targetElement) return;

                    e.preventDefault();

                    // Animate clicking effect
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => { this.style.transform = ''; }, 150);

                    const headerOffset = getHeaderOffset();
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    if (mainNav && mainNav.classList.contains('open')) {
                        const overlay = document.querySelector('.nav-overlay');
                        if (overlay) {
                            mainNav.classList.remove('open');
                            hamburger.classList.remove('open');
                            overlay.classList.remove('open');
                            hamburger.setAttribute('aria-expanded', 'false');
                            document.body.style.overflow = '';
                        }
                    }
                });
            });
        }

        // ==========================================================
        // 6. ADVANCED SCROLL ANIMATIONS (IntersectionObserver + Scroll)
        // ==========================================================
        function initScrollAnimations() {
            // A. Reveal elements with IntersectionObserver (staggered)
            if (revealElements.length) {
                if ('IntersectionObserver' in window) {
                    const revealObserver = new IntersectionObserver(function(entries) {
                        entries.forEach(function(entry, index) {
                            if (entry.isIntersecting) {
                                // Add slight delay for staggered effect
                                setTimeout(() => {
                                    entry.target.classList.add('is-visible');
                                }, index * 80);
                                revealObserver.unobserve(entry.target);
                            }
                        });
                    }, {
                        root: null,
                        rootMargin: '0px 0px -80px 0px',
                        threshold: 0.1
                    });

                    revealElements.forEach(function(el) {
                        revealObserver.observe(el);
                    });
                } else {
                    revealElements.forEach(function(el) {
                        el.classList.add('is-visible');
                    });
                }
            }

            // B. Parallax and continuous scroll effects for general elements
            if (animatedElements.length) {
                // Initial check on load
                animatedElements.forEach(el => {
                    if (isInViewport(el)) {
                        el.classList.add('in-view');
                    }
                });

                // Use throttled scroll listener for smooth animations
                let scrollTicking = false;
                window.addEventListener('scroll', function() {
                    if (!scrollTicking) {
                        window.requestAnimationFrame(function() {
                            animatedElements.forEach(el => {
                                if (isInViewport(el)) {
                                    if (!el.classList.contains('in-view')) {
                                        el.classList.add('in-view');
                                        // Trigger entrance animation
                                        el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
                                        el.style.opacity = '1';
                                        el.style.transform = 'translateY(0) scale(1)';
                                    }
                                }
                            });
                            scrollTicking = false;
                        });
                        scrollTicking = true;
                    }
                });

                // Set initial state for animated elements
                animatedElements.forEach(el => {
                    if (!el.classList.contains('reveal')) {
                        el.style.opacity = '0.8';
                        el.style.transform = 'translateY(20px) scale(0.98)';
                        el.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
                    }
                });
            }

            // C. Button and Card specific scroll-hover improvements
            document.querySelectorAll('.btn, .card, .program-card, .value-card, .impact-feature').forEach(el => {
                // Add scroll-triggered pop effect
                if (!el.classList.contains('reveal')) {
                    el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, opacity 0.8s ease';
                }
                
                // Enhanced hover effects (already in CSS, but adding JS touch for extra smoothness)
                el.addEventListener('mouseenter', function() {
                    if (window.innerWidth > 768) {
                        this.style.transform = 'translateY(-6px) scale(1.02)';
                        this.style.boxShadow = '0 16px 48px rgba(46, 16, 101, 0.12)';
                    }
                });
                el.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 768) {
                        this.style.transform = '';
                        this.style.boxShadow = '';
                    }
                });
            });
        }

        // ==========================================================
        // 7. INTERACTIVE ELEMENTS (Buttons, Links, Hover Enhancements)
        // ==========================================================
        function initInteractiveElements() {
            // A. Button click ripple effect (subtle)
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    // Add a micro-interaction for feedback
                    this.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });

            // B. Image hover parallax effect (on hero and featured images)
            document.querySelectorAll('.hero-image-shape img, .about-preview-image img, .impact-image-wrapper img').forEach(img => {
                const wrapper = img.parentElement;
                if (!wrapper) return;

                wrapper.addEventListener('mousemove', function(e) {
                    if (window.innerWidth > 992) {
                        const rect = this.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width - 0.5;
                        const y = (e.clientY - rect.top) / rect.height - 0.5;
                        img.style.transform = `scale(1.05) rotate(${x * 3}deg) translate(${x * 10}px, ${y * 10}px)`;
                    }
                });

                wrapper.addEventListener('mouseleave', function() {
                    img.style.transform = '';
                });
            });

            // C. Nav link active hover glow effect
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('active')) {
                        this.style.transform = 'scale(1.05)';
                        this.style.boxShadow = '0 0 0 4px rgba(46, 16, 101, 0.08)';
                    }
                });
                link.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                });
            });
        }

        // ==========================================================
        // 8. PARALLAX BACKGROUND EFFECTS (For hero and CTA banners)
        // ==========================================================
        function initParallaxBackgrounds() {
            const parallaxSections = document.querySelectorAll('.hero-section, .cta-banner-section');
            if (!parallaxSections.length) return;

            let parallaxTicking = false;
            window.addEventListener('scroll', function() {
                if (!parallaxTicking) {
                    window.requestAnimationFrame(function() {
                        parallaxSections.forEach(section => {
                            const rect = section.getBoundingClientRect();
                            const windowHeight = window.innerHeight;
                            // Only apply parallax when section is visible
                            if (rect.top < windowHeight && rect.bottom > 0) {
                                const speed = 0.04;
                                const yPos = -(rect.top * speed);
                                if (section.querySelector('.deco-shape')) {
                                    section.querySelectorAll('.deco-shape').forEach(shape => {
                                        shape.style.transform = `translateY(${yPos}px) scale(1.1)`;
                                    });
                                }
                            }
                        });
                        parallaxTicking = false;
                    });
                    parallaxTicking = true;
                }
            });
        }

        // ==========================================================
        // 9. DYNAMIC COUNTER ANIMATION (For stats if present)
        // ==========================================================
        function initCounters() {
            const counters = document.querySelectorAll('.counter');
            if (!counters.length) return;

            const counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.getAttribute('data-target'));
                        const duration = 2000; // 2 seconds
                        const step = target / (duration / 16); // 60fps

                        let current = 0;
                        const updateCounter = function() {
                            current += step;
                            if (current < target) {
                                el.textContent = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                el.textContent = target;
                            }
                        };
                        updateCounter();
                        counterObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => counterObserver.observe(counter));
        }

        // ==========================================================
        // 10. AUTO-UPDATE FOOTER YEAR
        // ==========================================================
        function initFooterYear() {
            const yearElement = document.querySelector('.footer-bottom .current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        }

        // ==========================================================
        // 11. INITIALIZE ALL MODULES
        // ==========================================================
        function init() {
            initStickyHeader();
            initMobileMenu();
            initActiveNavLink();
            initSmoothScroll();
            initScrollAnimations();
            initInteractiveElements();
            initParallaxBackgrounds();
            initCounters();
            initFooterYear();

            // Log successful initialization
            console.log('✨ Kipaji Spark global scripts initialized with advanced animations.');
        }

        // Run the initialization
        init();

    }); // End DOMContentLoaded

})();
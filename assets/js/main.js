/* ==========================================================
   assets/js/main.js
   Kipaji Spark — Global Site Interactions (Mobile-First)
   ========================================================== */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        // ==========================================================
        // 1. DOM CACHING
        // ==========================================================
        const header = document.querySelector('.site-header');
        const hamburger = document.querySelector('.hamburger-menu');
        const mainNav = document.querySelector('.main-nav');
        const overlay = document.querySelector('.nav-overlay');
        const navLinks = document.querySelectorAll('.nav-link');
        const navCloseBtn = document.querySelector('.nav-close-btn');
        const body = document.body;
        const backToTopBtn = document.getElementById('backToTop');

        // ==========================================================
        // 2. SCROLL-UP NAVIGATION (Hide on scroll down, show on scroll up)
        // ==========================================================
        function initScrollUpNavigation() {
            if (!header) return;

            let lastScrollTop = 0;
            let scrollThreshold = 60;
            let isHeaderHidden = false;
            let ticking = false;

            function handleScroll() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop <= 10) {
                    header.classList.remove('hide-header');
                    header.classList.add('show-header');
                    isHeaderHidden = false;
                    lastScrollTop = scrollTop;
                    ticking = false;
                    return;
                }

                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    if (!isHeaderHidden) {
                        header.classList.add('hide-header');
                        header.classList.remove('show-header');
                        isHeaderHidden = true;
                    }
                } else if (scrollTop < lastScrollTop) {
                    if (isHeaderHidden || scrollTop < scrollThreshold) {
                        header.classList.remove('hide-header');
                        header.classList.add('show-header');
                        isHeaderHidden = false;
                    }
                }

                lastScrollTop = scrollTop;
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(handleScroll);
                    ticking = true;
                }
            }, { passive: true });

            window.addEventListener('resize', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop <= 10) {
                    header.classList.remove('hide-header');
                    header.classList.add('show-header');
                } else if (!isHeaderHidden) {
                    header.classList.remove('hide-header');
                    header.classList.add('show-header');
                }
            }, { passive: true });

            setTimeout(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > 10) {
                    header.classList.add('show-header');
                    header.classList.remove('hide-header');
                } else {
                    header.classList.remove('hide-header');
                    header.classList.add('show-header');
                }
            }, 100);
        }

        // ==========================================================
        // 3. BACK TO TOP BUTTON
        // ==========================================================
        function initBackToTop() {
            if (!backToTopBtn) return;

            let ticking = false;

            function toggleBackToTop() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                
                // Show button after scrolling past 300px or one viewport height
                if (scrollTop > Math.min(300, windowHeight * 0.5)) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(toggleBackToTop);
                    ticking = true;
                }
            }, { passive: true });

            // Click handler with smooth scroll
            backToTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Button feedback
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);

                // Smooth scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('open')) {
                    closeMobileMenu();
                }
            });

            // Initial check
            setTimeout(toggleBackToTop, 100);
        }

        // ==========================================================
        // 4. MOBILE MENU TOGGLE
        // ==========================================================
        let isMenuOpen = false;

        function openMobileMenu() {
            isMenuOpen = true;
            mainNav.classList.add('open');
            hamburger.classList.add('is-hidden');
            if (overlay) overlay.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-hidden', 'true');
            body.classList.add('no-scroll');
            
            // Animate menu items with stagger
            const items = mainNav.querySelectorAll('.nav-link, .btn');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100 + (index * 60));
            });
        }

        function closeMobileMenu() {
            isMenuOpen = false;
            mainNav.classList.remove('open');
            hamburger.classList.remove('is-hidden');
            if (overlay) overlay.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-hidden', 'false');
            body.classList.remove('no-scroll');
            
            // Reset menu item styles
            mainNav.querySelectorAll('.nav-link, .btn').forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            });
        }

        function toggleMobileMenu() {
            if (isMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function initMobileMenu() {
            if (!hamburger || !mainNav) return;

            // Hamburger click
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMobileMenu();
            });

            // Close button click
            if (navCloseBtn) {
                navCloseBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    closeMobileMenu();
                });
            }

            // Overlay click
            if (overlay) {
                overlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    closeMobileMenu();
                });
            }

            // Nav links click - close menu with delay for better UX
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 768 && isMenuOpen) {
                        setTimeout(closeMobileMenu, 150);
                    }
                });
            });

            // Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isMenuOpen) {
                    closeMobileMenu();
                    hamburger.focus();
                }
            });

            // Window resize - auto-close if desktop
            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (window.innerWidth > 768 && isMenuOpen) {
                        closeMobileMenu();
                    }
                }, 250);
            });

            // Trap focus inside menu when open
            mainNav.addEventListener('keydown', function(e) {
                if (!isMenuOpen) return;
                const focusable = mainNav.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
                );
                if (!focusable.length) return;
                
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            });

            // Prevent touch events from scrolling the page when menu is open
            document.addEventListener('touchmove', function(e) {
                if (isMenuOpen && !mainNav.contains(e.target) && e.target !== hamburger && e.target !== navCloseBtn) {
                    e.preventDefault();
                }
            }, { passive: false });
        }

        // ==========================================================
        // 5. STICKY HEADER ON SCROLL (Desktop only)
        // ==========================================================
        function initStickyHeader() {
            if (!header) return;

            const scrollThreshold = 50;
            let ticking = false;

            function handleScroll() {
                // Only apply on desktop
                if (window.innerWidth > 768) {
                    if (window.scrollY > scrollThreshold) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                } else {
                    // On mobile, remove scrolled class when header is hidden
                    if (!header.classList.contains('hide-header')) {
                        if (window.scrollY > scrollThreshold) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                    }
                }
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(handleScroll);
                    ticking = true;
                }
            }, { passive: true });

            handleScroll();
        }

        // ==========================================================
        // 6. ACTIVE NAV LINK
        // ==========================================================
        function initActiveNavLink() {
            if (!navLinks.length) return;

            let currentPath = window.location.pathname;
            let currentFile = currentPath.split('/').pop() || 'index.html';

            // Normalize
            if (!currentFile || currentFile === '' || currentPath === '/') {
                currentFile = 'index.html';
            }
            if (!currentFile.includes('.')) {
                currentFile += '.html';
            }

            navLinks.forEach(function(link) {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (!href) return;

                let linkFile = href.split('/').pop() || '';
                if (!linkFile.includes('.')) {
                    linkFile += '.html';
                }

                if (linkFile === currentFile) {
                    link.classList.add('active');
                }
            });
        }

        // ==========================================================
        // 7. SMOOTH SCROLL
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

                    const headerOffset = getHeaderOffset();
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (mainNav && mainNav.classList.contains('open')) {
                        closeMobileMenu();
                    }
                });
            });
        }

        // ==========================================================
        // 8. SCROLL REVEAL ANIMATIONS
        // ==========================================================
        function initScrollAnimations() {
            const revealElements = document.querySelectorAll('.reveal, .value-card, .program-card, .impact-feature, .card');
            
            if (!revealElements.length) return;

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (prefersReducedMotion.matches) {
                revealElements.forEach(el => {
                    el.classList.add('is-visible');
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                return;
            }

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry, index) {
                        if (entry.isIntersecting) {
                            setTimeout(function() {
                                entry.target.classList.add('is-visible');
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, index * 60);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    root: null,
                    rootMargin: '0px 0px -40px 0px',
                    threshold: 0.1
                });

                revealElements.forEach(function(el) {
                    if (!el.classList.contains('reveal')) {
                        el.style.opacity = '0.8';
                        el.style.transform = 'translateY(20px)';
                        el.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                    }
                    observer.observe(el);
                });
            } else {
                revealElements.forEach(el => {
                    el.classList.add('is-visible');
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
            }
        }

        // ==========================================================
        // 9. INTERACTIVE ELEMENTS
        // ==========================================================
        function initInteractiveElements() {
            // Button feedback
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });

                btn.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.96)';
                }, { passive: true });
                btn.addEventListener('touchend', function() {
                    this.style.transform = '';
                }, { passive: true });
            });

            // Card touch feedback (mobile)
            if (window.matchMedia('(hover: none)').matches) {
                document.querySelectorAll('.value-card, .program-card, .impact-feature, .card').forEach(card => {
                    card.addEventListener('touchstart', function() {
                        this.style.transform = 'scale(0.98)';
                    }, { passive: true });
                    card.addEventListener('touchend', function() {
                        this.style.transform = '';
                    }, { passive: true });
                });
            }
        }

        // ==========================================================
        // 10. FOOTER YEAR
        // ==========================================================
        function initFooterYear() {
            const yearElements = document.querySelectorAll('.footer-bottom .current-year');
            const currentYear = new Date().getFullYear();
            yearElements.forEach(el => {
                el.textContent = currentYear;
            });
        }

        // ==========================================================
        // 11. REDUCED MOTION LISTENER
        // ==========================================================
        function initReducedMotionListener() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            prefersReducedMotion.addEventListener('change', function(e) {
                if (e.matches) {
                    document.querySelectorAll('.reveal, .value-card, .program-card, .impact-feature, .card').forEach(el => {
                        el.classList.add('is-visible');
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                        el.style.transition = 'none';
                    });
                }
            });
        }

        // ==========================================================
        // 12. INITIALIZE
        // ==========================================================
        function init() {
            initScrollUpNavigation();
            initBackToTop();
            initMobileMenu();
            initStickyHeader();
            initActiveNavLink();
            initSmoothScroll();
            initScrollAnimations();
            initInteractiveElements();
            initFooterYear();
            initReducedMotionListener();

            console.log('✨ Kipaji Spark initialized successfully.');
        }

        init();

    });

})();
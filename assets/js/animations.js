/* ==========================================================
   assets/js/animations.js
   Kipaji Spark — Advanced Interactive Animation & Motion System
   ========================================================== */

(function() {
    'use strict';

    // ==========================================================
    // 1. CONFIGURATION CONSTANTS
    // ==========================================================
    const CONFIG = {
        revealThreshold: 0.1,
        revealRootMargin: '0px 0px -40px 0px',
        staggerDefault: 80, // ms
        heroSequenceDelay: 100, // ms
        counterDuration: 2000, // ms
        parallaxSpeed: 0.08,
        tiltMax: 8,
    };

    // ==========================================================
    // 2. HELPER UTILITIES
    // ==========================================================

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function isReducedMotionPreferred() {
        return prefersReducedMotion.matches;
    }

    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight - offset && rect.bottom >= offset;
    }

    function forceVisible(element) {
        element.classList.add('is-visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.transition = 'none';
    }

    // ==========================================================
    // 3. CORE: REVEAL-ON-SCROLL SYSTEM (IntersectionObserver)
    // ==========================================================
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-zoom, .reveal-rotate');

        if (!revealElements.length) return;

        if (isReducedMotionPreferred()) {
            revealElements.forEach(forceVisible);
            return;
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        // Custom delay from data attribute
                        let delay = 0;
                        if (target.hasAttribute('data-delay')) {
                            delay = parseInt(target.getAttribute('data-delay'), 10) || 0;
                        }
                        setTimeout(function() {
                            target.classList.add('is-visible');
                        }, delay);
                        observer.unobserve(target);
                    }
                });
            }, {
                root: null,
                rootMargin: CONFIG.revealRootMargin,
                threshold: CONFIG.revealThreshold,
            });

            revealElements.forEach(function(el) {
                observer.observe(el);
            });
        } else {
            revealElements.forEach(forceVisible);
        }
    }

    // ==========================================================
    // 4. STAGGERED CARD / GROUP ANIMATIONS (Creative Patterns)
    // ==========================================================
    function initStaggerGroups() {
        const staggerParents = document.querySelectorAll('[data-stagger], .stagger-group');

        if (!staggerParents.length) return;

        if (isReducedMotionPreferred()) {
            staggerParents.forEach(function(parent) {
                const children = parent.children;
                for (let i = 0; i < children.length; i++) {
                    forceVisible(children[i]);
                }
            });
            return;
        }

        if ('IntersectionObserver' in window) {
            const staggerObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const parent = entry.target;
                        // Select all child elements that are meant to be staggered
                        const children = parent.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-zoom, .reveal-rotate, .value-card, .program-card, .event-card, .feature-card, .gallery-item, .impact-feature, .team-member, .stat-card');

                        let staggerDelay = CONFIG.staggerDefault;
                        if (parent.hasAttribute('data-stagger')) {
                            const val = parseInt(parent.getAttribute('data-stagger'), 10);
                            if (!isNaN(val) && val > 0) {
                                staggerDelay = val;
                            }
                        }

                        // Creative staggered effect: alternate between up and down or left and right
                        children.forEach(function(child, index) {
                            if (!child.classList.contains('reveal') && 
                                !child.classList.contains('reveal-up') && 
                                !child.classList.contains('reveal-left') && 
                                !child.classList.contains('reveal-right') && 
                                !child.classList.contains('reveal-scale') &&
                                !child.classList.contains('reveal-zoom') &&
                                !child.classList.contains('reveal-rotate')) {
                                // Assign a unique creative reveal class based on index
                                const pattern = index % 4;
                                if (pattern === 0) child.classList.add('reveal-up');
                                else if (pattern === 1) child.classList.add('reveal-left');
                                else if (pattern === 2) child.classList.add('reveal-right');
                                else if (pattern === 3) child.classList.add('reveal-zoom');
                            }

                            const totalDelay = index * staggerDelay;
                            child.style.transitionDelay = totalDelay + 'ms';

                            setTimeout(function() {
                                child.classList.add('is-visible');
                                setTimeout(function() {
                                    child.style.transitionDelay = '';
                                }, 1000);
                            }, totalDelay);
                        });

                        staggerObserver.unobserve(parent);
                    }
                });
            }, {
                root: null,
                rootMargin: CONFIG.revealRootMargin,
                threshold: CONFIG.revealThreshold,
            });

            staggerParents.forEach(function(parent) {
                staggerObserver.observe(parent);
            });
        } else {
            staggerParents.forEach(function(parent) {
                const children = parent.children;
                for (let i = 0; i < children.length; i++) {
                    forceVisible(children[i]);
                }
            });
        }
    }

    // ==========================================================
    // 5. SECTION HEADER SEQUENCING (Elegant Typography Reveal)
    // ==========================================================
    function initSectionHeaderSequencing() {
        const sectionHeaders = document.querySelectorAll('.section-header, .page-hero .section-header, .cta-banner .cta-content');

        if (!sectionHeaders.length) return;

        if (isReducedMotionPreferred()) {
            sectionHeaders.forEach(function(header) {
                const children = header.querySelectorAll('.section-label, .section-title, .section-subtitle, .cta-title, .cta-desc');
                children.forEach(forceVisible);
            });
            return;
        }

        if ('IntersectionObserver' in window) {
            const headerObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const header = entry.target;
                        const label = header.querySelector('.section-label, .cta-label');
                        const title = header.querySelector('.section-title, .cta-title');
                        const subtitle = header.querySelector('.section-subtitle, .cta-desc');

                        // Creative: Label slides from left, Title scales up, Subtitle slides from right
                        if (label) {
                            label.classList.add('reveal-left');
                            setTimeout(function() {
                                label.classList.add('is-visible');
                            }, 0);
                        }

                        if (title) {
                            title.classList.add('reveal-scale');
                            setTimeout(function() {
                                title.classList.add('is-visible');
                            }, CONFIG.heroSequenceDelay);
                        }

                        if (subtitle) {
                            subtitle.classList.add('reveal-right');
                            setTimeout(function() {
                                subtitle.classList.add('is-visible');
                            }, CONFIG.heroSequenceDelay * 2);
                        }

                        headerObserver.unobserve(header);
                    }
                });
            }, {
                root: null,
                rootMargin: CONFIG.revealRootMargin,
                threshold: CONFIG.revealThreshold,
            });

            sectionHeaders.forEach(function(header) {
                headerObserver.observe(header);
            });
        } else {
            sectionHeaders.forEach(function(header) {
                const children = header.querySelectorAll('.section-label, .section-title, .section-subtitle, .cta-title, .cta-desc');
                children.forEach(forceVisible);
            });
        }
    }

    // ==========================================================
    // 6. HERO ENTRANCE ANIMATION (Cinematic & Interactive)
    // ==========================================================
    function initHeroAnimations() {
        const hero = document.querySelector('.hero-section, .page-hero');
        if (!hero) return;

        if (isReducedMotionPreferred()) {
            const heroElements = hero.querySelectorAll('.hero-content, .hero-title, .hero-description, .hero-actions, .hero-image-wrapper, .hero-eyebrow, .hero-badge');
            heroElements.forEach(forceVisible);
            return;
        }

        // Interactive Parallax on Hero Image
        const heroImage = hero.querySelector('.hero-image-wrapper, .hero-image, .hero-image-shape');
        if (heroImage && window.innerWidth > 768) {
            hero.addEventListener('mousemove', function(e) {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                heroImage.style.transform = `translate(${x * -15}px, ${y * -15}px) rotate(${x * 2}deg)`;
            });
            hero.addEventListener('mouseleave', function() {
                heroImage.style.transform = '';
            });
        }

        setTimeout(function() {
            if (isInViewport(hero, 100)) {
                animateHeroSequence(hero);
            } else {
                const checkVisibility = function() {
                    if (isInViewport(hero, 100)) {
                        animateHeroSequence(hero);
                        window.removeEventListener('scroll', checkVisibility);
                    }
                };
                window.addEventListener('scroll', checkVisibility, { passive: true });
                window.addEventListener('resize', checkVisibility, { passive: true });
            }
        }, 150);
    }

    function animateHeroSequence(hero) {
        const label = hero.querySelector('.hero-eyebrow, .hero-badge');
        const title = hero.querySelector('.hero-title');
        const desc = hero.querySelector('.hero-description, .hero-text');
        const actions = hero.querySelector('.hero-actions');
        const imageWrapper = hero.querySelector('.hero-image-wrapper, .hero-image, .hero-image-shape');
        const decoShapes = hero.querySelectorAll('.deco-shape, .hero-blob, .floating-shape');

        const elements = [label, title, desc, actions, imageWrapper];
        elements.forEach(function(el) {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px) scale(0.95)';
                el.style.transition = 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
            }
        });

        const sequence = [
            { el: label, delay: 0, transform: 'translateY(20px)' },
            { el: title, delay: CONFIG.heroSequenceDelay, transform: 'translateY(30px) scale(0.95)' },
            { el: desc, delay: CONFIG.heroSequenceDelay * 2, transform: 'translateY(30px)' },
            { el: actions, delay: CONFIG.heroSequenceDelay * 3, transform: 'translateY(20px)' },
            { el: imageWrapper, delay: CONFIG.heroSequenceDelay * 4, transform: 'scale(0.9) rotate(-2deg)' },
        ];

        sequence.forEach(function(item) {
            if (item.el) {
                setTimeout(function() {
                    item.el.style.opacity = '1';
                    item.el.style.transform = 'none';
                    setTimeout(function() {
                        item.el.style.transition = '';
                        item.el.style.opacity = '';
                        item.el.style.transform = '';
                        item.el.classList.add('is-visible');
                    }, 1100);
                }, item.delay);
            }
        });

        if (decoShapes.length) {
            decoShapes.forEach(function(shape, index) {
                shape.style.opacity = '0';
                shape.style.transform = 'scale(0.8) translateY(30px) rotate(10deg)';
                shape.style.transition = 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
                setTimeout(function() {
                    shape.style.opacity = '1';
                    shape.style.transform = 'none';
                    setTimeout(function() {
                        shape.style.transition = '';
                        shape.style.opacity = '';
                        shape.style.transform = '';
                    }, 1400);
                }, CONFIG.heroSequenceDelay * 5 + (index * 80));
            });
        }
    }

    // ==========================================================
    // 7. COUNTER ANIMATIONS (Smooth Easing)
    // ==========================================================
    function initCounters() {
        const counters = document.querySelectorAll('.counter, [data-counter]');

        if (!counters.length) return;

        if (isReducedMotionPreferred()) {
            counters.forEach(function(counter) {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                if (!isNaN(target)) {
                    counter.textContent = target;
                }
            });
            return;
        }

        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.getAttribute('data-target'), 10);
                        if (isNaN(target)) return;

                        const prefix = el.getAttribute('data-prefix') || '';
                        const suffix = el.getAttribute('data-suffix') || '';
                        const duration = CONFIG.counterDuration;

                        let startTime = null;
                        const startValue = 0;

                        function easeOutCubic(t) {
                            return 1 - Math.pow(1 - t, 3);
                        }

                        function updateCounter(timestamp) {
                            if (!startTime) startTime = timestamp;
                            const progress = Math.min((timestamp - startTime) / duration, 1);
                            const easedProgress = easeOutCubic(progress);
                            const currentValue = Math.floor(easedProgress * target);
                            el.textContent = prefix + currentValue + suffix;

                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                el.textContent = prefix + target + suffix;
                            }
                        }

                        requestAnimationFrame(updateCounter);
                        counterObserver.unobserve(el);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -40px 0px',
                threshold: 0.3,
            });

            counters.forEach(function(counter) {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(function(counter) {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                if (!isNaN(target)) {
                    const prefix = counter.getAttribute('data-prefix') || '';
                    const suffix = counter.getAttribute('data-suffix') || '';
                    counter.textContent = prefix + target + suffix;
                }
            });
        }
    }

    // ==========================================================
    // 8. PARALLAX & SCROLL-DRIVEN EFFECTS
    // ==========================================================
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax, .hero-section, .cta-banner-section, .cta-banner');
        
        if (!parallaxElements.length || isReducedMotionPreferred()) return;

        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    parallaxElements.forEach(function(el) {
                        const rect = el.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        if (rect.top < windowHeight && rect.bottom > 0) {
                            const speed = CONFIG.parallaxSpeed;
                            const yPos = -(rect.top * speed);
                            const shapes = el.querySelectorAll('.deco-shape, .hero-blob, .floating-shape');
                            shapes.forEach(function(shape) {
                                shape.style.transform = `translateY(${yPos}px) scale(1.05)`;
                            });
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ==========================================================
    // 9. CREATIVE: 3D TILT ON CARDS (Interactive Hover)
    // ==========================================================
    function initCardTilt() {
        const tiltCards = document.querySelectorAll('.tilt-card, .value-card, .program-card, .event-card, .feature-card, .impact-feature, .gallery-item');

        if (!tiltCards.length || isReducedMotionPreferred() || window.innerWidth <= 768) return;

        tiltCards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const rotateX = y * -CONFIG.tiltMax;
                const rotateY = x * CONFIG.tiltMax;
                card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'transform 0.1s ease-out';
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            });
        });
    }

    // ==========================================================
    // 10. CREATIVE: SPARKLE / GLOW FOLLOW (Interactive)
    // ==========================================================
    function initSparkleFollow() {
        const sparkleAreas = document.querySelectorAll('.sparkle-area, .hero-section, .cta-banner-section');

        if (!sparkleAreas.length || isReducedMotionPreferred()) return;

        // Create a shared sparkle element
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-follow';
        sparkle.style.cssText = `
            position: fixed;
            pointer-events: none;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(244, 180, 0, 0.15) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: opacity 0.5s ease;
            opacity: 0;
            z-index: 9999;
            filter: blur(10px);
        `;
        document.body.appendChild(sparkle);

        sparkleAreas.forEach(function(area) {
            area.addEventListener('mouseenter', function() {
                sparkle.style.opacity = '1';
            });
            area.addEventListener('mouseleave', function() {
                sparkle.style.opacity = '0';
            });
            area.addEventListener('mousemove', function(e) {
                sparkle.style.left = e.clientX + 'px';
                sparkle.style.top = e.clientY + 'px';
            });
        });
    }

    // ==========================================================
    // 11. CREATIVE: IMAGE ZOOM & PARALLAX ON SCROLL
    // ==========================================================
    function initImageParallax() {
        const images = document.querySelectorAll('.hero-image-shape img, .about-preview-image img, .impact-image-wrapper img, .parallax-image');

        if (!images.length || isReducedMotionPreferred()) return;

        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    images.forEach(function(img) {
                        const rect = img.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        if (rect.top < windowHeight && rect.bottom > 0) {
                            const speed = 0.05;
                            const yPos = (windowHeight - rect.top) * speed;
                            img.style.transform = `scale(1.05) translateY(${yPos * 0.5}px)`;
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ==========================================================
    // 12. CREATIVE: TEXT REVEAL WITH CHARACTER SPLIT (Optional)
    // ==========================================================
    function initTextReveal() {
        const textReveals = document.querySelectorAll('.text-reveal, .hero-title, .section-title');

        if (!textReveals.length || isReducedMotionPreferred()) return;

        textReveals.forEach(function(el) {
            // Only apply to direct text nodes, not nested elements
            if (el.children.length === 0 && el.textContent.trim().length > 0) {
                const text = el.textContent;
                const words = text.split(' ');
                el.innerHTML = words.map(function(word, index) {
                    return `<span class="word-reveal" style="display:inline-block; opacity:0; transform:translateY(20px); transition:all 0.6s cubic-bezier(0.22, 1, 0.36, 1); transition-delay:${index * 0.05}s">${word}&nbsp;</span>`;
                }).join('');
                
                // Observer to trigger word reveal
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver(function(entries) {
                        entries.forEach(function(entry) {
                            if (entry.isIntersecting) {
                                const spans = entry.target.querySelectorAll('.word-reveal');
                                spans.forEach(function(span) {
                                    span.style.opacity = '1';
                                    span.style.transform = 'translateY(0)';
                                });
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.5 });
                    observer.observe(el);
                } else {
                    el.querySelectorAll('.word-reveal').forEach(function(span) {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                }
            }
        });
    }

    // ==========================================================
    // 13. CREATIVE: TIMELINE / VERTICAL STEP REVEAL
    // ==========================================================
    function initTimelineReveal() {
        const timelineItems = document.querySelectorAll('.timeline-item, .step-item');

        if (!timelineItems.length || isReducedMotionPreferred()) return;

        if ('IntersectionObserver' in window) {
            const timelineObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const item = entry.target;
                        // Slide in from left or right based on position
                        const index = Array.from(item.parentNode.children).indexOf(item);
                        const direction = index % 2 === 0 ? 'reveal-left' : 'reveal-right';
                        item.classList.add(direction);
                        item.style.transitionDelay = (index * 0.1) + 's';
                        setTimeout(function() {
                            item.classList.add('is-visible');
                        }, 50);
                        timelineObserver.unobserve(item);
                    }
                });
            }, {
                root: null,
                rootMargin: CONFIG.revealRootMargin,
                threshold: CONFIG.revealThreshold,
            });

            timelineItems.forEach(function(item) {
                timelineObserver.observe(item);
            });
        } else {
            timelineItems.forEach(forceVisible);
        }
    }

    // ==========================================================
    // 14. DECORATIVE FLOATING SHAPES (Creative CSS Animation)
    // ==========================================================
    function initFloatingShapes() {
        const shapes = document.querySelectorAll('.deco-shape, .hero-blob, .floating-shape, .float-element');

        if (!shapes.length || isReducedMotionPreferred()) return;

        shapes.forEach(function(shape) {
            shape.style.opacity = '1';
            if (!shape.classList.contains('float-active')) {
                shape.classList.add('float-active');
                if (!document.getElementById('kipaji-float-styles')) {
                    const style = document.createElement('style');
                    style.id = 'kipaji-float-styles';
                    style.textContent = `
                        .float-active {
                            animation: floatShape 7s ease-in-out infinite alternate;
                        }
                        .float-active:nth-child(2) {
                            animation-duration: 8s;
                            animation-delay: 1.5s;
                        }
                        .float-active:nth-child(3) {
                            animation-duration: 6s;
                            animation-delay: 3s;
                        }
                        .float-active:nth-child(4) {
                            animation-duration: 9s;
                            animation-delay: 0.5s;
                        }
                        @keyframes floatShape {
                            0% { transform: translateY(0px) rotate(0deg) scale(1); }
                            33% { transform: translateY(-12px) rotate(2deg) scale(1.05); }
                            66% { transform: translateY(8px) rotate(-2deg) scale(0.95); }
                            100% { transform: translateY(-6px) rotate(1deg) scale(1.02); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });
    }

    // ==========================================================
    // 15. REDUCED MOTION LISTENER (Live adaptation)
    // ==========================================================
    function initReducedMotionListener() {
        prefersReducedMotion.addEventListener('change', function(e) {
            if (e.matches) {
                document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-zoom, .reveal-rotate, .is-visible, .stagger-group .value-card, .stagger-group .program-card, .stagger-group .event-card, .stagger-group .feature-card, .stagger-group .gallery-item, .stagger-group .impact-feature, .word-reveal').forEach(function(el) {
                    forceVisible(el);
                    el.style.transitionDelay = '0ms';
                });
                document.querySelectorAll('.counter, [data-counter]').forEach(function(counter) {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    if (!isNaN(target)) {
                        const prefix = counter.getAttribute('data-prefix') || '';
                        const suffix = counter.getAttribute('data-suffix') || '';
                        counter.textContent = prefix + target + suffix;
                    }
                });
            }
        });
    }

    // ==========================================================
    // 16. MAIN INITIALIZATION
    // ==========================================================
    function init() {
        initRevealAnimations();
        initStaggerGroups();
        initSectionHeaderSequencing();
        initHeroAnimations();
        initCounters();
        initParallaxEffects();
        initCardTilt();
        initSparkleFollow();
        initImageParallax();
        initTextReveal();
        initTimelineReveal();
        initFloatingShapes();
        initReducedMotionListener();

        console.log('✨ Kipaji Spark advanced animations initialized.');
    }

    // ==========================================================
    // 17. DOM CONTENT LOADED ENTRY POINT
    // ==========================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
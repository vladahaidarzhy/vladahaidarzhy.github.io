// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

    // Homepage Intro Fade on Scroll
    const homeIntroHeader = document.querySelector('.home-intro-header');

    if (homeIntroHeader) {
        const introH1 = homeIntroHeader.querySelector('h1');
        const scrollArrowContainer = homeIntroHeader.querySelector('.scroll-down-arrow-container');
        const headerHeight = homeIntroHeader.offsetHeight;

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            let opacity = 1;

            if (scrollPosition < headerHeight) {
                opacity = 1 - (scrollPosition / headerHeight);
            } else {
                opacity = 0;
            }
            
            // Clamp opacity between 0 and 1
            opacity = Math.max(0, Math.min(1, opacity));

            if (introH1) {
                introH1.style.opacity = opacity;
            }
            if (scrollArrowContainer) {
                scrollArrowContainer.style.opacity = opacity;
                // Optionally hide completely when opacity is 0 to prevent interaction
                scrollArrowContainer.style.visibility = opacity === 0 ? 'hidden' : 'visible';
            }
        });

        // Scroll on arrow click
        const scrollDownImage = document.getElementById('scrollDownImage');
        if (scrollDownImage) {
            scrollDownImage.addEventListener('click', () => {
                const arrowContainer = scrollDownImage.closest('.scroll-down-arrow-container');
                if (arrowContainer) {
                    arrowContainer.classList.add('arrow-is-clicked');
                }

                const nextElement = homeIntroHeader.nextElementSibling;
                if (nextElement) {
                    nextElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // Testimonial Carousel Logic
    const testimonialContainer = document.querySelector('.testimonial-carousel-container');
    if (testimonialContainer) {
        const slidesTrack = testimonialContainer.querySelector('.slides-track');
        const originalSlides = Array.from(testimonialContainer.getElementsByClassName("testimonial-slide"));
        
        if (originalSlides.length > 0) {
            let currentOriginalIndex = Math.floor(originalSlides.length / 2); 
            let slideWidth = 0;
            const numOriginalSlides = originalSlides.length;
            let isTransitioning = false;
            let isMobileView = false;

            // Clone slides for infinite effect if more than 1 slide
            if (numOriginalSlides > 1) {
                const lastSlideClone = originalSlides[numOriginalSlides - 1].cloneNode(true);
                slidesTrack.insertBefore(lastSlideClone, slidesTrack.firstChild);
                const firstSlideClone = originalSlides[0].cloneNode(true);
                slidesTrack.appendChild(firstSlideClone);
            }
            const allSlidesInTrack = Array.from(slidesTrack.children);

            function checkMobileView() {
                isMobileView = window.innerWidth <= 768;
            }

            function calculateSlideWidth() {
                checkMobileView(); // Update mobile view status
                if (allSlidesInTrack.length > 0) {
                    slideWidth = allSlidesInTrack[0].offsetWidth;
                }
            }

            function positionTrack(effectiveIndex, animate = true) {
                if (!slidesTrack || slideWidth === 0) return;
                let trackOffset;
                if (isMobileView) {
                    trackOffset = -effectiveIndex * slideWidth;
                } else {
                    trackOffset = -effectiveIndex * slideWidth + (testimonialContainer.offsetWidth - slideWidth) / 2;
                }
                slidesTrack.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
                slidesTrack.style.transform = `translateX(${trackOffset}px)`;
            }

            function updateActiveElements(originalIndexToMakeActive) {
                const effectiveActiveIndexInTrack = numOriginalSlides > 1 ? originalIndexToMakeActive + 1 : originalIndexToMakeActive;

                allSlidesInTrack.forEach((slide, i) => {
                    slide.classList.remove('active-slide');
                    if (i === effectiveActiveIndexInTrack) {
                        slide.classList.add('active-slide');
                    }
                });
                
                // Normalize originalIndexToMakeActive for dots, in case it was out of bounds during transition planning
                let dotIndexToActivate = originalIndexToMakeActive;
                if (dotIndexToActivate >= numOriginalSlides) dotIndexToActivate = 0;
                if (dotIndexToActivate < 0) dotIndexToActivate = numOriginalSlides - 1;

                // Removed dot logic as per user request
                /*
                dots.forEach((dot, i) => {
                    dot.classList.remove('active');
                    if (i === dotIndexToActivate) {
                        dot.classList.add('active');
                    }
                });
                */
            }

            function moveToSlide(newOriginalIndexTarget) {
                if (isTransitioning && numOriginalSlides > 1) return;
                if (numOriginalSlides <= 1) {
                     updateActiveElements(newOriginalIndexTarget);
                     positionTrack(newOriginalIndexTarget, false);
                     return;
                }

                isTransitioning = true;
                
                // Determine the actual effective index in the track to animate towards
                // This might be a clone if newOriginalIndexTarget is out of original bounds
                let effectiveIndexToAnimateTo = newOriginalIndexTarget + 1; // +1 for prepended clone normally
                // No change needed here for effectiveIndexToAnimateTo, as the jump handles boundary crossing.

                positionTrack(effectiveIndexToAnimateTo, true);
                updateActiveElements(newOriginalIndexTarget); // Style based on conceptual target

                slidesTrack.addEventListener('transitionend', function onTransitionEnd() {
                    currentOriginalIndex = newOriginalIndexTarget;
                    let needsJump = false;
                    let finalEffectiveIndexToDisplay = currentOriginalIndex + 1;

                    if (currentOriginalIndex >= numOriginalSlides) {
                        currentOriginalIndex = 0;
                        needsJump = true;
                    } else if (currentOriginalIndex < 0) {
                        currentOriginalIndex = numOriginalSlides - 1;
                        needsJump = true;
                    }
                    finalEffectiveIndexToDisplay = currentOriginalIndex + 1;

                    const targetRealSlideElement = allSlidesInTrack[finalEffectiveIndexToDisplay];

                    if (needsJump) {
                        slidesTrack.style.transition = 'none'; // Turn off animation for the jump
                        positionTrack(finalEffectiveIndexToDisplay, false); // Jump to the real slide position
                        
                        if (targetRealSlideElement) {
                            targetRealSlideElement.style.transition = 'none'; // Disable transitions on this specific slide
                        }
                    }
                    
                    // Update active classes for the final state. 
                    // If jumped, the targetRealSlideElement will instantly get active styles.
                    updateActiveElements(currentOriginalIndex);

                    requestAnimationFrame(() => {
                        if (needsJump && targetRealSlideElement) {
                            targetRealSlideElement.offsetHeight; // Force reflow to apply styles without transition
                            targetRealSlideElement.style.transition = ''; // Re-enable CSS transitions
                        }
                        // Always re-enable track transition for next user interaction, unless we just jumped (it was already off)
                        if (slidesTrack.style.transition === 'none') { 
                           slidesTrack.style.transition = 'transform 0.5s ease-in-out';
                        }
                        isTransitioning = false;
                    });
                }, { once: true });
            }

            window.plusSlides = function(increment) {
                let newIndex = currentOriginalIndex + increment;
                moveToSlide(newIndex);
            }
            
            // Initial setup
            checkMobileView(); // Initial check
            calculateSlideWidth();
            moveToSlide(currentOriginalIndex); // Initial positioning

            window.addEventListener('resize', () => {
                const oldMobileView = isMobileView; // Store old view before recalculating
                calculateSlideWidth(); // This also calls checkMobileView()
                // If the view mode (mobile/desktop) changed, we might need to adjust immediately
                // or ensure the current slide is correctly positioned for the new view.
                // The existing moveToSlide call should handle re-centering correctly.
                moveToSlide(currentOriginalIndex); 
            });
        }
    }
});

// The form submission is now handled by Formspree directly.
// No custom JavaScript is needed for the basic submission.

/*
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    // Check if form exists to prevent errors on other pages
    if (form) { 
        form.addEventListener('submit', function(event) {
            // event.preventDefault(); // Removed this line to allow submission to Formspree
            // alert('Thank you for reaching out! We will get back to you soon.'); // Optional: remove if using Formspree's page
            // form.reset(); // Optional: remove if using Formspree's page
        });
    }
});
*/ 
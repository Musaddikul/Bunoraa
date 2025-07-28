/**
 * @fileoverview Initializes Swiper.js carousels on the page.
 * Ensures Swiper instances are created only if their respective elements exist.
 */

/**
 * Initializes all Swiper carousels present in the DOM.
 * Includes configurations for hero, testimonial, and trending product swipers.
 */
function initSwipers() {
    // Check if Swiper library is loaded
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded. Carousels will not work.');
        return;
    }

    /**
     * Helper function to initialize a Swiper instance if the selector element exists
     * and contains at least one slide.
     * @param {string} selector - CSS selector for the Swiper container.
     * @param {Object} config - Swiper configuration object.
     * @returns {Swiper|null} The Swiper instance, or null if not initialized.
     */
    const initSwiperIfExists = (selector, config) => {
        const element = document.querySelector(selector);
        // Only initialize if the element exists and has at least one swiper-slide
        if (element && element.querySelector('.swiper-slide')) {
            return new Swiper(selector, config);
        }
        return null;
    };

    // Initialize Hero Swiper
    initSwiperIfExists('#heroSwiper', {
        loop: true, // Infinite loop
        autoplay: {
            delay: 5000, // 5 seconds delay
            disableOnInteraction: false // Continue autoplay after user interaction
        },
        navigation: {
            nextEl: '#heroSwiper .swiper-button-next',
            prevEl: '#heroSwiper .swiper-button-prev'
        },
        pagination: {
            el: '#heroSwiper .swiper-pagination',
            clickable: true // Allow clicking on pagination bullets
        },
        effect: 'fade', // Fade transition effect
        fadeEffect: { crossFade: true },
        a11y: { // Accessibility settings
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            paginationBulletMessage: 'Go to slide {{index}}'
        }
    });

    // Initialize Testimonial Swiper
    initSwiperIfExists('#testiSwiper', {
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '#testiSwiper .swiper-button-next',
            prevEl: '#testiSwiper .swiper-button-prev'
        },
        slidesPerView: 1, // Show one testimonial at a time
        spaceBetween: 20 // Space between slides
    });

    // Initialize Trending Products Swiper
    const trendingSwiper = initSwiperIfExists('#trendingSwiper', {
        loop: false, // No loop for product carousels to show actual start/end
        navigation: {
            nextEl: '#trendingSwiper .swiper-button-next',
            prevEl: '#trendingSwiper .swiper-button-prev'
        },
        slidesPerView: 2,
        spaceBetween: 15,
        breakpoints: { // Responsive breakpoints
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 25 },
            1024: { slidesPerView: 5, spaceBetween: 30 }
        },
        a11y: {
            prevSlideMessage: 'Previous product',
            nextSlideMessage: 'Next product'
        }
    });

    // Custom logic to hide/show navigation buttons for trendingSwiper
    // if there aren't enough slides to fill the view.
    if (trendingSwiper) {
        /**
         * Updates the visibility of navigation buttons based on Swiper's state.
         * @param {Swiper} swiper - The Swiper instance.
         */
        function updateNavButtons(swiper) {
            const nextEl = swiper.navigation.nextEl;
            const prevEl = swiper.navigation.prevEl;
            
            // Hide buttons if there are fewer slides than slidesPerView
            if (swiper.slides.length <= swiper.params.slidesPerView) {
                if (nextEl) nextEl.style.display = 'none';
                if (prevEl) prevEl.style.display = 'none';
            } else {
                // Otherwise, show/hide based on beginning/end of slides
                if (nextEl) nextEl.style.display = swiper.isEnd ? 'none' : 'block';
                if (prevEl) prevEl.style.display = swiper.isBeginning ? 'none' : 'block';
            }
        }

        // Call updateNavButtons on init and resize
        trendingSwiper.on('init', () => updateNavButtons(trendingSwiper));
        trendingSwiper.on('resize', () => updateNavButtons(trendingSwiper));
        // Also update on slide change if loop is false
        trendingSwiper.on('slideChange', () => updateNavButtons(trendingSwiper));
    }
}

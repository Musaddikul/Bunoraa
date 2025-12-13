// static/js/components/slider.js
/**
 * Slider/Carousel Component
 * Touch-enabled slider with multiple features
 */

class Slider {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        
        if (!this.container) {
            console.error('Slider: Container not found');
            return;
        }

        this.options = {
            slidesPerView: options.slidesPerView || 1,
            spaceBetween: options.spaceBetween || 0,
            loop: options.loop || false,
            autoplay: options.autoplay || false,
            autoplayDelay: options.autoplayDelay || 5000,
            pauseOnHover: options.pauseOnHover !== false,
            navigation: options.navigation !== false,
            pagination: options.pagination !== false,
            paginationType: options.paginationType || 'bullets', // bullets, fraction, progressbar
            keyboard: options.keyboard !== false,
            touch: options.touch !== false,
            breakpoints: options.breakpoints || {},
            onChange: options.onChange || null,
            onInit: options.onInit || null
        };

        this.track = this.container.querySelector('.slider-track');
        this.slides = Array.from(this.container.querySelectorAll('.slider-slide'));
        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this._init();
    }

    /**
     * Initialize slider
     */
    _init() {
        if (!this.track || this.slides.length === 0) return;

        this._setupStyles();
        this._createNavigation();
        this._createPagination();
        this._setupEventListeners();
        this._handleBreakpoints();
        this._startAutoplay();

        // Callback
        if (this.options.onInit) {
            this.options.onInit(this);
        }
    }

    /**
     * Setup base styles
     */
    _setupStyles() {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';

        this.track.style.display = 'flex';
        this.track.style.transition = 'transform 0.3s ease';
        this.track.style.willChange = 'transform';

        this._updateSlideStyles();
    }

    /**
     * Update slide widths based on current settings
     */
    _updateSlideStyles() {
        const slidesPerView = this._getCurrentSlidesPerView();
        const spaceBetween = this.options.spaceBetween;
        const slideWidth = `calc((100% - ${spaceBetween * (slidesPerView - 1)}px) / ${slidesPerView})`;

        this.slides.forEach((slide, index) => {
            slide.style.flexShrink = '0';
            slide.style.width = slideWidth;
            slide.style.marginRight = index < this.slides.length - 1 ? `${spaceBetween}px` : '0';
        });
    }

    /**
     * Get current slides per view (considering breakpoints)
     */
    _getCurrentSlidesPerView() {
        const width = window.innerWidth;
        let slidesPerView = this.options.slidesPerView;

        const breakpoints = Object.keys(this.options.breakpoints)
            .map(Number)
            .sort((a, b) => a - b);

        for (const breakpoint of breakpoints) {
            if (width >= breakpoint) {
                slidesPerView = this.options.breakpoints[breakpoint].slidesPerView || slidesPerView;
            }
        }

        return slidesPerView;
    }

    /**
     * Create navigation buttons
     */
    _createNavigation() {
        if (!this.options.navigation) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
        prevBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>';
        prevBtn.setAttribute('aria-label', 'Previous slide');

        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
        nextBtn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
        nextBtn.setAttribute('aria-label', 'Next slide');

        this.container.appendChild(prevBtn);
        this.container.appendChild(nextBtn);

        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;

        prevBtn.addEventListener('click', () => this.prev());
        nextBtn.addEventListener('click', () => this.next());

        this._updateNavigation();
    }

    /**
     * Update navigation state
     */
    _updateNavigation() {
        if (!this.prevBtn || !this.nextBtn) return;

        const maxIndex = this._getMaxIndex();

        if (this.options.loop) {
            this.prevBtn.disabled = false;
            this.nextBtn.disabled = false;
        } else {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.nextBtn.disabled = this.currentIndex >= maxIndex;
        }
    }

    /**
     * Create pagination
     */
    _createPagination() {
        if (!this.options.pagination) return;

        const pagination = document.createElement('div');
        pagination.className = 'slider-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2';

        if (this.options.paginationType === 'bullets') {
            const totalBullets = this._getTotalPages();
            for (let i = 0; i < totalBullets; i++) {
                const bullet = document.createElement('button');
                bullet.className = 'slider-bullet w-2 h-2 rounded-full bg-white/50 transition-all duration-300';
                bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
                bullet.addEventListener('click', () => this.goTo(i * this._getCurrentSlidesPerView()));
                pagination.appendChild(bullet);
            }
        } else if (this.options.paginationType === 'fraction') {
            pagination.innerHTML = `<span class="slider-current">1</span> / <span class="slider-total">${this._getTotalPages()}</span>`;
            pagination.className += ' text-sm text-white font-medium bg-black/30 px-3 py-1 rounded-full';
        } else if (this.options.paginationType === 'progressbar') {
            pagination.className = 'slider-pagination absolute bottom-0 left-0 right-0 h-1 bg-white/30';
            pagination.innerHTML = '<div class="slider-progress h-full bg-white transition-all duration-300" style="width: 0%"></div>';
        }

        this.container.appendChild(pagination);
        this.pagination = pagination;

        this._updatePagination();
    }

    /**
     * Update pagination state
     */
    _updatePagination() {
        if (!this.pagination) return;

        const currentPage = Math.floor(this.currentIndex / this._getCurrentSlidesPerView());
        const totalPages = this._getTotalPages();

        if (this.options.paginationType === 'bullets') {
            const bullets = this.pagination.querySelectorAll('.slider-bullet');
            bullets.forEach((bullet, i) => {
                bullet.classList.toggle('bg-white', i === currentPage);
                bullet.classList.toggle('w-4', i === currentPage);
            });
        } else if (this.options.paginationType === 'fraction') {
            this.pagination.querySelector('.slider-current').textContent = currentPage + 1;
        } else if (this.options.paginationType === 'progressbar') {
            const progress = this.pagination.querySelector('.slider-progress');
            const percent = ((currentPage + 1) / totalPages) * 100;
            progress.style.width = `${percent}%`;
        }
    }

    /**
     * Get total pages
     */
    _getTotalPages() {
        const slidesPerView = this._getCurrentSlidesPerView();
        return Math.ceil(this.slides.length / slidesPerView);
    }

    /**
     * Get max slide index
     */
    _getMaxIndex() {
        const slidesPerView = this._getCurrentSlidesPerView();
        return Math.max(0, this.slides.length - slidesPerView);
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        // Keyboard navigation
        if (this.options.keyboard) {
            this.container.setAttribute('tabindex', '0');
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });
        }

        // Touch events
        if (this.options.touch) {
            this.container.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this._stopAutoplay();
            }, { passive: true });

            this.container.addEventListener('touchmove', (e) => {
                this.touchEndX = e.touches[0].clientX;
            }, { passive: true });

            this.container.addEventListener('touchend', () => {
                const diff = this.touchStartX - this.touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) this.next();
                    else this.prev();
                }
                this._startAutoplay();
            });
        }

        // Pause on hover
        if (this.options.pauseOnHover && this.options.autoplay) {
            this.container.addEventListener('mouseenter', () => this._stopAutoplay());
            this.container.addEventListener('mouseleave', () => this._startAutoplay());
        }

        // Window resize
        window.addEventListener('resize', () => {
            this._handleBreakpoints();
            this._updateSlideStyles();
            this.goTo(this.currentIndex);
        });
    }

    /**
     * Handle breakpoints
     */
    _handleBreakpoints() {
        this._updateSlideStyles();
        this._updatePagination();
    }

    /**
     * Start autoplay
     */
    _startAutoplay() {
        if (!this.options.autoplay) return;

        this._stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.options.autoplayDelay);
    }

    /**
     * Stop autoplay
     */
    _stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    /**
     * Go to specific slide
     */
    goTo(index) {
        if (this.isAnimating) return;

        const maxIndex = this._getMaxIndex();
        let newIndex = index;

        if (this.options.loop) {
            if (index < 0) newIndex = maxIndex;
            if (index > maxIndex) newIndex = 0;
        } else {
            newIndex = Math.max(0, Math.min(index, maxIndex));
        }

        this.isAnimating = true;
        this.currentIndex = newIndex;

        const slideWidth = this.slides[0].offsetWidth + this.options.spaceBetween;
        const offset = -newIndex * slideWidth;

        this.track.style.transform = `translateX(${offset}px)`;

        this._updateNavigation();
        this._updatePagination();

        // Callback
        if (this.options.onChange) {
            this.options.onChange({
                currentIndex: this.currentIndex,
                slide: this.slides[this.currentIndex]
            });
        }

        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    /**
     * Go to next slide
     */
    next() {
        const slidesPerView = this._getCurrentSlidesPerView();
        this.goTo(this.currentIndex + slidesPerView);
    }

    /**
     * Go to previous slide
     */
    prev() {
        const slidesPerView = this._getCurrentSlidesPerView();
        this.goTo(this.currentIndex - slidesPerView);
    }

    /**
     * Destroy slider
     */
    destroy() {
        this._stopAutoplay();
        
        if (this.prevBtn) this.prevBtn.remove();
        if (this.nextBtn) this.nextBtn.remove();
        if (this.pagination) this.pagination.remove();

        this.track.style = '';
        this.slides.forEach(slide => slide.style = '');
    }

    /**
     * Static method to initialize all sliders
     */
    static initAll(selector = '[data-slider]') {
        const containers = document.querySelectorAll(selector);
        return Array.from(containers).map(container => {
            const options = {
                slidesPerView: parseInt(container.dataset.slidesPerView) || 1,
                spaceBetween: parseInt(container.dataset.spaceBetween) || 0,
                loop: container.dataset.loop === 'true',
                autoplay: container.dataset.autoplay === 'true',
                autoplayDelay: parseInt(container.dataset.autoplayDelay) || 5000
            };
            return new Slider(container, options);
        });
    }
}

// Export
export default Slider;
window.Slider = Slider;

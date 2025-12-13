/**
 * Image Gallery Component
 * Product image gallery with zoom and thumbnails.
 */

import { $, $$, createElement, on } from '../utils/dom.js';

class ImageGallery {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? $(container) : container;
        if (!this.container) return;

        this.options = {
            images: options.images || [],
            thumbnailPosition: options.thumbnailPosition || 'bottom', // bottom, left, right
            zoomEnabled: options.zoomEnabled !== false,
            zoomScale: options.zoomScale || 2,
            showNavigation: options.showNavigation !== false,
            autoplay: options.autoplay || false,
            autoplaySpeed: options.autoplaySpeed || 5000,
            ...options
        };

        this.currentIndex = 0;
        this.isZoomed = false;

        this.init();
    }

    init() {
        if (!this.options.images.length) return;

        this.render();
        this.bindEvents();

        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    render() {
        const { images, thumbnailPosition } = this.options;

        this.container.innerHTML = `
            <div class="image-gallery flex ${thumbnailPosition === 'left' ? 'flex-row-reverse' : thumbnailPosition === 'right' ? 'flex-row' : 'flex-col'} gap-4">
                <!-- Main Image -->
                <div class="gallery-main relative flex-1 ${thumbnailPosition === 'bottom' ? '' : 'order-1'}">
                    <div class="gallery-viewport relative overflow-hidden bg-gray-100 rounded-2xl aspect-square">
                        <img 
                            src="${images[0].url}" 
                            alt="${images[0].alt || ''}" 
                            class="gallery-image w-full h-full object-contain transition-transform duration-300"
                        >
                        ${this.options.zoomEnabled ? `
                            <div class="gallery-zoom-lens absolute w-40 h-40 border-2 border-white/50 bg-white/10 rounded-lg pointer-events-none opacity-0 transition-opacity"></div>
                        ` : ''}
                    </div>
                    
                    ${this.options.showNavigation && images.length > 1 ? `
                        <button class="gallery-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <button class="gallery-next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    ` : ''}

                    <!-- Zoom Window -->
                    ${this.options.zoomEnabled ? `
                        <div class="gallery-zoom-window hidden lg:block absolute top-0 left-full ml-4 w-[400px] h-[400px] bg-white rounded-xl shadow-2xl overflow-hidden z-10 opacity-0 invisible transition-all">
                            <img src="${images[0].url}" alt="" class="gallery-zoom-image w-full h-full object-cover" style="transform-origin: 0 0;">
                        </div>
                    ` : ''}
                </div>
                
                <!-- Thumbnails -->
                ${images.length > 1 ? `
                    <div class="gallery-thumbnails flex ${thumbnailPosition === 'bottom' ? 'flex-row' : 'flex-col'} gap-2 ${thumbnailPosition === 'bottom' ? 'overflow-x-auto' : 'overflow-y-auto max-h-[400px] w-20'}">
                        ${images.map((img, i) => `
                            <button 
                                class="gallery-thumb flex-shrink-0 ${thumbnailPosition === 'bottom' ? 'w-16 h-16' : 'w-full aspect-square'} rounded-lg overflow-hidden border-2 transition-all ${i === 0 ? 'border-primary-500' : 'border-transparent hover:border-gray-300'}"
                                data-index="${i}"
                            >
                                <img src="${img.thumbnail || img.url}" alt="${img.alt || ''}" class="w-full h-full object-cover">
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        this.mainImage = $('.gallery-image', this.container);
        this.zoomLens = $('.gallery-zoom-lens', this.container);
        this.zoomWindow = $('.gallery-zoom-window', this.container);
        this.zoomImage = $('.gallery-zoom-image', this.container);
        this.viewport = $('.gallery-viewport', this.container);
    }

    bindEvents() {
        // Thumbnail clicks
        $$('.gallery-thumb', this.container).forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.goTo(parseInt(thumb.dataset.index));
            });
        });

        // Navigation
        const prevBtn = $('.gallery-prev', this.container);
        const nextBtn = $('.gallery-next', this.container);
        
        prevBtn?.addEventListener('click', () => this.prev());
        nextBtn?.addEventListener('click', () => this.next());

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Zoom functionality
        if (this.options.zoomEnabled && this.viewport) {
            this.viewport.addEventListener('mouseenter', () => this.enableZoom());
            this.viewport.addEventListener('mouseleave', () => this.disableZoom());
            this.viewport.addEventListener('mousemove', (e) => this.handleZoom(e));
        }

        // Touch swipe
        let startX = 0;
        this.viewport?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.viewport?.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.next() : this.prev();
            }
        }, { passive: true });
    }

    goTo(index) {
        const images = this.options.images;
        if (index < 0 || index >= images.length) return;

        this.currentIndex = index;
        const image = images[index];

        // Update main image
        this.mainImage.src = image.url;
        this.mainImage.alt = image.alt || '';

        // Update zoom image
        if (this.zoomImage) {
            this.zoomImage.src = image.url;
        }

        // Update thumbnails
        $$('.gallery-thumb', this.container).forEach((thumb, i) => {
            thumb.classList.toggle('border-primary-500', i === index);
            thumb.classList.toggle('border-transparent', i !== index);
        });
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.options.images.length;
        this.goTo(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.options.images.length) % this.options.images.length;
        this.goTo(prevIndex);
    }

    enableZoom() {
        if (!this.zoomLens || !this.zoomWindow) return;
        
        this.isZoomed = true;
        this.zoomLens.style.opacity = '1';
        this.zoomWindow.classList.remove('invisible');
        this.zoomWindow.style.opacity = '1';
    }

    disableZoom() {
        if (!this.zoomLens || !this.zoomWindow) return;
        
        this.isZoomed = false;
        this.zoomLens.style.opacity = '0';
        this.zoomWindow.style.opacity = '0';
        setTimeout(() => {
            if (!this.isZoomed) {
                this.zoomWindow.classList.add('invisible');
            }
        }, 200);
    }

    handleZoom(e) {
        if (!this.isZoomed || !this.zoomLens || !this.zoomImage) return;

        const rect = this.viewport.getBoundingClientRect();
        const lensRect = this.zoomLens.getBoundingClientRect();

        // Calculate lens position
        let x = e.clientX - rect.left - lensRect.width / 2;
        let y = e.clientY - rect.top - lensRect.height / 2;

        // Constrain to viewport
        x = Math.max(0, Math.min(x, rect.width - lensRect.width));
        y = Math.max(0, Math.min(y, rect.height - lensRect.height));

        this.zoomLens.style.left = `${x}px`;
        this.zoomLens.style.top = `${y}px`;

        // Calculate zoom image position
        const scale = this.options.zoomScale;
        const zoomX = (x / rect.width) * 100 * scale;
        const zoomY = (y / rect.height) * 100 * scale;

        this.zoomImage.style.transform = `scale(${scale})`;
        this.zoomImage.style.transformOrigin = `${zoomX}% ${zoomY}%`;
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.next(), this.options.autoplaySpeed);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this.stopAutoplay();
        this.container.innerHTML = '';
    }
}

// Auto-initialize
function initGalleries() {
    $$('[data-image-gallery]').forEach(container => {
        const images = JSON.parse(container.dataset.images || '[]');
        new ImageGallery(container, { images });
    });
}

export default ImageGallery;
export { ImageGallery, initGalleries };

/**
 * Product Gallery Component
 * @module components/productGallery
 */

const ProductGallery = (function() {
    'use strict';

    let currentIndex = 0;
    let images = [];
    let zoomEnabled = true;
    let lightboxModal = null;

    function init(container, imageList, options = {}) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        if (!container) return;

        images = imageList || [];
        currentIndex = 0;
        zoomEnabled = options.zoom !== false;

        if (images.length === 0) {
            container.innerHTML = `
                <div class="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
            `;
            return;
        }

        render(container);
        bindEvents(container);
    }

    function render(container) {
        const mainImage = images[currentIndex];

        container.innerHTML = `
            <div class="space-y-4">
                <div class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group" data-main-image>
                    <img 
                        src="${mainImage.image || mainImage}" 
                        alt="${mainImage.alt || 'Product image'}"
                        class="w-full h-full object-cover transition-transform duration-300"
                        data-gallery-main
                    >
                    
                    ${zoomEnabled ? `
                        <button 
                            type="button" 
                            class="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            data-gallery-zoom
                            aria-label="Zoom image"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                            </svg>
                        </button>
                    ` : ''}
                    
                    ${images.length > 1 ? `
                        <button 
                            type="button" 
                            class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                            data-gallery-prev
                            ${currentIndex === 0 ? 'disabled' : ''}
                            aria-label="Previous image"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <button 
                            type="button" 
                            class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                            data-gallery-next
                            ${currentIndex === images.length - 1 ? 'disabled' : ''}
                            aria-label="Next image"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                
                ${images.length > 1 ? `
                    <div class="flex gap-3 overflow-x-auto pb-2" data-gallery-thumbs>
                        ${images.map((img, idx) => `
                            <button 
                                type="button"
                                class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${idx === currentIndex ? 'border-primary-600' : 'border-transparent hover:border-gray-300'}"
                                data-gallery-thumb="${idx}"
                            >
                                <img 
                                    src="${img.thumbnail || img.image || img}" 
                                    alt="Thumbnail ${idx + 1}"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                >
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    function bindEvents(container) {
        container.addEventListener('click', (e) => {
            const prev = e.target.closest('[data-gallery-prev]');
            const next = e.target.closest('[data-gallery-next]');
            const thumb = e.target.closest('[data-gallery-thumb]');
            const zoom = e.target.closest('[data-gallery-zoom]');
            const main = e.target.closest('[data-gallery-main]');

            if (prev && currentIndex > 0) {
                goTo(currentIndex - 1);
                render(container);
                bindEvents(container);
            }

            if (next && currentIndex < images.length - 1) {
                goTo(currentIndex + 1);
                render(container);
                bindEvents(container);
            }

            if (thumb) {
                goTo(parseInt(thumb.dataset.galleryThumb));
                render(container);
                bindEvents(container);
            }

            if (zoom || (main && zoomEnabled)) {
                openLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightboxModal) {
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    goTo(currentIndex - 1);
                    updateLightbox();
                }
                if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
                    goTo(currentIndex + 1);
                    updateLightbox();
                }
            }
        });
    }

    function goTo(index) {
        if (index >= 0 && index < images.length) {
            currentIndex = index;
        }
    }

    function openLightbox() {
        const currentImage = images[currentIndex];

        lightboxModal = Modal.create({
            id: 'gallery-lightbox',
            title: '',
            size: 'xl',
            className: 'bg-black',
            content: `
                <div class="relative" data-lightbox-container>
                    <img 
                        src="${currentImage.image || currentImage}" 
                        alt="${currentImage.alt || 'Product image'}"
                        class="max-h-[80vh] mx-auto"
                        data-lightbox-image
                    >
                    
                    ${images.length > 1 ? `
                        <button 
                            type="button" 
                            class="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                            data-lightbox-prev
                            aria-label="Previous"
                        >
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <button 
                            type="button" 
                            class="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                            data-lightbox-next
                            aria-label="Next"
                        >
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            ${images.map((_, idx) => `
                                <button 
                                    type="button"
                                    class="w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}"
                                    data-lightbox-dot="${idx}"
                                ></button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `,
            showFooter: false,
            onClose: () => {
                lightboxModal = null;
            }
        });

        const modalBody = Modal.getBody('gallery-lightbox');
        modalBody?.addEventListener('click', (e) => {
            const prev = e.target.closest('[data-lightbox-prev]');
            const next = e.target.closest('[data-lightbox-next]');
            const dot = e.target.closest('[data-lightbox-dot]');

            if (prev && currentIndex > 0) {
                goTo(currentIndex - 1);
                updateLightbox();
            }

            if (next && currentIndex < images.length - 1) {
                goTo(currentIndex + 1);
                updateLightbox();
            }

            if (dot) {
                goTo(parseInt(dot.dataset.lightboxDot));
                updateLightbox();
            }
        });

        Modal.open('gallery-lightbox');
    }

    function updateLightbox() {
        const currentImage = images[currentIndex];
        const img = document.querySelector('[data-lightbox-image]');
        const dots = document.querySelectorAll('[data-lightbox-dot]');

        if (img) {
            img.src = currentImage.image || currentImage;
        }

        dots.forEach((dot, idx) => {
            dot.classList.toggle('bg-white', idx === currentIndex);
            dot.classList.toggle('bg-white/50', idx !== currentIndex);
        });
    }

    function closeLightbox() {
        if (lightboxModal) {
            Modal.close('gallery-lightbox');
            Modal.destroy('gallery-lightbox');
            lightboxModal = null;
        }
    }

    return {
        init,
        goTo,
        openLightbox,
        closeLightbox,
        getCurrentIndex: () => currentIndex,
        getImages: () => images
    };
})();

window.ProductGallery = ProductGallery;

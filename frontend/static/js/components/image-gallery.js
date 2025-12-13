// frontend/static/js/components/image-gallery.js
/**
 * Image Gallery/Lightbox Component
 */

import { $, createElement } from '../utils/dom.js';

/**
 * Gallery class
 */
export class Gallery {
    constructor(options = {}) {
        this.options = {
            images: options.images || [],
            startIndex: options.startIndex || 0,
            showThumbnails: options.showThumbnails !== false,
            showCounter: options.showCounter !== false,
            closeOnBackdrop: options.closeOnBackdrop !== false,
            keyboard: options.keyboard !== false,
            zoom: options.zoom !== false,
            onChange: options.onChange || null,
            onClose: options.onClose || null
        };
        
        this.currentIndex = this.options.startIndex;
        this.isZoomed = false;
        this.element = null;
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    create() {
        this.element = createElement('div', {
            class: 'gallery-lightbox fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': 'Image gallery'
        });
        
        // Header
        const header = createElement('div', {
            class: 'gallery-header flex items-center justify-between p-4 text-white'
        });
        
        if (this.options.showCounter) {
            this.counter = createElement('div', {
                class: 'gallery-counter text-sm'
            });
            header.appendChild(this.counter);
        }
        
        const controls = createElement('div', { class: 'flex items-center gap-4' });
        
        if (this.options.zoom) {
            const zoomBtn = createElement('button', {
                class: 'gallery-zoom p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors',
                'aria-label': 'Toggle zoom',
                innerHTML: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>`,
                onClick: () => this.toggleZoom()
            });
            controls.appendChild(zoomBtn);
        }
        
        const closeBtn = createElement('button', {
            class: 'gallery-close p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors',
            'aria-label': 'Close gallery',
            innerHTML: `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>`,
            onClick: () => this.close()
        });
        controls.appendChild(closeBtn);
        
        header.appendChild(controls);
        this.element.appendChild(header);
        
        // Main image area
        const mainArea = createElement('div', {
            class: 'gallery-main flex-1 flex items-center justify-center relative overflow-hidden'
        });
        
        // Previous button
        const prevBtn = createElement('button', {
            class: 'gallery-prev absolute left-4 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-colors z-10',
            'aria-label': 'Previous image',
            innerHTML: `<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>`,
            onClick: () => this.prev()
        });
        mainArea.appendChild(prevBtn);
        
        // Image container
        this.imageContainer = createElement('div', {
            class: 'gallery-image-container flex items-center justify-center max-w-full max-h-full px-16'
        });
        
        this.mainImage = createElement('img', {
            class: 'gallery-image max-w-full max-h-[70vh] object-contain transition-transform duration-300 cursor-zoom-in',
            alt: '',
            onClick: () => {
                if (this.options.zoom) {
                    this.toggleZoom();
                }
            }
        });
        this.imageContainer.appendChild(this.mainImage);
        mainArea.appendChild(this.imageContainer);
        
        // Next button
        const nextBtn = createElement('button', {
            class: 'gallery-next absolute right-4 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-colors z-10',
            'aria-label': 'Next image',
            innerHTML: `<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>`,
            onClick: () => this.next()
        });
        mainArea.appendChild(nextBtn);
        
        // Backdrop click
        if (this.options.closeOnBackdrop) {
            mainArea.addEventListener('click', (e) => {
                if (e.target === mainArea) {
                    this.close();
                }
            });
        }
        
        this.element.appendChild(mainArea);
        
        // Thumbnails
        if (this.options.showThumbnails && this.options.images.length > 1) {
            this.thumbnailContainer = createElement('div', {
                class: 'gallery-thumbnails flex items-center justify-center gap-2 p-4 overflow-x-auto'
            });
            
            this.options.images.forEach((image, index) => {
                const thumb = createElement('button', {
                    class: 'gallery-thumbnail w-16 h-16 rounded overflow-hidden opacity-50 hover:opacity-75 transition-opacity flex-shrink-0',
                    'aria-label': `View image ${index + 1}`,
                    dataset: { index },
                    onClick: () => this.goTo(index)
                });
                
                const thumbImg = createElement('img', {
                    class: 'w-full h-full object-cover',
                    src: image.thumbnail || image.src || image,
                    alt: image.alt || `Thumbnail ${index + 1}`
                });
                thumb.appendChild(thumbImg);
                
                this.thumbnailContainer.appendChild(thumb);
            });
            
            this.element.appendChild(this.thumbnailContainer);
        }
        
        document.body.appendChild(this.element);
        
        return this;
    }
    
    open(startIndex = 0) {
        if (!this.element) {
            this.create();
        }
        
        this.currentIndex = startIndex;
        this.updateImage();
        
        // Show
        this.element.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Keyboard listener
        if (this.options.keyboard) {
            document.addEventListener('keydown', this.handleKeyDown);
        }
        
        return this;
    }
    
    close() {
        if (!this.element) return;
        
        this.element.classList.add('hidden');
        document.body.style.overflow = '';
        
        document.removeEventListener('keydown', this.handleKeyDown);
        
        if (this.options.onClose) {
            this.options.onClose();
        }
        
        return this;
    }
    
    handleKeyDown(e) {
        switch (e.key) {
            case 'Escape':
                this.close();
                break;
            case 'ArrowLeft':
                this.prev();
                break;
            case 'ArrowRight':
                this.next();
                break;
        }
    }
    
    prev() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.options.images.length - 1;
        }
        this.updateImage();
    }
    
    next() {
        this.currentIndex++;
        if (this.currentIndex >= this.options.images.length) {
            this.currentIndex = 0;
        }
        this.updateImage();
    }
    
    goTo(index) {
        if (index < 0 || index >= this.options.images.length) return;
        this.currentIndex = index;
        this.updateImage();
    }
    
    updateImage() {
        const image = this.options.images[this.currentIndex];
        const src = image.src || image;
        const alt = image.alt || `Image ${this.currentIndex + 1}`;
        
        // Reset zoom
        if (this.isZoomed) {
            this.toggleZoom();
        }
        
        // Update main image
        this.mainImage.src = src;
        this.mainImage.alt = alt;
        
        // Update counter
        if (this.counter) {
            this.counter.textContent = `${this.currentIndex + 1} / ${this.options.images.length}`;
        }
        
        // Update thumbnails
        if (this.thumbnailContainer) {
            const thumbs = this.thumbnailContainer.querySelectorAll('.gallery-thumbnail');
            thumbs.forEach((thumb, index) => {
                thumb.classList.toggle('opacity-100', index === this.currentIndex);
                thumb.classList.toggle('opacity-50', index !== this.currentIndex);
                thumb.classList.toggle('ring-2', index === this.currentIndex);
                thumb.classList.toggle('ring-white', index === this.currentIndex);
            });
        }
        
        // Callback
        if (this.options.onChange) {
            this.options.onChange({ index: this.currentIndex, image });
        }
    }
    
    toggleZoom() {
        this.isZoomed = !this.isZoomed;
        
        if (this.isZoomed) {
            this.mainImage.classList.remove('cursor-zoom-in', 'max-h-[70vh]');
            this.mainImage.classList.add('cursor-zoom-out', 'scale-150');
        } else {
            this.mainImage.classList.add('cursor-zoom-in', 'max-h-[70vh]');
            this.mainImage.classList.remove('cursor-zoom-out', 'scale-150');
        }
    }
    
    setImages(images) {
        this.options.images = images;
        this.currentIndex = 0;
        
        if (this.element && !this.element.classList.contains('hidden')) {
            this.updateImage();
        }
        
        return this;
    }
    
    destroy() {
        this.close();
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}

/**
 * Create and open gallery
 */
export function openGallery(images, startIndex = 0, options = {}) {
    const gallery = new Gallery({ ...options, images, startIndex });
    return gallery.open();
}

/**
 * Initialize gallery triggers
 */
export function initGalleries() {
    // Find all elements with data-gallery attribute
    const galleries = {};
    
    document.querySelectorAll('[data-gallery]').forEach(element => {
        const galleryName = element.dataset.gallery;
        
        if (!galleries[galleryName]) {
            galleries[galleryName] = [];
        }
        
        const index = galleries[galleryName].length;
        galleries[galleryName].push({
            src: element.href || element.dataset.src || element.src,
            thumbnail: element.dataset.thumbnail,
            alt: element.dataset.alt || element.alt
        });
        
        element.addEventListener('click', (e) => {
            e.preventDefault();
            openGallery(galleries[galleryName], index);
        });
    });
}

export default {
    Gallery,
    openGallery,
    initGalleries
};

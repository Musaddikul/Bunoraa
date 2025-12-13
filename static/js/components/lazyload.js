// static/js/components/lazyload.js
/**
 * Lazy Loading Component
 * Lazy load images and iframes using Intersection Observer
 */

class LazyLoad {
    constructor(options = {}) {
        this.options = {
            selector: options.selector || '[data-lazy]',
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.01,
            loaded: options.loaded || 'lazy-loaded',
            loading: options.loading || 'lazy-loading',
            error: options.error || 'lazy-error',
            placeholder: options.placeholder || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            onLoad: options.onLoad || null,
            onError: options.onError || null
        };

        this.observer = null;
        this.elements = [];

        this._init();
    }

    /**
     * Initialize lazy loader
     */
    _init() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this._loadAllImmediately();
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => this._handleIntersection(entries),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );

        this.observe();
    }

    /**
     * Handle intersection
     */
    _handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this._load(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    /**
     * Load element
     */
    _load(element) {
        const src = element.dataset.src || element.dataset.lazy;
        const srcset = element.dataset.srcset;
        const sizes = element.dataset.sizes;
        const bgImage = element.dataset.bgSrc;

        element.classList.add(this.options.loading);

        if (bgImage) {
            // Background image
            const img = new Image();
            img.onload = () => {
                element.style.backgroundImage = `url(${bgImage})`;
                this._onLoaded(element);
            };
            img.onerror = () => this._onError(element);
            img.src = bgImage;
        } else if (element.tagName === 'IMG') {
            // Image element
            element.onload = () => this._onLoaded(element);
            element.onerror = () => this._onError(element);

            if (srcset) element.srcset = srcset;
            if (sizes) element.sizes = sizes;
            if (src) element.src = src;
        } else if (element.tagName === 'IFRAME') {
            // Iframe element
            element.onload = () => this._onLoaded(element);
            element.onerror = () => this._onError(element);
            if (src) element.src = src;
        } else if (element.tagName === 'VIDEO') {
            // Video element
            const source = element.querySelector('source[data-src]');
            if (source) {
                source.src = source.dataset.src;
                element.load();
            } else if (src) {
                element.src = src;
            }
            element.onloadeddata = () => this._onLoaded(element);
            element.onerror = () => this._onError(element);
        } else if (element.tagName === 'PICTURE') {
            // Picture element
            const sources = element.querySelectorAll('source[data-srcset]');
            sources.forEach(source => {
                source.srcset = source.dataset.srcset;
            });
            const img = element.querySelector('img');
            if (img) {
                img.onload = () => this._onLoaded(element);
                img.onerror = () => this._onError(element);
                if (img.dataset.src) img.src = img.dataset.src;
            }
        }
    }

    /**
     * Handle load success
     */
    _onLoaded(element) {
        element.classList.remove(this.options.loading);
        element.classList.add(this.options.loaded);
        element.removeAttribute('data-lazy');
        element.removeAttribute('data-src');
        element.removeAttribute('data-srcset');
        element.removeAttribute('data-sizes');
        element.removeAttribute('data-bg-src');

        if (this.options.onLoad) {
            this.options.onLoad(element);
        }
    }

    /**
     * Handle load error
     */
    _onError(element) {
        element.classList.remove(this.options.loading);
        element.classList.add(this.options.error);

        if (this.options.onError) {
            this.options.onError(element);
        }
    }

    /**
     * Load all elements immediately (fallback)
     */
    _loadAllImmediately() {
        const elements = document.querySelectorAll(this.options.selector);
        elements.forEach(element => this._load(element));
    }

    /**
     * Start observing elements
     */
    observe(selector = null) {
        const elements = document.querySelectorAll(selector || this.options.selector);
        elements.forEach(element => {
            if (!element.classList.contains(this.options.loaded)) {
                this.elements.push(element);
                this.observer?.observe(element);
            }
        });
    }

    /**
     * Update (observe new elements)
     */
    update() {
        this.observe();
    }

    /**
     * Destroy lazy loader
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.elements = [];
    }

    /**
     * Static method for quick initialization
     */
    static init(options = {}) {
        return new LazyLoad(options);
    }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = LazyLoad.init();
});

// Export
export default LazyLoad;
window.LazyLoad = LazyLoad;

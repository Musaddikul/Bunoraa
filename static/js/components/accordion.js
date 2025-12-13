// static/js/components/accordion.js
/**
 * Accordion Component
 * Collapsible content sections
 */

class Accordion {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        
        if (!this.container) {
            console.error('Accordion: Container not found');
            return;
        }

        this.options = {
            multiple: options.multiple || false, // Allow multiple open panels
            activeClass: options.activeClass || 'accordion-active',
            iconSelector: options.iconSelector || '.accordion-icon',
            contentSelector: options.contentSelector || '.accordion-content',
            triggerSelector: options.triggerSelector || '.accordion-trigger',
            animation: options.animation !== false,
            onChange: options.onChange || null
        };

        this.items = Array.from(this.container.querySelectorAll('.accordion-item'));
        this.activeItems = new Set();

        this._init();
    }

    /**
     * Initialize accordion
     */
    _init() {
        this.items.forEach((item, index) => {
            const trigger = item.querySelector(this.options.triggerSelector);
            const content = item.querySelector(this.options.contentSelector);

            if (!trigger || !content) return;

            // Set up ARIA
            const triggerId = trigger.id || `accordion-trigger-${index}`;
            const contentId = content.id || `accordion-content-${index}`;

            trigger.id = triggerId;
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', contentId);

            content.id = contentId;
            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', triggerId);
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = this.options.animation ? 'max-height 0.3s ease' : 'none';

            // Check if initially open
            if (item.classList.contains(this.options.activeClass)) {
                this._expand(item, false);
            }

            // Event listener
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle(index);
            });

            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle(index);
                }
            });
        });
    }

    /**
     * Expand an item
     */
    _expand(item, animate = true) {
        const trigger = item.querySelector(this.options.triggerSelector);
        const content = item.querySelector(this.options.contentSelector);
        const icon = item.querySelector(this.options.iconSelector);

        if (!trigger || !content) return;

        item.classList.add(this.options.activeClass);
        trigger.setAttribute('aria-expanded', 'true');
        
        // Animate height
        if (animate && this.options.animation) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = 'none';
        }

        // Rotate icon
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }
    }

    /**
     * Collapse an item
     */
    _collapse(item, animate = true) {
        const trigger = item.querySelector(this.options.triggerSelector);
        const content = item.querySelector(this.options.contentSelector);
        const icon = item.querySelector(this.options.iconSelector);

        if (!trigger || !content) return;

        item.classList.remove(this.options.activeClass);
        trigger.setAttribute('aria-expanded', 'false');

        // Animate height
        if (animate && this.options.animation) {
            content.style.maxHeight = content.scrollHeight + 'px';
            requestAnimationFrame(() => {
                content.style.maxHeight = '0';
            });
        } else {
            content.style.maxHeight = '0';
        }

        // Reset icon
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Toggle item by index
     */
    toggle(index) {
        const item = this.items[index];
        if (!item) return;

        const isOpen = item.classList.contains(this.options.activeClass);

        if (isOpen) {
            this._collapse(item);
            this.activeItems.delete(index);
        } else {
            // Close others if not multiple
            if (!this.options.multiple) {
                this.activeItems.forEach(i => {
                    if (i !== index) {
                        this._collapse(this.items[i]);
                    }
                });
                this.activeItems.clear();
            }

            this._expand(item);
            this.activeItems.add(index);
        }

        // Callback
        if (this.options.onChange) {
            this.options.onChange({
                index,
                isOpen: !isOpen,
                item,
                activeItems: Array.from(this.activeItems)
            });
        }
    }

    /**
     * Open item by index
     */
    open(index) {
        const item = this.items[index];
        if (!item || item.classList.contains(this.options.activeClass)) return;

        if (!this.options.multiple) {
            this.closeAll();
        }

        this._expand(item);
        this.activeItems.add(index);
    }

    /**
     * Close item by index
     */
    close(index) {
        const item = this.items[index];
        if (!item || !item.classList.contains(this.options.activeClass)) return;

        this._collapse(item);
        this.activeItems.delete(index);
    }

    /**
     * Open all items
     */
    openAll() {
        this.items.forEach((item, index) => {
            this._expand(item);
            this.activeItems.add(index);
        });
    }

    /**
     * Close all items
     */
    closeAll() {
        this.items.forEach((item, index) => {
            this._collapse(item);
        });
        this.activeItems.clear();
    }

    /**
     * Destroy accordion
     */
    destroy() {
        this.items.forEach(item => {
            const trigger = item.querySelector(this.options.triggerSelector);
            const content = item.querySelector(this.options.contentSelector);

            if (trigger) {
                trigger.removeAttribute('aria-expanded');
                trigger.removeAttribute('aria-controls');
            }

            if (content) {
                content.removeAttribute('role');
                content.removeAttribute('aria-labelledby');
                content.style.maxHeight = '';
                content.style.overflow = '';
                content.style.transition = '';
            }
        });
    }

    /**
     * Static method to initialize all accordions
     */
    static initAll(selector = '[data-accordion]') {
        const containers = document.querySelectorAll(selector);
        return Array.from(containers).map(container => {
            const multiple = container.dataset.accordionMultiple === 'true';
            return new Accordion(container, { multiple });
        });
    }
}

// Export
export default Accordion;
window.Accordion = Accordion;

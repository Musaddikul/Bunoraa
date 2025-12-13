// frontend/static/js/components/accordion.js
/**
 * Accordion Component
 */

import { $, $$, addClass, removeClass, hasClass, toggleClass } from '../utils/dom.js';

/**
 * Accordion class
 */
export class Accordion {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? $(element) : element;
        if (!this.element) return;
        
        this.options = {
            multiple: options.multiple || false,
            activeClass: options.activeClass || 'active',
            headerSelector: options.headerSelector || '[data-accordion-header]',
            contentSelector: options.contentSelector || '[data-accordion-content]',
            iconSelector: options.iconSelector || '[data-accordion-icon]',
            animationDuration: options.animationDuration || 300,
            onChange: options.onChange || null
        };
        
        this.items = Array.from(this.element.querySelectorAll('[data-accordion-item]'));
        
        this.init();
    }
    
    init() {
        this.items.forEach((item, index) => {
            const header = item.querySelector(this.options.headerSelector);
            const content = item.querySelector(this.options.contentSelector);
            
            if (!header || !content) return;
            
            // Set ARIA attributes
            const id = content.id || `accordion-content-${index}`;
            content.id = id;
            header.setAttribute('aria-controls', id);
            header.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
            
            // Initial state
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = `max-height ${this.options.animationDuration}ms ease`;
            
            // Click handler
            header.addEventListener('click', () => this.toggle(index));
            
            // Keyboard handler
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle(index);
                }
            });
            
            // Check if initially active
            if (hasClass(item, this.options.activeClass)) {
                this.open(index, false);
            }
        });
    }
    
    toggle(index) {
        const item = this.items[index];
        if (!item) return;
        
        if (hasClass(item, this.options.activeClass)) {
            this.close(index);
        } else {
            this.open(index);
        }
    }
    
    open(index, animate = true) {
        const item = this.items[index];
        if (!item) return;
        
        const header = item.querySelector(this.options.headerSelector);
        const content = item.querySelector(this.options.contentSelector);
        const icon = item.querySelector(this.options.iconSelector);
        
        // Close others if not multiple
        if (!this.options.multiple) {
            this.items.forEach((otherItem, i) => {
                if (i !== index && hasClass(otherItem, this.options.activeClass)) {
                    this.close(i);
                }
            });
        }
        
        // Open this item
        addClass(item, this.options.activeClass);
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        
        // Rotate icon
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }
        
        // Animate
        if (animate) {
            content.style.maxHeight = content.scrollHeight + 'px';
            
            // After animation, set to auto for dynamic content
            setTimeout(() => {
                content.style.maxHeight = 'none';
            }, this.options.animationDuration);
        } else {
            content.style.maxHeight = 'none';
        }
        
        // Callback
        if (this.options.onChange) {
            this.options.onChange({ index, isOpen: true, item });
        }
    }
    
    close(index, animate = true) {
        const item = this.items[index];
        if (!item) return;
        
        const header = item.querySelector(this.options.headerSelector);
        const content = item.querySelector(this.options.contentSelector);
        const icon = item.querySelector(this.options.iconSelector);
        
        // Set explicit height for animation
        if (animate) {
            content.style.maxHeight = content.scrollHeight + 'px';
            // Force reflow
            content.offsetHeight;
        }
        
        // Close
        removeClass(item, this.options.activeClass);
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        
        // Reset icon
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
        
        // Animate
        if (animate) {
            requestAnimationFrame(() => {
                content.style.maxHeight = '0';
            });
        } else {
            content.style.maxHeight = '0';
        }
        
        // Callback
        if (this.options.onChange) {
            this.options.onChange({ index, isOpen: false, item });
        }
    }
    
    openAll() {
        this.items.forEach((_, index) => this.open(index));
    }
    
    closeAll() {
        this.items.forEach((_, index) => this.close(index));
    }
    
    getOpenItems() {
        return this.items
            .map((item, index) => hasClass(item, this.options.activeClass) ? index : -1)
            .filter(index => index !== -1);
    }
}

/**
 * Initialize all accordions
 */
export function initAccordions() {
    const instances = [];
    
    $$('[data-accordion]').forEach(element => {
        const multiple = element.dataset.accordionMultiple === 'true';
        instances.push(new Accordion(element, { multiple }));
    });
    
    return instances;
}

export default {
    Accordion,
    initAccordions
};

// frontend/static/js/components/dropdown.js
/**
 * Dropdown Component
 */

import { $, $$, addClass, removeClass, hasClass } from '../utils/dom.js';

/**
 * Dropdown class
 */
export class Dropdown {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? $(element) : element;
        if (!this.element) return;
        
        this.options = {
            trigger: options.trigger || 'click', // click, hover
            placement: options.placement || 'bottom-start',
            offset: options.offset || 4,
            onOpen: options.onOpen || null,
            onClose: options.onClose || null,
            closeOnSelect: options.closeOnSelect !== false,
            closeOnOutsideClick: options.closeOnOutsideClick !== false
        };
        
        this.toggle = this.element.querySelector('[data-dropdown-toggle]') || 
                      this.element.querySelector('.dropdown-toggle');
        this.menu = this.element.querySelector('[data-dropdown-menu]') || 
                    this.element.querySelector('.dropdown-menu');
        
        this.isOpen = false;
        
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        
        this.init();
    }
    
    init() {
        if (!this.toggle || !this.menu) return;
        
        // Set ARIA attributes
        this.toggle.setAttribute('aria-haspopup', 'true');
        this.toggle.setAttribute('aria-expanded', 'false');
        
        if (this.options.trigger === 'click') {
            this.toggle.addEventListener('click', this.handleToggleClick);
        } else if (this.options.trigger === 'hover') {
            this.element.addEventListener('mouseenter', this.handleMouseEnter);
            this.element.addEventListener('mouseleave', this.handleMouseLeave);
        }
        
        // Keyboard navigation
        this.element.addEventListener('keydown', this.handleKeyDown);
        
        // Close on menu item click
        if (this.options.closeOnSelect) {
            this.menu.addEventListener('click', (e) => {
                const item = e.target.closest('[data-dropdown-item], .dropdown-item');
                if (item) {
                    this.close();
                }
            });
        }
    }
    
    handleToggleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isOpen ? this.close() : this.open();
    }
    
    handleMouseEnter() {
        this.open();
    }
    
    handleMouseLeave() {
        this.close();
    }
    
    handleOutsideClick(e) {
        if (!this.element.contains(e.target)) {
            this.close();
        }
    }
    
    handleKeyDown(e) {
        const items = Array.from(this.menu.querySelectorAll('[data-dropdown-item], .dropdown-item:not(.disabled)'));
        
        switch (e.key) {
            case 'Escape':
                this.close();
                this.toggle.focus();
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) {
                    this.open();
                } else {
                    this.focusNextItem(items, 1);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (this.isOpen) {
                    this.focusNextItem(items, -1);
                }
                break;
                
            case 'Enter':
            case ' ':
                if (this.isOpen && document.activeElement !== this.toggle) {
                    e.preventDefault();
                    document.activeElement.click();
                }
                break;
                
            case 'Tab':
                this.close();
                break;
        }
    }
    
    focusNextItem(items, direction) {
        const currentIndex = items.indexOf(document.activeElement);
        let nextIndex;
        
        if (currentIndex === -1) {
            nextIndex = direction === 1 ? 0 : items.length - 1;
        } else {
            nextIndex = currentIndex + direction;
            if (nextIndex < 0) nextIndex = items.length - 1;
            if (nextIndex >= items.length) nextIndex = 0;
        }
        
        items[nextIndex]?.focus();
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.menu.classList.remove('hidden');
        this.toggle.setAttribute('aria-expanded', 'true');
        
        // Position menu
        this.positionMenu();
        
        // Outside click handler
        if (this.options.closeOnOutsideClick && this.options.trigger === 'click') {
            setTimeout(() => {
                document.addEventListener('click', this.handleOutsideClick);
            }, 0);
        }
        
        if (this.options.onOpen) {
            this.options.onOpen(this);
        }
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.menu.classList.add('hidden');
        this.toggle.setAttribute('aria-expanded', 'false');
        
        document.removeEventListener('click', this.handleOutsideClick);
        
        if (this.options.onClose) {
            this.options.onClose(this);
        }
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    positionMenu() {
        // Reset positioning
        this.menu.style.top = '';
        this.menu.style.bottom = '';
        this.menu.style.left = '';
        this.menu.style.right = '';
        
        const toggleRect = this.toggle.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Calculate available space
        const spaceBelow = viewportHeight - toggleRect.bottom;
        const spaceAbove = toggleRect.top;
        
        // Vertical positioning
        if (this.options.placement.includes('top') || 
            (this.options.placement.includes('bottom') && spaceBelow < menuRect.height && spaceAbove > spaceBelow)) {
            this.menu.style.bottom = '100%';
            this.menu.style.marginBottom = `${this.options.offset}px`;
        } else {
            this.menu.style.top = '100%';
            this.menu.style.marginTop = `${this.options.offset}px`;
        }
        
        // Horizontal positioning
        if (this.options.placement.includes('end') || this.options.placement.includes('right')) {
            this.menu.style.right = '0';
        } else if (this.options.placement.includes('center')) {
            this.menu.style.left = '50%';
            this.menu.style.transform = 'translateX(-50%)';
        } else {
            this.menu.style.left = '0';
        }
    }
    
    destroy() {
        this.close();
        this.toggle.removeEventListener('click', this.handleToggleClick);
        this.element.removeEventListener('mouseenter', this.handleMouseEnter);
        this.element.removeEventListener('mouseleave', this.handleMouseLeave);
        this.element.removeEventListener('keydown', this.handleKeyDown);
    }
}

/**
 * Initialize all dropdowns
 */
export function initDropdowns() {
    const dropdowns = [];
    
    $$('[data-dropdown]').forEach(element => {
        const trigger = element.dataset.dropdownTrigger || 'click';
        const placement = element.dataset.dropdownPlacement || 'bottom-start';
        
        dropdowns.push(new Dropdown(element, { trigger, placement }));
    });
    
    return dropdowns;
}

export default {
    Dropdown,
    initDropdowns
};

// static/js/components/dropdown.js
/**
 * Dropdown Component
 * Reusable dropdown menus
 */

class Dropdown {
    constructor(trigger, options = {}) {
        this.trigger = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
        
        if (!this.trigger) {
            console.error('Dropdown: Trigger element not found');
            return;
        }

        this.options = {
            menu: options.menu || null,
            placement: options.placement || 'bottom-start', // bottom-start, bottom-end, top-start, top-end
            offset: options.offset || 8,
            closeOnClick: options.closeOnClick !== false,
            closeOnOutside: options.closeOnOutside !== false,
            animation: options.animation || 'fade', // fade, scale, slide
            onOpen: options.onOpen || null,
            onClose: options.onClose || null
        };

        this.menu = this.options.menu 
            ? (typeof this.options.menu === 'string' ? document.querySelector(this.options.menu) : this.options.menu)
            : this.trigger.nextElementSibling;

        this.isOpen = false;

        this._handleTriggerClick = this._handleTriggerClick.bind(this);
        this._handleOutsideClick = this._handleOutsideClick.bind(this);
        this._handleMenuClick = this._handleMenuClick.bind(this);
        this._handleKeydown = this._handleKeydown.bind(this);

        this._init();
    }

    /**
     * Initialize dropdown
     */
    _init() {
        // Set up trigger
        this.trigger.setAttribute('aria-haspopup', 'true');
        this.trigger.setAttribute('aria-expanded', 'false');

        // Set up menu
        if (this.menu) {
            this.menu.setAttribute('role', 'menu');
            this.menu.classList.add('hidden', 'opacity-0', 'transform');
            this._setupMenuItems();
        }

        // Event listeners
        this.trigger.addEventListener('click', this._handleTriggerClick);
        this.trigger.addEventListener('keydown', this._handleKeydown);
    }

    /**
     * Setup menu items for accessibility
     */
    _setupMenuItems() {
        const items = this.menu.querySelectorAll('a, button');
        items.forEach((item, index) => {
            item.setAttribute('role', 'menuitem');
            item.setAttribute('tabindex', '-1');
        });
    }

    /**
     * Handle trigger click
     */
    _handleTriggerClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
    }

    /**
     * Handle outside click
     */
    _handleOutsideClick(e) {
        if (!this.trigger.contains(e.target) && !this.menu.contains(e.target)) {
            this.close();
        }
    }

    /**
     * Handle menu click
     */
    _handleMenuClick(e) {
        if (this.options.closeOnClick && (e.target.tagName === 'A' || e.target.tagName === 'BUTTON')) {
            this.close();
        }
    }

    /**
     * Handle keyboard navigation
     */
    _handleKeydown(e) {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.toggle();
                break;
            case 'Escape':
                this.close();
                this.trigger.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) {
                    this.open();
                }
                this._focusNextItem();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this._focusPrevItem();
                break;
        }
    }

    /**
     * Focus next menu item
     */
    _focusNextItem() {
        const items = Array.from(this.menu.querySelectorAll('[role="menuitem"]:not([disabled])'));
        const currentIndex = items.indexOf(document.activeElement);
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[nextIndex]?.focus();
    }

    /**
     * Focus previous menu item
     */
    _focusPrevItem() {
        const items = Array.from(this.menu.querySelectorAll('[role="menuitem"]:not([disabled])'));
        const currentIndex = items.indexOf(document.activeElement);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prevIndex]?.focus();
    }

    /**
     * Position menu
     */
    _positionMenu() {
        const triggerRect = this.trigger.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();
        const offset = this.options.offset;

        let top, left;

        switch (this.options.placement) {
            case 'bottom-start':
                top = triggerRect.bottom + offset;
                left = triggerRect.left;
                break;
            case 'bottom-end':
                top = triggerRect.bottom + offset;
                left = triggerRect.right - menuRect.width;
                break;
            case 'top-start':
                top = triggerRect.top - menuRect.height - offset;
                left = triggerRect.left;
                break;
            case 'top-end':
                top = triggerRect.top - menuRect.height - offset;
                left = triggerRect.right - menuRect.width;
                break;
        }

        // Viewport bounds
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < 0) left = offset;
        if (left + menuRect.width > viewportWidth) left = viewportWidth - menuRect.width - offset;
        if (top < 0) top = triggerRect.bottom + offset;
        if (top + menuRect.height > viewportHeight) top = triggerRect.top - menuRect.height - offset;

        this.menu.style.position = 'fixed';
        this.menu.style.top = `${top}px`;
        this.menu.style.left = `${left}px`;
    }

    /**
     * Get animation classes
     */
    _getAnimationClasses(show) {
        const animations = {
            fade: {
                show: 'opacity-100',
                hide: 'opacity-0'
            },
            scale: {
                show: 'opacity-100 scale-100',
                hide: 'opacity-0 scale-95'
            },
            slide: {
                show: 'opacity-100 translate-y-0',
                hide: 'opacity-0 -translate-y-2'
            }
        };

        const anim = animations[this.options.animation] || animations.fade;
        return show ? anim.show : anim.hide;
    }

    /**
     * Open dropdown
     */
    open() {
        if (this.isOpen || !this.menu) return;

        // Show menu
        this.menu.classList.remove('hidden');
        this._positionMenu();

        // Animate in
        requestAnimationFrame(() => {
            const hideClasses = this._getAnimationClasses(false).split(' ');
            const showClasses = this._getAnimationClasses(true).split(' ');
            
            hideClasses.forEach(cls => this.menu.classList.remove(cls));
            showClasses.forEach(cls => this.menu.classList.add(cls));
        });

        // Update ARIA
        this.trigger.setAttribute('aria-expanded', 'true');

        this.isOpen = true;

        // Event listeners
        if (this.options.closeOnOutside) {
            document.addEventListener('click', this._handleOutsideClick);
        }
        this.menu.addEventListener('click', this._handleMenuClick);
        this.menu.addEventListener('keydown', this._handleKeydown);

        // Callback
        if (this.options.onOpen) {
            this.options.onOpen(this);
        }
    }

    /**
     * Close dropdown
     */
    close() {
        if (!this.isOpen || !this.menu) return;

        // Animate out
        const hideClasses = this._getAnimationClasses(false).split(' ');
        const showClasses = this._getAnimationClasses(true).split(' ');
        
        showClasses.forEach(cls => this.menu.classList.remove(cls));
        hideClasses.forEach(cls => this.menu.classList.add(cls));

        // Update ARIA
        this.trigger.setAttribute('aria-expanded', 'false');

        this.isOpen = false;

        // Remove event listeners
        document.removeEventListener('click', this._handleOutsideClick);
        this.menu.removeEventListener('click', this._handleMenuClick);
        this.menu.removeEventListener('keydown', this._handleKeydown);

        // Hide after animation
        setTimeout(() => {
            if (!this.isOpen) {
                this.menu.classList.add('hidden');
            }
        }, 200);

        // Callback
        if (this.options.onClose) {
            this.options.onClose(this);
        }
    }

    /**
     * Toggle dropdown
     */
    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    /**
     * Destroy dropdown
     */
    destroy() {
        this.close();
        this.trigger.removeEventListener('click', this._handleTriggerClick);
        this.trigger.removeEventListener('keydown', this._handleKeydown);
        this.trigger.removeAttribute('aria-haspopup');
        this.trigger.removeAttribute('aria-expanded');
    }

    /**
     * Static method to initialize all dropdowns
     */
    static initAll(selector = '[data-dropdown]') {
        const triggers = document.querySelectorAll(selector);
        return Array.from(triggers).map(trigger => {
            const menuSelector = trigger.dataset.dropdownMenu;
            const placement = trigger.dataset.dropdownPlacement;
            return new Dropdown(trigger, { menu: menuSelector, placement });
        });
    }
}

// Export
export default Dropdown;
window.Dropdown = Dropdown;

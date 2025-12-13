// static/js/components/tabs.js
/**
 * Tabs Component
 * Accessible tabs with keyboard navigation
 */

class Tabs {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        
        if (!this.container) {
            console.error('Tabs: Container not found');
            return;
        }

        this.options = {
            activeClass: options.activeClass || 'tab-active',
            animation: options.animation || 'fade', // fade, slide, none
            onChange: options.onChange || null,
            initialTab: options.initialTab || 0
        };

        this.tabList = this.container.querySelector('[role="tablist"]');
        this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
        this.panels = Array.from(this.container.querySelectorAll('[role="tabpanel"]'));
        this.activeIndex = this.options.initialTab;

        this._init();
    }

    /**
     * Initialize tabs
     */
    _init() {
        // Set up ARIA attributes
        this.tabs.forEach((tab, index) => {
            tab.setAttribute('id', tab.id || `tab-${index}`);
            tab.setAttribute('aria-selected', index === this.activeIndex);
            tab.setAttribute('tabindex', index === this.activeIndex ? '0' : '-1');

            const panel = this.panels[index];
            if (panel) {
                panel.setAttribute('id', panel.id || `panel-${index}`);
                tab.setAttribute('aria-controls', panel.id);
                panel.setAttribute('aria-labelledby', tab.id);
            }

            // Event listeners
            tab.addEventListener('click', (e) => this._handleTabClick(e, index));
            tab.addEventListener('keydown', (e) => this._handleKeydown(e, index));
        });

        // Show initial tab
        this._activateTab(this.activeIndex);
    }

    /**
     * Handle tab click
     */
    _handleTabClick(e, index) {
        e.preventDefault();
        this.switchTo(index);
    }

    /**
     * Handle keyboard navigation
     */
    _handleKeydown(e, index) {
        let newIndex;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                newIndex = index > 0 ? index - 1 : this.tabs.length - 1;
                this.switchTo(newIndex);
                this.tabs[newIndex].focus();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = index < this.tabs.length - 1 ? index + 1 : 0;
                this.switchTo(newIndex);
                this.tabs[newIndex].focus();
                break;
            case 'Home':
                e.preventDefault();
                this.switchTo(0);
                this.tabs[0].focus();
                break;
            case 'End':
                e.preventDefault();
                this.switchTo(this.tabs.length - 1);
                this.tabs[this.tabs.length - 1].focus();
                break;
        }
    }

    /**
     * Activate tab by index
     */
    _activateTab(index) {
        // Deactivate all tabs
        this.tabs.forEach((tab, i) => {
            const isActive = i === index;
            tab.setAttribute('aria-selected', isActive);
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
            tab.classList.toggle(this.options.activeClass, isActive);
        });

        // Show/hide panels
        this.panels.forEach((panel, i) => {
            const isActive = i === index;
            
            if (this.options.animation === 'fade') {
                if (isActive) {
                    panel.classList.remove('hidden');
                    panel.classList.add('animate-fade-in');
                } else {
                    panel.classList.add('hidden');
                    panel.classList.remove('animate-fade-in');
                }
            } else if (this.options.animation === 'slide') {
                if (isActive) {
                    panel.classList.remove('hidden');
                    panel.classList.add('animate-slide-in');
                } else {
                    panel.classList.add('hidden');
                    panel.classList.remove('animate-slide-in');
                }
            } else {
                panel.classList.toggle('hidden', !isActive);
            }
        });

        this.activeIndex = index;
    }

    /**
     * Switch to tab by index
     */
    switchTo(index) {
        if (index < 0 || index >= this.tabs.length || index === this.activeIndex) {
            return;
        }

        const prevIndex = this.activeIndex;
        this._activateTab(index);

        // Callback
        if (this.options.onChange) {
            this.options.onChange({
                prevIndex,
                currentIndex: index,
                tab: this.tabs[index],
                panel: this.panels[index]
            });
        }
    }

    /**
     * Switch to tab by ID
     */
    switchToId(id) {
        const index = this.tabs.findIndex(tab => tab.id === id);
        if (index !== -1) {
            this.switchTo(index);
        }
    }

    /**
     * Get current active index
     */
    getActiveIndex() {
        return this.activeIndex;
    }

    /**
     * Get current active tab
     */
    getActiveTab() {
        return this.tabs[this.activeIndex];
    }

    /**
     * Get current active panel
     */
    getActivePanel() {
        return this.panels[this.activeIndex];
    }

    /**
     * Destroy tabs
     */
    destroy() {
        this.tabs.forEach((tab, index) => {
            tab.removeEventListener('click', (e) => this._handleTabClick(e, index));
            tab.removeEventListener('keydown', (e) => this._handleKeydown(e, index));
        });
    }

    /**
     * Static method to initialize all tabs
     */
    static initAll(selector = '[data-tabs]') {
        const containers = document.querySelectorAll(selector);
        return Array.from(containers).map(container => {
            const animation = container.dataset.tabsAnimation;
            return new Tabs(container, { animation });
        });
    }
}

// Export
export default Tabs;
window.Tabs = Tabs;

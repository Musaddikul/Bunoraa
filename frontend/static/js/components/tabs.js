// frontend/static/js/components/tabs.js
/**
 * Tabs Component
 */

import { $, $$, addClass, removeClass, hasClass } from '../utils/dom.js';

/**
 * Tabs class
 */
export class Tabs {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? $(element) : element;
        if (!this.element) return;
        
        this.options = {
            activeClass: options.activeClass || 'active',
            tabSelector: options.tabSelector || '[data-tab]',
            panelSelector: options.panelSelector || '[data-tab-panel]',
            onChange: options.onChange || null,
            hash: options.hash || false
        };
        
        this.tabs = Array.from(this.element.querySelectorAll(this.options.tabSelector));
        this.panels = Array.from(this.element.querySelectorAll(this.options.panelSelector));
        
        this.activeIndex = 0;
        
        this.init();
    }
    
    init() {
        // Set ARIA attributes
        this.tabs.forEach((tab, index) => {
            const panelId = tab.dataset.tab || `tab-panel-${index}`;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', panelId);
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
            
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.activate(index);
            });
            
            tab.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
        });
        
        this.panels.forEach((panel, index) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', '0');
            panel.classList.add('hidden');
        });
        
        // Activate initial tab
        let initialIndex = 0;
        
        // Check for hash
        if (this.options.hash && window.location.hash) {
            const hashTab = this.tabs.findIndex(tab => 
                `#${tab.dataset.tab}` === window.location.hash
            );
            if (hashTab !== -1) {
                initialIndex = hashTab;
            }
        }
        
        // Check for active class
        const activeTab = this.tabs.findIndex(tab => 
            hasClass(tab, this.options.activeClass)
        );
        if (activeTab !== -1) {
            initialIndex = activeTab;
        }
        
        this.activate(initialIndex);
        
        // Listen for hash changes
        if (this.options.hash) {
            window.addEventListener('hashchange', () => {
                const hashTab = this.tabs.findIndex(tab => 
                    `#${tab.dataset.tab}` === window.location.hash
                );
                if (hashTab !== -1) {
                    this.activate(hashTab);
                }
            });
        }
    }
    
    handleKeyDown(e, currentIndex) {
        let newIndex;
        
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = this.tabs.length - 1;
                this.activate(newIndex);
                this.tabs[newIndex].focus();
                break;
                
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = currentIndex + 1;
                if (newIndex >= this.tabs.length) newIndex = 0;
                this.activate(newIndex);
                this.tabs[newIndex].focus();
                break;
                
            case 'Home':
                e.preventDefault();
                this.activate(0);
                this.tabs[0].focus();
                break;
                
            case 'End':
                e.preventDefault();
                this.activate(this.tabs.length - 1);
                this.tabs[this.tabs.length - 1].focus();
                break;
        }
    }
    
    activate(index) {
        if (index < 0 || index >= this.tabs.length) return;
        
        const previousIndex = this.activeIndex;
        this.activeIndex = index;
        
        // Update tabs
        this.tabs.forEach((tab, i) => {
            const isActive = i === index;
            tab.classList.toggle(this.options.activeClass, isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
        });
        
        // Update panels
        this.panels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('hidden', !isActive);
        });
        
        // Update hash
        if (this.options.hash && this.tabs[index].dataset.tab) {
            history.replaceState(null, '', `#${this.tabs[index].dataset.tab}`);
        }
        
        // Callback
        if (this.options.onChange && previousIndex !== index) {
            this.options.onChange({
                previousIndex,
                currentIndex: index,
                tab: this.tabs[index],
                panel: this.panels[index]
            });
        }
    }
    
    next() {
        let nextIndex = this.activeIndex + 1;
        if (nextIndex >= this.tabs.length) nextIndex = 0;
        this.activate(nextIndex);
    }
    
    prev() {
        let prevIndex = this.activeIndex - 1;
        if (prevIndex < 0) prevIndex = this.tabs.length - 1;
        this.activate(prevIndex);
    }
    
    getActiveIndex() {
        return this.activeIndex;
    }
    
    getActiveTab() {
        return this.tabs[this.activeIndex];
    }
    
    getActivePanel() {
        return this.panels[this.activeIndex];
    }
}

/**
 * Initialize all tabs
 */
export function initTabs() {
    const instances = [];
    
    $$('[data-tabs]').forEach(element => {
        const hash = element.dataset.tabsHash === 'true';
        instances.push(new Tabs(element, { hash }));
    });
    
    return instances;
}

export default {
    Tabs,
    initTabs
};

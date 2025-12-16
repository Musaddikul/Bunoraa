/**
 * Tabs Component
 * @module components/tabs
 */

const Tabs = (function() {
    'use strict';

    const instances = new Map();

    function create(container, options = {}) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        if (!container) return null;

        const {
            activeTab = 0,
            orientation = 'horizontal',
            variant = 'underline',
            onChange = null
        } = options;

        const id = container.id || 'tabs-' + Date.now();
        const tabs = container.querySelectorAll('[data-tab]');
        const panels = container.querySelectorAll('[data-tab-panel]');

        const instance = {
            id,
            container,
            tabs: Array.from(tabs),
            panels: Array.from(panels),
            activeIndex: activeTab,
            onChange
        };

        applyStyles(instance, variant, orientation);
        setActive(instance, activeTab);
        bindEvents(instance);

        instances.set(id, instance);
        return instance;
    }

    function applyStyles(instance, variant, orientation) {
        const { tabs, panels } = instance;
        
        const tabListClass = orientation === 'vertical' 
            ? 'flex flex-col border-r border-gray-200'
            : 'flex border-b border-gray-200';
        
        const tabList = tabs[0]?.parentElement;
        if (tabList) {
            tabList.className = tabListClass;
            tabList.setAttribute('role', 'tablist');
            tabList.setAttribute('aria-orientation', orientation);
        }

        tabs.forEach((tab, index) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
            tab.id = tab.id || `${instance.id}-tab-${index}`;
            
            const panelId = panels[index]?.id || `${instance.id}-panel-${index}`;
            tab.setAttribute('aria-controls', panelId);

            const baseClass = orientation === 'vertical'
                ? 'px-4 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                : 'px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';

            let variantClass = '';
            switch (variant) {
                case 'underline':
                    variantClass = orientation === 'vertical'
                        ? 'border-r-2 border-transparent'
                        : 'border-b-2 border-transparent -mb-px';
                    break;
                case 'pills':
                    variantClass = 'rounded-lg';
                    break;
                case 'boxed':
                    variantClass = 'border border-transparent';
                    break;
            }

            tab.className = `${baseClass} ${variantClass} text-gray-600 hover:text-gray-900`;
            tab.dataset.variant = variant;
        });

        panels.forEach((panel, index) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', '0');
            panel.id = panel.id || `${instance.id}-panel-${index}`;
            
            const tabId = tabs[index]?.id || `${instance.id}-tab-${index}`;
            panel.setAttribute('aria-labelledby', tabId);
            
            panel.classList.add('hidden');
        });
    }

    function setActive(instance, index) {
        const { tabs, panels } = instance;
        
        if (index < 0 || index >= tabs.length) return;

        tabs.forEach((tab, i) => {
            const isActive = i === index;
            const variant = tab.dataset.variant;
            
            tab.setAttribute('aria-selected', String(isActive));
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
            
            tab.classList.remove(
                'text-primary-600', 'border-primary-600', 'bg-primary-50', 
                'bg-white', 'border-gray-200', 'text-gray-600'
            );
            
            if (isActive) {
                tab.classList.add('text-primary-600');
                switch (variant) {
                    case 'underline':
                        tab.classList.add('border-primary-600');
                        break;
                    case 'pills':
                        tab.classList.add('bg-primary-50');
                        break;
                    case 'boxed':
                        tab.classList.add('bg-white', 'border-gray-200');
                        break;
                }
            } else {
                tab.classList.add('text-gray-600');
            }
        });

        panels.forEach((panel, i) => {
            panel.classList.toggle('hidden', i !== index);
        });

        instance.activeIndex = index;

        if (instance.onChange) {
            instance.onChange(index, tabs[index], panels[index]);
        }
    }

    function bindEvents(instance) {
        const { tabs } = instance;

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                setActive(instance, index);
            });

            tab.addEventListener('keydown', (e) => {
                let newIndex = instance.activeIndex;

                switch (e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        newIndex = instance.activeIndex > 0 
                            ? instance.activeIndex - 1 
                            : tabs.length - 1;
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        newIndex = instance.activeIndex < tabs.length - 1 
                            ? instance.activeIndex + 1 
                            : 0;
                        break;
                    case 'Home':
                        e.preventDefault();
                        newIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        newIndex = tabs.length - 1;
                        break;
                }

                if (newIndex !== instance.activeIndex) {
                    setActive(instance, newIndex);
                    tabs[newIndex].focus();
                }
            });
        });
    }

    function getActive(id) {
        const instance = instances.get(id);
        return instance ? instance.activeIndex : -1;
    }

    function goTo(id, index) {
        const instance = instances.get(id);
        if (instance) {
            setActive(instance, index);
        }
    }

    function destroy(id) {
        const instance = instances.get(id);
        if (instance) {
            instances.delete(id);
        }
    }

    function init() {
        document.querySelectorAll('[data-tabs]').forEach(container => {
            create(container, {
                activeTab: parseInt(container.dataset.activeTab) || 0,
                orientation: container.dataset.orientation || 'horizontal',
                variant: container.dataset.variant || 'underline'
            });
        });
    }

    return {
        create,
        getActive,
        goTo,
        destroy,
        init
    };
})();

window.Tabs = Tabs;

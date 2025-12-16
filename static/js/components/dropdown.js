/**
 * Dropdown Component
 * @module components/dropdown
 */

const Dropdown = (function() {
    'use strict';

    const instances = new Map();
    let activeDropdown = null;

    function create(trigger, options = {}) {
        const {
            content = '',
            placement = 'bottom-start',
            offset = 8,
            closeOnClick = true,
            closeOnOutside = true,
            onOpen = null,
            onClose = null
        } = options;

        if (typeof trigger === 'string') {
            trigger = document.querySelector(trigger);
        }

        if (!trigger) return null;

        const id = 'dropdown-' + Date.now();
        
        const dropdown = document.createElement('div');
        dropdown.id = id;
        dropdown.className = 'absolute z-50 hidden opacity-0 transform scale-95 transition-all duration-150';
        dropdown.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px]">
                ${content}
            </div>
        `;
        
        document.body.appendChild(dropdown);

        const instance = {
            id,
            trigger,
            dropdown,
            options,
            isOpen: false,
            onOpen,
            onClose
        };

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle(id);
        });

        if (closeOnClick) {
            dropdown.addEventListener('click', (e) => {
                if (e.target.closest('[data-dropdown-item]')) {
                    close(id);
                }
            });
        }

        instances.set(id, instance);
        return instance;
    }

    function position(instance) {
        const { trigger, dropdown, options } = instance;
        const { placement, offset } = options;

        const triggerRect = trigger.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        let top, left;

        switch (placement) {
            case 'bottom-start':
                top = triggerRect.bottom + offset;
                left = triggerRect.left;
                break;
            case 'bottom-end':
                top = triggerRect.bottom + offset;
                left = triggerRect.right - dropdownRect.width;
                break;
            case 'bottom':
                top = triggerRect.bottom + offset;
                left = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2;
                break;
            case 'top-start':
                top = triggerRect.top - dropdownRect.height - offset;
                left = triggerRect.left;
                break;
            case 'top-end':
                top = triggerRect.top - dropdownRect.height - offset;
                left = triggerRect.right - dropdownRect.width;
                break;
            case 'top':
                top = triggerRect.top - dropdownRect.height - offset;
                left = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2;
                break;
            default:
                top = triggerRect.bottom + offset;
                left = triggerRect.left;
        }

        top = Math.max(8, Math.min(top, window.innerHeight - dropdownRect.height - 8));
        left = Math.max(8, Math.min(left, window.innerWidth - dropdownRect.width - 8));

        dropdown.style.top = `${top + window.scrollY}px`;
        dropdown.style.left = `${left + window.scrollX}px`;
    }

    function open(id) {
        const instance = instances.get(id);
        if (!instance || instance.isOpen) return;

        if (activeDropdown && activeDropdown !== id) {
            close(activeDropdown);
        }

        instance.dropdown.classList.remove('hidden');
        position(instance);
        
        requestAnimationFrame(() => {
            instance.dropdown.classList.remove('opacity-0', 'scale-95');
            instance.dropdown.classList.add('opacity-100', 'scale-100');
        });

        instance.isOpen = true;
        activeDropdown = id;

        if (instance.onOpen) instance.onOpen(instance);
    }

    function close(id = null) {
        const targetId = id || activeDropdown;
        if (!targetId) return;

        const instance = instances.get(targetId);
        if (!instance || !instance.isOpen) return;

        instance.dropdown.classList.remove('opacity-100', 'scale-100');
        instance.dropdown.classList.add('opacity-0', 'scale-95');

        setTimeout(() => {
            instance.dropdown.classList.add('hidden');
        }, 150);

        instance.isOpen = false;
        
        if (activeDropdown === targetId) {
            activeDropdown = null;
        }

        if (instance.onClose) instance.onClose(instance);
    }

    function toggle(id) {
        const instance = instances.get(id);
        if (!instance) return;

        if (instance.isOpen) {
            close(id);
        } else {
            open(id);
        }
    }

    function setContent(id, content) {
        const instance = instances.get(id);
        if (!instance) return;

        const inner = instance.dropdown.querySelector('div');
        if (inner) {
            inner.innerHTML = content;
        }
    }

    function destroy(id) {
        const instance = instances.get(id);
        if (!instance) return;

        close(id);
        instance.dropdown.remove();
        instances.delete(id);
    }

    function init() {
        document.addEventListener('click', (e) => {
            if (activeDropdown) {
                const instance = instances.get(activeDropdown);
                if (instance?.options.closeOnOutside) {
                    if (!instance.dropdown.contains(e.target) && !instance.trigger.contains(e.target)) {
                        close(activeDropdown);
                    }
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeDropdown) {
                close(activeDropdown);
            }
        });

        window.addEventListener('resize', Debounce.throttle(() => {
            if (activeDropdown) {
                const instance = instances.get(activeDropdown);
                if (instance) position(instance);
            }
        }, 100));
    }

    return {
        create,
        open,
        close,
        toggle,
        setContent,
        destroy,
        init
    };
})();

window.Dropdown = Dropdown;

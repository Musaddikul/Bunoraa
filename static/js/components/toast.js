/**
 * Toast Component
 * @module components/toast
 */

const Toast = (function() {
    'use strict';

    let container = null;
    const queue = [];
    const maxVisible = 3;
    const defaultDuration = 5000;

    function getContainer() {
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none';
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }
        return container;
    }

    function create(options = {}) {
        const {
            message = '',
            type = 'info',
            duration = defaultDuration,
            closable = true,
            action = null
        } = typeof options === 'string' ? { message: options } : options;

        const icons = {
            success: `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>`,
            error: `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>`,
            warning: `<svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>`,
            info: `<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>`
        };

        const bgColors = {
            success: 'bg-green-50 border-green-200',
            error: 'bg-red-50 border-red-200',
            warning: 'bg-yellow-50 border-yellow-200',
            info: 'bg-blue-50 border-blue-200'
        };

        const toast = document.createElement('div');
        toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg pointer-events-auto transform translate-x-full transition-transform duration-300 ${bgColors[type] || bgColors.info}`;
        toast.setAttribute('role', 'alert');

        toast.innerHTML = `
            <div class="flex-shrink-0">
                ${icons[type] || icons.info}
            </div>
            <div class="flex-1 text-sm text-gray-700">
                ${Templates.escapeHtml(message)}
            </div>
            ${action ? `
                <button type="button" class="flex-shrink-0 text-sm font-medium text-primary-600 hover:text-primary-700" data-toast-action>
                    ${Templates.escapeHtml(action.text)}
                </button>
            ` : ''}
            ${closable ? `
                <button type="button" class="flex-shrink-0 text-gray-400 hover:text-gray-600" data-toast-close aria-label="Close">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            ` : ''}
        `;

        const instance = {
            element: toast,
            timer: null,
            close: () => close(instance)
        };

        if (closable) {
            toast.querySelector('[data-toast-close]')?.addEventListener('click', () => close(instance));
        }

        if (action?.callback) {
            toast.querySelector('[data-toast-action]')?.addEventListener('click', () => {
                action.callback();
                close(instance);
            });
        }

        return instance;
    }

    function show(options) {
        const instance = create(options);
        const cont = getContainer();

        while (queue.length >= maxVisible) {
            const oldest = queue.shift();
            if (!oldest) break;
            clearTimeout(oldest.timer);
            oldest.element?.remove();
            oldest.element = null;
            oldest.closing = false;
        }

        cont.appendChild(instance.element);
        queue.push(instance);

        requestAnimationFrame(() => {
            instance.element.classList.remove('translate-x-full');
            instance.element.classList.add('translate-x-0');
        });

        const duration = typeof options === 'object' ? options.duration : defaultDuration;
        if (duration > 0) {
            instance.timer = setTimeout(() => close(instance), duration);
        }

        return instance;
    }

    function close(instance, options = {}) {
        if (!instance) return;
        const { immediate = false, force = false } = options;
        if (!force && (instance.closing || !instance.element)) return;
        instance.closing = true;

        clearTimeout(instance.timer);
        if (immediate) {
            instance.element?.remove();
            const idx = queue.indexOf(instance);
            if (idx > -1) queue.splice(idx, 1);
            instance.element = null;
            instance.closing = false;
            return;
        }

        if (!instance.element) {
            instance.closing = false;
            return;
        }

        instance.element.classList.remove('translate-x-0');
        instance.element.classList.add('translate-x-full');

        setTimeout(() => {
            instance.element.remove();
            const idx = queue.indexOf(instance);
            if (idx > -1) queue.splice(idx, 1);
            instance.element = null;
            instance.closing = false;
        }, 300);
    }

    function success(message, options = {}) {
        return show({ ...options, message, type: 'success' });
    }

    function error(message, options = {}) {
        return show({ ...options, message, type: 'error', duration: options.duration || 7000 });
    }

    function warning(message, options = {}) {
        return show({ ...options, message, type: 'warning' });
    }

    function info(message, options = {}) {
        return show({ ...options, message, type: 'info' });
    }

    function clearAll() {
        while (queue.length) {
            const instance = queue.shift();
            if (!instance) continue;
            clearTimeout(instance.timer);
            instance.element?.remove();
            instance.element = null;
            instance.closing = false;
        }
    }

    return {
        show,
        success,
        error,
        warning,
        info,
        close,
        clearAll
    };
})();

window.Toast = Toast;

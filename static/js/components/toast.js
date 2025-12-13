// static/js/components/toast.js
/**
 * Toast Notification Component
 * Lightweight toast notifications
 */

class Toast {
    static container = null;
    static queue = [];
    static maxVisible = 5;

    /**
     * Initialize toast container
     */
    static init() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'fixed bottom-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none';
        document.body.appendChild(this.container);
    }

    /**
     * Show toast notification
     */
    static show(options = {}) {
        this.init();

        const {
            message = '',
            type = 'info', // success, error, warning, info
            duration = 4000,
            dismissible = true,
            action = null, // { text: 'Undo', onClick: () => {} }
            icon = null,
            position = 'bottom-right'
        } = options;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = this._getToastClasses(type);
        toast.innerHTML = this._getToastHTML(message, type, dismissible, action, icon);

        // Add to container
        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        });

        // Setup close button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this._dismiss(toast));
        }

        // Setup action button
        const actionBtn = toast.querySelector('.toast-action');
        if (actionBtn && action?.onClick) {
            actionBtn.addEventListener('click', () => {
                action.onClick();
                this._dismiss(toast);
            });
        }

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => this._dismiss(toast), duration);
        }

        // Manage queue
        this._manageQueue();

        return toast;
    }

    /**
     * Get toast CSS classes
     */
    static _getToastClasses(type) {
        const baseClasses = 'flex items-start gap-3 p-4 rounded-xl shadow-lg pointer-events-auto transform transition-all duration-300 translate-x-full opacity-0';
        
        const typeClasses = {
            success: 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800',
            error: 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800',
            warning: 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800',
            info: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
        };

        return `${baseClasses} ${typeClasses[type] || typeClasses.info}`;
    }

    /**
     * Get toast icon
     */
    static _getIcon(type, customIcon) {
        if (customIcon) return customIcon;

        const icons = {
            success: `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>`,
            error: `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>`,
            warning: `<svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>`,
            info: `<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`
        };

        return icons[type] || icons.info;
    }

    /**
     * Get toast HTML
     */
    static _getToastHTML(message, type, dismissible, action, icon) {
        const textColors = {
            success: 'text-green-800 dark:text-green-200',
            error: 'text-red-800 dark:text-red-200',
            warning: 'text-yellow-800 dark:text-yellow-200',
            info: 'text-blue-800 dark:text-blue-200'
        };

        return `
            <div class="flex-shrink-0 mt-0.5">
                ${this._getIcon(type, icon)}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium ${textColors[type] || textColors.info}">${message}</p>
                ${action ? `
                    <button class="toast-action mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        ${action.text}
                    </button>
                ` : ''}
            </div>
            ${dismissible ? `
                <button class="toast-close flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            ` : ''}
        `;
    }

    /**
     * Dismiss toast
     */
    static _dismiss(toast) {
        if (!toast || toast.classList.contains('dismissing')) return;

        toast.classList.add('dismissing');
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');

        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    /**
     * Manage queue (remove oldest if too many)
     */
    static _manageQueue() {
        const toasts = this.container.querySelectorAll('div:not(.dismissing)');
        if (toasts.length > this.maxVisible) {
            this._dismiss(toasts[0]);
        }
    }

    /**
     * Clear all toasts
     */
    static clear() {
        if (!this.container) return;
        const toasts = this.container.querySelectorAll('div');
        toasts.forEach(toast => this._dismiss(toast));
    }

    // Convenience methods
    static success(message, options = {}) {
        return this.show({ ...options, message, type: 'success' });
    }

    static error(message, options = {}) {
        return this.show({ ...options, message, type: 'error' });
    }

    static warning(message, options = {}) {
        return this.show({ ...options, message, type: 'warning' });
    }

    static info(message, options = {}) {
        return this.show({ ...options, message, type: 'info' });
    }
}

// Export
export default Toast;
window.Toast = Toast;

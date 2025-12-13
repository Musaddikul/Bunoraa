// frontend/static/js/components/toast.js
/**
 * Toast Notification Component
 */

import { createElement } from '../utils/dom.js';

/**
 * Toast container
 */
let container = null;

/**
 * Toast queue
 */
const queue = [];

/**
 * Get or create container
 */
function getContainer() {
    if (!container) {
        container = createElement('div', {
            id: 'toast-container',
            class: 'fixed bottom-4 right-4 z-50 flex flex-col gap-2',
            'aria-live': 'polite',
            'aria-atomic': 'true'
        });
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Toast types with icons and colors
 */
const types = {
    success: {
        bgClass: 'bg-green-500',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`
    },
    error: {
        bgClass: 'bg-red-500',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`
    },
    warning: {
        bgClass: 'bg-yellow-500',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>`
    },
    info: {
        bgClass: 'bg-blue-500',
        icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`
    }
};

/**
 * Toast class
 */
export class Toast {
    constructor(options = {}) {
        this.options = {
            message: options.message || '',
            type: options.type || 'info',
            duration: options.duration ?? 4000,
            closable: options.closable !== false,
            position: options.position || 'bottom-right',
            onClose: options.onClose || null,
            action: options.action || null,
            actionText: options.actionText || 'Undo'
        };
        
        this.element = null;
        this.timeout = null;
    }
    
    /**
     * Create toast element
     */
    create() {
        const typeConfig = types[this.options.type] || types.info;
        
        this.element = createElement('div', {
            class: `toast flex items-center gap-3 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-full ${typeConfig.bgClass}`,
            role: 'alert'
        });
        
        // Icon
        const iconWrapper = createElement('div', {
            class: 'flex-shrink-0',
            innerHTML: typeConfig.icon
        });
        this.element.appendChild(iconWrapper);
        
        // Message
        const messageEl = createElement('div', {
            class: 'flex-1 text-sm font-medium',
            text: this.options.message
        });
        this.element.appendChild(messageEl);
        
        // Action button
        if (this.options.action) {
            const actionBtn = createElement('button', {
                class: 'flex-shrink-0 text-sm font-semibold hover:opacity-80 underline',
                text: this.options.actionText,
                onClick: (e) => {
                    e.stopPropagation();
                    this.options.action();
                    this.dismiss();
                }
            });
            this.element.appendChild(actionBtn);
        }
        
        // Close button
        if (this.options.closable) {
            const closeBtn = createElement('button', {
                class: 'flex-shrink-0 ml-2 hover:opacity-80 focus:outline-none',
                'aria-label': 'Close',
                innerHTML: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>`,
                onClick: () => this.dismiss()
            });
            this.element.appendChild(closeBtn);
        }
        
        return this;
    }
    
    /**
     * Show toast
     */
    show() {
        if (!this.element) {
            this.create();
        }
        
        const toastContainer = getContainer();
        
        // Update container position
        this.updateContainerPosition();
        
        // Add to container
        toastContainer.appendChild(this.element);
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.element.classList.remove('translate-x-full');
            this.element.classList.add('translate-x-0');
        });
        
        // Auto dismiss
        if (this.options.duration > 0) {
            this.timeout = setTimeout(() => this.dismiss(), this.options.duration);
        }
        
        // Pause on hover
        this.element.addEventListener('mouseenter', () => {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
        });
        
        this.element.addEventListener('mouseleave', () => {
            if (this.options.duration > 0) {
                this.timeout = setTimeout(() => this.dismiss(), this.options.duration);
            }
        });
        
        return this;
    }
    
    /**
     * Update container position based on options
     */
    updateContainerPosition() {
        const toastContainer = getContainer();
        toastContainer.className = 'fixed z-50 flex flex-col gap-2';
        
        switch (this.options.position) {
            case 'top-left':
                toastContainer.classList.add('top-4', 'left-4');
                break;
            case 'top-right':
                toastContainer.classList.add('top-4', 'right-4');
                break;
            case 'top-center':
                toastContainer.classList.add('top-4', 'left-1/2', '-translate-x-1/2');
                break;
            case 'bottom-left':
                toastContainer.classList.add('bottom-4', 'left-4');
                break;
            case 'bottom-center':
                toastContainer.classList.add('bottom-4', 'left-1/2', '-translate-x-1/2');
                break;
            case 'bottom-right':
            default:
                toastContainer.classList.add('bottom-4', 'right-4');
                break;
        }
    }
    
    /**
     * Dismiss toast
     */
    dismiss() {
        if (!this.element) return;
        
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        
        // Animate out
        this.element.classList.remove('translate-x-0');
        this.element.classList.add('translate-x-full', 'opacity-0');
        
        // Remove after animation
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            
            if (this.options.onClose) {
                this.options.onClose();
            }
        }, 300);
        
        return this;
    }
}

/**
 * Show toast
 */
export function show(options) {
    if (typeof options === 'string') {
        options = { message: options };
    }
    const toast = new Toast(options);
    return toast.show();
}

/**
 * Show success toast
 */
export function success(message, options = {}) {
    return show({ ...options, message, type: 'success' });
}

/**
 * Show error toast
 */
export function error(message, options = {}) {
    return show({ ...options, message, type: 'error' });
}

/**
 * Show warning toast
 */
export function warning(message, options = {}) {
    return show({ ...options, message, type: 'warning' });
}

/**
 * Show info toast
 */
export function info(message, options = {}) {
    return show({ ...options, message, type: 'info' });
}

/**
 * Show toast with action
 */
export function showWithAction(message, actionText, action, options = {}) {
    return show({
        ...options,
        message,
        action,
        actionText
    });
}

/**
 * Clear all toasts
 */
export function clearAll() {
    const toastContainer = getContainer();
    if (toastContainer) {
        while (toastContainer.firstChild) {
            toastContainer.removeChild(toastContainer.firstChild);
        }
    }
}

export default {
    Toast,
    show,
    success,
    error,
    warning,
    info,
    showWithAction,
    clearAll
};

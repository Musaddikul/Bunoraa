// frontend/static/js/components/modal.js
/**
 * Modal Component
 */

import { $, $$, addClass, removeClass, fadeIn, fadeOut } from '../utils/dom.js';

/**
 * Modal class
 */
export class Modal {
    constructor(options = {}) {
        this.options = {
            id: options.id || `modal-${Date.now()}`,
            title: options.title || '',
            content: options.content || '',
            size: options.size || 'md', // sm, md, lg, xl, full
            closable: options.closable !== false,
            backdrop: options.backdrop !== false,
            keyboard: options.keyboard !== false,
            onOpen: options.onOpen || null,
            onClose: options.onClose || null,
            onConfirm: options.onConfirm || null,
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            showFooter: options.showFooter !== false,
            showConfirm: options.showConfirm || false,
            customClass: options.customClass || ''
        };
        
        this.element = null;
        this.isOpen = false;
        this.previousActiveElement = null;
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleBackdropClick = this.handleBackdropClick.bind(this);
    }
    
    /**
     * Get size classes
     */
    getSizeClass() {
        const sizes = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl',
            '2xl': 'max-w-2xl',
            full: 'max-w-full mx-4'
        };
        return sizes[this.options.size] || sizes.md;
    }
    
    /**
     * Create modal element
     */
    create() {
        const modal = document.createElement('div');
        modal.id = this.options.id;
        modal.className = 'fixed inset-0 z-50 overflow-y-auto hidden';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `${this.options.id}-title`);
        
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <!-- Backdrop -->
                <div class="modal-backdrop fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                     aria-hidden="true"></div>
                
                <!-- Centering trick -->
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <!-- Modal panel -->
                <div class="modal-panel inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${this.getSizeClass()} w-full ${this.options.customClass}">
                    <!-- Header -->
                    <div class="modal-header bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900" id="${this.options.id}-title">
                                ${this.options.title}
                            </h3>
                            ${this.options.closable ? `
                                <button type="button" class="modal-close text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-1" aria-label="Close">
                                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Body -->
                    <div class="modal-body px-4 py-5 sm:p-6">
                        ${this.options.content}
                    </div>
                    
                    ${this.options.showFooter ? `
                        <!-- Footer -->
                        <div class="modal-footer bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                            ${this.options.showConfirm ? `
                                <button type="button" class="modal-confirm w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm">
                                    ${this.options.confirmText}
                                </button>
                            ` : ''}
                            ${this.options.closable ? `
                                <button type="button" class="modal-cancel mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm">
                                    ${this.options.cancelText}
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.element = modal;
        
        // Bind events
        this.bindEvents();
        
        return this;
    }
    
    /**
     * Bind events
     */
    bindEvents() {
        // Close button
        const closeBtn = this.element.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Cancel button
        const cancelBtn = this.element.querySelector('.modal-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }
        
        // Confirm button
        const confirmBtn = this.element.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (this.options.onConfirm) {
                    this.options.onConfirm(this);
                }
            });
        }
        
        // Backdrop click
        if (this.options.backdrop) {
            this.element.addEventListener('click', this.handleBackdropClick);
        }
    }
    
    /**
     * Handle backdrop click
     */
    handleBackdropClick(event) {
        if (event.target.classList.contains('modal-backdrop') || 
            event.target === this.element.querySelector('.flex')) {
            this.close();
        }
    }
    
    /**
     * Handle keyboard events
     */
    handleKeyDown(event) {
        if (event.key === 'Escape' && this.options.keyboard) {
            this.close();
        }
        
        // Trap focus within modal
        if (event.key === 'Tab') {
            const focusable = this.element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }
    
    /**
     * Open modal
     */
    open() {
        if (!this.element) {
            this.create();
        }
        
        this.previousActiveElement = document.activeElement;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show modal
        this.element.classList.remove('hidden');
        this.isOpen = true;
        
        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Focus first focusable element
        setTimeout(() => {
            const firstFocusable = this.element.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
        
        // Callback
        if (this.options.onOpen) {
            this.options.onOpen(this);
        }
        
        return this;
    }
    
    /**
     * Close modal
     */
    close() {
        if (!this.element || !this.isOpen) return;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Hide modal
        this.element.classList.add('hidden');
        this.isOpen = false;
        
        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Restore focus
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
        
        // Callback
        if (this.options.onClose) {
            this.options.onClose(this);
        }
        
        return this;
    }
    
    /**
     * Toggle modal
     */
    toggle() {
        return this.isOpen ? this.close() : this.open();
    }
    
    /**
     * Update content
     */
    setContent(content) {
        if (this.element) {
            const body = this.element.querySelector('.modal-body');
            if (body) {
                body.innerHTML = content;
            }
        }
        this.options.content = content;
        return this;
    }
    
    /**
     * Update title
     */
    setTitle(title) {
        if (this.element) {
            const titleEl = this.element.querySelector(`#${this.options.id}-title`);
            if (titleEl) {
                titleEl.textContent = title;
            }
        }
        this.options.title = title;
        return this;
    }
    
    /**
     * Destroy modal
     */
    destroy() {
        this.close();
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
    
    /**
     * Get body element
     */
    getBody() {
        return this.element ? this.element.querySelector('.modal-body') : null;
    }
    
    /**
     * Get panel element
     */
    getPanel() {
        return this.element ? this.element.querySelector('.modal-panel') : null;
    }
}

/**
 * Create and show modal
 */
export function showModal(options) {
    const modal = new Modal(options);
    modal.open();
    return modal;
}

/**
 * Alert modal
 */
export function alert(message, title = 'Alert') {
    return new Promise((resolve) => {
        const modal = new Modal({
            title,
            content: `<p class="text-gray-600">${message}</p>`,
            size: 'sm',
            showConfirm: false,
            showFooter: true,
            onClose: () => {
                modal.destroy();
                resolve();
            }
        });
        modal.open();
    });
}

/**
 * Confirm modal
 */
export function confirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        const modal = new Modal({
            title,
            content: `<p class="text-gray-600">${message}</p>`,
            size: 'sm',
            showConfirm: true,
            confirmText: 'Yes',
            cancelText: 'No',
            onConfirm: () => {
                modal.destroy();
                resolve(true);
            },
            onClose: () => {
                modal.destroy();
                resolve(false);
            }
        });
        modal.open();
    });
}

/**
 * Prompt modal
 */
export function prompt(message, defaultValue = '', title = 'Input') {
    return new Promise((resolve) => {
        const inputId = `prompt-input-${Date.now()}`;
        const modal = new Modal({
            title,
            content: `
                <p class="text-gray-600 mb-4">${message}</p>
                <input type="text" id="${inputId}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" value="${defaultValue}">
            `,
            size: 'sm',
            showConfirm: true,
            confirmText: 'OK',
            cancelText: 'Cancel',
            onConfirm: () => {
                const input = document.getElementById(inputId);
                const value = input ? input.value : '';
                modal.destroy();
                resolve(value);
            },
            onClose: () => {
                modal.destroy();
                resolve(null);
            }
        });
        modal.open();
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
    });
}

/**
 * Initialize modals from HTML
 */
export function initModals() {
    // Find all modal triggers
    $$('[data-modal-target]').forEach(trigger => {
        const targetId = trigger.dataset.modalTarget;
        const target = $(`#${targetId}`);
        
        if (target) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                target.classList.remove('hidden');
            });
        }
    });
    
    // Find all modal close buttons
    $$('[data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('[role="dialog"]');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

export default {
    Modal,
    showModal,
    alert,
    confirm,
    prompt,
    initModals
};

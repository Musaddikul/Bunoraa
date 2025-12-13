// static/js/components/modal.js
/**
 * Modal Component
 * Reusable modal dialog component
 */

class Modal {
    constructor(options = {}) {
        this.options = {
            id: options.id || 'modal-' + Date.now(),
            title: options.title || '',
            content: options.content || '',
            size: options.size || 'md', // sm, md, lg, xl, full
            closable: options.closable !== false,
            closeOnBackdrop: options.closeOnBackdrop !== false,
            closeOnEscape: options.closeOnEscape !== false,
            showHeader: options.showHeader !== false,
            showFooter: options.showFooter || false,
            footerContent: options.footerContent || '',
            onOpen: options.onOpen || null,
            onClose: options.onClose || null,
            className: options.className || ''
        };

        this.element = null;
        this.backdrop = null;
        this.isOpen = false;

        this._handleEscape = this._handleEscape.bind(this);
        this._handleBackdropClick = this._handleBackdropClick.bind(this);
    }

    /**
     * Get size classes
     */
    _getSizeClasses() {
        const sizes = {
            sm: 'max-w-sm',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
            xl: 'max-w-4xl',
            full: 'max-w-full mx-4'
        };
        return sizes[this.options.size] || sizes.md;
    }

    /**
     * Create modal HTML
     */
    _createHTML() {
        const sizeClass = this._getSizeClasses();

        return `
            <div id="${this.options.id}-backdrop" 
                 class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 opacity-0 transition-opacity duration-300">
            </div>
            <div id="${this.options.id}" 
                 class="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-300"
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="${this.options.id}-title">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-hidden transform scale-95 transition-transform duration-300 ${this.options.className}">
                    ${this.options.showHeader ? `
                        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 id="${this.options.id}-title" class="text-lg font-semibold text-gray-900 dark:text-white">
                                ${this.options.title}
                            </h3>
                            ${this.options.closable ? `
                                <button type="button" 
                                        class="modal-close p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Close">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                    <div class="modal-body px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                        ${this.options.content}
                    </div>
                    ${this.options.showFooter ? `
                        <div class="modal-footer px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            ${this.options.footerContent}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Render modal to DOM
     */
    render() {
        // Remove existing if any
        this.destroy();

        // Create container
        const container = document.createElement('div');
        container.innerHTML = this._createHTML();

        // Append to body
        while (container.firstChild) {
            document.body.appendChild(container.firstChild);
        }

        // Store references
        this.element = document.getElementById(this.options.id);
        this.backdrop = document.getElementById(`${this.options.id}-backdrop`);

        // Setup event listeners
        this._setupEventListeners();

        return this;
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        // Close buttons
        const closeButtons = this.element.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Backdrop click
        if (this.options.closeOnBackdrop) {
            this.backdrop.addEventListener('click', this._handleBackdropClick);
            this.element.addEventListener('click', this._handleBackdropClick);
        }

        // Escape key
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', this._handleEscape);
        }
    }

    /**
     * Handle backdrop click
     */
    _handleBackdropClick(e) {
        if (e.target === this.element || e.target === this.backdrop) {
            this.close();
        }
    }

    /**
     * Handle escape key
     */
    _handleEscape(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }

    /**
     * Open modal
     */
    open() {
        if (this.isOpen) return this;

        if (!this.element) {
            this.render();
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Show modal
        requestAnimationFrame(() => {
            this.backdrop.classList.remove('opacity-0');
            this.backdrop.classList.add('opacity-100');
            this.element.classList.remove('opacity-0', 'pointer-events-none');
            this.element.classList.add('opacity-100', 'pointer-events-auto');
            this.element.querySelector('.bg-white, .dark\\:bg-gray-800')?.classList.remove('scale-95');
            this.element.querySelector('.bg-white, .dark\\:bg-gray-800')?.classList.add('scale-100');
        });

        this.isOpen = true;

        // Focus first focusable element
        setTimeout(() => {
            const focusable = this.element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
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
        if (!this.isOpen) return this;

        // Hide modal
        this.backdrop.classList.remove('opacity-100');
        this.backdrop.classList.add('opacity-0');
        this.element.classList.remove('opacity-100', 'pointer-events-auto');
        this.element.classList.add('opacity-0', 'pointer-events-none');
        this.element.querySelector('.bg-white, .dark\\:bg-gray-800')?.classList.remove('scale-100');
        this.element.querySelector('.bg-white, .dark\\:bg-gray-800')?.classList.add('scale-95');

        // Restore body scroll
        document.body.style.overflow = '';

        this.isOpen = false;

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
     * Set content
     */
    setContent(content) {
        this.options.content = content;
        if (this.element) {
            const body = this.element.querySelector('.modal-body');
            if (body) body.innerHTML = content;
        }
        return this;
    }

    /**
     * Set title
     */
    setTitle(title) {
        this.options.title = title;
        if (this.element) {
            const titleEl = this.element.querySelector(`#${this.options.id}-title`);
            if (titleEl) titleEl.textContent = title;
        }
        return this;
    }

    /**
     * Destroy modal
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this._handleEscape);

        // Remove elements
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        if (this.backdrop) {
            this.backdrop.remove();
            this.backdrop = null;
        }

        // Restore body scroll
        document.body.style.overflow = '';

        this.isOpen = false;
    }

    /**
     * Static method to create confirmation dialog
     */
    static confirm(options = {}) {
        return new Promise((resolve) => {
            const modal = new Modal({
                title: options.title || 'Confirm',
                content: `
                    <p class="text-gray-600 dark:text-gray-300">${options.message || 'Are you sure?'}</p>
                `,
                size: 'sm',
                showFooter: true,
                footerContent: `
                    <div class="flex justify-end gap-3">
                        <button type="button" class="modal-cancel px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
                            ${options.cancelText || 'Cancel'}
                        </button>
                        <button type="button" class="modal-confirm px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors">
                            ${options.confirmText || 'Confirm'}
                        </button>
                    </div>
                `,
                onClose: () => {
                    modal.destroy();
                    resolve(false);
                }
            });

            modal.render().open();

            // Setup buttons
            modal.element.querySelector('.modal-cancel')?.addEventListener('click', () => {
                modal.close();
                modal.destroy();
                resolve(false);
            });

            modal.element.querySelector('.modal-confirm')?.addEventListener('click', () => {
                modal.close();
                modal.destroy();
                resolve(true);
            });
        });
    }

    /**
     * Static method to create alert dialog
     */
    static alert(options = {}) {
        return new Promise((resolve) => {
            const modal = new Modal({
                title: options.title || 'Alert',
                content: `
                    <p class="text-gray-600 dark:text-gray-300">${options.message || ''}</p>
                `,
                size: 'sm',
                showFooter: true,
                footerContent: `
                    <div class="flex justify-end">
                        <button type="button" class="modal-ok px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors">
                            ${options.okText || 'OK'}
                        </button>
                    </div>
                `,
                onClose: () => {
                    modal.destroy();
                    resolve();
                }
            });

            modal.render().open();

            modal.element.querySelector('.modal-ok')?.addEventListener('click', () => {
                modal.close();
                modal.destroy();
                resolve();
            });
        });
    }
}

// Export
export default Modal;
window.Modal = Modal;

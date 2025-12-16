/**
 * Modal Component
 * @module components/modal
 */

const Modal = (function() {
    'use strict';

    const modals = new Map();
    let activeModal = null;

    function create(options = {}) {
        const {
            id = 'modal-' + Date.now(),
            title = '',
            content = '',
            size = 'md',
            closable = true,
            closeOnOverlay = true,
            closeOnEscape = true,
            showFooter = true,
            footerContent = null,
            onOpen = null,
            onClose = null,
            className = ''
        } = options;

        const sizeClasses = {
            sm: 'max-w-md',
            md: 'max-w-lg',
            lg: 'max-w-2xl',
            xl: 'max-w-4xl',
            full: 'max-w-full mx-4'
        };

        const modalHtml = `
            <div id="${id}" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
                <div class="fixed inset-0 bg-black/50 transition-opacity" data-modal-overlay></div>
                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <div class="relative bg-white rounded-xl shadow-2xl ${sizeClasses[size] || sizeClasses.md} w-full transform transition-all ${className}" data-modal-content>
                            ${closable ? `
                                <button type="button" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" data-modal-close aria-label="Close">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            ` : ''}
                            ${title ? `
                                <div class="px-6 py-4 border-b border-gray-200">
                                    <h3 id="${id}-title" class="text-xl font-semibold text-gray-900">${title}</h3>
                                </div>
                            ` : ''}
                            <div class="px-6 py-4" data-modal-body>
                                ${content}
                            </div>
                            ${showFooter ? `
                                <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3" data-modal-footer>
                                    ${footerContent || `
                                        <button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" data-modal-close>
                                            Cancel
                                        </button>
                                        <button type="button" class="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors" data-modal-confirm>
                                            Confirm
                                        </button>
                                    `}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = modalHtml;
        const modal = container.firstElementChild;
        document.body.appendChild(modal);

        const instance = {
            id,
            element: modal,
            options,
            onOpen,
            onClose
        };

        if (closable) {
            modal.querySelectorAll('[data-modal-close]').forEach(btn => {
                btn.addEventListener('click', () => close(id));
            });
        }

        if (closeOnOverlay) {
            modal.querySelector('[data-modal-overlay]').addEventListener('click', () => close(id));
        }

        if (closeOnEscape) {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && closable) {
                    close(id);
                }
            });
        }

        modals.set(id, instance);
        return instance;
    }

    function open(id) {
        const instance = modals.get(id);
        if (!instance) return;

        if (activeModal) {
            close(activeModal);
        }

        instance.element.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        activeModal = id;

        const content = instance.element.querySelector('[data-modal-content]');
        content.classList.add('scale-95', 'opacity-0');
        
        requestAnimationFrame(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        });

        const focusable = instance.element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();

        if (instance.onOpen) instance.onOpen(instance);
        window.dispatchEvent(new CustomEvent('modal:opened', { detail: { id } }));
    }

    function close(id = null) {
        const targetId = id || activeModal;
        if (!targetId) return;

        const instance = modals.get(targetId);
        if (!instance) return;

        const content = instance.element.querySelector('[data-modal-content]');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            instance.element.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            
            if (activeModal === targetId) {
                activeModal = null;
            }

            if (instance.onClose) instance.onClose(instance);
            window.dispatchEvent(new CustomEvent('modal:closed', { detail: { id: targetId } }));
        }, 150);
    }

    function destroy(id) {
        const instance = modals.get(id);
        if (!instance) return;

        close(id);
        setTimeout(() => {
            instance.element.remove();
            modals.delete(id);
        }, 200);
    }

    function getBody(id) {
        const instance = modals.get(id);
        return instance?.element.querySelector('[data-modal-body]');
    }

    function setContent(id, content) {
        const body = getBody(id);
        if (body) {
            body.innerHTML = content;
        }
    }

    function confirm(options = {}) {
        return new Promise((resolve) => {
            const modal = create({
                title: options.title || 'Confirm',
                content: `<p class="text-gray-600">${options.message || 'Are you sure?'}</p>`,
                size: 'sm',
                footerContent: `
                    <button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" data-modal-close>
                        ${options.cancelText || 'Cancel'}
                    </button>
                    <button type="button" class="px-4 py-2 text-white ${options.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'} rounded-lg transition-colors" data-modal-confirm>
                        ${options.confirmText || 'Confirm'}
                    </button>
                `,
                onClose: () => {
                    resolve(false);
                    destroy(modal.id);
                }
            });

            modal.element.querySelector('[data-modal-confirm]').addEventListener('click', () => {
                resolve(true);
                destroy(modal.id);
            });

            open(modal.id);
        });
    }

    function alert(options = {}) {
        return new Promise((resolve) => {
            const modal = create({
                title: options.title || 'Alert',
                content: `<p class="text-gray-600">${options.message || ''}</p>`,
                size: 'sm',
                showFooter: true,
                footerContent: `
                    <button type="button" class="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors" data-modal-close>
                        ${options.buttonText || 'OK'}
                    </button>
                `,
                onClose: () => {
                    resolve();
                    destroy(modal.id);
                }
            });

            open(modal.id);
        });
    }

    return {
        create,
        open,
        close,
        destroy,
        getBody,
        setContent,
        confirm,
        alert
    };
})();

window.Modal = Modal;

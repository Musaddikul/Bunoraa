/**
 * Toast Component Initialization
 * Exposes Toast as a global window object for use in traditional scripts
 */

(function() {
    'use strict';

    // Grab any queued toasts from the proxy
    const toastQueue = window.Toast?._queue || [];

    // --- Main Implementation ---
    function createRealToast() {
        const toastContainers = new Map();

        function getToastContainer(position) {
            if (toastContainers.has(position)) {
                return toastContainers.get(position);
            }
            
            const container = document.createElement('div');
            const positionStyles = {
                'top-right': { top: '1rem', right: '1rem' },
                'top-left': { top: '1rem', left: '1rem' },
                'bottom-right': { bottom: '1rem', right: '1rem' },
                'bottom-left': { bottom: '1rem', left: '1rem' },
                'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)' }
            }[position] || { top: '1rem', right: '1rem' };
            
            container.style.cssText = `
                position: fixed;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                ${Object.entries(positionStyles).map(([k, v]) => `${k}: ${v}`).join(';')};
            `;
            
            document.body.appendChild(container);
            toastContainers.set(position, container);
            return container;
        }

        function showToast(message, type, options = {}) {
            const container = getToastContainer(options.position || 'top-right');
            const toast = document.createElement('div');
            
            const colors = {
                success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6'
            };
            
            toast.style.cssText = `
                padding: 12px 20px;
                margin-bottom: 1rem;
                background-color: ${colors[type] || '#6b7280'};
                color: white;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);
                animation: toast-slideIn 0.3s ease-out;
                will-change: transform, opacity;
            `;
            toast.textContent = message;
            
            container.appendChild(toast);
            
            const duration = options.duration || 3500;
            setTimeout(() => {
                toast.style.animation = 'toast-slideOut 0.4s ease-in forwards';
                toast.addEventListener('animationend', () => {
                    toast.remove();
                    if (container.children.length === 0) {
                        container.remove();
                        toastContainers.delete(options.position || 'top-right');
                    }
                });
            }, duration);
            
            return toast;
        }

        return {
            success: (msg, opts) => showToast(msg, 'success', opts),
            error: (msg, opts) => showToast(msg, 'error', opts),
            warning: (msg, opts) => showToast(msg, 'warning', opts),
            info: (msg, opts) => showToast(msg, 'info', opts),
        };
    }

    // --- Inject Animations ---
    if (!document.querySelector('style[data-toast-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-toast-animations', 'true');
        style.textContent = `
            @keyframes toast-slideIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes toast-slideOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(120%); }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Initialize ---
    const realToast = createRealToast();
    window.Toast = realToast;

    // Process any queued toasts
    if (toastQueue.length > 0) {
        toastQueue.forEach(toast => {
            realToast[toast.type](toast.msg, toast.opts);
        });
        // Clear the queue after processing
        toastQueue.length = 0;
    }

})();

/**
 * Loader Component
 * @module components/loader
 */

const Loader = (function() {
    'use strict';

    const activeLoaders = new Map();

    function create(options = {}) {
        const {
            size = 'md',
            color = 'primary',
            text = '',
            overlay = false,
            fullscreen = false
        } = options;

        const sizeClasses = {
            sm: 'h-4 w-4',
            md: 'h-8 w-8',
            lg: 'h-12 w-12',
            xl: 'h-16 w-16'
        };

        const colorClasses = {
            primary: 'text-primary-600',
            white: 'text-white',
            gray: 'text-gray-600'
        };

        const spinner = `
            <svg class="animate-spin ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ${text ? `<span class="mt-2 text-sm ${colorClasses[color] || colorClasses.primary}">${text}</span>` : ''}
        `;

        if (fullscreen) {
            return `
                <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm" data-loader>
                    ${spinner}
                </div>
            `;
        }

        if (overlay) {
            return `
                <div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm" data-loader>
                    ${spinner}
                </div>
            `;
        }

        return `
            <div class="flex flex-col items-center justify-center py-8" data-loader>
                ${spinner}
            </div>
        `;
    }

    function show(container, options = {}) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        if (!container) return null;

        const id = 'loader-' + Date.now();
        const loader = document.createElement('div');
        loader.innerHTML = create(options);
        const loaderEl = loader.firstElementChild;
        loaderEl.id = id;

        if (options.overlay || options.fullscreen) {
            container.style.position = container.style.position || 'relative';
        }

        container.appendChild(loaderEl);
        activeLoaders.set(id, { container, element: loaderEl });

        return id;
    }

    function hide(id) {
        if (!id) {
            activeLoaders.forEach((loader, loaderId) => {
                loader.element.remove();
                activeLoaders.delete(loaderId);
            });
            return;
        }

        const loader = activeLoaders.get(id);
        if (loader) {
            loader.element.remove();
            activeLoaders.delete(id);
        }
    }

    function inline(size = 'sm') {
        const sizeClasses = {
            xs: 'h-3 w-3',
            sm: 'h-4 w-4',
            md: 'h-5 w-5'
        };

        return `
            <svg class="animate-spin ${sizeClasses[size] || sizeClasses.sm}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
    }

    function skeleton(options = {}) {
        const { type = 'text', count = 1, className = '' } = options;

        const types = {
            text: 'h-4 w-full rounded',
            title: 'h-6 w-3/4 rounded',
            image: 'aspect-square w-full rounded-lg',
            avatar: 'h-12 w-12 rounded-full',
            button: 'h-10 w-24 rounded-lg',
            card: 'h-64 w-full rounded-xl'
        };

        const baseClass = types[type] || types.text;
        const skeletons = [];

        for (let i = 0; i < count; i++) {
            skeletons.push(`<div class="animate-pulse bg-gray-200 ${baseClass} ${className}"></div>`);
        }

        return skeletons.join('');
    }

    function productSkeleton() {
        return `
            <div class="bg-white rounded-xl overflow-hidden">
                <div class="animate-pulse">
                    <div class="aspect-square bg-gray-200"></div>
                    <div class="p-4 space-y-3">
                        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div class="flex gap-2">
                            <div class="h-5 bg-gray-200 rounded w-20"></div>
                            <div class="h-5 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div class="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function productGridSkeleton(count = 8) {
        return Array(count).fill(productSkeleton()).join('');
    }

    return {
        create,
        show,
        hide,
        inline,
        skeleton,
        productSkeleton,
        productGridSkeleton
    };
})();

window.Loader = Loader;

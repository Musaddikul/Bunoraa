/**
 * Pagination Component
 * @module components/pagination
 */

const Pagination = (function() {
    'use strict';

    function render(options = {}) {
        const {
            currentPage = 1,
            totalPages = 1,
            totalItems = 0,
            pageSize = 20,
            maxVisible = 5,
            showInfo = true,
            showFirst = true,
            showLast = true
        } = options;

        if (totalPages <= 1) return '';

        const pages = getVisiblePages(currentPage, totalPages, maxVisible);
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalItems);

        return `
            <nav class="flex flex-col sm:flex-row items-center justify-between gap-4" aria-label="Pagination">
                ${showInfo ? `
                    <div class="text-sm text-gray-600">
                        Showing <span class="font-medium">${startItem}</span> to <span class="font-medium">${endItem}</span> of <span class="font-medium">${totalItems}</span> results
                    </div>
                ` : ''}
                
                <div class="flex items-center gap-1">
                    ${showFirst ? `
                        <button 
                            type="button"
                            class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-page="1"
                            ${currentPage === 1 ? 'disabled' : ''}
                            aria-label="First page"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                            </svg>
                        </button>
                    ` : ''}
                    
                    <button 
                        type="button"
                        class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-page="${currentPage - 1}"
                        ${currentPage === 1 ? 'disabled' : ''}
                        aria-label="Previous page"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    
                    <div class="flex items-center gap-1">
                        ${pages.map(page => {
                            if (page === '...') {
                                return `<span class="px-3 py-2 text-gray-400">...</span>`;
                            }
                            return `
                                <button 
                                    type="button"
                                    class="min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === currentPage 
                                        ? 'bg-primary-600 text-white' 
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}"
                                    data-page="${page}"
                                    ${page === currentPage ? 'aria-current="page"' : ''}
                                >
                                    ${page}
                                </button>
                            `;
                        }).join('')}
                    </div>
                    
                    <button 
                        type="button"
                        class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-page="${currentPage + 1}"
                        ${currentPage === totalPages ? 'disabled' : ''}
                        aria-label="Next page"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                    
                    ${showLast ? `
                        <button 
                            type="button"
                            class="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            data-page="${totalPages}"
                            ${currentPage === totalPages ? 'disabled' : ''}
                            aria-label="Last page"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </nav>
        `;
    }

    function getVisiblePages(current, total, maxVisible) {
        if (total <= maxVisible) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const pages = [];
        const half = Math.floor(maxVisible / 2);
        let start = Math.max(1, current - half);
        let end = Math.min(total, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < total) {
            if (end < total - 1) pages.push('...');
            pages.push(total);
        }

        return pages;
    }

    function init(container, options = {}) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        if (!container) return;

        container.innerHTML = render(options);

        container.addEventListener('click', (e) => {
            const button = e.target.closest('[data-page]');
            if (button && !button.disabled) {
                const page = parseInt(button.dataset.page);
                if (!isNaN(page) && options.onPageChange) {
                    options.onPageChange(page);
                }
            }
        });
    }

    function update(container, options) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        if (!container) return;

        container.innerHTML = render(options);
    }

    return {
        render,
        init,
        update,
        getVisiblePages
    };
})();

window.Pagination = Pagination;

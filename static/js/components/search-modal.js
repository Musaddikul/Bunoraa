/**
 * Search Modal Component
 * Full-screen search with autocomplete.
 */

import { $, $$, createElement, debounce, show, hide } from '../utils/dom.js';
import { formatCurrency, truncate } from '../utils/format.js';
import products from '../api/products.js';

class SearchModal {
    constructor() {
        this.modal = null;
        this.input = null;
        this.results = null;
        this.isOpen = false;
        this.query = '';
        this.suggestions = [];
        this.selectedIndex = -1;

        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        this.modal = createElement('div', {
            className: 'search-modal fixed inset-0 z-50 bg-black/80 backdrop-blur-sm opacity-0 invisible transition-all duration-300',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': 'Search products'
        });

        this.modal.innerHTML = `
            <div class="search-modal-content max-w-3xl mx-auto pt-20 px-4">
                <div class="relative">
                    <input 
                        type="search" 
                        class="search-input w-full px-6 py-4 pl-14 text-lg bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/20" 
                        placeholder="Search for products..."
                        autocomplete="off"
                    >
                    <svg class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <button class="search-close absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="search-results mt-4 max-h-[60vh] overflow-y-auto rounded-2xl bg-white shadow-2xl" style="display: none;"></div>
            </div>
        `;

        document.body.appendChild(this.modal);

        this.input = $('.search-input', this.modal);
        this.results = $('.search-results', this.modal);

        // Close button
        $('.search-close', this.modal).addEventListener('click', () => this.close());

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    bindEvents() {
        // Open search
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-search-toggle]')) {
                e.preventDefault();
                this.open();
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Search input
        const debouncedSearch = debounce((query) => this.search(query), 300);
        
        this.input.addEventListener('input', (e) => {
            this.query = e.target.value.trim();
            if (this.query.length >= 2) {
                debouncedSearch(this.query);
            } else {
                this.hideResults();
            }
        });

        // Keyboard navigation
        this.input.addEventListener('keydown', (e) => {
            const items = $$('.search-result-item', this.results);
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                    this.highlightItem(items);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                    this.highlightItem(items);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                        items[this.selectedIndex].click();
                    } else if (this.query) {
                        window.location.href = `/search/?q=${encodeURIComponent(this.query)}`;
                    }
                    break;
            }
        });
    }

    async search(query) {
        try {
            this.showLoading();
            const response = await products.getSearchSuggestions(query);
            this.suggestions = response.results || response;
            this.renderResults();
        } catch (error) {
            console.error('Search error:', error);
            this.hideResults();
        }
    }

    showLoading() {
        this.results.innerHTML = `
            <div class="p-6 text-center">
                <svg class="w-8 h-8 mx-auto text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        `;
        this.results.style.display = 'block';
    }

    renderResults() {
        if (!this.suggestions.length) {
            this.results.innerHTML = `
                <div class="p-6 text-center">
                    <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-gray-500">No products found for "${this.query}"</p>
                </div>
            `;
            this.results.style.display = 'block';
            return;
        }

        this.selectedIndex = -1;
        
        this.results.innerHTML = `
            <div class="divide-y divide-gray-100">
                ${this.suggestions.map((product, index) => this.renderResultItem(product, index)).join('')}
            </div>
            <a href="/search/?q=${encodeURIComponent(this.query)}" class="block p-4 text-center text-primary-600 hover:bg-gray-50 font-medium transition-colors">
                View all results →
            </a>
        `;
        
        this.results.style.display = 'block';

        // Click handlers
        $$('.search-result-item', this.results).forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = item.dataset.href;
            });
        });
    }

    renderResultItem(product, index) {
        const image = product.image || product.images?.[0]?.url || '/static/images/placeholder.png';
        
        return `
            <div class="search-result-item flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors" data-index="${index}" data-href="/product/${product.slug}/">
                <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src="${image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">${this.highlightMatch(product.name, this.query)}</h4>
                    ${product.category ? `<p class="text-xs text-gray-500">${product.category.name}</p>` : ''}
                    <p class="text-sm font-semibold text-gray-900 mt-1">${formatCurrency(product.price)}</p>
                </div>
            </div>
        `;
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>');
    }

    highlightItem(items) {
        items.forEach((item, i) => {
            item.classList.toggle('bg-gray-100', i === this.selectedIndex);
        });
    }

    hideResults() {
        this.results.style.display = 'none';
        this.suggestions = [];
        this.selectedIndex = -1;
    }

    open() {
        if (this.isOpen) return;

        document.body.style.overflow = 'hidden';
        this.modal.classList.remove('opacity-0', 'invisible');
        this.modal.classList.add('opacity-100', 'visible');
        this.isOpen = true;

        // Focus input
        setTimeout(() => this.input.focus(), 100);
    }

    close() {
        if (!this.isOpen) return;

        document.body.style.overflow = '';
        this.modal.classList.add('opacity-0', 'invisible');
        this.modal.classList.remove('opacity-100', 'visible');
        this.isOpen = false;

        // Clear search
        this.input.value = '';
        this.query = '';
        this.hideResults();
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }
}

// Export singleton
const searchModal = new SearchModal();
export default searchModal;
export { SearchModal };

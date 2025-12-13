// frontend/static/js/components/search.js
/**
 * Search Component
 * Live search with autocomplete and suggestions
 */

import { $, $$, createElement, delegate } from '../utils/dom.js';
import { debounce, formatPrice } from '../utils/helpers.js';
import { productsApi } from '../api/index.js';

/**
 * Search class
 */
export class Search {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? $(element) : element;
        if (!this.element) return;
        
        this.options = {
            minChars: options.minChars || 2,
            debounceMs: options.debounceMs || 300,
            maxResults: options.maxResults || 8,
            showCategories: options.showCategories !== false,
            showRecent: options.showRecent !== false,
            recentKey: options.recentKey || 'bunoraa_recent_searches',
            maxRecent: options.maxRecent || 5,
            placeholder: options.placeholder || 'Search products...',
            searchUrl: options.searchUrl || '/search/',
            onSelect: options.onSelect || null,
            onSubmit: options.onSubmit || null
        };
        
        this.input = null;
        this.dropdown = null;
        this.results = [];
        this.isOpen = false;
        this.selectedIndex = -1;
        
        this.handleInput = debounce(this.handleInput.bind(this), this.options.debounceMs);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        
        this.create();
    }
    
    create() {
        this.element.classList.add('search-wrapper', 'relative');
        
        // Input
        this.input = this.element.querySelector('input') || createElement('input', {
            type: 'search',
            class: 'search-input w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            placeholder: this.options.placeholder,
            autocomplete: 'off',
            'aria-label': 'Search',
            'aria-autocomplete': 'list',
            'aria-controls': 'search-results'
        });
        
        if (!this.element.querySelector('input')) {
            // Create search icon
            const icon = createElement('span', {
                class: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                innerHTML: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>`
            });
            this.element.appendChild(icon);
            this.element.appendChild(this.input);
        }
        
        // Dropdown
        this.dropdown = createElement('div', {
            id: 'search-results',
            class: 'search-dropdown absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden overflow-hidden',
            role: 'listbox'
        });
        this.element.appendChild(this.dropdown);
        
        // Bind events
        this.input.addEventListener('input', () => this.handleInput());
        this.input.addEventListener('keydown', this.handleKeyDown);
        this.input.addEventListener('focus', () => this.onFocus());
        document.addEventListener('click', this.handleClickOutside);
        
        return this;
    }
    
    onFocus() {
        if (this.input.value.length >= this.options.minChars) {
            this.open();
        } else if (this.options.showRecent) {
            this.showRecent();
        }
    }
    
    async handleInput() {
        const query = this.input.value.trim();
        
        if (query.length < this.options.minChars) {
            if (this.options.showRecent) {
                this.showRecent();
            } else {
                this.close();
            }
            return;
        }
        
        this.showLoading();
        
        try {
            const response = await productsApi.search(query, { limit: this.options.maxResults });
            
            if (response.success) {
                this.results = response.data.results || [];
                this.renderResults(query);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        }
    }
    
    handleKeyDown(e) {
        const items = this.dropdown.querySelectorAll('[data-result-index]');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelection(items);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection(items);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    items[this.selectedIndex].click();
                } else {
                    this.submit();
                }
                break;
                
            case 'Escape':
                this.close();
                break;
        }
    }
    
    updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('bg-gray-100', index === this.selectedIndex);
        });
        
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
    
    handleClickOutside(e) {
        if (!this.element.contains(e.target)) {
            this.close();
        }
    }
    
    showLoading() {
        this.dropdown.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        `;
        this.open();
    }
    
    showError() {
        this.dropdown.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                <p>Search failed. Please try again.</p>
            </div>
        `;
    }
    
    showRecent() {
        const recent = this.getRecentSearches();
        
        if (recent.length === 0) {
            this.close();
            return;
        }
        
        this.dropdown.innerHTML = `
            <div class="p-2 border-b">
                <span class="text-xs font-medium text-gray-500 uppercase">Recent Searches</span>
            </div>
            <ul class="py-1">
                ${recent.map((term, index) => `
                    <li>
                        <button type="button" class="search-recent-item w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2" data-result-index="${index}" data-term="${term}">
                            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${term}
                        </button>
                    </li>
                `).join('')}
            </ul>
        `;
        
        // Bind click handlers
        this.dropdown.querySelectorAll('.search-recent-item').forEach(item => {
            item.addEventListener('click', () => {
                this.input.value = item.dataset.term;
                this.handleInput();
            });
        });
        
        this.selectedIndex = -1;
        this.open();
    }
    
    renderResults(query) {
        if (this.results.length === 0) {
            this.dropdown.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    <p>No results found for "${query}"</p>
                </div>
            `;
            return;
        }
        
        let html = '<ul class="py-1">';
        
        this.results.forEach((product, index) => {
            html += `
                <li>
                    <a href="/products/${product.slug}/" class="search-result-item flex items-center gap-3 px-4 py-2 hover:bg-gray-100" data-result-index="${index}" data-product-id="${product.id}">
                        <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            ${product.image ? `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">` : ''}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">${this.highlightMatch(product.name, query)}</p>
                            ${product.category ? `<p class="text-xs text-gray-500">${product.category.name}</p>` : ''}
                        </div>
                        <div class="text-sm font-medium text-gray-900">
                            ${formatPrice(product.price)}
                        </div>
                    </a>
                </li>
            `;
        });
        
        html += '</ul>';
        
        // View all link
        html += `
            <div class="border-t p-2">
                <a href="${this.options.searchUrl}?q=${encodeURIComponent(query)}" class="block text-center text-sm text-primary-600 hover:text-primary-700 py-2">
                    View all results for "${query}"
                </a>
            </div>
        `;
        
        this.dropdown.innerHTML = html;
        
        // Bind click handlers
        this.dropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.saveSearch(query);
                if (this.options.onSelect) {
                    e.preventDefault();
                    const product = this.results[parseInt(item.dataset.resultIndex)];
                    this.options.onSelect(product);
                }
            });
        });
        
        this.selectedIndex = -1;
    }
    
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    }
    
    open() {
        this.dropdown.classList.remove('hidden');
        this.isOpen = true;
    }
    
    close() {
        this.dropdown.classList.add('hidden');
        this.isOpen = false;
        this.selectedIndex = -1;
    }
    
    submit() {
        const query = this.input.value.trim();
        if (query) {
            this.saveSearch(query);
            
            if (this.options.onSubmit) {
                this.options.onSubmit(query);
            } else {
                window.location.href = `${this.options.searchUrl}?q=${encodeURIComponent(query)}`;
            }
        }
    }
    
    getRecentSearches() {
        try {
            return JSON.parse(localStorage.getItem(this.options.recentKey) || '[]');
        } catch {
            return [];
        }
    }
    
    saveSearch(term) {
        const recent = this.getRecentSearches();
        const filtered = recent.filter(t => t !== term);
        filtered.unshift(term);
        
        try {
            localStorage.setItem(
                this.options.recentKey, 
                JSON.stringify(filtered.slice(0, this.options.maxRecent))
            );
        } catch {
            // Storage full or unavailable
        }
    }
    
    clearRecent() {
        try {
            localStorage.removeItem(this.options.recentKey);
        } catch {
            // Ignore
        }
    }
    
    destroy() {
        document.removeEventListener('click', this.handleClickOutside);
        this.dropdown?.remove();
    }
}

/**
 * Initialize search components
 */
export function initSearch() {
    const instances = [];
    
    $$('[data-search]').forEach(element => {
        instances.push(new Search(element));
    });
    
    return instances;
}

export default {
    Search,
    initSearch
};

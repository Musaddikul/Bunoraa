/**
 * Search Page Module
 * Real-time search with filters and autocomplete.
 */

import { searchApi } from '../api/search.js';
import { Toast } from '../components/toast.js';
import { debounce } from '../utils/dom.js';

class SearchPage {
    constructor() {
        this.query = '';
        this.filters = {};
        this.page = 1;
        this.perPage = 24;
        this.totalResults = 0;
        this.isLoading = false;
        this.searchHistory = this.getSearchHistory();
        this.popularSearches = [];

        this.elements = {
            searchInput: document.getElementById('search-input'),
            searchForm: document.getElementById('search-form'),
            autocomplete: document.getElementById('search-autocomplete'),
            results: document.getElementById('search-results'),
            resultsGrid: document.getElementById('results-grid'),
            resultsCount: document.getElementById('results-count'),
            filters: document.getElementById('search-filters'),
            sortSelect: document.getElementById('search-sort'),
            pagination: document.getElementById('search-pagination'),
            noResults: document.getElementById('no-results'),
            loadingState: document.getElementById('search-loading'),
        };
    }

    /**
     * Initialize search page
     */
    async init() {
        // Get query from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.query = urlParams.get('q') || '';
        this.page = parseInt(urlParams.get('page')) || 1;
        this.parseFiltersFromURL(urlParams);

        // Set initial input value
        if (this.elements.searchInput) {
            this.elements.searchInput.value = this.query;
        }

        // Bind events
        this.bindEvents();

        // Load popular searches
        await this.loadPopularSearches();

        // Perform search if query exists
        if (this.query) {
            await this.search();
        } else {
            this.showInitialState();
        }
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Search form submit
        if (this.elements.searchForm) {
            this.elements.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.query = this.elements.searchInput.value.trim();
                if (this.query) {
                    this.page = 1;
                    this.search();
                    this.updateURL();
                    this.addToSearchHistory(this.query);
                }
            });
        }

        // Real-time search with debounce
        if (this.elements.searchInput) {
            const debouncedSearch = debounce((e) => {
                const value = e.target.value.trim();
                if (value.length >= 2) {
                    this.showAutocomplete(value);
                } else {
                    this.hideAutocomplete();
                }
            }, 300);

            this.elements.searchInput.addEventListener('input', debouncedSearch);

            // Focus events for autocomplete
            this.elements.searchInput.addEventListener('focus', () => {
                if (!this.elements.searchInput.value) {
                    this.showRecentSearches();
                }
            });

            // Keyboard navigation
            this.elements.searchInput.addEventListener('keydown', (e) => {
                this.handleKeyNavigation(e);
            });
        }

        // Click outside to close autocomplete
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#search-form')) {
                this.hideAutocomplete();
            }
        });

        // Sort change
        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.page = 1;
                this.search();
                this.updateURL();
            });
        }

        // Filter changes
        document.addEventListener('change', (e) => {
            if (e.target.closest('#search-filters')) {
                this.handleFilterChange(e);
            }
        });

        // Pagination clicks
        document.addEventListener('click', (e) => {
            const pageLink = e.target.closest('.page-link');
            if (pageLink) {
                e.preventDefault();
                this.page = parseInt(pageLink.dataset.page);
                this.search();
                this.updateURL();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Clear filters
        document.addEventListener('click', (e) => {
            if (e.target.closest('#clear-filters')) {
                this.clearFilters();
            }
        });

        // Autocomplete item click
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.autocomplete-item');
            if (item) {
                const query = item.dataset.query;
                this.elements.searchInput.value = query;
                this.query = query;
                this.hideAutocomplete();
                this.search();
                this.updateURL();
                this.addToSearchHistory(query);
            }
        });
    }

    /**
     * Perform search
     */
    async search() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading();

        try {
            const params = {
                q: this.query,
                page: this.page,
                per_page: this.perPage,
                ...this.filters
            };

            const response = await searchApi.search(params);
            this.totalResults = response.count || response.total || 0;
            this.renderResults(response.results || response.products || []);
            this.renderFilters(response.facets || response.filters || {});
            this.renderPagination();
            this.updateResultsCount();

        } catch (error) {
            console.error('Search failed:', error);
            Toast.show({ message: 'Search failed. Please try again.', type: 'error' });
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Show autocomplete suggestions
     */
    async showAutocomplete(query) {
        if (!this.elements.autocomplete) return;

        try {
            const suggestions = await searchApi.getSuggestions(query);
            
            if (suggestions.length === 0) {
                this.hideAutocomplete();
                return;
            }

            this.elements.autocomplete.innerHTML = `
                <div class="py-2">
                    ${suggestions.map(item => `
                        <div class="autocomplete-item px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3" data-query="${item.query || item.name || item}">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <span class="text-gray-700 dark:text-gray-300">${this.highlightMatch(item.query || item.name || item, query)}</span>
                            ${item.type === 'product' ? `
                                <span class="ml-auto text-xs text-gray-400">in Products</span>
                            ` : ''}
                            ${item.type === 'category' ? `
                                <span class="ml-auto text-xs text-gray-400">in Categories</span>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            
            this.elements.autocomplete.classList.remove('hidden');

        } catch (error) {
            console.error('Autocomplete failed:', error);
        }
    }

    /**
     * Show recent searches
     */
    showRecentSearches() {
        if (!this.elements.autocomplete) return;

        const recentSearches = this.searchHistory.slice(0, 5);
        
        if (recentSearches.length === 0 && this.popularSearches.length === 0) {
            return;
        }

        this.elements.autocomplete.innerHTML = `
            <div class="py-2">
                ${recentSearches.length > 0 ? `
                    <div class="px-4 py-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Searches</span>
                            <button id="clear-history" class="text-xs text-primary-600 hover:underline">Clear</button>
                        </div>
                    </div>
                    ${recentSearches.map(query => `
                        <div class="autocomplete-item px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3" data-query="${query}">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span class="text-gray-700 dark:text-gray-300">${query}</span>
                        </div>
                    `).join('')}
                ` : ''}
                
                ${this.popularSearches.length > 0 ? `
                    <div class="px-4 py-2 ${recentSearches.length > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''}">
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Popular Searches</span>
                    </div>
                    ${this.popularSearches.slice(0, 5).map(item => `
                        <div class="autocomplete-item px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3" data-query="${item.query}">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                            </svg>
                            <span class="text-gray-700 dark:text-gray-300">${item.query}</span>
                        </div>
                    `).join('')}
                ` : ''}
            </div>
        `;
        
        this.elements.autocomplete.classList.remove('hidden');

        // Bind clear history
        const clearBtn = document.getElementById('clear-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearSearchHistory();
                this.hideAutocomplete();
            });
        }
    }

    /**
     * Hide autocomplete
     */
    hideAutocomplete() {
        if (this.elements.autocomplete) {
            this.elements.autocomplete.classList.add('hidden');
        }
    }

    /**
     * Handle keyboard navigation in autocomplete
     */
    handleKeyNavigation(e) {
        if (!this.elements.autocomplete || this.elements.autocomplete.classList.contains('hidden')) {
            return;
        }

        const items = this.elements.autocomplete.querySelectorAll('.autocomplete-item');
        const activeItem = this.elements.autocomplete.querySelector('.autocomplete-item.active');
        let activeIndex = Array.from(items).indexOf(activeItem);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, items.length - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
                break;
            case 'Enter':
                if (activeItem) {
                    e.preventDefault();
                    activeItem.click();
                }
                return;
            case 'Escape':
                this.hideAutocomplete();
                return;
            default:
                return;
        }

        items.forEach((item, i) => {
            item.classList.toggle('active', i === activeIndex);
            item.classList.toggle('bg-gray-100', i === activeIndex);
            item.classList.toggle('dark:bg-gray-700', i === activeIndex);
        });
    }

    /**
     * Highlight matching text
     */
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong class="text-primary-600">$1</strong>');
    }

    /**
     * Render search results
     */
    renderResults(products) {
        if (!this.elements.resultsGrid) return;

        if (products.length === 0) {
            this.showNoResults();
            return;
        }

        if (this.elements.noResults) {
            this.elements.noResults.classList.add('hidden');
        }

        this.elements.resultsGrid.innerHTML = products.map(product => `
            <div class="product-card group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <a href="/products/${product.slug}/" class="block">
                    <div class="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                        <img 
                            src="${product.image || '/static/images/placeholder.jpg'}"
                            alt="${product.name}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        >
                        ${product.discount_percent ? `
                            <span class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                -${product.discount_percent}%
                            </span>
                        ` : ''}
                    </div>
                    <div class="p-4">
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">${product.category?.name || ''}</div>
                        <h3 class="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                            ${product.name}
                        </h3>
                        ${product.average_rating ? `
                            <div class="flex items-center gap-1 mt-1">
                                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span class="text-sm text-gray-500">${product.average_rating.toFixed(1)}</span>
                            </div>
                        ` : ''}
                        <div class="mt-2 flex items-center gap-2">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">৳${parseFloat(product.price).toLocaleString()}</span>
                            ${product.compare_at_price ? `
                                <span class="text-sm text-gray-400 line-through">৳${parseFloat(product.compare_at_price).toLocaleString()}</span>
                            ` : ''}
                        </div>
                    </div>
                </a>
                <div class="px-4 pb-4">
                    <button 
                        class="add-to-cart-btn w-full py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        data-product-id="${product.id}"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render search filters
     */
    renderFilters(facets) {
        if (!this.elements.filters) return;

        const categories = facets.categories || [];
        const brands = facets.brands || [];
        const priceRanges = facets.price_ranges || [
            { min: 0, max: 500, label: 'Under ৳500' },
            { min: 500, max: 1000, label: '৳500 - ৳1,000' },
            { min: 1000, max: 2500, label: '৳1,000 - ৳2,500' },
            { min: 2500, max: 5000, label: '৳2,500 - ৳5,000' },
            { min: 5000, max: null, label: 'Over ৳5,000' },
        ];

        this.elements.filters.innerHTML = `
            <div class="space-y-6">
                <!-- Active Filters -->
                ${this.hasActiveFilters() ? `
                    <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-3">
                            <span class="font-medium text-gray-900 dark:text-white">Active Filters</span>
                            <button id="clear-filters" class="text-sm text-primary-600 hover:underline">Clear All</button>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${this.renderActiveFilters()}
                        </div>
                    </div>
                ` : ''}

                <!-- Categories -->
                ${categories.length > 0 ? `
                    <div class="filter-section">
                        <h4 class="font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            ${categories.map(cat => `
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="category" 
                                        value="${cat.slug}"
                                        ${this.filters.category === cat.slug ? 'checked' : ''}
                                        class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    >
                                    <span class="text-gray-700 dark:text-gray-300">${cat.name}</span>
                                    <span class="text-gray-400 text-sm ml-auto">(${cat.count})</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Price Range -->
                <div class="filter-section">
                    <h4 class="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
                    <div class="space-y-2">
                        ${priceRanges.map((range, index) => `
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="price_range" 
                                    value="${range.min}-${range.max || ''}"
                                    ${this.filters.price_range === `${range.min}-${range.max || ''}` ? 'checked' : ''}
                                    class="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                                >
                                <span class="text-gray-700 dark:text-gray-300">${range.label}</span>
                            </label>
                        `).join('')}
                    </div>
                    
                    <!-- Custom Price -->
                    <div class="mt-4">
                        <div class="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="price-min"
                                placeholder="Min"
                                value="${this.filters.min_price || ''}"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                            >
                            <span class="text-gray-400">-</span>
                            <input 
                                type="number" 
                                id="price-max"
                                placeholder="Max"
                                value="${this.filters.max_price || ''}"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                            >
                        </div>
                        <button 
                            id="apply-price"
                            class="w-full mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <!-- Brands -->
                ${brands.length > 0 ? `
                    <div class="filter-section">
                        <h4 class="font-medium text-gray-900 dark:text-white mb-3">Brands</h4>
                        <div class="space-y-2 max-h-48 overflow-y-auto">
                            ${brands.map(brand => `
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="brand" 
                                        value="${brand.slug}"
                                        ${this.filters.brand === brand.slug ? 'checked' : ''}
                                        class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    >
                                    <span class="text-gray-700 dark:text-gray-300">${brand.name}</span>
                                    <span class="text-gray-400 text-sm ml-auto">(${brand.count})</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Rating -->
                <div class="filter-section">
                    <h4 class="font-medium text-gray-900 dark:text-white mb-3">Rating</h4>
                    <div class="space-y-2">
                        ${[4, 3, 2, 1].map(rating => `
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="min_rating" 
                                    value="${rating}"
                                    ${this.filters.min_rating === `${rating}` ? 'checked' : ''}
                                    class="w-4 h-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                                >
                                <div class="flex">
                                    ${[1,2,3,4,5].map(i => `
                                        <svg class="w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    `).join('')}
                                </div>
                                <span class="text-gray-500 text-sm">& Up</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Availability -->
                <div class="filter-section">
                    <h4 class="font-medium text-gray-900 dark:text-white mb-3">Availability</h4>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="in_stock" 
                            value="true"
                            ${this.filters.in_stock === 'true' ? 'checked' : ''}
                            class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        >
                        <span class="text-gray-700 dark:text-gray-300">In Stock Only</span>
                    </label>
                </div>
            </div>
        `;

        // Bind custom price filter
        const applyPriceBtn = document.getElementById('apply-price');
        if (applyPriceBtn) {
            applyPriceBtn.addEventListener('click', () => {
                const min = document.getElementById('price-min').value;
                const max = document.getElementById('price-max').value;
                if (min) this.filters.min_price = min;
                if (max) this.filters.max_price = max;
                delete this.filters.price_range;
                this.page = 1;
                this.search();
                this.updateURL();
            });
        }
    }

    /**
     * Render active filters
     */
    renderActiveFilters() {
        const filters = [];

        if (this.filters.category) {
            filters.push(`<span class="active-filter inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm">
                Category: ${this.filters.category}
                <button class="remove-filter hover:text-primary-800" data-filter="category">&times;</button>
            </span>`);
        }

        if (this.filters.brand) {
            filters.push(`<span class="active-filter inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm">
                Brand: ${this.filters.brand}
                <button class="remove-filter hover:text-primary-800" data-filter="brand">&times;</button>
            </span>`);
        }

        if (this.filters.price_range) {
            filters.push(`<span class="active-filter inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm">
                Price: ${this.filters.price_range}
                <button class="remove-filter hover:text-primary-800" data-filter="price_range">&times;</button>
            </span>`);
        }

        if (this.filters.min_rating) {
            filters.push(`<span class="active-filter inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-sm">
                ${this.filters.min_rating}+ Stars
                <button class="remove-filter hover:text-primary-800" data-filter="min_rating">&times;</button>
            </span>`);
        }

        // Bind remove filter buttons
        setTimeout(() => {
            document.querySelectorAll('.remove-filter').forEach(btn => {
                btn.addEventListener('click', () => {
                    delete this.filters[btn.dataset.filter];
                    this.page = 1;
                    this.search();
                    this.updateURL();
                });
            });
        }, 0);

        return filters.join('');
    }

    /**
     * Render pagination
     */
    renderPagination() {
        if (!this.elements.pagination) return;

        const totalPages = Math.ceil(this.totalResults / this.perPage);
        if (totalPages <= 1) {
            this.elements.pagination.innerHTML = '';
            return;
        }

        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        this.elements.pagination.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <!-- Previous -->
                <button 
                    class="page-link px-4 py-2 rounded-lg border ${this.page === 1 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }"
                    data-page="${this.page - 1}"
                    ${this.page === 1 ? 'disabled' : ''}
                >
                    Previous
                </button>

                <!-- First page -->
                ${start > 1 ? `
                    <button class="page-link px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" data-page="1">1</button>
                    ${start > 2 ? '<span class="px-2">...</span>' : ''}
                ` : ''}

                <!-- Page numbers -->
                ${Array.from({ length: end - start + 1 }, (_, i) => start + i).map(page => `
                    <button 
                        class="page-link px-4 py-2 rounded-lg ${page === this.page 
                            ? 'bg-primary-600 text-white' 
                            : 'border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }"
                        data-page="${page}"
                    >
                        ${page}
                    </button>
                `).join('')}

                <!-- Last page -->
                ${end < totalPages ? `
                    ${end < totalPages - 1 ? '<span class="px-2">...</span>' : ''}
                    <button class="page-link px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" data-page="${totalPages}">${totalPages}</button>
                ` : ''}

                <!-- Next -->
                <button 
                    class="page-link px-4 py-2 rounded-lg border ${this.page === totalPages 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }"
                    data-page="${this.page + 1}"
                    ${this.page === totalPages ? 'disabled' : ''}
                >
                    Next
                </button>
            </div>
        `;
    }

    /**
     * Update results count
     */
    updateResultsCount() {
        if (!this.elements.resultsCount) return;

        const start = (this.page - 1) * this.perPage + 1;
        const end = Math.min(this.page * this.perPage, this.totalResults);

        this.elements.resultsCount.innerHTML = `
            Showing <strong>${start}-${end}</strong> of <strong>${this.totalResults.toLocaleString()}</strong> results
            ${this.query ? ` for "<strong>${this.query}</strong>"` : ''}
        `;
    }

    /**
     * Handle filter change
     */
    handleFilterChange(e) {
        const input = e.target;
        const name = input.name;
        const value = input.value;

        if (input.type === 'checkbox') {
            if (input.checked) {
                this.filters[name] = value;
            } else {
                delete this.filters[name];
            }
        } else if (input.type === 'radio') {
            this.filters[name] = value;
        }

        this.page = 1;
        this.search();
        this.updateURL();
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {};
        this.page = 1;
        this.search();
        this.updateURL();
    }

    /**
     * Check if has active filters
     */
    hasActiveFilters() {
        const excludeKeys = ['sort', 'q'];
        return Object.keys(this.filters).some(key => !excludeKeys.includes(key) && this.filters[key]);
    }

    /**
     * Parse filters from URL
     */
    parseFiltersFromURL(urlParams) {
        for (const [key, value] of urlParams.entries()) {
            if (key !== 'q' && key !== 'page') {
                this.filters[key] = value;
            }
        }
    }

    /**
     * Update URL with current state
     */
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.query) params.set('q', this.query);
        if (this.page > 1) params.set('page', this.page);
        
        Object.entries(this.filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newURL);
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.elements.loadingState) {
            this.elements.loadingState.classList.remove('hidden');
        }
        if (this.elements.resultsGrid) {
            this.elements.resultsGrid.classList.add('opacity-50');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.elements.loadingState) {
            this.elements.loadingState.classList.add('hidden');
        }
        if (this.elements.resultsGrid) {
            this.elements.resultsGrid.classList.remove('opacity-50');
        }
    }

    /**
     * Show no results state
     */
    showNoResults() {
        if (!this.elements.noResults) return;

        this.elements.noResults.classList.remove('hidden');
        this.elements.noResults.innerHTML = `
            <div class="text-center py-16">
                <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                    We couldn't find any products matching "${this.query}"
                </p>
                <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>Suggestions:</p>
                    <ul class="list-disc list-inside">
                        <li>Check your spelling</li>
                        <li>Try using different keywords</li>
                        <li>Try using more general terms</li>
                        <li>Clear some filters</li>
                    </ul>
                </div>
                ${this.popularSearches.length > 0 ? `
                    <div class="mt-8">
                        <p class="text-gray-500 dark:text-gray-400 mb-3">Popular searches:</p>
                        <div class="flex flex-wrap justify-center gap-2">
                            ${this.popularSearches.slice(0, 5).map(item => `
                                <a href="/search/?q=${encodeURIComponent(item.query)}" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                                    ${item.query}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        if (this.elements.resultsGrid) {
            this.elements.resultsGrid.innerHTML = '';
        }
    }

    /**
     * Show initial state (no search query)
     */
    showInitialState() {
        if (this.elements.results) {
            this.elements.results.innerHTML = `
                <div class="text-center py-16">
                    <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Search for products</h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-8">
                        Enter a search term above to find products
                    </p>
                    ${this.popularSearches.length > 0 ? `
                        <div>
                            <p class="text-gray-500 dark:text-gray-400 mb-3">Popular searches:</p>
                            <div class="flex flex-wrap justify-center gap-2">
                                ${this.popularSearches.slice(0, 8).map(item => `
                                    <a href="/search/?q=${encodeURIComponent(item.query)}" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                                        ${item.query}
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }

    /**
     * Load popular searches
     */
    async loadPopularSearches() {
        try {
            const response = await searchApi.getPopularSearches();
            this.popularSearches = response.results || response || [];
        } catch (error) {
            console.error('Failed to load popular searches:', error);
        }
    }

    /**
     * Get search history from localStorage
     */
    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('bunoraa_search_history') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Add to search history
     */
    addToSearchHistory(query) {
        if (!query) return;
        
        let history = this.getSearchHistory();
        history = history.filter(q => q !== query);
        history.unshift(query);
        history = history.slice(0, 10);
        
        localStorage.setItem('bunoraa_search_history', JSON.stringify(history));
        this.searchHistory = history;
    }

    /**
     * Clear search history
     */
    clearSearchHistory() {
        localStorage.removeItem('bunoraa_search_history');
        this.searchHistory = [];
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('search-results') || document.getElementById('search-form')) {
        const searchPage = new SearchPage();
        searchPage.init();
    }
});

export { SearchPage };

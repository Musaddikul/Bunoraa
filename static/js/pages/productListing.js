/**
 * Product Listing Page Module
 * Handles product listing with filtering, sorting, and pagination.
 */

import { productsApi } from '../api/products.js';
import { categoriesApi } from '../api/categories.js';
import { Toast } from '../components/toast.js';
import { LazyLoad } from '../components/lazyload.js';
import DOM from '../utils/dom.js';

class ProductListingPage {
    constructor() {
        this.products = [];
        this.filters = {
            category: null,
            brand: null,
            minPrice: null,
            maxPrice: null,
            sortBy: '-created_at',
            search: null,
            inStock: null,
            page: 1,
            pageSize: 20,
        };
        this.totalPages = 1;
        this.totalProducts = 0;
        this.isLoading = false;
        
        this.elements = {
            productGrid: document.getElementById('product-grid'),
            filterForm: document.getElementById('filter-form'),
            sortSelect: document.getElementById('sort-select'),
            categoryFilter: document.getElementById('category-filter'),
            brandFilter: document.getElementById('brand-filter'),
            priceMinInput: document.getElementById('price-min'),
            priceMaxInput: document.getElementById('price-max'),
            inStockCheckbox: document.getElementById('in-stock'),
            pagination: document.getElementById('pagination'),
            productCount: document.getElementById('product-count'),
            loadingOverlay: document.getElementById('loading-overlay'),
            mobileFilterBtn: document.getElementById('mobile-filter-btn'),
            filterSidebar: document.getElementById('filter-sidebar'),
            clearFiltersBtn: document.getElementById('clear-filters'),
            viewToggle: document.getElementById('view-toggle'),
        };

        this.currentView = localStorage.getItem('productView') || 'grid';
    }

    /**
     * Initialize the product listing page
     */
    async init() {
        // Get initial filters from URL
        this.parseUrlParams();
        
        // Load filters
        await this.loadFilterOptions();
        
        // Load products
        await this.loadProducts();
        
        // Initialize components
        this.initLazyLoad();
        this.bindEvents();
        this.setActiveFilters();
        this.setViewMode(this.currentView);
    }

    /**
     * Parse URL parameters into filters
     */
    parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        
        this.filters.category = params.get('category') || this.getPageCategory();
        this.filters.brand = params.get('brand');
        this.filters.minPrice = params.get('min_price');
        this.filters.maxPrice = params.get('max_price');
        this.filters.sortBy = params.get('sort') || '-created_at';
        this.filters.search = params.get('q');
        this.filters.inStock = params.get('in_stock') === 'true';
        this.filters.page = parseInt(params.get('page')) || 1;
    }

    /**
     * Get category from page data attribute
     */
    getPageCategory() {
        const container = document.querySelector('[data-category-slug]');
        return container?.dataset.categorySlug || null;
    }

    /**
     * Update URL with current filters
     */
    updateUrl() {
        const params = new URLSearchParams();
        
        if (this.filters.category && !this.getPageCategory()) {
            params.set('category', this.filters.category);
        }
        if (this.filters.brand) params.set('brand', this.filters.brand);
        if (this.filters.minPrice) params.set('min_price', this.filters.minPrice);
        if (this.filters.maxPrice) params.set('max_price', this.filters.maxPrice);
        if (this.filters.sortBy && this.filters.sortBy !== '-created_at') {
            params.set('sort', this.filters.sortBy);
        }
        if (this.filters.search) params.set('q', this.filters.search);
        if (this.filters.inStock) params.set('in_stock', 'true');
        if (this.filters.page > 1) params.set('page', this.filters.page);
        
        const queryString = params.toString();
        const newUrl = queryString 
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname;
        
        window.history.replaceState({}, '', newUrl);
    }

    /**
     * Load filter options
     */
    async loadFilterOptions() {
        try {
            const [categories, brands] = await Promise.all([
                categoriesApi.getCategoryTree(),
                productsApi.getBrands()
            ]);

            this.renderCategoryFilter(categories);
            this.renderBrandFilter(brands);
        } catch (error) {
            console.error('Failed to load filter options:', error);
        }
    }

    /**
     * Render category filter
     */
    renderCategoryFilter(categories) {
        if (!this.elements.categoryFilter) return;

        const renderTree = (items, level = 0) => {
            return items.map(cat => `
                <label class="flex items-center gap-2 py-1 ${level > 0 ? `pl-${level * 4}` : ''}">
                    <input 
                        type="radio" 
                        name="category" 
                        value="${cat.slug}"
                        ${this.filters.category === cat.slug ? 'checked' : ''}
                        class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    >
                    <span class="text-sm text-gray-700 dark:text-gray-300">${cat.name}</span>
                    <span class="text-xs text-gray-400">(${cat.product_count || 0})</span>
                </label>
                ${cat.children?.length ? renderTree(cat.children, level + 1) : ''}
            `).join('');
        };

        this.elements.categoryFilter.innerHTML = `
            <label class="flex items-center gap-2 py-1">
                <input 
                    type="radio" 
                    name="category" 
                    value=""
                    ${!this.filters.category ? 'checked' : ''}
                    class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                >
                <span class="text-sm text-gray-700 dark:text-gray-300">All Categories</span>
            </label>
            ${renderTree(categories)}
        `;
    }

    /**
     * Render brand filter
     */
    renderBrandFilter(brands) {
        if (!this.elements.brandFilter) return;

        const html = brands.map(brand => `
            <label class="flex items-center gap-2 py-1">
                <input 
                    type="checkbox" 
                    name="brand" 
                    value="${brand.slug}"
                    ${this.filters.brand === brand.slug ? 'checked' : ''}
                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                >
                <span class="text-sm text-gray-700 dark:text-gray-300">${brand.name}</span>
            </label>
        `).join('');

        this.elements.brandFilter.innerHTML = html;
    }

    /**
     * Load products with current filters
     */
    async loadProducts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            const response = await productsApi.getProducts(this.filters);
            
            this.products = response.results || response;
            this.totalProducts = response.count || this.products.length;
            this.totalPages = Math.ceil(this.totalProducts / this.filters.pageSize);
            
            this.renderProducts();
            this.renderPagination();
            this.updateProductCount();
            this.updateUrl();
            
        } catch (error) {
            console.error('Failed to load products:', error);
            Toast.show({
                message: 'Failed to load products',
                type: 'error'
            });
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Render products grid/list
     */
    renderProducts() {
        if (!this.elements.productGrid) return;

        if (this.products.length === 0) {
            this.elements.productGrid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                    <button 
                        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        id="clear-filters-empty"
                    >
                        Clear All Filters
                    </button>
                </div>
            `;
            return;
        }

        const html = this.products.map(product => this.createProductCard(product)).join('');
        this.elements.productGrid.innerHTML = html;
        
        // Re-init lazy loading
        LazyLoad.init();
    }

    /**
     * Create product card HTML
     */
    createProductCard(product) {
        const discount = product.compare_at_price 
            ? Math.round((1 - product.price / product.compare_at_price) * 100)
            : 0;

        const isListView = this.currentView === 'list';

        if (isListView) {
            return this.createProductListItem(product, discount);
        }

        return `
            <div class="product-card group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden" data-product-id="${product.id}">
                <div class="relative aspect-square overflow-hidden">
                    <a href="/products/${product.slug}/">
                        <img 
                            data-src="${product.image || product.images?.[0]?.url || '/static/images/placeholder.jpg'}"
                            alt="${product.name}"
                            class="lazy-image w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        >
                    </a>
                    
                    ${discount > 0 ? `
                        <span class="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                            -${discount}%
                        </span>
                    ` : ''}
                    
                    ${product.stock_quantity <= 0 ? `
                        <span class="absolute top-3 right-3 px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded-full">
                            Out of Stock
                        </span>
                    ` : ''}
                    
                    <div class="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="flex gap-2 justify-center">
                            <button 
                                class="quick-view-btn p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                data-product-slug="${product.slug}"
                                aria-label="Quick view"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                            </button>
                            <button 
                                class="add-to-cart-btn p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors ${product.stock_quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                data-product-id="${product.id}"
                                ${product.stock_quantity <= 0 ? 'disabled' : ''}
                                aria-label="Add to cart"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </button>
                            <button 
                                class="wishlist-btn p-2 bg-white rounded-full hover:bg-gray-100 transition-colors ${product.in_wishlist ? 'text-red-500' : ''}"
                                data-product-id="${product.id}"
                                aria-label="Add to wishlist"
                            >
                                <svg class="w-5 h-5" fill="${product.in_wishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="p-4">
                    <a href="/products/${product.slug}/" class="block">
                        <h3 class="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                            ${product.name}
                        </h3>
                    </a>
                    
                    ${product.category ? `
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                            ${product.category.name}
                        </p>
                    ` : ''}
                    
                    <div class="flex items-center justify-between mt-3">
                        <div class="flex items-center gap-2">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">
                                ৳${parseFloat(product.price).toLocaleString()}
                            </span>
                            ${product.compare_at_price ? `
                                <span class="text-sm text-gray-400 line-through">
                                    ৳${parseFloat(product.compare_at_price).toLocaleString()}
                                </span>
                            ` : ''}
                        </div>
                        
                        ${product.average_rating ? `
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span class="text-sm text-gray-600 dark:text-gray-400">${product.average_rating.toFixed(1)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create product list item HTML
     */
    createProductListItem(product, discount) {
        return `
            <div class="product-list-item flex gap-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-4" data-product-id="${product.id}">
                <div class="relative w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                    <a href="/products/${product.slug}/">
                        <img 
                            data-src="${product.image || product.images?.[0]?.url || '/static/images/placeholder.jpg'}"
                            alt="${product.name}"
                            class="lazy-image w-full h-full object-cover"
                        >
                    </a>
                    ${discount > 0 ? `
                        <span class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            -${discount}%
                        </span>
                    ` : ''}
                </div>
                
                <div class="flex-grow py-2">
                    <a href="/products/${product.slug}/">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                            ${product.name}
                        </h3>
                    </a>
                    
                    ${product.category ? `
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ${product.category.name}
                        </p>
                    ` : ''}
                    
                    ${product.short_description ? `
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                            ${product.short_description}
                        </p>
                    ` : ''}
                    
                    ${product.average_rating ? `
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex">
                                ${[1,2,3,4,5].map(i => `
                                    <svg class="w-4 h-4 ${i <= Math.round(product.average_rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                `).join('')}
                            </div>
                            <span class="text-sm text-gray-500">(${product.review_count || 0} reviews)</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl font-bold text-gray-900 dark:text-white">
                                ৳${parseFloat(product.price).toLocaleString()}
                            </span>
                            ${product.compare_at_price ? `
                                <span class="text-base text-gray-400 line-through">
                                    ৳${parseFloat(product.compare_at_price).toLocaleString()}
                                </span>
                            ` : ''}
                        </div>
                        
                        <div class="flex gap-2">
                            <button 
                                class="add-to-cart-btn px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ${product.stock_quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                data-product-id="${product.id}"
                                ${product.stock_quantity <= 0 ? 'disabled' : ''}
                            >
                                ${product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button 
                                class="wishlist-btn p-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${product.in_wishlist ? 'text-red-500' : ''}"
                                data-product-id="${product.id}"
                            >
                                <svg class="w-5 h-5" fill="${product.in_wishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render pagination
     */
    renderPagination() {
        if (!this.elements.pagination || this.totalPages <= 1) {
            if (this.elements.pagination) {
                this.elements.pagination.innerHTML = '';
            }
            return;
        }

        const { page } = this.filters;
        const pages = this.getPaginationPages();

        const html = `
            <nav class="flex items-center justify-center gap-2" aria-label="Pagination">
                <button 
                    class="pagination-btn p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-page="${page - 1}"
                    ${page === 1 ? 'disabled' : ''}
                    aria-label="Previous page"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                
                ${pages.map(p => {
                    if (p === '...') {
                        return '<span class="px-3 py-2 text-gray-500">...</span>';
                    }
                    return `
                        <button 
                            class="pagination-btn px-4 py-2 rounded-lg border transition-colors ${p === page 
                                ? 'bg-primary-600 text-white border-primary-600' 
                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }"
                            data-page="${p}"
                            ${p === page ? 'aria-current="page"' : ''}
                        >
                            ${p}
                        </button>
                    `;
                }).join('')}
                
                <button 
                    class="pagination-btn p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-page="${page + 1}"
                    ${page === this.totalPages ? 'disabled' : ''}
                    aria-label="Next page"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </nav>
        `;

        this.elements.pagination.innerHTML = html;
    }

    /**
     * Get pagination page numbers
     */
    getPaginationPages() {
        const { page } = this.filters;
        const pages = [];
        const delta = 2;

        for (let i = 1; i <= this.totalPages; i++) {
            if (
                i === 1 ||
                i === this.totalPages ||
                (i >= page - delta && i <= page + delta)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages;
    }

    /**
     * Update product count display
     */
    updateProductCount() {
        if (!this.elements.productCount) return;
        
        const start = (this.filters.page - 1) * this.filters.pageSize + 1;
        const end = Math.min(this.filters.page * this.filters.pageSize, this.totalProducts);
        
        this.elements.productCount.textContent = `Showing ${start}-${end} of ${this.totalProducts} products`;
    }

    /**
     * Set active filters UI
     */
    setActiveFilters() {
        if (this.elements.sortSelect) {
            this.elements.sortSelect.value = this.filters.sortBy;
        }
        if (this.elements.priceMinInput) {
            this.elements.priceMinInput.value = this.filters.minPrice || '';
        }
        if (this.elements.priceMaxInput) {
            this.elements.priceMaxInput.value = this.filters.maxPrice || '';
        }
        if (this.elements.inStockCheckbox) {
            this.elements.inStockCheckbox.checked = this.filters.inStock;
        }
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {
            category: this.getPageCategory(),
            brand: null,
            minPrice: null,
            maxPrice: null,
            sortBy: '-created_at',
            search: null,
            inStock: null,
            page: 1,
            pageSize: 20,
        };
        
        this.setActiveFilters();
        this.loadProducts();
    }

    /**
     * Set view mode
     */
    setViewMode(mode) {
        this.currentView = mode;
        localStorage.setItem('productView', mode);
        
        if (this.elements.productGrid) {
            if (mode === 'list') {
                this.elements.productGrid.className = 'flex flex-col gap-4';
            } else {
                this.elements.productGrid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
            }
            this.renderProducts();
        }
        
        // Update toggle buttons
        const gridBtn = this.elements.viewToggle?.querySelector('[data-view="grid"]');
        const listBtn = this.elements.viewToggle?.querySelector('[data-view="list"]');
        
        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('bg-primary-600', mode === 'grid');
            gridBtn.classList.toggle('text-white', mode === 'grid');
            listBtn.classList.toggle('bg-primary-600', mode === 'list');
            listBtn.classList.toggle('text-white', mode === 'list');
        }
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.classList.remove('hidden');
        }
        if (this.elements.productGrid) {
            this.elements.productGrid.classList.add('opacity-50');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.classList.add('hidden');
        }
        if (this.elements.productGrid) {
            this.elements.productGrid.classList.remove('opacity-50');
        }
    }

    /**
     * Initialize lazy loading
     */
    initLazyLoad() {
        LazyLoad.init();
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Sort change
        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.filters.page = 1;
                this.loadProducts();
            });
        }

        // Category filter
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.addEventListener('change', (e) => {
                if (e.target.name === 'category') {
                    this.filters.category = e.target.value || null;
                    this.filters.page = 1;
                    this.loadProducts();
                }
            });
        }

        // Brand filter
        if (this.elements.brandFilter) {
            this.elements.brandFilter.addEventListener('change', (e) => {
                if (e.target.name === 'brand') {
                    this.filters.brand = e.target.checked ? e.target.value : null;
                    this.filters.page = 1;
                    this.loadProducts();
                }
            });
        }

        // Price filter
        const applyPriceFilter = DOM.debounce(() => {
            this.filters.minPrice = this.elements.priceMinInput?.value || null;
            this.filters.maxPrice = this.elements.priceMaxInput?.value || null;
            this.filters.page = 1;
            this.loadProducts();
        }, 500);

        if (this.elements.priceMinInput) {
            this.elements.priceMinInput.addEventListener('input', applyPriceFilter);
        }
        if (this.elements.priceMaxInput) {
            this.elements.priceMaxInput.addEventListener('input', applyPriceFilter);
        }

        // In stock filter
        if (this.elements.inStockCheckbox) {
            this.elements.inStockCheckbox.addEventListener('change', (e) => {
                this.filters.inStock = e.target.checked || null;
                this.filters.page = 1;
                this.loadProducts();
            });
        }

        // Pagination
        if (this.elements.pagination) {
            this.elements.pagination.addEventListener('click', (e) => {
                const btn = e.target.closest('.pagination-btn');
                if (btn && !btn.disabled) {
                    this.filters.page = parseInt(btn.dataset.page);
                    this.loadProducts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        // Clear filters
        document.addEventListener('click', (e) => {
            if (e.target.closest('#clear-filters') || e.target.closest('#clear-filters-empty')) {
                this.clearFilters();
            }
        });

        // View toggle
        if (this.elements.viewToggle) {
            this.elements.viewToggle.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-view]');
                if (btn) {
                    this.setViewMode(btn.dataset.view);
                }
            });
        }

        // Mobile filter toggle
        if (this.elements.mobileFilterBtn && this.elements.filterSidebar) {
            this.elements.mobileFilterBtn.addEventListener('click', () => {
                this.elements.filterSidebar.classList.toggle('-translate-x-full');
            });
        }

        // Quick view
        document.addEventListener('click', (e) => {
            const quickViewBtn = e.target.closest('.quick-view-btn');
            if (quickViewBtn) {
                e.preventDefault();
                this.showQuickView(quickViewBtn.dataset.productSlug);
            }
        });

        // Add to cart
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (addToCartBtn && !addToCartBtn.disabled) {
                e.preventDefault();
                this.addToCart(addToCartBtn.dataset.productId);
            }
        });

        // Wishlist
        document.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            if (wishlistBtn) {
                e.preventDefault();
                this.toggleWishlist(wishlistBtn.dataset.productId, wishlistBtn);
            }
        });
    }

    async showQuickView(slug) {
        const { QuickViewModal } = await import('../components/quickViewModal.js');
        QuickViewModal.show(slug);
    }

    async addToCart(productId) {
        const { cartService } = await import('../api/cart.js');
        await cartService.addItem(productId);
    }

    async toggleWishlist(productId, button) {
        const { wishlistService } = await import('../api/wishlist.js');
        const result = await wishlistService.toggle(productId);
        
        if (result.added) {
            button.querySelector('svg').setAttribute('fill', 'currentColor');
            button.classList.add('text-red-500');
        } else {
            button.querySelector('svg').setAttribute('fill', 'none');
            button.classList.remove('text-red-500');
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-grid')) {
        const productListing = new ProductListingPage();
        productListing.init();
    }
});

export { ProductListingPage };

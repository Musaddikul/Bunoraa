/**
 * Category Page
 * @module pages/category
 */

const CategoryPage = (function() {
    'use strict';

    let currentFilters = {};
    let currentPage = 1;
    let currentCategory = null;
    let abortController = null;
    let initialized = false;

    async function init() {
        // Prevent multiple initializations
        if (initialized) return;
        initialized = true;

        const categorySlug = getCategorySlugFromUrl();
        
        // If no category slug, this is the categories list page - don't try to load a specific category
        if (!categorySlug) {
            // Just initialize any list-specific functionality if needed
            return;
        }

        // Check if content is already server-rendered
        const headerContainer = document.getElementById('category-header');
        if (headerContainer && headerContainer.querySelector('h1')) {
            // Server-rendered content exists - just bind event handlers
            initFilterHandlers();
            initSortHandler();
            initViewToggle();
            return;
        }

        currentFilters = getFiltersFromUrl();
        currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;

        await loadCategory(categorySlug);
        initFilterHandlers();
        initSortHandler();
        initViewToggle();
    }

    function getCategorySlugFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/\/categories\/([^\/]+)/);
        return match ? match[1] : null;
    }

    function getFiltersFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const filters = {};

        if (params.get('min_price')) filters.min_price = params.get('min_price');
        if (params.get('max_price')) filters.max_price = params.get('max_price');
        if (params.get('ordering')) filters.ordering = params.get('ordering');
        if (params.get('in_stock')) filters.in_stock = params.get('in_stock') === 'true';
        if (params.get('on_sale')) filters.on_sale = params.get('on_sale') === 'true';
        
        const attributes = params.getAll('attr');
        if (attributes.length) filters.attributes = attributes;

        return filters;
    }

    async function loadCategory(slug) {
        const headerContainer = document.getElementById('category-header');
        const productsContainer = document.getElementById('category-products');
        const filtersContainer = document.getElementById('category-filters');

        if (headerContainer) Loader.show(headerContainer, 'skeleton');
        if (productsContainer) Loader.show(productsContainer, 'skeleton');

        try {
            const categoryResponse = await CategoriesApi.getCategory(slug);
            currentCategory = categoryResponse.data || categoryResponse;

            if (!currentCategory) {
                window.location.href = '/404/';
                return;
            }

            renderCategoryHeader(currentCategory);
            await loadBreadcrumbs(currentCategory);
            await loadFilters(currentCategory);
            await loadProducts();
            await loadSubcategories(currentCategory);
        } catch (error) {
            console.error('Failed to load category:', error);
            if (headerContainer) {
                headerContainer.innerHTML = '<p class="text-red-500">Failed to load category.</p>';
            }
        }
    }

    function renderCategoryHeader(category) {
        const container = document.getElementById('category-header');
        if (!container) return;

        document.title = `${category.name} | Bunoraa`;

        container.innerHTML = `
            <div class="relative py-8 md:py-12">
                ${category.image ? `
                    <div class="absolute inset-0 overflow-hidden rounded-2xl">
                        <img src="${category.image}" alt="" class="w-full h-full object-cover opacity-20">
                        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80"></div>
                    </div>
                ` : ''}
                <div class="relative">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${Templates.escapeHtml(category.name)}</h1>
                    ${category.description ? `
                        <p class="text-gray-600 max-w-2xl">${Templates.escapeHtml(category.description)}</p>
                    ` : ''}
                    ${category.product_count ? `
                        <p class="mt-4 text-sm text-gray-500">${category.product_count} products</p>
                    ` : ''}
                </div>
            </div>
        `;
    }

    async function loadBreadcrumbs(category) {
        const container = document.getElementById('breadcrumbs');
        if (!container) return;

        try {
            const response = await CategoriesApi.getBreadcrumbs(category.id);
            const breadcrumbs = response.data || [];
            
            const items = [
                { label: 'Home', url: '/' },
                { label: 'Categories', url: '/categories/' },
                ...breadcrumbs.map(item => ({
                    label: item.name,
                    url: `/categories/${item.slug}/`
                }))
            ];

            container.innerHTML = Breadcrumb.render(items);
        } catch (error) {
            console.error('Failed to load breadcrumbs:', error);
        }
    }

    async function loadFilters(category) {
        const container = document.getElementById('category-filters');
        if (!container) return;

        try {
            const response = await ProductsApi.getFilterOptions({ category: category.id });
            const filterOptions = response.data || {};

            container.innerHTML = `
                <div class="space-y-6">
                    <!-- Price Range -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-sm font-semibold text-gray-900 mb-4">Price Range</h3>
                        <div class="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="filter-min-price" 
                                placeholder="Min"
                                value="${currentFilters.min_price || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                            <span class="text-gray-400">-</span>
                            <input 
                                type="number" 
                                id="filter-max-price" 
                                placeholder="Max"
                                value="${currentFilters.max_price || ''}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                        </div>
                        <button id="apply-price-filter" class="mt-3 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                            Apply
                        </button>
                    </div>

                    <!-- Availability -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-sm font-semibold text-gray-900 mb-4">Availability</h3>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="filter-in-stock"
                                    ${currentFilters.in_stock ? 'checked' : ''}
                                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                >
                                <span class="ml-2 text-sm text-gray-600">In Stock</span>
                            </label>
                            <label class="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="filter-on-sale"
                                    ${currentFilters.on_sale ? 'checked' : ''}
                                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                >
                                <span class="ml-2 text-sm text-gray-600">On Sale</span>
                            </label>
                        </div>
                    </div>

                    ${filterOptions.attributes && filterOptions.attributes.length ? `
                        ${filterOptions.attributes.map(attr => `
                            <div class="border-b border-gray-200 pb-6">
                                <h3 class="text-sm font-semibold text-gray-900 mb-4">${Templates.escapeHtml(attr.name)}</h3>
                                <div class="space-y-2 max-h-48 overflow-y-auto">
                                    ${attr.values.map(value => `
                                        <label class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="attr-${attr.slug}"
                                                value="${Templates.escapeHtml(value.value)}"
                                                ${currentFilters.attributes?.includes(`${attr.slug}:${value.value}`) ? 'checked' : ''}
                                                class="filter-attribute w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                data-attribute="${attr.slug}"
                                            >
                                            <span class="ml-2 text-sm text-gray-600">${Templates.escapeHtml(value.value)}</span>
                                            ${value.count ? `<span class="ml-auto text-xs text-gray-400">(${value.count})</span>` : ''}
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    ` : ''}

                    <!-- Clear Filters -->
                    <button id="clear-filters" class="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Clear All Filters
                    </button>
                </div>
            `;

            bindFilterEvents();
        } catch (error) {
            console.error('Failed to load filters:', error);
            container.innerHTML = '';
        }
    }

    function bindFilterEvents() {
        const applyPriceBtn = document.getElementById('apply-price-filter');
        const inStockCheckbox = document.getElementById('filter-in-stock');
        const onSaleCheckbox = document.getElementById('filter-on-sale');
        const clearBtn = document.getElementById('clear-filters');
        const attributeCheckboxes = document.querySelectorAll('.filter-attribute');

        applyPriceBtn?.addEventListener('click', () => {
            const minPrice = document.getElementById('filter-min-price')?.value;
            const maxPrice = document.getElementById('filter-max-price')?.value;
            
            if (minPrice) currentFilters.min_price = minPrice;
            else delete currentFilters.min_price;
            
            if (maxPrice) currentFilters.max_price = maxPrice;
            else delete currentFilters.max_price;

            applyFilters();
        });

        inStockCheckbox?.addEventListener('change', (e) => {
            if (e.target.checked) currentFilters.in_stock = true;
            else delete currentFilters.in_stock;
            applyFilters();
        });

        onSaleCheckbox?.addEventListener('change', (e) => {
            if (e.target.checked) currentFilters.on_sale = true;
            else delete currentFilters.on_sale;
            applyFilters();
        });

        attributeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateAttributeFilters();
                applyFilters();
            });
        });

        clearBtn?.addEventListener('click', () => {
            currentFilters = {};
            currentPage = 1;
            applyFilters();
        });
    }

    function updateAttributeFilters() {
        const checkboxes = document.querySelectorAll('.filter-attribute:checked');
        const attributes = [];
        
        checkboxes.forEach(cb => {
            attributes.push(`${cb.dataset.attribute}:${cb.value}`);
        });

        if (attributes.length) {
            currentFilters.attributes = attributes;
        } else {
            delete currentFilters.attributes;
        }
    }

    function applyFilters() {
        currentPage = 1;
        updateUrl();
        loadProducts();
    }

    function updateUrl() {
        const params = new URLSearchParams();
        
        if (currentFilters.min_price) params.set('min_price', currentFilters.min_price);
        if (currentFilters.max_price) params.set('max_price', currentFilters.max_price);
        if (currentFilters.ordering) params.set('ordering', currentFilters.ordering);
        if (currentFilters.in_stock) params.set('in_stock', 'true');
        if (currentFilters.on_sale) params.set('on_sale', 'true');
        if (currentFilters.attributes) {
            currentFilters.attributes.forEach(attr => params.append('attr', attr));
        }
        if (currentPage > 1) params.set('page', currentPage);

        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState({}, '', newUrl);
    }

    async function loadProducts() {
        const container = document.getElementById('category-products');
        if (!container || !currentCategory) return;

        if (abortController) {
            abortController.abort();
        }
        abortController = new AbortController();

        Loader.show(container, 'skeleton');

        try {
            const params = {
                category: currentCategory.id,
                page: currentPage,
                limit: 12,
                ...currentFilters
            };

            if (currentFilters.attributes) {
                delete params.attributes;
                currentFilters.attributes.forEach(attr => {
                    const [key, value] = attr.split(':');
                    params[`attr_${key}`] = value;
                });
            }

            const response = await ProductsApi.getAll(params);
            const products = response.data || [];
            const meta = response.meta || {};

            renderProducts(products, meta);
        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Failed to load products:', error);
            container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load products. Please try again.</p>';
        }
    }

    function renderProducts(products, meta) {
        const container = document.getElementById('category-products');
        if (!container) return;

        const viewMode = Storage.get('productViewMode') || 'grid';
        const gridClass = viewMode === 'list' 
            ? 'space-y-4' 
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6';

        if (products.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p class="text-gray-500 mb-4">Try adjusting your filters or browse other categories.</p>
                    <button id="clear-filters-empty" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Clear Filters
                    </button>
                </div>
            `;

            document.getElementById('clear-filters-empty')?.addEventListener('click', () => {
                currentFilters = {};
                currentPage = 1;
                applyFilters();
            });
            return;
        }

        container.innerHTML = `
            <div class="${gridClass}">
                ${products.map(product => ProductCard.render(product, { layout: viewMode })).join('')}
            </div>
            ${meta.total_pages > 1 ? `
                <div id="products-pagination" class="mt-8"></div>
            ` : ''}
        `;

        ProductCard.bindEvents(container);

        if (meta.total_pages > 1) {
            const paginationContainer = document.getElementById('products-pagination');
            paginationContainer.innerHTML = Pagination.render({
                currentPage: meta.current_page || currentPage,
                totalPages: meta.total_pages,
                totalItems: meta.total
            });

            paginationContainer.addEventListener('click', (e) => {
                const pageBtn = e.target.closest('[data-page]');
                if (pageBtn) {
                    currentPage = parseInt(pageBtn.dataset.page);
                    updateUrl();
                    loadProducts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }

    async function loadSubcategories(category) {
        const container = document.getElementById('subcategories');
        if (!container) return;

        try {
            const response = await CategoriesApi.getSubcategories(category.id);
            const subcategories = response.data || [];

            if (subcategories.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = `
                <div class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Browse Subcategories</h2>
                    <div class="flex flex-wrap gap-2">
                        ${subcategories.map(sub => `
                            <a href="/categories/${sub.slug}/" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors">
                                ${Templates.escapeHtml(sub.name)}
                                ${sub.product_count ? `<span class="text-gray-400 ml-1">(${sub.product_count})</span>` : ''}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load subcategories:', error);
            container.innerHTML = '';
        }
    }

    function initFilterHandlers() {
        const mobileFilterBtn = document.getElementById('mobile-filter-btn');
        const filterSidebar = document.getElementById('filter-sidebar');
        const closeFilterBtn = document.getElementById('close-filter-btn');

        mobileFilterBtn?.addEventListener('click', () => {
            filterSidebar?.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        });

        closeFilterBtn?.addEventListener('click', () => {
            filterSidebar?.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }

    function initSortHandler() {
        const sortSelect = document.getElementById('sort-select');
        if (!sortSelect) return;

        sortSelect.value = currentFilters.ordering || '';

        sortSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                currentFilters.ordering = e.target.value;
            } else {
                delete currentFilters.ordering;
            }
            applyFilters();
        });
    }

    function initViewToggle() {
        const gridBtn = document.getElementById('view-grid');
        const listBtn = document.getElementById('view-list');
        const currentView = Storage.get('productViewMode') || 'grid';

        if (currentView === 'list') {
            gridBtn?.classList.remove('bg-gray-200');
            listBtn?.classList.add('bg-gray-200');
        }

        gridBtn?.addEventListener('click', () => {
            Storage.set('productViewMode', 'grid');
            gridBtn.classList.add('bg-gray-200');
            listBtn?.classList.remove('bg-gray-200');
            loadProducts();
        });

        listBtn?.addEventListener('click', () => {
            Storage.set('productViewMode', 'list');
            listBtn.classList.add('bg-gray-200');
            gridBtn?.classList.remove('bg-gray-200');
            loadProducts();
        });
    }

    function destroy() {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
        currentFilters = {};
        currentPage = 1;
        currentCategory = null;
        initialized = false;
    }

    return {
        init,
        destroy
    };
})();

window.CategoryPage = CategoryPage;

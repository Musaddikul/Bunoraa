/**
 * Product Quick View Component
 * @module components/quickView
 */

const QuickView = (function() {
    'use strict';

    let currentModal = null;
    let currentProduct = null;
    let selectedVariant = null;
    let quantity = 1;

    function create() {
        // Remove existing modal if any
        const existing = document.getElementById('quick-view-modal');
        if (existing) existing.remove();

        const modalHtml = `
            <div id="quick-view-modal" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" data-quick-view-close></div>
                
                <!-- Modal Content -->
                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <div id="quick-view-content" class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all duration-300 scale-95 opacity-0">
                            <!-- Close Button -->
                            <button type="button" data-quick-view-close class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all" aria-label="Close quick view">
                                <svg class="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                            
                            <!-- Loading State -->
                            <div id="quick-view-loading" class="p-12">
                                <div class="flex items-center justify-center gap-3">
                                    <svg class="w-8 h-8 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span class="text-stone-600 font-medium">Loading product...</span>
                                </div>
                            </div>
                            
                            <!-- Product Content -->
                            <div id="quick-view-body" class="hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        currentModal = document.getElementById('quick-view-modal');

        // Event listeners
        currentModal.querySelectorAll('[data-quick-view-close]').forEach(el => {
            el.addEventListener('click', close);
        });

        currentModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        return currentModal;
    }

    function renderProduct(product) {
        currentProduct = product;
        selectedVariant = null;
        quantity = 1;

        const isOnSale = product.sale_price && product.sale_price < product.price;
        const discount = isOnSale ? Math.round((1 - product.sale_price / product.price) * 100) : 0;
        const inStock = !product.track_inventory || product.stock_quantity > 0 || product.allow_backorder;
        const images = product.images || [];
        const mainImage = product.primary_image || images[0]?.image || '/static/images/placeholder.png';

        const html = `
            <div class="grid lg:grid-cols-2 gap-0">
                <!-- Image Gallery -->
                <div class="relative bg-stone-100">
                    <!-- Main Image -->
                    <div class="aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden">
                        <img id="quick-view-main-image" 
                             src="${mainImage}" 
                             alt="${escapeHtml(product.name)}"
                             class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                    </div>
                    
                    <!-- Sale Badge -->
                    ${isOnSale ? `
                        <span class="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                            -${discount}% OFF
                        </span>
                    ` : ''}
                    
                    <!-- Thumbnails -->
                    ${images.length > 1 ? `
                        <div class="absolute bottom-4 left-4 right-4">
                            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                ${images.slice(0, 5).map((img, index) => `
                                    <button type="button" 
                                            class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === 0 ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/50 hover:border-white'}"
                                            data-thumbnail="${img.image}"
                                            data-index="${index}">
                                        <img src="${img.image}" alt="" class="w-full h-full object-cover">
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Product Details -->
                <div class="p-6 lg:p-8 flex flex-col h-full lg:h-[600px] overflow-y-auto">
                    <!-- Header -->
                    <div class="mb-6">
                        ${product.category ? `
                            <a href="/categories/${product.category.slug}/" class="text-sm text-amber-600 hover:text-amber-700 font-medium mb-2 inline-block">
                                ${escapeHtml(product.category.name)}
                            </a>
                        ` : ''}
                        <h2 id="quick-view-title" class="text-2xl lg:text-3xl font-display font-bold text-stone-900 mb-3">
                            ${escapeHtml(product.name)}
                        </h2>
                        
                        <!-- Rating -->
                        ${product.average_rating ? `
                            <div class="flex items-center gap-2 mb-4">
                                <div class="flex items-center gap-0.5">
                                    ${generateStars(product.average_rating)}
                                </div>
                                <span class="text-sm text-stone-500">(${product.review_count || 0} reviews)</span>
                            </div>
                        ` : ''}
                        
                        <!-- Price -->
                        <div class="flex items-baseline gap-3">
                            ${isOnSale ? `
                                <span class="text-3xl font-bold text-red-600">${formatPrice(product.sale_price)}</span>
                                <span class="text-xl text-stone-400 line-through">${formatPrice(product.price)}</span>
                                <span class="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">Save ${formatPrice(product.price - product.sale_price)}</span>
                            ` : `
                                <span class="text-3xl font-bold text-stone-900">${formatPrice(product.price)}</span>
                            `}
                        </div>
                    </div>
                    
                    <!-- Description -->
                    ${product.short_description ? `
                        <p class="text-stone-600 mb-6 leading-relaxed line-clamp-3">
                            ${escapeHtml(product.short_description)}
                        </p>
                    ` : ''}
                    
                    <!-- Variants -->
                    ${product.variants && product.variants.length > 0 ? `
                        <div class="mb-6 space-y-4" id="quick-view-variants">
                            ${renderVariants(product)}
                        </div>
                    ` : ''}
                    
                    <!-- Stock Status -->
                    <div class="mb-6">
                        ${inStock ? `
                            <div class="flex items-center gap-2 text-green-600">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span class="font-medium">In Stock</span>
                                ${product.stock_quantity && product.stock_quantity <= 10 ? `
                                    <span class="text-amber-600 text-sm">(Only ${product.stock_quantity} left!)</span>
                                ` : ''}
                            </div>
                        ` : `
                            <div class="flex items-center gap-2 text-red-600">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                                <span class="font-medium">Out of Stock</span>
                            </div>
                        `}
                    </div>
                    
                    <!-- Quantity & Add to Cart -->
                    <div class="mt-auto space-y-4">
                        ${inStock ? `
                            <div class="flex items-center gap-4">
                                <!-- Quantity -->
                                <div class="flex items-center border border-stone-300 rounded-xl overflow-hidden">
                                    <button type="button" id="quick-view-qty-minus" class="px-4 py-3 text-stone-600 hover:bg-stone-100 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                        </svg>
                                    </button>
                                    <input type="number" id="quick-view-qty" value="1" min="1" max="${product.stock_quantity || 99}" 
                                           class="w-16 text-center border-0 focus:ring-0 font-semibold text-stone-900">
                                    <button type="button" id="quick-view-qty-plus" class="px-4 py-3 text-stone-600 hover:bg-stone-100 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <!-- Add to Cart -->
                                <button type="button" id="quick-view-add-cart" 
                                        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/25 hover:shadow-xl transition-all"
                                        ${product.has_variants && !selectedVariant ? 'data-requires-variant="true"' : ''}>
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                    </svg>
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                            
                            <!-- Wishlist -->
                            <button type="button" id="quick-view-wishlist" 
                                    class="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-700 hover:text-rose-600 font-medium rounded-xl transition-all">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                                <span>Add to Wishlist</span>
                            </button>
                        ` : `
                            <button type="button" disabled class="w-full px-6 py-3 bg-stone-300 text-stone-500 font-semibold rounded-xl cursor-not-allowed">
                                Out of Stock
                            </button>
                            
                            <button type="button" class="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-200 bg-amber-50 text-amber-700 font-medium rounded-xl hover:bg-amber-100 transition-all">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                                </svg>
                                <span>Notify When Available</span>
                            </button>
                        `}
                        
                        <!-- View Full Details -->
                        <a href="/products/${product.slug}/" 
                           class="block text-center text-amber-600 hover:text-amber-700 font-medium py-2 transition-colors">
                            View Full Details →
                        </a>
                    </div>
                    
                    <!-- Trust Badges -->
                    <div class="mt-6 pt-6 border-t border-stone-200">
                        <div class="flex items-center justify-center gap-6 text-stone-500 text-sm">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span>Secure Checkout</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                                </svg>
                                <span>Fast Shipping</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                                </svg>
                                <span>Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    function renderVariants(product) {
        if (!product.variants || product.variants.length === 0) return '';

        // Group variants by attribute type
        const attributeGroups = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (!attributeGroups[key]) {
                        attributeGroups[key] = new Set();
                    }
                    attributeGroups[key].add(value);
                });
            }
        });

        let html = '';
        Object.entries(attributeGroups).forEach(([attrName, values]) => {
            const valuesArray = Array.from(values);
            const isColor = attrName.toLowerCase().includes('color');

            html += `
                <div class="variant-group" data-attribute="${attrName}">
                    <label class="block text-sm font-medium text-stone-700 mb-2">${attrName}</label>
                    <div class="flex flex-wrap gap-2">
                        ${valuesArray.map(value => {
                            if (isColor) {
                                return `
                                    <button type="button" 
                                            class="variant-option w-10 h-10 rounded-full border-2 border-stone-300 hover:border-amber-500 transition-all"
                                            style="background-color: ${value}"
                                            data-attribute="${attrName}"
                                            data-value="${value}"
                                            title="${value}">
                                    </button>
                                `;
                            } else {
                                return `
                                    <button type="button" 
                                            class="variant-option px-4 py-2 border-2 border-stone-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 text-sm font-medium transition-all"
                                            data-attribute="${attrName}"
                                            data-value="${value}">
                                        ${value}
                                    </button>
                                `;
                            }
                        }).join('')}
                    </div>
                </div>
            `;
        });

        return html;
    }

    async function open(productIdOrSlug) {
        if (!currentModal) create();

        // Show modal with loading
        currentModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        
        const content = document.getElementById('quick-view-content');
        const loading = document.getElementById('quick-view-loading');
        const body = document.getElementById('quick-view-body');

        loading.classList.remove('hidden');
        body.classList.add('hidden');

        // Animate in
        requestAnimationFrame(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        });

        try {
            // Fetch product data - API supports both UUID and slug
            const response = await (window.ProductsApi ? window.ProductsApi.getProduct(productIdOrSlug) : fetch(`/api/v1/products/${productIdOrSlug}/`).then(r => r.json()));
            const product = response.data || response;

            if (!product || !product.id) {
                throw new Error('Product not found');
            }

            // Render product
            body.innerHTML = renderProduct(product);
            loading.classList.add('hidden');
            body.classList.remove('hidden');

            // Setup event handlers
            setupEventHandlers();

        } catch (error) {
            console.error('Quick view error:', error);
            body.innerHTML = `
                <div class="p-12 text-center">
                    <svg class="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="text-stone-600 mb-4">Failed to load product details</p>
                    <button type="button" data-quick-view-close class="px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition-colors">
                        Close
                    </button>
                </div>
            `;
            loading.classList.add('hidden');
            body.classList.remove('hidden');
            
            body.querySelector('[data-quick-view-close]')?.addEventListener('click', close);
        }
    }

    function setupEventHandlers() {
        // Thumbnail clicks
        document.querySelectorAll('#quick-view-body [data-thumbnail]').forEach(btn => {
            btn.addEventListener('click', function() {
                const mainImage = document.getElementById('quick-view-main-image');
                if (mainImage) {
                    mainImage.src = this.dataset.thumbnail;
                }
                
                // Update active state
                document.querySelectorAll('#quick-view-body [data-thumbnail]').forEach(b => {
                    b.classList.remove('border-amber-500', 'ring-2', 'ring-amber-500/30');
                    b.classList.add('border-white/50');
                });
                this.classList.remove('border-white/50');
                this.classList.add('border-amber-500', 'ring-2', 'ring-amber-500/30');
            });
        });

        // Quantity controls
        const qtyInput = document.getElementById('quick-view-qty');
        const qtyMinus = document.getElementById('quick-view-qty-minus');
        const qtyPlus = document.getElementById('quick-view-qty-plus');

        if (qtyMinus && qtyInput) {
            qtyMinus.addEventListener('click', () => {
                const current = parseInt(qtyInput.value) || 1;
                if (current > 1) {
                    qtyInput.value = current - 1;
                    quantity = current - 1;
                }
            });
        }

        if (qtyPlus && qtyInput) {
            qtyPlus.addEventListener('click', () => {
                const current = parseInt(qtyInput.value) || 1;
                const max = parseInt(qtyInput.max) || 99;
                if (current < max) {
                    qtyInput.value = current + 1;
                    quantity = current + 1;
                }
            });
        }

        if (qtyInput) {
            qtyInput.addEventListener('change', () => {
                quantity = parseInt(qtyInput.value) || 1;
            });
        }

        // Variant selection
        document.querySelectorAll('#quick-view-body .variant-option').forEach(btn => {
            btn.addEventListener('click', function() {
                const attr = this.dataset.attribute;
                
                // Update selected state in group
                document.querySelectorAll(`#quick-view-body .variant-option[data-attribute="${attr}"]`).forEach(b => {
                    b.classList.remove('border-amber-500', 'bg-amber-50', 'ring-2', 'ring-amber-500/30');
                    b.classList.add('border-stone-300');
                });
                
                this.classList.remove('border-stone-300');
                this.classList.add('border-amber-500', 'bg-amber-50', 'ring-2', 'ring-amber-500/30');
            });
        });

        // Add to cart
        const addCartBtn = document.getElementById('quick-view-add-cart');
        if (addCartBtn) {
            addCartBtn.addEventListener('click', async function() {
                if (!currentProduct) return;

                const originalContent = this.innerHTML;
                this.disabled = true;
                this.innerHTML = `
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding...</span>
                `;

                try {
                    const qty = parseInt(document.getElementById('quick-view-qty')?.value) || 1;
                    
                    if (window.CartApi) {
                        const response = await window.CartApi.addItem(currentProduct.id, qty);
                        if (response.success !== false) {
                            window.Toast?.success(response.message || 'Added to cart!');
                            close();
                        } else {
                            window.Toast?.error(response.message || 'Failed to add to cart');
                        }
                    } else {
                        window.Toast?.success('Added to cart!');
                        close();
                    }
                } catch (error) {
                    window.Toast?.error(error.message || 'Failed to add to cart');
                } finally {
                    this.disabled = false;
                    this.innerHTML = originalContent;
                }
            });
        }

        // Wishlist
        const wishlistBtn = document.getElementById('quick-view-wishlist');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', async function() {
                if (!currentProduct) return;

                if (window.AuthApi && !window.AuthApi.isAuthenticated()) {
                    window.Toast?.info('Please log in to add items to your wishlist');
                    window.AuthGuard?.redirectToLogin();
                    return;
                }

                const originalContent = this.innerHTML;
                this.disabled = true;
                this.innerHTML = `
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding...</span>
                `;

                try {
                    if (window.WishlistApi) {
                        const response = await window.WishlistApi.addItem(currentProduct.id);
                        window.Toast?.success(response.message || 'Added to wishlist!');
                    } else {
                        window.Toast?.success('Added to wishlist!');
                    }
                    
                    this.innerHTML = `
                        <svg class="w-5 h-5 text-rose-500 fill-current" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        <span class="text-rose-600">Added to Wishlist</span>
                    `;
                    this.disabled = true;
                } catch (error) {
                    window.Toast?.error(error.message || 'Failed to add to wishlist');
                    this.disabled = false;
                    this.innerHTML = originalContent;
                }
            });
        }
    }

    function close() {
        if (!currentModal) return;

        const content = document.getElementById('quick-view-content');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            currentModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            currentProduct = null;
            selectedVariant = null;
            quantity = 1;
        }, 300);
    }

    // Helper functions
    function escapeHtml(str) {
        if (!str) return '';
        if (window.Templates?.escapeHtml) return window.Templates.escapeHtml(str);
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatPrice(price) {
        if (window.Templates?.formatPrice) return window.Templates.formatPrice(price);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    function generateStars(rating) {
        if (window.Templates?.generateStars) return window.Templates.generateStars(rating);
        
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<svg class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            } else if (i === fullStars && hasHalf) {
                stars += '<svg class="w-4 h-4 text-amber-400" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="#d1d5db"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            } else {
                stars += '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            }
        }
        return stars;
    }

    // Initialize - set up global click handler for quick view buttons
    function init() {
        document.addEventListener('click', (e) => {
            const quickViewBtn = e.target.closest('[data-quick-view]');
            if (quickViewBtn) {
                e.preventDefault();
                const productId = quickViewBtn.dataset.quickView;
                open(productId);
            }
        });
    }

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        open,
        close,
        init
    };
})();

window.QuickView = QuickView;

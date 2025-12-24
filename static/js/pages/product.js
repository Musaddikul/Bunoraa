/**
 * Product Detail Page
 * @module pages/product
 */

const ProductPage = (function() {
    'use strict';

    let currentProduct = null;
    let selectedVariant = null;
    let gallery = null;
    let initialized = false;

    async function init() {
        // Prevent multiple initializations
        if (initialized) return;
        initialized = true;

        const container = document.getElementById('product-detail');
        if (!container) return;

        // Check if content is already server-rendered
        const isServerRendered = container.querySelector('h1') || container.dataset.productId;
        
        if (isServerRendered) {
            // Server-rendered content - just bind event handlers
            currentProduct = {
                id: container.dataset.productId,
                slug: container.dataset.productSlug
            };
            bindExistingEvents();
            return;
        }

        // Dynamic loading for SPA navigation
        const productSlug = getProductSlugFromUrl();
        if (!productSlug) {
            window.location.href = '/products/';
            return;
        }

        await loadProduct(productSlug);
    }

    function bindExistingEvents() {
        // Bind quantity controls
        initQuantityControls();
        // Bind add to cart
        initAddToCartFromExisting();
        // Bind wishlist
        initWishlistFromExisting();
        markWishlistButtonIfNeeded();
            async function markWishlistButtonIfNeeded() {
                const btn = document.getElementById('add-to-wishlist-btn');
                if (!btn) return;
                const productId = document.getElementById('product-detail')?.dataset.productId;
                if (!productId) return;
                if (typeof WishlistApi === 'undefined') return;
                try {
                    const resp = await WishlistApi.getWishlist({ pageSize: 100 });
                    if (resp.success && resp.data?.items) {
                        const found = resp.data.items.some(item => item.product_id === productId || item.product === productId);
                        if (found) {
                            btn.querySelector('svg')?.setAttribute('fill', 'currentColor');
                            btn.classList.add('text-red-500');
                        } else {
                            btn.querySelector('svg')?.setAttribute('fill', 'none');
                            btn.classList.remove('text-red-500');
                        }
                    }
                } catch (e) {}
            }
        // Bind variant selection
        initVariantSelectionFromExisting();
        // Bind image gallery
        initGalleryFromExisting();
        // Bind tabs
        initTabsFromExisting();
    }

    function initTabsFromExisting() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Update button styles
                tabButtons.forEach(b => {
                    b.classList.remove('border-primary-500', 'text-primary-600');
                    b.classList.add('border-transparent', 'text-gray-500');
                });
                btn.classList.add('border-primary-500', 'text-primary-600');
                btn.classList.remove('border-transparent', 'text-gray-500');
                
                // Show/hide content
                tabContents.forEach(content => {
                    if (content.id === `${tabName}-tab`) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
    }

    function initQuantityControls() {
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const qtyInput = document.getElementById('quantity');

        decreaseBtn?.addEventListener('click', () => {
            const current = parseInt(qtyInput?.value) || 1;
            if (current > 1) qtyInput.value = current - 1;
        });

        increaseBtn?.addEventListener('click', () => {
            const current = parseInt(qtyInput?.value) || 1;
            const max = parseInt(qtyInput?.max) || 99;
            if (current < max) qtyInput.value = current + 1;
        });
    }

    function initAddToCartFromExisting() {
        const btn = document.getElementById('add-to-cart-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const productId = document.getElementById('product-detail')?.dataset.productId;
            const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
            const variantInput = document.querySelector('input[name="variant"]');
            const hasVariants = !!variantInput;
            const variantId = document.querySelector('input[name="variant"]:checked')?.value;

            if (!productId) return;

            // If product has variants, enforce selection
            if (hasVariants && !variantId) {
                Toast.warning('Please select a variant before adding to cart.');
                return;
            }

            btn.disabled = true;
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';



            try {

                await CartApi.addItem(productId, quantity, variantId || null);

                Toast.success('Added to cart!');
                document.dispatchEvent(new CustomEvent('cart:updated'));
            } catch (error) {
                Toast.error(error.message || 'Failed to add to cart.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        });
    }

    function initWishlistFromExisting() {
        const btn = document.getElementById('add-to-wishlist-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const productId = document.getElementById('product-detail')?.dataset.productId;
            if (!productId) return;

            if (typeof AuthApi !== 'undefined' && !AuthApi.isAuthenticated()) {
                Toast.warning('Please login to add items to your wishlist.');
                window.location.href = '/account/login/?next=' + encodeURIComponent(window.location.pathname);
                return;
            }

            try {
                // Check if already in wishlist
                let inWishlist = false;
                if (typeof WishlistApi !== 'undefined') {
                    const resp = await WishlistApi.getWishlist({ pageSize: 100 });
                    if (resp.success && resp.data?.items) {
                        inWishlist = resp.data.items.some(item => item.product_id === productId || item.product === productId);
                    }
                }
                if (inWishlist) {
                    // Remove from wishlist
                    // Find the wishlist item id
                    const resp = await WishlistApi.getWishlist({ pageSize: 100 });
                    const item = resp.data.items.find(item => item.product_id === productId || item.product === productId);
                    if (item) {
                        await WishlistApi.removeItem(item.id);
                        Toast.success('Removed from wishlist!');
                        btn.querySelector('svg')?.setAttribute('fill', 'none');
                        btn.classList.remove('text-red-500');
                    }
                } else {
                    // Add to wishlist
                    await WishlistApi.addItem(productId);
                    Toast.success('Added to wishlist!');
                    btn.querySelector('svg')?.setAttribute('fill', 'currentColor');
                    btn.classList.add('text-red-500');
                }
            } catch (error) {
                Toast.error(error.message || 'Wishlist action failed.');
            }
        });
    }

    function initVariantSelectionFromExisting() {
        const variantInputs = document.querySelectorAll('input[name="variant"]');
        variantInputs.forEach(input => {
            input.addEventListener('change', () => {
                selectedVariant = input.value;
                // Update price if variant has different price
                const price = input.dataset.price;
                if (price) {
                    const priceEl = document.getElementById('product-price');
                    if (priceEl && window.Templates?.formatPrice) {
                        priceEl.textContent = window.Templates.formatPrice(parseFloat(price));
                    }
                }
            });
        });
    }

    function initGalleryFromExisting() {
        // Image change is handled via onclick in template
        // Just setup zoom functionality if needed
        const mainImage = document.getElementById('main-image');
        mainImage?.addEventListener('click', () => {
            // Could open lightbox here
        });
    }

    function getProductSlugFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/\/products\/([^\/]+)/);
        return match ? match[1] : null;
    }

    async function loadProduct(slug) {
        const container = document.getElementById('product-detail');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await ProductsApi.getBySlug(slug);
            currentProduct = response.data;

            if (!currentProduct) {
                window.location.href = '/404/';
                return;
            }

            document.title = `${currentProduct.name} | Bunoraa`;
            
            renderProduct(currentProduct);
            await Promise.all([
                loadBreadcrumbs(currentProduct),
                loadRelatedProducts(currentProduct),
                loadReviews(currentProduct)
            ]);

            trackProductView(currentProduct);
        } catch (error) {
            console.error('Failed to load product:', error);
            container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load product. Please try again.</p>';
        }
    }

    function renderProduct(product) {
        const container = document.getElementById('product-detail');
        if (!container) return;

        const images = product.images || [];
        const mainImage = product.image || images[0]?.image || '/static/images/placeholder.png';
        const hasVariants = product.variants && product.variants.length > 0;
        const inStock = product.stock_quantity > 0 || product.in_stock;
        const onSale = product.sale_price && product.sale_price < product.price;

        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Gallery -->
                <div id="product-gallery" class="product-gallery">
                    <div class="main-image-container relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img 
                            src="${mainImage}" 
                            alt="${Templates.escapeHtml(product.name)}"
                            class="main-image w-full h-full object-cover cursor-zoom-in"
                            id="main-product-image"
                        >
                        ${onSale ? `
                            <span class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                                Sale
                            </span>
                        ` : ''}
                        ${!inStock ? `
                            <span class="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                                Out of Stock
                            </span>
                        ` : ''}
                    </div>
                    ${images.length > 1 ? `
                        <div class="thumbnails flex gap-2 mt-4 overflow-x-auto pb-2">
                            ${images.map((img, index) => `
                                <button 
                                    class="thumbnail flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary-500' : 'border-transparent'} hover:border-primary-500 transition-colors"
                                    data-image="${img.image}"
                                    data-index="${index}"
                                >
                                    <img src="${img.image}" alt="" class="w-full h-full object-cover">
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Product Info -->
                <div class="product-info">
                    <!-- Brand -->
                    ${product.brand ? `
                        <a href="/products/?brand=${product.brand.id}" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            ${Templates.escapeHtml(product.brand.name)}
                        </a>
                    ` : ''}

                    <!-- Title -->
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                        ${Templates.escapeHtml(product.name)}
                    </h1>

                    <!-- Rating -->
                    ${product.average_rating ? `
                        <div class="flex items-center gap-2 mt-3">
                            <div class="flex items-center">
                                ${Templates.renderStars(product.average_rating)}
                            </div>
                            <span class="text-sm text-gray-600">
                                ${product.average_rating.toFixed(1)} (${product.review_count || 0} reviews)
                            </span>
                            <a href="#reviews" class="text-sm text-primary-600 hover:text-primary-700">
                                Read reviews
                            </a>
                        </div>
                    ` : ''}

                    <!-- Price -->
                    <div class="mt-4">
                        ${Price.render({
                            price: product.price,
                            salePrice: product.sale_price,
                            size: 'large'
                        })}
                    </div>

                    <!-- Short Description -->
                    ${product.short_description ? `
                        <p class="mt-4 text-gray-600">${Templates.escapeHtml(product.short_description)}</p>
                    ` : ''}

                    <!-- Variants -->
                    ${hasVariants ? renderVariants(product.variants) : ''}

                    <!-- Quantity & Add to Cart -->
                    <div class="mt-6 space-y-4">
                        <div class="flex items-center gap-4">
                            <label class="text-sm font-medium text-gray-700">Quantity:</label>
                            <div class="flex items-center border border-gray-300 rounded-lg">
                                <button 
                                    class="qty-decrease px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                    </svg>
                                </button>
                                <input 
                                    type="number" 
                                    id="product-quantity"
                                    value="1" 
                                    min="1" 
                                    max="${product.stock_quantity || 99}"
                                    class="w-16 text-center border-0 focus:ring-0"
                                >
                                <button 
                                    class="qty-increase px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                    </svg>
                                </button>
                            </div>
                            ${product.stock_quantity ? `
                                <span class="text-sm text-gray-500">${product.stock_quantity} available</span>
                            ` : ''}
                        </div>

                        <div class="flex gap-3">
                            <button 
                                id="add-to-cart-btn"
                                class="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                ${!inStock ? 'disabled' : ''}
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                ${inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button 
                                id="add-to-wishlist-btn"
                                class="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                aria-label="Add to wishlist"
                                data-product-id="${product.id}"
                            >
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Product Meta -->
                    <div class="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                        ${product.sku ? `
                            <div class="flex">
                                <span class="text-gray-500 w-24">SKU:</span>
                                <span class="text-gray-900">${Templates.escapeHtml(product.sku)}</span>
                            </div>
                        ` : ''}
                        ${product.category ? `
                            <div class="flex">
                                <span class="text-gray-500 w-24">Category:</span>
                                <a href="/categories/${product.category.slug}/" class="text-primary-600 hover:text-primary-700">
                                    ${Templates.escapeHtml(product.category.name)}
                                </a>
                            </div>
                        ` : ''}
                        ${product.tags && product.tags.length ? `
                            <div class="flex">
                                <span class="text-gray-500 w-24">Tags:</span>
                                <div class="flex flex-wrap gap-1">
                                    ${product.tags.map(tag => `
                                        <a href="/products/?tag=${tag.slug}" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                            ${Templates.escapeHtml(tag.name)}
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Share -->
                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <span class="text-sm text-gray-500">Share:</span>
                        <div class="flex gap-2 mt-2">
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="facebook" aria-label="Share on Facebook">
                                <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </button>
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="twitter" aria-label="Share on Twitter">
                                <svg class="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </button>
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="pinterest" aria-label="Share on Pinterest">
                                <svg class="w-5 h-5 text-[#E60023]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
                            </button>
                            <button class="share-btn p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-platform="copy" aria-label="Copy link">
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Tabs -->
            <div class="mt-12" data-tabs data-variant="underline" id="product-tabs">
                <div class="border-b border-gray-200">
                    <nav class="flex -mb-px">
                        <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                            Description
                        </button>
                        ${product.specifications && Object.keys(product.specifications).length ? `
                            <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                                Specifications
                            </button>
                        ` : ''}
                        <button data-tab class="px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent">
                            Reviews (${product.review_count || 0})
                        </button>
                    </nav>
                </div>
                <div class="py-6">
                    <div data-tab-panel>
                        <div class="prose max-w-none">
                            ${product.description || '<p class="text-gray-500">No description available.</p>'}
                        </div>
                    </div>
                    ${product.specifications && Object.keys(product.specifications).length ? `
                        <div data-tab-panel>
                            <table class="w-full">
                                <tbody>
                                    ${Object.entries(product.specifications).map(([key, value]) => `
                                        <tr class="border-b border-gray-100">
                                            <td class="py-3 text-sm font-medium text-gray-500 w-1/3">${Templates.escapeHtml(key)}</td>
                                            <td class="py-3 text-sm text-gray-900">${Templates.escapeHtml(String(value))}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : ''}
                    <div data-tab-panel id="reviews">
                        <div id="reviews-container">
                            <!-- Reviews loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        initGallery();
        initQuantityControls();
        initAddToCart();
        initWishlist();
        initShare();
        Tabs.init();
    }

    function renderVariants(variants) {
        const grouped = {};
        variants.forEach(variant => {
            if (!grouped[variant.attribute_name]) {
                grouped[variant.attribute_name] = [];
            }
            grouped[variant.attribute_name].push(variant);
        });

        return Object.entries(grouped).map(([attrName, options]) => `
            <div class="mt-6">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(attrName)}:</label>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${options.map((opt, index) => `
                        <button 
                            class="variant-btn px-4 py-2 border rounded-lg text-sm transition-colors ${index === 0 ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 hover:border-gray-400'}"
                            data-variant-id="${opt.id}"
                            data-price="${opt.price || ''}"
                            data-stock="${opt.stock_quantity || 0}"
                        >
                            ${Templates.escapeHtml(opt.value)}
                            ${opt.price && opt.price !== currentProduct.price ? `
                                <span class="text-xs text-gray-500">(${Templates.formatPrice(opt.price)})</span>
                            ` : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    function initGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-product-image');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('border-primary-500'));
                thumb.classList.add('border-primary-500');
                mainImage.src = thumb.dataset.image;
            });
        });

        mainImage?.addEventListener('click', () => {
            const images = currentProduct.images?.map(img => img.image) || [currentProduct.image];
            const currentIndex = parseInt(document.querySelector('.thumbnail.border-primary-500')?.dataset.index) || 0;
            ProductGallery.openLightbox(images, currentIndex);
        });
    }

    function initQuantityControls() {
        const qtyInput = document.getElementById('product-quantity');
        const decreaseBtn = document.querySelector('.qty-decrease');
        const increaseBtn = document.querySelector('.qty-increase');

        decreaseBtn?.addEventListener('click', () => {
            const current = parseInt(qtyInput.value) || 1;
            if (current > 1) {
                qtyInput.value = current - 1;
            }
        });

        increaseBtn?.addEventListener('click', () => {
            const current = parseInt(qtyInput.value) || 1;
            const max = parseInt(qtyInput.max) || 99;
            if (current < max) {
                qtyInput.value = current + 1;
            }
        });

        const variantBtns = document.querySelectorAll('.variant-btn');
        variantBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                variantBtns.forEach(b => {
                    b.classList.remove('border-primary-500', 'bg-primary-50', 'text-primary-700');
                    b.classList.add('border-gray-300');
                });
                btn.classList.add('border-primary-500', 'bg-primary-50', 'text-primary-700');
                btn.classList.remove('border-gray-300');

                selectedVariant = btn.dataset.variantId;
                
                if (btn.dataset.price) {
                    const priceContainer = document.querySelector('.product-info .mt-4');
                    if (priceContainer) {
                        priceContainer.innerHTML = Price.render({
                            price: parseFloat(btn.dataset.price),
                            size: 'large'
                        });
                    }
                }
            });
        });

        if (variantBtns.length > 0) {
            selectedVariant = variantBtns[0].dataset.variantId;
        }
    }

    function initAddToCart() {
        const btn = document.getElementById('add-to-cart-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const quantity = parseInt(document.getElementById('product-quantity')?.value) || 1;

            btn.disabled = true;
            btn.innerHTML = '<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

            try {
                await CartApi.addItem(currentProduct.id, quantity, selectedVariant || null);

                Toast.success('Added to cart!');
                document.dispatchEvent(new CustomEvent('cart:updated'));
            } catch (error) {
                Toast.error(error.message || 'Failed to add to cart.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Add to Cart
                `;
            }
        });
    }

    function initWishlist() {
        const btn = document.getElementById('add-to-wishlist-btn');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            if (!AuthApi.isAuthenticated()) {
                Toast.warning('Please login to add items to your wishlist.');
                window.location.href = '/account/login/?next=' + encodeURIComponent(window.location.pathname);
                return;
            }

            try {
                await WishlistApi.addItem(currentProduct.id);
                Toast.success('Added to wishlist!');
                
                btn.querySelector('svg').setAttribute('fill', 'currentColor');
                btn.classList.add('text-red-500');
            } catch (error) {
                if (error.message?.includes('already')) {
                    Toast.info('This item is already in your wishlist.');
                } else {
                    Toast.error(error.message || 'Failed to add to wishlist.');
                }
            }
        });
    }

    function initShare() {
        const shareBtns = document.querySelectorAll('.share-btn');
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(currentProduct?.name || document.title);

        shareBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                let shareUrl = '';

                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'pinterest':
                        const image = encodeURIComponent(currentProduct?.image || '');
                        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`;
                        break;
                    case 'copy':
                        navigator.clipboard.writeText(window.location.href)
                            .then(() => Toast.success('Link copied to clipboard!'))
                            .catch(() => Toast.error('Failed to copy link.'));
                        return;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    async function loadBreadcrumbs(product) {
        const container = document.getElementById('breadcrumbs');
        if (!container) return;

        const items = [
            { label: 'Home', url: '/' },
            { label: 'Products', url: '/products/' }
        ];

        if (product.category) {
            try {
                const response = await CategoriesAPI.getBreadcrumbs(product.category.id);
                const categoryBreadcrumbs = response.data || [];
                categoryBreadcrumbs.forEach(cat => {
                    items.push({ label: cat.name, url: `/categories/${cat.slug}/` });
                });
            } catch (error) {
                items.push({ label: product.category.name, url: `/categories/${product.category.slug}/` });
            }
        }

        items.push({ label: product.name });

        container.innerHTML = Breadcrumb.render(items);
    }

    async function loadRelatedProducts(product) {
        const container = document.getElementById('related-products');
        if (!container) return;

        try {
            const response = await ProductsAPI.getRelated(product.id, { limit: 4 });
            const products = response.data || [];

            if (products.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = `
                <h2 class="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    ${products.map(p => ProductCard.render(p)).join('')}
                </div>
            `;

            ProductCard.bindEvents(container);
        } catch (error) {
            console.error('Failed to load related products:', error);
            container.innerHTML = '';
        }
    }

    async function loadReviews(product) {
        const container = document.getElementById('reviews-container');
        if (!container) return;

        Loader.show(container, 'spinner');

        try {
            const response = await ProductsAPI.getReviews(product.id);
            const reviews = response.data || [];

            container.innerHTML = `
                <!-- Review Summary -->
                <div class="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                    <div class="text-center">
                        <div class="text-5xl font-bold text-gray-900">${product.average_rating?.toFixed(1) || '0.0'}</div>
                        <div class="flex justify-center mt-2">
                            ${Templates.renderStars(product.average_rating || 0)}
                        </div>
                        <div class="text-sm text-gray-500 mt-1">${product.review_count || 0} reviews</div>
                    </div>
                    ${AuthAPI.isAuthenticated() ? `
                        <div class="flex-1">
                            <button id="write-review-btn" class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                                Write a Review
                            </button>
                        </div>
                    ` : `
                        <div class="flex-1">
                            <p class="text-gray-600">
                                <a href="/account/login/?next=${encodeURIComponent(window.location.pathname)}" class="text-primary-600 hover:text-primary-700">Sign in</a> 
                                to write a review.
                            </p>
                        </div>
                    `}
                </div>

                <!-- Reviews List -->
                ${reviews.length > 0 ? `
                    <div class="space-y-6">
                        ${reviews.map(review => `
                            <div class="border-b border-gray-100 pb-6">
                                <div class="flex items-start gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span class="text-gray-600 font-medium">${(review.user?.first_name?.[0] || review.user?.email?.[0] || 'U').toUpperCase()}</span>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-gray-900">${Templates.escapeHtml(review.user?.first_name || 'Anonymous')}</span>
                                            ${review.verified_purchase ? `
                                                <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Verified Purchase</span>
                                            ` : ''}
                                        </div>
                                        <div class="flex items-center gap-2 mt-1">
                                            ${Templates.renderStars(review.rating)}
                                            <span class="text-sm text-gray-500">${Templates.formatDate(review.created_at)}</span>
                                        </div>
                                        ${review.title ? `<h4 class="font-medium text-gray-900 mt-2">${Templates.escapeHtml(review.title)}</h4>` : ''}
                                        <p class="text-gray-600 mt-2">${Templates.escapeHtml(review.comment)}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <p class="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                `}
            `;

            document.getElementById('write-review-btn')?.addEventListener('click', () => {
                showReviewForm(product);
            });
        } catch (error) {
            console.error('Failed to load reviews:', error);
            container.innerHTML = '<p class="text-red-500">Failed to load reviews.</p>';
        }
    }

    function showReviewForm(product) {
        Modal.open({
            title: 'Write a Review',
            content: `
                <form id="review-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div class="flex gap-1" id="rating-stars">
                            ${[1, 2, 3, 4, 5].map(i => `
                                <button type="button" class="rating-star text-gray-300 hover:text-yellow-400" data-rating="${i}">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="review-rating" value="0">
                    </div>
                    <div>
                        <label for="review-title" class="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
                        <input type="text" id="review-title" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label for="review-comment" class="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea id="review-comment" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" required></textarea>
                    </div>
                </form>
            `,
            confirmText: 'Submit Review',
            onConfirm: async () => {
                const rating = parseInt(document.getElementById('review-rating').value);
                const title = document.getElementById('review-title').value.trim();
                const comment = document.getElementById('review-comment').value.trim();

                if (!rating || rating < 1) {
                    Toast.error('Please select a rating.');
                    return false;
                }

                if (!comment) {
                    Toast.error('Please write a review.');
                    return false;
                }

                try {
                    await ProductsAPI.createReview(product.id, { rating, title, comment });
                    Toast.success('Thank you for your review!');
                    loadReviews(product);
                    return true;
                } catch (error) {
                    Toast.error(error.message || 'Failed to submit review.');
                    return false;
                }
            }
        });

        const stars = document.querySelectorAll('.rating-star');
        const ratingInput = document.getElementById('review-rating');

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                ratingInput.value = rating;
                
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.remove('text-gray-300');
                        s.classList.add('text-yellow-400');
                    } else {
                        s.classList.add('text-gray-300');
                        s.classList.remove('text-yellow-400');
                    }
                });
            });
        });
    }

    async function trackProductView(product) {
        try {
            await ProductsAPI.trackView(product.id);
        } catch (error) {
            console.error('Failed to track view:', error);
        }
    }

    function destroy() {
        currentProduct = null;
        selectedVariant = null;
        gallery = null;
        initialized = false;
    }

    return {
        init,
        destroy
    };
})();

window.ProductPage = ProductPage;

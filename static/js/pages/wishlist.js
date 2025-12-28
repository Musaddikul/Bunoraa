/**
 * Wishlist Page
 * @module pages/wishlist
 */

const WishlistPage = (function() {
    'use strict';

    let currentPage = 1;

    async function init() {
        if (!AuthGuard.protectPage()) return;

        await loadWishlist();
    }

    function resolveProductImage(item = {}) {
        const product = item.product || item || {};
        const candidates = [
            item.product_image,
            product.product_image,
            product.primary_image,
            product.image,
            Array.isArray(product.images) ? product.images[0] : null,
            product.image_url,
            product.thumbnail
        ];

        const pick = (val) => {
            if (!val) return '';
            if (typeof val === 'string') return val;
            if (typeof val === 'object') {
                if (typeof val.image === 'string' && val.image) return val.image;
                if (val.image && typeof val.image === 'object') {
                    if (typeof val.image.url === 'string' && val.image.url) return val.image.url;
                    if (typeof val.image.src === 'string' && val.image.src) return val.image.src;
                }
                if (typeof val.url === 'string' && val.url) return val.url;
                if (typeof val.src === 'string' && val.src) return val.src;
            }
            return '';
        };

        for (const candidate of candidates) {
            const url = pick(candidate);
            if (url) return url;
        }

        return '';
    }

    function resolvePrices(item = {}) {
        const product = item.product || item || {};
        // For wishlist items, API now returns:
        // - item.product_price (original price)
        // - item.product_sale_price (sale price if on sale)
        
        const pickNumber = (val) => {
            if (val === null || val === undefined) return null;
            const num = Number(val);
            return Number.isFinite(num) ? num : null;
        };

        // Get regular price - prefer product_price from wishlist API
        const priceCandidates = [
            item.product_price,
            product.price,
            item.price,
            item.current_price,
            item.price_at_add
        ];
        
        let price = null;
        for (const p of priceCandidates) {
            price = pickNumber(p);
            if (price !== null) break;
        }

        // Get sale price - prefer product_sale_price from wishlist API
        const saleCandidates = [
            item.product_sale_price,
            product.sale_price,
            item.sale_price
        ];
        
        let salePrice = null;
        for (const s of saleCandidates) {
            salePrice = pickNumber(s);
            if (salePrice !== null) break;
        }

        return {
            price: price !== null ? price : 0,
            salePrice: salePrice !== null ? salePrice : null
        };
    }

    async function loadWishlist() {
        const container = document.getElementById('wishlist-container');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await WishlistApi.getWishlist({ page: currentPage });
            // Normalize various API shapes to a flat array and meta
            let items = [];
            let meta = {};

            if (Array.isArray(response)) {
                items = response;
            } else if (response && typeof response === 'object') {
                // Common shapes: { data: [...] }, { results: [...] }, { items: [...] }
                items = response.data || response.results || response.items || [];
                // Some APIs return { data: { items: [...], meta: {...} } }
                if (!Array.isArray(items) && response.data && typeof response.data === 'object') {
                    items = response.data.items || response.data.results || [];
                    meta = response.data.meta || response.meta || {};
                } else {
                    meta = response.meta || {};
                }
            }

            if (!Array.isArray(items)) {
                // Last-ditch attempt: single item object => wrap; otherwise empty
                items = items && typeof items === 'object' ? [items] : [];
            }

            renderWishlist(items, meta);
        } catch (error) {
            console.error('Failed to load wishlist:', error);

            const msg = (error && (error.message || error.detail)) || 'Failed to load wishlist.';

            // If authentication is required, redirect to login (AuthGuard will handle)
            if (error && error.status === 401) {
                // Trigger login redirect
                AuthGuard.redirectToLogin();
                return;
            }

            container.innerHTML = `<p class="text-red-500 text-center py-8">${Templates.escapeHtml(msg)}</p>`;
        }
    }

    function renderWishlist(items, meta) {
        const container = document.getElementById('wishlist-container');
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p class="text-gray-600 mb-8">Start adding items you love to your wishlist.</p>
                    <a href="/products/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        Browse Products
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="mb-6 flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900">My Wishlist (${items.length} items)</h1>
                <button id="clear-wishlist-btn" class="text-red-600 hover:text-red-700 font-medium text-sm">
                    Clear All
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${items.map(item => renderWishlistItem(item)).join('')}
            </div>
            ${meta.total_pages > 1 ? `
                <div id="wishlist-pagination" class="mt-8"></div>
            ` : ''}
        `;

        // Mount modern Pagination component if needed
        if (meta && meta.total_pages > 1) {
            const mount = document.getElementById('wishlist-pagination');
            if (mount && window.Pagination) {
                const paginator = new window.Pagination({
                    totalPages: meta.total_pages,
                    currentPage: meta.current_page || currentPage,
                    className: 'justify-center',
                    onChange: (page) => {
                        currentPage = page;
                        loadWishlist();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
                mount.innerHTML = '';
                mount.appendChild(paginator.create());
            }
        }

        bindEvents();
    }

    function renderWishlistItem(item) {
        const product = item.product || item;
        // Use product_name and product_slug from wishlist item if available
        const productName = item.product_name || product.name || '';
        const productSlug = item.product_slug || product.slug || '';
        // Check is_in_stock from the item itself (wishlist API returns it at top level)
        const inStock = item.is_in_stock !== undefined ? item.is_in_stock : (product.is_in_stock !== undefined ? product.is_in_stock : (product.stock_quantity > 0));
        const imageUrl = resolveProductImage(item);
        
        // Use resolvePrices to get the best available price data
        const { price, salePrice } = resolvePrices(item);

        return `
            <div class="wishlist-item relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-item-id="${item.id}" data-product-id="${product.id || item.product}">
                <div class="relative" style="aspect-ratio: ${product?.aspect?.css || '1/1'};">
                    ${item.discount_percentage ? `
                        <div class="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -${item.discount_percentage}%
                        </div>
                    ` : ''}
                    <button class="remove-btn absolute top-2 right-2 z-20 w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg ring-2 ring-white/25 border border-white/30 flex items-center justify-center hover:bg-gray-800 transition-colors" aria-label="Remove from wishlist" style="pointer-events:auto;">
                        <svg class="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <a href="/products/${productSlug}/">
                        ${imageUrl ? `
                            <img 
                                src="${imageUrl}" 
                                alt="${Templates.escapeHtml(productName)}"
                                class="w-full h-full object-cover"
                                loading="lazy"
                            >
                        ` : `
                            <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wide">No Image</div>
                        `}
                    </a>
                </div>
                <div class="p-4">
                    ${product.category ? `
                        <a href="/categories/${product.category.slug}/" class="text-xs text-gray-500 hover:text-primary-600">
                            ${Templates.escapeHtml(product.category.name)}
                        </a>
                    ` : ''}
                    <h3 class="font-medium text-gray-900 mt-1 line-clamp-2">
                        <a href="/products/${productSlug}/" class="hover:text-primary-600">
                            ${Templates.escapeHtml(productName)}
                        </a>
                    </h3>
                    <div class="mt-2">
                        ${Price.render({
                            price: price,
                            salePrice: salePrice
                        })}
                    </div>
                    ${product.average_rating ? `
                        <div class="flex items-center gap-1 mt-2">
                            ${Templates.renderStars(product.average_rating)}
                            <span class="text-xs text-gray-500">(${product.review_count || 0})</span>
                        </div>
                    ` : ''}
                    <button 
                        class="add-to-cart-btn mt-4 w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                        ${!inStock ? 'disabled' : ''}
                    >
                        ${inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
                ${item.added_at ? `
                    <div class="px-4 pb-4">
                        <p class="text-xs text-gray-400">Added ${Templates.formatDate(item.added_at)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    function bindEvents() {
        const clearAllBtn = document.getElementById('clear-wishlist-btn');
        const wishlistItems = document.querySelectorAll('.wishlist-item');
        const paginationContainer = document.getElementById('wishlist-pagination');

        clearAllBtn?.addEventListener('click', async () => {
            const confirmed = await Modal.confirm({
                title: 'Clear Wishlist',
                message: 'Are you sure you want to remove all items from your wishlist?',
                confirmText: 'Clear All',
                cancelText: 'Cancel'
            });

            if (confirmed) {
                try {
                    await WishlistApi.clear();
                    Toast.success('Wishlist cleared.');
                    await loadWishlist();
                } catch (error) {
                    Toast.error(error.message || 'Failed to clear wishlist.');
                }
            }
        });

        wishlistItems.forEach(item => {
            const itemId = item.dataset.itemId;
            const productId = item.dataset.productId;

            item.querySelector('.remove-btn')?.addEventListener('click', async () => {
                try {
                    await WishlistApi.removeItem(itemId);
                    Toast.success('Removed from wishlist.');
                    item.remove();

                    const remaining = document.querySelectorAll('.wishlist-item');
                    if (remaining.length === 0) {
                        await loadWishlist();
                    }
                } catch (error) {
                    Toast.error(error.message || 'Failed to remove item.');
                }
            });

            item.querySelector('.add-to-cart-btn')?.addEventListener('click', async (e) => {
                const btn = e.target;
                if (btn.disabled) return;

                btn.disabled = true;
                btn.textContent = 'Adding...';

                try {
                    await CartApi.addItem(productId, 1);
                    Toast.success('Added to cart!');
                    document.dispatchEvent(new CustomEvent('cart:updated'));
                } catch (error) {
                    Toast.error(error.message || 'Failed to add to cart.');
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Add to Cart';
                }
            });
        });

        // Pagination handled by component onChange
    }

    function destroy() {
        currentPage = 1;
    }

    return {
        init,
        destroy
    };
})();

window.WishlistPage = WishlistPage;

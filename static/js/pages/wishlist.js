/**
 * Wishlist Page
 * @module pages/wishlist
 */

const WishlistPage = (function() {
    'use strict';

    let currentPage = 1;

    async function init() {
        if (!AuthGuard.requireAuth()) return;

        await loadWishlist();
    }

    async function loadWishlist() {
        const container = document.getElementById('wishlist-container');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await WishlistApi.getAll({ page: currentPage });
            const items = response.data || [];
            const meta = response.meta || {};

            renderWishlist(items, meta);
        } catch (error) {
            console.error('Failed to load wishlist:', error);
            container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load wishlist.</p>';
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
                <div id="wishlist-pagination" class="mt-8">${Pagination.render({
                    currentPage: meta.current_page || currentPage,
                    totalPages: meta.total_pages,
                    totalItems: meta.total
                })}</div>
            ` : ''}
        `;

        bindEvents();
    }

    function renderWishlistItem(item) {
        const product = item.product || item;
        const inStock = product.stock_quantity > 0 || product.in_stock;
        const onSale = product.sale_price && product.sale_price < product.price;

        return `
            <div class="wishlist-item bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-item-id="${item.id}" data-product-id="${product.id}">
                <div class="relative aspect-square bg-gray-100">
                    <a href="/products/${product.slug}/">
                        <img 
                            src="${product.image || '/static/images/placeholder.png'}" 
                            alt="${Templates.escapeHtml(product.name)}"
                            class="w-full h-full object-cover"
                            loading="lazy"
                        >
                    </a>
                    ${onSale ? `
                        <span class="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">Sale</span>
                    ` : ''}
                    ${!inStock ? `
                        <span class="absolute top-2 right-2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">Out of Stock</span>
                    ` : ''}
                    <button class="remove-btn absolute top-2 ${onSale ? 'right-2' : 'right-2'} w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors" aria-label="Remove from wishlist">
                        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    ${product.category ? `
                        <a href="/categories/${product.category.slug}/" class="text-xs text-gray-500 hover:text-primary-600">
                            ${Templates.escapeHtml(product.category.name)}
                        </a>
                    ` : ''}
                    <h3 class="font-medium text-gray-900 mt-1 line-clamp-2">
                        <a href="/products/${product.slug}/" class="hover:text-primary-600">
                            ${Templates.escapeHtml(product.name)}
                        </a>
                    </h3>
                    <div class="mt-2">
                        ${Price.render({
                            price: product.price,
                            salePrice: product.sale_price
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

        paginationContainer?.addEventListener('click', (e) => {
            const pageBtn = e.target.closest('[data-page]');
            if (pageBtn) {
                currentPage = parseInt(pageBtn.dataset.page);
                loadWishlist();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
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

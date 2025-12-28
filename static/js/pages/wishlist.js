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
        try {
            const product = item.product || item || {};
            const productName = item.product_name || product.name || '';
            const productSlug = item.product_slug || product.slug || '';
            const inStock = item.is_in_stock !== undefined ? item.is_in_stock : (product.is_in_stock !== undefined ? product.is_in_stock : (product.stock_quantity > 0));
            const imageUrl = resolveProductImage(item || {});
            const requiresVariants = !!item.product_has_variants;

            let priceObj = { price: 0, salePrice: null };
            try { priceObj = resolvePrices(item || {}); } catch { priceObj = { price: 0, salePrice: null }; }
            const { price, salePrice } = priceObj;

            const safeEscape = (s) => {
                try { return Templates.escapeHtml(s || ''); } catch { return String(s || ''); }
            };

            const safePriceRender = (p) => {
                try { return Price.render({ price: p.price, salePrice: p.salePrice }); } catch { return `<span class="font-bold">${p.price || ''}</span>`; }
            };

            const aspectCss = (product && product.aspect && (product.aspect.css || (product.aspect.width && product.aspect.height ? `${product.aspect.width}/${product.aspect.height}` : null))) || '1/1';

            return `
                <div class="wishlist-item relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-item-id="${item && item.id ? item.id : ''}" data-product-id="${(product && product.id) ? product.id : (item && item.product) ? item.product : ''}" data-product-slug="${safeEscape(productSlug)}" data-product-has-variants="${requiresVariants}">
                    <div class="relative" style="aspect-ratio: ${aspectCss};">
                        ${item && item.discount_percentage ? `
                            <div class="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                -${item.discount_percentage}%
                            </div>
                        ` : ''}
                        <button class="remove-btn absolute top-2 right-2 z-20 w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg ring-2 ring-white/25 border border-white/30 flex items-center justify-center hover:bg-gray-800 transition-colors" aria-label="Remove from wishlist" style="pointer-events:auto;">
                            <svg class="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        <a href="/products/${safeEscape(productSlug)}/">
                            ${imageUrl ? `
                                <img 
                                    src="${imageUrl}" 
                                    alt="${safeEscape(productName)}"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                >
                            ` : `
                                <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wide">No Image</div>
                            `}
                        </a>
                    </div>
                    <div class="p-4">
                        ${product && product.category ? `
                            <a href="/categories/${safeEscape(product.category.slug)}/" class="text-xs text-gray-500 hover:text-primary-600">
                                ${safeEscape(product.category.name)}
                            </a>
                        ` : ''}
                        <h3 class="font-medium text-gray-900 mt-1 line-clamp-2">
                            <a href="/products/${safeEscape(productSlug)}/" class="hover:text-primary-600">
                                ${safeEscape(productName)}
                            </a>
                        </h3>
                        <div class="mt-2">
                            ${safePriceRender({ price, salePrice })}
                        </div>
                        ${product && product.average_rating ? `
                            <div class="flex items-center gap-1 mt-2">
                                ${Templates.renderStars(product.average_rating)}
                                <span class="text-xs text-gray-500">(${product.review_count || 0})</span>
                            </div>
                        ` : ''}
                        <button 
                            class="add-to-cart-btn mt-4 w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                            ${!inStock ? 'disabled' : ''}
                        >
                            ${requiresVariants ? 'Select variant' : (inStock ? 'Add to Cart' : 'Out of Stock')}
                        </button>
                    </div>
                    ${item && item.added_at ? `
                        <div class="px-4 pb-4">
                            <p class="text-xs text-gray-400">Added ${Templates.formatDate(item.added_at)}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (err) {
            return '<div class="p-4 bg-white rounded shadow text-gray-500">Failed to render item</div>';
        }
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

                const productSlug = item.dataset.productSlug || ''; // fallback if not present
                const requiresVariants = item.dataset.productHasVariants === 'true' || item.dataset.productHasVariants === 'True' || item.dataset.productHasVariants === '1';

                // If product requires variants, redirect user to product page to choose
                if (requiresVariants) {
                    // Open inline variant picker modal
                    showVariantPicker(item);
                    return;
                }

                try {
                    await CartApi.addItem(productId, 1);
                    Toast.success('Added to cart!');
                    document.dispatchEvent(new CustomEvent('cart:updated'));
                } catch (error) {
                    // If the product requires a variant, redirect user to product page to choose variant
                    const hasVariantError = Boolean(
                        error && (
                            (error.errors && error.errors.variant_id) ||
                            (error.message && typeof error.message === 'string' && error.message.toLowerCase().includes('variant'))
                        )
                    );

                    if (hasVariantError) {
                        Toast.info('This product requires selecting a variant. Redirecting to the product page...');
                        // If we don't have a slug, fall back to using the product anchor
                        let slug = productSlug;
                        if (!slug) {
                            const href = item.querySelector('a')?.getAttribute('href');
                            if (href) {
                                const m = href.match(/\/products\/(.*)\/?$/);
                                if (m) slug = m[1];
                            }
                        }
                        if (slug) {
                            window.location.href = `/products/${slug}/`;
                            return;
                        }
                    }

                    Toast.error(error.message || 'Failed to add to cart.');
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Add to Cart';
                }
            });
        });

        // Pagination handled by component onChange
    }

    function renderModalVariants(variants) {
        const grouped = {};
        variants.forEach(variant => {
            if (!grouped[variant.attribute_name]) grouped[variant.attribute_name] = [];
            grouped[variant.attribute_name].push(variant);
        });

        return Object.entries(grouped).map(([attrName, options]) => `
            <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">${Templates.escapeHtml(attrName)}:</label>
                <div class="flex flex-wrap gap-2 mt-2" id="wishlist-variant-group-${Templates.slugify(attrName)}">
                    ${options.map((opt, index) => `
                        <button type="button" class="wishlist-modal-variant-btn px-3 py-2 border rounded-lg text-sm transition-colors ${index === 0 ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 hover:border-gray-400'}" data-variant-id="${opt.id}" data-price="${opt.price_converted ?? opt.price ?? ''}" data-stock="${opt.stock_quantity || 0}">
                            ${Templates.escapeHtml(opt.value)}
                            ${(opt.price_converted ?? opt.price) ? `<span class="text-xs text-gray-500"> (${Templates.formatPrice(opt.price_converted ?? opt.price)})</span>` : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    async function showVariantPicker(item) {
        // item: wishlist item object or DOM element dataset; prefer slug
        const slug = item.product_slug || item.dataset?.productSlug || '';
        const id = item.product || item.dataset?.productId || '';

        try {
            // Support environments where ProductsApi may not be available (fallback to ApiClient)
            let res;
            if (typeof ProductsApi !== 'undefined' && ProductsApi.getProduct) {
                res = await ProductsApi.getProduct(slug || id);
            } else {
                const currency = (window.BUNORAA_CURRENCY && window.BUNORAA_CURRENCY.code) || undefined;
                res = await ApiClient.get(`/products/${slug || id}/`, { currency });
            }

            if (!res || !res.success || !res.data) {
                const msg = res && res.message ? res.message : 'Failed to load product variants.';
                Toast.error(msg);
                return;
            }

            const product = res.data;
            const variants = product.variants || [];
            if (!variants.length) {
                // fallback to product page
                window.location.href = `/products/${product.slug || slug || id}/`;
                return;
            }

            const firstImage = product.images?.[0]?.image || product.primary_image || product.image || '';

            const content = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="col-span-1">
                        ${firstImage ? `<img src="${firstImage}" class="w-full h-48 object-cover rounded" alt="${Templates.escapeHtml(product.name)}">` : `<div class="w-full h-48 bg-gray-100 rounded"></div>`}
                    </div>
                    <div class="col-span-2">
                        <h3 class="text-lg font-semibold">${Templates.escapeHtml(product.name)}</h3>
                        <div id="wishlist-variant-price" class="mt-2 text-lg font-bold">${Templates.formatPrice(variants?.[0]?.price_converted ?? variants?.[0]?.price ?? product.price)}</div>
                        <div id="wishlist-variant-options" class="mt-4">
                            ${renderModalVariants(variants)}
                        </div>
                        <div class="mt-4 flex items-center gap-2">
                            <label class="text-sm text-gray-700">Qty</label>
                            <input id="wishlist-variant-qty" type="number" value="1" min="1" class="w-20 px-3 py-2 border rounded" />
                        </div>
                    </div>
                </div>
            `;

            const confirmed = await Modal.open({
                title: 'Select Variant',
                content,
                confirmText: 'Add to Cart',
                cancelText: 'Cancel',
                size: 'md',
                onConfirm: async () => {
                    // find selected variant
                    const active = document.querySelector('.wishlist-modal-variant-btn.border-primary-500');
                    const btn = active || document.querySelector('.wishlist-modal-variant-btn');
                    if (!btn) {
                        Toast.error('Please select a variant.');
                        return false;
                    }
                    const variantId = btn.dataset.variantId;
                    const qty = parseInt(document.getElementById('wishlist-variant-qty')?.value) || 1;

                    try {
                        await CartApi.addItem(product.id, qty, variantId);
                        Toast.success('Added to cart!');
                        document.dispatchEvent(new CustomEvent('cart:updated'));
                        return true;
                    } catch (err) {
                        Toast.error(err.message || 'Failed to add to cart.');
                        return false;
                    }
                }
            });

            // bind variant buttons to update selection and price after modal is rendered
            setTimeout(() => {
                const variantBtns = document.querySelectorAll('.wishlist-modal-variant-btn');
                variantBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        variantBtns.forEach(b => b.classList.remove('border-primary-500', 'bg-primary-50', 'text-primary-700'));
                        btn.classList.add('border-primary-500', 'bg-primary-50', 'text-primary-700');

                        const price = btn.dataset.price;
                        if (price !== undefined) {
                            const priceEl = document.getElementById('wishlist-variant-price');
                            if (priceEl) priceEl.textContent = Templates.formatPrice(price);
                        }
                    });
                });
                // preselect first variant
                const first = document.querySelector('.wishlist-modal-variant-btn');
                if (first) first.click();
            }, 20);

        } catch (error) {
            Toast.error('Failed to load variants.');
        }
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
export default WishlistPage;

/**
 * Product Card Component
 * @module components/productCard
 */

const ProductCard = (function() {
    'use strict';

    const templateUtils = typeof window !== 'undefined' && window.Templates ? window.Templates : null;
    const HTML_ESCAPE_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    const CART_ICON = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2m0 0h13.2a1 1 0 01.98 1.2l-1.2 6A2 2 0 0116.4 13H7.6A2 2 0 015.62 11.2L4.4 5"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17a2 2 0 11-4 0m-2 0a2 2 0 11-4 0"></path>
        </svg>
    `;

    function escapeHtml(value) {
        if (value === null || value === undefined) return '';
        if (templateUtils?.escapeHtml) return templateUtils.escapeHtml(value);
        return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char);
    }

    function toNumber(value) {
        if (value === null || value === undefined || value === '') return NaN;
        if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed.length) return NaN;
            const parsed = Number(trimmed);
            return Number.isFinite(parsed) ? parsed : NaN;
        }
        return NaN;
    }

    function formatPriceValue(value) {
        const numeric = toNumber(value);
        if (!Number.isFinite(numeric)) return '';
        if (templateUtils?.formatPrice) return templateUtils.formatPrice(numeric);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(numeric);
    }

    function generateStarsMarkup(rating) {
        if (templateUtils?.generateStars) return templateUtils.generateStars(rating);
        const clamped = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
        return Array.from({ length: 5 }, (_, index) => {
            const isActive = index < clamped;
            return `
                <svg class="w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-gray-200'}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            `;
        }).join('');
    }

    function computeDiscountPercent(product) {
        const basePrice = toNumber(product?.price);
        const salePrice = toNumber(product?.sale_price);
        if (!Number.isFinite(basePrice) || !Number.isFinite(salePrice)) return 0;
        if (basePrice <= 0 || salePrice <= 0 || salePrice >= basePrice) return 0;
        return Math.round(((basePrice - salePrice) / basePrice) * 100);
    }

    function getPrimaryImage(product) {
        return product?.primary_image || product?.image || product?.thumbnail || product?.images?.[0]?.image || product?.media?.[0]?.url;
    }

    function isProductNew(product) {
        return Boolean(product?.is_new || product?.isNew || product?.badges?.includes?.('new') || product?.tags?.includes?.('new'));
    }

    function resolveStockState(product) {
        if (!product) return { inStock: true, label: 'Available' };
        if (product.allow_backorder) return { inStock: true, label: 'Backorder' };
        if (product.track_inventory === false) return { inStock: true, label: 'In Stock' };

        const quantity = [
            product.stock_quantity,
            product.stock,
            product.available_stock,
            product.quantity
        ].find((value) => typeof value === 'number');

        if (typeof quantity === 'number') {
            return quantity > 0 ? { inStock: true, label: 'In Stock' } : { inStock: false, label: 'Out of Stock' };
        }

        if (typeof product.in_stock === 'boolean') {
            return { inStock: product.in_stock, label: product.in_stock ? 'In Stock' : 'Out of Stock' };
        }

        if (typeof product.is_in_stock === 'boolean') {
            return { inStock: product.is_in_stock, label: product.is_in_stock ? 'In Stock' : 'Out of Stock' };
        }

        if (typeof product.stock_status === 'string') {
            const normalized = product.stock_status.toLowerCase();
            if (normalized.includes('out')) return { inStock: false, label: 'Out of Stock' };
            if (normalized.includes('pre') || normalized.includes('back')) return { inStock: true, label: 'Pre-order' };
            if (normalized.includes('in') || normalized.includes('available')) return { inStock: true, label: 'In Stock' };
        }

        return { inStock: true, label: 'Available' };
    }

    function renderBadges(discountPercent, isNew) {
        const badges = [];
        if (discountPercent > 0) {
            badges.push(`<span class="badge badge-sale">-${discountPercent}%</span>`);
        }
        if (isNew) {
            badges.push('<span class="badge badge-success">New</span>');
        }
        if (!badges.length) return '';
        return `<div class="product-card-badges">${badges.join('')}</div>`;
    }

    function renderStockBadge(stockState, size = 'sm') {
        if (!stockState?.label) return '';
        const baseClass = size === 'lg'
            ? 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'
            : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
        const colorClass = stockState.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';
        return `<span class="${baseClass} ${colorClass}">${escapeHtml(stockState.label)}</span>`;
    }

    function renderPriceMarkup(product, {
        wrapperClass = 'flex items-center gap-2',
        currentClass = 'text-lg font-semibold text-gray-900',
        originalClass = 'text-sm text-gray-400 line-through',
        fallbackText = ''
    } = {}) {
        const basePrice = toNumber(product?.price);
        const salePrice = toNumber(product?.sale_price);

        if (Number.isFinite(basePrice) && Number.isFinite(salePrice) && salePrice > 0 && salePrice < basePrice) {
            return `
                <div class="${wrapperClass}">
                    <span class="${currentClass}">${formatPriceValue(salePrice)}</span>
                    <span class="${originalClass}">${formatPriceValue(basePrice)}</span>
                </div>
            `;
        }

        if (Number.isFinite(basePrice)) {
            return `
                <div class="${wrapperClass}">
                    <span class="${currentClass}">${formatPriceValue(basePrice)}</span>
                </div>
            `;
        }

        if (Number.isFinite(salePrice)) {
            return `
                <div class="${wrapperClass}">
                    <span class="${currentClass}">${formatPriceValue(salePrice)}</span>
                </div>
            `;
        }

        return fallbackText;
    }

    function renderRating(product, {
        wrapperClass = 'flex items-center gap-1',
        countClass = 'text-xs text-gray-500'
    } = {}) {
        const ratingValue = toNumber(product?.average_rating);
        if (!Number.isFinite(ratingValue) || ratingValue <= 0) return '';
        return `
            <div class="${wrapperClass}">
                <div class="flex">
                    ${generateStarsMarkup(ratingValue)}
                </div>
                <span class="${countClass}">(${product?.review_count || 0})</span>
            </div>
        `;
    }

    function renderOutOfStockOverlay(stockState) {
        if (!stockState || stockState.inStock) return '';
        return `
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span class="text-white text-sm font-semibold">${escapeHtml(stockState.label)}</span>
            </div>
        `;
    }

    function buildWishlistButton(showWishlist, productId, productName) {
        if (!showWishlist || !productId) return '';
        return `
            <button type="button" data-wishlist-toggle="${productId}" class="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-300" aria-label="Add ${productName} to wishlist" title="Save to wishlist">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
            </button>
        `;
    }

    function buildQuickViewButton(showQuickView, target, variant = 'icon', productName = 'product') {
        if (!showQuickView || !target) return '';
        const icon = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z"></path>
            </svg>
        `;

        if (variant === 'pill') {
            return `
                <button type="button" data-quick-view="${target}" class="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-300" aria-label="Quick view ${productName}">
                    ${icon}
                    Quick View
                </button>
            `;
        }

        return `
            <button type="button" data-quick-view="${target}" class="inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-gray-600 transition hover:border-primary-200 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-300" aria-label="Quick view ${productName}">
                ${icon}
            </button>
        `;
    }

    function render(product, options = {}) {
        const {
            showWishlist = true,
            showQuickView = true,
            showRating = true,
            layout = 'grid'
        } = options;

        const productId = product?.id ?? '';
        const productSlug = product?.slug ?? '';
        const productUrl = productSlug ? `/products/${productSlug}/` : '#';
        const productName = escapeHtml(product?.name || 'Untitled product');
        const categorySlug = product?.category?.slug;
        const categoryName = product?.category?.name ? escapeHtml(product.category.name) : '';
        const categoryMarkup = categoryName
            ? (categorySlug
                ? `<a href="/categories/${categorySlug}/" class="text-xs text-gray-500 hover:text-primary-600 transition-colors">${categoryName}</a>`
                : `<span class="text-xs text-gray-500">${categoryName}</span>`)
            : '';
        const shortDescription = product?.short_description ? `<p class="text-gray-600 text-sm leading-relaxed">${escapeHtml(product.short_description)}</p>` : '';
        const imageSrc = escapeHtml(getPrimaryImage(product));
        const discountPercent = computeDiscountPercent(product);
        const badgesMarkup = renderBadges(discountPercent, isProductNew(product));
        const stockState = resolveStockState(product);
        const stockBadgeGrid = renderStockBadge(stockState, 'sm');
        const stockBadgeList = renderStockBadge(stockState, 'lg');
        const overlayMarkup = renderOutOfStockOverlay(stockState);
        const wishlistButton = buildWishlistButton(showWishlist, productId, productName);
        const quickViewTarget = productId || productSlug || '';
        const quickViewIconButton = buildQuickViewButton(showQuickView, quickViewTarget, 'icon', productName);
        const quickViewPillButton = buildQuickViewButton(showQuickView, quickViewTarget, 'pill', productName);
        const ratingGridMarkup = showRating ? renderRating(product, { wrapperClass: 'flex items-center gap-1 mb-2', countClass: 'text-xs text-gray-500' }) : '';
        const ratingListMarkup = showRating ? renderRating(product, { wrapperClass: 'flex items-center gap-2 mb-3', countClass: 'text-sm text-gray-500' }) : '';
        const priceGridMarkup = renderPriceMarkup(product, {
            wrapperClass: 'product-card-price',
            currentClass: 'current',
            originalClass: 'original',
            fallbackText: '<span class="text-sm text-gray-500">Price unavailable</span>'
        });
        const priceListMarkup = renderPriceMarkup(product, {
            wrapperClass: 'flex items-center gap-3',
            currentClass: 'text-2xl font-semibold text-gray-900',
            originalClass: 'text-base text-gray-400 line-through',
            fallbackText: '<span class="text-sm text-gray-500">Price unavailable</span>'
        });
        const hasVariants = Boolean(product?.has_variants || (Array.isArray(product?.variants) && product.variants.length) || (Array.isArray(product?.variant_options) && product.variant_options.length));
        const shouldDisableCart = !hasVariants && !stockState.inStock;
        const rawCartLabel = hasVariants ? 'Select Options' : stockState.inStock ? 'Add to Cart' : (stockState.label || 'Unavailable');
        const cartLabel = escapeHtml(rawCartLabel);
        const cartButtonClass = shouldDisableCart
            ? (layout === 'list'
                ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed'
                : 'flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500 cursor-not-allowed')
            : (layout === 'list'
                ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1'
                : 'flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1');
        const cartAttributes = [];
        if (productId) cartAttributes.push(`data-add-to-cart="${productId}"`);
        if (productSlug) cartAttributes.push(`data-product-slug="${productSlug}"`);
        if (hasVariants) cartAttributes.push('data-has-variants="true"');
        if (shouldDisableCart) {
            cartAttributes.push('disabled');
            cartAttributes.push('aria-disabled="true"');
        }
        const cartAttrString = cartAttributes.length ? ' ' + cartAttributes.join(' ') : '';
        const cartButton = `
            <button type="button" class="${cartButtonClass}"${cartAttrString}>
                ${CART_ICON}
                ${cartLabel}
            </button>
        `;
        const imageMarkup = `
            <div class="relative product-card-image bg-gray-50 overflow-hidden">
                <a href="${productUrl}" class="block w-full h-full">
                    <img src="${imageSrc}" alt="${productName}" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </a>
                ${badgesMarkup}
                ${wishlistButton}
                ${overlayMarkup}
            </div>
        `;
        const cardBaseClass = 'product-card group bg-white rounded-2xl shadow-soft overflow-hidden';
        const cardLayoutClass = layout === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col';
        const cardClass = `${cardBaseClass} ${cardLayoutClass}`;

        if (layout === 'list') {
            return `
                <article class="${cardClass}" data-product-id="${productId}" data-product-slug="${productSlug}">
                    <div class="md:w-64 md:flex-shrink-0">
                        ${imageMarkup}
                    </div>
                    <div class="flex-1 p-6 flex flex-col gap-4">
                        <div>
                            ${categoryMarkup}
                            <a href="${productUrl}">
                                <h3 class="font-semibold text-gray-900 text-lg mb-2 hover:text-primary-600 transition-colors">${productName}</h3>
                            </a>
                            ${shortDescription}
                            ${ratingListMarkup}
                        </div>
                        <div class="flex flex-wrap items-center gap-4">
                            ${priceListMarkup}
                            ${stockBadgeList}
                        </div>
                        <div class="flex flex-wrap gap-3">
                            ${cartButton}
                            ${quickViewPillButton}
                        </div>
                    </div>
                </article>
            `;
        }

        return `
            <article class="${cardClass}" data-product-id="${productId}" data-product-slug="${productSlug}">
                ${imageMarkup}
                <div class="p-4 flex flex-col gap-2">
                    ${categoryMarkup}
                    <h3 class="font-medium text-gray-900 line-clamp-2 mb-1">
                        <a href="${productUrl}" class="hover:text-primary-600 transition-colors">${productName}</a>
                    </h3>
                    ${ratingGridMarkup}
                    <div class="flex items-center justify-between gap-3">
                        ${priceGridMarkup}
                        ${stockBadgeGrid}
                    </div>
                    <div class="mt-3 flex items-center gap-2">
                        ${cartButton}
                        ${quickViewIconButton}
                    </div>
                </div>
            </article>
        `;
    }

    function renderGrid(products, options = {}) {
        if (!products || products.length === 0) {
            return `
                <div class="col-span-full text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            `;
        }

        return products.map(product => render(product, { ...options, layout: 'grid' })).join('');
    }

    function renderList(products, options = {}) {
        if (!products || products.length === 0) {
            return `
                <div class="text-center py-12">
                    <p class="text-gray-500">No products found</p>
                </div>
            `;
        }

        return products.map(product => render(product, { ...options, layout: 'list' })).join('');
    }

    let eventsBound = false;

    function init() {
        if (eventsBound) return;
        eventsBound = true;
        DOM.delegate(document, 'click', '[data-add-to-cart]', async (e, target) => {
            const productId = target.dataset.addToCart;
            const hasVariants = target.dataset.hasVariants === 'true';
            const productSlug = target.dataset.productSlug || target.closest('[data-product-slug]')?.dataset.productSlug;

            if (hasVariants) {
                if (productSlug) {
                    window.location.href = `/products/${productSlug}/`;
                } else {
                    window.location.href = `/products/${productId}/`;
                }
                return;
            }

            target.disabled = true;
            const originalHtml = target.innerHTML;
            target.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>';

            try {
                const response = await CartApi.addItem(productId);
                if (response.success) {
                    Toast.success(response.message || 'Added to cart');
                } else {
                    Toast.error(response.message || 'Failed to add to cart');
                }
            } catch (error) {
                Toast.error(error.message || 'Failed to add to cart');
            } finally {
                target.disabled = false;
                target.innerHTML = originalHtml;
            }
        });

        DOM.delegate(document, 'click', '[data-wishlist-toggle]', async (e, target) => {
            const productId = target.dataset.wishlistToggle;

            if (!AuthApi.isAuthenticated()) {
                Toast.info('Please log in to add items to your wishlist');
                AuthGuard.redirectToLogin();
                return;
            }

            try {
                const response = await WishlistApi.addItem(productId);
                if (response.success) {
                    target.classList.toggle('text-red-500');
                    target.querySelector('svg').classList.toggle('fill-current');
                    Toast.success(response.message || 'Updated wishlist');
                }
            } catch (error) {
                Toast.error(error.message || 'Failed to update wishlist');
            }
        });

        // Quick view is handled by QuickView component via data-quick-view attribute
        // No need to duplicate handler here - QuickView.init() sets up the listener
    }

    function bindEvents() {
        init();
    }

    return {
        render,
        renderGrid,
        renderList,
        init,
        bindEvents
    };
})();

window.ProductCard = ProductCard;

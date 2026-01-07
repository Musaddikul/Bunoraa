/**
 * Cart Page - Enhanced with Advanced E-commerce Features
 * @module pages/cart
 */

const CartPage = (function() {
    'use strict';

    let cart = null;
    let savedForLater = [];
    let abandonedCartTimer = null;
    const ABANDONED_CART_DELAY = 60000; // 1 minute for demo (use 30min in production)

    // Single-currency mode: use server-provided currency via Templates and `window.BUNORAA_CURRENCY`.
    function setActiveCurrency(/* currency */) {
        // No-op in single-currency mode - retained for backward compatibility
    }

    function parseAmount(value) {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        const numeric = parseFloat(value);
        return Number.isFinite(numeric) ? numeric : 0;
    }

    function formatCartPrice(value) {
        const amount = parseAmount(value);
        return Templates.formatPrice(amount);
    }

    async function init() {
        await loadCart();
        initCouponForm();
        initEnhancedFeatures();
    }

    // ============================================
    // ENHANCED FEATURES INITIALIZATION
    // ============================================
    function initEnhancedFeatures() {
        initSavedForLater();
        initAbandonedCartRecovery();
        initFreeShippingProgress();
        initDeliveryEstimate();
        initRecommendedProducts();
        initCartNoteSaver();
        initExpressCheckout();
    }

    // ============================================
    // ENHANCED FEATURE: Saved for Later
    // ============================================
    function initSavedForLater() {
        savedForLater = JSON.parse(localStorage.getItem('savedForLater') || '[]');
        renderSavedForLater();
    }

    function renderSavedForLater() {
        const container = document.getElementById('saved-for-later');
        if (!container) return;

        if (savedForLater.length === 0) {
            container.innerHTML = '';
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        container.innerHTML = `
            <div class="mt-8 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 dark:border-stone-700 flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Saved for Later (${savedForLater.length})</h3>
                    <button id="clear-saved-btn" class="text-sm text-gray-500 dark:text-stone-400 hover:text-gray-700 dark:hover:text-stone-300">Clear All</button>
                </div>
                <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${savedForLater.map(item => `
                        <div class="saved-item" data-product-id="${item.id}">
                            <div class="aspect-square bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden mb-2">
                                <img src="${item.image || '/static/images/placeholder.jpg'}" alt="${Templates.escapeHtml(item.name)}" class="w-full h-full object-cover">
                            </div>
                            <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${Templates.escapeHtml(item.name)}</h4>
                            <p class="text-sm font-semibold text-primary-600 dark:text-amber-400">${formatCartPrice(item.price)}</p>
                            <div class="flex gap-2 mt-2">
                                <button class="move-to-cart-btn flex-1 px-2 py-1 bg-primary-600 dark:bg-amber-600 text-white text-xs font-medium rounded hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">Move to Cart</button>
                                <button class="remove-saved-btn px-2 py-1 text-gray-400 hover:text-red-500">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Bind events
        container.querySelectorAll('.move-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const item = btn.closest('.saved-item');
                const productId = item?.dataset.productId;
                if (!productId) return;

                try {
                    await CartApi.addItem(productId, 1);
                    savedForLater = savedForLater.filter(i => i.id !== productId);
                    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
                    Toast.success('Item moved to cart');
                    await loadCart();
                    renderSavedForLater();
                } catch (error) {
                    Toast.error('Failed to move item to cart');
                }
            });
        });

        container.querySelectorAll('.remove-saved-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.saved-item');
                const productId = item?.dataset.productId;
                if (!productId) return;

                savedForLater = savedForLater.filter(i => i.id !== productId);
                localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
                renderSavedForLater();
                Toast.info('Item removed');
            });
        });

        document.getElementById('clear-saved-btn')?.addEventListener('click', () => {
            savedForLater = [];
            localStorage.removeItem('savedForLater');
            renderSavedForLater();
            Toast.info('Saved items cleared');
        });
    }

    // ============================================
    // ENHANCED FEATURE: Abandoned Cart Recovery
    // ============================================
    function initAbandonedCartRecovery() {
        // Check for existing abandoned cart
        const abandonedCart = JSON.parse(localStorage.getItem('abandonedCart') || 'null');
        
        if (abandonedCart && abandonedCart.items?.length > 0 && (!cart || cart.items?.length === 0)) {
            showAbandonedCartRecovery(abandonedCart);
        }

        // Start tracking for abandonment
        startAbandonedCartTracking();

        // Save cart state on unload
        window.addEventListener('beforeunload', () => {
            if (cart && cart.items?.length > 0) {
                localStorage.setItem('abandonedCart', JSON.stringify({
                    items: cart.items,
                    savedAt: new Date().toISOString()
                }));
            }
        });
    }

    function startAbandonedCartTracking() {
        // Reset timer on user interaction
        const resetTimer = () => {
            if (abandonedCartTimer) clearTimeout(abandonedCartTimer);
            abandonedCartTimer = setTimeout(() => {
                if (cart && cart.items?.length > 0) {
                    showAbandonedCartReminder();
                }
            }, ABANDONED_CART_DELAY);
        };

        ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true, once: false });
        });

        resetTimer();
    }

    function showAbandonedCartRecovery(abandonedCart) {
        const modal = document.createElement('div');
        modal.id = 'abandoned-cart-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('abandoned-cart-modal').remove()"></div>
            <div class="relative bg-white dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <button onclick="document.getElementById('abandoned-cart-modal').remove()" class="absolute top-4 right-4 w-8 h-8 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2">Welcome Back!</h3>
                    <p class="text-stone-600 dark:text-stone-400">You left ${abandonedCart.items.length} item(s) in your cart.</p>
                </div>
                <div class="max-h-48 overflow-y-auto mb-6 space-y-2">
                    ${abandonedCart.items.slice(0, 3).map(item => `
                        <div class="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-700/50 rounded-lg">
                            <img src="${item.product?.image || '/static/images/placeholder.jpg'}" alt="" class="w-12 h-12 rounded object-cover">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-stone-900 dark:text-white truncate">${Templates.escapeHtml(item.product?.name || 'Product')}</p>
                                <p class="text-xs text-stone-500 dark:text-stone-400">Qty: ${item.quantity}</p>
                            </div>
                        </div>
                    `).join('')}
                    ${abandonedCart.items.length > 3 ? `<p class="text-center text-sm text-stone-500 dark:text-stone-400">+${abandonedCart.items.length - 3} more items</p>` : ''}
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="document.getElementById('abandoned-cart-modal').remove(); localStorage.removeItem('abandonedCart');" class="py-3 px-4 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                        Start Fresh
                    </button>
                    <button onclick="document.getElementById('abandoned-cart-modal').remove();" class="py-3 px-4 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-xl hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function showAbandonedCartReminder() {
        // Don't show if already shown this session
        if (sessionStorage.getItem('cartReminderShown')) return;

        Toast.info("Don't forget! You have items in your cart", {
            duration: 8000,
            action: {
                text: 'Checkout',
                onClick: () => window.location.href = '/checkout/'
            }
        });

        sessionStorage.setItem('cartReminderShown', 'true');
    }

    // ============================================
    // ENHANCED FEATURE: Free Shipping Progress
    // ============================================
    function initFreeShippingProgress() {
        updateFreeShippingProgress();
    }

    function updateFreeShippingProgress() {
        const container = document.getElementById('free-shipping-progress');
        if (!container || !cart) return;

        const threshold = 50; // Free shipping threshold
        const subtotal = parseAmount(cart.summary?.subtotal || cart.subtotal || 0);
        const remaining = Math.max(0, threshold - subtotal);
        const progress = Math.min(100, (subtotal / threshold) * 100);

        if (subtotal >= threshold) {
            container.innerHTML = `
                <div class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">🎉 You've unlocked FREE shipping!</span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-amber-700 dark:text-amber-300">Add ${formatCartPrice(remaining)} for FREE shipping</span>
                        <span class="text-amber-600 dark:text-amber-400 font-medium">${Math.round(progress)}%</span>
                    </div>
                    <div class="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                        <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
        }
    }

    // ============================================
    // ENHANCED FEATURE: Delivery Estimate
    // ============================================
    function initDeliveryEstimate() {
        const container = document.getElementById('cart-delivery-estimate');
        if (!container) return;

        const today = new Date();
        const minDays = 3;
        const maxDays = 7;
        const minDate = new Date(today.getTime() + minDays * 24 * 60 * 60 * 1000);
        const maxDate = new Date(today.getTime() + maxDays * 24 * 60 * 60 * 1000);

        const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        container.innerHTML = `
            <div class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                <span>Estimated delivery: <strong class="text-stone-900 dark:text-white">${formatDate(minDate)} - ${formatDate(maxDate)}</strong></span>
            </div>
        `;
    }

    // ============================================
    // ENHANCED FEATURE: Recommended Products
    // ============================================
    async function initRecommendedProducts() {
        const container = document.getElementById('cart-recommendations');
        if (!container || !cart || !cart.items?.length) return;

        try {
            // Get product IDs from cart
            const productIds = cart.items.map(item => item.product?.id).filter(Boolean);
            if (!productIds.length) return;

            // Fetch recommendations (mock - use API in production)
            const response = await ProductsApi.getRelated(productIds[0], { limit: 4 });
            const products = response?.data || response?.results || [];

            if (!products.length) return;

            container.innerHTML = `
                <div class="mt-8">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">You might also like</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${products.slice(0, 4).map(product => `
                            <div class="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 overflow-hidden group">
                                <a href="/products/${product.slug}/" class="block aspect-square bg-gray-100 dark:bg-stone-700 overflow-hidden">
                                    <img src="${product.primary_image || product.image || '/static/images/placeholder.jpg'}" alt="${Templates.escapeHtml(product.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                </a>
                                <div class="p-3">
                                    <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">${Templates.escapeHtml(product.name)}</h4>
                                    <p class="text-sm font-semibold text-primary-600 dark:text-amber-400 mt-1">${formatCartPrice(product.current_price || product.price)}</p>
                                    <button class="quick-add-btn w-full mt-2 py-2 text-xs font-medium text-primary-600 dark:text-amber-400 border border-primary-600 dark:border-amber-400 rounded-lg hover:bg-primary-50 dark:hover:bg-amber-900/20 transition-colors" data-product-id="${product.id}">
                                        + Add to Cart
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Bind quick add buttons
            container.querySelectorAll('.quick-add-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.dataset.productId;
                    btn.disabled = true;
                    btn.textContent = 'Adding...';
                    
                    try {
                        await CartApi.addItem(productId, 1);
                        Toast.success('Added to cart');
                        await loadCart();
                    } catch (error) {
                        Toast.error('Failed to add item');
                    } finally {
                        btn.disabled = false;
                        btn.textContent = '+ Add to Cart';
                    }
                });
            });
        } catch (error) {
            console.warn('Failed to load recommendations:', error);
        }
    }

    // ============================================
    // ENHANCED FEATURE: Cart Note/Gift Message
    // ============================================
    function initCartNoteSaver() {
        const noteInput = document.getElementById('cart-note');
        const giftCheckbox = document.getElementById('gift-order');
        
        if (noteInput) {
            // Load saved note
            const savedNote = localStorage.getItem('cartNote') || '';
            noteInput.value = savedNote;

            // Save on change
            noteInput.addEventListener('input', debounce(() => {
                localStorage.setItem('cartNote', noteInput.value);
            }, 500));
        }

        if (giftCheckbox) {
            const isGift = localStorage.getItem('isGiftOrder') === 'true';
            giftCheckbox.checked = isGift;
            
            giftCheckbox.addEventListener('change', () => {
                localStorage.setItem('isGiftOrder', giftCheckbox.checked);
            });
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // ============================================
    // ENHANCED FEATURE: Express Checkout Buttons
    // ============================================
    function initExpressCheckout() {
        const container = document.getElementById('express-checkout');
        if (!container) return;

        container.innerHTML = `
            <div class="mt-4 space-y-2">
                <p class="text-xs text-center text-stone-500 dark:text-stone-400 mb-3">Or checkout faster with</p>
                <div class="grid grid-cols-2 gap-2">
                    <button class="express-pay-btn flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.27 2.43-2.22 4.38-3.74 4.25z"/></svg>
                        Apple Pay
                    </button>
                    <button class="express-pay-btn flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5f6368] text-white rounded-lg font-medium text-sm hover:bg-[#4a4e52] transition-colors">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        Google Pay
                    </button>
                </div>
            </div>
        `;

        // Bind express checkout buttons (mock - implement payment gateway integration)
        container.querySelectorAll('.express-pay-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Toast.info('Express checkout coming soon!');
            });
        });
    }

    async function loadCart() {
        const container = document.getElementById('cart-container');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await CartApi.getCart();
            cart = response.data;

            renderCart(cart);
        } catch (error) {
            console.error('Failed to load cart:', error);
            container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load cart. Please try again.</p>';
        }
    }

    function renderCart(cartData) {
        const container = document.getElementById('cart-container');
        if (!container) return;

        const items = cartData?.items || [];
        const summary = cartData?.summary || {};
        const subtotalValue = summary.subtotal ?? cartData?.subtotal ?? 0;
        const discountValue = parseAmount(summary.discount_amount ?? cartData?.discount_amount);
        const taxValue = summary.tax_amount ?? cartData?.tax_amount ?? 0;
        const totalValue = summary.total ?? cartData?.total ?? 0;
        const couponCode = cartData?.coupon?.code || '';

        if (items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16">
                    <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p class="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                    <a href="/products/" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        Start Shopping
                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100">
                            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart (${items.length} items)</h2>
                        </div>
                        <div id="cart-items" class="divide-y divide-gray-100">
                            ${items.map(item => renderCartItem(item)).join('')}
                        </div>
                    </div>

                    <!-- Continue Shopping -->
                    <div class="mt-6 flex items-center justify-between">
                        <a href="/products/" class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                            </svg>
                            Continue Shopping
                        </a>
                        <button id="clear-cart-btn" class="text-red-600 hover:text-red-700 font-medium">
                            Clear Cart
                        </button>
                    </div>
                    
                    <!-- Saved for Later -->
                    <div id="saved-for-later"></div>
                    
                    <!-- Recommendations -->
                    <div id="cart-recommendations"></div>
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-gray-100 dark:border-stone-700 p-6 sticky top-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                        
                        <!-- Free Shipping Progress -->
                        <div id="free-shipping-progress" class="mb-4"></div>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-stone-400">Subtotal</span>
                                <span class="font-medium text-gray-900 dark:text-white">${formatCartPrice(subtotalValue)}</span>
                            </div>
                            ${discountValue > 0 ? `
                                <div class="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-${formatCartPrice(discountValue)}</span>
                                </div>
                            ` : ''}
                            ${parseAmount(taxValue) > 0 ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-stone-400">Tax</span>
                                    <span class="font-medium text-gray-900 dark:text-white">${formatCartPrice(taxValue)}</span>
                                </div>
                            ` : ''}
                            <div class="pt-3 border-t border-gray-200 dark:border-stone-600">
                                <div class="flex justify-between">
                                    <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span class="text-base font-bold text-gray-900 dark:text-white">${formatCartPrice(totalValue)}</span>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-stone-400 mt-1">Shipping calculated at checkout</p>
                            </div>
                        </div>
                        
                        <!-- Delivery Estimate -->
                        <div id="cart-delivery-estimate" class="mt-4"></div>

                        <!-- Coupon Form -->
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-stone-600">
                            ${couponCode ? `
                                <div class="flex items-center justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div>
                                        <p class="text-sm font-medium text-green-700 dark:text-green-400">Coupon applied</p>
                                        <p class="text-xs text-green-600 dark:text-green-500">${Templates.escapeHtml(couponCode)}</p>
                                    </div>
                                    <button id="remove-coupon-btn" class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300" aria-label="Remove coupon">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            ` : `
                                <form id="coupon-form" class="flex gap-2">
                                    <input 
                                        type="text" 
                                        id="coupon-code" 
                                        placeholder="Enter coupon code"
                                        class="flex-1 px-3 py-2 border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white rounded-lg text-sm focus:ring-primary-500 dark:focus:ring-amber-500 focus:border-primary-500 dark:focus:border-amber-500"
                                        value="${Templates.escapeHtml(couponCode)}"
                                    >
                                    <button type="submit" class="px-4 py-2 bg-gray-100 dark:bg-stone-700 hover:bg-gray-200 dark:hover:bg-stone-600 text-gray-700 dark:text-stone-200 font-medium rounded-lg transition-colors text-sm">
                                        Apply
                                    </button>
                                </form>
                            `}
                        </div>
                        
                        <!-- Cart Note / Gift Message -->
                        <div class="mt-4">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" id="gift-order" class="rounded border-gray-300 dark:border-stone-600 text-primary-600 dark:text-amber-500 focus:ring-primary-500 dark:focus:ring-amber-500">
                                <span class="text-sm text-gray-700 dark:text-stone-300">This is a gift</span>
                            </label>
                            <textarea 
                                id="cart-note" 
                                placeholder="Add a note or gift message..." 
                                class="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white rounded-lg text-sm focus:ring-primary-500 dark:focus:ring-amber-500 focus:border-primary-500 dark:focus:border-amber-500"
                                rows="2"
                            ></textarea>
                        </div>

                        <!-- Checkout Button -->
                        <a href="${window.BUNORAA_CART && window.BUNORAA_CART.checkoutUrl ? window.BUNORAA_CART.checkoutUrl : '/checkout/'}" class="mt-6 w-full px-6 py-3 bg-primary-600 dark:bg-amber-600 text-white font-semibold rounded-lg hover:bg-primary-700 dark:hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                            Proceed to Checkout
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>
                        
                        <!-- Express Checkout -->
                        <div id="express-checkout"></div>

                        <!-- Trust Badges -->
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-stone-600">
                            <div class="flex items-center justify-center gap-4 text-gray-400 dark:text-stone-500">
                                <div class="flex flex-col items-center">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                    </svg>
                                    <span class="text-xs mt-1">Secure</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                    <span class="text-xs mt-1">Protected</span>
                                </div>
                                <div class="flex flex-col items-center">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                    </svg>
                                    <span class="text-xs mt-1">Easy Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindCartEvents();
        initEnhancedFeatures();
    }

    function renderCartItem(item) {
        const product = item.product || {};
        const variant = item.variant;
        const productSlug = product.slug || '#';
        const productName = product.name || 'Product';
        const productImage = product.primary_image || product.image;
        const priceAtAdd = parseAmount(item.price_at_add);
        const currentPrice = parseAmount(item.current_price);
        const lineTotal = parseAmount(item.line_total) || currentPrice * (item.quantity || 1);
        const showOriginal = priceAtAdd > currentPrice;

        return `
            <div class="cart-item p-6 flex gap-4" data-item-id="${item.id}" data-product-id="${product.id}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-stone-700 rounded-lg overflow-hidden">
                    <a href="/products/${productSlug}/">
                        ${productImage ? `
                        <img 
                            src="${productImage}" 
                            alt="${Templates.escapeHtml(productName)}"
                            class="w-full h-full object-cover"
                            onerror="this.style.display='none'"
                        >` : `
                        <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-stone-500">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>`}
                    </a>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between">
                        <div>
                            <h3 class="font-medium text-gray-900 dark:text-white">
                                <a href="/products/${productSlug}/" class="hover:text-primary-600 dark:hover:text-amber-400">
                                    ${Templates.escapeHtml(productName)}
                                </a>
                            </h3>
                            ${variant ? `
                                <p class="text-sm text-gray-500 dark:text-stone-400 mt-1">${Templates.escapeHtml(variant.name || variant.value)}</p>
                            ` : ''}
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="save-for-later-btn text-gray-400 dark:text-stone-500 hover:text-primary-600 dark:hover:text-amber-400 transition-colors" aria-label="Save for later" title="Save for later">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                            <button class="remove-item-btn text-gray-400 dark:text-stone-500 hover:text-red-500 transition-colors" aria-label="Remove item">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <div class="flex items-center border border-gray-300 dark:border-stone-600 rounded-lg">
                            <button 
                                class="qty-decrease px-3 py-1 text-gray-600 dark:text-stone-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
                            </button>
                            <input 
                                type="number" 
                                class="item-quantity w-12 text-center border-0 bg-transparent dark:text-white focus:ring-0 text-sm"
                                value="${item.quantity}" 
                                min="1" 
                                max="${product.stock_quantity || 99}"
                            >
                            <button 
                                class="qty-increase px-3 py-1 text-gray-600 dark:text-stone-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                                aria-label="Increase quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                        <div class="text-right">
                            ${showOriginal ? `
                                <span class="text-sm text-gray-400 dark:text-stone-500 line-through">${formatCartPrice(priceAtAdd * item.quantity)}</span>
                            ` : ''}
                            <span class="font-semibold text-gray-900 dark:text-white block">${formatCartPrice(lineTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function bindCartEvents() {
        const cartItems = document.getElementById('cart-items');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const removeCouponBtn = document.getElementById('remove-coupon-btn');

        cartItems?.addEventListener('click', async (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const itemId = cartItem.dataset.itemId;
            const productId = cartItem.dataset.productId;
            const qtyInput = cartItem.querySelector('.item-quantity');

            if (e.target.closest('.remove-item-btn')) {
                await removeItem(itemId);
            } else if (e.target.closest('.save-for-later-btn')) {
                await saveForLater(itemId, productId, cartItem);
            } else if (e.target.closest('.qty-decrease')) {
                const current = parseInt(qtyInput.value) || 1;
                if (current > 1) {
                    await updateQuantity(itemId, current - 1);
                }
            } else if (e.target.closest('.qty-increase')) {
                const current = parseInt(qtyInput.value) || 1;
                const max = parseInt(qtyInput.max) || 99;
                if (current < max) {
                    await updateQuantity(itemId, current + 1);
                }
            }
        });

        cartItems?.addEventListener('change', async (e) => {
            if (e.target.classList.contains('item-quantity')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem?.dataset.itemId;
                const quantity = parseInt(e.target.value) || 1;
                
                if (itemId && quantity > 0) {
                    await updateQuantity(itemId, quantity);
                }
            }
        });

        clearCartBtn?.addEventListener('click', async () => {
            const confirmed = await Modal.confirm({
                title: 'Clear Cart',
                message: 'Are you sure you want to remove all items from your cart?',
                confirmText: 'Clear Cart',
                cancelText: 'Cancel'
            });

            if (confirmed) {
                await clearCart();
            }
        });

        removeCouponBtn?.addEventListener('click', async () => {
            await removeCoupon();
        });
    }

    async function updateQuantity(itemId, quantity) {
        try {
            await CartApi.updateItem(itemId, quantity);
            await loadCart();
            document.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (error) {
            Toast.error(error.message || 'Failed to update quantity.');
        }
    }

    async function removeItem(itemId) {
        try {
            await CartApi.removeItem(itemId);
            Toast.success('Item removed from cart.');
            await loadCart();
            document.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (error) {
            Toast.error(error.message || 'Failed to remove item.');
        }
    }

    async function saveForLater(itemId, productId, cartItemElement) {
        try {
            // Find the item in cart
            const item = cart?.items?.find(i => String(i.id) === String(itemId));
            if (!item) return;

            const product = item.product || {};
            
            // Add to saved for later
            const savedItem = {
                id: productId,
                name: product.name || 'Product',
                image: product.primary_image || product.image || '',
                price: item.current_price || product.price || 0
            };

            // Check if already saved
            const existingIndex = savedForLater.findIndex(i => i.id === productId);
            if (existingIndex === -1) {
                savedForLater.push(savedItem);
                localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
            }

            // Remove from cart
            await CartApi.removeItem(itemId);
            Toast.success('Item saved for later');
            await loadCart();
            document.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (error) {
            Toast.error(error.message || 'Failed to save item.');
        }
    }

    async function clearCart() {
        try {
            await CartApi.clearCart();
            Toast.success('Cart cleared.');
            await loadCart();
            document.dispatchEvent(new CustomEvent('cart:updated'));
        } catch (error) {
            Toast.error(error.message || 'Failed to clear cart.');
        }
    }

    function initCouponForm() {
        const form = document.getElementById('coupon-form');
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const codeInput = document.getElementById('coupon-code');
            const code = codeInput?.value.trim();

            if (!code) {
                Toast.error('Please enter a coupon code.');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Applying...';

            try {
                await CartApi.applyCoupon(code);
                Toast.success('Coupon applied!');
                await loadCart();
            } catch (error) {
                Toast.error(error.message || 'Invalid coupon code.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Apply';
            }
        });
    }

    async function removeCoupon() {
        try {
            await CartApi.removeCoupon();
            Toast.success('Coupon removed.');
            await loadCart();
        } catch (error) {
            Toast.error(error.message || 'Failed to remove coupon.');
        }
    }

    function destroy() {
        cart = null;
    }

    return {
        init,
        destroy
    };
})();

window.CartPage = CartPage;
export default CartPage;

/**
 * Cart Page
 * @module pages/cart
 */

const CartPage = (function() {
    'use strict';

    let cart = null;
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
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Subtotal</span>
                                <span class="font-medium text-gray-900">${formatCartPrice(subtotalValue)}</span>
                            </div>
                            ${discountValue > 0 ? `
                                <div class="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${formatCartPrice(discountValue)}</span>
                                </div>
                            ` : ''}
                            ${parseAmount(taxValue) > 0 ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Tax</span>
                                    <span class="font-medium text-gray-900">${formatCartPrice(taxValue)}</span>
                                </div>
                            ` : ''}
                            <div class="pt-3 border-t border-gray-200">
                                <div class="flex justify-between">
                                    <span class="text-base font-semibold text-gray-900">Total</span>
                                    <span class="text-base font-bold text-gray-900">${formatCartPrice(totalValue)}</span>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Shipping calculated at checkout</p>
                            </div>
                        </div>

                        <!-- Coupon Form -->
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            ${couponCode ? `
                                <div class="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg">
                                    <div>
                                        <p class="text-sm font-medium text-green-700">Coupon applied</p>
                                        <p class="text-xs text-green-600">${Templates.escapeHtml(couponCode)}</p>
                                    </div>
                                    <button id="remove-coupon-btn" class="text-green-600 hover:text-green-700" aria-label="Remove coupon">
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
                                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                                        value="${Templates.escapeHtml(couponCode)}"
                                    >
                                    <button type="submit" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                                        Apply
                                    </button>
                                </form>
                            `}
                        </div>

                        <!-- Checkout Button -->
                        <a href="/checkout/" class="mt-6 w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                            Proceed to Checkout
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>

                        <!-- Trust Badges -->
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <div class="flex items-center justify-center gap-4 text-gray-400">
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
    }

    function renderCartItem(item) {
        const product = item.product || {};
        const variant = item.variant;
        const productSlug = product.slug || '#';
        const productName = product.name || 'Product';
        const productImage = product.primary_image || product.image || '/static/images/placeholder.png';
        const priceAtAdd = parseAmount(item.price_at_add);
        const currentPrice = parseAmount(item.current_price);
        const lineTotal = parseAmount(item.line_total) || currentPrice * (item.quantity || 1);
        const showOriginal = priceAtAdd > currentPrice;

        return `
            <div class="cart-item p-6 flex gap-4" data-item-id="${item.id}">
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <a href="/products/${productSlug}/">
                        <img 
                            src="${productImage}" 
                            alt="${Templates.escapeHtml(productName)}"
                            class="w-full h-full object-cover"
                        >
                    </a>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between">
                        <div>
                            <h3 class="font-medium text-gray-900">
                                <a href="/products/${productSlug}/" class="hover:text-primary-600">
                                    ${Templates.escapeHtml(productName)}
                                </a>
                            </h3>
                            ${variant ? `
                                <p class="text-sm text-gray-500 mt-1">${Templates.escapeHtml(variant.name || variant.value)}</p>
                            ` : ''}
                        </div>
                        <button class="remove-item-btn text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove item">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <div class="flex items-center border border-gray-300 rounded-lg">
                            <button 
                                class="qty-decrease px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
                            </button>
                            <input 
                                type="number" 
                                class="item-quantity w-12 text-center border-0 focus:ring-0 text-sm"
                                value="${item.quantity}" 
                                min="1" 
                                max="${product.stock_quantity || 99}"
                            >
                            <button 
                                class="qty-increase px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                aria-label="Increase quantity"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                        <div class="text-right">
                            ${showOriginal ? `
                                <span class="text-sm text-gray-400 line-through">${formatCartPrice(priceAtAdd * item.quantity)}</span>
                            ` : ''}
                            <span class="font-semibold text-gray-900 block">${formatCartPrice(lineTotal)}</span>
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
            const qtyInput = cartItem.querySelector('.item-quantity');

            if (e.target.closest('.remove-item-btn')) {
                await removeItem(itemId);
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

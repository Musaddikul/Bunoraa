/**
 * Cart Page Module
 * Full cart management with quantity updates, coupon application, and checkout navigation.
 */

import { cartService } from '../api/cart.js';
import { Toast } from '../components/toast.js';
import DOM from '../utils/dom.js';

class CartPage {
    constructor() {
        this.cart = null;
        this.isUpdating = false;
        
        this.elements = {
            cartContainer: document.getElementById('cart-container'),
            cartItems: document.getElementById('cart-items'),
            cartEmpty: document.getElementById('cart-empty'),
            cartSummary: document.getElementById('cart-summary'),
            couponForm: document.getElementById('coupon-form'),
            couponInput: document.getElementById('coupon-input'),
            couponApplyBtn: document.getElementById('coupon-apply'),
            couponRemoveBtn: document.getElementById('coupon-remove'),
            appliedCoupon: document.getElementById('applied-coupon'),
            subtotalEl: document.getElementById('cart-subtotal'),
            discountEl: document.getElementById('cart-discount'),
            shippingEl: document.getElementById('cart-shipping'),
            taxEl: document.getElementById('cart-tax'),
            totalEl: document.getElementById('cart-total'),
            checkoutBtn: document.getElementById('checkout-btn'),
            clearCartBtn: document.getElementById('clear-cart'),
        };
    }

    /**
     * Initialize the cart page
     */
    async init() {
        // Subscribe to cart updates
        cartService.subscribe(cart => this.onCartUpdate(cart));
        
        // Load cart
        await this.loadCart();
        
        // Bind events
        this.bindEvents();
    }

    /**
     * Load cart data
     */
    async loadCart() {
        try {
            this.cart = await cartService.fetch();
            this.render();
        } catch (error) {
            console.error('Failed to load cart:', error);
            Toast.show({
                message: 'Failed to load cart',
                type: 'error'
            });
        }
    }

    /**
     * Handle cart update
     */
    onCartUpdate(cart) {
        this.cart = cart;
        this.render();
    }

    /**
     * Render cart
     */
    render() {
        if (!this.cart || this.cart.items?.length === 0) {
            this.renderEmptyCart();
        } else {
            this.renderCartItems();
            this.renderSummary();
        }
    }

    /**
     * Render empty cart state
     */
    renderEmptyCart() {
        if (this.elements.cartItems) {
            this.elements.cartItems.classList.add('hidden');
        }
        if (this.elements.cartSummary) {
            this.elements.cartSummary.classList.add('hidden');
        }
        if (this.elements.cartEmpty) {
            this.elements.cartEmpty.classList.remove('hidden');
            this.elements.cartEmpty.innerHTML = `
                <div class="text-center py-16">
                    <svg class="w-32 h-32 mx-auto text-gray-300 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Your cart is empty</h2>
                    <p class="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <a href="/products/" class="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                        Start Shopping
                    </a>
                </div>
            `;
        }
    }

    /**
     * Render cart items
     */
    renderCartItems() {
        if (!this.elements.cartItems) return;
        
        this.elements.cartItems.classList.remove('hidden');
        if (this.elements.cartEmpty) {
            this.elements.cartEmpty.classList.add('hidden');
        }

        const items = this.cart.items || [];
        
        const html = items.map(item => this.createCartItemHTML(item)).join('');
        
        this.elements.cartItems.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div class="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div class="col-span-6">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Product</span>
                    </div>
                    <div class="col-span-2 text-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Price</span>
                    </div>
                    <div class="col-span-2 text-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity</span>
                    </div>
                    <div class="col-span-2 text-right">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</span>
                    </div>
                </div>
                
                <div class="divide-y divide-gray-200 dark:divide-gray-700">
                    ${html}
                </div>
            </div>
            
            <div class="flex items-center justify-between mt-6">
                <a href="/products/" class="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Continue Shopping
                </a>
                
                <button id="clear-cart" class="text-red-500 hover:text-red-600 font-medium flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Clear Cart
                </button>
            </div>
        `;
    }

    /**
     * Create cart item HTML
     */
    createCartItemHTML(item) {
        const product = item.product || {};
        const variant = item.variant;
        const price = parseFloat(item.price || product.price || 0);
        const lineTotal = price * item.quantity;

        return `
            <div class="cart-item grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center" data-item-id="${item.id}">
                <div class="col-span-1 md:col-span-6">
                    <div class="flex gap-4">
                        <div class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img 
                                src="${product.image || product.images?.[0]?.url || '/static/images/placeholder.jpg'}"
                                alt="${product.name}"
                                class="w-full h-full object-cover"
                            >
                        </div>
                        <div class="flex-grow">
                            <a href="/products/${product.slug}/" class="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-2">
                                ${product.name}
                            </a>
                            ${variant ? `
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    ${variant.attributes?.map(a => `${a.name}: ${a.value}`).join(', ') || ''}
                                </p>
                            ` : ''}
                            ${product.sku ? `
                                <p class="text-xs text-gray-400 mt-1">SKU: ${product.sku}</p>
                            ` : ''}
                            
                            <button 
                                class="remove-item-btn md:hidden mt-2 text-red-500 text-sm hover:text-red-600 flex items-center gap-1"
                                data-item-id="${item.id}"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                    <span class="md:hidden text-sm text-gray-500">Price:</span>
                    <span class="font-medium text-gray-900 dark:text-white">৳${price.toLocaleString()}</span>
                </div>
                
                <div class="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                    <span class="md:hidden text-sm text-gray-500">Quantity:</span>
                    <div class="quantity-control flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button 
                            class="qty-decrease px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            data-item-id="${item.id}"
                            ${item.quantity <= 1 ? 'disabled' : ''}
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                            </svg>
                        </button>
                        <input 
                            type="number" 
                            class="qty-input w-12 text-center border-0 bg-transparent focus:ring-0 text-gray-900 dark:text-white"
                            value="${item.quantity}"
                            min="1"
                            max="${product.stock_quantity || 99}"
                            data-item-id="${item.id}"
                        >
                        <button 
                            class="qty-increase px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            data-item-id="${item.id}"
                            ${item.quantity >= (product.stock_quantity || 99) ? 'disabled' : ''}
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center gap-4">
                    <span class="md:hidden text-sm text-gray-500">Total:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">৳${lineTotal.toLocaleString()}</span>
                    
                    <button 
                        class="remove-item-btn hidden md:block p-2 text-gray-400 hover:text-red-500 transition-colors"
                        data-item-id="${item.id}"
                        aria-label="Remove item"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render cart summary
     */
    renderSummary() {
        if (!this.elements.cartSummary) return;
        
        this.elements.cartSummary.classList.remove('hidden');

        const subtotal = parseFloat(this.cart.subtotal || 0);
        const discount = parseFloat(this.cart.discount_amount || 0);
        const shipping = parseFloat(this.cart.shipping_cost || 0);
        const tax = parseFloat(this.cart.tax_amount || 0);
        const total = parseFloat(this.cart.total || 0);
        const coupon = this.cart.coupon;

        this.elements.cartSummary.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                
                <!-- Coupon Section -->
                <div class="mb-6">
                    ${coupon ? `
                        <div id="applied-coupon" class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span class="font-medium text-green-700 dark:text-green-400">${coupon.code}</span>
                            </div>
                            <button id="coupon-remove" class="text-green-600 hover:text-green-700">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    ` : `
                        <form id="coupon-form" class="flex gap-2">
                            <input 
                                type="text" 
                                id="coupon-input"
                                placeholder="Enter coupon code"
                                class="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                            <button 
                                type="submit"
                                id="coupon-apply"
                                class="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                            >
                                Apply
                            </button>
                        </form>
                    `}
                </div>
                
                <!-- Summary Lines -->
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal (${this.cart.items?.length || 0} items)</span>
                        <span>৳${subtotal.toLocaleString()}</span>
                    </div>
                    
                    ${discount > 0 ? `
                        <div class="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-৳${discount.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span>${shipping > 0 ? `৳${shipping.toLocaleString()}` : 'Calculated at checkout'}</span>
                    </div>
                    
                    ${tax > 0 ? `
                        <div class="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Tax</span>
                            <span>৳${tax.toLocaleString()}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                        <span class="text-2xl font-bold text-gray-900 dark:text-white">৳${total.toLocaleString()}</span>
                    </div>
                </div>
                
                <a 
                    href="/checkout/"
                    id="checkout-btn"
                    class="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                    Proceed to Checkout
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
                
                <!-- Trust Badges -->
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-center gap-4 text-gray-400">
                        <div class="flex items-center gap-1 text-xs">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                            Secure Checkout
                        </div>
                        <div class="flex items-center gap-1 text-xs">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                            100% Protected
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Re-bind events for dynamic elements
        this.bindDynamicEvents();
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Quantity controls - delegate from cart items container
        if (this.elements.cartItems) {
            // Decrease quantity
            this.elements.cartItems.addEventListener('click', async (e) => {
                const btn = e.target.closest('.qty-decrease');
                if (btn && !btn.disabled) {
                    const itemId = btn.dataset.itemId;
                    const input = btn.parentElement.querySelector('.qty-input');
                    const newQty = parseInt(input.value) - 1;
                    if (newQty >= 1) {
                        await this.updateQuantity(itemId, newQty);
                    }
                }
            });

            // Increase quantity
            this.elements.cartItems.addEventListener('click', async (e) => {
                const btn = e.target.closest('.qty-increase');
                if (btn && !btn.disabled) {
                    const itemId = btn.dataset.itemId;
                    const input = btn.parentElement.querySelector('.qty-input');
                    const max = parseInt(input.max) || 99;
                    const newQty = parseInt(input.value) + 1;
                    if (newQty <= max) {
                        await this.updateQuantity(itemId, newQty);
                    }
                }
            });

            // Quantity input change
            this.elements.cartItems.addEventListener('change', async (e) => {
                if (e.target.classList.contains('qty-input')) {
                    const itemId = e.target.dataset.itemId;
                    const newQty = parseInt(e.target.value);
                    const max = parseInt(e.target.max) || 99;
                    
                    if (newQty >= 1 && newQty <= max) {
                        await this.updateQuantity(itemId, newQty);
                    } else {
                        // Reset to previous value
                        await this.loadCart();
                    }
                }
            });

            // Remove item
            this.elements.cartItems.addEventListener('click', async (e) => {
                const btn = e.target.closest('.remove-item-btn');
                if (btn) {
                    const itemId = btn.dataset.itemId;
                    await this.removeItem(itemId);
                }
            });
        }

        // Clear cart - delegate from document since it's dynamically rendered
        document.addEventListener('click', async (e) => {
            if (e.target.closest('#clear-cart')) {
                await this.clearCart();
            }
        });
    }

    /**
     * Bind dynamic event handlers (for elements rendered in summary)
     */
    bindDynamicEvents() {
        // Coupon form
        const couponForm = document.getElementById('coupon-form');
        if (couponForm) {
            couponForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = document.getElementById('coupon-input');
                if (input?.value) {
                    await this.applyCoupon(input.value);
                }
            });
        }

        // Remove coupon
        const removeBtn = document.getElementById('coupon-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', async () => {
                await this.removeCoupon();
            });
        }
    }

    /**
     * Update item quantity
     */
    async updateQuantity(itemId, quantity) {
        if (this.isUpdating) return;
        this.isUpdating = true;

        try {
            await cartService.updateItem(itemId, quantity);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            Toast.show({
                message: 'Failed to update quantity',
                type: 'error'
            });
        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * Remove item from cart
     */
    async removeItem(itemId) {
        try {
            await cartService.removeItem(itemId);
            Toast.show({
                message: 'Item removed from cart',
                type: 'success'
            });
        } catch (error) {
            console.error('Failed to remove item:', error);
            Toast.show({
                message: 'Failed to remove item',
                type: 'error'
            });
        }
    }

    /**
     * Clear cart
     */
    async clearCart() {
        if (!confirm('Are you sure you want to clear your cart?')) return;

        try {
            await cartService.clear();
            Toast.show({
                message: 'Cart cleared',
                type: 'success'
            });
        } catch (error) {
            console.error('Failed to clear cart:', error);
            Toast.show({
                message: 'Failed to clear cart',
                type: 'error'
            });
        }
    }

    /**
     * Apply coupon
     */
    async applyCoupon(code) {
        try {
            await cartService.applyCoupon(code);
        } catch (error) {
            // Error handled by cart service
        }
    }

    /**
     * Remove coupon
     */
    async removeCoupon() {
        try {
            await cartService.removeCoupon();
            Toast.show({
                message: 'Coupon removed',
                type: 'success'
            });
        } catch (error) {
            console.error('Failed to remove coupon:', error);
            Toast.show({
                message: 'Failed to remove coupon',
                type: 'error'
            });
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-container') || document.getElementById('cart-items')) {
        const cartPage = new CartPage();
        cartPage.init();
    }
});

export { CartPage };

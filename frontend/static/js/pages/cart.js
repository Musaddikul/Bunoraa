// frontend/static/js/pages/cart.js
/**
 * Cart Page JavaScript
 */

import { $, $$, delegate } from '../utils/dom.js';
import { formatPrice } from '../utils/helpers.js';
import { cartApi } from '../api/index.js';
import { QuantityInput } from '../components/quantity-input.js';
import toast from '../components/toast.js';
import { setButtonLoading, skeleton } from '../components/loading.js';
import { confirm } from '../components/modal.js';

/**
 * Cart Page class
 */
export class CartPage {
    constructor() {
        this.container = $('#cart-container');
        this.itemsContainer = $('#cart-items');
        this.summaryContainer = $('#cart-summary');
        this.emptyMessage = $('#cart-empty');
        this.couponInput = $('#coupon-code');
        this.couponBtn = $('#apply-coupon-btn');
        this.checkoutBtn = $('#checkout-btn');
        
        this.cart = null;
        this.quantityInputs = new Map();
        
        this.init();
    }
    
    async init() {
        this.bindEvents();
        await this.loadCart();
    }
    
    bindEvents() {
        // Coupon form
        this.couponBtn?.addEventListener('click', () => this.applyCoupon());
        this.couponInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyCoupon();
            }
        });
        
        // Clear cart
        $('#clear-cart-btn')?.addEventListener('click', () => this.clearCart());
        
        // Continue shopping
        $('#continue-shopping-btn')?.addEventListener('click', () => {
            window.location.href = '/products/';
        });
    }
    
    async loadCart() {
        if (this.itemsContainer) {
            this.itemsContainer.innerHTML = `
                <div class="animate-pulse space-y-4">
                    ${skeleton('list-item')}
                    ${skeleton('list-item')}
                    ${skeleton('list-item')}
                </div>
            `;
        }
        
        try {
            const response = await cartApi.getCart();
            
            if (response.success) {
                this.cart = response.data;
                this.render();
            } else {
                this.showError('Failed to load cart');
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
            this.showError('Failed to load cart');
        }
    }
    
    render() {
        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
            this.showEmpty();
            return;
        }
        
        this.showCart();
        this.renderItems();
        this.renderSummary();
        this.updateCartCount();
    }
    
    showEmpty() {
        if (this.emptyMessage) {
            this.emptyMessage.classList.remove('hidden');
        }
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }
    
    showCart() {
        if (this.emptyMessage) {
            this.emptyMessage.classList.add('hidden');
        }
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }
    
    showError(message) {
        if (this.itemsContainer) {
            this.itemsContainer.innerHTML = `
                <div class="text-center py-8 text-red-600">
                    <p>${message}</p>
                    <button class="mt-4 text-primary-600 hover:underline" onclick="location.reload()">
                        Try again
                    </button>
                </div>
            `;
        }
    }
    
    renderItems() {
        if (!this.itemsContainer) return;
        
        this.itemsContainer.innerHTML = this.cart.items.map(item => this.renderItem(item)).join('');
        
        // Initialize quantity inputs
        this.cart.items.forEach(item => {
            const el = this.itemsContainer.querySelector(`[data-item-id="${item.id}"] [data-quantity-input]`);
            if (el) {
                const quantityInput = new QuantityInput(el, {
                    min: 1,
                    max: item.product?.stock_quantity || 99,
                    onChange: (value) => this.updateItemQuantity(item.id, value)
                });
                quantityInput.setValue(item.quantity);
                this.quantityInputs.set(item.id, quantityInput);
            }
        });
        
        // Bind remove buttons
        this.itemsContainer.querySelectorAll('[data-remove-item]').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.removeItem;
                this.removeItem(itemId);
            });
        });
    }
    
    renderItem(item) {
        const hasDiscount = item.product?.compare_price && item.product.compare_price > item.unit_price;
        
        return `
            <div class="cart-item flex gap-4 py-6 border-b border-gray-200" data-item-id="${item.id}">
                <!-- Image -->
                <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                    ${item.product?.image 
                        ? `<img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover">`
                        : '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>'
                    }
                </div>
                
                <!-- Details -->
                <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900">
                        <a href="/products/${item.product?.slug}/" class="hover:text-primary-600">
                            ${item.product?.name || 'Product'}
                        </a>
                    </h3>
                    
                    ${item.variant ? `
                        <p class="text-sm text-gray-500 mt-1">${item.variant.name}</p>
                    ` : ''}
                    
                    <div class="flex items-center gap-2 mt-2">
                        <span class="font-medium text-gray-900">${formatPrice(item.unit_price)}</span>
                        ${hasDiscount ? `
                            <span class="text-sm text-gray-500 line-through">${formatPrice(item.product.compare_price)}</span>
                        ` : ''}
                    </div>
                    
                    <div class="flex items-center gap-4 mt-4">
                        <!-- Quantity -->
                        <div class="flex items-center" data-quantity-input>
                            <button type="button" data-decrease class="w-8 h-8 flex items-center justify-center rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100">−</button>
                            <input type="number" value="${item.quantity}" min="1" max="${item.product?.stock_quantity || 99}" class="w-14 h-8 text-center border-t border-b border-gray-300 focus:outline-none">
                            <button type="button" data-increase class="w-8 h-8 flex items-center justify-center rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100">+</button>
                        </div>
                        
                        <!-- Remove -->
                        <button type="button" data-remove-item="${item.id}" class="text-sm text-red-600 hover:text-red-700 hover:underline">
                            Remove
                        </button>
                        
                        <!-- Move to wishlist -->
                        <button type="button" class="text-sm text-gray-600 hover:text-primary-600 hover:underline" data-move-to-wishlist="${item.id}">
                            Save for later
                        </button>
                    </div>
                </div>
                
                <!-- Line total -->
                <div class="flex-shrink-0 text-right">
                    <p class="font-semibold text-gray-900">${formatPrice(item.total)}</p>
                </div>
            </div>
        `;
    }
    
    renderSummary() {
        if (!this.summaryContainer) return;
        
        const subtotal = this.cart.subtotal || 0;
        const discount = this.cart.discount || 0;
        const shipping = this.cart.shipping || 0;
        const tax = this.cart.tax || 0;
        const total = this.cart.total || subtotal - discount + shipping + tax;
        
        this.summaryContainer.innerHTML = `
            <div class="bg-gray-50 rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Subtotal (${this.cart.items.length} items)</span>
                        <span class="text-gray-900">${formatPrice(subtotal)}</span>
                    </div>
                    
                    ${discount > 0 ? `
                        <div class="flex justify-between text-sm text-green-600">
                            <span>Discount${this.cart.coupon ? ` (${this.cart.coupon.code})` : ''}</span>
                            <span>-${formatPrice(discount)}</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Shipping</span>
                        <span class="text-gray-900">${shipping > 0 ? formatPrice(shipping) : 'Calculated at checkout'}</span>
                    </div>
                    
                    ${tax > 0 ? `
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Tax</span>
                            <span class="text-gray-900">${formatPrice(tax)}</span>
                        </div>
                    ` : ''}
                    
                    <div class="border-t border-gray-200 pt-3 mt-3">
                        <div class="flex justify-between">
                            <span class="text-lg font-semibold text-gray-900">Total</span>
                            <span class="text-lg font-semibold text-gray-900">${formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Coupon -->
                <div class="mt-6">
                    ${this.cart.coupon ? `
                        <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-sm font-medium text-green-800">${this.cart.coupon.code}</span>
                            </div>
                            <button type="button" class="text-sm text-green-700 hover:text-green-800 hover:underline" id="remove-coupon-btn">
                                Remove
                            </button>
                        </div>
                    ` : `
                        <div class="flex gap-2">
                            <input type="text" id="coupon-code" placeholder="Coupon code" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                            <button type="button" id="apply-coupon-btn" class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                Apply
                            </button>
                        </div>
                    `}
                </div>
                
                <!-- Checkout button -->
                <div class="mt-6">
                    <a href="/checkout/" id="checkout-btn" class="block w-full py-3 px-4 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors">
                        Proceed to Checkout
                    </a>
                </div>
                
                <!-- Security badges -->
                <div class="mt-6 flex items-center justify-center gap-4 text-gray-400">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    <span class="text-xs">Secure Checkout</span>
                </div>
            </div>
        `;
        
        // Rebind coupon events
        this.couponInput = $('#coupon-code');
        this.couponBtn = $('#apply-coupon-btn');
        
        this.couponBtn?.addEventListener('click', () => this.applyCoupon());
        this.couponInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyCoupon();
            }
        });
        
        $('#remove-coupon-btn')?.addEventListener('click', () => this.removeCoupon());
    }
    
    updateCartCount() {
        const count = this.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        
        $$('[data-cart-count]').forEach(el => {
            el.textContent = count;
            el.classList.toggle('hidden', count === 0);
        });
    }
    
    async updateItemQuantity(itemId, quantity) {
        try {
            const response = await cartApi.updateItem(itemId, quantity);
            
            if (response.success) {
                this.cart = response.data;
                this.renderSummary();
                this.updateCartCount();
                
                // Update line total
                const item = this.cart.items.find(i => i.id === itemId);
                if (item) {
                    const itemEl = this.itemsContainer.querySelector(`[data-item-id="${itemId}"]`);
                    const totalEl = itemEl?.querySelector('.text-right p');
                    if (totalEl) {
                        totalEl.textContent = formatPrice(item.total);
                    }
                }
            } else {
                toast.error(response.message || 'Failed to update quantity');
                // Revert quantity input
                const input = this.quantityInputs.get(itemId);
                const item = this.cart.items.find(i => i.id === itemId);
                if (input && item) {
                    input.setValue(item.quantity);
                }
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error('Failed to update quantity');
        }
    }
    
    async removeItem(itemId) {
        const confirmed = await confirm('Are you sure you want to remove this item?', 'Remove Item');
        if (!confirmed) return;
        
        try {
            const response = await cartApi.removeItem(itemId);
            
            if (response.success) {
                this.cart = response.data;
                this.render();
                toast.success('Item removed from cart');
            } else {
                toast.error(response.message || 'Failed to remove item');
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
            toast.error('Failed to remove item');
        }
    }
    
    async applyCoupon() {
        const code = this.couponInput?.value?.trim();
        if (!code) {
            toast.error('Please enter a coupon code');
            return;
        }
        
        setButtonLoading(this.couponBtn, true, 'Applying...');
        
        try {
            const response = await cartApi.applyCoupon(code);
            
            if (response.success) {
                this.cart = response.data;
                this.renderSummary();
                toast.success('Coupon applied successfully');
            } else {
                toast.error(response.message || 'Invalid coupon code');
            }
        } catch (error) {
            console.error('Failed to apply coupon:', error);
            toast.error('Failed to apply coupon');
        } finally {
            setButtonLoading(this.couponBtn, false);
        }
    }
    
    async removeCoupon() {
        try {
            const response = await cartApi.removeCoupon();
            
            if (response.success) {
                this.cart = response.data;
                this.renderSummary();
                toast.success('Coupon removed');
            } else {
                toast.error(response.message || 'Failed to remove coupon');
            }
        } catch (error) {
            console.error('Failed to remove coupon:', error);
            toast.error('Failed to remove coupon');
        }
    }
    
    async clearCart() {
        const confirmed = await confirm('Are you sure you want to clear your cart?', 'Clear Cart');
        if (!confirmed) return;
        
        try {
            const response = await cartApi.clearCart();
            
            if (response.success) {
                this.cart = response.data;
                this.render();
                toast.success('Cart cleared');
            } else {
                toast.error(response.message || 'Failed to clear cart');
            }
        } catch (error) {
            console.error('Failed to clear cart:', error);
            toast.error('Failed to clear cart');
        }
    }
}

/**
 * Initialize cart page
 */
export function initCartPage() {
    return new CartPage();
}

export default {
    CartPage,
    initCartPage
};

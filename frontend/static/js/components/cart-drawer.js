// frontend/static/js/components/cart-drawer.js
/**
 * Cart Drawer Component
 * Side panel cart preview
 */

import { $, createElement, addClass, removeClass } from '../utils/dom.js';
import { formatPrice } from '../utils/helpers.js';
import { cartApi } from '../api/index.js';
import toast from './toast.js';

/**
 * Cart Drawer class
 */
export class CartDrawer {
    constructor(options = {}) {
        this.options = {
            id: options.id || 'cart-drawer',
            position: options.position || 'right',
            width: options.width || '400px',
            onCheckout: options.onCheckout || null,
            checkoutUrl: options.checkoutUrl || '/checkout/',
            cartUrl: options.cartUrl || '/cart/',
            currency: options.currency || 'USD',
            locale: options.locale || 'en-US'
        };
        
        this.element = null;
        this.backdrop = null;
        this.isOpen = false;
        this.cart = null;
        
        this.handleEscape = this.handleEscape.bind(this);
        
        this.create();
    }
    
    create() {
        // Backdrop
        this.backdrop = createElement('div', {
            class: 'cart-drawer-backdrop fixed inset-0 bg-black bg-opacity-50 z-40 hidden transition-opacity duration-300 opacity-0',
            onClick: () => this.close()
        });
        
        // Drawer
        this.element = createElement('div', {
            id: this.options.id,
            class: `cart-drawer fixed top-0 ${this.options.position}-0 h-full bg-white z-50 shadow-xl transform transition-transform duration-300 flex flex-col`,
            style: `width: ${this.options.width}; ${this.options.position === 'right' ? 'transform: translateX(100%)' : 'transform: translateX(-100%)'}`
        });
        
        // Header
        const header = createElement('div', {
            class: 'cart-drawer-header flex items-center justify-between p-4 border-b'
        });
        
        const title = createElement('h2', {
            class: 'text-lg font-semibold',
            text: 'Shopping Cart'
        });
        
        this.itemCount = createElement('span', {
            class: 'text-sm text-gray-500 ml-2'
        });
        
        const titleWrapper = createElement('div', { class: 'flex items-center' }, [title, this.itemCount]);
        
        const closeBtn = createElement('button', {
            class: 'p-2 hover:bg-gray-100 rounded-full transition-colors',
            'aria-label': 'Close cart',
            innerHTML: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>`,
            onClick: () => this.close()
        });
        
        header.appendChild(titleWrapper);
        header.appendChild(closeBtn);
        this.element.appendChild(header);
        
        // Body
        this.body = createElement('div', {
            class: 'cart-drawer-body flex-1 overflow-y-auto p-4'
        });
        this.element.appendChild(this.body);
        
        // Footer
        this.footer = createElement('div', {
            class: 'cart-drawer-footer border-t p-4'
        });
        this.element.appendChild(this.footer);
        
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.element);
        
        return this;
    }
    
    async open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        
        // Show backdrop
        this.backdrop.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.backdrop.classList.remove('opacity-0');
            this.backdrop.classList.add('opacity-100');
        });
        
        // Show drawer
        const translateValue = this.options.position === 'right' ? 'translateX(0)' : 'translateX(0)';
        this.element.style.transform = translateValue;
        
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        
        // Keyboard listener
        document.addEventListener('keydown', this.handleEscape);
        
        // Load cart
        await this.refresh();
        
        return this;
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Hide backdrop
        this.backdrop.classList.remove('opacity-100');
        this.backdrop.classList.add('opacity-0');
        setTimeout(() => {
            this.backdrop.classList.add('hidden');
        }, 300);
        
        // Hide drawer
        const translateValue = this.options.position === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
        this.element.style.transform = translateValue;
        
        // Unlock body scroll
        document.body.style.overflow = '';
        
        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleEscape);
        
        return this;
    }
    
    toggle() {
        return this.isOpen ? this.close() : this.open();
    }
    
    handleEscape(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }
    
    async refresh() {
        this.showLoading();
        
        try {
            const response = await cartApi.getCart();
            if (response.success) {
                this.cart = response.data;
                this.render();
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
            this.showError('Failed to load cart');
        }
    }
    
    showLoading() {
        this.body.innerHTML = `
            <div class="flex items-center justify-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        `;
        this.footer.innerHTML = '';
    }
    
    showError(message) {
        this.body.innerHTML = `
            <div class="text-center py-8 text-red-600">
                <p>${message}</p>
                <button class="mt-4 text-primary-600 hover:underline" onclick="this.closest('.cart-drawer').cartDrawer.refresh()">
                    Try again
                </button>
            </div>
        `;
    }
    
    render() {
        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
            this.renderEmpty();
            return;
        }
        
        this.renderItems();
        this.renderFooter();
        this.updateCount();
    }
    
    renderEmpty() {
        this.body.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="text-gray-500 mb-4">Your cart is empty</p>
                <a href="/products/" class="text-primary-600 hover:underline">Continue Shopping</a>
            </div>
        `;
        this.footer.innerHTML = '';
        this.itemCount.textContent = '';
    }
    
    renderItems() {
        this.body.innerHTML = '';
        
        this.cart.items.forEach(item => {
            const itemEl = this.createItemElement(item);
            this.body.appendChild(itemEl);
        });
    }
    
    createItemElement(item) {
        const el = createElement('div', {
            class: 'cart-item flex gap-4 py-4 border-b last:border-0',
            dataset: { itemId: item.id }
        });
        
        // Image
        const imageWrapper = createElement('div', {
            class: 'flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden'
        });
        
        if (item.product?.image) {
            const img = createElement('img', {
                class: 'w-full h-full object-cover',
                src: item.product.image,
                alt: item.product.name
            });
            imageWrapper.appendChild(img);
        }
        el.appendChild(imageWrapper);
        
        // Details
        const details = createElement('div', { class: 'flex-1 min-w-0' });
        
        const name = createElement('a', {
            class: 'font-medium text-gray-900 hover:text-primary-600 line-clamp-2',
            href: `/products/${item.product?.slug}/`,
            text: item.product?.name || 'Product'
        });
        details.appendChild(name);
        
        // Variant info
        if (item.variant) {
            const variant = createElement('p', {
                class: 'text-sm text-gray-500 mt-1',
                text: item.variant.name
            });
            details.appendChild(variant);
        }
        
        // Price
        const price = createElement('p', {
            class: 'text-sm font-medium text-gray-900 mt-1',
            text: formatPrice(item.unit_price, this.options.currency, this.options.locale)
        });
        details.appendChild(price);
        
        // Quantity controls
        const qtyControls = createElement('div', {
            class: 'flex items-center gap-2 mt-2'
        });
        
        const decreaseBtn = createElement('button', {
            class: 'w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 transition-colors',
            'aria-label': 'Decrease quantity',
            text: '−',
            onClick: () => this.updateQuantity(item.id, item.quantity - 1)
        });
        
        const qtyInput = createElement('input', {
            type: 'number',
            class: 'w-12 h-8 text-center border border-gray-300 rounded',
            value: item.quantity,
            min: '1',
            'aria-label': 'Quantity',
            onChange: (e) => this.updateQuantity(item.id, parseInt(e.target.value) || 1)
        });
        
        const increaseBtn = createElement('button', {
            class: 'w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 transition-colors',
            'aria-label': 'Increase quantity',
            text: '+',
            onClick: () => this.updateQuantity(item.id, item.quantity + 1)
        });
        
        qtyControls.appendChild(decreaseBtn);
        qtyControls.appendChild(qtyInput);
        qtyControls.appendChild(increaseBtn);
        details.appendChild(qtyControls);
        
        el.appendChild(details);
        
        // Remove button
        const removeBtn = createElement('button', {
            class: 'flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors',
            'aria-label': 'Remove item',
            innerHTML: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>`,
            onClick: () => this.removeItem(item.id)
        });
        el.appendChild(removeBtn);
        
        return el;
    }
    
    renderFooter() {
        const subtotal = this.cart.subtotal || 0;
        const discount = this.cart.discount || 0;
        const total = this.cart.total || subtotal - discount;
        
        this.footer.innerHTML = `
            <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-medium">${formatPrice(subtotal, this.options.currency, this.options.locale)}</span>
                </div>
                ${discount > 0 ? `
                    <div class="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${formatPrice(discount, this.options.currency, this.options.locale)}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${formatPrice(total, this.options.currency, this.options.locale)}</span>
                </div>
            </div>
            <p class="text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
            <div class="space-y-2">
                <a href="${this.options.checkoutUrl}" class="block w-full py-3 px-4 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors">
                    Checkout
                </a>
                <a href="${this.options.cartUrl}" class="block w-full py-3 px-4 bg-gray-100 text-gray-900 text-center font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    View Cart
                </a>
            </div>
        `;
    }
    
    updateCount() {
        const count = this.cart?.items?.length || 0;
        this.itemCount.textContent = count > 0 ? `(${count})` : '';
        
        // Update header cart count if exists
        const headerCount = $('#cart-count');
        if (headerCount) {
            headerCount.textContent = count;
            headerCount.classList.toggle('hidden', count === 0);
        }
    }
    
    async updateQuantity(itemId, quantity) {
        if (quantity < 1) {
            return this.removeItem(itemId);
        }
        
        try {
            const response = await cartApi.updateItem(itemId, quantity);
            if (response.success) {
                this.cart = response.data;
                this.render();
            } else {
                toast.error(response.message || 'Failed to update quantity');
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error('Failed to update quantity');
        }
    }
    
    async removeItem(itemId) {
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
    
    async addItem(productId, variantId = null, quantity = 1) {
        try {
            const response = await cartApi.addItem(productId, quantity, variantId);
            if (response.success) {
                this.cart = response.data;
                this.render();
                toast.success('Added to cart');
                this.open();
            } else {
                toast.error(response.message || 'Failed to add item');
            }
        } catch (error) {
            console.error('Failed to add item:', error);
            toast.error('Failed to add item');
        }
    }
    
    destroy() {
        this.close();
        this.backdrop?.remove();
        this.element?.remove();
    }
}

// Global cart drawer instance
let cartDrawerInstance = null;

/**
 * Get or create cart drawer instance
 */
export function getCartDrawer(options = {}) {
    if (!cartDrawerInstance) {
        cartDrawerInstance = new CartDrawer(options);
    }
    return cartDrawerInstance;
}

/**
 * Initialize cart drawer triggers
 */
export function initCartDrawer() {
    const drawer = getCartDrawer();
    
    // Cart toggle buttons
    document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            drawer.toggle();
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;
            const variantId = btn.dataset.variantId;
            const quantity = parseInt(btn.dataset.quantity) || 1;
            
            if (productId) {
                await drawer.addItem(productId, variantId, quantity);
            }
        });
    });
    
    // Store reference on element for external access
    drawer.element.cartDrawer = drawer;
    
    return drawer;
}

export default {
    CartDrawer,
    getCartDrawer,
    initCartDrawer
};

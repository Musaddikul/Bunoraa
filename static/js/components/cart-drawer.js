/**
 * Cart Drawer Component
 * Sliding cart drawer with real-time updates.
 */

import { $, $$, createElement, show, hide, fadeIn, fadeOut } from '../utils/dom.js';
import { formatCurrency } from '../utils/format.js';
import cart from '../api/cart.js';

class CartDrawer {
    constructor() {
        this.drawer = null;
        this.backdrop = null;
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.createDrawer();
        this.bindEvents();
        
        // Subscribe to cart updates
        cart.subscribe(() => this.render());
        
        // Initial fetch
        cart.fetch();
    }

    createDrawer() {
        // Backdrop
        this.backdrop = createElement('div', {
            className: 'cart-drawer-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-40 opacity-0 invisible transition-all duration-300'
        });
        this.backdrop.addEventListener('click', () => this.close());

        // Drawer
        this.drawer = createElement('div', {
            className: 'cart-drawer fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform translate-x-full transition-transform duration-300 flex flex-col',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': 'Shopping cart'
        });

        // Header
        const header = createElement('div', {
            className: 'flex items-center justify-between px-6 py-4 border-b border-gray-100'
        });
        header.innerHTML = `
            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button class="cart-drawer-close p-2 -m-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close cart">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
        this.drawer.appendChild(header);

        // Body (scrollable)
        const body = createElement('div', {
            className: 'cart-drawer-body flex-1 overflow-y-auto px-6 py-4'
        });
        this.drawer.appendChild(body);

        // Footer
        const footer = createElement('div', {
            className: 'cart-drawer-footer border-t border-gray-100 px-6 py-4'
        });
        this.drawer.appendChild(footer);

        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.drawer);

        // Close button
        $('.cart-drawer-close', header).addEventListener('click', () => this.close());
    }

    bindEvents() {
        // Open on cart icon click
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-cart-toggle]')) {
                e.preventDefault();
                this.open();
            }
        });

        // Open on cart:open event
        window.addEventListener('cart:open', () => this.open());

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    render() {
        const cartData = cart.getCart();
        const body = $('.cart-drawer-body', this.drawer);
        const footer = $('.cart-drawer-footer', this.drawer);

        if (!cartData || cart.isEmpty()) {
            body.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center py-12">
                    <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p class="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
                    <a href="/shop/" class="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Start Shopping
                    </a>
                </div>
            `;
            footer.innerHTML = '';
            return;
        }

        // Render items
        body.innerHTML = cartData.items.map(item => this.renderItem(item)).join('');

        // Render footer
        footer.innerHTML = `
            <div class="space-y-3 mb-4">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Subtotal</span>
                    <span class="font-medium text-gray-900">${formatCurrency(cartData.subtotal)}</span>
                </div>
                ${cartData.discount ? `
                    <div class="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${formatCurrency(cartData.discount)}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between text-base font-semibold pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>${formatCurrency(cartData.total)}</span>
                </div>
            </div>
            <div class="space-y-3">
                <a href="/checkout/" class="block w-full py-3 px-4 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700 transition-colors">
                    Checkout
                </a>
                <a href="/cart/" class="block w-full py-3 px-4 bg-gray-100 text-gray-700 text-center font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    View Cart
                </a>
            </div>
        `;

        // Bind item events
        this.bindItemEvents();
    }

    renderItem(item) {
        const product = item.product;
        const variant = item.variant;
        const name = variant ? `${product.name} - ${variant.name}` : product.name;
        const image = variant?.image || product.image || product.images?.[0]?.url || '/static/images/placeholder.png';

        return `
            <div class="cart-item flex gap-4 py-4 border-b border-gray-100" data-item-id="${item.id}">
                <a href="/product/${product.slug}/" class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img src="${image}" alt="${product.name}" class="w-full h-full object-cover">
                </a>
                <div class="flex-1 min-w-0">
                    <a href="/product/${product.slug}/" class="block text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors truncate">
                        ${name}
                    </a>
                    <p class="text-sm text-gray-500 mt-1">${formatCurrency(item.unit_price)}</p>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center border border-gray-200 rounded-lg">
                            <button class="cart-item-decrease p-1.5 text-gray-500 hover:text-gray-700 transition-colors" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
                            </button>
                            <span class="px-3 py-1 text-sm font-medium text-gray-900">${item.quantity}</span>
                            <button class="cart-item-increase p-1.5 text-gray-500 hover:text-gray-700 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                        <button class="cart-item-remove p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindItemEvents() {
        $$('.cart-item', this.drawer).forEach(item => {
            const itemId = item.dataset.itemId;
            const currentQty = parseInt($('.px-3', item).textContent);

            $('.cart-item-decrease', item)?.addEventListener('click', async () => {
                if (currentQty > 1) {
                    await cart.updateItem(itemId, currentQty - 1);
                }
            });

            $('.cart-item-increase', item)?.addEventListener('click', async () => {
                await cart.updateItem(itemId, currentQty + 1);
            });

            $('.cart-item-remove', item)?.addEventListener('click', async () => {
                item.style.opacity = '0.5';
                await cart.removeItem(itemId);
            });
        });
    }

    open() {
        if (this.isOpen) return;

        document.body.style.overflow = 'hidden';
        this.backdrop.classList.remove('opacity-0', 'invisible');
        this.backdrop.classList.add('opacity-100', 'visible');
        this.drawer.classList.remove('translate-x-full');
        this.isOpen = true;
    }

    close() {
        if (!this.isOpen) return;

        document.body.style.overflow = '';
        this.backdrop.classList.add('opacity-0', 'invisible');
        this.backdrop.classList.remove('opacity-100', 'visible');
        this.drawer.classList.add('translate-x-full');
        this.isOpen = false;
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }
}

// Export singleton
const cartDrawer = new CartDrawer();
export default cartDrawer;
export { CartDrawer };

/**
 * Product Card Component
 * Renders product cards with quick actions.
 */

import { createElement, $, $$ } from '../utils/dom.js';
import { formatCurrency, ratingStars, truncate } from '../utils/format.js';
import cart from '../api/cart.js';
import wishlist from '../api/wishlist.js';

class ProductCard {
    constructor(product, options = {}) {
        this.product = product;
        this.options = {
            showQuickView: options.showQuickView !== false,
            showWishlist: options.showWishlist !== false,
            showCompare: options.showCompare !== false,
            showRating: options.showRating !== false,
            cardClass: options.cardClass || '',
            imageAspect: options.imageAspect || 'aspect-square',
            ...options
        };
    }

    render() {
        const { product, options } = this;
        const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
        const discount = hasDiscount 
            ? Math.round((1 - product.price / product.compare_at_price) * 100) 
            : 0;

        const card = createElement('div', {
            className: `product-card group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${options.cardClass}`,
            dataset: { productId: product.id }
        });

        // Image container
        const imageWrapper = createElement('div', {
            className: `relative ${options.imageAspect} overflow-hidden bg-gray-100`
        });

        // Product image
        const image = createElement('img', {
            src: product.image || product.images?.[0]?.url || '/static/images/placeholder.png',
            alt: product.name,
            className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
            loading: 'lazy'
        });
        imageWrapper.appendChild(image);

        // Badges
        const badges = createElement('div', {
            className: 'absolute top-3 left-3 flex flex-col gap-2'
        });

        if (hasDiscount) {
            badges.appendChild(createElement('span', {
                className: 'px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded'
            }, [`-${discount}%`]));
        }

        if (product.is_new) {
            badges.appendChild(createElement('span', {
                className: 'px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded'
            }, ['New']));
        }

        if (product.stock_status === 'out_of_stock') {
            badges.appendChild(createElement('span', {
                className: 'px-2 py-1 bg-gray-800 text-white text-xs font-semibold rounded'
            }, ['Sold Out']));
        }

        imageWrapper.appendChild(badges);

        // Quick actions
        const actions = createElement('div', {
            className: 'absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300'
        });

        if (options.showWishlist) {
            const wishlistBtn = this.createActionButton(
                'wishlist',
                this.isInWishlist() ? 'Remove from wishlist' : 'Add to wishlist',
                `<svg class="w-5 h-5" fill="${this.isInWishlist() ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>`
            );
            wishlistBtn.addEventListener('click', () => this.toggleWishlist(wishlistBtn));
            actions.appendChild(wishlistBtn);
        }

        if (options.showQuickView) {
            const quickViewBtn = this.createActionButton('quickview', 'Quick view',
                `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>`
            );
            quickViewBtn.addEventListener('click', () => this.openQuickView());
            actions.appendChild(quickViewBtn);
        }

        if (options.showCompare) {
            const compareBtn = this.createActionButton('compare', 'Add to compare',
                `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>`
            );
            compareBtn.addEventListener('click', () => this.toggleCompare());
            actions.appendChild(compareBtn);
        }

        imageWrapper.appendChild(actions);

        // Link wrapper for image
        const imageLink = createElement('a', {
            href: `/product/${product.slug}/`,
            className: 'block'
        });
        imageLink.appendChild(imageWrapper);
        card.appendChild(imageLink);

        // Content
        const content = createElement('div', {
            className: 'p-4'
        });

        // Category
        if (product.category) {
            content.appendChild(createElement('a', {
                href: `/category/${product.category.slug}/`,
                className: 'text-xs text-gray-500 hover:text-primary-600 transition-colors'
            }, [product.category.name]));
        }

        // Product name
        const nameLink = createElement('a', {
            href: `/product/${product.slug}/`,
            className: 'block mt-1'
        });
        nameLink.appendChild(createElement('h3', {
            className: 'font-medium text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors'
        }, [product.name]));
        content.appendChild(nameLink);

        // Rating
        if (options.showRating && product.rating_average) {
            const ratingDiv = createElement('div', {
                className: 'flex items-center gap-1 mt-2'
            });
            ratingDiv.innerHTML = `
                <div class="flex items-center gap-0.5">${ratingStars(product.rating_average)}</div>
                <span class="text-sm text-gray-500">(${product.review_count || 0})</span>
            `;
            content.appendChild(ratingDiv);
        }

        // Price
        const priceDiv = createElement('div', {
            className: 'flex items-center gap-2 mt-3'
        });

        priceDiv.appendChild(createElement('span', {
            className: 'text-lg font-bold text-gray-900'
        }, [formatCurrency(product.price)]));

        if (hasDiscount) {
            priceDiv.appendChild(createElement('span', {
                className: 'text-sm text-gray-400 line-through'
            }, [formatCurrency(product.compare_at_price)]));
        }

        content.appendChild(priceDiv);

        // Add to cart button
        if (product.stock_status !== 'out_of_stock') {
            const addToCartBtn = createElement('button', {
                className: 'w-full mt-4 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2',
                type: 'button'
            });
            addToCartBtn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Add to Cart
            `;
            addToCartBtn.addEventListener('click', () => this.addToCart(addToCartBtn));
            content.appendChild(addToCartBtn);
        } else {
            content.appendChild(createElement('button', {
                className: 'w-full mt-4 py-2.5 px-4 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed',
                disabled: true,
                type: 'button'
            }, ['Out of Stock']));
        }

        card.appendChild(content);

        return card;
    }

    createActionButton(action, title, iconHtml) {
        const btn = createElement('button', {
            className: 'p-2 bg-white rounded-full shadow-md hover:bg-primary-600 hover:text-white text-gray-600 transition-all',
            type: 'button',
            title,
            dataset: { action }
        });
        btn.innerHTML = iconHtml;
        return btn;
    }

    isInWishlist() {
        return wishlist.hasItem(this.product.id);
    }

    async toggleWishlist(btn) {
        try {
            await wishlist.toggle(this.product.id);
            const inWishlist = this.isInWishlist();
            btn.querySelector('svg').setAttribute('fill', inWishlist ? 'currentColor' : 'none');
            btn.title = inWishlist ? 'Remove from wishlist' : 'Add to wishlist';
        } catch (error) {
            if (error.status === 401) {
                window.location.href = '/login/?next=' + encodeURIComponent(window.location.pathname);
            }
        }
    }

    async addToCart(btn) {
        const originalContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
        `;

        try {
            await cart.addItem(this.product.id);
            btn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Added!
            `;
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
            }, 2000);
        } catch (error) {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    }

    openQuickView() {
        window.dispatchEvent(new CustomEvent('quickview:open', {
            detail: { productId: this.product.id, slug: this.product.slug }
        }));
    }

    toggleCompare() {
        const { compareList } = require('../utils/storage.js');
        if (compareList.has(this.product.id)) {
            compareList.remove(this.product.id);
        } else {
            compareList.add(this.product.id);
        }
    }
}

/**
 * Render product grid
 * @param {Element} container 
 * @param {Array} products 
 * @param {Object} options 
 */
export function renderProductGrid(container, products, options = {}) {
    container.innerHTML = '';
    
    const grid = createElement('div', {
        className: options.gridClass || 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
    });

    products.forEach(product => {
        const card = new ProductCard(product, options);
        grid.appendChild(card.render());
    });

    container.appendChild(grid);
}

export default ProductCard;
export { ProductCard };

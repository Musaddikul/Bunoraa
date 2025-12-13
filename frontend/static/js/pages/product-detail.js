// frontend/static/js/pages/product-detail.js
/**
 * Product Detail Page JavaScript
 */

import { $, $$, delegate } from '../utils/dom.js';
import { formatPrice } from '../utils/helpers.js';
import { productsApi, cartApi } from '../api/index.js';
import { QuantityInput } from '../components/quantity-input.js';
import { openGallery } from '../components/image-gallery.js';
import { Tabs } from '../components/tabs.js';
import { getCartDrawer } from '../components/cart-drawer.js';
import toast from '../components/toast.js';
import { setButtonLoading, skeleton } from '../components/loading.js';

/**
 * Product Detail class
 */
export class ProductDetail {
    constructor(productId) {
        this.productId = productId;
        this.product = null;
        this.selectedVariant = null;
        this.quantity = 1;
        
        this.mainImage = $('#product-main-image');
        this.thumbnails = $('#product-thumbnails');
        this.priceDisplay = $('#product-price');
        this.comparePriceDisplay = $('#product-compare-price');
        this.stockDisplay = $('#product-stock');
        this.addToCartBtn = $('#add-to-cart-btn');
        this.buyNowBtn = $('#buy-now-btn');
        this.quantityInput = null;
        this.variantSelectors = $$('[data-variant-selector]');
        this.reviewsContainer = $('#product-reviews');
        
        this.init();
    }
    
    async init() {
        // Initialize quantity input
        const quantityEl = $('#product-quantity');
        if (quantityEl) {
            this.quantityInput = new QuantityInput(quantityEl, {
                onChange: (value) => this.quantity = value
            });
        }
        
        // Initialize tabs
        const tabsEl = $('#product-tabs');
        if (tabsEl) {
            new Tabs(tabsEl);
        }
        
        // Bind event listeners
        this.bindEvents();
        
        // Load product data if not embedded in page
        if (this.productId && !this.product) {
            await this.loadProduct();
        }
        
        // Load reviews
        await this.loadReviews();
    }
    
    bindEvents() {
        // Thumbnail clicks
        delegate(this.thumbnails, 'click', '[data-thumbnail]', (e, target) => {
            this.setMainImage(target.dataset.image, target.dataset.alt);
            
            // Update active state
            this.thumbnails.querySelectorAll('[data-thumbnail]').forEach(thumb => {
                thumb.classList.toggle('ring-2', thumb === target);
                thumb.classList.toggle('ring-primary-500', thumb === target);
            });
        });
        
        // Main image click - open gallery
        this.mainImage?.addEventListener('click', () => {
            const images = Array.from(this.thumbnails.querySelectorAll('[data-thumbnail]')).map(thumb => ({
                src: thumb.dataset.image,
                alt: thumb.dataset.alt
            }));
            
            if (images.length > 0) {
                openGallery(images);
            }
        });
        
        // Variant selectors
        this.variantSelectors.forEach(selector => {
            selector.addEventListener('change', () => this.handleVariantChange());
            
            // For button-style selectors
            delegate(selector, 'click', '[data-variant-value]', (e, target) => {
                selector.querySelectorAll('[data-variant-value]').forEach(btn => {
                    btn.classList.toggle('ring-2', btn === target);
                    btn.classList.toggle('ring-primary-500', btn === target);
                    btn.classList.toggle('bg-primary-50', btn === target);
                });
                selector.dataset.value = target.dataset.variantValue;
                this.handleVariantChange();
            });
        });
        
        // Add to cart
        this.addToCartBtn?.addEventListener('click', () => this.addToCart());
        
        // Buy now
        this.buyNowBtn?.addEventListener('click', () => this.buyNow());
        
        // Wishlist
        $('#add-to-wishlist')?.addEventListener('click', () => this.addToWishlist());
        
        // Share buttons
        delegate(document, 'click', '[data-share]', (e, target) => {
            e.preventDefault();
            this.share(target.dataset.share);
        });
    }
    
    async loadProduct() {
        try {
            const response = await productsApi.getBySlug(this.productId);
            if (response.success) {
                this.product = response.data;
                this.updateDisplay();
            }
        } catch (error) {
            console.error('Failed to load product:', error);
        }
    }
    
    handleVariantChange() {
        const selectedOptions = {};
        
        this.variantSelectors.forEach(selector => {
            const optionName = selector.dataset.optionName;
            const value = selector.value || selector.dataset.value;
            if (optionName && value) {
                selectedOptions[optionName] = value;
            }
        });
        
        // Find matching variant
        if (this.product?.variants) {
            this.selectedVariant = this.product.variants.find(variant => {
                return Object.entries(selectedOptions).every(([name, value]) => {
                    return variant.options?.[name] === value;
                });
            });
            
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        const data = this.selectedVariant || this.product;
        if (!data) return;
        
        // Update price
        if (this.priceDisplay) {
            this.priceDisplay.textContent = formatPrice(data.price);
        }
        
        if (this.comparePriceDisplay) {
            if (data.compare_price && data.compare_price > data.price) {
                this.comparePriceDisplay.textContent = formatPrice(data.compare_price);
                this.comparePriceDisplay.classList.remove('hidden');
            } else {
                this.comparePriceDisplay.classList.add('hidden');
            }
        }
        
        // Update stock
        if (this.stockDisplay) {
            const inStock = data.stock_quantity > 0 || data.in_stock !== false;
            this.stockDisplay.innerHTML = inStock
                ? `<span class="text-green-600">In Stock</span>${data.stock_quantity ? ` (${data.stock_quantity} available)` : ''}`
                : '<span class="text-red-600">Out of Stock</span>';
        }
        
        // Update buttons
        const inStock = data.stock_quantity > 0 || data.in_stock !== false;
        if (this.addToCartBtn) {
            this.addToCartBtn.disabled = !inStock;
        }
        if (this.buyNowBtn) {
            this.buyNowBtn.disabled = !inStock;
        }
        
        // Update quantity max
        if (this.quantityInput && data.stock_quantity) {
            this.quantityInput.setMax(data.stock_quantity);
        }
        
        // Update image if variant has image
        if (this.selectedVariant?.image) {
            this.setMainImage(this.selectedVariant.image, this.selectedVariant.name);
        }
        
        // Update SKU
        const skuDisplay = $('#product-sku');
        if (skuDisplay && data.sku) {
            skuDisplay.textContent = data.sku;
        }
    }
    
    setMainImage(src, alt = '') {
        if (this.mainImage) {
            this.mainImage.src = src;
            this.mainImage.alt = alt;
        }
    }
    
    async addToCart() {
        if (!this.productId) return;
        
        setButtonLoading(this.addToCartBtn, true, 'Adding...');
        
        try {
            const cartDrawer = getCartDrawer();
            await cartDrawer.addItem(
                this.productId,
                this.selectedVariant?.id,
                this.quantity
            );
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('Failed to add to cart');
        } finally {
            setButtonLoading(this.addToCartBtn, false);
        }
    }
    
    async buyNow() {
        if (!this.productId) return;
        
        setButtonLoading(this.buyNowBtn, true, 'Processing...');
        
        try {
            const response = await cartApi.addItem(
                this.productId,
                this.quantity,
                this.selectedVariant?.id
            );
            
            if (response.success) {
                window.location.href = '/checkout/';
            } else {
                toast.error(response.message || 'Failed to process');
            }
        } catch (error) {
            console.error('Failed to buy now:', error);
            toast.error('Failed to process');
        } finally {
            setButtonLoading(this.buyNowBtn, false);
        }
    }
    
    async addToWishlist() {
        if (!this.productId) return;
        
        try {
            // TODO: Implement wishlist API
            toast.success('Added to wishlist');
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
            toast.error('Failed to add to wishlist');
        }
    }
    
    share(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.product?.name || document.title);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
            email: `mailto:?subject=${title}&body=${url}`,
            copy: null
        };
        
        if (platform === 'copy') {
            navigator.clipboard.writeText(window.location.href).then(() => {
                toast.success('Link copied to clipboard');
            });
        } else if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }
    
    async loadReviews() {
        if (!this.reviewsContainer || !this.productId) return;
        
        this.reviewsContainer.innerHTML = `
            <div class="space-y-4">
                ${skeleton('list-item')}
                ${skeleton('list-item')}
                ${skeleton('list-item')}
            </div>
        `;
        
        try {
            const response = await productsApi.getReviews(this.productId);
            
            if (response.success) {
                this.renderReviews(response.data.results || []);
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
            this.reviewsContainer.innerHTML = '<p class="text-gray-500">Failed to load reviews</p>';
        }
    }
    
    renderReviews(reviews) {
        if (reviews.length === 0) {
            this.reviewsContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500 mb-4">No reviews yet</p>
                    <button type="button" class="text-primary-600 hover:underline" id="write-review-btn">
                        Be the first to write a review
                    </button>
                </div>
            `;
            return;
        }
        
        this.reviewsContainer.innerHTML = `
            <div class="space-y-6">
                ${reviews.map(review => this.renderReview(review)).join('')}
            </div>
        `;
    }
    
    renderReview(review) {
        return `
            <div class="review border-b border-gray-200 pb-6 last:border-0">
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0">
                        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                            ${review.user?.first_name?.[0] || review.user?.email?.[0] || 'A'}
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium">${review.user?.first_name || 'Anonymous'}</span>
                            ${review.verified_purchase ? `
                                <span class="text-xs text-green-600 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                    </svg>
                                    Verified Purchase
                                </span>
                            ` : ''}
                        </div>
                        <div class="flex items-center gap-2 mb-2">
                            <div class="flex text-yellow-400">
                                ${this.renderStars(review.rating)}
                            </div>
                            <span class="text-sm text-gray-500">${new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        ${review.title ? `<h4 class="font-medium mb-1">${review.title}</h4>` : ''}
                        <p class="text-gray-600">${review.comment}</p>
                        
                        ${review.images?.length > 0 ? `
                            <div class="flex gap-2 mt-3">
                                ${review.images.map(img => `
                                    <img src="${img.image}" alt="Review image" class="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80" data-gallery="review-${review.id}" data-src="${img.image}">
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <button type="button" class="flex items-center gap-1 hover:text-primary-600" data-vote="helpful" data-review-id="${review.id}">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                Helpful (${review.helpful_count || 0})
                            </button>
                            <button type="button" class="hover:text-primary-600" data-report-review="${review.id}">
                                Report
                            </button>
                        </div>
                        
                        ${review.response ? `
                            <div class="mt-4 pl-4 border-l-2 border-primary-200 bg-primary-50 rounded-r p-3">
                                <p class="text-sm font-medium text-primary-800 mb-1">Store Response:</p>
                                <p class="text-sm text-primary-700">${review.response.response}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderStars(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                html += '<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
            } else {
                html += '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
            }
        }
        return html;
    }
}

/**
 * Initialize product detail page
 */
export function initProductDetail(productId) {
    return new ProductDetail(productId);
}

export default {
    ProductDetail,
    initProductDetail
};

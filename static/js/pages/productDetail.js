/**
 * Product Detail Page Module
 * Full product detail with gallery, variants, reviews, and add to cart.
 */

import { productsApi } from '../api/products.js';
import { cartService } from '../api/cart.js';
import { wishlistService } from '../api/wishlist.js';
import { Toast } from '../components/toast.js';
import { LazyLoad } from '../components/lazyload.js';

class ProductDetailPage {
    constructor() {
        this.product = null;
        this.selectedVariant = null;
        this.selectedQuantity = 1;
        this.selectedAttributes = {};
        this.gallery = null;

        this.elements = {
            productContainer: document.getElementById('product-detail'),
            galleryMain: document.getElementById('gallery-main'),
            galleryThumbs: document.getElementById('gallery-thumbs'),
            productInfo: document.getElementById('product-info'),
            variantSelector: document.getElementById('variant-selector'),
            quantityInput: document.getElementById('quantity-input'),
            addToCartBtn: document.getElementById('add-to-cart'),
            buyNowBtn: document.getElementById('buy-now'),
            wishlistBtn: document.getElementById('wishlist-btn'),
            priceDisplay: document.getElementById('price-display'),
            stockStatus: document.getElementById('stock-status'),
            tabs: document.getElementById('product-tabs'),
            tabContent: document.getElementById('tab-content'),
            reviewsContainer: document.getElementById('reviews-container'),
            relatedProducts: document.getElementById('related-products'),
        };
    }

    /**
     * Initialize product detail page
     */
    async init() {
        const productSlug = this.getProductSlug();
        if (!productSlug) return;

        try {
            // Load product data
            await this.loadProduct(productSlug);

            // Initialize components
            this.initGallery();
            this.initVariants();
            this.initTabs();
            this.initQuantity();
            this.bindEvents();

            // Load related products
            this.loadRelatedProducts(productSlug);

            // Track view
            productsApi.trackView(productSlug);

        } catch (error) {
            console.error('Failed to initialize product page:', error);
            Toast.show({ message: 'Failed to load product', type: 'error' });
        }
    }

    /**
     * Get product slug from URL or data attribute
     */
    getProductSlug() {
        const container = document.getElementById('product-detail');
        if (container?.dataset.productSlug) {
            return container.dataset.productSlug;
        }

        // Extract from URL
        const match = window.location.pathname.match(/\/products\/([^/]+)/);
        return match ? match[1] : null;
    }

    /**
     * Load product data
     */
    async loadProduct(slug) {
        this.product = await productsApi.getProduct(slug);
        this.renderProduct();
    }

    /**
     * Render product details
     */
    renderProduct() {
        if (!this.product) return;

        // Update page title
        document.title = `${this.product.name} | Bunoraa`;

        // Render gallery
        this.renderGallery();

        // Render product info
        this.renderProductInfo();

        // Render tabs
        this.renderTabs();

        // Update structured data
        this.updateStructuredData();
    }

    /**
     * Render image gallery
     */
    renderGallery() {
        const images = this.product.images || [];
        const mainImage = images[0]?.url || this.product.image || '/static/images/placeholder.jpg';

        if (this.elements.galleryMain) {
            this.elements.galleryMain.innerHTML = `
                <div class="swiper gallery-main rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div class="swiper-wrapper">
                        ${images.length > 0 ? images.map((img, index) => `
                            <div class="swiper-slide">
                                <img 
                                    src="${img.url}"
                                    alt="${img.alt || this.product.name}"
                                    class="w-full h-full object-contain cursor-zoom-in"
                                    data-index="${index}"
                                >
                            </div>
                        `).join('') : `
                            <div class="swiper-slide">
                                <img 
                                    src="${mainImage}"
                                    alt="${this.product.name}"
                                    class="w-full h-full object-contain"
                                >
                            </div>
                        `}
                    </div>
                    ${images.length > 1 ? `
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    ` : ''}
                </div>
            `;
        }

        if (this.elements.galleryThumbs && images.length > 1) {
            this.elements.galleryThumbs.innerHTML = `
                <div class="swiper gallery-thumbs mt-4">
                    <div class="swiper-wrapper">
                        ${images.map((img, index) => `
                            <div class="swiper-slide cursor-pointer rounded-lg overflow-hidden opacity-60 transition-opacity hover:opacity-100" data-index="${index}">
                                <img 
                                    src="${img.url}"
                                    alt="${img.alt || this.product.name}"
                                    class="w-full h-20 object-cover"
                                >
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render product info section
     */
    renderProductInfo() {
        if (!this.elements.productInfo) return;

        const discount = this.product.compare_at_price
            ? Math.round((1 - this.product.price / this.product.compare_at_price) * 100)
            : 0;

        const inStock = this.product.stock_quantity > 0 || !this.product.track_inventory;

        this.elements.productInfo.innerHTML = `
            <!-- Breadcrumbs -->
            <nav class="text-sm mb-4">
                <ol class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <li><a href="/" class="hover:text-primary-600">Home</a></li>
                    <li>/</li>
                    ${this.product.category?.breadcrumbs?.map(crumb => `
                        <li><a href="${crumb.url}" class="hover:text-primary-600">${crumb.name}</a></li>
                        <li>/</li>
                    `).join('') || ''}
                    <li class="text-gray-900 dark:text-white">${this.product.name}</li>
                </ol>
            </nav>

            <!-- Product Name -->
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ${this.product.name}
            </h1>

            <!-- Brand -->
            ${this.product.brand ? `
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                    Brand: <a href="/brands/${this.product.brand.slug}/" class="text-primary-600 hover:underline">${this.product.brand.name}</a>
                </p>
            ` : ''}

            <!-- Rating -->
            ${this.product.average_rating ? `
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex">
                        ${[1,2,3,4,5].map(i => `
                            <svg class="w-5 h-5 ${i <= Math.round(this.product.average_rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <span class="text-gray-600 dark:text-gray-400">
                        ${this.product.average_rating.toFixed(1)} (${this.product.review_count || 0} reviews)
                    </span>
                </div>
            ` : ''}

            <!-- Price -->
            <div id="price-display" class="mb-6">
                <div class="flex items-center gap-3">
                    <span class="text-3xl font-bold text-gray-900 dark:text-white">
                        ৳${parseFloat(this.product.price).toLocaleString()}
                    </span>
                    ${this.product.compare_at_price ? `
                        <span class="text-xl text-gray-400 line-through">
                            ৳${parseFloat(this.product.compare_at_price).toLocaleString()}
                        </span>
                        <span class="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                            -${discount}%
                        </span>
                    ` : ''}
                </div>
                ${this.product.is_taxable ? `
                    <p class="text-sm text-gray-500 mt-1">Tax included</p>
                ` : ''}
            </div>

            <!-- Short Description -->
            ${this.product.short_description ? `
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                    ${this.product.short_description}
                </p>
            ` : ''}

            <!-- Variants -->
            <div id="variant-selector" class="mb-6">
                ${this.renderVariantSelectors()}
            </div>

            <!-- Quantity -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                <div class="flex items-center gap-4">
                    <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button 
                            id="qty-decrease"
                            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                            </svg>
                        </button>
                        <input 
                            type="number" 
                            id="quantity-input"
                            value="${this.selectedQuantity}"
                            min="1"
                            max="${this.product.stock_quantity || 99}"
                            class="w-16 text-center border-0 bg-transparent focus:ring-0 text-gray-900 dark:text-white"
                        >
                        <button 
                            id="qty-increase"
                            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Stock Status -->
                    <div id="stock-status">
                        ${inStock ? `
                            <span class="flex items-center gap-1 text-green-600">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                In Stock ${this.product.stock_quantity && this.product.stock_quantity <= 10 ? `(${this.product.stock_quantity} left)` : ''}
                            </span>
                        ` : `
                            <span class="flex items-center gap-1 text-red-600">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                Out of Stock
                            </span>
                        `}
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 mb-8">
                <button 
                    id="add-to-cart"
                    class="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${!inStock ? 'disabled' : ''}
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Add to Cart
                </button>
                
                <button 
                    id="buy-now"
                    class="flex-1 flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${!inStock ? 'disabled' : ''}
                >
                    Buy Now
                </button>
                
                <button 
                    id="wishlist-btn"
                    class="p-4 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${this.product.in_wishlist ? 'text-red-500' : ''}"
                >
                    <svg class="w-6 h-6" fill="${this.product.in_wishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                </button>
            </div>

            <!-- Product Meta -->
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
                <p><span class="font-medium">SKU:</span> ${this.product.sku}</p>
                <p><span class="font-medium">Category:</span> 
                    <a href="/category/${this.product.category?.slug}/" class="text-primary-600 hover:underline">
                        ${this.product.category?.name || 'Uncategorized'}
                    </a>
                </p>
                ${this.product.tags?.length ? `
                    <p><span class="font-medium">Tags:</span> 
                        ${this.product.tags.map(tag => `
                            <a href="/products/?tag=${tag.slug}" class="text-primary-600 hover:underline">${tag.name}</a>
                        `).join(', ')}
                    </p>
                ` : ''}
            </div>

            <!-- Share Buttons -->
            <div class="flex items-center gap-4 mt-6">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Share:</span>
                <div class="flex gap-2">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                       target="_blank" 
                       class="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(this.product.name)}" 
                       target="_blank" 
                       class="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
                    </a>
                    <a href="https://wa.me/?text=${encodeURIComponent(this.product.name + ' ' + window.location.href)}" 
                       target="_blank" 
                       class="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <button 
                        onclick="navigator.clipboard.writeText('${window.location.href}'); alert('Link copied!');"
                        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render variant selectors
     */
    renderVariantSelectors() {
        const variants = this.product.variants || [];
        const attributes = this.product.attributes || [];

        if (attributes.length === 0 && variants.length === 0) {
            return '';
        }

        return attributes.map(attr => `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ${attr.name}: <span class="font-normal">${this.selectedAttributes[attr.slug] || 'Select'}</span>
                </label>
                <div class="flex flex-wrap gap-2">
                    ${attr.values.map(value => {
                        const isSelected = this.selectedAttributes[attr.slug] === value.value;
                        const isColor = attr.slug === 'color' && value.color_code;
                        
                        return isColor ? `
                            <button 
                                class="variant-btn w-10 h-10 rounded-full border-2 transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-primary-500' : 'border-gray-300 dark:border-gray-600'}"
                                style="background-color: ${value.color_code}"
                                data-attribute="${attr.slug}"
                                data-value="${value.value}"
                                title="${value.value}"
                            ></button>
                        ` : `
                            <button 
                                class="variant-btn px-4 py-2 border-2 rounded-lg transition-all ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}"
                                data-attribute="${attr.slug}"
                                data-value="${value.value}"
                            >
                                ${value.value}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    /**
     * Render tabs
     */
    renderTabs() {
        if (!this.elements.tabs || !this.elements.tabContent) return;

        const tabs = [
            { id: 'description', label: 'Description', active: true },
            { id: 'specifications', label: 'Specifications' },
            { id: 'reviews', label: `Reviews (${this.product.review_count || 0})` },
            { id: 'shipping', label: 'Shipping & Returns' },
        ];

        this.elements.tabs.innerHTML = `
            <div class="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                ${tabs.map(tab => `
                    <button 
                        class="tab-btn px-6 py-3 font-medium whitespace-nowrap transition-colors ${tab.active 
                            ? 'text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }"
                        data-tab="${tab.id}"
                    >
                        ${tab.label}
                    </button>
                `).join('')}
            </div>
        `;

        this.renderTabContent('description');
    }

    /**
     * Render tab content
     */
    renderTabContent(tabId) {
        if (!this.elements.tabContent) return;

        let content = '';

        switch (tabId) {
            case 'description':
                content = `
                    <div class="prose dark:prose-invert max-w-none">
                        ${this.product.description || '<p>No description available.</p>'}
                    </div>
                `;
                break;

            case 'specifications':
                const specs = this.product.specifications || [];
                content = specs.length > 0 ? `
                    <table class="w-full">
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            ${specs.map(spec => `
                                <tr>
                                    <td class="py-3 pr-4 font-medium text-gray-900 dark:text-white w-1/3">${spec.name}</td>
                                    <td class="py-3 text-gray-600 dark:text-gray-400">${spec.value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p class="text-gray-500">No specifications available.</p>';
                break;

            case 'reviews':
                content = `<div id="reviews-container">Loading reviews...</div>`;
                this.loadReviews();
                break;

            case 'shipping':
                content = `
                    <div class="space-y-6">
                        <div>
                            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Shipping Information</h4>
                            <p class="text-gray-600 dark:text-gray-400">
                                We ship to all areas across Bangladesh. Standard delivery takes 3-5 business days for Dhaka and 5-7 business days for other areas.
                            </p>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Return Policy</h4>
                            <p class="text-gray-600 dark:text-gray-400">
                                We accept returns within 7 days of delivery. Items must be unused and in original packaging. Please contact our support team to initiate a return.
                            </p>
                        </div>
                    </div>
                `;
                break;
        }

        this.elements.tabContent.innerHTML = content;
    }

    /**
     * Load product reviews
     */
    async loadReviews() {
        try {
            const response = await productsApi.getProductReviews(this.product.slug);
            const reviews = response.results || response;
            this.renderReviews(reviews);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        }
    }

    /**
     * Render reviews
     */
    renderReviews(reviews) {
        const container = document.getElementById('reviews-container');
        if (!container) return;

        const reviewsHtml = reviews.length > 0 ? reviews.map(review => `
            <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-0 last:mb-0">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 flex items-center justify-center font-semibold">
                            ${review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">${review.user?.name || 'Anonymous'}</p>
                            <p class="text-sm text-gray-500">${new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    ${review.verified ? `
                        <span class="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">Verified Purchase</span>
                    ` : ''}
                </div>
                <div class="flex mb-2">
                    ${[1,2,3,4,5].map(i => `
                        <svg class="w-4 h-4 ${i <= review.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                    `).join('')}
                </div>
                <p class="text-gray-600 dark:text-gray-400">${review.comment}</p>
            </div>
        `).join('') : '<p class="text-gray-500">No reviews yet. Be the first to review this product!</p>';

        container.innerHTML = `
            <div class="space-y-6">
                ${reviewsHtml}
                
                <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h4>
                    <form id="review-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                            <div class="flex gap-1" id="rating-stars">
                                ${[1,2,3,4,5].map(i => `
                                    <button type="button" class="rating-star text-2xl text-gray-300 hover:text-yellow-400 transition-colors" data-rating="${i}">★</button>
                                `).join('')}
                            </div>
                            <input type="hidden" name="rating" id="rating-input" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
                            <textarea 
                                name="comment" 
                                rows="4" 
                                required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                placeholder="Share your experience with this product..."
                            ></textarea>
                        </div>
                        <button type="submit" class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Bind rating stars
        container.querySelectorAll('.rating-star').forEach(star => {
            star.addEventListener('click', () => this.setRating(parseInt(star.dataset.rating)));
        });

        // Bind review form
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => this.submitReview(e));
        }
    }

    /**
     * Set rating
     */
    setRating(rating) {
        document.getElementById('rating-input').value = rating;
        document.querySelectorAll('.rating-star').forEach((star, index) => {
            star.classList.toggle('text-yellow-400', index < rating);
            star.classList.toggle('text-gray-300', index >= rating);
        });
    }

    /**
     * Submit review
     */
    async submitReview(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        try {
            await productsApi.submitReview(this.product.slug, {
                rating: parseInt(formData.get('rating')),
                comment: formData.get('comment')
            });

            Toast.show({ message: 'Review submitted! It will be visible after approval.', type: 'success' });
            form.reset();
            this.loadReviews();

        } catch (error) {
            Toast.show({ message: 'Failed to submit review', type: 'error' });
        }
    }

    /**
     * Load related products
     */
    async loadRelatedProducts(slug) {
        if (!this.elements.relatedProducts) return;

        try {
            const response = await productsApi.getRelatedProducts(slug, 4);
            const products = response.results || response;
            this.renderRelatedProducts(products);
        } catch (error) {
            console.error('Failed to load related products:', error);
        }
    }

    /**
     * Render related products
     */
    renderRelatedProducts(products) {
        if (!this.elements.relatedProducts || products.length === 0) return;

        const productsHtml = products.map(product => `
            <div class="product-card group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <a href="/products/${product.slug}/" class="block">
                    <div class="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <img 
                            src="${product.image || '/static/images/placeholder.jpg'}"
                            alt="${product.name}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        >
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                            ${product.name}
                        </h3>
                        <p class="text-lg font-bold text-gray-900 dark:text-white mt-2">
                            ৳${parseFloat(product.price).toLocaleString()}
                        </p>
                    </div>
                </a>
            </div>
        `).join('');

        this.elements.relatedProducts.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${productsHtml}
            </div>
        `;
    }

    /**
     * Initialize gallery
     */
    initGallery() {
        if (typeof Swiper === 'undefined') return;

        const galleryThumbs = new Swiper('.gallery-thumbs', {
            slidesPerView: 4,
            spaceBetween: 10,
            watchSlidesProgress: true,
        });

        this.gallery = new Swiper('.gallery-main', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: galleryThumbs,
            },
        });
    }

    /**
     * Initialize variants
     */
    initVariants() {
        // Pre-select first variant if available
        const firstVariant = this.product.variants?.[0];
        if (firstVariant) {
            this.selectedVariant = firstVariant;
        }
    }

    /**
     * Initialize tabs
     */
    initTabs() {
        // Already bound in renderTabs
    }

    /**
     * Initialize quantity controls
     */
    initQuantity() {
        // Bound in bindEvents
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Quantity controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('#qty-decrease')) {
                this.updateQuantity(-1);
            }
            if (e.target.closest('#qty-increase')) {
                this.updateQuantity(1);
            }
        });

        // Quantity input
        document.addEventListener('change', (e) => {
            if (e.target.id === 'quantity-input') {
                const value = parseInt(e.target.value) || 1;
                this.selectedQuantity = Math.max(1, Math.min(value, this.product.stock_quantity || 99));
                e.target.value = this.selectedQuantity;
            }
        });

        // Variant buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.variant-btn');
            if (btn) {
                const attr = btn.dataset.attribute;
                const value = btn.dataset.value;
                this.selectAttribute(attr, value);
            }
        });

        // Add to cart
        document.addEventListener('click', async (e) => {
            if (e.target.closest('#add-to-cart')) {
                await this.addToCart();
            }
        });

        // Buy now
        document.addEventListener('click', async (e) => {
            if (e.target.closest('#buy-now')) {
                await this.buyNow();
            }
        });

        // Wishlist
        document.addEventListener('click', async (e) => {
            if (e.target.closest('#wishlist-btn')) {
                await this.toggleWishlist();
            }
        });

        // Tabs
        document.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('.tab-btn');
            if (tabBtn) {
                const tabId = tabBtn.dataset.tab;
                this.switchTab(tabId);
            }
        });

        // Image zoom (click to open lightbox)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cursor-zoom-in')) {
                // Could implement lightbox here
            }
        });
    }

    /**
     * Update quantity
     */
    updateQuantity(delta) {
        const newQty = this.selectedQuantity + delta;
        const max = this.product.stock_quantity || 99;
        
        if (newQty >= 1 && newQty <= max) {
            this.selectedQuantity = newQty;
            const input = document.getElementById('quantity-input');
            if (input) input.value = this.selectedQuantity;
        }
    }

    /**
     * Select variant attribute
     */
    selectAttribute(attribute, value) {
        this.selectedAttributes[attribute] = value;
        
        // Find matching variant
        if (this.product.variants?.length) {
            this.selectedVariant = this.product.variants.find(v => 
                v.attributes.every(a => this.selectedAttributes[a.name] === a.value)
            );
            
            // Update price and stock
            if (this.selectedVariant) {
                this.updatePriceDisplay(this.selectedVariant.price, this.selectedVariant.compare_at_price);
                this.updateStockStatus(this.selectedVariant.stock_quantity);
            }
        }
        
        // Re-render variant selectors
        const selector = document.getElementById('variant-selector');
        if (selector) {
            selector.innerHTML = this.renderVariantSelectors();
        }
    }

    /**
     * Update price display
     */
    updatePriceDisplay(price, comparePrice) {
        const display = document.getElementById('price-display');
        if (!display) return;

        const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0;

        display.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-3xl font-bold text-gray-900 dark:text-white">
                    ৳${parseFloat(price).toLocaleString()}
                </span>
                ${comparePrice ? `
                    <span class="text-xl text-gray-400 line-through">
                        ৳${parseFloat(comparePrice).toLocaleString()}
                    </span>
                    <span class="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                        -${discount}%
                    </span>
                ` : ''}
            </div>
        `;
    }

    /**
     * Update stock status
     */
    updateStockStatus(stock) {
        const status = document.getElementById('stock-status');
        const addToCart = document.getElementById('add-to-cart');
        const buyNow = document.getElementById('buy-now');
        
        const inStock = stock > 0 || !this.product.track_inventory;

        if (status) {
            status.innerHTML = inStock ? `
                <span class="flex items-center gap-1 text-green-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    In Stock ${stock && stock <= 10 ? `(${stock} left)` : ''}
                </span>
            ` : `
                <span class="flex items-center gap-1 text-red-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Out of Stock
                </span>
            `;
        }

        if (addToCart) {
            addToCart.disabled = !inStock;
            addToCart.classList.toggle('opacity-50', !inStock);
            addToCart.classList.toggle('cursor-not-allowed', !inStock);
        }

        if (buyNow) {
            buyNow.disabled = !inStock;
            buyNow.classList.toggle('opacity-50', !inStock);
            buyNow.classList.toggle('cursor-not-allowed', !inStock);
        }
    }

    /**
     * Switch tab
     */
    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('text-primary-600', btn.dataset.tab === tabId);
            btn.classList.toggle('border-b-2', btn.dataset.tab === tabId);
            btn.classList.toggle('border-primary-600', btn.dataset.tab === tabId);
            btn.classList.toggle('text-gray-500', btn.dataset.tab !== tabId);
        });

        // Render content
        this.renderTabContent(tabId);
    }

    /**
     * Add to cart
     */
    async addToCart() {
        try {
            await cartService.addItem(
                this.product.id,
                this.selectedVariant?.id,
                this.selectedQuantity
            );
        } catch (error) {
            Toast.show({ message: 'Failed to add to cart', type: 'error' });
        }
    }

    /**
     * Buy now
     */
    async buyNow() {
        try {
            await cartService.addItem(
                this.product.id,
                this.selectedVariant?.id,
                this.selectedQuantity
            );
            window.location.href = '/checkout/';
        } catch (error) {
            Toast.show({ message: 'Failed to add to cart', type: 'error' });
        }
    }

    /**
     * Toggle wishlist
     */
    async toggleWishlist() {
        try {
            const result = await wishlistService.toggle(this.product.id);
            const btn = document.getElementById('wishlist-btn');
            const svg = btn.querySelector('svg');
            
            if (result.added) {
                svg.setAttribute('fill', 'currentColor');
                btn.classList.add('text-red-500');
                Toast.show({ message: 'Added to wishlist', type: 'success' });
            } else {
                svg.setAttribute('fill', 'none');
                btn.classList.remove('text-red-500');
                Toast.show({ message: 'Removed from wishlist', type: 'success' });
            }
        } catch (error) {
            Toast.show({ message: 'Please login to add items to wishlist', type: 'error' });
        }
    }

    /**
     * Update structured data for SEO
     */
    updateStructuredData() {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: this.product.name,
            description: this.product.short_description || '',
            image: this.product.images?.map(i => i.url) || [this.product.image],
            sku: this.product.sku,
            brand: {
                '@type': 'Brand',
                name: this.product.brand?.name || 'Bunoraa'
            },
            offers: {
                '@type': 'Offer',
                url: window.location.href,
                priceCurrency: 'BDT',
                price: this.product.price,
                availability: this.product.stock_quantity > 0 
                    ? 'https://schema.org/InStock' 
                    : 'https://schema.org/OutOfStock'
            },
            aggregateRating: this.product.average_rating ? {
                '@type': 'AggregateRating',
                ratingValue: this.product.average_rating,
                reviewCount: this.product.review_count || 0
            } : undefined
        });
        document.head.appendChild(script);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-detail')) {
        const productDetail = new ProductDetailPage();
        productDetail.init();
    }
});

export { ProductDetailPage };

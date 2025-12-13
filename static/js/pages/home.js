/**
 * Home Page Module
 * Handles home page functionality including featured products, categories, and banners.
 */

import { productsApi } from '../api/products.js';
import { categoriesApi } from '../api/categories.js';
import { storefrontApi } from '../api/storefront.js';
import { Toast } from '../components/toast.js';
import { Slider } from '../components/slider.js';
import { LazyLoad } from '../components/lazyload.js';

class HomePage {
    constructor() {
        this.bannerSlider = null;
        this.featuredProducts = [];
        this.newArrivals = [];
        this.categories = [];
        
        this.elements = {
            bannerContainer: document.getElementById('hero-banners'),
            featuredGrid: document.getElementById('featured-products'),
            newArrivalsGrid: document.getElementById('new-arrivals'),
            categoriesGrid: document.getElementById('shop-by-category'),
            testimonialsSlider: document.getElementById('testimonials'),
        };
    }

    /**
     * Initialize the home page
     */
    async init() {
        try {
            // Load all data in parallel
            await Promise.all([
                this.loadBanners(),
                this.loadFeaturedProducts(),
                this.loadNewArrivals(),
                this.loadCategories(),
            ]);

            // Initialize components
            this.initSliders();
            this.initLazyLoad();
            this.bindEvents();

        } catch (error) {
            console.error('Failed to initialize home page:', error);
            Toast.show({
                message: 'Failed to load page content',
                type: 'error'
            });
        }
    }

    /**
     * Load hero banners
     */
    async loadBanners() {
        try {
            const response = await storefrontApi.getBanners();
            this.renderBanners(response.results || response);
        } catch (error) {
            console.error('Failed to load banners:', error);
        }
    }

    /**
     * Render hero banners
     */
    renderBanners(banners) {
        if (!this.elements.bannerContainer || !banners.length) return;

        const html = banners.map((banner, index) => `
            <div class="banner-slide swiper-slide relative" data-banner-id="${banner.id}">
                <a href="${banner.link || '#'}" class="block relative aspect-[21/9] md:aspect-[3/1]">
                    <img 
                        src="${banner.image}" 
                        alt="${banner.alt_text || banner.title}"
                        class="w-full h-full object-cover"
                        loading="${index === 0 ? 'eager' : 'lazy'}"
                    >
                    ${banner.title || banner.subtitle ? `
                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                            <div class="container mx-auto px-6">
                                <div class="max-w-lg text-white">
                                    ${banner.title ? `<h2 class="text-3xl md:text-5xl font-bold mb-4">${banner.title}</h2>` : ''}
                                    ${banner.subtitle ? `<p class="text-lg md:text-xl mb-6 opacity-90">${banner.subtitle}</p>` : ''}
                                    ${banner.button_text ? `
                                        <a href="${banner.link || '#'}" class="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors">
                                            ${banner.button_text}
                                            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                            </svg>
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </a>
            </div>
        `).join('');

        this.elements.bannerContainer.innerHTML = `
            <div class="swiper hero-swiper">
                <div class="swiper-wrapper">${html}</div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        `;
    }

    /**
     * Load featured products
     */
    async loadFeaturedProducts() {
        try {
            const response = await productsApi.getFeaturedProducts(8);
            this.featuredProducts = response.results || response;
            this.renderProducts(this.featuredProducts, this.elements.featuredGrid);
        } catch (error) {
            console.error('Failed to load featured products:', error);
        }
    }

    /**
     * Load new arrivals
     */
    async loadNewArrivals() {
        try {
            const response = await productsApi.getNewArrivals(8);
            this.newArrivals = response.results || response;
            this.renderProducts(this.newArrivals, this.elements.newArrivalsGrid);
        } catch (error) {
            console.error('Failed to load new arrivals:', error);
        }
    }

    /**
     * Load categories
     */
    async loadCategories() {
        try {
            const response = await categoriesApi.getFeaturedCategories();
            this.categories = response.results || response;
            this.renderCategories(this.categories);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    /**
     * Render products grid
     */
    renderProducts(products, container) {
        if (!container || !products.length) return;

        const html = products.map(product => this.createProductCard(product)).join('');
        container.innerHTML = html;
    }

    /**
     * Create product card HTML
     */
    createProductCard(product) {
        const discount = product.compare_at_price 
            ? Math.round((1 - product.price / product.compare_at_price) * 100)
            : 0;

        return `
            <div class="product-card group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden" data-product-id="${product.id}">
                <div class="relative aspect-square overflow-hidden">
                    <a href="/products/${product.slug}/" class="block">
                        <img 
                            data-src="${product.image || product.images?.[0]?.url || '/static/images/placeholder.jpg'}"
                            alt="${product.name}"
                            class="lazy-image w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        >
                    </a>
                    
                    ${discount > 0 ? `
                        <span class="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                            -${discount}%
                        </span>
                    ` : ''}
                    
                    ${product.is_new ? `
                        <span class="absolute top-3 ${discount > 0 ? 'left-20' : 'left-3'} px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                            New
                        </span>
                    ` : ''}
                    
                    <div class="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="flex gap-2 justify-center">
                            <button 
                                class="quick-view-btn p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                data-product-slug="${product.slug}"
                                aria-label="Quick view"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                            </button>
                            <button 
                                class="add-to-cart-btn p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                                data-product-id="${product.id}"
                                aria-label="Add to cart"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </button>
                            <button 
                                class="wishlist-btn p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                data-product-id="${product.id}"
                                aria-label="Add to wishlist"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="p-4">
                    <a href="/products/${product.slug}/" class="block">
                        <h3 class="font-medium text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                            ${product.name}
                        </h3>
                    </a>
                    
                    ${product.category ? `
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ${product.category.name}
                        </p>
                    ` : ''}
                    
                    <div class="flex items-center justify-between mt-3">
                        <div class="flex items-center gap-2">
                            <span class="text-lg font-bold text-gray-900 dark:text-white">
                                ৳${parseFloat(product.price).toLocaleString()}
                            </span>
                            ${product.compare_at_price ? `
                                <span class="text-sm text-gray-400 line-through">
                                    ৳${parseFloat(product.compare_at_price).toLocaleString()}
                                </span>
                            ` : ''}
                        </div>
                        
                        ${product.rating ? `
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span class="text-sm text-gray-600 dark:text-gray-400">${product.rating.toFixed(1)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render categories grid
     */
    renderCategories(categories) {
        if (!this.elements.categoriesGrid || !categories.length) return;

        const html = categories.map(category => `
            <a href="/category/${category.slug}/" class="group relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img 
                    data-src="${category.image || '/static/images/category-placeholder.jpg'}"
                    alt="${category.name}"
                    class="lazy-image w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div class="absolute bottom-0 inset-x-0 p-6">
                    <h3 class="text-xl font-bold text-white mb-1">${category.name}</h3>
                    <p class="text-sm text-gray-200">${category.product_count || 0} Products</p>
                </div>
            </a>
        `).join('');

        this.elements.categoriesGrid.innerHTML = html;
    }

    /**
     * Initialize sliders
     */
    initSliders() {
        // Hero banner slider
        if (document.querySelector('.hero-swiper')) {
            this.bannerSlider = new Swiper('.hero-swiper', {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                }
            });
        }
    }

    /**
     * Initialize lazy loading
     */
    initLazyLoad() {
        LazyLoad.init();
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Quick view buttons
        document.addEventListener('click', (e) => {
            const quickViewBtn = e.target.closest('.quick-view-btn');
            if (quickViewBtn) {
                e.preventDefault();
                const slug = quickViewBtn.dataset.productSlug;
                this.showQuickView(slug);
            }
        });

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (addToCartBtn) {
                e.preventDefault();
                const productId = addToCartBtn.dataset.productId;
                this.addToCart(productId);
            }
        });

        // Wishlist buttons
        document.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            if (wishlistBtn) {
                e.preventDefault();
                const productId = wishlistBtn.dataset.productId;
                this.toggleWishlist(productId, wishlistBtn);
            }
        });
    }

    /**
     * Show product quick view modal
     */
    async showQuickView(slug) {
        const { QuickViewModal } = await import('../components/quickViewModal.js');
        QuickViewModal.show(slug);
    }

    /**
     * Add product to cart
     */
    async addToCart(productId) {
        const { cartService } = await import('../api/cart.js');
        await cartService.addItem(productId);
    }

    /**
     * Toggle wishlist
     */
    async toggleWishlist(productId, button) {
        const { wishlistService } = await import('../api/wishlist.js');
        const result = await wishlistService.toggle(productId);
        
        if (result.added) {
            button.querySelector('svg').setAttribute('fill', 'currentColor');
            button.classList.add('text-red-500');
        } else {
            button.querySelector('svg').setAttribute('fill', 'none');
            button.classList.remove('text-red-500');
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const homePage = new HomePage();
    homePage.init();
});

export { HomePage };

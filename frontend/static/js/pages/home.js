// frontend/static/js/pages/home.js
/**
 * Homepage JavaScript
 */

import { $, $$ } from '../utils/dom.js';
import { productsApi } from '../api/index.js';
import { formatPrice, storage } from '../utils/helpers.js';
import { skeleton, skeletonGrid } from '../components/loading.js';
import toast from '../components/toast.js';

/**
 * Homepage class
 */
export class HomePage {
    constructor() {
        this.featuredContainer = $('#featured-products');
        this.newArrivalsContainer = $('#new-arrivals');
        this.bestSellersContainer = $('#best-sellers');
        this.saleContainer = $('#sale-products');
        
        this.init();
    }
    
    async init() {
        // Load sections in parallel
        await Promise.all([
            this.loadFeaturedProducts(),
            this.loadNewArrivals(),
            this.loadBestSellers(),
            this.loadSaleProducts()
        ]);
        
        // Initialize hero slider if exists
        this.initHeroSlider();
        
        // Initialize countdown timers
        this.initCountdowns();
        
        // Newsletter form
        this.initNewsletter();
    }
    
    async loadFeaturedProducts() {
        if (!this.featuredContainer) return;
        
        this.featuredContainer.innerHTML = skeletonGrid('product-card', 4, 4);
        
        try {
            const response = await productsApi.getFeatured(4);
            if (response.success && response.data.length > 0) {
                this.renderProductGrid(this.featuredContainer, response.data);
            } else {
                this.featuredContainer.closest('section')?.classList.add('hidden');
            }
        } catch (error) {
            console.error('Failed to load featured products:', error);
            this.featuredContainer.innerHTML = '<p class="text-center text-gray-500">Failed to load products</p>';
        }
    }
    
    async loadNewArrivals() {
        if (!this.newArrivalsContainer) return;
        
        this.newArrivalsContainer.innerHTML = skeletonGrid('product-card', 4, 4);
        
        try {
            const response = await productsApi.getNew(4);
            if (response.success && response.data.length > 0) {
                this.renderProductGrid(this.newArrivalsContainer, response.data);
            } else {
                this.newArrivalsContainer.closest('section')?.classList.add('hidden');
            }
        } catch (error) {
            console.error('Failed to load new arrivals:', error);
            this.newArrivalsContainer.innerHTML = '<p class="text-center text-gray-500">Failed to load products</p>';
        }
    }
    
    async loadBestSellers() {
        if (!this.bestSellersContainer) return;
        
        this.bestSellersContainer.innerHTML = skeletonGrid('product-card', 4, 4);
        
        try {
            const response = await productsApi.getBestSellers(4);
            if (response.success && response.data.length > 0) {
                this.renderProductGrid(this.bestSellersContainer, response.data);
            } else {
                this.bestSellersContainer.closest('section')?.classList.add('hidden');
            }
        } catch (error) {
            console.error('Failed to load best sellers:', error);
            this.bestSellersContainer.innerHTML = '<p class="text-center text-gray-500">Failed to load products</p>';
        }
    }
    
    async loadSaleProducts() {
        if (!this.saleContainer) return;
        
        this.saleContainer.innerHTML = skeletonGrid('product-card', 4, 4);
        
        try {
            const response = await productsApi.getOnSale(4);
            if (response.success && response.data.length > 0) {
                this.renderProductGrid(this.saleContainer, response.data);
            } else {
                this.saleContainer.closest('section')?.classList.add('hidden');
            }
        } catch (error) {
            console.error('Failed to load sale products:', error);
            this.saleContainer.innerHTML = '<p class="text-center text-gray-500">Failed to load products</p>';
        }
    }
    
    renderProductGrid(container, products) {
        container.innerHTML = products.map(product => this.renderProductCard(product)).join('');
        
        // Bind add to cart buttons
        container.querySelectorAll('[data-add-to-cart]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Cart drawer handles this
            });
        });
        
        // Bind wishlist buttons
        container.querySelectorAll('[data-wishlist-add]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const productId = btn.dataset.productId;
                // TODO: Add to wishlist
                toast.success('Added to wishlist');
            });
        });
    }
    
    renderProductCard(product) {
        const hasDiscount = product.compare_price && product.compare_price > product.price;
        const discountPercent = hasDiscount 
            ? Math.round((1 - product.price / product.compare_price) * 100) 
            : 0;
        
        return `
            <div class="product-card group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div class="relative aspect-square overflow-hidden bg-gray-100">
                    <a href="/products/${product.slug}/">
                        ${product.image 
                            ? `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">`
                            : '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>'
                        }
                    </a>
                    
                    ${hasDiscount ? `
                        <span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -${discountPercent}%
                        </span>
                    ` : ''}
                    
                    ${product.is_new ? `
                        <span class="absolute top-2 ${hasDiscount ? 'left-14' : 'left-2'} bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                            NEW
                        </span>
                    ` : ''}
                    
                    <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" class="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors" data-wishlist-add data-product-id="${product.id}" aria-label="Add to wishlist">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button type="button" class="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors" data-quick-view data-product-id="${product.id}" aria-label="Quick view">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="p-4">
                    ${product.category ? `
                        <p class="text-xs text-gray-500 mb-1">${product.category.name}</p>
                    ` : ''}
                    
                    <h3 class="font-medium text-gray-900 mb-2 line-clamp-2">
                        <a href="/products/${product.slug}/" class="hover:text-primary-600">
                            ${product.name}
                        </a>
                    </h3>
                    
                    ${product.rating !== undefined ? `
                        <div class="flex items-center gap-1 mb-2">
                            <div class="flex text-yellow-400">
                                ${this.renderStars(product.rating)}
                            </div>
                            <span class="text-xs text-gray-500">(${product.review_count || 0})</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-lg font-bold text-gray-900">${formatPrice(product.price)}</span>
                            ${hasDiscount ? `
                                <span class="text-sm text-gray-500 line-through">${formatPrice(product.compare_price)}</span>
                            ` : ''}
                        </div>
                        
                        ${product.in_stock !== false ? `
                            <button type="button" class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors" data-add-to-cart data-product-id="${product.id}" aria-label="Add to cart">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        ` : `
                            <span class="text-sm text-red-500">Out of stock</span>
                        `}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        
        let html = '';
        
        for (let i = 0; i < fullStars; i++) {
            html += '<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }
        
        if (hasHalf) {
            html += '<svg class="w-4 h-4" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" stroke="currentColor" stroke-width="0.5" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            html += '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }
        
        return html;
    }
    
    initHeroSlider() {
        const slider = $('#hero-slider');
        if (!slider) return;
        
        const slides = slider.querySelectorAll('[data-slide]');
        const dots = slider.querySelectorAll('[data-slide-dot]');
        const prevBtn = slider.querySelector('[data-slide-prev]');
        const nextBtn = slider.querySelector('[data-slide-next]');
        
        if (slides.length <= 1) return;
        
        let currentIndex = 0;
        let interval = null;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('hidden', i !== index);
                slide.classList.toggle('opacity-0', i !== index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('bg-white', i === index);
                dot.classList.toggle('bg-white/50', i !== index);
            });
            
            currentIndex = index;
        };
        
        const nextSlide = () => {
            showSlide((currentIndex + 1) % slides.length);
        };
        
        const prevSlide = () => {
            showSlide((currentIndex - 1 + slides.length) % slides.length);
        };
        
        const startAutoplay = () => {
            interval = setInterval(nextSlide, 5000);
        };
        
        const stopAutoplay = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };
        
        // Bind events
        prevBtn?.addEventListener('click', () => {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        });
        
        nextBtn?.addEventListener('click', () => {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                showSlide(index);
                startAutoplay();
            });
        });
        
        // Start autoplay
        startAutoplay();
        
        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
    }
    
    initCountdowns() {
        $$('[data-countdown]').forEach(el => {
            const endTime = new Date(el.dataset.countdown).getTime();
            
            const updateCountdown = () => {
                const now = Date.now();
                const diff = endTime - now;
                
                if (diff <= 0) {
                    el.innerHTML = 'Ended';
                    return;
                }
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                el.innerHTML = `
                    <span class="countdown-item">${days}<small>d</small></span>
                    <span class="countdown-item">${hours.toString().padStart(2, '0')}<small>h</small></span>
                    <span class="countdown-item">${minutes.toString().padStart(2, '0')}<small>m</small></span>
                    <span class="countdown-item">${seconds.toString().padStart(2, '0')}<small>s</small></span>
                `;
            };
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        });
    }
    
    initNewsletter() {
        const form = $('#newsletter-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]')?.value;
            if (!email) return;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn?.innerHTML;
            
            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = 'Subscribing...';
                }
                
                // TODO: Implement newsletter subscription API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                toast.success('Thanks for subscribing!');
                form.reset();
                
            } catch (error) {
                toast.error('Failed to subscribe. Please try again.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        });
    }
}

/**
 * Initialize homepage
 */
export function initHomePage() {
    return new HomePage();
}

export default {
    HomePage,
    initHomePage
};

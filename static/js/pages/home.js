/**
 * Home Page
 * @module pages/home
 */

const HomePage = (function() {
    'use strict';

    let heroSliderInterval = null;

    async function init() {
        await Promise.all([
            loadHeroBanners(),
            loadFeaturedProducts(),
            loadCategoriesShowcase(),
            loadNewArrivals(),
            loadPromotions(),
            loadCustomOrderCTA()
        ]);
        initNewsletterForm();
    }

    async function loadHeroBanners() {
        const container = document.getElementById('hero-slider');
        if (!container) return;

        try {
            const response = await PagesApi.getBanners('home_hero');
            const banners = response.data?.results || response.data || response.results || [];

            if (banners.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = `
                <div class="relative overflow-hidden w-full h-[70vh]">
                    <div class="hero-slides relative w-full h-full">
                        ${banners.map((banner, index) => `
                            <div class="hero-slide ${index === 0 ? '' : 'hidden'} w-full h-full" data-index="${index}">
                                <a href="${banner.link_url || '#'}" class="block relative w-full h-full">
                                    <img 
                                        src="${banner.image}" 
                                        alt="${Templates.escapeHtml(banner.title || '')}"
                                        class="absolute inset-0 w-full h-full object-cover"
                                        loading="${index === 0 ? 'eager' : 'lazy'}"
                                    >
                                    ${banner.title || banner.subtitle ? `
                                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                            <div class="px-8 md:px-16 max-w-xl">
                                                ${banner.title ? `<h2 class="text-3xl md:text-5xl font-bold text-white mb-4">${Templates.escapeHtml(banner.title)}</h2>` : ''}
                                                ${banner.subtitle ? `<p class="text-lg text-white/90 mb-6">${Templates.escapeHtml(banner.subtitle)}</p>` : ''}
                                                ${(banner.link_text || banner.button_text) ? `
                                                    <span class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                                        ${Templates.escapeHtml(banner.link_text || banner.button_text)}
                                                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                                        </svg>
                                                    </span>
                                                ` : ''}
                                            </div>
                                        </div>
                                    ` : ''}
                                </a>
                            </div>
                        `).join('')}
                    </div>
                    ${banners.length > 1 ? `
                        <button class="hero-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors" aria-label="Previous slide">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <button class="hero-next absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors" aria-label="Next slide">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <div class="hero-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            ${banners.map((_, index) => `
                                <button class="w-3 h-3 rounded-full transition-colors ${index === 0 ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

            if (banners.length > 1) {
                initHeroSlider(banners.length);
            }
        } catch (error) {
            // Gracefully ignore missing banners endpoint and render a simple fallback hero
            console.warn('Hero banners unavailable:', error?.status || error);
        }
    }

    function initHeroSlider(totalSlides) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dots button');
        const prevBtn = document.querySelector('.hero-prev');
        const nextBtn = document.querySelector('.hero-next');

        function goToSlide(index) {
            slides[currentSlide].classList.add('hidden');
            dots[currentSlide]?.classList.remove('bg-white');
            dots[currentSlide]?.classList.add('bg-white/50');

            currentSlide = (index + totalSlides) % totalSlides;

            slides[currentSlide].classList.remove('hidden');
            dots[currentSlide]?.classList.add('bg-white');
            dots[currentSlide]?.classList.remove('bg-white/50');
        }

        prevBtn?.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoplay();
        });

        nextBtn?.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoplay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
        });

        function resetAutoplay() {
            if (heroSliderInterval) {
                clearInterval(heroSliderInterval);
            }
            heroSliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        }

        resetAutoplay();
    }

    async function loadFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;

        const grid = container.querySelector('.products-grid') || container;
        Loader.show(grid, 'skeleton');

        try {
            const response = await ProductsApi.getFeatured(8);
            const products = response.data?.results || response.data || response.results || [];

            if (products.length === 0) {
                grid.innerHTML = '<p class="text-gray-500 text-center py-8">No featured products available.</p>';
                return;
            }

            grid.innerHTML = products.map(product => ProductCard.render(product)).join('');
            // Ensure top-of-viewport product images load eagerly for better LCP
            try {
                const imgs = grid.querySelectorAll('img');
                imgs.forEach((img, i) => {
                    if (i < 2) {
                        img.setAttribute('loading', 'eager');
                        img.setAttribute('fetchpriority', 'high');
                        img.setAttribute('decoding', 'async');
                    }
                });
            } catch {}
            ProductCard.bindEvents(grid);
        } catch (error) {
            console.error('Failed to load featured products:', error);
            grid.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>';
        }
    }

    async function loadCategoriesShowcase() {
        const container = document.getElementById('categories-showcase');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await CategoriesApi.getCategories({ pageSize: 6, featured: true });
            const categories = response.data?.results || response.data || response.results || [];

            if (categories.length === 0) {
                container.innerHTML = '';
                return;
            }

            const getCategoryImage = (cat) => {
                if (!cat) return '';
                if (typeof cat.image === 'string' && cat.image) return cat.image;
                if (cat.image && typeof cat.image === 'object') {
                    if (typeof cat.image.url === 'string' && cat.image.url) return cat.image.url;
                    if (typeof cat.image.src === 'string' && cat.image.src) return cat.image.src;
                }
                if (typeof cat.banner_image === 'string' && cat.banner_image) return cat.banner_image;
                if (cat.banner_image && typeof cat.banner_image === 'object') {
                    if (typeof cat.banner_image.url === 'string' && cat.banner_image.url) return cat.banner_image.url;
                    if (typeof cat.banner_image.src === 'string' && cat.banner_image.src) return cat.banner_image.src;
                }
                if (typeof cat.hero_image === 'string' && cat.hero_image) return cat.hero_image;
                if (cat.hero_image && typeof cat.hero_image === 'object') {
                    if (typeof cat.hero_image.url === 'string' && cat.hero_image.url) return cat.hero_image.url;
                    if (typeof cat.hero_image.src === 'string' && cat.hero_image.src) return cat.hero_image.src;
                }
                if (typeof cat.thumbnail === 'string' && cat.thumbnail) return cat.thumbnail;
                if (cat.thumbnail && typeof cat.thumbnail === 'object') {
                    if (typeof cat.thumbnail.url === 'string' && cat.thumbnail.url) return cat.thumbnail.url;
                    if (typeof cat.thumbnail.src === 'string' && cat.thumbnail.src) return cat.thumbnail.src;
                }
                return '';
            };

            container.innerHTML = `
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    ${categories.map(category => `
                        <a href="/categories/${category.slug}/" class="group block">
                            <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                ${(() => { const img = getCategoryImage(category); return img ? `
                                    <img 
                                        src="${img}" 
                                        alt="${Templates.escapeHtml(category.name || '')}"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    >
                                ` : `
                                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                                        <svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                                        </svg>
                                    </div>
                                `; })()}
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <h3 class="mt-3 text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors text-center">
                                ${Templates.escapeHtml(category.name)}
                            </h3>
                            ${category.product_count ? `
                                <p class="text-xs text-gray-500 text-center">${category.product_count} products</p>
                            ` : ''}
                        </a>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Failed to load categories:', error);
            container.innerHTML = '';
        }
    }

    async function loadNewArrivals() {
        const container = document.getElementById('new-arrivals');
        if (!container) return;

        const grid = container.querySelector('.products-grid') || container;
        Loader.show(grid, 'skeleton');

        try {
            const response = await ProductsApi.getNewArrivals(4);
            const products = response.data?.results || response.data || response.results || [];

            if (products.length === 0) {
                grid.innerHTML = '<p class="text-gray-500 text-center py-8">No new products available.</p>';
                return;
            }

            grid.innerHTML = products.map(product => ProductCard.render(product, { showBadge: true, badge: 'New' })).join('');
            // Eager-load first images to reduce lazy-load intervention note
            try {
                const imgs = grid.querySelectorAll('img');
                imgs.forEach((img, i) => {
                    if (i < 2) {
                        img.setAttribute('loading', 'eager');
                        img.setAttribute('fetchpriority', 'high');
                        img.setAttribute('decoding', 'async');
                    }
                });
            } catch {}
            ProductCard.bindEvents(grid);
        } catch (error) {
            console.error('Failed to load new arrivals:', error);
            grid.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load products.</p>';
        }
    }

    async function loadPromotions() {
        const container = document.getElementById('promotions-banner') || document.getElementById('promotion-banners');
        if (!container) return;

        try {
            const response = await PagesApi.getPromotions();
            let promotions = response?.data?.results ?? response?.results ?? response?.data ?? [];
            if (!Array.isArray(promotions)) {
                if (promotions && typeof promotions === 'object') {
                    promotions = Array.isArray(promotions.items) ? promotions.items : [promotions];
                } else {
                    promotions = [];
                }
            }

            if (promotions.length === 0) {
                container.innerHTML = '';
                return;
            }

            const promo = promotions[0] || {};
            container.innerHTML = `
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
                    <div class="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-center md:text-left">
                            <span class="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-3">
                                Limited Time Offer
                            </span>
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
                                ${Templates.escapeHtml(promo.title || promo.name || '')}
                            </h3>
                            ${promo.description ? `
                                <p class="text-white/90 max-w-lg">${Templates.escapeHtml(promo.description)}</p>
                            ` : ''}
                            ${promo.discount_value ? `
                                <p class="text-3xl font-bold text-white mt-4">
                                    ${promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `Save ${Templates.formatPrice(promo.discount_value)}`}
                                </p>
                            ` : ''}
                        </div>
                        <div class="flex flex-col items-center gap-4">
                            ${promo.code ? `
                                <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-dashed border-white/30">
                                    <p class="text-sm text-white/80 mb-1">Use code:</p>
                                    <p class="text-2xl font-mono font-bold text-white tracking-wider">${Templates.escapeHtml(promo.code)}</p>
                                </div>
                            ` : ''}
                            <a href="/products/?promotion=${promo.id || ''}" class="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                Shop Now
                                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.warn('Promotions unavailable:', error?.status || error);
            container.innerHTML = '';
        }
    }

    async function loadCustomOrderCTA() {
        const container = document.getElementById('custom-order-cta');
        if (!container) return;

        const routeMap = window.BUNORAA_ROUTES || {};
        const wizardUrl = routeMap.preordersWizard || '/preorders/create/';
        const landingUrl = routeMap.preordersLanding || '/preorders/';

        try {
            // Try to load featured pre-order categories
            let categories = [];
            if (typeof PreordersApi !== 'undefined' && PreordersApi.getCategories) {
                try {
                    const response = await PreordersApi.getCategories({ featured: true, pageSize: 4 });
                    categories = response?.data?.results || response?.data || response?.results || [];
                } catch (e) {
                    console.warn('Pre-order categories unavailable:', e);
                }
            }

            container.innerHTML = `
                <div class="container mx-auto px-4 relative">
                    <div class="grid lg:grid-cols-2 gap-12 items-center">
                        <div class="text-white">
                            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-xs uppercase tracking-[0.2em] mb-6">
                                <span class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                                Made Just For You
                            </span>
                            <h2 class="text-3xl lg:text-5xl font-display font-bold mb-6 leading-tight">Create Your Perfect Custom Order</h2>
                            <p class="text-white/80 text-lg mb-8 max-w-xl">Have a unique vision? Our skilled artisans will bring your ideas to life. From personalized gifts to custom designs, we craft exactly what you need.</p>
                            <div class="grid sm:grid-cols-3 gap-4 mb-8">
                                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div class="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-white">Custom Design</p>
                                        <p class="text-xs text-white/60">Your vision, our craft</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div class="w-10 h-10 bg-indigo-500/30 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-white">Direct Chat</p>
                                        <p class="text-xs text-white/60">Talk to artisans</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <div class="w-10 h-10 bg-pink-500/30 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-white">Quality Assured</p>
                                        <p class="text-xs text-white/60">Satisfaction guaranteed</p>
                                    </div>
                                </div>
                            </div>
                            ${categories.length > 0 ? `
                                <div class="mb-8">
                                    <p class="text-white/60 text-sm mb-3">Popular categories:</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${categories.slice(0, 4).map(cat => `
                                            <a href="${landingUrl}category/${cat.slug}/" class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-colors">
                                                ${cat.icon ? `<span>${cat.icon}</span>` : ''}
                                                ${Templates.escapeHtml(cat.name)}
                                            </a>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            <div class="flex flex-wrap gap-4">
                                <a href="${wizardUrl}" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all group">
                                    Start Your Custom Order
                                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </a>
                                <a href="${landingUrl}" class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition-all">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div class="hidden lg:block">
                            <div class="relative">
                                <div class="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 rounded-3xl blur-2xl"></div>
                                <div class="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                                    <div class="space-y-6">
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">1</div>
                                            <div>
                                                <h4 class="text-white font-semibold mb-1">Choose Category</h4>
                                                <p class="text-white/60 text-sm">Select from custom apparel, gifts, home decor & more</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-indigo-500/30 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">2</div>
                                            <div>
                                                <h4 class="text-white font-semibold mb-1">Share Your Vision</h4>
                                                <p class="text-white/60 text-sm">Upload designs, describe your requirements</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-pink-500/30 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">3</div>
                                            <div>
                                                <h4 class="text-white font-semibold mb-1">Get Your Quote</h4>
                                                <p class="text-white/60 text-sm">Receive pricing and timeline from our team</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">4</div>
                                            <div>
                                                <h4 class="text-white font-semibold mb-1">We Create & Deliver</h4>
                                                <p class="text-white/60 text-sm">Track progress and receive your masterpiece</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.warn('Custom order CTA failed to load:', error);
            // Fallback static content
            container.innerHTML = `
                <div class="container mx-auto px-4 text-center text-white">
                    <h2 class="text-3xl lg:text-4xl font-display font-bold mb-4">Create Your Perfect Custom Order</h2>
                    <p class="text-white/80 mb-8 max-w-2xl mx-auto">Have a unique vision? Our skilled artisans will bring your ideas to life.</p>
                    <a href="${wizardUrl}" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold rounded-xl">
                        Start Your Custom Order
                    </a>
                </div>
            `;
        }
    }

    function initNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            const email = emailInput?.value?.trim();

            if (!email) {
                Toast.error('Please enter your email address.');
                return;
            }

            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

            try {
                await SupportApi.submitContactForm({ email, type: 'newsletter' });
                Toast.success('Thank you for subscribing!');
                emailInput.value = '';
            } catch (error) {
                Toast.error(error.message || 'Failed to subscribe. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    function destroy() {
        if (heroSliderInterval) {
            clearInterval(heroSliderInterval);
            heroSliderInterval = null;
        }
    }

    return {
        init,
        destroy
    };
})();

window.HomePage = HomePage;

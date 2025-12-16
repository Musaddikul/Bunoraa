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
            loadPromotions()
        ]);
        initNewsletterForm();
    }

    async function loadHeroBanners() {
        const container = document.getElementById('hero-slider');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await PagesApi.getBanners('home_hero');
            const banners = response.data || [];

            if (banners.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = `
                <div class="relative overflow-hidden rounded-2xl">
                    <div class="hero-slides relative">
                        ${banners.map((banner, index) => `
                            <div class="hero-slide ${index === 0 ? '' : 'hidden'}" data-index="${index}">
                                <a href="${banner.link_url || '#'}" class="block relative aspect-[21/9]">
                                    <img 
                                        src="${banner.image}" 
                                        alt="${Templates.escapeHtml(banner.title || '')}"
                                        class="w-full h-full object-cover"
                                        loading="${index === 0 ? 'eager' : 'lazy'}"
                                    >
                                    ${banner.title || banner.subtitle ? `
                                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                                            <div class="px-8 md:px-16 max-w-xl">
                                                ${banner.title ? `<h2 class="text-3xl md:text-5xl font-bold text-white mb-4">${Templates.escapeHtml(banner.title)}</h2>` : ''}
                                                ${banner.subtitle ? `<p class="text-lg text-white/90 mb-6">${Templates.escapeHtml(banner.subtitle)}</p>` : ''}
                                                ${banner.button_text ? `
                                                    <span class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                                        ${Templates.escapeHtml(banner.button_text)}
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
            console.error('Failed to load hero banners:', error);
            container.innerHTML = '';
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
            const products = response.data?.results || response.data || [];

            if (products.length === 0) {
                grid.innerHTML = '<p class="text-gray-500 text-center py-8">No featured products available.</p>';
                return;
            }

            grid.innerHTML = products.map(product => ProductCard.render(product)).join('');
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
            const categories = response.data?.results || response.data || [];

            if (categories.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = `
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    ${categories.map(category => `
                        <a href="/categories/${category.slug}/" class="group block">
                            <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                ${category.image ? `
                                    <img 
                                        src="${category.image}" 
                                        alt="${Templates.escapeHtml(category.name)}"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    >
                                ` : `
                                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                                        <svg class="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                                        </svg>
                                    </div>
                                `}
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
            const products = response.data?.results || response.data || [];

            if (products.length === 0) {
                grid.innerHTML = '<p class="text-gray-500 text-center py-8">No new products available.</p>';
                return;
            }

            grid.innerHTML = products.map(product => ProductCard.render(product, { showBadge: true, badge: 'New' })).join('');
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
            const promotions = response.data?.results || response.data || [];

            if (promotions.length === 0) {
                container.innerHTML = '';
                return;
            }

            const promo = promotions[0];
            container.innerHTML = `
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
                    <div class="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-center md:text-left">
                            <span class="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-3">
                                Limited Time Offer
                            </span>
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">
                                ${Templates.escapeHtml(promo.title || promo.name)}
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
                            <a href="/products/?promotion=${promo.id}" class="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
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
            console.error('Failed to load promotions:', error);
            container.innerHTML = '';
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

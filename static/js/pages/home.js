/**
 * Home Page
 * @module pages/home
 */

const HomePage = (function() {
    'use strict';

    // --- Polyfills/Shims for legacy dependencies ---
    const Templates = window.Templates || {
        escapeHtml: (str) => str.replace(/[&<>"']/g, (match) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[match])
    };

    const ProductCard = window.ProductCard || {
        render: (product) => `<div class="p-4 border rounded">Product: ${Templates.escapeHtml(product.name)}</div>`,
        bindEvents: () => {}
    };

    function getResults(response) {
        if (!response || !response.data) return [];
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.data.results)) return response.data.results;
        return [];
    }

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
            const response = await window.ApiClient.get('/pages/banners/', { params: { type: 'home_hero' } });
            const banners = getResults(response);

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
            console.warn('Hero banners unavailable:', error);
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
        window.Loader.show(grid);

        try {
            const response = await window.ApiClient.get('/products/featured/', { params: { limit: 8 } });
            const products = getResults(response);

            if (products.length === 0) {
                grid.innerHTML = '<p class="text-gray-500 text-center py-8">No featured products available.</p>';
                return;
            }

            grid.innerHTML = products.map(product => ProductCard.render(product)).join('');
            ProductCard.bindEvents(grid);
        } catch (error) {
            console.error('Failed to load featured products:', error);
            grid.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load products. Please try again later.</p>';
        } finally {
            window.Loader.hide(grid);
        }
    }

    async function loadCategoriesShowcase() {
        const container = document.getElementById('categories-showcase');
        if (!container) return;

        window.Loader.show(container);

        try {
            const response = await window.ApiClient.get('/categories/', { params: { page_size: 6, featured: true } });
            const categories = getResults(response);

            if (categories.length === 0) {
                container.innerHTML = '';
                return;
            }

            const getCategoryImage = (cat) => cat?.image?.url || cat?.image || cat?.banner_image?.url || cat?.banner_image || '';

            container.innerHTML = `
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    ${categories.map(category => `
                        <a href="/categories/${category.slug}/" class="group block">
                            <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                <img src="${getCategoryImage(category)}" alt="${Templates.escapeHtml(category.name || '')}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <h3 class="mt-3 text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors text-center">
                                ${Templates.escapeHtml(category.name)}
                            </h3>
                        </a>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Failed to load categories:', error);
            container.innerHTML = '';
        } finally {
            window.Loader.hide(container);
        }
    }

    async function loadNewArrivals() {
        const container = document.getElementById('new-arrivals');
        if (!container) return;

        const grid = container.querySelector('.products-grid') || container;
        window.Loader.show(grid);

        try {
            const response = await window.ApiClient.get('/products/new-arrivals/', { params: { limit: 4 } });
            const products = getResults(response);

            if (products.length === 0) {
                grid.innerHTML = '<p class="text-gray-500 text-center py-8">No new products available.</p>';
                return;
            }

            grid.innerHTML = products.map(product => ProductCard.render(product, { showBadge: true, badge: 'New' })).join('');
            ProductCard.bindEvents(grid);
        } catch (error) {
            console.error('Failed to load new arrivals:', error);
            grid.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load products.</p>';
        } finally {
            window.Loader.hide(grid);
        }
    }

    async function loadPromotions() {
        const container = document.getElementById('promotions-banner');
        if (!container) return;

        try {
            const response = await window.ApiClient.get('/promotions/');
            const promotions = getResults(response);

            if (promotions.length === 0) {
                container.innerHTML = '';
                return;
            }

            const promo = promotions[0] || {};
            container.innerHTML = `
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
                    <div class="px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="text-center md:text-left">
                            <h3 class="text-2xl md:text-3xl font-bold text-white mb-2">${Templates.escapeHtml(promo.title || '')}</h3>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.warn('Promotions unavailable:', error);
            container.innerHTML = '';
        }
    }

    async function loadCustomOrderCTA() {
        // This component seems mostly static, so we'll leave it as is for now.
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
                window.Toast.error('Please enter your email address.');
                return;
            }

            submitBtn.disabled = true;
            try {
                await window.ApiClient.post('/support/contact/', { email: email, type: 'newsletter' });
                window.Toast.success('Thank you for subscribing!');
                emailInput.value = '';
            } catch (error) {
                window.Toast.error(error.message || 'Failed to subscribe. Please try again.');
            } finally {
                submitBtn.disabled = false;
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

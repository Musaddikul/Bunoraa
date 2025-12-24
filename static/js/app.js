/**
 * Bunoraa - Main Application Entry Point
 * @module app
 */

const App = (function() {
    'use strict';

    const pageControllers = {
        'home': HomePage,
        'category': CategoryPage,
        'product': ProductPage,
        'cart': CartPage,
        'checkout': CheckoutPage,
        'account': AccountPage,
        'orders': OrdersPage,
        'search': SearchPage,
        'contact': ContactPage,
        'wishlist': WishlistPage,
        'faq': FAQPage,
        'legal': LegalPage
    };

    let currentPage = null;
    let currentController = null;

    function init() {
        detectCurrentPage();
        initGlobalComponents();
        initCurrentPage();
        initCartBadge();
        initGlobalEventListeners();
        initMobileMenu();
        initLanguageSelector();
        initCurrencySelector();
    }

    function detectCurrentPage() {
        const path = window.location.pathname;
        const body = document.body;
        
        // Check for data-page attribute first
        if (body.dataset.page) {
            currentPage = body.dataset.page;
            return;
        }

        // Detect from URL
        if (path === '/' || path === '/home/') {
            currentPage = 'home';
        } else if (path === '/categories/' || path === '/products/') {
            // Category list or products list page - use search module for browsing
            currentPage = 'search';
        } else if (path.startsWith('/categories/') && path !== '/categories/') {
            currentPage = 'category';
        } else if (path.startsWith('/products/') && path !== '/products/') {
            currentPage = 'product';
        } else if (path === '/search/' || path.startsWith('/search')) {
            currentPage = 'search';
        } else if (path.startsWith('/cart')) {
            currentPage = 'cart';
        } else if (path.startsWith('/checkout')) {
            currentPage = 'checkout';
        } else if (path.startsWith('/account') || path.startsWith('/accounts/profile')) {
            currentPage = 'account';
        } else if (path.startsWith('/orders')) {
            currentPage = 'orders';
        } else if (path.startsWith('/wishlist')) {
            currentPage = 'wishlist';
        } else if (path.startsWith('/contact')) {
            currentPage = 'contact';
        } else if (path.startsWith('/faq')) {
            currentPage = 'faq';
        } else if (path.includes('privacy') || path.includes('terms') || path.includes('legal') || path.includes('policy')) {
            currentPage = 'legal';
        }
    }

    function initGlobalComponents() {
        // Initialize global UI components
        // Modal, Toast, and Dropdown are lazy-initialized when needed
        
        // Initialize tabs if present on page
        if (typeof Tabs !== 'undefined' && document.querySelector('[data-tabs]')) {
            Tabs.init();
        }
        
        // Initialize any existing dropdowns on the page
        if (typeof Dropdown !== 'undefined') {
            document.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
                const targetId = trigger.dataset.dropdownTarget;
                const target = document.getElementById(targetId);
                if (target) {
                    Dropdown.create(trigger, { content: target.innerHTML });
                }
            });
        }
    }

    function initCurrentPage() {
        if (currentPage && pageControllers[currentPage]) {
            currentController = pageControllers[currentPage];
            if (typeof currentController.init === 'function') {
                currentController.init();
            }
        }
    }

    async function initCartBadge() {
        const cartBadge = document.getElementById('cart-badge');
        const cartCount = document.getElementById('cart-count');

        if (!cartBadge && !cartCount) return;

        try {
            const response = await CartApi.getCart();
            const count = response.data?.item_count || 0;
            updateCartBadge(count);
        } catch (error) {
            console.error('Failed to get cart count:', error);
        }
    }

    async function findWishlistItemId(productId) {
        try {
            const response = await WishlistApi.getWishlist({ pageSize: 200 });
            const payload = response.data || {};
            const items = payload.items || [];
            const match = items.find(item => String(item.product) === String(productId));
            return match?.id || null;
        } catch (error) {
            console.warn('Failed to resolve wishlist item id', error);
            return null;
        }
    }

    function updateCartBadge(count) {
        const cartBadge = document.getElementById('cart-badge');
        const cartCount = document.getElementById('cart-count');

        if (cartCount) {
            cartCount.textContent = count;
        }

        if (cartBadge) {
            if (count > 0) {
                cartBadge.textContent = count > 99 ? '99+' : count;
                cartBadge.classList.remove('hidden');
            } else {
                cartBadge.classList.add('hidden');
            }
        }
    }

    function initGlobalEventListeners() {
        // Listen for cart updates
        document.addEventListener('cart:updated', async () => {
            await initCartBadge();
        });

        // Listen for auth state changes
        document.addEventListener('auth:login', () => {
            updateAuthUI(true);
        });

        document.addEventListener('auth:logout', () => {
            updateAuthUI(false);
        });

        // Global quick add to cart (data-attribute and class-based)
        document.addEventListener('click', async (e) => {
            const quickAddBtn = e.target.closest('[data-quick-add], [data-add-to-cart], .add-to-cart-btn');
            if (quickAddBtn) {
                e.preventDefault();
                const productId = quickAddBtn.dataset.productId || quickAddBtn.dataset.quickAdd || quickAddBtn.dataset.addToCart;
                if (!productId) return;
                
                quickAddBtn.disabled = true;
                const originalHtml = quickAddBtn.innerHTML;
                quickAddBtn.innerHTML = '<svg class="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

                try {
                    await CartApi.addItem(productId, 1);
                    Toast.success('Added to cart!');
                    document.dispatchEvent(new CustomEvent('cart:updated'));
                } catch (error) {
                    Toast.error(error.message || 'Failed to add to cart.');
                } finally {
                    quickAddBtn.disabled = false;
                    quickAddBtn.innerHTML = originalHtml;
                }
            }
        });

        // Global quick add to wishlist (data-attribute and class-based)
        document.addEventListener('click', async (e) => {
            const wishlistBtn = e.target.closest('[data-wishlist-toggle], .wishlist-btn');
            if (wishlistBtn) {
                e.preventDefault();
                
                if (!AuthApi.isAuthenticated()) {
                    Toast.warning('Please login to add items to your wishlist.');
                    window.location.href = '/account/login/?next=' + encodeURIComponent(window.location.pathname);
                    return;
                }

                const productId = wishlistBtn.dataset.wishlistToggle || wishlistBtn.dataset.productId;
                if (!productId) return;

                wishlistBtn.disabled = true;
                let wishlistItemId = wishlistBtn.dataset.wishlistItemId || '';

                if (!wishlistItemId && wishlistBtn.classList.contains('text-red-500')) {
                    wishlistItemId = await findWishlistItemId(productId) || '';
                }

                const isActive = wishlistBtn.classList.contains('text-red-500');
                const shouldRemove = isActive && wishlistItemId;

                try {
                    if (shouldRemove) {
                        await WishlistApi.removeItem(wishlistItemId);
                        wishlistBtn.classList.remove('text-red-500');
                        wishlistBtn.querySelector('svg')?.classList.remove('fill-current');
                        wishlistBtn.removeAttribute('data-wishlist-item-id');
                        Toast.success('Removed from wishlist.');
                    } else {
                        const response = await WishlistApi.addItem(productId);
                        const createdId = response.data?.id || response.data?.item?.id || await findWishlistItemId(productId);
                        if (createdId) {
                            wishlistBtn.dataset.wishlistItemId = createdId;
                        }
                        wishlistBtn.classList.add('text-red-500');
                        wishlistBtn.querySelector('svg')?.classList.add('fill-current');
                        Toast.success(response.message || 'Added to wishlist!');
                    }
                } catch (error) {
                    Toast.error(error.message || 'Failed to update wishlist.');
                } finally {
                    wishlistBtn.disabled = false;
                }
            }
        });

        // Quick view handler
        document.addEventListener('click', (e) => {
            const quickViewBtn = e.target.closest('[data-quick-view], .quick-view-btn');
            if (quickViewBtn) {
                e.preventDefault();
                const productId = quickViewBtn.dataset.quickView || quickViewBtn.dataset.productId;
                const productSlug = quickViewBtn.dataset.productSlug;
                
                if (productSlug) {
                    window.location.href = `/products/${productSlug}/`;
                } else if (productId) {
                    // If we have Modal component, show quick view modal
                    if (typeof Modal !== 'undefined' && Modal.showQuickView) {
                        Modal.showQuickView(productId);
                    } else {
                        window.location.href = `/products/${productId}/`;
                    }
                }
            }
        });

        // Handle logout
        document.addEventListener('click', async (e) => {
            const logoutBtn = e.target.closest('[data-logout]');
            if (logoutBtn) {
                e.preventDefault();
                
                try {
                    await AuthApi.logout();
                    Toast.success('Logged out successfully.');
                    document.dispatchEvent(new CustomEvent('auth:logout'));
                    window.location.href = '/';
                } catch (error) {
                    Toast.error('Failed to logout.');
                }
            }
        });

        // Handle back to top
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', Debounce.throttle(() => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                } else {
                    backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                }
            }, 100));

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    function updateAuthUI(isLoggedIn) {
        const authElements = document.querySelectorAll('[data-auth-state]');
        
        authElements.forEach(el => {
            const state = el.dataset.authState;
            if (state === 'logged-in') {
                el.classList.toggle('hidden', !isLoggedIn);
            } else if (state === 'logged-out') {
                el.classList.toggle('hidden', isLoggedIn);
            }
        });
    }

    function initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('close-mobile-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        function openMenu() {
            mobileMenu?.classList.remove('translate-x-full');
            overlay?.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }

        function closeMenu() {
            mobileMenu?.classList.add('translate-x-full');
            overlay?.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }

        menuBtn?.addEventListener('click', openMenu);
        closeBtn?.addEventListener('click', closeMenu);
        overlay?.addEventListener('click', closeMenu);
    }

    function initLanguageSelector() {
        const languageBtn = document.querySelector('[data-language-selector]');
        const languageDropdown = document.getElementById('language-dropdown');

        if (languageBtn && languageDropdown) {
            Dropdown.create(languageBtn, languageDropdown);

            languageDropdown.querySelectorAll('[data-language]').forEach(item => {
                item.addEventListener('click', async () => {
                    const lang = item.dataset.language;
                    
                    try {
                        await LocalizationApi.setLanguage(lang);
                        Storage.set('language', lang);
                        window.location.reload();
                    } catch (error) {
                        Toast.error('Failed to change language.');
                    }
                });
            });
        }
    }

    function initCurrencySelector() {
        const currencyBtn = document.querySelector('[data-currency-selector]');
        const currencyDropdown = document.getElementById('currency-dropdown');

        if (currencyBtn && currencyDropdown) {
            Dropdown.create(currencyBtn, currencyDropdown);

            currencyDropdown.querySelectorAll('[data-currency]').forEach(item => {
                item.addEventListener('click', async () => {
                    const currency = item.dataset.currency;
                    const symbol = item.dataset.symbol;
                    
                    try {
                        await LocalizationApi.setCurrency(currency);
                        Storage.set('currency', { code: currency, symbol });
                        window.location.reload();
                    } catch (error) {
                        Toast.error('Failed to change currency.');
                    }
                });
            });
        }
    }

    function destroy() {
        if (currentController && typeof currentController.destroy === 'function') {
            currentController.destroy();
        }
        currentPage = null;
        currentController = null;
    }

    return {
        init,
        destroy,
        getCurrentPage: () => currentPage,
        updateCartBadge
    };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}

window.App = App;

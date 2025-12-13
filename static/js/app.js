/**
 * @fileoverview Main entry point for the Bunoraa frontend application.
 * Premium e-commerce platform with modular JavaScript architecture.
 * @version 2.0.0
 */

// Import core modules
import { Toast } from './components/toast.js';

/**
 * Global Application State & Controller
 */
const BunoraaApp = {
    version: '2.0.0',
    env: document.body.dataset.env || 'production',
    debug: false,
    
    // User state
    user: null,
    isAuthenticated: false,
    
    // Cart state
    cart: {
        items: [],
        count: 0,
        total: 0
    },
    
    // Currency
    currency: {
        code: 'BDT',
        symbol: '৳',
        rate: 1
    },
    
    // Theme
    theme: 'light',
    
    // Event emitter for cross-module communication
    events: new Map(),
    
    /**
     * Initialize application
     */
    async init() {
        this.debug = this.env === 'development';
        this.log('Initializing Bunoraa App v' + this.version);
        
        // Set theme
        this.initTheme();
        
        // Load initial data
        await this.loadInitialData();
        
        // Initialize global components
        this.initGlobalComponents();
        
        // Initialize page-specific modules
        this.initPageModules();
        
        // Setup global event listeners
        this.setupGlobalEvents();
        
        this.log('App initialized successfully');
    },
    
    /**
     * Load initial data from page
     */
    async loadInitialData() {
        // Check authentication from page data
        const authData = document.getElementById('auth-data');
        if (authData) {
            try {
                this.user = JSON.parse(authData.textContent || '{}');
                this.isAuthenticated = !!this.user?.id;
            } catch (e) {
                this.log('Failed to parse auth data', e);
            }
        }
        
        // Load cart from page data
        const cartData = document.getElementById('cart-data');
        if (cartData) {
            try {
                const data = JSON.parse(cartData.textContent || '{}');
                this.cart = {
                    items: data.items || [],
                    count: data.count || 0,
                    total: data.total || 0
                };
            } catch (e) {
                this.log('Failed to parse cart data', e);
            }
        }
        
        // Currency from page
        const currencyData = document.getElementById('currency-data');
        if (currencyData) {
            try {
                this.currency = JSON.parse(currencyData.textContent || '{}');
            } catch (e) {
                this.log('Failed to parse currency data', e);
            }
        }
    },
    
    /**
     * Initialize theme
     */
    initTheme() {
        const savedTheme = localStorage.getItem('bunoraa_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('bunoraa_theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    },
    
    /**
     * Apply theme to document
     */
    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.emit('theme:changed', this.theme);
    },
    
    /**
     * Toggle theme
     */
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('bunoraa_theme', this.theme);
        this.applyTheme();
    },
    
    /**
     * Initialize global components (header, footer, etc.)
     */
    initGlobalComponents() {
        this.initMobileMenu();
        this.initHeaderSearch();
        this.initCartSidebar();
        this.initUserMenu();
        this.initScrollToTop();
        this.initThemeToggle();
        this.initNewsletterForm();
        this.initSwipers();
    },
    
    /**
     * Initialize mobile menu
     */
    initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('close-mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menu = document.getElementById('mobile-menu');
        
        const openMenu = () => {
            menu?.classList.remove('-translate-x-full');
            overlay?.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        };
        
        const closeMenu = () => {
            menu?.classList.add('-translate-x-full');
            overlay?.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };
        
        menuBtn?.addEventListener('click', openMenu);
        closeBtn?.addEventListener('click', closeMenu);
        overlay?.addEventListener('click', closeMenu);
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    },
    
    /**
     * Initialize header search
     */
    initHeaderSearch() {
        const searchBtn = document.getElementById('header-search-btn');
        const searchDropdown = document.getElementById('search-dropdown');
        const searchInput = document.getElementById('header-search-input');
        const searchClose = document.getElementById('close-search');
        
        const openSearch = () => {
            searchDropdown?.classList.remove('hidden');
            setTimeout(() => searchInput?.focus(), 100);
        };
        
        const closeSearch = () => {
            searchDropdown?.classList.add('hidden');
        };
        
        searchBtn?.addEventListener('click', openSearch);
        searchClose?.addEventListener('click', closeSearch);
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#search-dropdown') && !e.target.closest('#header-search-btn')) {
                closeSearch();
            }
        });
        
        // Search suggestions
        searchInput?.addEventListener('input', debounce(async (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                await this.showSearchSuggestions(query);
            }
        }, 300));
        
        // Submit search
        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                window.location.href = `/search/?q=${encodeURIComponent(searchInput.value)}`;
            }
        });
    },
    
    /**
     * Show search suggestions
     */
    async showSearchSuggestions(query) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;
        
        try {
            const response = await fetch(`/api/search/suggestions/?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            const suggestions = data.results || data || [];
            
            if (suggestions.length === 0) {
                suggestionsContainer.innerHTML = `
                    <div class="p-4 text-center text-gray-500">No suggestions found</div>
                `;
                return;
            }
            
            suggestionsContainer.innerHTML = suggestions.map(item => `
                <a href="${item.url || `/search/?q=${encodeURIComponent(item.query || item.name)}`}" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    ${item.image ? `<img src="${item.image}" alt="" class="w-10 h-10 rounded object-cover">` : `
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    `}
                    <span class="text-gray-700 dark:text-gray-300">${item.name || item.query}</span>
                </a>
            `).join('');
            
        } catch (error) {
            this.log('Search suggestions error:', error);
        }
    },
    
    /**
     * Initialize cart sidebar
     */
    initCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        const closeCartBtn = document.getElementById('close-cart-sidebar');
        const cartContent = document.getElementById('cart-sidebar-content');
        
        const openCartSidebar = async () => {
            cartSidebar?.classList.remove('translate-x-full');
            cartOverlay?.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            
            // Load cart content
            await this.loadCartSidebarContent();
        };
        
        const closeCartSidebar = () => {
            cartSidebar?.classList.add('translate-x-full');
            cartOverlay?.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };
        
        // Listen for open cart sidebar event
        window.addEventListener('open-cart-sidebar', openCartSidebar);
        
        // Cart button clicks
        document.querySelectorAll('#cart-btn, #mobile-cart-btn').forEach(btn => {
            btn?.addEventListener('click', (e) => {
                e.preventDefault();
                openCartSidebar();
            });
        });
        
        // Close button
        closeCartBtn?.addEventListener('click', closeCartSidebar);
        
        // Overlay click
        cartOverlay?.addEventListener('click', closeCartSidebar);
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !cartSidebar?.classList.contains('translate-x-full')) {
                closeCartSidebar();
            }
        });
        
        // Listen for cart updates
        this.on('cart:updated', (cart) => {
            this.updateCartUI(cart);
            this.loadCartSidebarContent();
        });
    },
    
    /**
     * Load cart sidebar content
     */
    async loadCartSidebarContent() {
        const cartContent = document.getElementById('cart-sidebar-content');
        if (!cartContent) return;
        
        cartContent.innerHTML = `
            <div class="flex items-center justify-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
            </div>
        `;
        
        try {
            const response = await fetch('/api/cart/', {
                headers: {
                    'X-CSRFToken': this.getCSRFToken()
                }
            });
            
            if (!response.ok) throw new Error('Failed to load cart');
            
            const cart = await response.json();
            this.cart = {
                items: cart.items || [],
                count: cart.total_items || cart.count || 0,
                total: cart.total || 0
            };
            
            this.renderCartSidebar(cart);
            this.updateCartUI(this.cart);
            
        } catch (error) {
            cartContent.innerHTML = `
                <div class="p-6 text-center">
                    <p class="text-red-500">Failed to load cart</p>
                    <button onclick="BunoraaApp.loadCartSidebarContent()" class="mt-2 text-pink-600 hover:underline">Retry</button>
                </div>
            `;
        }
    },
    
    /**
     * Render cart sidebar content
     */
    renderCartSidebar(cart) {
        const cartContent = document.getElementById('cart-sidebar-content');
        if (!cartContent) return;
        
        const items = cart.items || [];
        
        if (items.length === 0) {
            cartContent.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full py-12">
                    <svg class="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-6 text-center">Looks like you haven't added anything yet.</p>
                    <a href="/products/" class="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        Start Shopping
                    </a>
                </div>
            `;
            return;
        }
        
        cartContent.innerHTML = `
            <div class="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                ${items.map(item => `
                    <div class="flex gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3" data-item-id="${item.id}">
                        <img src="${item.image || item.product_image || '/static/images/placeholder.jpg'}" 
                             alt="${item.product_name || item.name}" 
                             class="w-20 h-20 rounded-lg object-cover flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <a href="/products/${item.product_slug || item.slug}/" class="font-medium text-gray-900 dark:text-white hover:text-pink-600 line-clamp-2 text-sm">
                                ${item.product_name || item.name}
                            </a>
                            ${item.variant_name ? `<p class="text-xs text-gray-500 mt-0.5">${item.variant_name}</p>` : ''}
                            <div class="flex items-center justify-between mt-2">
                                <div class="flex items-center gap-2">
                                    <button class="cart-qty-btn w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600" 
                                            data-action="decrease" data-item-id="${item.id}">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                        </svg>
                                    </button>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-center">${item.quantity}</span>
                                    <button class="cart-qty-btn w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"
                                            data-action="increase" data-item-id="${item.id}">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                        </svg>
                                    </button>
                                </div>
                                <span class="font-semibold text-gray-900 dark:text-white">${this.formatPrice(item.subtotal || item.total_price)}</span>
                            </div>
                        </div>
                        <button class="cart-remove-btn text-gray-400 hover:text-red-500 p-1 flex-shrink-0" data-item-id="${item.id}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-4 bg-white dark:bg-gray-800">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span class="text-xl font-bold text-gray-900 dark:text-white">${this.formatPrice(cart.total || cart.subtotal || 0)}</span>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <a href="/cart/" class="py-3 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                        View Cart
                    </a>
                    <a href="/checkout/" class="py-3 text-center bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium">
                        Checkout
                    </a>
                </div>
            </div>
        `;
        
        // Add event listeners for quantity buttons
        cartContent.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const itemId = btn.dataset.itemId;
                const action = btn.dataset.action;
                await this.updateCartItemQuantity(itemId, action);
            });
        });
        
        // Add event listeners for remove buttons
        cartContent.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const itemId = btn.dataset.itemId;
                await this.removeCartItem(itemId);
            });
        });
    },
    
    /**
     * Update cart item quantity
     */
    async updateCartItemQuantity(itemId, action) {
        try {
            const response = await fetch(`/api/cart/items/${itemId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({ action })
            });
            
            if (!response.ok) throw new Error('Failed to update item');
            
            const data = await response.json();
            this.emit('cart:updated', data);
            await this.loadCartSidebarContent();
            
        } catch (error) {
            Toast.show({ message: 'Failed to update cart', type: 'error' });
        }
    },
    
    /**
     * Remove cart item
     */
    async removeCartItem(itemId) {
        try {
            const response = await fetch(`/api/cart/items/${itemId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': this.getCSRFToken()
                }
            });
            
            if (!response.ok) throw new Error('Failed to remove item');
            
            const data = await response.json();
            this.emit('cart:updated', data);
            await this.loadCartSidebarContent();
            Toast.show({ message: 'Item removed from cart', type: 'success' });
            
        } catch (error) {
            Toast.show({ message: 'Failed to remove item', type: 'error' });
        }
    },
    
    /**
     * Update cart UI
     */
    updateCartUI(cart) {
        this.cart = cart;
        
        // Update cart count badges
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = cart.count;
            el.classList.toggle('hidden', cart.count === 0);
        });
        
        // Update cart dropdown content
        const cartItems = document.getElementById('cart-dropdown-items');
        const cartTotal = document.getElementById('cart-dropdown-total');
        
        if (cartItems && cart.items) {
            if (cart.items.length === 0) {
                cartItems.innerHTML = `
                    <div class="p-6 text-center">
                        <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                        <p class="text-gray-500">Your cart is empty</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = cart.items.slice(0, 3).map(item => `
                    <div class="flex gap-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <img src="${item.image || '/static/images/placeholder.jpg'}" alt="${item.name}" class="w-16 h-16 rounded object-cover">
                        <div class="flex-1 min-w-0">
                            <a href="/products/${item.slug}/" class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 line-clamp-2">${item.name}</a>
                            <p class="text-sm text-gray-500">${item.quantity} × ${this.currency.symbol}${parseFloat(item.price).toLocaleString()}</p>
                        </div>
                    </div>
                `).join('') + (cart.items.length > 3 ? `<div class="p-2 text-center text-sm text-gray-500">+${cart.items.length - 3} more items</div>` : '');
            }
        }
        
        if (cartTotal) {
            cartTotal.textContent = `${this.currency.symbol}${parseFloat(cart.total).toLocaleString()}`;
        }
    },
    
    /**
     * Initialize user menu
     */
    initUserMenu() {
        const userBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        userBtn?.addEventListener('click', () => {
            userDropdown?.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#user-dropdown') && !e.target.closest('#user-menu-btn')) {
                userDropdown?.classList.add('hidden');
            }
        });
    },
    
    /**
     * Initialize scroll to top button
     */
    initScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top');
        if (!scrollBtn) return;
        
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 500) {
                scrollBtn.classList.remove('hidden', 'opacity-0');
                scrollBtn.classList.add('opacity-100');
            } else {
                scrollBtn.classList.add('opacity-0');
                setTimeout(() => scrollBtn.classList.add('hidden'), 300);
            }
        }, 100));
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },
    
    /**
     * Initialize theme toggle
     */
    initThemeToggle() {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.toggleTheme());
        });
    },
    
    /**
     * Initialize Swiper carousels
     */
    initSwipers() {
        if (typeof Swiper === 'undefined') return;
        
        // Hero slider
        document.querySelectorAll('.hero-swiper').forEach(el => {
            new Swiper(el, {
                loop: true,
                autoplay: { delay: 5000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            });
        });
        
        // Product carousels
        document.querySelectorAll('.products-swiper').forEach(el => {
            new Swiper(el, {
                slidesPerView: 2,
                spaceBetween: 16,
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
                breakpoints: {
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                },
            });
        });
    },
    
    /**
     * Initialize newsletter form
     */
    initNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.email.value;
            
            try {
                const response = await fetch('/api/newsletter/subscribe/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCSRFToken()
                    },
                    body: JSON.stringify({ email })
                });
                
                if (response.ok) {
                    Toast.show({ message: 'Successfully subscribed!', type: 'success' });
                    form.reset();
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (error) {
                Toast.show({ message: 'Failed to subscribe. Please try again.', type: 'error' });
            }
        });
    },
    
    /**
     * Initialize page-specific modules
     */
    initPageModules() {
        const page = document.body.dataset.page;
        
        switch (page) {
            case 'home':
                import('./pages/home.js').then(m => new m.HomePage().init()).catch(e => this.log('Failed to load home module', e));
                break;
            case 'products':
            case 'category':
                import('./pages/productListing.js').then(m => new m.ProductListingPage().init()).catch(e => this.log('Failed to load product listing module', e));
                break;
            case 'product-detail':
                import('./pages/productDetail.js').then(m => new m.ProductDetailPage().init()).catch(e => this.log('Failed to load product detail module', e));
                break;
            case 'cart':
                import('./pages/cart.js').then(m => new m.CartPage().init()).catch(e => this.log('Failed to load cart module', e));
                break;
            case 'checkout':
                import('./pages/checkout.js').then(m => new m.CheckoutPage().init()).catch(e => this.log('Failed to load checkout module', e));
                break;
            case 'search':
                import('./pages/search.js').then(m => new m.SearchPage().init()).catch(e => this.log('Failed to load search module', e));
                break;
            case 'account':
                import('./pages/account.js').then(m => new m.AccountPage().init()).catch(e => this.log('Failed to load account module', e));
                break;
        }
    },
    
    /**
     * Setup global event listeners
     */
    setupGlobalEvents() {
        // Global add to cart
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                e.preventDefault();
                const productId = btn.dataset.productId;
                const variantId = btn.dataset.variantId;
                const quantity = parseInt(btn.dataset.quantity) || 1;
                
                await this.addToCart(productId, variantId, quantity, btn);
            }
        });
        
        // Global wishlist toggle
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.wishlist-toggle');
            if (btn) {
                e.preventDefault();
                const productId = btn.dataset.productId;
                await this.toggleWishlist(productId, btn);
            }
        });
        
        // Quick view
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.quick-view-btn');
            if (btn) {
                e.preventDefault();
                const productSlug = btn.dataset.productSlug;
                await this.showQuickView(productSlug);
            }
        });
    },
    
    /**
     * Add to cart
     */
    async addToCart(productId, variantId, quantity = 1, btn = null) {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="animate-spin">⟳</span> Adding...';
        }
        
        try {
            const response = await fetch('/api/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({
                    product_id: productId,
                    variant_id: variantId,
                    quantity: quantity
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.emit('cart:updated', data);
                Toast.show({ message: 'Added to cart!', type: 'success' });
            } else {
                throw new Error(data.error || 'Failed to add to cart');
            }
        } catch (error) {
            Toast.show({ message: error.message, type: 'error' });
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 'Add to Cart';
            }
        }
    },
    
    /**
     * Toggle wishlist
     */
    async toggleWishlist(productId, btn = null) {
        if (!this.isAuthenticated) {
            Toast.show({ message: 'Please login to add items to wishlist', type: 'info' });
            window.location.href = '/accounts/login/?next=' + encodeURIComponent(window.location.pathname);
            return;
        }
        
        try {
            const response = await fetch(`/wishlist/toggle/${productId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken(),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                const isAdded = data.added;
                
                // Update all wishlist buttons for this product
                document.querySelectorAll(`.wishlist-toggle[data-product-id="${productId}"]`).forEach(button => {
                    const heartIcon = button.querySelector('svg');
                    if (heartIcon) {
                        if (isAdded) {
                            heartIcon.setAttribute('fill', 'currentColor');
                            heartIcon.classList.add('text-red-500');
                            heartIcon.classList.remove('text-gray-600', 'text-gray-400');
                        } else {
                            heartIcon.setAttribute('fill', 'none');
                            heartIcon.classList.remove('text-red-500');
                            heartIcon.classList.add('text-gray-600');
                        }
                    }
                });
                
                // Update wishlist count in navbar
                document.querySelectorAll('.wishlist-count').forEach(el => {
                    el.textContent = data.wishlist_count || 0;
                    el.classList.toggle('hidden', !data.wishlist_count);
                });
                
                // Dispatch event for other components
                window.dispatchEvent(new CustomEvent('wishlist-updated', {
                    detail: {
                        productId,
                        added: isAdded,
                        count: data.wishlist_count
                    }
                }));
                
                Toast.show({ 
                    message: data.message || (isAdded ? 'Added to wishlist' : 'Removed from wishlist'), 
                    type: 'success' 
                });
                
                // If we're on the wishlist page and item was removed, remove the card
                if (!isAdded && window.location.pathname.includes('wishlist')) {
                    const productCard = btn?.closest('[data-product-id], .group');
                    if (productCard) {
                        productCard.style.opacity = '0';
                        productCard.style.transform = 'scale(0.8)';
                        setTimeout(() => productCard.remove(), 300);
                    }
                }
            } else {
                throw new Error(data.error || 'Failed to update wishlist');
            }
        } catch (error) {
            Toast.show({ message: error.message || 'Failed to update wishlist', type: 'error' });
        }
    },
    
    /**
     * Show quick view modal
     */
    async showQuickView(productSlug) {
        try {
            const response = await fetch(`/api/products/${productSlug}/`);
            const product = await response.json();
            
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-end p-4">
                        <button class="close-modal text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="grid md:grid-cols-2 gap-8 p-6 pt-0">
                        <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                            <img src="${product.image || '/static/images/placeholder.jpg'}" alt="${product.name}" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${product.name}</h2>
                            <div class="flex items-center gap-2 mb-4">
                                <span class="text-2xl font-bold text-gray-900 dark:text-white">${this.currency.symbol}${parseFloat(product.price).toLocaleString()}</span>
                                ${product.compare_at_price ? `<span class="text-lg text-gray-400 line-through">${this.currency.symbol}${parseFloat(product.compare_at_price).toLocaleString()}</span>` : ''}
                            </div>
                            <p class="text-gray-600 dark:text-gray-400 mb-6">${product.short_description || ''}</p>
                            <div class="flex gap-4">
                                <button class="add-to-cart-btn flex-1 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors" data-product-id="${product.id}">
                                    Add to Cart
                                </button>
                                <a href="/products/${product.slug}/" class="flex-1 py-3 border border-primary-600 text-primary-600 rounded-xl text-center hover:bg-primary-50 transition-colors">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.classList.add('overflow-hidden');
            
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
                document.body.classList.remove('overflow-hidden');
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    document.body.classList.remove('overflow-hidden');
                }
            });
            
        } catch (error) {
            Toast.show({ message: 'Failed to load product', type: 'error' });
        }
    },
    
    /**
     * Event emitter methods
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    },
    
    off(event, callback) {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event).filter(cb => cb !== callback);
            this.events.set(event, callbacks);
        }
    },
    
    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    },
    
    /**
     * Get CSRF token
     */
    getCSRFToken() {
        const cookie = document.cookie.match(/csrftoken=([^;]+)/);
        return cookie ? cookie[1] : '';
    },
    
    /**
     * Format price
     */
    formatPrice(amount) {
        return `${this.currency.symbol}${parseFloat(amount).toLocaleString()}`;
    },
    
    /**
     * Show toast message (convenience method)
     */
    showToast(message, type = 'info') {
        Toast.show({ message, type });
    },
    
    /**
     * Debug logger
     */
    log(...args) {
        if (this.debug) {
            console.log('[Bunoraa]', ...args);
        }
    }
};

/**
 * Utility: Debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    BunoraaApp.init();
});

// Export for external access
window.BunoraaApp = BunoraaApp;

export { BunoraaApp, debounce, throttle };

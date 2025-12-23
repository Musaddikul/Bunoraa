(function () {
    'use strict';




    // Read config
    const configEl = document.getElementById('header-config');
    let cfg = {};
    try {
        if (configEl) cfg = JSON.parse(configEl.textContent || '{}');
    } catch (e) {
        console.error('Invalid header config JSON', e);
    }

    const mountPoint = document.querySelector('[data-js-header]') || document.getElementById('main-header');
    if (!mountPoint) {
        console.error('[HEADER] No mount point found for header!');
        return;
    }

    // Route helper (populated by server via auth-state.js)
    const routeMap = window.BUNORAA_ROUTES || {};
    const routePlaceholder = window.BUNORAA_ROUTE_PLACEHOLDER || '__slug__';
    const buildRoute = (name, value) => {
        const template = routeMap[name];
        if (!template) return '#';
        if (value === undefined || value === null) return template;
        return template.replace(routePlaceholder, encodeURIComponent(value));
    };

    // Build the header HTML (structure kept identical to server-rendered version)
    const html = `
    <div class="sticky top-0 inset-x-0 z-40 border-b border-stone-200/70 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.05)] supports-[backdrop-filter]:bg-white/70 dark:border-stone-700/70 dark:bg-stone-900/95 dark:supports-[backdrop-filter]:bg-stone-900/70">
        <div class="bg-white/90 dark:bg-stone-900/90">
            <div class="container mx-auto px-4">
                <div class="flex items-center gap-4 py-2">
                    <!-- Left: mobile menu + logo -->
                    <div class="flex items-center gap-3">
                        <button type="button" data-mobile-menu-toggle class="lg:hidden p-2.5 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-stone-300" aria-label="Open menu">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <a href="${buildRoute('home')}" class="inline-flex items-center gap-3" aria-label="Homepage">
                            <img data-site-logo class="h-10 w-auto dark:hidden" src="" alt=""/>
                            <img data-site-logo-dark class="h-10 w-auto hidden dark:block" src="" alt=""/>

                            <span class="sr-only" data-site-name></span>
                        </a>
                    </div>

                    <!-- Center: nav + search -->
                    <div class="flex-1 flex items-center gap-4">
                        <nav class="hidden lg:flex items-center gap-2" aria-label="Primary">
                            <ul id="main-nav" class="flex items-center gap-2 h-10 overflow-x-auto scrollbar-hide">
                                <!-- Categories loaded via JS -->
                            </ul>
                        </nav>

                        <div class="flex-1 max-w-2xl">
                            <div class="relative">
                                <input id="header-search-input" name="q" type="search" placeholder="Search for products, collections, categories..." class="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition bg-white dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100" aria-autocomplete="list" aria-controls="header-search-suggestions" aria-expanded="false" aria-haspopup="listbox" />
                                <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>

                                <div id="header-search-suggestions" role="listbox" aria-label="Search suggestions" class="hidden absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
                                    <div data-suggestions class="divide-y divide-stone-100 dark:divide-stone-700"></div>
                                    <div class="p-3 text-xs text-stone-400 dark:text-stone-500">Press Enter to search, use ↑↓ to navigate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right actions -->
                    <div class="flex items-center gap-2">
                        <button id="theme-toggle" class="p-2.5 rounded-lg text-stone-700 hover:bg-stone-100 dark:text-stone-300" aria-label="Toggle theme" aria-pressed="false">
                            <svg id="theme-toggle-light-icon" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 4a1 1 0 011-1V2a1 1 0 10-2 0v1a1 1 0 011 1zM15.657 5.343a1 1 0 011.414 0l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 000 1.414zM18 11h1a1 1 0 100-2h-1a1 1 0 100 2zM15.657 16.657a1 1 0 001.414 1.414l.707-.707a1 1 0 10-1.414-1.414l-.707.707zM10 18a1 1 0 011 1v1a1 1 0 10-2 0v-1a1 1 0 011-1zM4.343 16.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707zM2 11H1a1 1 0 100 2h1a1 1 0 100-2zM4.343 5.343a1 1 0 10-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707zM10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>
                            <svg id="theme-toggle-dark-icon" class="w-5 h-5 hidden" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8 8 0 1010.586 10.586z"/></svg>
                        </button>

                        <div class="relative hidden lg:block">
                            <button id="currency-toggle" class="dropdown-toggle p-2 rounded-lg text-stone-700 hover:bg-stone-100" aria-haspopup="menu" aria-expanded="false">
                                <span id="current-currency" class="font-medium">USD</span>
                            </button>
                            <div id="currency-dropdown" class="dropdown-menu hidden absolute right-0 mt-2 bg-stone-100 dark:bg-stone-700 rounded-xl shadow-lg border-2 border-stone-200 dark:border-stone-700 py-2 min-w-[140px]" role="menu" aria-hidden="true"></div>
                        </div>

                        <div class="relative">
                            <button class="p-2 rounded-full" aria-haspopup="menu" aria-expanded="false" id="account-toggle">
                                <div data-account-placeholder></div>
                            </button>
                            <div id="account-dropdown" class="dropdown-menu hidden absolute right-0 mt-2 bg-stone-100 dark:bg-stone-700 rounded-2xl shadow-lg border-2 border-stone-200 dark:border-stone-700 py-2 min-w-[220px]"></div>
                        </div>
                    
                    <!-- Wishlist -->
                    <a href="${buildRoute('wishlistList')}" class="relative p-2.5 text-stone-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-stone-300 dark:hover:text-rose-400 dark:hover:bg-rose-950 dark:focus-visible:ring-rose-400" aria-label="Wishlist">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span data-wishlist-count class="hidden absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">0</span>
                    </a>
                    
                    <!-- Cart -->
                    <button type="button" data-cart-open class="relative p-2.5 text-stone-700 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-stone-300 dark:hover:text-amber-400 dark:hover:bg-amber-950 dark:focus-visible:ring-amber-400" aria-label="Cart">
                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <span data-cart-count class="hidden absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">0</span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Secondary navigation (featured categories + actions) -->
        <nav class="hidden lg:block border-t border-stone-200/60 bg-white/80 dark:border-stone-700/60 dark:bg-stone-900/80" data-main-nav>
            <div class="container mx-auto px-4">
                <div class="flex items-center h-10">
                    <ul id="featured-nav-list" class="flex items-center gap-1 mx-auto overflow-x-auto scrollbar-hide"></ul>
                    <div class="ml-4 flex items-center gap-2">
                        <a href="${buildRoute('productsList')}" class="inline-flex items-center px-3 py-2 text-stone-700 hover:text-amber-700 hover:bg-amber-50 font-medium text-sm rounded-lg transition-all dark:text-stone-300 dark:hover:text-amber-300 dark:hover:bg-stone-700">
                            All Products
                        </a>
                        <a href="${buildRoute('productsSale')}" class="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold text-sm rounded-lg transition-all dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-stone-700">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clip-rule="evenodd"/></svg>
                            Sale
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </div>

    <!-- Mobile Menu -->
    <div data-mobile-menu class="hidden fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" data-mobile-menu-close></div>
        <div class="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto dark:bg-stone-900">
            <div class="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <img data-mobile-site-logo class="h-8 w-auto" src="" alt="">
                    <span class="text-xl font-display font-bold" data-mobile-site-name></span>
                </div>
                <button data-mobile-menu-close class="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close menu">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <!-- Mobile Search -->
            <div class="p-4 bg-stone-50 border-b border-stone-200">
                <form action="${buildRoute('productsSearch')}" method="GET" class="relative">
                    <input type="search" name="q" placeholder="Search handcrafted items..." class="w-full px-4 py-3 pl-11 border-2 border-stone-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all bg-white">
                    <svg class="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </form>
            </div>
            
            <!-- Mobile Navigation -->
            <nav id="mobile-nav" class="p-4">
                <!-- Categories loaded via JS -->
            </nav>
            
            <!-- Mobile Quick Links -->
            <div class="px-4 py-3 border-t border-stone-100">
                <p class="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Quick Links</p>
                <div class="space-y-1">
                    <a href="${buildRoute('preordersLanding')}" class="flex items-center gap-3 py-2.5 px-3 text-purple-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors font-medium">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        Custom Orders
                    </a>
                    <a href="${buildRoute('ordersTrack')}" class="flex items-center gap-3 py-2.5 px-3 text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        Track Order
                    </a>
                    <a href="${buildRoute('pagesFaq')}" class="flex items-center gap-3 py-2.5 px-3 text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Help & FAQ
                    </a>
                    <a href="${buildRoute('pagesContact')}" class="flex items-center gap-3 py-2.5 px-3 text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        Contact Us
                    </a>
                </div>
            </div>
            
            <!-- Mobile Account -->
            <div id="mobile-account" class="p-4 border-t border-stone-200 bg-stone-50">
                <!-- Account links loaded via JS -->
            </div>
        </div>
    </div>
    `;


    try {
        mountPoint.innerHTML = html;
    } catch (e) {
        console.error('[HEADER] Error setting innerHTML:', e);
    }

    // Initialize header functionality immediately since header is now rendered
    populatePlaceholders();
    setupInteractivity();
    ensureAuxiliaryContainers();
    loadCurrencies();

    // Fill placeholders (logo, site name, account display, mobile versions)
    function populatePlaceholders() {
        // Site logo and name
        const logo = mountPoint.querySelector('[data-site-logo]');
        const logoDark = mountPoint.querySelector('[data-site-logo-dark]');
        const siteNameEl = mountPoint.querySelector('[data-site-name]');
        if (logo && logoDark) {
            if (cfg.siteLogo) {
                logo.src = cfg.siteLogo;
                logo.alt = cfg.siteName || '';
                logoDark.src = cfg.siteLogoDark || cfg.siteLogo;
                logoDark.alt = cfg.siteName || '';
            } else {
                // No placeholder or fallback: remove image elements so no mock is shown
                logo.remove();
                logoDark.remove();
            }
        }
        if (siteNameEl) siteNameEl.textContent = cfg.siteName || '';

        // Mobile versions
        const mobileLogo = document.querySelector('[data-mobile-site-logo]');
        const mobileSiteName = document.querySelector('[data-mobile-site-name]');
        if (mobileLogo) {
            if (cfg.siteLogo) {
                mobileLogo.src = cfg.siteLogo;
                mobileLogo.alt = cfg.siteName || '';
            } else {
                // Remove to avoid showing mock/fallback
                mobileLogo.remove();
            }
        }
        if (mobileSiteName) mobileSiteName.textContent = cfg.siteName || '';

        // Account placeholder
        const accSpot = mountPoint.querySelector('[data-account-placeholder]');
        if (accSpot) {
            if (cfg.authenticated) {
                if (cfg.userAvatar) {
                    accSpot.innerHTML = `<img src="${cfg.userAvatar}" alt="${cfg.userFirstName || 'U'}" class="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/50">`;
                } else {
                    // No placeholder/fallback when authenticated without an avatar — keep empty to avoid mock visuals
                    accSpot.innerHTML = '';
                }
                // Mobile account links
                const mobileAccount = document.getElementById('mobile-account');
                if (mobileAccount) {
                    mobileAccount.innerHTML = `
                        <a href="${buildRoute('accountsProfile')}" class="block py-2 px-3 rounded-lg hover:bg-stone-100">Profile</a>
                        <a href="${buildRoute('ordersList')}" class="block py-2 px-3 rounded-lg hover:bg-stone-100">Orders</a>
                        <a href="${buildRoute('accountsLogout')}" class="block py-2 px-3 rounded-lg hover:bg-stone-100">Sign out</a>
                    `;
                }

                // Populate desktop account dropdown
                const accountDropdown = mountPoint.querySelector('#account-dropdown');
                const accountToggle = mountPoint.querySelector('#account-toggle');
                    if (accountDropdown) {
                    accountDropdown.innerHTML = `
                        <a href="${buildRoute('accountsProfile')}" class="block px-4 py-2 hover:bg-stone-100" role="menuitem">Profile</a>
                        <a href="${buildRoute('ordersList')}" class="block px-4 py-2 hover:bg-stone-100" role="menuitem">Orders</a>
                        <a href="${buildRoute('accountsLogout')}" class="block px-4 py-2 hover:bg-stone-100" role="menuitem">Sign out</a>
                    `;
                    if (accountToggle) {
                        // Mark as collapsed; actual click listener is attached in setupInteractivity()
                        accountToggle.setAttribute('aria-expanded', 'false');
                        accountDropdown.setAttribute('aria-hidden', 'true');
                    }
                }
            } else {
                // No placeholder avatar for unauthenticated users; keep header minimal
                accSpot.innerHTML = '';

                const mobileAccount = document.getElementById('mobile-account');
                if (mobileAccount) {
                    mobileAccount.innerHTML = `
                        <a href="${buildRoute('accountsLogin')}" class="block py-2 px-3 rounded-lg hover:bg-stone-100">Sign in</a>
                        <a href="${buildRoute('accountsRegister')}" class="block py-2 px-3 rounded-lg hover:bg-stone-100">Create account</a>
                    `;
                }

                // Desktop account dropdown for unauthenticated users
                const accountDropdown = mountPoint.querySelector('#account-dropdown');
                const accountToggle = mountPoint.querySelector('#account-toggle');
                if (accountDropdown) {
                    accountDropdown.innerHTML = `
                        <a href="${buildRoute('accountsLogin')}" class="block px-4 py-2 hover:bg-stone-100">Sign in</a>
                        <a href="${buildRoute('accountsRegister')}" class="block px-4 py-2 hover:bg-stone-100">Create account</a>
                    `;
                    if (accountToggle) {
                        // Mark as collapsed; listener attached in setupInteractivity()
                        accountToggle.setAttribute('aria-expanded', 'false');
                        accountDropdown.setAttribute('aria-hidden', 'true');
                    }
                }
            }
        }
    }

    // Minimal interactive behaviors needed immediately: mobile menu open/close, mobile-search toggle, mobile search close, theme toggle
    function setupInteractivity() {
        // Mobile menu
        const mobileMenu = document.querySelector('[data-mobile-menu]');
        const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
        const menuClose = document.querySelectorAll('[data-mobile-menu-close]');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.remove('hidden');
            });
            menuClose.forEach(btn => btn.addEventListener('click', () => mobileMenu.classList.add('hidden')));
        }

        // Mobile search overlay
        const mobileSearchOverlay = document.getElementById('mobile-search-overlay');
        const mobileSearchToggle = document.getElementById('mobile-search-toggle');
        const mobileSearchClose = document.getElementById('mobile-search-close');
        if (mobileSearchToggle && mobileSearchOverlay) {
            mobileSearchToggle.addEventListener('click', () => {
                mobileSearchOverlay.classList.remove('hidden');
            });
        }
        if (mobileSearchClose && mobileSearchOverlay) {
            mobileSearchClose.addEventListener('click', () => {
                mobileSearchOverlay.classList.add('hidden');
            });
        }



        // --- Search suggestions and keyboard navigation ---
        const debounce = (fn, wait = 180) => {
            let t;
            return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
        };

        const searchInput = document.getElementById('header-search-input');
        const suggestionsBox = document.getElementById('header-search-suggestions');
        const suggestionsList = suggestionsBox?.querySelector('[data-suggestions]');
        let suggestionItems = [];
        let activeIndex = -1;

        async function fetchSuggestions(query) {
            if (!query || query.length < 2) return [];
            try {
                if (window.SearchApi && typeof window.SearchApi.suggest === 'function') {
                    const r = await SearchApi.suggest(query);
                    return Array.isArray(r) ? r : (r.results || r.data || []);
                }
                const resp = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
                if (!resp.ok) return [];
                const data = await resp.json();
                return data.results || data || [];
            } catch (e) {
                return [];
            }
        }

        function escapeHtmlFn(s){
            if (!s) return '';
            return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
        }

        function renderSuggestions(items) {
            if (!suggestionsBox || !suggestionsList) return;
            suggestionItems = items || [];
            if (!items.length) {
                suggestionsBox.classList.add('hidden');
                searchInput?.setAttribute('aria-expanded','false');
                suggestionsList.innerHTML = '';
                activeIndex = -1;
                return;
            }
            suggestionsList.innerHTML = items.slice(0,8).map((it, idx) => {
                const title = it.title || it.name || it.label || it;
                const url = it.url || (it.slug ? buildRoute('productDetail', it.slug) : `${buildRoute('productsSearch')}?q=${encodeURIComponent(title)}`);
                return `<a role="option" tabindex="-1" data-idx="${idx}" href="${escapeHtmlFn(url)}" class="block px-4 py-3 hover:bg-amber-50 dark:hover:bg-stone-700 text-sm">${escapeHtmlFn(title)}</a>`;
            }).join('');
            suggestionsBox.classList.remove('hidden');
            searchInput?.setAttribute('aria-expanded','true');
            activeIndex = -1;
        }

        const debouncedFetch = debounce(async (val) => {
            const items = await fetchSuggestions(val);
            renderSuggestions(items);
        }, 180);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                debouncedFetch(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                const opts = suggestionsList?.querySelectorAll('[role="option"]') || [];
                if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, opts.length - 1); updateActive(); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); updateActive(); }
                else if (e.key === 'Enter') { if (activeIndex >= 0 && opts[activeIndex]) { e.preventDefault(); opts[activeIndex].click(); } }
                else if (e.key === 'Escape') { clearSuggestions(); }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('#header-search-suggestions') && !e.target.closest('#header-search-input')) clearSuggestions();
            });
        }

        function updateActive() {
            const opts = suggestionsList?.querySelectorAll('[role="option"]') || [];
            opts.forEach((el, i) => el.classList.toggle('bg-amber-50', i === activeIndex));
            if (opts[activeIndex]) opts[activeIndex].focus();
        }

        function clearSuggestions() {
            if (suggestionsBox) {
                suggestionsBox.classList.add('hidden');
                searchInput?.setAttribute('aria-expanded','false');
                suggestionsList.innerHTML = '';
                activeIndex = -1;
            }
        }

        // --- Mobile menu focus trap ---
        function trapFocus(container) {
            const focusable = container.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return () => {};
            const first = focusable[0], last = focusable[focusable.length - 1];
            function onKey(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                } else if (e.key === 'Escape') {
                    closeMobileMenu();
                }
            }
            container.addEventListener('keydown', onKey);
            return () => container.removeEventListener('keydown', onKey);
        }

        let removeTrap = null;
        function openMobileMenu() {
            mobileMenu.classList.remove('hidden');
            const cleanup = trapFocus(mobileMenu);
            if (cleanup) removeTrap = cleanup;
            mobileMenu.querySelector('[data-mobile-menu-close]')?.focus();
        }
        function closeMobileMenu() {
            mobileMenu.classList.add('hidden');
            if (removeTrap) removeTrap(); removeTrap = null; menuToggle?.focus();
        }

        if (menuToggle && mobileMenu) {
            // override to use focus trap
            menuToggle.replaceWith(menuToggle.cloneNode(true));
            const newToggle = document.querySelector('[data-mobile-menu-toggle]');
            newToggle.addEventListener('click', openMobileMenu);
            menuClose.forEach(btn => btn.addEventListener('click', closeMobileMenu));
        }

        // Currency & account toggle behavior
        const currencyToggle = mountPoint.querySelector('#currency-toggle');
        const currencyDropdownEl = mountPoint.querySelector('#currency-dropdown');
        const accountToggle = mountPoint.querySelector('#account-toggle');
        const accountDropdown = mountPoint.querySelector('#account-dropdown');
        // Flag to temporarily suppress global close handler when toggling account dropdown
        let accountSuppressClose = false;
        if (currencyToggle && currencyDropdownEl) {
            currencyToggle.setAttribute('aria-expanded', 'false');
            currencyDropdownEl.setAttribute('aria-hidden', 'true');
            currencyToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = !currencyDropdownEl.classList.contains('hidden');
                currencyDropdownEl.classList.toggle('hidden');
                currencyDropdownEl.setAttribute('aria-hidden', String(isOpen));
                currencyToggle.setAttribute('aria-expanded', String(!isOpen));
                if (!isOpen) {
                    currencyDropdownEl.style.zIndex = 9999;
                    const btn = currencyDropdownEl.querySelector('[data-currency]');
                    if (btn) btn.focus();
                }
            });
        }

        // Account dropdown helpers (delegated to survive DOM replacements)
        function openAccountDropdown() {
            if (!accountDropdown || !accountToggle) return;
            // if already open nothing to do
            if (!accountDropdown.classList.contains('hidden') && accountDropdown._floated) return;
            try { floatDropdownToBody(accountDropdown, accountToggle); } catch (err) { accountDropdown.classList.remove('hidden'); }
            accountDropdown.style.zIndex = 9999;
            accountDropdown.querySelector('a')?.focus();
            accountToggle.setAttribute('aria-expanded', 'true');
            accountDropdown.setAttribute('aria-hidden', 'false');
            // Ensure visible (in some race conditions the 'hidden' class may remain)
            accountDropdown.classList.remove('hidden');
            // Temporarily suppress global document-level close handler to avoid race closing
            accountSuppressClose = true;
            setTimeout(() => { accountSuppressClose = false; }, 300);
        }

        function closeAccountDropdown() {
            if (!accountDropdown || !accountToggle) return;
            if (accountDropdown._floated) restoreDropdown(accountDropdown);
            accountDropdown.classList.add('hidden');
            accountToggle.setAttribute('aria-expanded', 'false');
            accountDropdown.setAttribute('aria-hidden', 'true');
        }

        // Delegated toggle handler for account and currency toggles
        if (mountPoint) {
            mountPoint.addEventListener('click', (ev) => {
                const at = ev.target.closest && ev.target.closest('#account-toggle');
                if (at) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    const isOpen = accountDropdown && !accountDropdown.classList.contains('hidden');
                    if (isOpen) closeAccountDropdown(); else openAccountDropdown();
                    return;
                }

                const ct = ev.target.closest && ev.target.closest('#currency-toggle');
                if (ct) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    const isOpen = currencyDropdownEl && !currencyDropdownEl.classList.contains('hidden');
                    if (isOpen) {
                        if (currencyDropdownEl._floated) restoreDropdown(currencyDropdownEl);
                        currencyDropdownEl.classList.add('hidden');
                        currencyToggle?.setAttribute('aria-expanded', 'false');
                        currencyDropdownEl.setAttribute('aria-hidden', 'true');
                    } else {
                        try { floatDropdownToBody(currencyDropdownEl, currencyToggle); } catch (err) { currencyDropdownEl.classList.remove('hidden'); }
                        currencyDropdownEl.style.zIndex = 9999;
                        currencyDropdownEl.querySelector('[data-currency]')?.focus();
                        currencyDropdownEl.setAttribute('aria-hidden', 'false');
                        currencyToggle?.setAttribute('aria-expanded', 'true');
                    }
                    return;
                }
            });

            // Keyboard accessibility: open on Enter/Space for account toggle
            mountPoint.addEventListener('keydown', (e) => {
                const at = e.target.closest && e.target.closest('#account-toggle');
                if (at && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    e.stopPropagation();
                    at.click();
                }
            });
        }

        // Helper: move dropdown element to body and position it under `toggle`
        const _DEBUG_DROPDOWNS = false; // disable diagnostic logs in production
        function debugAndHighlightDropdown(dropdownEl, name) {
            if (!_DEBUG_DROPDOWNS || !dropdownEl) return;
            try {
                const cs = window.getComputedStyle(dropdownEl);
                let node = dropdownEl.parentElement;
                while (node) {
                    const anc = window.getComputedStyle(node);
                    node = node.parentElement;
                }
                // Visual highlight
                dropdownEl.style.outline = '3px solid rgba(255,0,0,0.9)';
                dropdownEl.style.zIndex = '999999';
                setTimeout(() => { dropdownEl.style.outline = ''; if (!dropdownEl._floated) dropdownEl.style.zIndex = ''; }, 4000);
            } catch (err) {
                console.warn('debugAndHighlightDropdown error', err);
            }
        }

        function floatDropdownToBody(dropdownEl, toggleEl) {
            if (!dropdownEl || !toggleEl) return;
            // If already floated, ensure visible
            if (dropdownEl._floated) {
                dropdownEl.classList.remove('hidden');
                return;
            }
            // Save original location so we can restore later
            dropdownEl._originalParent = dropdownEl.parentNode;
            dropdownEl._originalNextSibling = dropdownEl.nextSibling;

            // Temporarily show invisibly to measure
            const wasHidden = dropdownEl.classList.contains('hidden');
            dropdownEl.classList.remove('hidden');
            dropdownEl.style.visibility = 'hidden';
            dropdownEl.style.display = 'block';

            // Append to body and set absolute positioning
            document.body.appendChild(dropdownEl);
            dropdownEl.style.position = 'absolute';
            dropdownEl.style.right = 'auto';
            dropdownEl.style.left = '0px';
            dropdownEl.style.top = '0px';

            // Measure and position under toggle
            const tRect = toggleEl.getBoundingClientRect();
            const elW = dropdownEl.offsetWidth || 200;
            let left = Math.round(tRect.right - elW + window.scrollX);
            if (left < 8) left = 8;
            const top = Math.round(window.scrollY + tRect.bottom + 6);
            dropdownEl.style.left = left + 'px';
            dropdownEl.style.top = top + 'px';

            // Make visible
            dropdownEl.style.visibility = '';
            if (wasHidden) dropdownEl.classList.remove('hidden');
            dropdownEl._floated = true;
            debugAndHighlightDropdown(dropdownEl, 'floated-dropdown');
        }

        function restoreDropdown(dropdownEl) {
            if (!dropdownEl || !dropdownEl._floated) return;
            // Remove inline positioning styles
            dropdownEl.style.position = '';
            dropdownEl.style.left = '';
            dropdownEl.style.top = '';
            dropdownEl.style.right = '';
            // Move back to original parent if available
            if (dropdownEl._originalParent) {
                if (dropdownEl._originalNextSibling && dropdownEl._originalNextSibling.parentNode === dropdownEl._originalParent) {
                    dropdownEl._originalParent.insertBefore(dropdownEl, dropdownEl._originalNextSibling);
                } else {
                    dropdownEl._originalParent.appendChild(dropdownEl);
                }
            }
            // Ensure display/visibility restored
            dropdownEl.style.display = '';
            dropdownEl.style.visibility = '';
            dropdownEl._floated = false;
            // Remove highlight
            dropdownEl.style.outline = ''; 
        }

        // Ensure global click listener closes dropdowns
        document.addEventListener('click', (e) => {
            // If we are suppressing account close because a toggle just opened it, ignore
            if (accountSuppressClose) {
                // suppressed
            } else {
                if (!e.target.closest('#account-dropdown') && !e.target.closest('#account-toggle')) {
                    if (accountDropdown && !accountDropdown.classList.contains('hidden')) {
                        if (accountDropdown._floated) restoreDropdown(accountDropdown);
                        accountDropdown.classList.add('hidden');
                        accountToggle?.setAttribute('aria-expanded', 'false');
                        accountDropdown.setAttribute('aria-hidden', 'true');
                    }
                }
            }

            if (!e.target.closest('#currency-dropdown') && !e.target.closest('#currency-toggle')) {
                if (currencyDropdownEl && !currencyDropdownEl.classList.contains('hidden')) {
                    if (currencyDropdownEl._floated) restoreDropdown(currencyDropdownEl);
                    currencyDropdownEl.classList.add('hidden');
                    currencyToggle?.setAttribute('aria-expanded', 'false');
                    currencyDropdownEl.setAttribute('aria-hidden', 'true');
                }
            }
            if (!e.target.closest('#header-search-suggestions') && !e.target.closest('#header-search-input')) clearSuggestions();
        });

        // Help debugging: log clicks on toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('#account-toggle')) {/* account toggle clicked */}
            if (e.target.closest('#currency-toggle')) {/* currency toggle clicked */}
        });

        // Global keyboard handling: Escape should close overlays
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
                clearSuggestions();
                if (currencyDropdownEl && !currencyDropdownEl.classList.contains('hidden')) { if (currencyDropdownEl._floated) restoreDropdown(currencyDropdownEl); currencyDropdownEl.classList.add('hidden'); if (currencyToggle) currencyToggle.setAttribute('aria-expanded','false'); currencyDropdownEl.setAttribute('aria-hidden','true'); }
                const ad = mountPoint.querySelector('#account-dropdown');
                const at = mountPoint.querySelector('#account-toggle');
                if (ad && !ad.classList.contains('hidden')) { if (ad._floated) restoreDropdown(ad); ad.classList.add('hidden'); if (at) at.setAttribute('aria-expanded','false'); ad.setAttribute('aria-hidden','true'); }
            }
        });

        // Add subtle shadow when scrolling
        const headerEl = mountPoint.querySelector('.sticky') || mountPoint;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 8) headerEl.classList.add('shadow-sm'); else headerEl.classList.remove('shadow-sm');
        });
    }

    // Mobile menu + search overlay elements are expected lower in the page; ensure they exist and if not, create minimal versions
    function ensureAuxiliaryContainers() {
        // Search overlay
        if (!document.getElementById('mobile-search-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'mobile-search-overlay';
            overlay.className = 'hidden fixed inset-0 z-50 bg-white dark:bg-stone-900';
            overlay.innerHTML = `
                <div class="p-4">
                    <div class="flex items-center gap-4 mb-4">
                        <button id="mobile-search-close" class="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors" aria-label="Close search">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <form action="${buildRoute('productsSearch')}" method="GET" class="w-full">
                            <div class="relative">
                                <input name="q" type="search" placeholder="Search handcrafted items..." class="w-full px-4 py-3 pl-11 border-2 border-stone-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all bg-white">
                                <svg class="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        // Mobile menu
        if (!document.querySelector('[data-mobile-menu]')) {
            const menu = document.createElement('div');
            menu.setAttribute('data-mobile-menu', '');
            menu.className = 'hidden fixed inset-0 z-50 lg:hidden';
            menu.innerHTML = `
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" data-mobile-menu-close></div>
                <div class="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto dark:bg-stone-900">
                    <div class="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <img data-mobile-site-logo class="h-8 w-auto" src="" alt="">
                            <span class="text-xl font-display font-bold" data-mobile-site-name></span>
                        </div>
                        <button data-mobile-menu-close class="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close menu">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div class="p-4 bg-stone-50 border-b border-stone-200">
                        <form action="${buildRoute('productsSearch')}" method="GET" class="relative">
                            <input type="search" name="q" placeholder="Search handcrafted items..." class="w-full px-4 py-3 pl-11 border-2 border-stone-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all bg-white">
                            <svg class="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </form>
                    </div>
                    <nav id="mobile-nav" class="p-4"></nav>
                    <div class="px-4 py-3 border-t border-stone-100">
                        <p class="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Quick Links</p>
                        <div class="space-y-1">
                    <a href="${buildRoute('preordersLanding')}" class="flex items-center gap-3 py-2.5 px-3 text-purple-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-colors">Custom Orders</a>
                    <a href="${buildRoute('ordersTrack')}" class="flex items-center gap-3 py-2.5 px-3 text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">Track Order</a>
                    <a href="${buildRoute('pagesFaq')}" class="flex items-center gap-3 py-2.5 px-3 text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">Help & FAQ</a>
                    <a href="${buildRoute('pagesContact')}" class="flex items-center gap-3 py-2.5 px-3 text-stone-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">Contact Us</a>
                        </div>
                    </div>
                    <div id="mobile-account" class="p-4 border-t border-stone-200 bg-stone-50"></div>
                </div>
            `;
            document.body.appendChild(menu);
        }
    }

    // Run setup after DOM is ready enough (defer script ensures this happens before DOMContentLoaded handlers run later)
    document.addEventListener('DOMContentLoaded', async () => {
        // Notify others that header is ready
        document.dispatchEvent(new CustomEvent('header:ready'));
    });

    // Load currencies and populate currency dropdown
    async function loadCurrencies() {
        const currencyDropdown = mountPoint.querySelector('#currency-dropdown');
        const currencyDisplay = mountPoint.querySelector('#current-currency');
        if (!currencyDropdown) return;
        try {
            let resp;
            if (window.LocalizationApi && typeof window.LocalizationApi.getCurrencies === 'function') {
                resp = await window.LocalizationApi.getCurrencies();
            } else if (typeof ApiClient !== 'undefined') {
                // Use ApiClient so BASE_URL (/api/v1) is respected
                const apiResp = await ApiClient.get('/currencies/');
                resp = apiResp.data || apiResp.results || apiResp;
            } else {
                // Fallback to explicit API v1 path
                const r = await fetch('/api/v1/currencies/');
                if (!r.ok) throw new Error(`Failed to fetch currencies: ${r.status}`);
                resp = await r.json();
            }

            const list = Array.isArray(resp) ? resp : (resp.data || resp.results || resp);
            if (!list || !list.length) throw new Error('No currencies returned from backend');

            const stored = (typeof Storage !== 'undefined' && Storage.get) ? Storage.get('selected_currency', null) : null;
            const active = stored || (list[0] && list[0].code) || 'USD';
            if (currencyDisplay) currencyDisplay.textContent = active; 

            currencyDropdown.innerHTML = list.map(cur => `
                <button class="w-full px-4 py-2.5 text-left hover:bg-amber-50 dark:hover:bg-stone-700" data-currency="${cur.code}" data-symbol="${cur.symbol}">
                    <span>${cur.code}</span>
                    <span class="text-stone-400 ml-2">${cur.symbol || ''}</span>
                </button>
            `).join('');

            currencyDropdown.addEventListener('click', async (e) => {
                const btn = e.target.closest('[data-currency]');
                if (!btn) return;
                const code = btn.dataset.currency;
                const symbol = btn.dataset.symbol;
                btn.classList.add('opacity-50');
                try {
                    if (window.LocalizationApi && typeof window.LocalizationApi.setCurrency === 'function') {
                        await window.LocalizationApi.setCurrency(code);
                    } else if (typeof ApiClient !== 'undefined') {
                        // Try to set server-side preference (requires auth)
                        await ApiClient.post('/currencies/preference/', { currency_code: code, auto_detect: false });
                    } else {
                        // Fallback: ensure cookies and CSRF header are sent
                        const getCsrfFromCookie = () => {
                            try {
                                const m = document.cookie.match(/(^|; )csrftoken=([^;]+)/);
                                return m ? decodeURIComponent(m[2]) : '';
                            } catch (e) { return ''; }
                        };
                        await fetch('/api/v1/currencies/preference/', {
                            method: 'POST',
                            credentials: 'same-origin',
                            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfFromCookie() },
                            body: JSON.stringify({ currency_code: code, auto_detect: false }),
                        });
                    }
                    try {
                        if (typeof Storage !== 'undefined' && Storage.set) {
                            Storage.set('selected_currency', code);
                            Storage.set('selected_currency_symbol', symbol || '');
                        }
                    } catch (e) { /* ignore */ }
                    if (currencyDisplay) currencyDisplay.textContent = code;
                    window.dispatchEvent(new Event('currency:changed'));
                } catch (err) {
                    console.warn('Currency change failed', err);
                } finally {
                    btn.classList.remove('opacity-50');
                }
            });
        } catch (e) {
            console.warn('Could not load currencies', e);
            currencyDropdown.innerHTML = '<div class="p-4 text-sm text-stone-500">Failed to load currencies. Please try again later.</div>';
        }
    }

})();
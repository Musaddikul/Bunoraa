// Initialize header functionality using new modules
document.addEventListener('DOMContentLoaded', async function() {
    const { $, $$, delegate } = window.DOM || {};
    const { escapeHtml } = window.Templates || {};
    const { debounce, throttle } = window.Debounce || {};
    const CategoriesApi = window.CategoriesApi;
    const LocalizationApi = window.LocalizationApi;
    const PagesApi = window.PagesApi;
    const SupportApi = window.SupportApi;
    const Storage = window.Storage;
    const routePlaceholder = window.BUNORAA_ROUTE_PLACEHOLDER || '__slug__';
    const routeMap = window.BUNORAA_ROUTES || {};
    const buildRoute = (name, value) => {
        const template = routeMap[name];
        if (!template) {
            return '#';
        }
        if (value === undefined || value === null) {
            return template;
        }
        return template.replace(routePlaceholder, encodeURIComponent(value));
    };
    
    // Initialize currency rate if needed
    const BASE_CURRENCY = 'BDT';
    const selectedCurrency = localStorage.getItem('selected_currency') || 'BDT';
    const storedRate = localStorage.getItem('currency_rate');
    
    if (selectedCurrency !== BASE_CURRENCY && (!storedRate || storedRate === '1' || storedRate === 'NaN')) {
        // Fetch exchange rate if not already stored
        if (LocalizationApi?.getExchangeRate) {
            try {
                const rate = await LocalizationApi.getExchangeRate(BASE_CURRENCY, selectedCurrency);
                if (rate && rate !== 1) {
                    localStorage.setItem('currency_rate', rate.toString());
                    if (typeof window.convertDisplayedPrices === 'function') {
                        window.convertDisplayedPrices();
                    }
                }
            } catch (error) {
                console.error('Error fetching exchange rate on init:', error);
            }
        }
    }
    
    // Load announcement
    try {
        if (PagesApi) {
            const announcements = await PagesApi.getPromotions({ type: 'announcement', active: true });
            const announcementBar = document.getElementById('announcement-bar');
            const announcementText = document.getElementById('announcement-text');
            if (announcements.data?.length > 0 && announcementText && announcementBar) {
                announcementText.innerHTML = `
                    <svg class="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span>${announcements.data[0].message || announcements.data[0].title}</span>
                `;
                announcementBar.classList.remove('hidden');
            } else {
                announcementBar?.remove();
            }
        }
    } catch {
        document.getElementById('announcement-bar')?.remove();
    }
    
    // Load navigation categories
    try {
        if (CategoriesApi) {
            const response = await CategoriesApi.getRootCategories();
            const featuredResp = await CategoriesApi.getFeatured(6);
            const categories = Array.isArray(response) ? response : (response.data || response.results || []);
            const featuredCategories = Array.isArray(featuredResp) ? featuredResp : (featuredResp.data || featuredResp.results || []);
            const mainNav = document.getElementById('main-nav');
            const featuredNavList = document.getElementById('featured-nav-list');
            const mobileNav = document.getElementById('mobile-nav');
            const footerCats = document.getElementById('footer-categories');
            
            if (Array.isArray(categories) && categories.length > 0 && mainNav) {
                const navHtml = categories.map(cat => `
                    <li>
                        <a href="${buildRoute('categoryDetail', cat.slug)}" class="inline-flex items-center px-3 py-2 text-stone-700 hover:text-amber-700 hover:bg-amber-50 font-medium text-sm rounded-lg transition-all dark:text-stone-300 dark:hover:text-amber-300 dark:hover:bg-stone-700" data-category-id="${cat.id}">
                            ${escapeHtml ? escapeHtml(cat.name) : cat.name}
                        </a>
                    </li>
                `).join('');
                
                mainNav.innerHTML = navHtml + `
                    <li>
                        <a href="${buildRoute('preordersLanding')}" class="inline-flex items-center gap-1.5 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold text-sm rounded-lg transition-all dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-stone-700">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Custom Orders
                        </a>
                    </li>
                `;
            }
        
            // Mobile nav
            if (Array.isArray(categories) && categories.length > 0 && mobileNav) {
                mobileNav.innerHTML = `
                    <p class="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Categories</p>
                    ${categories.map(cat => `
                        <a href="${buildRoute('categoryDetail', cat.slug)}" class="flex items-center gap-3 py-3 px-3 text-stone-800 font-medium hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors border-b border-stone-100 last:border-0">
                            ${cat.icon ? `<span class="text-lg">${cat.icon}</span>` : `<span class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 text-sm font-bold">${(cat.name || '').charAt(0)}</span>`}
                            ${escapeHtml ? escapeHtml(cat.name) : cat.name}
                        </a>
                    `).join('')}
                    <a href="${buildRoute('productsList')}" class="flex items-center gap-3 py-3 px-3 mt-2 text-amber-700 font-semibold hover:bg-amber-50 rounded-xl transition-colors">
                        <span class="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                        </span>
                        View All Products
                    </a>
                `;
            }
            
            // Footer categories
            if (Array.isArray(categories) && categories.length > 0 && footerCats) {
                footerCats.innerHTML = categories.slice(0, 6).map(cat => `
                    <li><a href="${buildRoute('categoryDetail', cat.slug)}" class="text-stone-400 hover:text-amber-400 transition-colors">${escapeHtml ? escapeHtml(cat.name) : cat.name}</a></li>
                `).join('') + `<li><a href="${buildRoute('productsList')}" class="text-amber-400 hover:text-amber-300 font-medium transition-colors">View All →</a></li>`;
            }

            // Featured nav (second header row)
            if (Array.isArray(featuredCategories) && featuredCategories.length > 0 && featuredNavList) {
                featuredNavList.innerHTML = featuredCategories.map(cat => `
                    <li>
                        <a href="${buildRoute('categoryDetail', cat.slug)}" class="inline-flex items-center px-3 py-2 text-stone-700 hover:text-amber-700 hover:bg-amber-50 font-medium text-sm rounded-lg transition-all dark:text-stone-300 dark:hover:text-amber-300 dark:hover:bg-stone-700">
                            ${escapeHtml ? escapeHtml(cat.name) : cat.name}
                        </a>
                    </li>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
    
    // Load currencies
    try {
        if (LocalizationApi) {
            const response = await LocalizationApi.getCurrencies();
            const currencies = Array.isArray(response) ? response : (response.data || response.results || []);
            const storedCurrency = Storage?.get ? Storage.get('currency') : null;
            const storedCode = typeof storedCurrency === 'string' ? storedCurrency : storedCurrency?.code;
            const storedSymbol = typeof storedCurrency === 'object' ? storedCurrency?.symbol : null;
            const fallbackCode = typeof LocalizationApi.getCurrency === 'function' ? LocalizationApi.getCurrency() : null;
            const currentCurrency = {
                code: storedCode || fallbackCode || 'USD',
                symbol: storedSymbol || null
            };
            const currencyDisplay = document.getElementById('current-currency');
            const currencyDropdown = document.getElementById('currency-dropdown');

            if (currencyDisplay && currentCurrency.code) {
                currencyDisplay.textContent = currentCurrency.code;
            }

            if (Array.isArray(currencies) && currencies.length > 0 && currencyDropdown) {
                const activeMeta = currencies.find(cur => cur.code === currentCurrency.code) || currencies[0];

                if (activeMeta && (!storedCurrency || !currentCurrency.symbol)) {
                    currentCurrency.symbol = activeMeta.symbol;
                    if (Storage?.set) {
                        Storage.set('currency', { code: currentCurrency.code, symbol: currentCurrency.symbol });
                    }
                }

                currencyDropdown.innerHTML = currencies.map(cur => {
                    const isActive = cur.code === currentCurrency.code;
                    return `
                        <button class="w-full px-4 py-2.5 text-left hover:bg-amber-50 transition-colors flex items-center justify-between ${isActive ? 'text-amber-700 bg-amber-50 font-medium dark:text-amber-300 dark:bg-stone-700' : 'text-stone-700 dark:text-stone-300'} dark:hover:bg-stone-700 dark:hover:text-amber-300" data-currency="${cur.code}" data-symbol="${cur.symbol}">
                            <span>${cur.code}</span>
                            <span class="text-stone-400 dark:text-stone-500">${cur.symbol}</span>
                        </button>
                    `;
                }).join('');

                // Currency change handler
                currencyDropdown.addEventListener('click', async (e) => {
                    const btn = e.target.closest('[data-currency]');
                    if (btn) {
                        const code = btn.dataset.currency;
                        const symbol = btn.dataset.symbol;
                        
                        // Show loading state
                        btn.classList.add('opacity-50');
                        btn.style.pointerEvents = 'none';
                        
                        // Set currency and fetch exchange rate (async)
                        await LocalizationApi.setCurrency(code);
                        
                        if (Storage?.set) {
                            Storage.set('currency', { code, symbol });
                        }
                        window.location.reload();
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error loading currencies:', error);
    }
    
    // Update account dropdown based on auth state
    const storedUser = Storage?.get('user');
    const sessionUser = window.__DJANGO_USER__ || null;
    const hasSessionAuth = !!window.__DJANGO_SESSION_AUTH__;
    const tokenAuthenticated = typeof ApiClient !== 'undefined' && typeof ApiClient.isAuthenticated === 'function'
        ? ApiClient.isAuthenticated()
        : false;

    let user = null;

    if (hasSessionAuth) {
        user = sessionUser || storedUser || null;
        if (sessionUser && !storedUser && Storage?.set) {
            Storage.set('user', sessionUser);
        }
    } else if (tokenAuthenticated) {
        user = storedUser || null;
    } else {
        if (storedUser && Storage?.remove) {
            Storage.remove('user');
        }
        user = null;
    }
    const accountDropdown = document.getElementById('account-dropdown');
    const accountName = document.getElementById('account-name');
    const mobileAccount = document.getElementById('mobile-account');

    if (user && accountName) {
        accountName.textContent = user.first_name || 'My Account';
    }

    if (accountDropdown) {
        if (user) {
            accountDropdown.innerHTML = `
                <div class="px-4 py-3 border-b border-stone-100 dark:border-stone-700">
                    <p class="text-sm text-stone-500 dark:text-stone-400">Welcome back,</p>
                    <p class="font-semibold text-stone-900 dark:text-stone-100">${escapeHtml ? escapeHtml(user.first_name || user.email) : (user.first_name || user.email)}</p>
                </div>
                <a href="${buildRoute('accountsDashboard')}" class="flex items-center gap-3 px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-amber-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Dashboard
                </a>
                <a href="${buildRoute('accountsProfile')}" class="flex items-center gap-3 px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-amber-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Profile
                </a>
                <a href="${buildRoute('ordersList')}" class="flex items-center gap-3 px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-amber-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    Orders
                </a>
                <a href="${buildRoute('wishlistList')}" class="flex items-center gap-3 px-4 py-2.5 text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-amber-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Wishlist
                </a>
                <div class="border-t border-stone-100 dark:border-stone-700 mt-2 pt-2">
                    <a href="${buildRoute('accountsLogout')}" class="flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors dark:text-rose-400 dark:hover:bg-stone-700 dark:hover:text-rose-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </a>
                </div>
            `;
        } else {
            accountDropdown.innerHTML = `
                <div class="px-4 py-4">
                    <p class="text-stone-600 dark:text-stone-400 mb-4 text-center">Welcome to Bunoraa</p>
                    <a href="${buildRoute('accountsLogin')}" class="block w-full text-center py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors mb-2">Sign In</a>
                    <a href="${buildRoute('accountsRegister')}" class="block w-full text-center py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-xl transition-colors dark:bg-stone-700 dark:hover:bg-stone-600 dark:text-stone-200">Create Account</a>
                </div>
                <div class="border-t border-stone-100 dark:border-stone-700 px-4 py-2">
                    <a href="${buildRoute('ordersTrack')}" class="flex items-center gap-2 py-2 text-stone-600 hover:text-amber-700 transition-colors text-sm dark:text-stone-400 dark:hover:text-amber-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        Track Order
                    </a>
                    <a href="${buildRoute('pagesFaq')}" class="flex items-center gap-2 py-2 text-stone-600 hover:text-amber-700 transition-colors text-sm dark:text-stone-400 dark:hover:text-amber-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Help Center
                    </a>
                </div>
            `;
        }
    }
    
    if (mobileAccount) {
        if (user) {
            mobileAccount.innerHTML = `
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg">
                        ${(user.first_name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-semibold text-stone-900">${escapeHtml ? escapeHtml(user.first_name || 'User') : (user.first_name || 'User')}</p>
                        <p class="text-sm text-stone-500">${escapeHtml ? escapeHtml(user.email) : user.email}</p>
                    </div>
                </div>
                <a href="${buildRoute('accountsDashboard')}" class="block w-full text-center py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors mb-2">My Account</a>
                    <a href="${buildRoute('accountsLogout')}" class="block w-full text-center py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-xl transition-colors">Sign Out</a>
            `;
        } else {
            mobileAccount.innerHTML = `
                <a href="${buildRoute('accountsLogin')}" class="block w-full text-center py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors mb-2">Sign In</a>
                <a href="${buildRoute('accountsRegister')}" class="block w-full text-center py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-xl transition-colors">Create Account</a>
            `;
        }
    }

    // ========== CURRENCY CONVERSION FOR SERVER-RENDERED PRICES ==========
    window.convertDisplayedPrices = function() {
        const currency = localStorage.getItem('selected_currency') || 'BDT';
        const rate = parseFloat(localStorage.getItem('currency_rate')) || 1;
        const BASE_CURRENCY = 'BDT';

        // Skip if base currency
        if (currency === BASE_CURRENCY || rate === 1) return;

        // Currency symbols map
        const currencySymbols = {
            'BDT': '৳', 'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹',
            'JPY': '¥', 'CNY': '¥', 'AUD': 'A$', 'CAD': 'C$', 'CHF': 'CHF'
        };
        const symbol = currencySymbols[currency] || currency + ' ';

        // Find all price elements with data-price attribute
        document.querySelectorAll('.price-display[data-price]').forEach(el => {
            const originalPrice = parseFloat(el.dataset.price);
            if (isNaN(originalPrice)) return;

            const convertedPrice = originalPrice * rate;

            // Format the price
            try {
                const formatted = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }).format(convertedPrice);
                el.textContent = formatted;
            } catch (e) {
                // Fallback formatting
                el.textContent = symbol + convertedPrice.toFixed(2);
            }
        });
    };

    // Run price conversion on page load
    window.convertDisplayedPrices && window.convertDisplayedPrices();

});











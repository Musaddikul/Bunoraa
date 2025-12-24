// New header implementation
(function() {
    'use strict';

    // --- UTILS ---
    function E(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        for (const key in attributes) {
            if (key === 'class') {
                element.className = attributes[key];
            } else if (key.startsWith('on')) {
                element.addEventListener(key.substring(2).toLowerCase(), attributes[key]);
            } else if (key.startsWith('data-')) {
                const dataKey = key.substring(5).replace(/-(\w)/g, (match, letter) => letter.toUpperCase());
                element.dataset[dataKey] = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        return element;
    }
    
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function getResults(response) {
        if (!response || !response.data) return [];
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.data.results)) return response.data.results;
        return [];
    }

    // --- CONFIG & STATE ---
    const mountPoint = document.getElementById('main-header');
    const config = JSON.parse(document.getElementById('header-config')?.textContent || '{}');
    const user = JSON.parse(document.getElementById('user-json')?.textContent || 'null');
    const routeMap = window.BUNORAA_ROUTES || {};
    const buildRoute = (name, slug) => {
        const template = routeMap[name];
        if (!template) return '#';
        return slug ? template.replace('__slug__', encodeURIComponent(slug)) : template;
    };

    // --- API HELPERS ---
    const Api = {
        getCategories: () => window.ApiClient.get('/categories/'),
        getCurrencies: () => window.ApiClient.get('/currencies/'),
        getAnnouncements: () => window.ApiClient.get('/pages/promotions/', { params: { type: 'announcement', active: 'true' } }),
        searchProducts: (query) => window.ApiClient.get('/products/', { params: { search: query, limit: 5 } })
    };

    // --- COMPONENT RENDERING ---

    function renderHeader() {
        if (!mountPoint) {
            console.error('Header mount point not found');
            return;
        }

        const header = E('div', { class: 'sticky top-0 inset-x-0 z-40 border-b border-stone-200/70 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-stone-700/70 dark:bg-stone-900/95' }, [
            E('div', { class: 'bg-white/90 dark:bg-stone-900/90' }, [
                E('div', { class: 'container mx-auto px-4' }, [
                    E('div', { class: 'flex items-center gap-4 py-2' }, [
                        createMobileMenuToggle(),
                        createLogo(),
                        E('div', { class: 'flex-1 flex items-center gap-4' }, [
                            createNavigation(),
                            createSearch()
                        ]),
                        createRightActions()
                    ])
                ])
            ])
        ]);

        const mobileMenu = createMobileMenu();

        mountPoint.innerHTML = '';
        mountPoint.append(header, mobileMenu);
        
        // Post-render initializations
        initMobileMenu(mobileMenu);
        initDropdowns();
        initSearchBar();
        loadDynamicContent();
    }

    function createLogo() {
        return E('a', { href: buildRoute('home'), class: 'inline-flex items-center gap-3', 'aria-label': 'Homepage' }, [
            E('img', { id: 'site-logo', class: 'h-10 w-auto dark:hidden', src: config.siteLogo || '', alt: config.siteName || '' }),
            E('img', { id: 'site-logo-dark', class: 'h-10 w-auto hidden dark:block', src: config.siteLogoDark || config.siteLogo || '', alt: config.siteName || '' }),
            E('span', { class: 'sr-only' }, [config.siteName || ''])
        ]);
    }
    
    function createNavigation() {
        return E('nav', { class: 'hidden lg:flex items-center gap-2', 'aria-label': 'Primary' }, [
            E('ul', { id: 'main-nav', class: 'flex items-center gap-2 h-10 overflow-x-auto' })
        ]);
    }

    function createSearch() {
        return E('div', { class: 'flex-1 max-w-2xl' }, [
            E('div', { class: 'relative' }, [
                E('input', { id: 'header-search-input', type: 'search', placeholder: 'Search for products...', class: 'w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-stone-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition bg-white dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100' }),
                E('svg', { class: 'w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
                    E('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                ]),
                E('div', { id: 'header-search-suggestions', role: 'listbox', class: 'hidden absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden' }, [
                    E('div', { 'data-suggestions': '' }),
                    E('div', { class: 'p-3 text-xs text-stone-400 dark:text-stone-500' }, ['Press Enter to search'])
                ])
            ])
        ]);
    }

    function createRightActions() {
        return E('div', { class: 'flex items-center gap-2' }, [
            // Theme Toggle
            E('button', { id: 'theme-toggle', class: 'p-2.5 rounded-lg text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800', 'aria-label': 'Toggle theme' }, [
                E('svg', { id: 'theme-light-icon', class: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' }, [ E('path', { d: 'M10 4a1 1 0 011-1V2a1 1 0 10-2 0v1a1 1 0 011 1zM15.657 5.343a1 1 0 011.414 0l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 000 1.414zM18 11h1a1 1 0 100-2h-1a1 1 0 100 2zM15.657 16.657a1 1 0 001.414 1.414l.707-.707a1 1 0 10-1.414-1.414l-.707.707zM10 18a1 1 0 011 1v1a1 1 0 10-2 0v-1a1 1 0 011-1zM4.343 16.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707zM2 11H1a1 1 0 100 2h1a1 1 0 100-2zM4.343 5.343a1 1 0 10-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707zM10 6a4 4 0 100 8 4 4 0 000-8z' }) ]),
                E('svg', { id: 'theme-dark-icon', class: 'w-5 h-5 hidden', fill: 'currentColor', viewBox: '0 0 20 20' }, [ E('path', { d: 'M17.293 13.293A8 8 0 016.707 2.707a8 8 0 1010.586 10.586z' }) ])
            ]),
            // Mobile Search
            E('button', { id: 'mobile-search-toggle', class: 'lg:hidden p-2.5 rounded-lg text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800' }, [
                 E('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [ E('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' }) ])
            ]),
            // Currency Selector
            E('div', { class: 'relative hidden lg:block' }, [
                E('button', { id: 'currency-toggle', 'data-dropdown-toggle': 'currency-dropdown', class: 'p-2 rounded-lg text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800' }, [
                    E('span', { id: 'current-currency', class: 'font-medium' }, ['USD'])
                ]),
                E('div', { id: 'currency-dropdown', class: 'hidden absolute z-50 right-0 mt-2 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden py-2 min-w-[140px]' })
            ]),
            // Account Menu
            E('div', { class: 'relative' }, [
                E('button', { id: 'account-toggle', 'data-dropdown-toggle': 'account-dropdown', class: 'p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800' }, [
                    E('div', { id: 'account-placeholder', class: 'w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center' }, [
                        E('svg', { class: 'w-5 h-5 text-gray-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [ E('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }) ])
                    ])
                ]),
                E('div', { id: 'account-dropdown', class: 'hidden absolute z-50 right-0 mt-2 bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden py-2 min-w-[220px]' })
            ]),
            // Wishlist
            E('a', { href: buildRoute('wishlistList'), class: 'relative p-2.5 text-stone-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all dark:text-stone-300 dark:hover:text-rose-400 dark:hover:bg-rose-950' }, [
                E('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [ E('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }) ])
            ]),
            // Cart
            E('button', { 'data-cart-toggle': '', class: 'relative p-2.5 text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all dark:text-stone-300 dark:hover:text-amber-400 dark:hover:bg-amber-950' }, [
                E('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [ E('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' }) ]),
                E('span', { 'data-cart-count': '', class: 'absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center', style: 'display: none;' }, ['0'])
            ])
        ]);
    }

    function createMobileMenuToggle() {
        return E('button', { type: 'button', 'data-mobile-menu-toggle': '', class: 'lg:hidden p-2.5 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-stone-300 dark:hover:bg-stone-800', 'aria-label': 'Open menu' }, [
            E('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [ E('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 12h16M4 18h16' }) ])
        ]);
    }

    function createMobileMenu() {
        return E('div', { id: 'mobile-menu', 'data-mobile-menu': '', class: 'hidden fixed inset-0 z-50 lg:hidden' }, [
            E('div', { class: 'absolute inset-0 bg-black/60 backdrop-blur-sm', 'data-mobile-menu-close': '' }),
            E('div', { class: 'absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-stone-900 shadow-2xl overflow-y-auto' }, [
                E('div', { class: 'p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between' }, [
                    E('span', { class: 'text-xl font-bold' }, [config.siteName || 'Shop']),
                    E('button', { 'data-mobile-menu-close': '', class: 'p-2 hover:bg-white/10 rounded-lg' }, [
                        E('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [ E('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M6 18L18 6M6 6l12 12' }) ])
                    ])
                ]),
                E('nav', { id: 'mobile-nav', class: 'p-4 space-y-2' }),
                E('div', { id: 'mobile-account', class: 'p-4 border-t border-stone-200 dark:border-stone-700' })
            ])
        ]);
    }
    
    // --- DYNAMIC CONTENT LOADING ---

    async function loadDynamicContent() {
        await Promise.all([
            loadAnnouncements(),
            loadCategories(),
            loadCurrencies()
        ]);
        populateAccountMenu();
        // Dispatch a single ready event after all content is loaded
        document.dispatchEvent(new CustomEvent('header:ready'));
    }

    async function loadAnnouncements() {
        try {
            const announcementBar = document.getElementById('announcement-bar');
            const announcementText = document.getElementById('announcement-text');
            if (announcementText && announcementBar) {
                const response = await Api.getAnnouncements();
                const announcements = getResults(response);
                if (announcements.length > 0) {
                    announcementText.innerHTML = `
                        <svg class="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        <span>${announcements[0].message || announcements[0].title}</span>
                    `;
                     announcementBar.classList.remove('hidden');
                } else {
                     announcementBar.remove();
                }
            }
        } catch (err) {
            console.error('Failed to load announcements', err);
            document.getElementById('announcement-bar')?.remove();
        }
    }

    async function loadCategories() {
        const mainNav = document.getElementById('main-nav');
        const mobileNav = document.getElementById('mobile-nav');
        if (!mainNav || !mobileNav) return;

        try {
            const response = await Api.getCategories();
            const categories = getResults(response);
            
            mainNav.innerHTML = categories.slice(0, 6).map(c => `
                <li><a href="${buildRoute('categoryDetail', c.slug)}" class="px-3 py-2 text-stone-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors dark:text-stone-300 dark:hover:bg-stone-800">${c.name}</a></li>
            `).join('');
            
            mobileNav.innerHTML = categories.map(c => `
                <a href="${buildRoute('categoryDetail', c.slug)}" class="flex items-center gap-3 py-3 px-3 text-stone-800 font-medium hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors">${c.name}</a>
            `).join('');

        } catch (err) {
            console.warn('Failed to load categories', err);
        }
    }

    async function loadCurrencies() {
        const dropdown = document.getElementById('currency-dropdown');
        const display = document.getElementById('current-currency');
        if (!dropdown || !display) return;
        
        try {
            const response = await Api.getCurrencies();
            const currencies = getResults(response);
            const selectedCurrency = localStorage.getItem('selected_currency') || 'USD';
            display.textContent = selectedCurrency;

            dropdown.innerHTML = currencies.map(c => `
                <button class="w-full px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors" data-currency="${c.code}">
                    <span class="font-medium">${c.code}</span>
                    <span class="text-stone-400 ml-2">${c.symbol || ''}</span>
                </button>
            `).join('');

            dropdown.addEventListener('click', (e) => {
                const button = e.target.closest('[data-currency]');
                if (button) {
                    const code = button.dataset.currency;
                    localStorage.setItem('selected_currency', code);
                    display.textContent = code;
                    dropdown.classList.add('hidden');
                    window.dispatchEvent(new Event('currency:changed'));
                    // Optionally, reload or update prices
                    window.location.reload();
                }
            });

        } catch(err) {
            console.warn('Failed to load currencies', err);
        }
    }
    
    function populateAccountMenu() {
        const dropdown = document.getElementById('account-dropdown');
        const placeholder = document.getElementById('account-placeholder');
        const mobileAccount = document.getElementById('mobile-account');
        if (!dropdown || !placeholder || !mobileAccount) return;

        if (user?.avatar) {
            placeholder.innerHTML = `<img src="${user.avatar}" alt="${user.first_name}" class="w-full h-full rounded-full object-cover" />`;
        }

        const loggedInHtml = `
            <a href="${buildRoute('accountsProfile')}" class="block px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-700">
                <div class="font-medium">${user?.first_name} ${user?.last_name}</div>
                <div class="text-sm text-stone-500">${user?.email}</div>
            </a>
            <div class="border-t border-stone-200 dark:border-stone-700"></div>
            <a href="${buildRoute('accountsDashboard')}" class="block px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-700">Dashboard</a>
            <a href="${buildRoute('accountsProfile')}" class="block px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-700">Profile</a>
            <a href="${buildRoute('ordersList')}" class="block px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-700">Orders</a>
            <div class="border-t border-stone-200 dark:border-stone-700"></div>
            <a href="${buildRoute('accountsLogout')}" class="block px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-950 text-red-600">Logout</a>
        `;
        const guestHtml = `
            <a href="${buildRoute('accountsLogin')}" class="block px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-700">Login</a>
            <a href="${buildRoute('accountsRegister')}" class="block px-4 py-2.5 text-left hover:bg-stone-100 dark:hover:bg-stone-700">Create Account</a>
        `;
        dropdown.innerHTML = user ? loggedInHtml : guestHtml;
        
        const mobileLoggedInHtml = `
            <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg">${(user?.first_name || 'U').charAt(0)}</div>
                <div>
                    <p class="font-semibold text-stone-900">${user?.first_name}</p>
                    <p class="text-sm text-stone-500">${user?.email}</p>
                </div>
            </div>
            <a href="${buildRoute('accountsDashboard')}" class="block w-full text-center py-3 bg-amber-600 text-white font-semibold rounded-xl">My Account</a>
        `;
        const mobileGuestHtml = `
             <a href="${buildRoute('accountsLogin')}" class="block w-full text-center py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors mb-2">Sign In</a>
             <a href="${buildRoute('accountsRegister')}" class="block w-full text-center py-3 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium rounded-xl transition-colors">Create Account</a>
        `;
        mobileAccount.innerHTML = user ? mobileLoggedInHtml : mobileGuestHtml;
    }

    // --- INITIALIZATION LOGIC ---

    function initMobileMenu(menuElement) {
        const toggle = document.querySelector('[data-mobile-menu-toggle]');
        const closeButtons = menuElement.querySelectorAll('[data-mobile-menu-close]');
        toggle?.addEventListener('click', () => menuElement.classList.remove('hidden'));
        closeButtons.forEach(btn => btn.addEventListener('click', () => menuElement.classList.add('hidden')));
    }

    function initDropdowns() {
        document.addEventListener('click', e => {
            const toggle = e.target.closest('[data-dropdown-toggle]');
            
            // Close all dropdowns first
            document.querySelectorAll('[data-dropdown-toggle]').forEach(t => {
                const dropdownId = t.dataset.dropdownToggle;
                const dropdown = document.getElementById(dropdownId);
                // If the current toggle is not the one being clicked, close its dropdown
                if (t !== toggle && dropdown) {
                    dropdown.classList.add('hidden');
                }
            });

            // Then, toggle the clicked one
            if (toggle) {
                const dropdownId = toggle.dataset.dropdownToggle;
                const dropdown = document.getElementById(dropdownId);
                if (dropdown) {
                    dropdown.classList.toggle('hidden');
                }
            }
        });
    }

    function initSearchBar() {
        const input = document.getElementById('header-search-input');
        const suggestionsContainer = document.getElementById('header-search-suggestions');
        const suggestions = suggestionsContainer.querySelector('[data-suggestions]');

        if (!input || !suggestionsContainer || !suggestions) return;
        
        const debouncedSearch = debounce(async (query) => {
            if (!query) {
                suggestionsContainer.classList.add('hidden');
                return;
            }
            try {
                const results = await Api.searchProducts(query);
                const items = getResults(results);
                suggestions.innerHTML = items.map(p => `
                    <a href="${buildRoute('productDetail', p.slug)}" class="block px-4 py-3 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                        <div class="font-medium text-stone-900 dark:text-stone-100">${p.name}</div>
                        <div class="text-sm text-stone-500 dark:text-stone-400">${p.category?.name || ''}</div>
                    </a>
                `).join('') || '<div class="px-4 py-3 text-stone-500">No results found</div>';
                suggestionsContainer.classList.remove('hidden');
            } catch (err) {
                console.error('Search error', err);
            }
        }, 300);

        input.addEventListener('input', e => debouncedSearch(e.target.value.trim()));

        document.addEventListener('click', e => {
            if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.classList.add('hidden');
            }
        });
    }


    // --- SCRIPT EXECUTION ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderHeader);
    } else {
        renderHeader();
    }

})();
// New footer implementation
(function() {
    'use strict';

    // --- UTILS ---
    function E(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        for (const key in attributes) {
            if (key === 'class') element.className = attributes[key];
            else if (key.startsWith('data-')) {
                const dataKey = key.substring(5).replace(/-(\w)/g, (match, letter) => letter.toUpperCase());
                element.dataset[dataKey] = attributes[key];
            }
            else element.setAttribute(key, attributes[key]);
        }
        children.forEach(child => {
            if (typeof child === 'string') element.appendChild(document.createTextNode(child));
            else if (child instanceof Node) element.appendChild(child);
        });
        return element;
    }

    function getResults(response) {
        if (!response || !response.data) return [];
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.data.results)) return response.data.results;
        return [];
    }

    // --- CONFIG & STATE ---
    const mountPoint = document.getElementById('main-footer');
    const routeMap = window.BUNORAA_ROUTES || {};
    const buildRoute = (name, slug) => {
        const template = routeMap[name];
        if (!template) return '#';
        return slug ? template.replace('__slug__', encodeURIComponent(slug)) : template;
    };

    // --- API HELPERS ---
    const Api = {
        getSiteSettings: () => window.ApiClient.get('/pages/settings/'),
        getCategories: () => window.ApiClient.get('/categories/')
    };

    // --- RENDER ---
    async function renderFooter() {
        if (!mountPoint) {
            console.error('Footer mount point not found');
            return;
        }
        mountPoint.innerHTML = ''; // Clear existing

        try {
            const [settingsRes, categoriesRes] = await Promise.all([
                Api.getSiteSettings(),
                Api.getCategories()
            ]);

            const settings = settingsRes.data || {};
            const categories = getResults(categoriesRes);

            const mainFooter = createMainFooter(settings, categories);
            const bottomBar = createBottomBar(settings);
            
            mountPoint.append(mainFooter, bottomBar);

        } catch (error) {
            console.error('Failed to render footer:', error);
            // Optionally render a fallback footer
            mountPoint.innerHTML = '<p class="text-center text-stone-400 py-8">Failed to load footer.</p>';
        }

        document.dispatchEvent(new CustomEvent('footer:ready'));
    }

    function createMainFooter(settings, categories) {
        return E('div', { class: 'container mx-auto px-4 py-16' }, [
            E('div', { class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12' }, [
                createBrandColumn(settings),
                createLinkColumn('Shop', categories.slice(0, 5).map(c => ({ text: c.name, href: buildRoute('categoryDetail', c.slug) }))),
                createLinkColumn('Help', settings.help_links || []),
                createLinkColumn('About', settings.about_links || []),
                createLinkColumn('Legal', settings.legal_links || []),
            ])
        ]);
    }
    
    function createBrandColumn(settings) {
        const socialLinks = (settings.social_links || []).map(link => 
            E('a', { href: link.url, class: 'w-10 h-10 bg-stone-800 hover:bg-amber-600 rounded-xl flex items-center justify-center text-stone-400 hover:text-white transition-all duration-200', 'aria-label': link.platform }, [
                E('i', { class: `fab fa-${link.platform.toLowerCase()}` }) // Assuming font-awesome
            ])
        );

        return E('div', { class: 'col-span-2 md:col-span-3 lg:col-span-2' }, [
            E('a', { href: buildRoute('home'), class: 'inline-flex items-center gap-2 mb-6 group' }, [
                E('img', { src: settings.site_logo, class: 'h-10' }), // Assuming a logo URL in settings
                E('span', { class: 'text-2xl font-bold text-white' }, [settings.site_name || 'Shop'])
            ]),
            E('p', { class: 'text-stone-400 mb-6 leading-relaxed' }, [settings.footer_description || '']),
            E('div', { class: 'flex items-center gap-3' }, socialLinks)
        ]);
    }

    function createLinkColumn(title, links = []) {
        return E('div', {}, [
            E('h4', { class: 'text-white font-semibold mb-5 text-lg' }, [title]),
            E('ul', { class: 'space-y-3' }, 
                links.map(link => E('li', {}, [
                    E('a', { href: link.url || '#', class: 'text-stone-400 hover:text-amber-400 transition-colors' }, [link.text])
                ]))
            )
        ]);
    }

    function createBottomBar(settings) {
         return E('div', { class: 'border-t border-stone-800' }, [
            E('div', { class: 'container mx-auto px-4 py-6' }, [
                E('div', { class: 'flex flex-col lg:flex-row items-center justify-between gap-6' }, [
                    E('p', { class: 'text-sm text-stone-500' }, [`© ${new Date().getFullYear()} ${settings.site_name || 'Shop'}. All rights reserved.`]),
                    E('div', { class: 'flex items-center gap-3' }) // Payment methods can be dynamic too
                ])
            ])
        ]);
    }

    // --- SCRIPT EXECUTION ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFooter);
    } else {
        renderFooter();
    }

})();
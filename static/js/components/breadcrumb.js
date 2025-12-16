/**
 * Breadcrumb Component
 * @module components/breadcrumb
 */

const Breadcrumb = (function() {
    'use strict';

    function render(items, options = {}) {
        const { homeText = 'Home', homeUrl = '/', separator = 'chevron' } = options;

        if (!items || items.length === 0) {
            return `
                <nav aria-label="Breadcrumb" class="text-sm">
                    <ol class="flex items-center gap-2">
                        <li>
                            <a href="${homeUrl}" class="text-gray-500 hover:text-primary-600 transition-colors">
                                ${homeText}
                            </a>
                        </li>
                    </ol>
                </nav>
            `;
        }

        const separatorHtml = separator === 'chevron' 
            ? `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`
            : `<span class="text-gray-400">/</span>`;

        const breadcrumbItems = [
            { name: homeText, url: homeUrl },
            ...items
        ];

        return `
            <nav aria-label="Breadcrumb" class="text-sm">
                <ol class="flex items-center flex-wrap gap-2" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumbItems.map((item, index) => {
                        const isLast = index === breadcrumbItems.length - 1;
                        
                        return `
                            <li class="flex items-center gap-2" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                                ${index > 0 ? separatorHtml : ''}
                                ${isLast ? `
                                    <span class="text-gray-900 font-medium" itemprop="name">${Templates.escapeHtml(item.name)}</span>
                                ` : `
                                    <a href="${item.url}" class="text-gray-500 hover:text-primary-600 transition-colors" itemprop="item">
                                        <span itemprop="name">${Templates.escapeHtml(item.name)}</span>
                                    </a>
                                `}
                                <meta itemprop="position" content="${index + 1}">
                            </li>
                        `;
                    }).join('')}
                </ol>
            </nav>
        `;
    }

    function init(container, items, options = {}) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        if (!container) return;

        container.innerHTML = render(items, options);
    }

    async function fromCategory(categoryId, options = {}) {
        try {
            const response = await CategoriesApi.getBreadcrumb(categoryId);
            if (response.success && response.data) {
                return response.data.map(cat => ({
                    name: cat.name,
                    url: `/categories/${cat.slug}/`
                }));
            }
        } catch (error) {
            console.error('Failed to load breadcrumb:', error);
        }
        return [];
    }

    function buildFromPath(pathParts) {
        const items = [];
        let currentPath = '';

        pathParts.forEach((part, index) => {
            currentPath += '/' + part;
            items.push({
                name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
                url: currentPath + '/'
            });
        });

        return items;
    }

    return {
        render,
        init,
        fromCategory,
        buildFromPath
    };
})();

window.Breadcrumb = Breadcrumb;

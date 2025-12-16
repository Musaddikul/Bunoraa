/**
 * Category Tree Component
 * @module components/categoryTree
 */

const CategoryTree = (function() {
    'use strict';

    let container = null;
    let selectedId = null;
    let expandedIds = new Set();

    function init(element, categories, options = {}) {
        if (typeof element === 'string') {
            container = document.querySelector(element);
        } else {
            container = element;
        }

        if (!container) return;

        selectedId = options.selected || null;
        expandedIds = new Set(options.expanded || []);

        render(categories, options);
        bindEvents();
    }

    function render(categories, options = {}) {
        const { showCount = true, collapsible = true } = options;

        if (!categories || categories.length === 0) {
            container.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    <p>No categories available</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <nav class="space-y-1" aria-label="Categories">
                ${renderLevel(categories, 0, showCount, collapsible)}
            </nav>
        `;
    }

    function renderLevel(categories, level, showCount, collapsible) {
        return categories.map(cat => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isExpanded = expandedIds.has(cat.id);
            const isSelected = selectedId === cat.id;
            const paddingLeft = level * 16 + 12;

            return `
                <div class="category-item" data-category-id="${cat.id}">
                    <div class="flex items-center group">
                        ${hasChildren && collapsible ? `
                            <button 
                                type="button" 
                                class="p-1 hover:bg-gray-100 rounded transition-colors"
                                data-toggle-category="${cat.id}"
                                aria-expanded="${isExpanded}"
                                aria-label="${isExpanded ? 'Collapse' : 'Expand'} ${cat.name}"
                            >
                                <svg class="w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        ` : `
                            <span class="w-6"></span>
                        `}
                        
                        <a 
                            href="/categories/${cat.slug}/"
                            class="flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isSelected ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}"
                            style="padding-left: ${paddingLeft}px"
                            data-category-link="${cat.id}"
                        >
                            <span class="flex items-center gap-2">
                                ${cat.icon ? `<span class="text-lg">${cat.icon}</span>` : ''}
                                ${Templates.escapeHtml(cat.name)}
                            </span>
                            ${showCount && cat.product_count !== undefined ? `
                                <span class="text-xs text-gray-400">${cat.product_count}</span>
                            ` : ''}
                        </a>
                    </div>
                    
                    ${hasChildren ? `
                        <div class="category-children ${isExpanded ? '' : 'hidden'}" data-children-of="${cat.id}">
                            ${renderLevel(cat.children, level + 1, showCount, collapsible)}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    function bindEvents() {
        container.addEventListener('click', (e) => {
            const toggle = e.target.closest('[data-toggle-category]');
            
            if (toggle) {
                e.preventDefault();
                const catId = parseInt(toggle.dataset.toggleCategory);
                toggleCategory(catId);
            }
        });
    }

    function toggleCategory(id) {
        const children = container.querySelector(`[data-children-of="${id}"]`);
        const toggle = container.querySelector(`[data-toggle-category="${id}"]`);
        
        if (!children) return;

        const isExpanded = !children.classList.contains('hidden');

        if (isExpanded) {
            children.classList.add('hidden');
            expandedIds.delete(id);
            toggle?.setAttribute('aria-expanded', 'false');
            toggle?.querySelector('svg')?.classList.remove('rotate-90');
        } else {
            children.classList.remove('hidden');
            expandedIds.add(id);
            toggle?.setAttribute('aria-expanded', 'true');
            toggle?.querySelector('svg')?.classList.add('rotate-90');
        }

        window.dispatchEvent(new CustomEvent('category:toggled', { detail: { id, expanded: !isExpanded } }));
    }

    function expandCategory(id) {
        if (!expandedIds.has(id)) {
            toggleCategory(id);
        }
    }

    function collapseCategory(id) {
        if (expandedIds.has(id)) {
            toggleCategory(id);
        }
    }

    function expandAll() {
        container.querySelectorAll('[data-children-of]').forEach(el => {
            el.classList.remove('hidden');
            const id = parseInt(el.dataset.childrenOf);
            expandedIds.add(id);
            
            const toggle = container.querySelector(`[data-toggle-category="${id}"]`);
            toggle?.setAttribute('aria-expanded', 'true');
            toggle?.querySelector('svg')?.classList.add('rotate-90');
        });
    }

    function collapseAll() {
        container.querySelectorAll('[data-children-of]').forEach(el => {
            el.classList.add('hidden');
            const id = parseInt(el.dataset.childrenOf);
            expandedIds.delete(id);
            
            const toggle = container.querySelector(`[data-toggle-category="${id}"]`);
            toggle?.setAttribute('aria-expanded', 'false');
            toggle?.querySelector('svg')?.classList.remove('rotate-90');
        });
    }

    function select(id) {
        container.querySelectorAll('[data-category-link]').forEach(link => {
            const linkId = parseInt(link.dataset.categoryLink);
            
            if (linkId === id) {
                link.classList.add('bg-primary-50', 'text-primary-700', 'font-medium');
                link.classList.remove('text-gray-700', 'hover:bg-gray-50', 'hover:text-gray-900');
            } else {
                link.classList.remove('bg-primary-50', 'text-primary-700', 'font-medium');
                link.classList.add('text-gray-700', 'hover:bg-gray-50', 'hover:text-gray-900');
            }
        });
        
        selectedId = id;
    }

    function expandToCategory(id, categories) {
        const path = findCategoryPath(id, categories);
        path.forEach(catId => expandCategory(catId));
    }

    function findCategoryPath(id, categories, path = []) {
        for (const cat of categories) {
            if (cat.id === id) {
                return path;
            }
            
            if (cat.children && cat.children.length > 0) {
                const found = findCategoryPath(id, cat.children, [...path, cat.id]);
                if (found) return found;
            }
        }
        return null;
    }

    return {
        init,
        render,
        toggleCategory,
        expandCategory,
        collapseCategory,
        expandAll,
        collapseAll,
        expandToCategory,
        select,
        getExpanded: () => Array.from(expandedIds),
        getSelected: () => selectedId
    };
})();

window.CategoryTree = CategoryTree;

/**
 * FAQ Page
 * @module pages/faq
 */

const FAQPage = (function() {
    'use strict';

    let categories = [];

    async function init() {
        // Check if FAQs are already rendered server-side
        const existingFAQList = document.getElementById('faq-list');
        if (existingFAQList && existingFAQList.querySelector('.faq-item')) {
            // Server-rendered content exists - just bind events
            bindServerRenderedContent();
        } else {
            // Load dynamically
            await loadFAQs();
        }
        initSearch();
    }

    function bindServerRenderedContent() {
        // Bind category tabs
        const categoryBtns = document.querySelectorAll('.category-tab');
        const categoryGroups = document.querySelectorAll('.faq-category');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                categoryBtns.forEach(b => {
                    b.classList.remove('bg-primary-600', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                btn.classList.add('bg-primary-600', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');

                const category = btn.dataset.category;

                // Show/hide categories
                if (category === 'all') {
                    categoryGroups.forEach(cat => cat.classList.remove('hidden'));
                } else {
                    categoryGroups.forEach(cat => {
                        cat.classList.toggle('hidden', cat.dataset.category !== category);
                    });
                }

                // Clear search and show all items
                const searchInput = document.getElementById('faq-search');
                if (searchInput) searchInput.value = '';
                document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('hidden'));
            });
        });

        // Bind accordion toggles
        const accordionToggles = document.querySelectorAll('.accordion-toggle');
        accordionToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const item = toggle.closest('[data-accordion]');
                const content = item.querySelector('.accordion-content');
                const icon = item.querySelector('.accordion-icon');
                const isOpen = !content.classList.contains('hidden');

                // Close all others
                document.querySelectorAll('[data-accordion]').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.accordion-content')?.classList.add('hidden');
                        otherItem.querySelector('.accordion-icon')?.classList.remove('rotate-180');
                    }
                });

                // Toggle current
                if (!isOpen) {
                    content.classList.remove('hidden');
                    icon.classList.add('rotate-180');
                } else {
                    content.classList.add('hidden');
                    icon.classList.remove('rotate-180');
                }
            });
        });
    }

    async function loadFAQs() {
        const container = document.getElementById('faq-container');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await PagesApi.getFAQs();
            const faqs = response.data || [];

            if (faqs.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-8">No FAQs available at the moment.</p>';
                return;
            }

            categories = groupByCategory(faqs);
            renderFAQs(categories);
        } catch (error) {
            console.error('Failed to load FAQs:', error);
            container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load FAQs.</p>';
        }
    }

    function groupByCategory(faqs) {
        const grouped = {};
        
        faqs.forEach(faq => {
            const category = faq.category || 'General';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(faq);
        });

        return grouped;
    }

    function renderFAQs(categorizedFaqs, searchTerm = '') {
        const container = document.getElementById('faq-container');
        if (!container) return;

        const categoryNames = Object.keys(categorizedFaqs);

        if (categoryNames.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-gray-500">No FAQs found${searchTerm ? ` for "${Templates.escapeHtml(searchTerm)}"` : ''}.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <!-- Category Tabs -->
            <div class="mb-8 overflow-x-auto">
                <div class="flex gap-2 pb-2">
                    <button class="faq-category-btn px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium whitespace-nowrap" data-category="all">
                        All
                    </button>
                    ${categoryNames.map(cat => `
                        <button class="faq-category-btn px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap transition-colors" data-category="${Templates.escapeHtml(cat)}">
                            ${Templates.escapeHtml(cat)}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- FAQ Accordion -->
            <div id="faq-list" class="space-y-4">
                ${categoryNames.map(category => `
                    <div class="faq-category" data-category="${Templates.escapeHtml(category)}">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">${Templates.escapeHtml(category)}</h2>
                        <div class="space-y-3">
                            ${categorizedFaqs[category].map(faq => renderFAQItem(faq, searchTerm)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        bindCategoryTabs();
        bindAccordion();
    }

    function renderFAQItem(faq, searchTerm = '') {
        let question = Templates.escapeHtml(faq.question);
        let answer = faq.answer;

        if (searchTerm) {
            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            question = question.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
            answer = answer.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
        }

        return `
            <div class="faq-item border border-gray-200 rounded-lg overflow-hidden">
                <button class="faq-trigger w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span class="font-medium text-gray-900 pr-4">${question}</span>
                    <svg class="faq-icon w-5 h-5 text-gray-500 flex-shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div class="faq-content hidden px-6 pb-4">
                    <div class="prose prose-sm max-w-none text-gray-600">
                        ${answer}
                    </div>
                </div>
            </div>
        `;
    }

    function bindCategoryTabs() {
        const categoryBtns = document.querySelectorAll('.faq-category-btn');
        const categoryGroups = document.querySelectorAll('.faq-category');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => {
                    b.classList.remove('bg-primary-100', 'text-primary-700');
                    b.classList.add('bg-gray-100', 'text-gray-600');
                });
                btn.classList.add('bg-primary-100', 'text-primary-700');
                btn.classList.remove('bg-gray-100', 'text-gray-600');

                const category = btn.dataset.category;

                categoryGroups.forEach(group => {
                    if (category === 'all' || group.dataset.category === category) {
                        group.classList.remove('hidden');
                    } else {
                        group.classList.add('hidden');
                    }
                });
            });
        });
    }

    function bindAccordion() {
        const triggers = document.querySelectorAll('.faq-trigger');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const item = trigger.closest('.faq-item');
                const content = item.querySelector('.faq-content');
                const icon = item.querySelector('.faq-icon');
                const isOpen = !content.classList.contains('hidden');

                // Close all others
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.faq-content')?.classList.add('hidden');
                        otherItem.querySelector('.faq-icon')?.classList.remove('rotate-180');
                    }
                });

                // Toggle current
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });
    }

    function initSearch() {
        const searchInput = document.getElementById('faq-search');
        if (!searchInput) return;

        let debounceTimer = null;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                // Check if we're working with server-rendered or JS-rendered content
                const serverRendered = document.querySelector('.accordion-toggle');
                
                if (serverRendered) {
                    // Server-rendered: filter existing DOM elements
                    filterServerRenderedFAQs(query);
                } else if (categories && Object.keys(categories).length > 0) {
                    // JS-rendered: re-render filtered content
                    if (query.length < 2) {
                        renderFAQs(categories);
                        return;
                    }

                    const filtered = {};
                    Object.entries(categories).forEach(([category, faqs]) => {
                        const matchingFaqs = faqs.filter(faq => 
                            faq.question.toLowerCase().includes(query) ||
                            faq.answer.toLowerCase().includes(query)
                        );
                        if (matchingFaqs.length > 0) {
                            filtered[category] = matchingFaqs;
                        }
                    });

                    renderFAQs(filtered, query);
                }
            }, 300);
        });
    }

    function filterServerRenderedFAQs(query) {
        const faqItems = document.querySelectorAll('.faq-item');
        const categoryGroups = document.querySelectorAll('.faq-category');
        const noResults = document.getElementById('no-results');
        
        let visibleCount = 0;
        
        faqItems.forEach(item => {
            const questionEl = item.querySelector('.accordion-toggle span, button span');
            const contentEl = item.querySelector('.accordion-content');
            
            const question = questionEl ? questionEl.textContent.toLowerCase() : '';
            const answer = contentEl ? contentEl.textContent.toLowerCase() : '';
            
            if (!query || question.includes(query) || answer.includes(query)) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Hide empty categories
        categoryGroups.forEach(cat => {
            const visibleItems = cat.querySelectorAll('.faq-item:not(.hidden)');
            cat.classList.toggle('hidden', visibleItems.length === 0);
        });
        
        // Show no results message
        if (noResults) {
            noResults.classList.toggle('hidden', visibleCount > 0);
        }
    }

    function destroy() {
        categories = [];
    }

    return {
        init,
        destroy
    };
})();

window.FAQPage = FAQPage;
export default FAQPage;

/**
 * Legal Pages (Privacy Policy, Terms of Service, etc.)
 * @module pages/legal
 */

const LegalPage = (function() {
    'use strict';

    async function init() {
        const pageType = getPageTypeFromUrl();
        if (pageType) {
            await loadLegalContent(pageType);
        }
        initTableOfContents();
    }

    function getPageTypeFromUrl() {
        const path = window.location.pathname;
        
        if (path.includes('privacy')) return 'privacy-policy';
        if (path.includes('terms')) return 'terms-of-service';
        if (path.includes('refund') || path.includes('return')) return 'refund-policy';
        if (path.includes('shipping')) return 'shipping-policy';
        if (path.includes('cookie')) return 'cookie-policy';
        
        const match = path.match(/\/legal\/([^\/]+)/);
        return match ? match[1] : null;
    }

    async function loadLegalContent(pageType) {
        const container = document.getElementById('legal-content');
        if (!container) return;

        Loader.show(container, 'skeleton');

        try {
            const response = await PagesApi.getLegalPage(pageType);
            const page = response.data;

            if (!page) {
                container.innerHTML = '<p class="text-gray-500 text-center py-8">Page not found.</p>';
                return;
            }

            document.title = `${page.title} | Bunoraa`;

            renderLegalPage(page);
        } catch (error) {
            console.error('Failed to load legal page:', error);
            container.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load content.</p>';
        }
    }

    function renderLegalPage(page) {
        const container = document.getElementById('legal-content');
        const titleContainer = document.getElementById('legal-title');
        const tocContainer = document.getElementById('table-of-contents');

        if (titleContainer) {
            titleContainer.innerHTML = `
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900">${Templates.escapeHtml(page.title)}</h1>
                ${page.last_updated ? `
                    <p class="mt-2 text-sm text-gray-500">Last updated: ${Templates.formatDate(page.last_updated)}</p>
                ` : ''}
            `;
        }

        if (container) {
            container.innerHTML = `
                <div class="prose prose-lg max-w-none">
                    ${page.content}
                </div>
            `;

            // Generate table of contents from headings
            if (tocContainer) {
                const headings = container.querySelectorAll('h2, h3');
                if (headings.length > 0) {
                    let tocHtml = '<nav class="space-y-2">';
                    headings.forEach((heading, index) => {
                        const id = `section-${index}`;
                        heading.id = id;
                        
                        const level = heading.tagName === 'H2' ? 'pl-0' : 'pl-4';
                        tocHtml += `
                            <a href="#${id}" class="block text-sm ${level} text-gray-600 hover:text-primary-600 transition-colors">
                                ${heading.textContent}
                            </a>
                        `;
                    });
                    tocHtml += '</nav>';
                    tocContainer.innerHTML = tocHtml;
                }
            }
        }
    }

    function initTableOfContents() {
        const tocLinks = document.querySelectorAll('#table-of-contents a');
        
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    const offset = 100; // Account for fixed header
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Highlight active section on scroll
        const observerOptions = {
            rootMargin: '-100px 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const tocLink = document.querySelector(`#table-of-contents a[href="#${id}"]`);
                
                if (entry.isIntersecting) {
                    document.querySelectorAll('#table-of-contents a').forEach(link => {
                        link.classList.remove('text-primary-600', 'font-medium');
                        link.classList.add('text-gray-600');
                    });
                    
                    if (tocLink) {
                        tocLink.classList.add('text-primary-600', 'font-medium');
                        tocLink.classList.remove('text-gray-600');
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('#legal-content h2, #legal-content h3').forEach(heading => {
            if (heading.id) {
                observer.observe(heading);
            }
        });
    }

    function destroy() {}

    return {
        init,
        destroy
    };
})();

window.LegalPage = LegalPage;

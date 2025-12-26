import { formatCurrency } from '/static/js/utils/currency.js';

function getCookie(name) {
    const v = document.cookie.match('(^|;)\s*' + name + '\s*=\s*([^;]+)');
    return v ? v.pop() : '';
}

export async function initCurrencySelector(selector) {

    const resolveRoots = () => {
        if (typeof selector === 'string') return Array.from(document.querySelectorAll(selector));
        if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) return Array.from(selector);
        return [selector];
    };

    let roots = resolveRoots().filter(Boolean);

    // If no roots found and DOM not ready, wait and retry once
    if (!roots.length) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                roots = resolveRoots().filter(Boolean);
                if (!roots.length) {
                    return;
                }
                roots.forEach(r => maybeInitRoot(r));
            }, { once: true });
            return;
        }
        return;
    }

    roots.forEach(r => maybeInitRoot(r));

    function maybeInitRoot(root) {
        if (!root) return;
        if (root.dataset && root.dataset.currencySelectorInit === 'true') {
            return;
        }
        initForRoot(root);
        if (root.dataset) root.dataset.currencySelectorInit = 'true';
    }

    function initForRoot(root) {

        const toggle = root.querySelector('#currency-selector-toggle');
        const dropdown = root.querySelector('#currency-dropdown');
        const list = root.querySelector('#currency-list');
        const currentEl = root.querySelector('#currency-current');

        if (!toggle || !dropdown || !list) {
            return;
        }

        let currencies = [];
        let currentCode = window.BUNORAA_CURRENCY && window.BUNORAA_CURRENCY.code ? window.BUNORAA_CURRENCY.code : (currentEl ? currentEl.textContent.trim() : null);

        async function fetchCurrencies() {
            try {
                const resp = await fetch('/api/v1/currencies/');
                if (!resp.ok) throw new Error('Failed to fetch currencies');
                const body = await resp.json();

                // Support different API shapes: array, { results: [] }, { data: [...] }, or { success: true, data: [...] }
                if (Array.isArray(body)) {
                    currencies = body;
                } else if (body && Array.isArray(body.results)) {
                    currencies = body.results;
                } else if (body && Array.isArray(body.data)) {
                    currencies = body.data;
                } else if (body && body.success && Array.isArray(body.data)) {
                    currencies = body.data;
                } else {
                    // Last-resort: try nested shapes
                    try {
                        const maybe = (body && body.data && body.data.results) ? body.data.results : [];
                        currencies = Array.isArray(maybe) ? maybe : [];
                    } catch (err) {
                        currencies = [];
                    }
                }

                renderList();
            } catch (e) {
                // Show a friendly message
                list.innerHTML = '';
                const el = document.createElement('div');
                el.className = 'px-3 py-2 text-sm text-stone-500';
                el.textContent = 'Failed to load currencies';
                list.appendChild(el);
            }
        }

        function renderList() {
            list.innerHTML = '';

            if (!currencies || currencies.length === 0) {
                const el = document.createElement('div');
                el.className = 'px-3 py-2 text-sm text-stone-500';
                el.textContent = 'No currencies available';
                list.appendChild(el);
                return;
            }

            currencies.forEach(c => {
                const el = document.createElement('button');
                el.type = 'button';
                el.className = 'w-full text-left px-3 py-2 hover:bg-stone-50 dark:hover:bg-stone-900';
                el.setAttribute('data-code', c.code);
                el.setAttribute('role', 'option');
                el.setAttribute('tabindex', '0');
                el.style.cursor = 'pointer';
                el.innerHTML = `<div class="flex items-center justify-between"><span>${c.code} ${c.name ? '- ' + c.name : ''}</span><span class="text-sm text-stone-400">${c.symbol || ''}</span></div>`;
                if (c.code === currentCode) {
                    el.classList.add('font-semibold');
                }
                el.addEventListener('click', (e) => { setCurrency(c.code); });
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        el.click();
                    }
                });
                list.appendChild(el);
            });
        }

        async function showListMessage(msg, type = 'info') {
            list.innerHTML = '';
            const el = document.createElement('div');
            el.className = 'px-3 py-2 text-sm';
            if (type === 'error') el.classList.add('text-red-500'); else el.classList.add('text-stone-500');
            el.textContent = msg;
            list.appendChild(el);
        }

        async function setCurrency(code) {
            try {
                const csrftoken = getCookie('csrftoken');
                const resp = await fetch('/api/v1/currencies/preference/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({ currency_code: code, auto_detect: false })
                });
                if (!resp.ok) {
                    let bodyText = '';
                    try { bodyText = await resp.text(); } catch (_) { bodyText = String(resp.status); }
                    await showListMessage('Failed to set currency (server error). See console for details.', 'error');
                    return;
                }
                const data = await resp.json();
                // Update UI and reload to get server-rendered prices
                if (data && data.success) {
                    // Save current code locally for immediate UI update
                    currentCode = code;
                    if (currentEl) currentEl.textContent = code;
                    // Update global client-side currency and notify listeners so SPA pages can refresh without full reload
                    window.BUNORAA_CURRENCY = window.BUNORAA_CURRENCY || {};
                    window.BUNORAA_CURRENCY.code = code;
                    document.dispatchEvent(new CustomEvent('currency:changed', { detail: { code } }));
                    // Give short delay then reload so server-rendered templates re-render with new currency (keeps existing behavior)
                    setTimeout(() => location.reload(), 250);
                } else {
                    await showListMessage('Could not set currency. See console for details.', 'error');
                }
            } catch (e) {
                await showListMessage('Network or server error while setting currency.', 'error');
            }
        }

        // Toggle behavior - use delegated toggling to be resilient
        const doToggle = (show) => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            const next = (typeof show === 'boolean') ? show : !expanded;
            toggle.setAttribute('aria-expanded', String(next));
            dropdown.classList.toggle('hidden', !next);
            if (next) {
                const first = list.querySelector('button');
                if (first) first.focus();
            }
        };

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            doToggle();
        });

        // Keyboard support: Enter/Space to open, Escape to close
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
            if (e.key === 'Escape') {
                doToggle(false);
                toggle.focus();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                doToggle(false);
                toggle.focus();
            }
        });

        // Click outside closes
        document.addEventListener('click', (e) => {
            if (!root.contains(e.target)) {
                doToggle(false);
            }
        });

        // Accessibility: keyboard navigation inside list
        list.addEventListener('keydown', (e) => {
            const items = Array.from(list.querySelectorAll('button'));
            const idx = items.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[(idx + 1) % items.length];
                if (next) next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[(idx - 1 + items.length) % items.length];
                if (prev) prev.focus();
            } else if (e.key === 'Escape') {
                doToggle(false);
                toggle.focus();
            }
        });

        // Initial load
        fetchCurrencies();
    }
}

export default initCurrencySelector;
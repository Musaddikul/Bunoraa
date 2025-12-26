(function() {
  'use strict';

  function fmt(val, alreadyConverted = false) {
    try {
      if (window.Templates?.formatPrice) return window.Templates.formatPrice(val, null, alreadyConverted);
      return `৳${Number(val || 0).toFixed(2)}`;
    } catch { return `৳${Number(val || 0).toFixed(2)}`; }
  }
  function esc(s) {
    try { return window.Templates?.escapeHtml ? window.Templates.escapeHtml(s || '') : (s || ''); } catch { return s || ''; }
  }
  function getImageUrl(p) {
    if (!p) return '';
    // Prefer thumbnail for drawer performance
    if (typeof p.thumbnail === 'string' && p.thumbnail) return p.thumbnail;
    if (p.primary_image && typeof p.primary_image === 'object') {
      if (typeof p.primary_image.thumbnail === 'string' && p.primary_image.thumbnail) return p.primary_image.thumbnail;
      if (p.primary_image.image && typeof p.primary_image.image === 'object' && typeof p.primary_image.image.thumbnail === 'string' && p.primary_image.image.thumbnail) return p.primary_image.image.thumbnail;
    }
    // Fallbacks
    if (typeof p.primary_image === 'string' && p.primary_image) return p.primary_image;
    if (p.primary_image && typeof p.primary_image === 'object') {
      if (typeof p.primary_image.image === 'string' && p.primary_image.image) return p.primary_image.image;
      if (p.primary_image.image && typeof p.primary_image.image === 'object' && typeof p.primary_image.image.url === 'string') return p.primary_image.image.url;
      if (typeof p.primary_image.url === 'string' && p.primary_image.url) return p.primary_image.url;
    }
    if (typeof p.image === 'string' && p.image) return p.image;
    if (Array.isArray(p.images) && p.images.length) {
      const first = p.images[0];
      if (typeof first === 'string') return first;
      if (first && typeof first === 'object') {
        if (typeof first.thumbnail === 'string' && first.thumbnail) return first.thumbnail;
        if (typeof first.image === 'string' && first.image) return first.image;
        if (first.image && typeof first.image === 'object' && typeof first.image.url === 'string') return first.image.url;
        if (typeof first.url === 'string' && first.url) return first.url;
      }
    }
    if (typeof p.image_url === 'string' && p.image_url) return p.image_url;
    return '';
  }

  function render(cartDrawer, cart) {
    const cartContent = cartDrawer?.querySelector('[data-cart-content]');
    const cartSubtotal = cartDrawer?.querySelector('[data-cart-subtotal]');
    if (!cartContent || !cart) return;

    const items = cart.items || [];
    cartDrawer?.classList.toggle('cart-empty', items.length === 0);

    // Prefer server-formatted subtotal when available (already converted & formatted)
    const subtotalFormatted = cart.summary?.formatted_subtotal;
    const subtotalVal = cart.summary?.subtotal ?? items.reduce((sum, it) => sum + Number(it.line_total || it.current_price || 0) * Number(it.quantity || 1), 0);
    if (cartSubtotal) cartSubtotal.textContent = subtotalFormatted ? subtotalFormatted : fmt(subtotalVal, true);

    if (items.length === 0) {
      cartContent.innerHTML = `
        <div class="p-8 text-center">
          <div class="mx-auto w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3">
            <svg class="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 8m12-8-2 8M9 21h6"/></svg>
          </div>
          <p class="text-stone-600 dark:text-stone-300">Your cart is empty. Start exploring our products!</p>
          <a href="/products/" class="mt-4 inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">Browse Products</a>
        </div>`;
      return;
    }

    // Map summary items (if present) for pre-formatted values
    const summaryItemsMap = (cart.summary && Array.isArray(cart.summary.items)) ? (cart.summary.items.reduce((m, it) => { m[it.id] = it; return m; }, {})) : {};

    const itemHtml = items.map(item => {
      const product = item.product || {};
      const variant = item.variant;
      const href = product.slug ? `/products/${product.slug}/` : '#';
      const img = getImageUrl(product) || '/static/images/placeholder.png';
      const unit = Number(item.current_price ?? product.price ?? 0);
      const qty = Number(item.quantity || 1);
      const line = Number(item.line_total ?? unit * qty);

      const summaryItem = summaryItemsMap[item.id];
      const formattedUnit = summaryItem && summaryItem.formatted_unit_price ? summaryItem.formatted_unit_price : fmt(unit, true);
      const formattedLine = summaryItem && summaryItem.formatted_total ? summaryItem.formatted_total : fmt(line, true);

      return `
        <div class="group relative p-4 border-b border-stone-100 dark:border-stone-800" data-cart-item-id="${item.id}">
          <div class="flex gap-4">
            <a href="${href}" class="w-16 h-16 md:w-16 md:h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
              <img src="${img}" alt="${esc(product.name || 'Product')}" class="w-full h-full object-cover" loading="lazy">
            </a>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <a href="${href}" class="font-semibold text-stone-900 dark:text-white line-clamp-2 hover:text-amber-700 dark:hover:text-amber-400">${esc(product.name || 'Product')}</a>
                  ${variant ? `<p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">${esc(variant.name || variant.value || '')}</p>` : ''}
                </div>
                <button class="text-stone-400 hover:text-red-500 transition-colors" data-cart-remove="${item.id}" aria-label="Remove">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button class="w-8 h-8 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800" data-qty-minus="${item.id}">−</button>
                  <span class="min-w-[2.5rem] text-center font-medium" data-qty-value="${item.id}">${qty}</span>
                  <button class="w-8 h-8 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800" data-qty-plus="${item.id}">+</button>
                </div>
                <div class="text-right">
                  <div class="text-sm text-stone-600 dark:text-stone-300">${formattedUnit} each</div>
                  <div class="font-semibold text-stone-900 dark:text-white" data-line-total="${item.id}">${formattedLine}</div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    cartContent.innerHTML = itemHtml;

    // Remove item
    cartContent.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.cartRemove;
        btn.disabled = true;
        try {
          const resp = await window.CartApi.removeItem(id);
          if (resp.success) {
            render(cartDrawer, resp.data?.cart);
          }
        } catch (err) {
          console.error(err);
          window.Toast?.error('Failed to remove item');
        } finally {
          btn.disabled = false;
        }
      });
    });

    // Quantity adjust
    const updateQty = async (id, nextQty) => {
      if (nextQty < 1) return;
      try {
        const resp = await window.CartApi.updateItem(id, nextQty);
        if (resp.success) {
          render(cartDrawer, resp.data?.cart);
        }
      } catch (err) {
        console.error(err);
        window.Toast?.error('Failed to update quantity');
      }
    };

    cartContent.querySelectorAll('[data-qty-minus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.qtyMinus;
        const valEl = cartContent.querySelector(`[data-qty-value="${id}"]`);
        const current = Number(valEl?.textContent || '1');
        updateQty(id, current - 1);
      });
    });
    cartContent.querySelectorAll('[data-qty-plus]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.qtyPlus;
        const valEl = cartContent.querySelector(`[data-qty-value="${id}"]`);
        const current = Number(valEl?.textContent || '1');
        updateQty(id, current + 1);
      });
    });
  }

  async function open(cartDrawer) {
    if (!cartDrawer) return;
    const cartContent = cartDrawer.querySelector('[data-cart-content]');
    if (cartContent) {
      cartContent.innerHTML = '<div class="p-6 text-center text-stone-500 text-sm">Loading cart...</div>';
    }
    try {
      const response = await window.CartApi.getCart();
      if (!response.success) throw new Error('Failed to load cart.');
      const cart = response.data;
      const items = cart?.items || [];
      if (items.length === 0) {
        window.Toast?.info('You have not added any products yet.', { duration: 3000 });
        return;
      }
      cartDrawer.classList.remove('hidden');
      requestAnimationFrame(() => cartDrawer.classList.add('open'));
      render(cartDrawer, cart);
    } catch (error) {
      window.Toast?.error(error.message || 'Unable to open cart right now.');
    }
  }

  function close(cartDrawer) {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('open');
    setTimeout(() => {
      cartDrawer.classList.add('hidden');
    }, 250);
  }

  function init() {
    const cartDrawer = document.getElementById('cart-drawer');
    if (!cartDrawer) return;

    document.querySelectorAll('[data-cart-open]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        open(cartDrawer);
      });
    });

    cartDrawer.querySelectorAll('[data-cart-close]').forEach(btn => btn.addEventListener('click', () => close(cartDrawer)));
    cartDrawer.addEventListener('click', (e) => { if (e.target === cartDrawer) close(cartDrawer); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cartDrawer.classList.contains('open')) close(cartDrawer); });

    document.addEventListener('cart:updated', async () => {
      if (cartDrawer.classList.contains('open')) {
        const response = await window.CartApi.getCart();
        if (response.success) render(cartDrawer, response.data);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.CartDrawer = { open: () => open(document.getElementById('cart-drawer')), close: () => close(document.getElementById('cart-drawer')), render, init };
})();

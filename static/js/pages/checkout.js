/**
 * Checkout Page
 * @module pages/checkout
 */

const CheckoutPage = (async function() {
    'use strict';

    let cart = null;
    let checkoutData = {
        shipping_address: null,
        billing_address: null,
        same_as_shipping: true,
        shipping_method: null,
        payment_method: null,
        notes: ''
    };
    let currentStep = 1;

    async function init() {
        if (!AuthApi.isAuthenticated()) {
            const continueAsGuest = document.getElementById('guest-checkout');
            if (!continueAsGuest) {
                Toast.info('Please login to continue checkout.');
                window.location.href = '/account/login/?next=/checkout/';
                return;
            }
        }

        await loadCart();
        
        if (!cart || !cart.items || cart.items.length === 0) {
            Toast.warning('Your cart is empty.');
            window.location.href = '/cart/';
            return;
        }

        await loadUserAddresses();
        initStepNavigation();
        initFormValidation();
        initOrderSummaryToggle();
    }

    async function loadCart() {
        try {
            const response = await CartApi.getCart();
            cart = response.data;
            renderOrderSummary();
        } catch (error) {
            console.error('Failed to load cart:', error);
            Toast.error('Failed to load cart.');
        }
    }

    function renderOrderSummary() {
        const container = document.getElementById('order-summary');
        if (!container || !cart) return;

        container.innerHTML = `
            <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <!-- Cart Items -->
                <div class="space-y-3 max-h-64 overflow-y-auto mb-4">
                    ${cart.items.map(item => `
                        <div class="flex gap-3">
                            <div class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <img src="${item.product?.image || '/static/images/placeholder.png'}" alt="" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-medium text-gray-900 truncate">${Templates.escapeHtml(item.product?.name)}</h4>
                                ${item.variant ? `<p class="text-xs text-gray-500">${Templates.escapeHtml(item.variant.name || item.variant.value)}</p>` : ''}
                                <div class="flex justify-between mt-1">
                                    <span class="text-xs text-gray-500">Qty: ${item.quantity}</span>
                                    <span class="text-sm font-medium">${Templates.formatPrice(item.price * item.quantity)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Subtotal</span>
                        <span class="font-medium">${Templates.formatPrice(cart.subtotal || 0)}</span>
                    </div>
                    ${cart.discount_amount ? `
                        <div class="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-${Templates.formatPrice(cart.discount_amount)}</span>
                        </div>
                    ` : ''}
                    <div class="flex justify-between" id="shipping-cost-row">
                        <span class="text-gray-600">Shipping</span>
                        <span class="font-medium" id="shipping-cost">Calculated next</span>
                    </div>
                    ${cart.tax_amount ? `
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tax</span>
                            <span class="font-medium">${Templates.formatPrice(cart.tax_amount)}</span>
                        </div>
                    ` : ''}
                    <div class="flex justify-between pt-2 border-t border-gray-200">
                        <span class="text-base font-semibold text-gray-900">Total</span>
                        <span class="text-base font-bold text-gray-900" id="order-total">${Templates.formatPrice(cart.total || 0)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    async function loadUserAddresses() {
        if (!AuthApi.isAuthenticated()) return;

        try {
            const response = await AuthApi.getAddresses();
            const addresses = response.data || [];

            const shippingContainer = document.getElementById('saved-addresses');
            if (shippingContainer && addresses.length > 0) {
                shippingContainer.innerHTML = `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Saved Addresses</label>
                        <div class="space-y-2">
                            ${addresses.map(addr => `
                                <label class="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                    <input type="radio" name="saved_address" value="${addr.id}" class="mt-1 text-primary-600 focus:ring-primary-500">
                                    <div class="ml-3">
                                        <p class="font-medium text-gray-900">${Templates.escapeHtml(addr.full_name || `${addr.first_name} ${addr.last_name}`)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(addr.address_line_1)}</p>
                                        ${addr.address_line_2 ? `<p class="text-sm text-gray-600">${Templates.escapeHtml(addr.address_line_2)}</p>` : ''}
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(addr.city)}, ${Templates.escapeHtml(addr.state || '')} ${Templates.escapeHtml(addr.postal_code)}</p>
                                        <p class="text-sm text-gray-600">${Templates.escapeHtml(addr.country)}</p>
                                        ${addr.is_default ? '<span class="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>' : ''}
                                    </div>
                                </label>
                            `).join('')}
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                <input type="radio" name="saved_address" value="new" class="text-primary-600 focus:ring-primary-500" checked>
                                <span class="ml-3 text-gray-700">Enter a new address</span>
                            </label>
                        </div>
                    </div>
                `;

                bindAddressSelection();
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
        }
    }

    function bindAddressSelection() {
        const addressRadios = document.querySelectorAll('input[name="saved_address"]');
        const newAddressForm = document.getElementById('new-address-form');

        addressRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'new') {
                    newAddressForm?.classList.remove('hidden');
                } else {
                    newAddressForm?.classList.add('hidden');
                    checkoutData.shipping_address = e.target.value;
                }
            });
        });
    }

    function initStepNavigation() {
        const steps = document.querySelectorAll('[data-step]');
        const stepIndicators = document.querySelectorAll('[data-step-indicator]');
        const nextBtns = document.querySelectorAll('[data-next-step]');
        const prevBtns = document.querySelectorAll('[data-prev-step]');

        function showStep(stepNumber) {
            steps.forEach(step => {
                step.classList.toggle('hidden', parseInt(step.dataset.step) !== stepNumber);
            });

            stepIndicators.forEach(indicator => {
                const indicatorStep = parseInt(indicator.dataset.stepIndicator);
                indicator.classList.toggle('bg-primary-600', indicatorStep <= stepNumber);
                indicator.classList.toggle('text-white', indicatorStep <= stepNumber);
                indicator.classList.toggle('bg-gray-200', indicatorStep > stepNumber);
                indicator.classList.toggle('text-gray-600', indicatorStep > stepNumber);
            });

            currentStep = stepNumber;
        }

        nextBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const valid = await validateCurrentStep();
                if (valid) {
                    if (currentStep === 1) {
                        await loadShippingMethods();
                    }
                    showStep(currentStep + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showStep(currentStep - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        showStep(1);
    }

    async function validateCurrentStep() {
        switch (currentStep) {
            case 1:
                return validateShippingAddress();
            case 2:
                return validateShippingMethod();
            case 3:
                return validatePaymentMethod();
            default:
                return true;
        }
    }

    // Inline error helpers
    function clearStepErrors(container) {
        if (!container) return;
        container.querySelectorAll('[data-error-for]').forEach(el => el.remove());
        container.querySelectorAll('.!border-red-500').forEach(el => el.classList.remove('!border-red-500'));
    }

    function showInlineError(fieldEl, message) {
        if (!fieldEl) return;
        // Remove existing error for this field
        const name = fieldEl.getAttribute('name') || fieldEl.id || Math.random().toString(36).slice(2, 8);
        const existing = fieldEl.closest('form')?.querySelector(`[data-error-for="${name}"]`);
        if (existing) existing.remove();

        const msg = document.createElement('p');
        msg.className = 'text-sm text-red-600 mt-1';
        msg.setAttribute('data-error-for', name);
        msg.textContent = message;

        // Add visual state to the field
        fieldEl.classList.add('!border-red-500');

        // Insert after field or its parent wrapper
        if (fieldEl.nextSibling) {
            fieldEl.parentNode.insertBefore(msg, fieldEl.nextSibling);
        } else {
            fieldEl.parentNode.appendChild(msg);
        }
    }

    function focusFirstInvalid(container) {
        if (!container) return;
        const first = container.querySelector('[data-error-for]');
        if (!first) return;
        // Try to focus associated input
        const name = first.getAttribute('data-error-for');
        const input = container.querySelector(`[name="${name}"]`) || container.querySelector(`#${name}`) || first.previousElementSibling;
        if (input && typeof input.focus === 'function') input.focus();
    }

    function validateShippingAddress() {
        // Support both 'information-form' (wizard first step) and dedicated 'shipping-address-form'
        const savedAddressRadio = document.querySelector('input[name="saved_address"]:checked');
        
        if (savedAddressRadio && savedAddressRadio.value !== 'new') {
            clearStepErrors(document.getElementById('new-address-form') || document.getElementById('information-form'));
            checkoutData.shipping_address = savedAddressRadio.value;
            return true;
        }

        const form = document.getElementById('shipping-address-form') || document.getElementById('information-form') || document.getElementById('new-address-form');
        if (!form) return false;

        clearStepErrors(form);

        const formData = new FormData(form);
        const address = {
            first_name: formData.get('first_name') || formData.get('full_name')?.split(' ')?.[0],
            last_name: formData.get('last_name') || (formData.get('full_name') ? formData.get('full_name').split(' ').slice(1).join(' ') : ''),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address_line_1: formData.get('address_line1') || formData.get('address_line_1'),
            address_line_2: formData.get('address_line2') || formData.get('address_line_2'),
            city: formData.get('city'),
            state: formData.get('state'),
            postal_code: formData.get('postal_code'),
            country: formData.get('country')
        };

        // Required fields depending on context
        const required = ['email', 'first_name', 'address_line_1', 'city', 'postal_code'];
        const missing = required.filter(field => !address[field]);

        if (missing.length > 0) {
            // Show inline errors and focus first
            missing.forEach(field => {
                // Map back to input names in form
                let selector = `[name="${field}"]`;
                if (field === 'address_line_1') selector = `[name="address_line1"],[name="address_line_1"]`;
                const fieldEl = form.querySelector(selector);
                showInlineError(fieldEl || form, field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' is required.');
            });

            focusFirstInvalid(form);
            return false;
        }

        // Basic email format check
        if (address.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address.email)) {
            const emailEl = form.querySelector('[name="email"]');
            showInlineError(emailEl || form, 'Please enter a valid email address.');
            focusFirstInvalid(form);
            return false;
        }

        checkoutData.shipping_address = address;
        return true;
    }

    async function loadShippingMethods() {
        const container = document.getElementById('shipping-methods');
        if (!container) return;

        Loader.show(container, 'spinner');

        try {
            const address = checkoutData.shipping_address;

            if (!address) {
                // No address available yet (user hasn't filled or selected one)
                container.innerHTML = '<p class="text-gray-500">Please provide a shipping address to view shipping methods.</p>';
                return;
            }

            const params = typeof address === 'object' ? {
                country: address.country,
                postal_code: address.postal_code,
                city: address.city
            } : { address_id: address };

            const response = await ShippingApi.getRates(params);
            const methods = response.data || [];

            if (methods.length === 0) {
                container.innerHTML = '<p class="text-gray-500">No shipping methods available for your location.</p>';
                return;
            }

            container.innerHTML = `
                <div class="space-y-3">
                    ${methods.map((method, index) => `
                        <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <div class="flex items-center">
                                <input 
                                    type="radio" 
                                    name="shipping_method" 
                                    value="${method.id}" 
                                    ${index === 0 ? 'checked' : ''}
                                    class="text-primary-600 focus:ring-primary-500"
                                    data-price="${method.price}"
                                >
                                <div class="ml-3">
                                    <p class="font-medium text-gray-900">${Templates.escapeHtml(method.name)}</p>
                                    ${method.description ? `<p class="text-sm text-gray-500">${Templates.escapeHtml(method.description)}</p>` : ''}
                                    ${method.estimated_days ? `<p class="text-sm text-gray-500">Delivery in ${method.estimated_days} days</p>` : ''}
                                </div>
                            </div>
                            <span class="font-semibold text-gray-900">${method.price > 0 ? Templates.formatPrice(method.price) : 'Free'}</span>
                        </label>
                    `).join('')}
                </div>
            `;

            const shippingRadios = container.querySelectorAll('input[name="shipping_method"]');
            shippingRadios.forEach((radio, idx) => {
                // Store price on the radio element without using DOM data-attributes
                radio.__price = methods[idx] ? methods[idx].price : 0;
                radio.addEventListener('change', () => {
                    updateShippingCost(parseFloat(radio.__price) || 0);
                });
            });

            if (methods.length > 0) {
                checkoutData.shipping_method = methods[0].id;
                updateShippingCost(methods[0].price || 0);
            }
        } 
        catch (error) {
            console.error('Failed to load shipping methods:', error);
            container.innerHTML = '<p class="text-red-500">Failed to load shipping methods. Please try again.</p>';
        }
    }

    // -----------------------------
    // Payment gateways (dynamic)
    // -----------------------------
    async function fetchAndRenderPaymentGateways() {
        const container = document.getElementById('payment-methods-container');
        if (!container) return;

        try {
            const params = new URLSearchParams();
            // Client-side currency parameter removed; server handles currency formatting.
            if (window.CONFIG && CONFIG.shippingData && CONFIG.shippingData.countryCode) params.set('country', CONFIG.shippingData.countryCode);
            if (cart && (cart.total || cart.total === 0)) params.set('amount', cart.total);

            const resp = await fetch(`/api/v1/payments/gateways/available/?${params.toString()}`, {
                credentials: 'same-origin'
            });
            const data = await resp.json();

            const gateways = (data && data.data) || [];

            // If server already rendered gateways (non-empty) try to avoid re-render to prevent UI flicker.
            const existing = container.querySelectorAll('.payment-option');
            if (existing && existing.length > 0) {
                try {
                    const existingCodes = Array.from(existing).map(el => el.dataset.gateway).filter(Boolean);
                    const remoteCodes = (gateways || []).map(g => g.code);

                    // If codes match exactly in order and length, keep server markup and just re-bind handlers.
                    const same = existingCodes.length === remoteCodes.length && existingCodes.every((c, i) => c === remoteCodes[i]);
                    if (same) {
                        initFormValidation(); // ensure event handlers and initial visibility are in place
                        return;
                    }
                } catch (err) {
                    // Fall back to previous behavior if anything goes wrong
                    console.warn('Failed to compare existing payment gateways:', err);
                }

                // If remote returned nothing but server has content, keep server content (avoid replacing with empty state)
                if (gateways.length === 0) return;
            }

            // If no gateways, show informative block (template also handles this case)
            if (!gateways || gateways.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment methods are configured</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-2">We don't have any payment providers configured for your currency or location. Please contact support to enable online payments.</p>
                        <p class="text-sm text-gray-400">You can still place an order if Cash on Delivery or Bank Transfer is available from admin.</p>
                    </div>
                `;
                return;
            }

            // Build radio options into a fragment, add animations and staggered delays to improve perceived performance
            const frag = document.createDocumentFragment();
            gateways.forEach((g, idx) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'relative payment-option transform transition-all duration-300 hover:scale-[1.01]';
                wrapper.dataset.gateway = g.code;

                // Apply slideIn animation with staggered delay so new DOM shows with animation
                wrapper.style.animation = 'slideIn 0.3s ease-out both';
                wrapper.style.animationDelay = `${idx * 80}ms`;

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'payment_method';
                input.value = g.code;
                input.id = `payment-${g.code}`;
                input.className = 'peer sr-only';
                if (idx === 0) input.checked = true;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.className = 'flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-gray-400 border-gray-200';

                label.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            ${g.icon_url ? `<img src="${g.icon_url}" class="h-6" alt="${g.name}">` : `<span class="font-bold">${g.code.toUpperCase()}</span>`}
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">${Templates.escapeHtml(g.name)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${Templates.escapeHtml(g.description || '')}</p>
                            ${g.fee_text ? `<p class="text-xs text-amber-600 dark:text-amber-400 mt-1">${Templates.escapeHtml(g.fee_text)}</p>` : ''}
                            ${g.instructions ? `<p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${g.instructions}</p>` : ''}
                        </div>
                    </div>
                `;

                wrapper.appendChild(input);
                wrapper.appendChild(label);

                // Append selection indicator
                const indicator = document.createElement('div');
                indicator.className = 'absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity duration-300';
                indicator.innerHTML = `<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>`;
                wrapper.appendChild(indicator);

                frag.appendChild(wrapper);

                // If gateway requires client side (Stripe), load JS and init (do this early so elements can initialize)
                if (g.public_key && g.requires_client) {
                    loadStripeJsIfNeeded(g.public_key).catch(err => console.error('Failed to load Stripe:', err));
                }
            });

            // Atomically replace existing nodes to reduce flicker
            container.replaceChildren(frag);

            // Re-bind form handlers
            initFormValidation();

        } catch (error) {
            console.error('Failed to load payment gateways:', error);
        }
    }

    function loadStripeJsIfNeeded(publishableKey) {
        return new Promise((resolve, reject) => {
            if (window.Stripe && window.STRIPE_PUBLISHABLE_KEY === publishableKey) {
                // Already configured
                resolve();
                return;
            }

            // Set global publishable key
            window.STRIPE_PUBLISHABLE_KEY = publishableKey;

            // If Stripe script is already loaded, just initialize elements
            if (window.Stripe) {
                initStripeElements(publishableKey);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            script.onload = () => {
                try {
                    initStripeElements(publishableKey);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            };
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
        });
    }

    function initStripeElements(publishableKey) {
        if (typeof Stripe === 'undefined') throw new Error('Stripe script not loaded');

        try {
            const stripe = Stripe(publishableKey);
            const elements = stripe.elements();
            const cardEl = elements.create('card');
            const mountPoint = document.getElementById('card-element');
            if (mountPoint) {
                // Clean previous mount if any
                mountPoint.innerHTML = '';
                cardEl.mount('#card-element');

                // Show realtime validation errors
                cardEl.on('change', (e) => {
                    const errContainer = document.getElementById('card-errors');
                    if (errContainer) errContainer.textContent = e.error ? e.error.message : '';
                });

                // Expose card element for confirmCardPayment
                window.stripeInstance = stripe;
                window.stripeCard = cardEl;
            }
        } catch (err) {
            console.error('Error initializing Stripe elements:', err);
            throw err;
        }
    }

    // Call dynamic loading on init
    (function autoInitGateways() {
        // Delay slightly to let server-rendered DOM settle
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                fetchAndRenderPaymentGateways();
            }, 50);
        });
    })();



    function updateShippingCost(cost) {
        const shippingCostEl = document.getElementById('shipping-cost');
        const orderTotalEl = document.getElementById('order-total');

        if (shippingCostEl) {
            shippingCostEl.textContent = cost > 0 ? Templates.formatPrice(cost) : 'Free';
        }

        if (orderTotalEl && cart) {
            const total = (cart.total || 0) + cost;
            orderTotalEl.textContent = Templates.formatPrice(total);
        }
    }

    function validateShippingMethod() {
        const selected = document.querySelector('input[name="shipping_method"]:checked');
        if (!selected) {
            Toast.error('Please select a shipping method.');
            return false;
        }
        checkoutData.shipping_method = selected.value;
        return true;
    }

    function initOrderSummaryToggle() {
        const toggle = document.getElementById('order-summary-toggle');
        const block = document.getElementById('order-summary-block');
        if (!toggle || !block) return;

        toggle.addEventListener('click', () => {
            const hidden = block.classList.toggle('hidden');
            toggle.setAttribute('aria-expanded', (!hidden).toString());
            const chevron = toggle.querySelector('svg');
            if (chevron) chevron.classList.toggle('rotate-180', !hidden);
        });

        // If the block is hidden on mobile by responsive classes, ensure aria is accurate
        const isHidden = window.getComputedStyle(block).display === 'none' || block.classList.contains('hidden');
        toggle.setAttribute('aria-expanded', (!isHidden).toString());
    }

    function validatePaymentMethod() {
        const selected = document.querySelector('input[name="payment_method"]:checked');
        const form = document.getElementById('payment-form');
        clearStepErrors(form);

        if (!selected) {
            // Show inline message in payment block
            const container = document.getElementById('payment-methods-container') || form;
            showInlineError(container, 'Please select a payment method.');
            focusFirstInvalid(container);
            return false;
        }

        const code = selected.value;

        // Payment-specific checks
        if (code === 'stripe') {
            const nameEl = document.getElementById('cardholder-name');
            if (!nameEl || !nameEl.value.trim()) {
                showInlineError(nameEl || form, 'Cardholder name is required.');
                focusFirstInvalid(form);
                return false;
            }
            // Ensure Stripe element exists (mounting handled elsewhere)
            if (!window.stripeCard) {
                showInlineError(document.getElementById('card-element') || form, 'Card input not ready. Please wait and try again.');
                return false;
            }
        }

        if (code === 'bkash') {
            const el = document.getElementById('bkash-number');
            if (!el || !el.value.trim()) {
                showInlineError(el || form, 'bKash mobile number is required.');
                focusFirstInvalid(form);
                return false;
            }
        }

        if (code === 'nagad') {
            const el = document.getElementById('nagad-number');
            if (!el || !el.value.trim()) {
                showInlineError(el || form, 'Nagad mobile number is required.');
                focusFirstInvalid(form);
                return false;
            }
        }

        // Clear any errors and proceed
        checkoutData.payment_method = code;
        return true;
    }

    function initFormValidation() {
        const sameAsBillingCheckbox = document.getElementById('same-as-shipping');
        const billingAddressForm = document.getElementById('billing-address-form');

        sameAsBillingCheckbox?.addEventListener('change', (e) => {
            checkoutData.same_as_shipping = e.target.checked;
            billingAddressForm?.classList.toggle('hidden', e.target.checked);
        });

        const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
        paymentMethods.forEach(method => {
            const handler = (e) => {
                // Hide all payment form blocks marked with data-payment-form
                document.querySelectorAll('[data-payment-form]').forEach(form => {
                    form.classList.add('hidden');
                });

                // Show the matching form using data attribute; fallback to id `${code}-form`
                const code = e.target ? e.target.value : (method.value || null);
                if (!code) return;

                let targetForm = document.querySelector(`[data-payment-form="${code}"]`);
                if (!targetForm) {
                    targetForm = document.getElementById(`${code}-form`);
                }

                targetForm?.classList.remove('hidden');
            };

            method.addEventListener('change', handler);

            // If this method is pre-selected on page load, trigger handler to set initial visibility
            if (method.checked) {
                handler({ target: method });
            }
        });

        // Only attach the SPA place order handler if NOT on the traditional form-based review page
        // The traditional form has action attribute and we should let it submit normally
        const placeOrderBtn = document.getElementById('place-order-btn');
        const placeOrderForm = document.getElementById('place-order-form');
        
        // Only use JavaScript-based checkout if the form doesn't have a traditional action
        if (placeOrderBtn && (!placeOrderForm || !placeOrderForm.action || placeOrderForm.action.includes('javascript'))) {
            placeOrderBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await placeOrder();
            });
        }
    }

    async function placeOrder() {
        if (!validatePaymentMethod()) return;

        const placeOrderBtn = document.getElementById('place-order-btn');
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        try {
            const orderNotes = document.getElementById('order-notes')?.value;
            checkoutData.notes = orderNotes || '';

            if (!checkoutData.same_as_shipping) {
                const billingForm = document.getElementById('billing-address-form');
                if (billingForm) {
                    const formData = new FormData(billingForm);
                    checkoutData.billing_address = {
                        first_name: formData.get('billing_first_name'),
                        last_name: formData.get('billing_last_name'),
                        address_line_1: formData.get('billing_address_line_1'),
                        address_line_2: formData.get('billing_address_line_2'),
                        city: formData.get('billing_city'),
                        state: formData.get('billing_state'),
                        postal_code: formData.get('billing_postal_code'),
                        country: formData.get('billing_country')
                    };
                }
            }

            const response = await CheckoutApi.createOrder(checkoutData);
            const order = response.data;

            if (checkoutData.payment_method === 'stripe' || checkoutData.payment_method === 'card') {
                await processStripePayment(order);
            } else if (checkoutData.payment_method === 'paypal') {
                await processPayPalPayment(order);
            } else {
                window.location.href = `/orders/${order.id}/confirmation/`;
            }
        } catch (error) {
            console.error('Failed to place order:', error);
            Toast.error(error.message || 'Failed to place order. Please try again.');
            
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
        }
    }

    async function processStripePayment(order) {
        try {
            const response = await CheckoutApi.createPaymentIntent(order.id);
            const { client_secret } = response.data;
            const publishable_key = response.data.publishable_key || window.STRIPE_PUBLISHABLE_KEY || (window.stripeInstance ? window.STRIPE_PUBLISHABLE_KEY : null);

            if (typeof Stripe === 'undefined' && !window.stripeInstance) {
                throw new Error('Stripe is not loaded.');
            }

            const stripe = window.stripeInstance || Stripe(publishable_key);
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: window.stripeCard,
                    billing_details: {
                        name: `${checkoutData.shipping_address.first_name} ${checkoutData.shipping_address.last_name}`
                    }
                }
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            window.location.href = `/orders/${order.id}/confirmation/`;
        } catch (error) {
            console.error('Stripe payment failed:', error);
            Toast.error(error.message || 'Payment failed. Please try again.');
            
            const placeOrderBtn = document.getElementById('place-order-btn');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
        }
    }

    async function processPayPalPayment(order) {
        try {
            const response = await CheckoutApi.createPayPalOrder(order.id);
            const { approval_url } = response.data;
            window.location.href = approval_url;
        } catch (error) {
            console.error('PayPal payment failed:', error);
            Toast.error(error.message || 'Payment failed. Please try again.');
            
            const placeOrderBtn = document.getElementById('place-order-btn');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Order';
        }
    }

    function destroy() {
        cart = null;
        checkoutData = {
            shipping_address: null,
            billing_address: null,
            same_as_shipping: true,
            shipping_method: null,
            payment_method: null,
            notes: ''
        };
        currentStep = 1;
    }

    return {
        init,
        destroy
    };
}());

window.CheckoutPage = CheckoutPage;
export default CheckoutPage;

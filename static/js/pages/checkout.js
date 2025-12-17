/**
 * Checkout Page
 * @module pages/checkout
 */

const CheckoutPage = (function() {
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

    function validateShippingAddress() {
        const savedAddressRadio = document.querySelector('input[name="saved_address"]:checked');
        
        if (savedAddressRadio && savedAddressRadio.value !== 'new') {
            checkoutData.shipping_address = savedAddressRadio.value;
            return true;
        }

        const form = document.getElementById('shipping-address-form');
        if (!form) return false;

        const formData = new FormData(form);
        const address = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address_line_1: formData.get('address_line_1'),
            address_line_2: formData.get('address_line_2'),
            city: formData.get('city'),
            state: formData.get('state'),
            postal_code: formData.get('postal_code'),
            country: formData.get('country')
        };

        const required = ['first_name', 'last_name', 'address_line_1', 'city', 'postal_code', 'country'];
        const missing = required.filter(field => !address[field]);

        if (missing.length > 0) {
            Toast.error('Please fill in all required fields.');
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
            shippingRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateShippingCost(parseFloat(radio.dataset.price) || 0);
                });
            });

            if (methods.length > 0) {
                checkoutData.shipping_method = methods[0].id;
                updateShippingCost(methods[0].price || 0);
            }
        } catch (error) {
            console.error('Failed to load shipping methods:', error);
            container.innerHTML = '<p class="text-red-500">Failed to load shipping methods. Please try again.</p>';
        }
    }

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

    function validatePaymentMethod() {
        const selected = document.querySelector('input[name="payment_method"]:checked');
        if (!selected) {
            Toast.error('Please select a payment method.');
            return false;
        }
        checkoutData.payment_method = selected.value;
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
            method.addEventListener('change', (e) => {
                document.querySelectorAll('[data-payment-form]').forEach(form => {
                    form.classList.add('hidden');
                });

                const targetForm = document.querySelector(`[data-payment-form="${e.target.value}"]`);
                targetForm?.classList.remove('hidden');
            });
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
            const { client_secret, publishable_key } = response.data;

            if (typeof Stripe === 'undefined') {
                throw new Error('Stripe is not loaded.');
            }

            const stripe = Stripe(publishable_key);
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
})();

window.CheckoutPage = CheckoutPage;

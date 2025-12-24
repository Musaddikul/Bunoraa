/**
 * Bunoraa Checkout - Advanced JavaScript functionality
 * Handles all checkout interactions, AJAX calls, validation, and payment processing
 */

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const CONFIG = {
        apiBaseUrl: '/api/v1/checkout/',
        debounceDelay: 300,
        animationDuration: 300,
        stripePublishableKey: window.STRIPE_PUBLISHABLE_KEY || '',
    };

    // ========================================
    // Utility Functions
    // ========================================
    const Utils = {
        // Debounce function for input events
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Get CSRF token from cookie
        getCsrfToken() {
            const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='));
            return cookie ? cookie.split('=')[1] : '';
        },

        // Format currency
        formatCurrency(amount, symbol = '৳') {
            const num = parseFloat(amount) || 0;
            return `${symbol}${num.toFixed(2)}`;
        },

        // API fetch wrapper
        async apiRequest(endpoint, options = {}) {
            const defaultOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken(),
                },
                credentials: 'same-origin',
            };

            const response = await fetch(CONFIG.apiBaseUrl + endpoint, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...(options.headers || {}),
                },
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        },
    };

    // ========================================
    // Form Validation
    // ========================================
    const Validation = {
        patterns: {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            postalCode: /^[A-Za-z0-9\s-]{3,10}$/,
        },

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const name = field.name;
            let isValid = true;
            let message = '';

            // Required check
            if (field.required && !value) {
                isValid = false;
                message = 'This field is required';
            }
            // Email validation
            else if (type === 'email' && value && !this.patterns.email.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            // Phone validation
            else if (type === 'tel' && value && !this.patterns.phone.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }

            this.showFieldError(field, isValid ? '' : message);
            return isValid;
        },

        showFieldError(field, message) {
            const existingError = field.parentElement.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }

            if (message) {
                field.classList.add('border-red-500');
                field.classList.remove('border-gray-300');
                const errorEl = document.createElement('p');
                errorEl.className = 'field-error text-red-600 text-sm mt-1';
                errorEl.textContent = message;
                field.parentElement.appendChild(errorEl);
            } else {
                field.classList.remove('border-red-500');
                field.classList.add('border-gray-300');
            }
        },

        validateForm(form) {
            const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        },
    };

    // ========================================
    // Coupon Handler
    // ========================================
    const CouponHandler = {
        init() {
            const applyBtn = document.getElementById('apply-coupon-btn');
            const removeBtn = document.getElementById('remove-coupon-btn');
            const couponInput = document.getElementById('coupon-code');

            if (applyBtn) {
                applyBtn.addEventListener('click', () => this.applyCoupon());
            }

            if (removeBtn) {
                removeBtn.addEventListener('click', () => this.removeCoupon());
            }

            if (couponInput) {
                couponInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.applyCoupon();
                    }
                });
            }
        },

        async applyCoupon() {
            const input = document.getElementById('coupon-code');
            const code = input?.value.trim();

            if (!code) {
                window.Toast.warning('Please enter a coupon code');
                return;
            }

            const btn = document.getElementById('apply-coupon-btn');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Applying...';

            try {
                const response = await Utils.apiRequest('coupon/', {
                    method: 'POST',
                    body: JSON.stringify({ coupon_code: code }),
                });

                if (response.success) {
                    window.Toast.success(response.message);
                    this.updateOrderSummary(response.data);
                } else {
                    window.Toast.error(response.message);
                }
            } catch (error) {
                window.Toast.error(error.message || 'Failed to apply coupon');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        },

        async removeCoupon() {
            try {
                const response = await Utils.apiRequest('coupon/', {
                    method: 'DELETE',
                });

                if (response.success) {
                    window.Toast.info('Coupon removed');
                    const discountRow = document.getElementById('discount-row');
                    if (discountRow) discountRow.classList.add('hidden');
                    this.updateOrderSummary(response.data);
                    document.getElementById('coupon-code').value = '';
                }
            } catch (error) {
                window.Toast.error('Failed to remove coupon');
            }
        },

        updateOrderSummary(data) {
            if (data.discount && parseFloat(data.discount) > 0) {
                const discountRow = document.getElementById('discount-row');
                const discountAmount = document.getElementById('discount-amount');
                if (discountRow) discountRow.classList.remove('hidden');
                if (discountAmount) discountAmount.textContent = `-${Utils.formatCurrency(data.discount)}`;
            }
            if (data.total) {
                const totalEl = document.getElementById('order-total');
                if (totalEl) totalEl.textContent = Utils.formatCurrency(data.total);
            }
        },
    };

    // ========================================
    // Shipping Handler
    // ========================================
    const ShippingHandler = {
        init() {
            const shippingInputs = document.querySelectorAll('input[name="shipping_rate"]');
            
            shippingInputs.forEach(input => {
                input.addEventListener('change', (e) => this.updateShipping(e.target));
            });

            // Initialize with current selection
            const selected = document.querySelector('input[name="shipping_rate"]:checked');
            if (selected) {
                this.updateShipping(selected);
            }
        },

        async updateShipping(input) {
            const shippingCost = document.getElementById('shipping-cost');
            const estimatedDelivery = document.getElementById('estimated-delivery');
            const orderTotal = document.getElementById('order-total');
            
            const price = parseFloat(input.dataset.price) || 0;
            const days = input.dataset.days;

            if (shippingCost) {
                shippingCost.textContent = price === 0 ? 'Free' : Utils.formatCurrency(price);
            }

            if (estimatedDelivery && days) {
                estimatedDelivery.textContent = `Estimated delivery: ${days} business days`;
            }

            // Update via API for accurate total
            try {
                const response = await Utils.apiRequest('shipping-method/', {
                    method: 'POST',
                    body: JSON.stringify({
                        shipping_method: 'shipping',
                        shipping_rate_id: input.value,
                    }),
                });

                if (response.success && response.data) {
                    if (orderTotal && response.data.total) {
                        orderTotal.textContent = Utils.formatCurrency(response.data.total);
                    }
                }
            } catch (error) {
                console.error('Error updating shipping:', error);
            }
        },
    };

    // ========================================
    // Payment Handler
    // ========================================
    const PaymentHandler = {
        stripe: null,
        cardElement: null,

        init() {
            this.initPaymentMethodToggle();
            this.initStripe();
            this.initBillingToggle();
        },

        initPaymentMethodToggle() {
            const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
            
            paymentMethods.forEach(input => {
                input.addEventListener('change', (e) => this.togglePaymentForm(e.target.value));
            });
        },

        togglePaymentForm(method) {
            const forms = ['stripe-form', 'bkash-form', 'nagad-form', 'cod-form', 'bank-form'];
            
            forms.forEach(formId => {
                const form = document.getElementById(formId);
                if (form) {
                    form.classList.add('hidden');
                }
            });

            const activeFormId = {
                'stripe': 'stripe-form',
                'bkash': 'bkash-form',
                'nagad': 'nagad-form',
                'cod': 'cod-form',
                'bank_transfer': 'bank-form',
            }[method];

            if (activeFormId) {
                const activeForm = document.getElementById(activeFormId);
                if (activeForm) {
                    activeForm.classList.remove('hidden');
                }
            }
        },

        initStripe() {
            if (!CONFIG.stripePublishableKey || typeof Stripe === 'undefined') {
                return;
            }

            try {
                this.stripe = Stripe(CONFIG.stripePublishableKey);
                const elements = this.stripe.elements();
                
                const isDarkMode = document.documentElement.classList.contains('dark');
                
                this.cardElement = elements.create('card', {
                    style: {
                        base: {
                            fontSize: '16px',
                            color: isDarkMode ? '#f9fafb' : '#374151',
                            '::placeholder': {
                                color: isDarkMode ? '#6b7280' : '#9CA3AF',
                            },
                            iconColor: isDarkMode ? '#f9fafb' : '#374151',
                        },
                        invalid: {
                            color: '#EF4444',
                            iconColor: '#EF4444',
                        },
                    },
                });

                const cardElementContainer = document.getElementById('card-element');
                if (cardElementContainer) {
                    this.cardElement.mount('#card-element');
                    
                    this.cardElement.on('change', (event) => {
                        const displayError = document.getElementById('card-errors');
                        if (displayError) {
                            displayError.textContent = event.error ? event.error.message : '';
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to initialize Stripe:', error);
            }
        },

        initBillingToggle() {
            const sameAsShipping = document.getElementById('same-as-shipping');
            const billingForm = document.getElementById('billing-address-form');

            if (sameAsShipping && billingForm) {
                sameAsShipping.addEventListener('change', () => {
                    billingForm.classList.toggle('hidden', sameAsShipping.checked);
                });
            }
        },

        async createPaymentMethod() {
            if (!this.stripe || !this.cardElement) {
                return null;
            }

            const cardholderName = document.getElementById('cardholder-name')?.value || '';

            const { paymentMethod, error } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement,
                billing_details: {
                    name: cardholderName,
                },
            });

            if (error) {
                throw new Error(error.message);
            }

            return paymentMethod;
        },
    };

    // ========================================
    // Address Handler
    // ========================================
    const AddressHandler = {
        init() {
            const savedAddressInputs = document.querySelectorAll('input[name="saved_address"]');
            const newAddressForm = document.getElementById('new-address-form');

            if (savedAddressInputs.length && newAddressForm) {
                savedAddressInputs.forEach(input => {
                    input.addEventListener('change', (e) => this.toggleAddressForm(e.target, newAddressForm));
                });
            }
        },

        toggleAddressForm(input, formContainer) {
            if (input.value === 'new') {
                formContainer.classList.remove('hidden');
                this.clearFormFields(formContainer);
            } else {
                formContainer.classList.add('hidden');
                this.populateFromSavedAddress(input);
            }
        },

        clearFormFields(container) {
            const fields = container.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                if (field.type !== 'checkbox' && field.type !== 'radio') {
                    field.value = '';
                }
            });
        },

        populateFromSavedAddress(input) {
            const fieldMappings = {
                'full_name': 'fullName',
                'address_line1': 'addressLine1',
                'address_line2': 'addressLine2',
                'city': 'city',
                'state': 'state',
                'postal_code': 'postalCode',
                'country': 'country',
            };

            Object.entries(fieldMappings).forEach(([fieldId, dataAttr]) => {
                const field = document.getElementById(fieldId);
                if (field && input.dataset[dataAttr]) {
                    field.value = input.dataset[dataAttr];
                }
            });
        },
    };

    // ========================================
    // Gift Options Handler
    // ========================================
    const GiftHandler = {
        init() {
            const isGiftCheckbox = document.getElementById('is_gift');
            const giftDetails = document.getElementById('gift-details');
            const giftMessage = document.getElementById('gift_message');
            const giftMessageCount = document.getElementById('gift-message-count');

            if (isGiftCheckbox && giftDetails) {
                isGiftCheckbox.addEventListener('change', () => {
                    giftDetails.classList.toggle('hidden', !isGiftCheckbox.checked);
                });
            }

            if (giftMessage && giftMessageCount) {
                giftMessage.addEventListener('input', () => {
                    giftMessageCount.textContent = giftMessage.value.length;
                });
                giftMessageCount.textContent = giftMessage.value.length;
            }
        },
    };

    // ========================================
    // Form Submission Handler
    // ========================================
    const FormHandler = {
        init() {
            this.initForms();
        },

        initForms() {
            // Information form
            const infoForm = document.getElementById('information-form');
            if (infoForm) {
                infoForm.addEventListener('submit', (e) => this.handleFormSubmit(e, infoForm));
            }

            // Shipping form
            const shippingForm = document.getElementById('shipping-form');
            if (shippingForm) {
                shippingForm.addEventListener('submit', (e) => this.handleFormSubmit(e, shippingForm));
            }

            // Payment form
            const paymentForm = document.getElementById('payment-form');
            if (paymentForm) {
                paymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e, paymentForm));
            }

            // Place order form
            const placeOrderForm = document.getElementById('place-order-form');
            if (placeOrderForm) {
                placeOrderForm.addEventListener('submit', (e) => this.handlePlaceOrder(e, placeOrderForm));
            }
        },

        handleFormSubmit(e, form) {
            if (!Validation.validateForm(form)) {
                e.preventDefault();
                window.Toast.error('Please fill in all required fields');
                return;
            }

            this.showLoadingState(form);
        },

        async handlePaymentSubmit(e, form) {
            e.preventDefault();

            if (!Validation.validateForm(form)) {
                window.Toast.error('Please fill in all required fields');
                return;
            }

            const selectedMethod = document.querySelector('input[name="payment_method"]:checked')?.value;

            if (selectedMethod === 'stripe') {
                try {
                    this.showLoadingState(form);
                    const paymentMethod = await PaymentHandler.createPaymentMethod();
                    
                    if (paymentMethod) {
                        document.getElementById('payment-method-id').value = paymentMethod.id;
                    }
                } catch (error) {
                    window.Toast.error(error.message);
                    this.hideLoadingState(form);
                    return;
                }
            }

            form.submit();
        },

        handlePlaceOrder(e, form) {
            const termsCheckbox = form.querySelector('input[name="terms_accepted"]');
            
            if (!termsCheckbox?.checked) {
                e.preventDefault();
                window.Toast.warning('Please accept the terms and conditions');
                return;
            }

            this.showLoadingState(form);
        },

        showLoadingState(form) {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                const btnText = btn.querySelector('[id$="btn-text"], [id$="button-text"]');
                const btnSpinner = btn.querySelector('[id$="btn-spinner"], [id$="spinner"]');
                const arrowIcon = btn.querySelector('[id$="arrow-icon"]');
                
                if (btnText) btnText.textContent = 'Processing...';
                if (btnSpinner) btnSpinner.classList.remove('hidden');
                if (arrowIcon) arrowIcon.classList.add('hidden');
            }
        },

        hideLoadingState(form) {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = false;
                const btnText = btn.querySelector('[id$="btn-text"], [id$="button-text"]');
                const btnSpinner = btn.querySelector('[id$="btn-spinner"], [id$="spinner"]');
                const arrowIcon = btn.querySelector('[id$="arrow-icon"]');
                
                if (btnSpinner) btnSpinner.classList.add('hidden');
                if (arrowIcon) arrowIcon.classList.remove('hidden');
            }
        },
    };

    // ========================================
    // Progress Indicator
    // ========================================
    const ProgressIndicator = {
        init() {
            this.animateProgress();
        },

        animateProgress() {
            const completedSteps = document.querySelectorAll('.bg-green-600');
            completedSteps.forEach((step, index) => {
                step.style.animation = `pulse 0.5s ease-out ${index * 0.1}s`;
            });
        },
    };

    // ========================================
    // Auto-save Handler
    // ========================================
    const AutoSaveHandler = {
        saveTimeout: null,

        init() {
            const forms = document.querySelectorAll('#information-form, #shipping-form');
            
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.addEventListener('change', Utils.debounce(() => this.autoSave(form), 1000));
                });
            });
        },

        async autoSave(form) {
            // Save form data to session storage for recovery
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            try {
                sessionStorage.setItem('checkout_form_data', JSON.stringify(data));
            } catch (error) {
                console.error('Failed to auto-save form data:', error);
            }
        },

        restoreFormData() {
            try {
                const savedData = sessionStorage.getItem('checkout_form_data');
                if (savedData) {
                    const data = JSON.parse(savedData);
                    Object.entries(data).forEach(([key, value]) => {
                        const field = document.querySelector(`[name="${key}"]`);
                        if (field && !field.value) {
                            field.value = value;
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to restore form data:', error);
            }
        },
    };

    // ========================================
    // Initialize Everything
    // ========================================
    function init() {
        // Initialize all handlers
        CouponHandler.init();
        ShippingHandler.init();
        PaymentHandler.init();
        AddressHandler.init();
        GiftHandler.init();
        FormHandler.init();
        ProgressIndicator.init();
        AutoSaveHandler.init();

        // Add real-time validation
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => Validation.validateField(field));
        });

        // Restore auto-saved form data
        AutoSaveHandler.restoreFormData();

    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utilities globally for inline scripts
    window.CheckoutUtils = Utils;
    window.CheckoutValidation = Validation;

})();

/**
 * Checkout Page Module
 * Multi-step checkout with address, shipping, payment, and order review.
 */

import { cartService } from '../api/cart.js';
import { checkoutApi } from '../api/checkout.js';
import { Toast } from '../components/toast.js';
import { Validation } from '../utils/validation.js';

class CheckoutPage {
    constructor() {
        this.cart = null;
        this.addresses = [];
        this.shippingMethods = [];
        this.selectedAddress = null;
        this.selectedShipping = null;
        this.paymentMethod = 'cod';
        this.currentStep = 1;
        this.totalSteps = 4;
        this.isProcessing = false;

        this.elements = {
            checkoutContainer: document.getElementById('checkout-container'),
            stepsIndicator: document.getElementById('steps-indicator'),
            stepContent: document.getElementById('step-content'),
            
            // Step 1: Address
            addressList: document.getElementById('address-list'),
            newAddressBtn: document.getElementById('new-address-btn'),
            addressForm: document.getElementById('address-form'),
            
            // Step 2: Shipping
            shippingMethods: document.getElementById('shipping-methods'),
            
            // Step 3: Payment
            paymentMethods: document.getElementById('payment-methods'),
            
            // Step 4: Review
            orderReview: document.getElementById('order-review'),
            
            // Navigation
            prevBtn: document.getElementById('prev-step'),
            nextBtn: document.getElementById('next-step'),
            placeOrderBtn: document.getElementById('place-order'),
            
            // Summary
            orderSummary: document.getElementById('order-summary'),
        };
    }

    /**
     * Initialize checkout page
     */
    async init() {
        try {
            // Load cart and addresses in parallel
            await Promise.all([
                this.loadCart(),
                this.loadAddresses(),
            ]);

            // Check if cart is empty
            if (!this.cart || this.cart.items?.length === 0) {
                window.location.href = '/cart/';
                return;
            }

            this.render();
            this.bindEvents();

        } catch (error) {
            console.error('Failed to initialize checkout:', error);
            Toast.show({
                message: 'Failed to load checkout',
                type: 'error'
            });
        }
    }

    /**
     * Load cart
     */
    async loadCart() {
        this.cart = await cartService.fetch();
    }

    /**
     * Load user addresses
     */
    async loadAddresses() {
        try {
            const response = await checkoutApi.getAddresses();
            this.addresses = response.results || response;
            
            // Pre-select default address
            const defaultAddress = this.addresses.find(a => a.is_default);
            if (defaultAddress) {
                this.selectedAddress = defaultAddress;
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
        }
    }

    /**
     * Load shipping methods
     */
    async loadShippingMethods() {
        if (!this.selectedAddress) return;

        try {
            const response = await checkoutApi.getShippingMethods(this.selectedAddress.id);
            this.shippingMethods = response.results || response;
            
            // Pre-select cheapest method
            if (this.shippingMethods.length > 0) {
                this.selectedShipping = this.shippingMethods.reduce((prev, curr) => 
                    parseFloat(curr.rate) < parseFloat(prev.rate) ? curr : prev
                );
            }
        } catch (error) {
            console.error('Failed to load shipping methods:', error);
        }
    }

    /**
     * Render checkout page
     */
    render() {
        this.renderStepsIndicator();
        this.renderCurrentStep();
        this.renderOrderSummary();
        this.updateNavigation();
    }

    /**
     * Render steps indicator
     */
    renderStepsIndicator() {
        if (!this.elements.stepsIndicator) return;

        const steps = [
            { num: 1, label: 'Address', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
            { num: 2, label: 'Shipping', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
            { num: 3, label: 'Payment', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
            { num: 4, label: 'Review', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
        ];

        const html = steps.map((step, index) => {
            const isCompleted = step.num < this.currentStep;
            const isCurrent = step.num === this.currentStep;
            const isLast = index === steps.length - 1;

            return `
                <div class="flex items-center ${!isLast ? 'flex-1' : ''}">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isCurrent ? 'bg-primary-600 text-white' :
                            'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }">
                            ${isCompleted ? `
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            ` : `
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${step.icon}"/>
                                </svg>
                            `}
                        </div>
                        <span class="hidden sm:block font-medium ${
                            isCurrent ? 'text-primary-600' :
                            isCompleted ? 'text-green-600' :
                            'text-gray-500'
                        }">${step.label}</span>
                    </div>
                    ${!isLast ? `
                        <div class="flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}"></div>
                    ` : ''}
                </div>
            `;
        }).join('');

        this.elements.stepsIndicator.innerHTML = `<div class="flex items-center">${html}</div>`;
    }

    /**
     * Render current step content
     */
    renderCurrentStep() {
        if (!this.elements.stepContent) return;

        switch (this.currentStep) {
            case 1:
                this.renderAddressStep();
                break;
            case 2:
                this.renderShippingStep();
                break;
            case 3:
                this.renderPaymentStep();
                break;
            case 4:
                this.renderReviewStep();
                break;
        }
    }

    /**
     * Render address selection step
     */
    renderAddressStep() {
        const hasAddresses = this.addresses.length > 0;

        const addressCards = this.addresses.map(address => `
            <label class="address-card cursor-pointer block">
                <input 
                    type="radio" 
                    name="address" 
                    value="${address.id}"
                    ${this.selectedAddress?.id === address.id ? 'checked' : ''}
                    class="sr-only"
                >
                <div class="p-4 border-2 rounded-xl transition-all ${
                    this.selectedAddress?.id === address.id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-semibold text-gray-900 dark:text-white">${address.full_name}</h4>
                        ${address.is_default ? `
                            <span class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">Default</span>
                        ` : ''}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        ${address.address_line_1}<br>
                        ${address.address_line_2 ? address.address_line_2 + '<br>' : ''}
                        ${address.city}, ${address.state} ${address.postal_code}<br>
                        ${address.country}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        ${address.phone_number}
                    </p>
                </div>
            </label>
        `).join('');

        this.elements.stepContent.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
                    ${hasAddresses ? `
                        <div class="grid gap-4 sm:grid-cols-2" id="address-list">
                            ${addressCards}
                        </div>
                    ` : ''}
                </div>
                
                <div>
                    <button 
                        type="button" 
                        id="new-address-btn"
                        class="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add New Address
                    </button>
                </div>
                
                <div id="address-form-container" class="hidden">
                    ${this.renderAddressForm()}
                </div>
            </div>
        `;

        // Show form if no addresses
        if (!hasAddresses) {
            document.getElementById('address-form-container')?.classList.remove('hidden');
        }
    }

    /**
     * Render address form
     */
    renderAddressForm() {
        return `
            <form id="address-form" class="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-4">New Address</h3>
                
                <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            name="full_name" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone_number" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 1</label>
                    <input 
                        type="text" 
                        name="address_line_1" 
                        required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    >
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 2 (Optional)</label>
                    <input 
                        type="text" 
                        name="address_line_2"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    >
                </div>
                
                <div class="grid gap-4 sm:grid-cols-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                        <input 
                            type="text" 
                            name="city" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State/Division</label>
                        <input 
                            type="text" 
                            name="state" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                        <input 
                            type="text" 
                            name="postal_code" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                    <select 
                        name="country" 
                        required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="BD">Bangladesh</option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                    </select>
                </div>
                
                <label class="flex items-center gap-2">
                    <input type="checkbox" name="is_default" class="rounded text-primary-600">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Set as default address</span>
                </label>
                
                <div class="flex gap-3">
                    <button 
                        type="submit"
                        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Save Address
                    </button>
                    <button 
                        type="button"
                        id="cancel-address"
                        class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        `;
    }

    /**
     * Render shipping method selection step
     */
    renderShippingStep() {
        const methodCards = this.shippingMethods.map(method => `
            <label class="shipping-method cursor-pointer block">
                <input 
                    type="radio" 
                    name="shipping_method" 
                    value="${method.id}"
                    ${this.selectedShipping?.id === method.id ? 'checked' : ''}
                    class="sr-only"
                >
                <div class="p-4 border-2 rounded-xl transition-all flex justify-between items-center ${
                    this.selectedShipping?.id === method.id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }">
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white">${method.name}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${method.description || method.estimated_days || 'Standard delivery'}</p>
                    </div>
                    <span class="font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(method.rate) === 0 ? 'Free' : `৳${parseFloat(method.rate).toLocaleString()}`}
                    </span>
                </div>
            </label>
        `).join('');

        this.elements.stepContent.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Shipping Method</h2>
                
                <div class="space-y-3" id="shipping-methods">
                    ${this.shippingMethods.length > 0 ? methodCards : `
                        <p class="text-gray-500 dark:text-gray-400">Loading shipping methods...</p>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Render payment method selection step
     */
    renderPaymentStep() {
        const paymentMethods = [
            {
                id: 'cod',
                name: 'Cash on Delivery',
                description: 'Pay when you receive your order',
                icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
            },
            {
                id: 'bkash',
                name: 'bKash',
                description: 'Pay with bKash mobile wallet',
                icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
                comingSoon: false
            },
            {
                id: 'nagad',
                name: 'Nagad',
                description: 'Pay with Nagad mobile wallet',
                icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
                comingSoon: false
            },
            {
                id: 'card',
                name: 'Credit/Debit Card',
                description: 'Pay securely with Visa or Mastercard',
                icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
                comingSoon: true
            }
        ];

        const methodCards = paymentMethods.map(method => `
            <label class="payment-method cursor-pointer block ${method.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}">
                <input 
                    type="radio" 
                    name="payment_method" 
                    value="${method.id}"
                    ${this.paymentMethod === method.id ? 'checked' : ''}
                    ${method.comingSoon ? 'disabled' : ''}
                    class="sr-only"
                >
                <div class="p-4 border-2 rounded-xl transition-all flex items-center gap-4 ${
                    this.paymentMethod === method.id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }">
                    <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${method.icon}"/>
                        </svg>
                    </div>
                    <div class="flex-grow">
                        <h4 class="font-semibold text-gray-900 dark:text-white">
                            ${method.name}
                            ${method.comingSoon ? '<span class="text-xs text-gray-500 ml-2">(Coming Soon)</span>' : ''}
                        </h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${method.description}</p>
                    </div>
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        this.paymentMethod === method.id 
                            ? 'border-primary-500' 
                            : 'border-gray-300'
                    }">
                        ${this.paymentMethod === method.id ? `
                            <div class="w-3 h-3 rounded-full bg-primary-500"></div>
                        ` : ''}
                    </div>
                </div>
            </label>
        `).join('');

        this.elements.stepContent.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Payment Method</h2>
                
                <div class="space-y-3" id="payment-methods">
                    ${methodCards}
                </div>
            </div>
        `;
    }

    /**
     * Render order review step
     */
    renderReviewStep() {
        const items = this.cart.items || [];

        const itemsHtml = items.map(item => `
            <div class="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img 
                        src="${item.product?.image || '/static/images/placeholder.jpg'}"
                        alt="${item.product?.name}"
                        class="w-full h-full object-cover"
                    >
                </div>
                <div class="flex-grow">
                    <h4 class="font-medium text-gray-900 dark:text-white">${item.product?.name}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Qty: ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <span class="font-medium text-gray-900 dark:text-white">
                        ৳${(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </span>
                </div>
            </div>
        `).join('');

        this.elements.stepContent.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Review Your Order</h2>
                
                <!-- Shipping Address -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-medium text-gray-900 dark:text-white">Shipping Address</h3>
                        <button class="text-primary-600 text-sm hover:underline" data-goto-step="1">Edit</button>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        ${this.selectedAddress?.full_name}<br>
                        ${this.selectedAddress?.address_line_1}<br>
                        ${this.selectedAddress?.city}, ${this.selectedAddress?.state} ${this.selectedAddress?.postal_code}<br>
                        ${this.selectedAddress?.phone_number}
                    </p>
                </div>
                
                <!-- Shipping Method -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-medium text-gray-900 dark:text-white">Shipping Method</h3>
                        <button class="text-primary-600 text-sm hover:underline" data-goto-step="2">Edit</button>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        ${this.selectedShipping?.name} - 
                        ${parseFloat(this.selectedShipping?.rate) === 0 ? 'Free' : `৳${parseFloat(this.selectedShipping?.rate).toLocaleString()}`}
                    </p>
                </div>
                
                <!-- Payment Method -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-medium text-gray-900 dark:text-white">Payment Method</h3>
                        <button class="text-primary-600 text-sm hover:underline" data-goto-step="3">Edit</button>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        ${this.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                          this.paymentMethod === 'bkash' ? 'bKash' :
                          this.paymentMethod === 'nagad' ? 'Nagad' : 'Credit/Debit Card'}
                    </p>
                </div>
                
                <!-- Order Items -->
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h3 class="font-medium text-gray-900 dark:text-white mb-4">Order Items</h3>
                    <div class="divide-y divide-gray-200 dark:divide-gray-700">
                        ${itemsHtml}
                    </div>
                </div>
                
                <!-- Order Notes -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Notes (Optional)</label>
                    <textarea 
                        id="order-notes"
                        rows="3"
                        placeholder="Any special instructions for your order..."
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                </div>
            </div>
        `;
    }

    /**
     * Render order summary sidebar
     */
    renderOrderSummary() {
        if (!this.elements.orderSummary) return;

        const subtotal = parseFloat(this.cart.subtotal || 0);
        const discount = parseFloat(this.cart.discount_amount || 0);
        const shipping = this.selectedShipping ? parseFloat(this.selectedShipping.rate) : 0;
        const tax = parseFloat(this.cart.tax_amount || 0);
        const total = subtotal - discount + shipping + tax;

        this.elements.orderSummary.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal (${this.cart.items?.length || 0} items)</span>
                        <span>৳${subtotal.toLocaleString()}</span>
                    </div>
                    
                    ${discount > 0 ? `
                        <div class="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-৳${discount.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span>${shipping > 0 ? `৳${shipping.toLocaleString()}` : 'Free'}</span>
                    </div>
                    
                    ${tax > 0 ? `
                        <div class="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Tax</span>
                            <span>৳${tax.toLocaleString()}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                        <span class="text-xl font-bold text-gray-900 dark:text-white">৳${total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Update navigation buttons
     */
    updateNavigation() {
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const placeOrderBtn = document.getElementById('place-order');

        if (prevBtn) {
            prevBtn.classList.toggle('hidden', this.currentStep === 1);
        }

        if (nextBtn && placeOrderBtn) {
            nextBtn.classList.toggle('hidden', this.currentStep === this.totalSteps);
            placeOrderBtn.classList.toggle('hidden', this.currentStep !== this.totalSteps);
        }
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Navigation buttons
        document.addEventListener('click', async (e) => {
            // Previous step
            if (e.target.closest('#prev-step')) {
                this.prevStep();
            }
            
            // Next step
            if (e.target.closest('#next-step')) {
                await this.nextStep();
            }
            
            // Place order
            if (e.target.closest('#place-order')) {
                await this.placeOrder();
            }

            // Go to step
            const gotoStep = e.target.closest('[data-goto-step]');
            if (gotoStep) {
                this.currentStep = parseInt(gotoStep.dataset.gotoStep);
                this.render();
            }

            // New address button
            if (e.target.closest('#new-address-btn')) {
                document.getElementById('address-form-container')?.classList.remove('hidden');
            }

            // Cancel address
            if (e.target.closest('#cancel-address')) {
                document.getElementById('address-form-container')?.classList.add('hidden');
            }
        });

        // Address selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'address') {
                this.selectedAddress = this.addresses.find(a => a.id === parseInt(e.target.value));
                this.renderAddressStep();
            }
            
            if (e.target.name === 'shipping_method') {
                this.selectedShipping = this.shippingMethods.find(m => m.id === parseInt(e.target.value));
                this.renderShippingStep();
                this.renderOrderSummary();
            }
            
            if (e.target.name === 'payment_method') {
                this.paymentMethod = e.target.value;
                this.renderPaymentStep();
            }
        });

        // Address form submit
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'address-form') {
                e.preventDefault();
                await this.saveAddress(e.target);
            }
        });
    }

    /**
     * Go to previous step
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
        }
    }

    /**
     * Go to next step
     */
    async nextStep() {
        if (!this.validateCurrentStep()) return;

        if (this.currentStep === 1) {
            await this.loadShippingMethods();
        }

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.render();
        }
    }

    /**
     * Validate current step
     */
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedAddress) {
                    Toast.show({ message: 'Please select a shipping address', type: 'error' });
                    return false;
                }
                break;
            case 2:
                if (!this.selectedShipping) {
                    Toast.show({ message: 'Please select a shipping method', type: 'error' });
                    return false;
                }
                break;
            case 3:
                if (!this.paymentMethod) {
                    Toast.show({ message: 'Please select a payment method', type: 'error' });
                    return false;
                }
                break;
        }
        return true;
    }

    /**
     * Save new address
     */
    async saveAddress(form) {
        const formData = new FormData(form);
        const addressData = Object.fromEntries(formData.entries());
        addressData.is_default = formData.has('is_default');

        try {
            const newAddress = await checkoutApi.createAddress(addressData);
            this.addresses.push(newAddress);
            this.selectedAddress = newAddress;
            
            Toast.show({ message: 'Address saved', type: 'success' });
            this.renderAddressStep();
            
        } catch (error) {
            console.error('Failed to save address:', error);
            Toast.show({ message: 'Failed to save address', type: 'error' });
        }
    }

    /**
     * Place order
     */
    async placeOrder() {
        if (this.isProcessing) return;
        
        if (!this.validateCurrentStep()) return;

        this.isProcessing = true;
        const placeOrderBtn = document.getElementById('place-order');
        
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;
        }

        try {
            const orderNotes = document.getElementById('order-notes')?.value || '';
            
            const orderData = {
                shipping_address_id: this.selectedAddress.id,
                shipping_method_id: this.selectedShipping.id,
                payment_method: this.paymentMethod,
                customer_notes: orderNotes,
            };

            const order = await checkoutApi.createOrder(orderData);
            
            // Redirect to order confirmation
            window.location.href = `/orders/${order.order_number}/confirmation/`;

        } catch (error) {
            console.error('Failed to place order:', error);
            Toast.show({
                message: error.data?.message || 'Failed to place order. Please try again.',
                type: 'error'
            });
            
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Place Order';
            }
        } finally {
            this.isProcessing = false;
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('checkout-container')) {
        const checkoutPage = new CheckoutPage();
        checkoutPage.init();
    }
});

export { CheckoutPage };

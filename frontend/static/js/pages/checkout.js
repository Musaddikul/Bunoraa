// frontend/static/js/pages/checkout.js
/**
 * Checkout Page JavaScript
 */

import { $, $$, delegate, getFormData } from '../utils/dom.js';
import { formatPrice, isValidEmail, isValidPhone } from '../utils/helpers.js';
import { ordersApi, cartApi, authApi } from '../api/index.js';
import { FormValidator, rules, messages } from '../utils/validators.js';
import toast from '../components/toast.js';
import { setButtonLoading, showPageLoading, hidePageLoading } from '../components/loading.js';

/**
 * Checkout Page class
 */
export class CheckoutPage {
    constructor() {
        this.form = $('#checkout-form');
        this.summaryContainer = $('#checkout-summary');
        this.shippingSection = $('#shipping-section');
        this.paymentSection = $('#payment-section');
        this.placeOrderBtn = $('#place-order-btn');
        
        this.cart = null;
        this.user = null;
        this.addresses = [];
        this.shippingMethods = [];
        this.selectedShipping = null;
        this.paymentMethod = 'stripe';
        
        this.validator = null;
        
        this.init();
    }
    
    async init() {
        showPageLoading('Loading checkout...');
        
        try {
            // Load cart and user data in parallel
            await Promise.all([
                this.loadCart(),
                this.loadUser(),
                this.loadShippingMethods()
            ]);
            
            // Initialize form validation
            this.initValidation();
            
            // Bind events
            this.bindEvents();
            
            // Render
            this.render();
            
        } catch (error) {
            console.error('Checkout init error:', error);
            toast.error('Failed to load checkout');
        } finally {
            hidePageLoading();
        }
    }
    
    async loadCart() {
        const response = await cartApi.getCart();
        if (response.success) {
            this.cart = response.data;
            
            // Redirect if cart is empty
            if (!this.cart.items || this.cart.items.length === 0) {
                window.location.href = '/cart/';
            }
        }
    }
    
    async loadUser() {
        try {
            const response = await authApi.getProfile();
            if (response.success) {
                this.user = response.data;
                
                // Load addresses
                const addressResponse = await authApi.getAddresses();
                if (addressResponse.success) {
                    this.addresses = addressResponse.data || [];
                }
            }
        } catch (error) {
            // User not logged in - guest checkout
            this.user = null;
        }
    }
    
    async loadShippingMethods() {
        // TODO: Fetch from API
        this.shippingMethods = [
            { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
            { id: 'express', name: 'Express Shipping', price: 14.99, days: '2-3 business days' },
            { id: 'overnight', name: 'Overnight Shipping', price: 29.99, days: 'Next business day' }
        ];
        this.selectedShipping = this.shippingMethods[0];
    }
    
    initValidation() {
        if (!this.form) return;
        
        const schema = {
            email: [
                'required',
                'email'
            ],
            first_name: [
                'required',
                { rule: 'minLength', params: 2, message: 'First name must be at least 2 characters' }
            ],
            last_name: [
                'required',
                { rule: 'minLength', params: 2, message: 'Last name must be at least 2 characters' }
            ],
            phone: [
                'required',
                'phone'
            ],
            address_line1: [
                'required',
                { rule: 'minLength', params: 5, message: 'Address must be at least 5 characters' }
            ],
            city: [
                'required'
            ],
            state: [
                'required'
            ],
            postal_code: [
                'required',
                'postalCode'
            ],
            country: [
                'required'
            ]
        };
        
        this.validator = new FormValidator(this.form, schema, {
            validateOnBlur: true,
            showErrors: true
        });
    }
    
    bindEvents() {
        // Form submit
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.placeOrder();
        });
        
        // Shipping method change
        delegate(document, 'change', '[name="shipping_method"]', (e, target) => {
            this.selectedShipping = this.shippingMethods.find(m => m.id === target.value);
            this.updateSummary();
        });
        
        // Payment method change
        delegate(document, 'change', '[name="payment_method"]', (e, target) => {
            this.paymentMethod = target.value;
            this.updatePaymentSection();
        });
        
        // Saved address selection
        delegate(document, 'click', '[data-select-address]', (e, target) => {
            const addressId = target.dataset.selectAddress;
            this.selectAddress(addressId);
        });
        
        // Same as shipping checkbox
        $('#billing-same-as-shipping')?.addEventListener('change', (e) => {
            const billingSection = $('#billing-address-section');
            if (billingSection) {
                billingSection.classList.toggle('hidden', e.target.checked);
            }
        });
        
        // Create account checkbox
        $('#create-account')?.addEventListener('change', (e) => {
            const passwordSection = $('#password-section');
            if (passwordSection) {
                passwordSection.classList.toggle('hidden', !e.target.checked);
            }
        });
    }
    
    render() {
        this.renderContactSection();
        this.renderShippingSection();
        this.renderPaymentSection();
        this.updateSummary();
    }
    
    renderContactSection() {
        const section = $('#contact-section');
        if (!section) return;
        
        if (this.user) {
            section.innerHTML = `
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-gray-600">Contact</span>
                        <a href="/account/" class="text-sm text-primary-600 hover:underline">Edit</a>
                    </div>
                    <p class="font-medium">${this.user.email}</p>
                    ${this.user.phone ? `<p class="text-sm text-gray-600">${this.user.phone}</p>` : ''}
                </div>
            `;
        } else {
            section.innerHTML = `
                <div class="space-y-4">
                    <p class="text-sm text-gray-600">
                        Already have an account? <a href="/login/?next=/checkout/" class="text-primary-600 hover:underline">Log in</a>
                    </p>
                    
                    <div class="form-group">
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    
                    <div class="form-group">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" id="create-account" name="create_account" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                            <span class="text-sm text-gray-700">Create an account for faster checkout</span>
                        </label>
                    </div>
                    
                    <div id="password-section" class="hidden space-y-4">
                        <div class="form-group">
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                            <input type="password" id="password" name="password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    renderShippingSection() {
        if (!this.shippingSection) return;
        
        let html = '<div class="space-y-6">';
        
        // Saved addresses
        if (this.addresses.length > 0) {
            html += `
                <div class="space-y-3">
                    <p class="text-sm font-medium text-gray-700">Saved Addresses</p>
                    <div class="grid gap-3">
                        ${this.addresses.map(addr => `
                            <label class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary-500 ${addr.is_default ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}">
                                <input type="radio" name="saved_address" value="${addr.id}" ${addr.is_default ? 'checked' : ''} class="mt-1">
                                <div class="flex-1">
                                    <p class="font-medium">${addr.first_name} ${addr.last_name}</p>
                                    <p class="text-sm text-gray-600">${addr.address_line1}</p>
                                    ${addr.address_line2 ? `<p class="text-sm text-gray-600">${addr.address_line2}</p>` : ''}
                                    <p class="text-sm text-gray-600">${addr.city}, ${addr.state} ${addr.postal_code}</p>
                                    <p class="text-sm text-gray-600">${addr.country}</p>
                                </div>
                            </label>
                        `).join('')}
                        <label class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500">
                            <input type="radio" name="saved_address" value="new">
                            <span class="text-sm">Use a new address</span>
                        </label>
                    </div>
                </div>
            `;
        }
        
        // Address form
        html += `
            <div id="new-address-form" class="${this.addresses.length > 0 ? 'hidden' : ''}">
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input type="text" id="first_name" name="first_name" required value="${this.user?.first_name || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    <div class="form-group">
                        <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input type="text" id="last_name" name="last_name" required value="${this.user?.last_name || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                </div>
                
                <div class="form-group mt-4">
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input type="tel" id="phone" name="phone" required value="${this.user?.phone || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                
                <div class="form-group mt-4">
                    <label for="address_line1" class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input type="text" id="address_line1" name="address_line1" required placeholder="Street address" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                
                <div class="form-group mt-4">
                    <label for="address_line2" class="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc.</label>
                    <input type="text" id="address_line2" name="address_line2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div class="form-group">
                        <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input type="text" id="city" name="city" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    <div class="form-group">
                        <label for="state" class="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                        <input type="text" id="state" name="state" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div class="form-group">
                        <label for="postal_code" class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                        <input type="text" id="postal_code" name="postal_code" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    </div>
                    <div class="form-group">
                        <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                        <select id="country" name="country" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            <option value="">Select country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <!-- Add more countries -->
                        </select>
                    </div>
                </div>
                
                ${this.user ? `
                    <div class="form-group mt-4">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" name="save_address" checked class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                            <span class="text-sm text-gray-700">Save this address for future orders</span>
                        </label>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Shipping methods
        html += `
            <div class="mt-8">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Shipping Method</h3>
                <div class="space-y-3">
                    ${this.shippingMethods.map((method, index) => `
                        <label class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-primary-500 ${index === 0 ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}">
                            <div class="flex items-center gap-3">
                                <input type="radio" name="shipping_method" value="${method.id}" ${index === 0 ? 'checked' : ''} class="text-primary-600 focus:ring-primary-500">
                                <div>
                                    <p class="font-medium">${method.name}</p>
                                    <p class="text-sm text-gray-600">${method.days}</p>
                                </div>
                            </div>
                            <span class="font-medium">${formatPrice(method.price)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        html += '</div>';
        
        this.shippingSection.innerHTML = html;
        
        // Toggle new address form
        delegate(this.shippingSection, 'change', '[name="saved_address"]', (e, target) => {
            const newAddressForm = $('#new-address-form');
            if (newAddressForm) {
                newAddressForm.classList.toggle('hidden', target.value !== 'new');
            }
        });
    }
    
    renderPaymentSection() {
        if (!this.paymentSection) return;
        
        this.paymentSection.innerHTML = `
            <div class="space-y-4">
                <!-- Payment methods -->
                <div class="space-y-3">
                    <label class="flex items-center gap-3 p-4 border border-primary-500 bg-primary-50 rounded-lg cursor-pointer">
                        <input type="radio" name="payment_method" value="stripe" checked class="text-primary-600 focus:ring-primary-500">
                        <div class="flex-1">
                            <p class="font-medium">Credit / Debit Card</p>
                            <p class="text-sm text-gray-600">Pay securely with your card</p>
                        </div>
                        <div class="flex gap-2">
                            <img src="/static/images/payment/visa.svg" alt="Visa" class="h-6">
                            <img src="/static/images/payment/mastercard.svg" alt="Mastercard" class="h-6">
                            <img src="/static/images/payment/amex.svg" alt="American Express" class="h-6">
                        </div>
                    </label>
                    
                    <label class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-500">
                        <input type="radio" name="payment_method" value="paypal" class="text-primary-600 focus:ring-primary-500">
                        <div class="flex-1">
                            <p class="font-medium">PayPal</p>
                            <p class="text-sm text-gray-600">Pay with your PayPal account</p>
                        </div>
                        <img src="/static/images/payment/paypal.svg" alt="PayPal" class="h-6">
                    </label>
                </div>
                
                <!-- Card form -->
                <div id="card-form" class="mt-6">
                    <div id="card-element" class="p-3 border border-gray-300 rounded-lg">
                        <!-- Stripe Elements will be mounted here -->
                        <p class="text-sm text-gray-500 text-center py-4">Card payment form will load here</p>
                    </div>
                    <p id="card-errors" class="mt-2 text-sm text-red-600"></p>
                </div>
            </div>
        `;
        
        // TODO: Initialize Stripe Elements
    }
    
    updatePaymentSection() {
        const cardForm = $('#card-form');
        if (cardForm) {
            cardForm.classList.toggle('hidden', this.paymentMethod !== 'stripe');
        }
    }
    
    updateSummary() {
        if (!this.summaryContainer || !this.cart) return;
        
        const subtotal = this.cart.subtotal || 0;
        const discount = this.cart.discount || 0;
        const shipping = this.selectedShipping?.price || 0;
        const tax = (subtotal - discount) * 0.08; // 8% tax
        const total = subtotal - discount + shipping + tax;
        
        this.summaryContainer.innerHTML = `
            <div class="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <!-- Items -->
                <div class="space-y-4 mb-6">
                    ${this.cart.items.map(item => `
                        <div class="flex gap-3">
                            <div class="relative flex-shrink-0">
                                <div class="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                                    ${item.product?.image ? `<img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover">` : ''}
                                </div>
                                <span class="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                                    ${item.quantity}
                                </span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate">${item.product?.name}</p>
                                ${item.variant ? `<p class="text-xs text-gray-500">${item.variant.name}</p>` : ''}
                            </div>
                            <div class="text-sm font-medium">${formatPrice(item.total)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Totals -->
                <div class="space-y-3 border-t pt-4">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Subtotal</span>
                        <span>${formatPrice(subtotal)}</span>
                    </div>
                    
                    ${discount > 0 ? `
                        <div class="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-${formatPrice(discount)}</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Shipping</span>
                        <span>${formatPrice(shipping)}</span>
                    </div>
                    
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Tax</span>
                        <span>${formatPrice(tax)}</span>
                    </div>
                    
                    <div class="flex justify-between text-lg font-semibold border-t pt-3">
                        <span>Total</span>
                        <span>${formatPrice(total)}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    selectAddress(addressId) {
        const address = this.addresses.find(a => a.id === addressId);
        if (!address) return;
        
        // Populate form
        Object.entries(address).forEach(([key, value]) => {
            const input = this.form?.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        });
    }
    
    async placeOrder() {
        // Validate form
        if (this.validator && !this.validator.validate()) {
            const firstError = this.form?.querySelector('.error');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        setButtonLoading(this.placeOrderBtn, true, 'Processing...');
        
        try {
            const formData = getFormData(this.form);
            
            // Build order data
            const orderData = {
                shipping_address: {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    address_line1: formData.address_line1,
                    address_line2: formData.address_line2,
                    city: formData.city,
                    state: formData.state,
                    postal_code: formData.postal_code,
                    country: formData.country
                },
                shipping_method: this.selectedShipping?.id,
                payment_method: this.paymentMethod,
                notes: formData.order_notes
            };
            
            // Add email for guest checkout
            if (!this.user) {
                orderData.email = formData.email;
                
                if (formData.create_account && formData.password) {
                    orderData.create_account = true;
                    orderData.password = formData.password;
                }
            }
            
            // Create order
            const response = await ordersApi.createOrder(orderData);
            
            if (response.success) {
                // Redirect based on payment method
                if (this.paymentMethod === 'stripe' && response.data.payment_url) {
                    window.location.href = response.data.payment_url;
                } else if (this.paymentMethod === 'paypal' && response.data.paypal_url) {
                    window.location.href = response.data.paypal_url;
                } else {
                    window.location.href = `/orders/${response.data.order_number}/confirmation/`;
                }
            } else {
                toast.error(response.message || 'Failed to place order');
            }
            
        } catch (error) {
            console.error('Place order error:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setButtonLoading(this.placeOrderBtn, false);
        }
    }
}

/**
 * Initialize checkout page
 */
export function initCheckoutPage() {
    return new CheckoutPage();
}

export default {
    CheckoutPage,
    initCheckoutPage
};

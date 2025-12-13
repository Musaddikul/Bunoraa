// static/js/api/checkout.js
/**
 * Checkout API Module
 * Handles checkout process and order creation
 */

import api from './client.js';

const CheckoutAPI = {
    /**
     * Initialize checkout session
     */
    async initCheckout() {
        return api.post('/checkout/init/');
    },

    /**
     * Get checkout data (addresses, shipping, etc.)
     */
    async getCheckoutData() {
        return api.get('/checkout/');
    },

    /**
     * Update shipping address
     */
    async setShippingAddress(addressId) {
        return api.patch('/checkout/shipping-address/', { address_id: addressId });
    },

    /**
     * Create new shipping address during checkout
     */
    async createShippingAddress(addressData) {
        return api.post('/checkout/shipping-address/', addressData);
    },

    /**
     * Update billing address
     */
    async setBillingAddress(addressId) {
        return api.patch('/checkout/billing-address/', { address_id: addressId });
    },

    /**
     * Set same as shipping
     */
    async useSameAsBilling(useSame) {
        return api.patch('/checkout/billing-same/', { same_as_shipping: useSame });
    },

    /**
     * Get available payment methods
     */
    async getPaymentMethods() {
        return api.get('/checkout/payment-methods/');
    },

    /**
     * Set payment method
     */
    async setPaymentMethod(methodId) {
        return api.patch('/checkout/payment-method/', { method_id: methodId });
    },

    /**
     * Add customer note
     */
    async setCustomerNote(note) {
        return api.patch('/checkout/note/', { note });
    },

    /**
     * Place order
     */
    async placeOrder() {
        return api.post('/checkout/place-order/');
    },

    /**
     * Process payment (for immediate payment methods)
     */
    async processPayment(orderNumber, paymentData) {
        return api.post(`/checkout/process-payment/${orderNumber}/`, paymentData);
    },

    /**
     * Validate checkout before submission
     */
    async validateCheckout() {
        return api.post('/checkout/validate/');
    },

    /**
     * Get order summary
     */
    async getOrderSummary() {
        return api.get('/checkout/summary/');
    },

    /**
     * Create Stripe payment intent
     */
    async createPaymentIntent() {
        return api.post('/checkout/create-payment-intent/');
    },

    /**
     * Confirm Stripe payment
     */
    async confirmStripePayment(paymentIntentId) {
        return api.post('/checkout/confirm-stripe/', { payment_intent_id: paymentIntentId });
    },

    /**
     * Initialize SSLCommerz payment
     */
    async initSSLCommerz() {
        return api.post('/checkout/sslcommerz/init/');
    }
};

export default CheckoutAPI;
export { CheckoutAPI as checkoutApi };

// Attach to window
window.CheckoutAPI = CheckoutAPI;

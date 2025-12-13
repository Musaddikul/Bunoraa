// static/js/api/storefront.js
/**
 * Storefront API Module
 * Handles homepage and content data
 */

import api from './client.js';

const StorefrontAPI = {
    /**
     * Get homepage data (banners, featured products, etc.)
     */
    async getHomepageData() {
        return api.get('/storefront/homepage/');
    },

    /**
     * Get active banners
     */
    async getBanners() {
        return api.get('/storefront/banners/');
    },

    /**
     * Get hero slider data
     */
    async getHeroSlider() {
        return api.get('/storefront/hero-slider/');
    },

    /**
     * Get promotional offers
     */
    async getOffers() {
        return api.get('/storefront/offers/');
    },

    /**
     * Get featured collections
     */
    async getFeaturedCollections() {
        return api.get('/storefront/collections/');
    },

    /**
     * Get collection by slug
     */
    async getCollection(slug) {
        return api.get(`/storefront/collections/${slug}/`);
    },

    /**
     * Get testimonials
     */
    async getTestimonials(limit = 6) {
        return api.get('/storefront/testimonials/', { limit });
    },

    /**
     * Get site info (about, contact, etc.)
     */
    async getSiteInfo() {
        return api.get('/storefront/site-info/');
    },

    /**
     * Get page content
     */
    async getPage(slug) {
        return api.get(`/storefront/pages/${slug}/`);
    },

    /**
     * Get FAQ categories
     */
    async getFAQCategories() {
        return api.get('/storefront/faq/');
    },

    /**
     * Get FAQs by category
     */
    async getFAQs(categorySlug) {
        return api.get(`/storefront/faq/${categorySlug}/`);
    },

    /**
     * Submit contact form
     */
    async submitContactForm(data) {
        return api.post('/storefront/contact/', data);
    },

    /**
     * Subscribe to newsletter
     */
    async subscribeNewsletter(email) {
        return api.post('/storefront/newsletter/', { email });
    },

    /**
     * Get footer data
     */
    async getFooterData() {
        return api.get('/storefront/footer/');
    },

    /**
     * Get social links
     */
    async getSocialLinks() {
        return api.get('/storefront/social-links/');
    }
};

export default StorefrontAPI;

// Attach to window
window.StorefrontAPI = StorefrontAPI;

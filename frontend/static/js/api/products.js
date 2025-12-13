// frontend/static/js/api/products.js
/**
 * Products API Module
 */

import api from './client.js';

export const productsApi = {
    /**
     * Get all products with filters
     */
    async getProducts(params = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.category) queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);
        if (params.min_price) queryParams.append('min_price', params.min_price);
        if (params.max_price) queryParams.append('max_price', params.max_price);
        if (params.tags) queryParams.append('tags', params.tags);
        if (params.in_stock) queryParams.append('in_stock', params.in_stock);
        if (params.on_sale) queryParams.append('on_sale', params.on_sale);
        if (params.ordering) queryParams.append('ordering', params.ordering);
        if (params.page) queryParams.append('page', params.page);
        if (params.page_size) queryParams.append('page_size', params.page_size);

        const query = queryParams.toString();
        return api.get(`/products/${query ? `?${query}` : ''}`);
    },

    /**
     * Get product by slug
     */
    async getProduct(slug) {
        return api.get(`/products/slug/${encodeURIComponent(slug)}/`);
    },

    /**
     * Get product by ID
     */
    async getProductById(id) {
        return api.get(`/products/${id}/`);
    },

    /**
     * Search products
     */
    async searchProducts(query) {
        return api.get(`/products/search/?q=${encodeURIComponent(query)}`);
    },

    /**
     * Get featured products
     */
    async getFeaturedProducts() {
        return api.get('/products/featured/');
    },

    /**
     * Get new arrivals
     */
    async getNewArrivals() {
        return api.get('/products/new-arrivals/');
    },

    /**
     * Get bestsellers
     */
    async getBestsellers() {
        return api.get('/products/best-sellers/');
    },

    /**
     * Get products on sale
     */
    async getSaleProducts() {
        return api.get('/products/on-sale/');
    },

    /**
     * Get related products
     */
    async getRelatedProducts(productId) {
        return api.get(`/products/${productId}/related/`);
    },

    /**
     * Get product reviews
     */
    async getProductReviews(productId, params = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.rating) queryParams.append('rating', params.rating);
        if (params.verified) queryParams.append('verified', params.verified);
        if (params.page) queryParams.append('page', params.page);

        const query = queryParams.toString();
        return api.get(`/reviews/products/${productId}/${query ? `?${query}` : ''}`);
    }
};

export default productsApi;

/**
 * Products Module
 * Product listing, filtering, and search functionality.
 */

import api from './client.js';

class ProductService {
    // =========================================================================
    // Product Listing
    // =========================================================================

    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/products/${queryString ? '?' + queryString : ''}`;
        return api.get(endpoint, false);
    }

    async getProduct(slug) {
        return api.get(`/products/${slug}/`, false);
    }

    async getProductById(id) {
        return api.get(`/products/by-id/${id}/`, false);
    }

    // =========================================================================
    // Categories
    // =========================================================================

    async getCategories() {
        return api.get('/categories/', false);
    }

    async getCategoryTree() {
        return api.get('/categories/tree/', false);
    }

    async getCategoryProducts(slug, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/categories/${slug}/products/${queryString ? '?' + queryString : ''}`, false);
    }

    // =========================================================================
    // Brands
    // =========================================================================

    async getBrands() {
        return api.get('/products/brands/', false);
    }

    async getBrand(slug) {
        return api.get(`/products/brands/${slug}/`, false);
    }

    async getBrandProducts(slug, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/products/brands/${slug}/products/${queryString ? '?' + queryString : ''}`, false);
    }

    // =========================================================================
    // Search
    // =========================================================================

    async search(query, params = {}) {
        return api.get(`/products/search/?q=${encodeURIComponent(query)}&${new URLSearchParams(params)}`, false);
    }

    async getSearchSuggestions(query) {
        return api.get(`/products/autocomplete/?q=${encodeURIComponent(query)}`, false);
    }

    // =========================================================================
    // Filters
    // =========================================================================

    async getFilters(categorySlug = null) {
        const endpoint = categorySlug 
            ? `/products/filters/?category=${categorySlug}`
            : '/products/filters/';
        return api.get(endpoint, false);
    }

    // =========================================================================
    // Reviews
    // =========================================================================

    async getProductReviews(productId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/reviews/products/${productId}/${queryString ? '?' + queryString : ''}`, false);
    }

    async getReviewStats(productId) {
        return api.get(`/reviews/products/${productId}/stats/`, false);
    }

    async submitReview(productId, data) {
        return api.post('/reviews/my-reviews/', {
            product: productId,
            ...data
        });
    }

    async voteReview(reviewId, isHelpful) {
        return api.post(`/reviews/${reviewId}/vote/`, { is_helpful: isHelpful });
    }

    // =========================================================================
    // Related Products
    // =========================================================================

    async getRelatedProducts(productId) {
        return api.get(`/products/${productId}/related/`, false);
    }

    async getFrequentlyBoughtTogether(productId) {
        return api.get(`/products/${productId}/frequently-bought/`, false);
    }

    // =========================================================================
    // Product Tracking
    // =========================================================================

    async trackProductView(productId) {
        try {
            await api.post(`/products/${productId}/view/`, {}, false);
        } catch (error) {
            // Silently fail
        }
    }

    // Alias for trackProductView to match page module naming
    async trackView(slug) {
        return this.trackProductView(slug);
    }
}

// Export singleton
const products = new ProductService();
export default products;
export { ProductService };
export { products as productsApi };

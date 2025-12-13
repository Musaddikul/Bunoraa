// static/js/api/search.js
/**
 * Search API Module
 * Handles search functionality
 */

import api from './client.js';

const SearchAPI = {
    /**
     * Search products
     */
    async searchProducts(query, options = {}) {
        const {
            page = 1,
            pageSize = 20,
            category = null,
            brand = null,
            minPrice = null,
            maxPrice = null,
            ordering = '-relevance',
            inStock = null
        } = options;

        const params = {
            q: query,
            page,
            page_size: pageSize,
            ordering
        };

        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (inStock !== null) params.in_stock = inStock;

        return api.get('/search/', params);
    },

    /**
     * Get search suggestions (autocomplete)
     */
    async getSuggestions(query, limit = 10) {
        return api.get('/search/suggestions/', { q: query, limit });
    },

    /**
     * Get popular searches
     */
    async getPopularSearches(limit = 10) {
        return api.get('/search/popular/', { limit });
    },

    /**
     * Get recent searches (for logged-in users)
     */
    async getRecentSearches(limit = 10) {
        return api.get('/search/recent/', { limit });
    },

    /**
     * Clear search history
     */
    async clearSearchHistory() {
        return api.delete('/search/history/');
    },

    /**
     * Get search filters (available facets for current results)
     */
    async getSearchFilters(query) {
        return api.get('/search/filters/', { q: query });
    },

    /**
     * Search categories
     */
    async searchCategories(query, limit = 5) {
        return api.get('/search/categories/', { q: query, limit });
    },

    /**
     * Search brands
     */
    async searchBrands(query, limit = 5) {
        return api.get('/search/brands/', { q: query, limit });
    },

    /**
     * Global search (products, categories, brands)
     */
    async globalSearch(query, limit = 5) {
        return api.get('/search/global/', { q: query, limit });
    },

    /**
     * Main search method (alias for searchProducts)
     */
    async search(params = {}) {
        const { q, page, per_page, ...filters } = params;
        return this.searchProducts(q, {
            page,
            pageSize: per_page,
            ...filters
        });
    }
};

export default SearchAPI;
export { SearchAPI as searchApi };

// Attach to window
window.SearchAPI = SearchAPI;

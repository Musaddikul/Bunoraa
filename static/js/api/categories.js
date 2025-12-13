/**
 * Bunoraa Categories API
 * Category-related API endpoints.
 * @module api/categories
 */

import api from './client.js';

const CategoriesAPI = {
    /**
     * Get all categories as tree
     */
    async getTree() {
        return api.get('/categories/tree/', { cache: true });
    },
    
    /**
     * Get all categories flat list
     */
    async list(options = {}) {
        const { parent, active = true } = options;
        return api.get('/categories/', {
            params: { parent, is_active: active },
            cache: true
        });
    },
    
    /**
     * Get single category by slug
     */
    async get(slug) {
        return api.get(`/categories/${slug}/`, { cache: true });
    },
    
    /**
     * Get category by path (e.g., 'clothing/men/shirts')
     */
    async getByPath(path) {
        return api.get(`/categories/path/${path}/`, { cache: true });
    },
    
    /**
     * Get category children
     */
    async getChildren(slug) {
        return api.get(`/categories/${slug}/children/`, { cache: true });
    },
    
    /**
     * Get category ancestors (breadcrumbs)
     */
    async getAncestors(slug) {
        return api.get(`/categories/${slug}/ancestors/`, { cache: true });
    },
    
    /**
     * Get featured categories
     */
    async getFeatured(limit = 8) {
        return api.get('/categories/featured/', {
            params: { limit },
            cache: true
        });
    },
    
    /**
     * Get menu categories
     */
    async getMenu() {
        return api.get('/categories/menu/', { cache: true });
    },
    
    /**
     * Get category products
     */
    async getProducts(slug, options = {}) {
        const { page = 1, limit = 24, includeChildren = true, sort, filters = {} } = options;
        return api.get(`/categories/${slug}/products/`, {
            params: {
                page,
                page_size: limit,
                include_children: includeChildren,
                ordering: sort,
                ...filters
            }
        });
    }
};

export default CategoriesAPI;
window.BunoraaCategories = CategoriesAPI;

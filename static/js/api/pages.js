/**
 * Pages API Module
 * @module api/pages
 */

const PagesApi = (function() {
    'use strict';

    async function getPage(slug) {
        return ApiClient.get(`/pages/${slug}/`, {}, { useCache: true, cacheTTL: 300000 });
    }

    async function getPages(params = {}) {
        return ApiClient.get('/pages/', {
            page: params.page || 1,
            page_size: params.pageSize || 20,
            category: params.category || undefined
        }, { useCache: true, cacheTTL: 300000 });
    }

    async function getBanners(location = null) {
        const params = location ? { location } : {};
        return ApiClient.get('/pages/banners/', params, { useCache: true, cacheTTL: 60000 });
    }

    async function getPromotions() {
        return ApiClient.get('/promotions/', {}, { useCache: true, cacheTTL: 60000 });
    }

    async function getActivePromotion(code) {
        return ApiClient.get(`/promotions/${code}/`);
    }

    async function getFaqs(params = {}) {
        return ApiClient.get('/faq/', {
            category: params.category || undefined
        }, { useCache: true, cacheTTL: 300000 });
    }

    async function getFaqCategories() {
        return ApiClient.get('/faq/categories/', {}, { useCache: true, cacheTTL: 300000 });
    }

    async function getLegalPage(slug) {
        return ApiClient.get(`/legal/${slug}/`, {}, { useCache: true, cacheTTL: 300000 });
    }

    async function getNotifications(params = {}) {
        return ApiClient.get('/notifications/', {
            page: params.page || 1,
            page_size: params.pageSize || 20,
            unread: params.unread || undefined
        }, { requiresAuth: true });
    }

    async function markNotificationRead(id) {
        return ApiClient.post(`/notifications/${id}/read/`, {}, { requiresAuth: true });
    }

    async function markAllNotificationsRead() {
        return ApiClient.post('/notifications/mark-all-read/', {}, { requiresAuth: true });
    }

    async function subscribe(email, name = null) {
        if (!email) {
            throw new Error('Email is required');
        }
        return ApiClient.post('/subscribers/', { email, name });
    }

    return {
        getPage,
        getPages,
        getBanners,
        getPromotions,
        getActivePromotion,
        getFaqs,
        getFaqCategories,
        getLegalPage,
        getNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        subscribe
    };
})();

window.PagesApi = PagesApi;

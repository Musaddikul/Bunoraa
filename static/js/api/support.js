/**
 * Support API Module
 * @module api/support
 */

const SupportApi = (function() {
    'use strict';

    async function getTickets(params = {}) {
        return ApiClient.get('/support/tickets/', {
            page: params.page || 1,
            page_size: params.pageSize || 10,
            status: params.status || undefined
        }, { requiresAuth: true });
    }

    async function getTicket(ticketId) {
        return ApiClient.get(`/support/tickets/${ticketId}/`, {}, { requiresAuth: true });
    }

    async function createTicket(data) {
        return ApiClient.post('/support/tickets/', data, { requiresAuth: true });
    }

    async function replyToTicket(ticketId, message) {
        return ApiClient.post(`/support/tickets/${ticketId}/reply/`, { message }, { requiresAuth: true });
    }

    async function closeTicket(ticketId) {
        return ApiClient.post(`/support/tickets/${ticketId}/close/`, {}, { requiresAuth: true });
    }

    async function submitContactForm(data) {
        return ApiClient.post('/contacts/', data);
    }

    async function getContactInfo() {
        return ApiClient.get('/contacts/info/', {}, { useCache: true, cacheTTL: 3600000 });
    }

    return {
        getTickets,
        getTicket,
        createTicket,
        replyToTicket,
        closeTicket,
        submitContactForm,
        getContactInfo
    };
})();

window.SupportApi = SupportApi;

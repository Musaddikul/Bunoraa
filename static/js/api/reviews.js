// static/js/api/reviews.js
/**
 * Reviews API Module
 * Handles product reviews
 */

import api from './client.js';

const ReviewsAPI = {
    /**
     * Get reviews for a product
     */
    async getProductReviews(productSlug, options = {}) {
        const {
            page = 1,
            pageSize = 10,
            rating = null,
            ordering = '-created_at',
            withImages = null
        } = options;

        const params = {
            page,
            page_size: pageSize,
            ordering
        };

        if (rating) params.rating = rating;
        if (withImages !== null) params.with_images = withImages;

        return api.get(`/products/${productSlug}/reviews/`, params);
    },

    /**
     * Get review statistics for a product
     */
    async getReviewStats(productSlug) {
        return api.get(`/products/${productSlug}/reviews/stats/`);
    },

    /**
     * Create review
     */
    async createReview(productSlug, data) {
        return api.post(`/products/${productSlug}/reviews/`, data);
    },

    /**
     * Update review
     */
    async updateReview(reviewId, data) {
        return api.patch(`/reviews/${reviewId}/`, data);
    },

    /**
     * Delete review
     */
    async deleteReview(reviewId) {
        return api.delete(`/reviews/${reviewId}/`);
    },

    /**
     * Upload review images
     */
    async uploadImages(reviewId, files) {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`image_${index}`, file);
        });
        return api.post(`/reviews/${reviewId}/images/`, formData);
    },

    /**
     * Mark review as helpful
     */
    async markHelpful(reviewId) {
        return api.post(`/reviews/${reviewId}/helpful/`);
    },

    /**
     * Report review
     */
    async reportReview(reviewId, reason) {
        return api.post(`/reviews/${reviewId}/report/`, { reason });
    },

    /**
     * Get user's reviews
     */
    async getMyReviews(page = 1) {
        return api.get('/reviews/my-reviews/', { page });
    },

    /**
     * Get pending reviews (products user can review)
     */
    async getPendingReviews() {
        return api.get('/reviews/pending/');
    },

    /**
     * Check if user can review product
     */
    async canReview(productSlug) {
        return api.get(`/products/${productSlug}/can-review/`);
    }
};

export default ReviewsAPI;

// Attach to window
window.ReviewsAPI = ReviewsAPI;

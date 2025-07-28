// static/js/reviews.js

// Global variables passed from Django template (defined in <script> tag in HTML)
// const PRODUCT_ID;
// const CSRF_TOKEN;
// const API_ENDPOINTS;
// const USER_AUTHENTICATED;
// const CURRENT_USER_ID;

// DOM Elements
const reviewSummaryContainer = document.getElementById('review-summary');
const avgRatingSpan = document.getElementById('avg-rating');
const overallStarsDiv = document.getElementById('overall-stars');
const totalReviewsSpan = document.getElementById('total-reviews');
const ratingBreakdownDiv = document.getElementById('rating-breakdown');

const reviewForm = document.getElementById('review-form');
const submitReviewBtn = document.getElementById('submit-review-btn');
const reviewSubmitSpinner = document.getElementById('review-submit-spinner');
const reviewFormMessages = document.getElementById('review-form-messages');
const reviewImageInput = document.getElementById('images');
const imagePreviewsContainer = document.getElementById('image-previews');

const reviewsContainer = document.getElementById('reviews-container');
const noReviewsMessage = document.getElementById('no-reviews-message');
const loadMoreBtn = document.getElementById('load-more-reviews');

let currentPage = 1;
const reviewsPerPage = 10; // Matches Django REST Framework pagination page_size

/**
 * Utility function to display messages to the user.
 * Assumes 'showToast' is globally available (e.g., from a utils.js file).
 * If not, uncomment and use the internal implementation.
 * @param {string} message - The message content.
 * @param {string} type - 'success' or 'error' or 'info'.
 */
function displayUserMessage(message, type) {
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        // Fallback if showToast is not available
        const p = document.createElement('p');
        p.textContent = message;
        p.className = `p-2 my-2 rounded text-sm ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
        reviewFormMessages.innerHTML = ''; // Clear previous messages
        reviewFormMessages.appendChild(p);
        setTimeout(() => p.remove(), 5000); // Remove message after 5 seconds
    }
}

/**
 * Fetches data from a given API endpoint.
 * Handles CSRF token, JSON content type, and error responses.
 * @param {string} url - The API URL.
 * @param {object} options - Fetch API options (method, headers, body).
 * @returns {Promise<object>} - A promise that resolves to the JSON response.
 */
async function apiFetch(url, options = {}) {
    const headers = {
        'X-CSRFToken': CSRF_TOKEN,
        ...options.headers,
    };

    // Set Content-Type only if body is JSON, not for FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, {
            headers: headers,
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            const errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData) || 'An unknown error occurred.';
            throw new Error(errorMessage);
        }
        return response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

/**
 * Renders a single review HTML element.
 * @param {object} review - The review object from the API.
 * @returns {HTMLElement} - The created review DOM element.
 */
function renderReview(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item border-b border-gray-200 dark:border-gray-700 py-6 last:border-b-0';
    reviewDiv.id = `review-${review.id}`; // Add ID for easy updates

    const ratingStarsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    const imagesHtml = review.images.length > 0 ?
        `<div class="review-images mt-3 flex flex-wrap gap-2">
            ${review.images.map(img => `
                <img src="${img.image_url}" alt="${img.alt_text}"
                     class="w-24 h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600 shadow-sm">
            `).join('')}
        </div>` : '';

    // Determine button classes based on user's vote status
    const getVoteButtonClass = (type) => {
        if (!USER_AUTHENTICATED) return 'opacity-50 cursor-not-allowed';
        if (review.user_has_voted && review.user_vote_type === type) return 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 ring-2 ring-primary-500';
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600';
    };

    reviewDiv.innerHTML = `
        <div class="flex items-start mb-3">
            <div class="flex-shrink-0 mr-4">
                <img src="https://placehold.co/40x40/cccccc/ffffff?text=${review.user.username.charAt(0).toUpperCase()}" alt="${review.user.username}" class="rounded-full w-10 h-10 object-cover">
            </div>
            <div class="flex-grow">
                <div class="flex items-center mb-1">
                    <span class="font-bold text-lg text-yellow-500">${ratingStarsHtml}</span>
                    <span class="ml-3 text-gray-700 dark:text-gray-200 font-semibold">${review.user.username}</span>
                    ${review.verified ? '<span class="ml-2 text-primary-600 text-xs font-medium bg-primary-50 px-2 py-0.5 rounded-full">Verified Buyer</span>' : ''}
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">${review.created_at_display}</p>
                <p class="text-gray-800 dark:text-gray-100 mt-2 leading-relaxed">${review.comment}</p>
                ${imagesHtml}
                <div class="review-actions mt-4 flex flex-wrap gap-3 text-sm">
                    <button class="vote-btn flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 transition-all duration-200 ${getVoteButtonClass('helpful')}"
                            data-review-id="${review.id}" data-vote-type="helpful" ${!USER_AUTHENTICATED ? 'disabled' : ''}>
                        <i class="fas fa-thumbs-up mr-1"></i> Helpful
                        (<span class="helpful-count">${review.helpful_count}</span>)
                    </button>
                    <button class="vote-btn flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 transition-all duration-200 ${getVoteButtonClass('not_helpful')}"
                            data-review-id="${review.id}" data-vote-type="not_helpful" ${!USER_AUTHENTICATED ? 'disabled' : ''}>
                        <i class="fas fa-thumbs-down mr-1"></i> Not Helpful
                        (<span class="not-helpful-count">${review.not_helpful_count}</span>)
                    </button>
                    <button class="flag-btn flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 transition-all duration-200
                            ${!review.user_can_flag || !USER_AUTHENTICATED ? 'opacity-50 cursor-not-allowed' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-200'}"
                            data-review-id="${review.id}" ${!review.user_can_flag || !USER_AUTHENTICATED ? 'disabled' : ''}>
                        <i class="fas fa-flag mr-1"></i> Flag
                        (<span class="flag-count">${review.flag_count}</span>)
                    </button>
                    ${review.pinned ? '<span class="flex items-center text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full"><i class="fas fa-thumbtack mr-1"></i> Pinned</span>' : ''}
                </div>
            </div>
        </div>
    `;

    // Add event listeners for vote and flag buttons
    reviewDiv.querySelectorAll('.vote-btn').forEach(button => {
        button.addEventListener('click', handleVote);
    });
    reviewDiv.querySelector('.flag-btn')?.addEventListener('click', handleFlag);

    return reviewDiv;
}

/**
 * Renders the list of reviews.
 * @param {Array<object>} reviews - Array of review objects.
 * @param {boolean} append - True to append, false to replace.
 */
function renderReviewList(reviews, append = true) {
    if (!append) {
        reviewsContainer.innerHTML = ''; // Clear existing reviews
    }

    if (reviews.length === 0 && !append) {
        noReviewsMessage.style.display = 'block';
    } else {
        noReviewsMessage.style.display = 'none';
        reviews.forEach(review => {
            reviewsContainer.appendChild(renderReview(review));
        });
    }
}

/**
 * Updates a specific review element on the page.
 * Useful for real-time updates after vote/flag.
 * @param {object} updatedReview - The review object with updated data.
 */
function updateReviewElement(updatedReview) {
    const existingElement = document.getElementById(`review-${updatedReview.id}`);
    if (existingElement) {
        const newElement = renderReview(updatedReview);
        existingElement.replaceWith(newElement);
    } else {
        // If the review is new or not yet rendered, prepend it
        // This assumes new reviews should appear at the top
        reviewsContainer.prepend(renderReview(updatedReview));
        noReviewsMessage.style.display = 'none'; // Hide "No reviews" message
    }
}

/**
 * Fetches and renders review summary statistics.
 */
async function loadReviewSummary() {
    try {
        const summary = await apiFetch(API_ENDPOINTS.summary);

        avgRatingSpan.textContent = summary.average.toFixed(1);
        totalReviewsSpan.textContent = `${summary.total} review${summary.total === 1 ? '' : 's'}`;

        // Render overall stars
        overallStarsDiv.innerHTML = '';
        const roundedAvg = Math.round(summary.average);
        for (let i = 1; i <= 5; i++) {
            const starClass = i <= roundedAvg ? 'fas fa-star' : 'far fa-star';
            const starEl = document.createElement('i');
            starEl.className = starClass;
            overallStarsDiv.appendChild(starEl);
        }

        // Render rating breakdown bars
        ratingBreakdownDiv.innerHTML = '';
        for (let i = 5; i >= 1; i--) {
            const count = summary.breakdown[i] || 0;
            const percentage = summary.total > 0 ? (count / summary.total * 100).toFixed(1) : 0;
            ratingBreakdownDiv.innerHTML += `
                <div class="flex items-center text-sm">
                    <span class="w-8 text-center text-gray-700 dark:text-gray-200">${i}★</span>
                    <div class="flex-grow bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mx-2">
                        <div class="bg-primary-500 h-2.5 rounded-full" style="width: ${percentage}%;"></div>
                    </div>
                    <span class="w-12 text-right text-gray-700 dark:text-gray-200">${count}</span>
                </div>
            `;
        }
    } catch (error) {
        displayUserMessage('Failed to load review summary.', 'error');
        console.error('Error loading review summary:', error);
    }
}

/**
 * Loads reviews from the API with pagination.
 * @param {boolean} reset - If true, clears existing reviews and starts from page 1.
 */
async function loadReviews(reset = false) {
    if (reset) {
        currentPage = 1;
        loadMoreBtn.style.display = 'none';
        reviewsContainer.innerHTML = ''; // Clear existing reviews
        noReviewsMessage.style.display = 'none'; // Temporarily hide
    }

    try {
        const url = `${API_ENDPOINTS.listReviews}?page=${currentPage}&page_size=${reviewsPerPage}`;
        const data = await apiFetch(url);

        renderReviewList(data.results, !reset); // Append if not resetting

        if (data.next) {
            loadMoreBtn.style.display = 'block';
            currentPage++;
        } else {
            loadMoreBtn.style.display = 'none';
        }

        if (data.results.length === 0 && currentPage === 1) { // No reviews on first load
            noReviewsMessage.style.display = 'block';
        }

    } catch (error) {
        displayUserMessage('Failed to load reviews.', 'error');
        console.error('Error loading reviews:', error);
        if (currentPage === 1) { // If initial load failed, show no reviews message
            noReviewsMessage.style.display = 'block';
            noReviewsMessage.textContent = 'Failed to load reviews. Please try again later.';
        }
    }
}

/**
 * Handles the submission of the review form.
 * @param {Event} event - The form submit event.
 */
async function handleSubmitReview(event) {
    event.preventDefault();

    if (!USER_AUTHENTICATED) {
        displayUserMessage('Please log in to submit a review.', 'error');
        return;
    }

    submitReviewBtn.disabled = true;
    reviewSubmitSpinner.style.display = 'inline-block';
    reviewFormMessages.innerHTML = '<p class="text-gray-600 dark:text-gray-300">Submitting your review...</p>';

    const formData = new FormData(reviewForm);
    // Ensure product ID is correctly passed, if not already in URL
    // formData.append('product', PRODUCT_ID); // Only if not already in hidden input

    try {
        const newReview = await apiFetch(API_ENDPOINTS.createReview, {
            method: 'POST',
            body: formData,
            // 'Content-Type' header is automatically set to 'multipart/form-data' by browser for FormData
        });

        displayUserMessage('Review submitted successfully! It will appear after moderation.', 'success');
        reviewForm.reset(); // Clear the form
        imagePreviewsContainer.innerHTML = ''; // Clear image previews
        loadReviewSummary(); // Refresh summary immediately
        // Note: The new review will only appear in the list after it's approved by moderation.
        // If auto-approval is enabled, you might call loadReviews(true) here.

    } catch (error) {
        displayUserMessage(`Error submitting review: ${error.message}`, 'error');
        console.error('Submit Review Error:', error);
    } finally {
        submitReviewBtn.disabled = false;
        reviewSubmitSpinner.style.display = 'none';
    }
}

/**
 * Handles image file selection and displays previews.
 * @param {Event} event - The change event from the file input.
 */
function handleImageSelect(event) {
    imagePreviewsContainer.innerHTML = ''; // Clear previous previews
    const files = event.target.files;
    if (files.length > 5) {
        displayUserMessage('You can upload a maximum of 5 images.', 'error');
        event.target.value = ''; // Clear selected files
        return;
    }

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            displayUserMessage(`File "${file.name}" is not an image. Only JPG/PNG allowed.`, 'error');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            displayUserMessage(`File "${file.name}" is larger than 2MB.`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            imagePreviewsContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Handles voting on a review.
 * @param {Event} event - The click event from the vote button.
 */
async function handleVote(event) {
    if (!USER_AUTHENTICATED) {
        displayUserMessage('Please log in to vote.', 'error');
        return;
    }

    const button = event.currentTarget;
    const reviewId = button.dataset.reviewId;
    const voteType = button.dataset.voteType; // 'helpful' or 'not_helpful'
    const isHelpful = (voteType === 'helpful');

    button.disabled = true; // Disable button to prevent multiple clicks

    try {
        const updatedReview = await apiFetch(`${API_ENDPOINTS.voteReview}${reviewId}/`, {
            method: 'POST',
            body: JSON.stringify({ helpful: isHelpful }),
        });
        updateReviewElement(updatedReview); // Update review HTML with new counts and user vote status
        // No need to reload summary unless voting affects overall average/total logic
        // loadReviewSummary();
    } catch (error) {
        displayUserMessage(`Error voting: ${error.message}`, 'error');
        console.error('Vote Error:', error);
    } finally {
        button.disabled = false;
    }
}

/**
 * Handles flagging a review.
 * @param {Event} event - The click event from the flag button.
 */
async function handleFlag(event) {
    if (!USER_AUTHENTICATED) {
        displayUserMessage('Please log in to flag a review.', 'error');
        return;
    }

    const button = event.currentTarget;
    const reviewId = button.dataset.reviewId;
    const reason = prompt("Please briefly state your reason for flagging this review (optional):");

    if (reason === null) return; // User cancelled prompt

    button.disabled = true;

    try {
        const updatedReview = await apiFetch(`${API_ENDPOINTS.flagReview}${reviewId}/`, {
            method: 'POST',
            body: JSON.stringify({ reason: reason }),
        });
        updateReviewElement(updatedReview); // Update review HTML with new flag count and user flag status
        displayUserMessage('Review flagged successfully. Thank you for your feedback.', 'success');
    } catch (error) {
        displayUserMessage(`Error flagging review: ${error.message}`, 'error');
        console.error('Flag Error:', error);
    } finally {
        button.disabled = false;
    }
}

/**
 * Initializes the reviews functionality on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initial loads
    loadReviewSummary();
    loadReviews(true); // Load first page of reviews

    // Event Listeners
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleSubmitReview);
    }
    if (reviewImageInput) {
        reviewImageInput.addEventListener('change', handleImageSelect);
    }
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => loadReviews(false));
    }
});

// --- Optional: WebSocket for Real-time Updates (requires Django Channels setup) ---
// This part is conceptual as it requires Django Channels or similar setup.
// For a truly "live update" experience, you would implement this.
/*
function setupReviewWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    // Adjust this URL to your Django Channels consumer endpoint for reviews
    const socket = new WebSocket(`${wsProtocol}${window.location.host}/ws/reviews/${PRODUCT_ID}/`);

    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log('Review WebSocket message:', data);

        // Handle different types of real-time events
        if (data.type === 'review_created' || data.type === 'review_updated') {
            // Only update if the review is approved, or if it's the current user's review
            if (data.review.is_approved || (USER_AUTHENTICATED && data.review.user.id === CURRENT_USER_ID)) {
                updateReviewElement(data.review); // Add/update review on the fly
                loadReviewSummary(); // Update summary counts
            }
        } else if (data.type === 'review_deleted') {
            const elementToRemove = document.getElementById(`review-${data.review_id}`);
            if (elementToRemove) {
                elementToRemove.remove();
                loadReviewSummary(); // Update summary counts
            }
        }
    };

    socket.onclose = function(e) {
        console.warn('Review WebSocket closed unexpectedly:', e);
        // Implement reconnect logic for production
        setTimeout(() => setupReviewWebSocket(), 3000); // Attempt to reconnect after 3 seconds
    };

    socket.onerror = function(e) {
        console.error('Review WebSocket error:', e);
    };
}

// Uncomment the line below and ensure Django Channels is set up for real-time updates
// document.addEventListener('DOMContentLoaded', setupReviewWebSocket);
*/

/**
 * @file Manages product-related frontend interactions, including the quick view modal.
 * @version 1.0.0
 * @author YourName
 */

const productQuickViewModal = document.getElementById('product-quick-view-modal');
const productQuickViewContent = document.getElementById('product-quick-view-content');

/**
 * Opens the product quick view modal and loads product details.
 * @param {number} productId - The ID of the product to display.
 */
window.showQuickView = async (productId) => {
    if (!productQuickViewModal || !productQuickViewContent) {
        console.error('Product quick view modal or content div not found. Cannot show quick view.');
        return;
    }

    // Show loading state
    productQuickViewContent.innerHTML = `
        <div class="text-center text-gray-500 py-10">
            <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
            <p>Loading product details...</p>
        </div>
    `;
    productQuickViewModal.classList.remove('hidden');

    try {
        // Corrected API endpoint
        const response = await fetch(`/products/quick-view/${productId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        productQuickViewContent.innerHTML = htmlContent;
        // Re-attach any specific event listeners for quick view content
        attachQuickViewListeners();
        attachQuickViewCloseListeners(); // Re-attach close listeners after content is loaded

    } catch (error) {
        console.error(`Error loading quick view for product ${productId}:`, error);
        productQuickViewContent.innerHTML = `<p class="text-red-500 text-center py-10">Failed to load product details. Please try again.</p>`;
        if (typeof showToast === 'function') {
            showToast('Failed to load product details.', 'error');
        }
    }
};

/**
 * Closes the product quick view modal.
 */
window.closeQuickViewModal = () => {
    if (!productQuickViewModal) return;

    productQuickViewModal.classList.add('hidden');
    // Reset content to a loading state or empty to prevent showing old data
    if (productQuickViewContent) {
        productQuickViewContent.innerHTML = `<div class="text-center text-gray-500 py-10">Loading product details...</div>`;
    }
};

// Helper to attach listeners for the quick view content if needed
function attachQuickViewListeners() {
    // Existing event listener for add to cart forms within the quick view modal
    document.querySelectorAll('.add-to-cart-form').forEach(form => {
        form.removeEventListener('submit', handleAddToCartSubmit); // Prevent duplicate listeners
        form.addEventListener('submit', handleAddToCartSubmit);
    });
}

// Function to attach/re-attach close listeners for the quick view modal
function attachQuickViewCloseListeners() {
    document.getElementById('product-quick-view-backdrop')?.removeEventListener('click', window.closeQuickViewModal);
    document.getElementById('product-quick-view-backdrop')?.addEventListener('click', window.closeQuickViewModal);

    productQuickViewModal?.querySelector('.close-modal-btn')?.removeEventListener('click', window.closeQuickViewModal);
    productQuickViewModal?.querySelector('.close-modal-btn')?.addEventListener('click', window.closeQuickViewModal);
}

// Initial attachment of event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    attachQuickViewCloseListeners(); // Attach listeners on initial load

    // Attach add-to-cart listeners for all forms with the class 'add-to-cart-form'
    document.querySelectorAll('.add-to-cart-form').forEach(form => {
        form.removeEventListener('submit', handleAddToCartSubmit); // Prevent duplicate listeners
        form.addEventListener('submit', handleAddToCartSubmit);
    });

    // Close modals/sidebars on Escape key press (if not already handled globally)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (productQuickViewModal && !productQuickViewModal.classList.contains('hidden')) {
                window.closeQuickViewModal();
            }
        }
    });
});

// Handle add to cart form submission (moved from quick_view.js)
async function handleAddToCartSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const productId = form.dataset.productId;
    const quantityInput = form.querySelector('input[name="quantity"]');
    const overrideInput = form.querySelector('input[name="override"]');
    const savedForLaterInput = form.querySelector('input[name="saved_for_later"]');

    const quantity = parseInt(quantityInput ? quantityInput.value : '1');
    const override = overrideInput ? (overrideInput.value === 'true') : false;
    const savedForLater = savedForLaterInput ? (savedForLaterInput.value === 'true') : false;

    if (isNaN(quantity) || quantity < 1) {
        showToast('Quantity must be at least 1.', 'error');
        return;
    }

    try {
        const response = await fetch('/cart/api/items/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Assuming getCookie is available globally or imported
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity,
                override_quantity: override,
                saved_for_later: savedForLater,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.non_field_errors?.join(', ') || 'Failed to add product to cart.');
        }

        if (data.message) {
            showToast(data.message, 'success');
        } else {
            showToast('Product added to cart.', 'success');
        }
        document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: data.cart.total_items }));
        window.closeQuickViewModal(); // Close modal after successful add to cart

    } catch (error) {
        console.error('Error adding product to cart:', error);
        showToast(error.message || 'Failed to add product to cart.', 'error');
    }
}

// Helper function to get CSRF token (if not already global)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

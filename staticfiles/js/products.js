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
        // Re-attach any specific event listeners if needed for quick view content
        attachQuickViewListeners();

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
    // Example: If the quick view has its own quantity controls or add to cart buttons
    // document.querySelectorAll('.quick-view-add-to-cart-btn').forEach(btn => {
    //     btn.addEventListener('click', () => { /* ... */ });
    // });
}

// Event listeners for closing the quick view modal
document.getElementById('product-quick-view-backdrop')?.addEventListener('click', window.closeQuickViewModal);
productQuickViewModal?.querySelector('.close-modal-btn')?.addEventListener('click', window.closeQuickViewModal);

// Close modals/sidebars on Escape key press (if not already handled globally)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (productQuickViewModal && !productQuickViewModal.classList.contains('hidden')) {
            window.closeQuickViewModal();
        }
    }
});

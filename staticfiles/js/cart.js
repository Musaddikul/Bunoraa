/**
 * @file Manages all cart-related frontend interactions, including the quick cart sidebar,
 * product quick view modal, and dynamic cart count.
 * This file focuses on UI/UX for the sidebar and quick view, delegating data fetching
 * and complex rendering to cart_js_interactions.js.
 * @version 1.8.1
 * @author YourName
 */

/**
 * Initializes the quick cart sidebar and product quick view modal functionalities.
 * This function sets up event listeners for opening/closing the cart sidebar and
 * handling product quick view actions.
 */
function initCartModule() {
    const quickCartSidebar = document.getElementById('quick-cart-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    /**
     * Opens the quick cart sidebar.
     * Triggers a fetch and render of the sidebar content.
     * @param {Event} [e] - The event object (optional).
     */
    const openCartSidebar = async (e) => {
        if (e) e.preventDefault();
        if (!quickCartSidebar || !sidebarBackdrop) {
            console.error('Cart sidebar or backdrop not found. Cannot open cart.');
            return;
        }

        quickCartSidebar.classList.remove('translate-x-full');
        quickCartSidebar.classList.add('translate-x-0');
        sidebarBackdrop.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // Prevent body scroll

        // Fetch and render the sidebar content using the dedicated function from cart_js_interactions.js
        if (typeof window.fetchAndRenderSidebarCart === 'function') {
            await window.fetchAndRenderSidebarCart();
        } else {
            console.warn('window.fetchAndRenderSidebarCart function not found. Sidebar content may not load.');
            // Display a loading message or error in the sidebar if the function isn't available
            const sidebarContentWrapper = document.getElementById('cart-sidebar-content-wrapper');
            if (sidebarContentWrapper) {
                sidebarContentWrapper.innerHTML = `
                    <div class="p-4 text-center text-gray-500">
                        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                        <p>Loading cart content...</p>
                    </div>
                `;
            }
        }
    };

    /**
     * Closes the quick cart sidebar.
     */
    const closeCartSidebar = () => {
        if (!quickCartSidebar || !sidebarBackdrop) return;

        quickCartSidebar.classList.remove('translate-x-0');
        quickCartSidebar.classList.add('translate-x-full');
        sidebarBackdrop.classList.add('hidden');
        document.body.classList.remove('overflow-hidden'); // Restore body scroll
    };

    /**
     * Updates the cart item count displayed in the navbar.
     * @param {number} count - The new total number of items in the cart.
     */
    const updateCartCount = (count) => {
        const cartCountElement = document.getElementById('cart-item-count');
        const mobileCartCountElement = document.getElementById('mobile-cart-count');
        const sidebarCartCountSpan = document.querySelector('#quick-cart-sidebar .cart-count-span');

        if (cartCountElement) {
            cartCountElement.textContent = count.toString();
            // Add a subtle animation to indicate update
            cartCountElement.classList.add('animate-ping-once');
            setTimeout(() => {
                cartCountElement.classList.remove('animate-ping-once');
            }, 500); // Remove class after animation
        }
        if (mobileCartCountElement) {
            mobileCartCountElement.textContent = count.toString();
        }
        if (sidebarCartCountSpan) {
            sidebarCartCountSpan.textContent = `(${count})`;
        }
    };

    /**
     * Handles the keyboard escape key press to close sidebar/modal.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                closeCartSidebar();
            }
        }
    };

    /**
     * Handles custom events for cart count updates.
     * This event is dispatched from cart_js_interactions.js after any cart modification.
     * @param {CustomEvent} event - The custom event containing the new cart count.
     */
    const handleCartCountUpdateEvent = (event) => {
        const newCount = typeof event.detail === 'number' ? event.detail : event.detail.count;
        const message = event.detail.message || 'Cart updated!';
        updateCartCount(newCount);
        if (typeof showToast === 'function' && event.detail.message) {
            showToast(message, 'success');
        }
        // If the quick cart sidebar is open, re-render its content
        if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
            if (typeof window.fetchAndRenderSidebarCart === 'function') {
                window.fetchAndRenderSidebarCart();
            }
        }
    };

    // --- Event Listeners ---
    // Cart sidebar triggers
    document.querySelectorAll('.navbar-cart-trigger').forEach(button => {
        button.addEventListener('click', openCartSidebar);
    });

    // Close cart sidebar via backdrop or close button
    sidebarBackdrop?.addEventListener('click', closeCartSidebar);
    quickCartSidebar?.querySelector('.close-sidebar-btn')?.addEventListener('click', closeCartSidebar);


    // Close modals/sidebars on Escape key press
    document.addEventListener('keydown', handleEscapeKey);

    // Listen for custom event to update cart count (e.g., dispatched from backend response)
    document.addEventListener('cartCountUpdate', handleCartCountUpdateEvent);

    // Expose global functions for direct calls from HTML (e.g., Django templates, Alpine.js)
    window.openCartSidebar = openCartSidebar;
    window.closeCartSidebar = closeCartSidebar;
    window.updateCartCount = updateCartCount; // Make updateCartCount globally accessible

}

// Expose initCartModule globally so app.js can call it.
window.initCartModule = initCartModule;

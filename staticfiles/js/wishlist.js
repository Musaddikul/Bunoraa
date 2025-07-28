// static/js/wishlist.js

/**
 * Global function to fetch the current wishlist count from the backend
 * and dispatch a custom event to update all listening components.
 * This function should be called whenever the wishlist state might have changed.
 */
window.updateWishlistCount = async () => {
    try {
        // Fetch the wishlist count from the Django API endpoint
        // Ensure this URL matches your Django URL configuration (e.g., /wishlist/count/)
        const response = await fetch('/wishlist/count/'); 
        
        if (response.ok) {
            const data = await response.json();
            // Dispatch a custom event with the new count.
            // This event will be caught by Alpine.js components in the navbar and wishlist detail page.
            window.dispatchEvent(new CustomEvent('wishlist-count-updated', { detail: { count: data.wishlist_count } }));
        } else {
            console.error('Failed to fetch wishlist count:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching wishlist count:', error);
    }
};

// Call updateWishlistCount on script load to ensure the navbar count is correct
// when any page loads. This is important for initial display.
// Using DOMContentLoaded to ensure the DOM is fully loaded before trying to fetch.
document.addEventListener('DOMContentLoaded', () => {
    window.updateWishlistCount();
});

// You can add more wishlist-related JavaScript functions here as your app grows.
// For example, functions to handle adding/removing products directly from JS,
// or more complex wishlist interactions.

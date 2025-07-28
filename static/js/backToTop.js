/**
 * @fileoverview Handles the "Back to Top" button functionality.
 * The button appears when the user scrolls down and smoothly scrolls back to the top when clicked.
 */

/**
 * Initializes the "Back to Top" button functionality.
 * Attaches scroll and click event listeners.
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) {
        console.warn('Back to Top button element not found.');
        return;
    }

    /**
     * Toggles the visibility of the back-to-top button based on scroll position.
     */
    const toggleVisibility = () => {
        // Add 'show' class when scrolled more than 300px, remove otherwise.
        backToTopBtn.classList.toggle('show', window.scrollY > 300);
        // Update ARIA-hidden attribute for accessibility.
        backToTopBtn.setAttribute('aria-hidden', window.scrollY <= 300);
    };

    // Add CSS for the 'show' class (you might need to add this to your tailwind.css or a custom CSS file)
    // Example CSS:
    // #backToTop {
    //     opacity: 0;
    //     visibility: hidden;
    //     transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    // }
    // #backToTop.show {
    //     opacity: 1;
    //     visibility: visible;
    // }


    // Listen for scroll events to toggle button visibility.
    window.addEventListener('scroll', toggleVisibility);

    // Listen for click event to scroll to top smoothly.
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        backToTopBtn.blur(); // Remove focus from the button after click.
    });

    // Perform an initial check in case the page is loaded with a scroll position.
    toggleVisibility();
}

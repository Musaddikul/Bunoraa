/**
 * @fileoverview Main entry point for the Bunoraa frontend application.
 * This file imports and initializes all modular JavaScript components
 * after the DOM content has been fully loaded.
 */

// Import individual module initialization functions
// Note: These functions are globally available because they are defined
// without 'export' and are loaded via <script> tags in base.html.
// If using ES6 modules with 'import/export', you would need actual imports here.

document.addEventListener('DOMContentLoaded', function () {
    /**
     * Initializes all core JavaScript components of the application.
     * This function calls the initialization functions from various modules.
     */
    function initComponents() {
        // Initialize global utility functions (already done by utils.js loading)
        // Ensure Toastr is configured if not already.
        if (typeof toastr !== 'undefined') {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-bottom-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };
        } else {
            console.warn('Toastr library not loaded. Toast notifications will not work.');
        }

        // Initialize individual modules
        if (typeof initThemeToggle === 'function') {
            initThemeToggle();
        } else {
            console.warn('initThemeToggle function not found. Theme toggle may not work.');
        }

        if (typeof initMobileMenu === 'function') {
            initMobileMenu();
        } else {
            console.warn('initMobileMenu function not found. Mobile menu may not work.');
        }

        if (typeof initSwipers === 'function') {
            initSwipers();
        } else {
            console.warn('initSwipers function not found. Swiper carousels may not work.');
        }

        if (typeof initBackToTop === 'function') {
            initBackToTop();
        } else {
            console.warn('initBackToTop function not found. Back to Top button may not work.');
        }

        // Initialize cart module interactions
        // initCartInteractions() is responsible for fetching and rendering the main cart page.
        // initCartModule() from cart.js handles the sidebar opening/closing and general cart count updates.
        if (typeof window.initCartModule === 'function') { // Use window.initCartModule
            window.initCartModule();
        } else {
            console.warn('window.initCartModule function not found. Cart features may not work.');
        }

        if (typeof window.initCartInteractions === 'function') { // Use window.initCartInteractions
             // This function is responsible for fetching and rendering the main cart page
             // and attaching event listeners. It will also trigger the initial cart count update.
            window.initCartInteractions();
        } else {
            console.warn('window.initCartInteractions function not found. Cart features may not work.');
        }

        // Removed global HTMX event listener as HTMX is no longer used for cart updates.
        // Cart count updates are now handled via custom events dispatched from cart_js_interactions.js
        // and listened to by cart.js.
    }

    // Initialize all components when the DOM is ready
    initComponents();
});

/**
 * @file General utility functions for the Bunoraa application.
 * @version 1.1.0
 * @author Musaddikul Islam
 */

/**
 * Displays a toast notification using Toastr.
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'|'warning'} type - The type of toast (e.g., 'success', 'error').
 */
function showToast(message, type = 'info') {
    if (typeof toastr === 'undefined') {
        console.warn('Toastr library not loaded. Cannot display toast notification.');
        return;
    }

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
    toastr[type](message);
}

/**
 * Retrieves a cookie by its name.
 * @param {string} name - The name of the cookie.
 * @returns {string|null} The cookie value, or null if not found.
 */
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

/**
 * Retrieves the CSRF token from the meta tag.
 * @returns {string|null} The CSRF token.
 */
function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

// Expose commonly used utility functions globally for easy access by other modules.
window.showToast = showToast;
window.getCookie = getCookie;
window.getCsrfToken = getCsrfToken;

/**
 * @fileoverview Handles the mobile navigation menu functionality.
 * Manages opening, closing, and sub-menu toggling for the mobile menu.
 */

/**
 * Initializes the mobile menu functionality.
 * Attaches event listeners for opening/closing the main menu and toggling sub-menus.
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    /**
     * Toggles the visibility of the mobile menu.
     * Prevents body scrolling when the menu is open.
     * @param {Event} [e] - The event object (optional).
     */
    const toggleMenu = (e) => {
        if (e) e.stopPropagation(); // Prevent click from propagating to document
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden', !isExpanded); // Prevent body scroll
    };

    mobileMenuButton?.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking outside of it.
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.contains(e.target) && mobileMenuButton && !mobileMenuButton.contains(e.target)) {
            if (!mobileMenu.classList.contains('hidden')) { // Only close if it's open
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('overflow-hidden');
            }
        }
    });

    // Mobile category toggles for sub-menus.
    document.querySelectorAll('.mobile-category-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default link behavior
            const submenuId = this.getAttribute('aria-controls');
            const submenu = document.getElementById(submenuId);
            if (submenu) {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                submenu.classList.toggle('hidden');
            }
        });
    });
}

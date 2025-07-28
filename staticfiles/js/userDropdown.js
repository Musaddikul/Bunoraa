/**
 * @file Manages the user profile dropdown menu functionality.
 * @version 1.7.0
 * @author YourName
 */

/**
 * Initializes the user dropdown functionality.
 * Attaches event listeners for opening/closing the dropdown.
 */
function initUserDropdown() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');

    // If elements are not found, log a warning and exit.
    if (!userMenuButton || !userMenu) {
        console.warn('User menu button or menu element not found. Skipping initialization.');
        return;
    }

    /**
     * Toggles the visibility of the user dropdown menu.
     */
    const toggleUserMenu = () => {
        const isHidden = userMenu.classList.contains('hidden');
        userMenuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        userMenu.classList.toggle('hidden'); // Toggle 'hidden' class for visibility
    };

    // Add click event listener to the user menu button.
    userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from propagating to document
        toggleUserMenu();
    });

    // Close the dropdown if a click occurs outside of it.
    document.addEventListener('click', (event) => {
        // Check if the click is outside both the menu and the button
        if (!userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
            if (!userMenu.classList.contains('hidden')) { // Only close if it's open
                userMenu.classList.add('hidden');
                userMenuButton.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Close the dropdown when the escape key is pressed.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !userMenu.classList.contains('hidden')) {
            userMenu.classList.add('hidden');
            userMenuButton.setAttribute('aria-expanded', 'false');
        }
    });
}

// Ensure the function runs when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', initUserDropdown);

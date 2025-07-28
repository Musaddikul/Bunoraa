/**
 * @fileoverview Handles theme toggling functionality (light/dark mode).
 * Manages applying and persisting the selected theme.
 */

/**
 * Initializes the theme toggle functionality.
 * Attaches event listeners to theme toggle buttons and applies the saved or system theme.
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    /**
     * Applies the given theme to the document and persists it in local storage.
     * Updates the theme icons accordingly.
     * @param {'light'|'dark'} theme - The theme to apply.
     */
    const applyTheme = (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    };

    /**
     * Updates the icons of theme toggle buttons based on the current theme.
     * @param {'light'|'dark'} theme - The current theme.
     */
    const updateThemeIcon = (theme) => {
        const icons = document.querySelectorAll('#themeToggle i, #mobile-theme-toggle i');
        icons.forEach(icon => {
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }
        });
    };

    /**
     * Toggles the theme between 'light' and 'dark'.
     */
    const toggleTheme = () => {
        const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };

    // Initialize theme: check local storage first, then system preference.
    const savedTheme = localStorage.getItem('theme') ||
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    // Listen for system theme changes and apply if no theme is explicitly saved.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Add event listeners to theme toggle buttons.
    themeToggle?.addEventListener('click', toggleTheme);
    mobileThemeToggle?.addEventListener('click', toggleTheme);
}

(function() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    const getStoredTheme = () => localStorage.getItem('theme');
    const resolveTheme = () => getStoredTheme() || (prefersDark.matches ? 'dark' : 'light');

    function updateMetaThemeColor(useDark) {
        if (metaTheme) {
            metaTheme.setAttribute('content', useDark ? '#0f172a' : '#f8fafc');
        }
    }

    function updateThemeIcons(isDark) {
        const lightIcon = document.getElementById('theme-toggle-light-icon');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        if (!lightIcon || !darkIcon) return;

        // Show icon that represents current theme for clarity
        lightIcon.classList.toggle('hidden', isDark);
        lightIcon.classList.toggle('block', !isDark);
        lightIcon.setAttribute('aria-hidden', isDark ? 'true' : 'false');

        darkIcon.classList.toggle('hidden', !isDark);
        darkIcon.classList.toggle('block', isDark);
        darkIcon.setAttribute('aria-hidden', isDark ? 'false' : 'true');
    }

    function applyTheme(theme, { persist = true } = {}) {
        const html = document.documentElement;
        const useDark = theme === 'dark';
        html.classList.toggle('dark', useDark);
        html.dataset.theme = useDark ? 'dark' : 'light';
        html.style.colorScheme = useDark ? 'dark' : 'light';
        document.body?.classList.toggle('dark', useDark);

        if (persist) {
            localStorage.setItem('theme', useDark ? 'dark' : 'light');
        }

        updateThemeIcons(useDark);
        updateMetaThemeColor(useDark);
    }

    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const initial = resolveTheme();
        applyTheme(initial, { persist: false });

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', initial === 'dark' ? 'true' : 'false');
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                applyTheme(next);
                themeToggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
            });
        }

        prefersDark.addEventListener('change', (e) => {
            if (!getStoredTheme()) {
                const next = e.matches ? 'dark' : 'light';
                applyTheme(next, { persist: false });
                themeToggle?.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
            }
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'theme' && e.newValue) {
                applyTheme(e.newValue, { persist: false });
                themeToggle?.setAttribute('aria-pressed', e.newValue === 'dark' ? 'true' : 'false');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();

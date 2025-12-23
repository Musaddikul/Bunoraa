(function() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    const getStoredTheme = () => {
        try {
            if (typeof Storage !== 'undefined' && Storage.get) return Storage.get('theme');
            return null;
        } catch (e) {
            return null;
        }
    };
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

        // Only one icon should be visible at a time
        if (isDark) {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        } else {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
        lightIcon.setAttribute('aria-hidden', isDark ? 'true' : 'false');
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
            try {
                if (typeof Storage !== 'undefined' && Storage.set) {
                    Storage.set('theme', useDark ? 'dark' : 'light');
                }
            } catch (e) {
                // Ignore storage errors
            }
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

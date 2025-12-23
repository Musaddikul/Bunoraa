(function() {
    function safeGetTheme() {
        try {
            if (typeof Storage !== 'undefined' && Storage.get) return Storage.get('theme');
            return null;
        } catch (e) {
            return null;
        }
    }

    const theme = safeGetTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const root = document.documentElement;
    const useDark = theme === 'dark';
    root.classList.toggle('dark', useDark);
    root.dataset.theme = useDark ? 'dark' : 'light';
    root.style.colorScheme = useDark ? 'dark' : 'light';
})();

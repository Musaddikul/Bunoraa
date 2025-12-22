(function() {
    const theme = localStorage.getItem('theme') ||
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const root = document.documentElement;
    const useDark = theme === 'dark';
    root.classList.toggle('dark', useDark);
    root.dataset.theme = useDark ? 'dark' : 'light';
    root.style.colorScheme = useDark ? 'dark' : 'light';
})();

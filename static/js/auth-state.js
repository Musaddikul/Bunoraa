(function() {
    // Safely serialize auth state; keep template tokens inside strings so parsers stay happy
    const isAuthString = "{{ request.user.is_authenticated|yesno:'true,false' }}";
    let userObj = null;
    try {
        const userJsonEl = document.getElementById('user-json');
        if (userJsonEl && userJsonEl.textContent.trim() !== '') {
            userObj = JSON.parse(userJsonEl.textContent);
        }
    } catch (e) {
        userObj = null;
        console.error('[AUTH STATE] Failed to parse user JSON:', e);
    }
    window.__DJANGO_SESSION_AUTH__ = isAuthString === "true";
    window.__DJANGO_USER__ = userObj;

    // Debug logs for dev
    try {

    } catch (e) { /* no-op in older browsers */ }

    // Route map for dynamic URL generation
    window.BUNORAA_ROUTE_PLACEHOLDER = '__slug__';
    // Routes are set in base.html template


})();

/**
 * Storage Utilities
 * Local storage and session storage helpers.
 */

const PREFIX = 'bunoraa_';

/**
 * Local Storage wrapper with JSON support
 */
export const storage = {
    /**
     * Get item from local storage
     * @param {string} key 
     * @param {*} defaultValue 
     * @returns {*}
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },

    /**
     * Set item in local storage
     * @param {string} key 
     * @param {*} value 
     * @returns {boolean}
     */
    set(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    /**
     * Remove item from local storage
     * @param {string} key 
     */
    remove(key) {
        localStorage.removeItem(PREFIX + key);
    },

    /**
     * Clear all prefixed items
     */
    clear() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(PREFIX)) {
                keys.push(key);
            }
        }
        keys.forEach(key => localStorage.removeItem(key));
    },

    /**
     * Check if key exists
     * @param {string} key 
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(PREFIX + key) !== null;
    }
};

/**
 * Session Storage wrapper
 */
export const session = {
    get(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },

    remove(key) {
        sessionStorage.removeItem(PREFIX + key);
    },

    clear() {
        const keys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key.startsWith(PREFIX)) {
                keys.push(key);
            }
        }
        keys.forEach(key => sessionStorage.removeItem(key));
    }
};

/**
 * Cookie utilities
 */
export const cookies = {
    /**
     * Get cookie value
     * @param {string} name 
     * @returns {string|null}
     */
    get(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop().split(';').shift());
        }
        return null;
    },

    /**
     * Set cookie
     * @param {string} name 
     * @param {string} value 
     * @param {Object} options 
     */
    set(name, value, options = {}) {
        const defaults = {
            path: '/',
            secure: window.location.protocol === 'https:',
            sameSite: 'Lax'
        };

        const opts = { ...defaults, ...options };
        let cookie = `${name}=${encodeURIComponent(value)}`;

        if (opts.expires instanceof Date) {
            cookie += `; expires=${opts.expires.toUTCString()}`;
        } else if (typeof opts.expires === 'number') {
            const d = new Date();
            d.setTime(d.getTime() + opts.expires * 24 * 60 * 60 * 1000);
            cookie += `; expires=${d.toUTCString()}`;
        }

        if (opts.path) cookie += `; path=${opts.path}`;
        if (opts.domain) cookie += `; domain=${opts.domain}`;
        if (opts.secure) cookie += '; secure';
        if (opts.sameSite) cookie += `; samesite=${opts.sameSite}`;

        document.cookie = cookie;
    },

    /**
     * Delete cookie
     * @param {string} name 
     * @param {Object} options 
     */
    remove(name, options = {}) {
        this.set(name, '', { ...options, expires: -1 });
    }
};

/**
 * Recently viewed products
 */
export const recentlyViewed = {
    KEY: 'recently_viewed',
    MAX_ITEMS: 20,

    /**
     * Add product to recently viewed
     * @param {Object} product 
     */
    add(product) {
        const items = this.get();
        const index = items.findIndex(p => p.id === product.id);
        
        if (index !== -1) {
            items.splice(index, 1);
        }
        
        items.unshift({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image,
            timestamp: Date.now()
        });

        if (items.length > this.MAX_ITEMS) {
            items.pop();
        }

        storage.set(this.KEY, items);
    },

    /**
     * Get recently viewed products
     * @param {number} limit 
     * @returns {Array}
     */
    get(limit = this.MAX_ITEMS) {
        const items = storage.get(this.KEY, []);
        return items.slice(0, limit);
    },

    /**
     * Clear recently viewed
     */
    clear() {
        storage.remove(this.KEY);
    }
};

/**
 * Compare list
 */
export const compareList = {
    KEY: 'compare_list',
    MAX_ITEMS: 4,

    add(productId) {
        const items = this.get();
        if (!items.includes(productId) && items.length < this.MAX_ITEMS) {
            items.push(productId);
            storage.set(this.KEY, items);
            window.dispatchEvent(new CustomEvent('compare:updated', { detail: items }));
            return true;
        }
        return false;
    },

    remove(productId) {
        const items = this.get().filter(id => id !== productId);
        storage.set(this.KEY, items);
        window.dispatchEvent(new CustomEvent('compare:updated', { detail: items }));
    },

    get() {
        return storage.get(this.KEY, []);
    },

    has(productId) {
        return this.get().includes(productId);
    },

    clear() {
        storage.remove(this.KEY);
        window.dispatchEvent(new CustomEvent('compare:updated', { detail: [] }));
    },

    count() {
        return this.get().length;
    }
};

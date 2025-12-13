// static/js/utils/helpers.js
/**
 * General Helper Functions
 * Common utility functions
 */

const Helpers = {
    /**
     * Debounce function
     */
    debounce(func, wait = 300, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clone = {};
            Object.keys(obj).forEach(key => {
                clone[key] = this.deepClone(obj[key]);
            });
            return clone;
        }
    },

    /**
     * Deep merge objects
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            });
        }

        return this.deepMerge(target, ...sources);
    },

    /**
     * Check if value is plain object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },

    /**
     * Check if value is empty
     */
    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string' && value.trim() === '') return true;
        if (Array.isArray(value) && value.length === 0) return true;
        if (this.isObject(value) && Object.keys(value).length === 0) return true;
        return false;
    },

    /**
     * Generate unique ID
     */
    uniqueId(prefix = 'id') {
        return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Generate UUID v4
     */
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },

    /**
     * Format currency
     */
    formatCurrency(amount, currency = 'USD', locale = 'en-US') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(amount);
    },

    /**
     * Format number
     */
    formatNumber(number, locale = 'en-US', options = {}) {
        return new Intl.NumberFormat(locale, options).format(number);
    },

    /**
     * Format date
     */
    formatDate(date, options = {}, locale = 'en-US') {
        const defaults = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat(locale, { ...defaults, ...options }).format(new Date(date));
    },

    /**
     * Get relative time (e.g., "2 hours ago")
     */
    relativeTime(date, locale = 'en-US') {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        const now = new Date();
        const target = new Date(date);
        const diffMs = target - now;
        const diffSec = Math.round(diffMs / 1000);
        const diffMin = Math.round(diffSec / 60);
        const diffHour = Math.round(diffMin / 60);
        const diffDay = Math.round(diffHour / 24);
        const diffMonth = Math.round(diffDay / 30);
        const diffYear = Math.round(diffDay / 365);

        if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
        if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
        if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
        if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
        if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
        return rtf.format(diffYear, 'year');
    },

    /**
     * Truncate text
     */
    truncate(text, length = 100, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + suffix;
    },

    /**
     * Capitalize first letter
     */
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * Convert to title case
     */
    titleCase(string) {
        return string
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    },

    /**
     * Convert to slug
     */
    slugify(string) {
        return string
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Parse query string to object
     */
    parseQueryString(queryString = window.location.search) {
        const params = new URLSearchParams(queryString);
        const result = {};
        params.forEach((value, key) => {
            if (result[key]) {
                result[key] = Array.isArray(result[key])
                    ? [...result[key], value]
                    : [result[key], value];
            } else {
                result[key] = value;
            }
        });
        return result;
    },

    /**
     * Build query string from object
     */
    buildQueryString(params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, v));
                } else {
                    searchParams.append(key, value);
                }
            }
        });
        return searchParams.toString();
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const result = document.execCommand('copy');
            document.body.removeChild(textarea);
            return result;
        }
    },

    /**
     * Get cookie value
     */
    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    },

    /**
     * Set cookie
     */
    setCookie(name, value, days = 7, path = '/') {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=Lax`;
    },

    /**
     * Delete cookie
     */
    deleteCookie(name, path = '/') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    },

    /**
     * Local storage with JSON
     */
    storage: {
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch {
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        },

        clear() {
            localStorage.clear();
        }
    },

    /**
     * Session storage with JSON
     */
    session: {
        get(key, defaultValue = null) {
            try {
                const value = sessionStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch {
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },

        remove(key) {
            sessionStorage.removeItem(key);
        },

        clear() {
            sessionStorage.clear();
        }
    },

    /**
     * Sleep/delay promise
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Retry async function
     */
    async retry(fn, retries = 3, delay = 1000) {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                if (i < retries - 1) {
                    await this.sleep(delay * (i + 1));
                }
            }
        }
        throw lastError;
    },

    /**
     * Check if mobile device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if touch device
     */
    isTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get browser info
     */
    getBrowser() {
        const ua = navigator.userAgent;
        let browser = 'unknown';

        if (ua.includes('Firefox')) browser = 'firefox';
        else if (ua.includes('Edge')) browser = 'edge';
        else if (ua.includes('Chrome')) browser = 'chrome';
        else if (ua.includes('Safari')) browser = 'safari';
        else if (ua.includes('MSIE') || ua.includes('Trident')) browser = 'ie';

        return browser;
    }
};

// Export
export default Helpers;
window.Helpers = Helpers;

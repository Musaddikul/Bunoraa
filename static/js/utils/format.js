/**
 * Formatting Utilities
 * Helper functions for data formatting.
 */

// Get current currency from page or default
function getCurrentCurrency() {
    return window.BUNORAA?.currency || {
        code: 'BDT',
        symbol: '৳',
        position: 'before'
    };
}

/**
 * Format currency
 * @param {number} amount 
 * @param {Object} options 
 * @returns {string}
 */
export function formatCurrency(amount, options = {}) {
    const currency = options.currency || getCurrentCurrency();
    const { code, symbol, position } = currency;
    
    const formatted = new Intl.NumberFormat('en-BD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
    }).format(amount);
    
    if (position === 'after') {
        return `${formatted}${symbol}`;
    }
    return `${symbol}${formatted}`;
}

/**
 * Format number with locale
 * @param {number} number 
 * @param {Object} options 
 * @returns {string}
 */
export function formatNumber(number, options = {}) {
    return new Intl.NumberFormat('en-BD', options).format(number);
}

/**
 * Format percentage
 * @param {number} value 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatPercent(value, decimals = 0) {
    return new Intl.NumberFormat('en-BD', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
}

/**
 * Format date
 * @param {Date|string} date 
 * @param {Object} options 
 * @returns {string}
 */
export function formatDate(date, options = {}) {
    const d = date instanceof Date ? date : new Date(date);
    
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-BD', { ...defaultOptions, ...options }).format(d);
}

/**
 * Format relative time
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatRelativeTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
        return 'Just now';
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
        return formatDate(d);
    }
}

/**
 * Format time countdown
 * @param {Date|string} endDate 
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
export function formatCountdown(endDate) {
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    const now = new Date();
    const diffMs = Math.max(0, end - now);
    
    return {
        days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
        total: diffMs
    };
}

/**
 * Format file size
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate text
 * @param {string} text 
 * @param {number} length 
 * @param {string} suffix 
 * @returns {string}
 */
export function truncate(text, length = 100, suffix = '...') {
    if (text.length <= length) return text;
    return text.slice(0, length - suffix.length).trim() + suffix;
}

/**
 * Pluralize word
 * @param {number} count 
 * @param {string} singular 
 * @param {string} plural 
 * @returns {string}
 */
export function pluralize(count, singular, plural = null) {
    const p = plural || singular + 's';
    return count === 1 ? singular : p;
}

/**
 * Generate URL slug
 * @param {string} text 
 * @returns {string}
 */
export function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Parse query string
 * @param {string} queryString 
 * @returns {Object}
 */
export function parseQuery(queryString = window.location.search) {
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params.entries()) {
        if (result[key]) {
            if (Array.isArray(result[key])) {
                result[key].push(value);
            } else {
                result[key] = [result[key], value];
            }
        } else {
            result[key] = value;
        }
    }
    
    return result;
}

/**
 * Build query string
 * @param {Object} params 
 * @returns {string}
 */
export function buildQuery(params) {
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined || value === '') continue;
        
        if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
        } else {
            searchParams.set(key, value);
        }
    }
    
    return searchParams.toString();
}

/**
 * Escape HTML
 * @param {string} text 
 * @returns {string}
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generate rating stars HTML
 * @param {number} rating 
 * @param {number} max 
 * @returns {string}
 */
export function ratingStars(rating, max = 5) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = max - fullStars - (hasHalf ? 1 : 0);
    
    let html = '';
    
    for (let i = 0; i < fullStars; i++) {
        html += '<svg class="w-4 h-4 text-yellow-400 fill-current"><use href="#icon-star-full"></use></svg>';
    }
    
    if (hasHalf) {
        html += '<svg class="w-4 h-4 text-yellow-400 fill-current"><use href="#icon-star-half"></use></svg>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        html += '<svg class="w-4 h-4 text-gray-300 fill-current"><use href="#icon-star-empty"></use></svg>';
    }
    
    return html;
}

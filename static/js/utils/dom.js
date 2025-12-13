// static/js/utils/dom.js
/**
 * DOM Utility Functions
 * Helper functions for DOM manipulation
 */

const DOM = {
    /**
     * Query selector shorthand
     */
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    /**
     * Query selector all shorthand
     */
    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    /**
     * Create element with attributes and children
     */
    create(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key === 'dataset' && typeof value === 'object') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                const event = key.slice(2).toLowerCase();
                element.addEventListener(event, value);
            } else if (key === 'html') {
                element.innerHTML = value;
            } else if (key === 'text') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });

        return element;
    },

    /**
     * Add event listener with delegation
     */
    on(element, event, selector, handler) {
        if (typeof selector === 'function') {
            // No delegation
            handler = selector;
            element.addEventListener(event, handler);
        } else {
            // With delegation
            element.addEventListener(event, (e) => {
                const target = e.target.closest(selector);
                if (target && element.contains(target)) {
                    handler.call(target, e, target);
                }
            });
        }
    },

    /**
     * Remove event listener
     */
    off(element, event, handler) {
        element.removeEventListener(event, handler);
    },

    /**
     * Add multiple event listeners
     */
    onMultiple(element, events, handler) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, handler);
        });
    },

    /**
     * One-time event listener
     */
    once(element, event, handler) {
        element.addEventListener(event, handler, { once: true });
    },

    /**
     * Toggle class
     */
    toggleClass(element, className, force) {
        if (force !== undefined) {
            return element.classList.toggle(className, force);
        }
        return element.classList.toggle(className);
    },

    /**
     * Check if element has class
     */
    hasClass(element, className) {
        return element.classList.contains(className);
    },

    /**
     * Add class(es)
     */
    addClass(element, ...classNames) {
        element.classList.add(...classNames.filter(Boolean));
    },

    /**
     * Remove class(es)
     */
    removeClass(element, ...classNames) {
        element.classList.remove(...classNames.filter(Boolean));
    },

    /**
     * Get/set data attribute
     */
    data(element, key, value) {
        if (value === undefined) {
            const val = element.dataset[key];
            try {
                return JSON.parse(val);
            } catch {
                return val;
            }
        }
        element.dataset[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    },

    /**
     * Get element offset (position relative to document)
     */
    offset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= -offset &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
        );
    },

    /**
     * Scroll to element
     */
    scrollTo(element, options = {}) {
        const {
            offset = 0,
            behavior = 'smooth',
            block = 'start'
        } = options;

        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element) return;

        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior });
    },

    /**
     * Get scroll position
     */
    getScroll() {
        return {
            x: window.scrollX || document.documentElement.scrollLeft,
            y: window.scrollY || document.documentElement.scrollTop
        };
    },

    /**
     * Empty element
     */
    empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    /**
     * Insert HTML at position
     */
    insertHTML(element, position, html) {
        element.insertAdjacentHTML(position, html);
    },

    /**
     * Wrap element
     */
    wrap(element, wrapper) {
        if (typeof wrapper === 'string') {
            wrapper = document.createElement(wrapper);
        }
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        return wrapper;
    },

    /**
     * Unwrap element
     */
    unwrap(element) {
        const parent = element.parentNode;
        while (element.firstChild) {
            parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
    },

    /**
     * Get siblings
     */
    siblings(element) {
        return Array.from(element.parentNode.children).filter(child => child !== element);
    },

    /**
     * Get closest parent matching selector
     */
    closest(element, selector) {
        return element.closest(selector);
    },

    /**
     * Check if element matches selector
     */
    matches(element, selector) {
        return element.matches(selector);
    },

    /**
     * Show element
     */
    show(element, display = 'block') {
        element.style.display = display;
    },

    /**
     * Hide element
     */
    hide(element) {
        element.style.display = 'none';
    },

    /**
     * Toggle element visibility
     */
    toggle(element, display = 'block') {
        if (element.style.display === 'none' || getComputedStyle(element).display === 'none') {
            element.style.display = display;
        } else {
            element.style.display = 'none';
        }
    },

    /**
     * Fade in element
     */
    fadeIn(element, duration = 300, callback) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    },

    /**
     * Fade out element
     */
    fadeOut(element, duration = 300, callback) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.display = 'none';
            element.style.transition = '';
            element.style.opacity = '';
            if (callback) callback();
        }, duration);
    },

    /**
     * Wait for DOM ready
     */
    ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }
};

// Export
export default DOM;
window.DOM = DOM;

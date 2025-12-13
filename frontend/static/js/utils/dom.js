// frontend/static/js/utils/dom.js
/**
 * DOM Utilities
 */

/**
 * Query selector shorthand
 */
export function $(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 */
export function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

/**
 * Create element with attributes and children
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class' || key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key === 'textContent' || key === 'text') {
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
}

/**
 * Add event listener with delegation
 */
export function delegate(element, eventType, selector, handler) {
    element.addEventListener(eventType, (event) => {
        const target = event.target.closest(selector);
        if (target && element.contains(target)) {
            handler.call(target, event, target);
        }
    });
}

/**
 * Toggle class
 */
export function toggleClass(element, className, force) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.classList.toggle(className, force);
    }
}

/**
 * Add class
 */
export function addClass(element, ...classNames) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.classList.add(...classNames);
    }
}

/**
 * Remove class
 */
export function removeClass(element, ...classNames) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.classList.remove(...classNames);
    }
}

/**
 * Has class
 */
export function hasClass(element, className) {
    if (typeof element === 'string') {
        element = $(element);
    }
    return element ? element.classList.contains(className) : false;
}

/**
 * Show element
 */
export function show(element, display = 'block') {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.style.display = display;
    }
}

/**
 * Hide element
 */
export function hide(element) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Toggle visibility
 */
export function toggle(element, display = 'block') {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        if (element.style.display === 'none') {
            element.style.display = display;
        } else {
            element.style.display = 'none';
        }
    }
}

/**
 * Fade in element
 */
export function fadeIn(element, duration = 300) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (!element) return;
    
    element.style.opacity = 0;
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease`;
    
    requestAnimationFrame(() => {
        element.style.opacity = 1;
    });
}

/**
 * Fade out element
 */
export function fadeOut(element, duration = 300) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (!element) return;
    
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = 0;
    
    setTimeout(() => {
        element.style.display = 'none';
    }, duration);
}

/**
 * Get form data as object
 */
export function getFormData(form) {
    if (typeof form === 'string') {
        form = $(form);
    }
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

/**
 * Serialize form to URL encoded string
 */
export function serializeForm(form) {
    if (typeof form === 'string') {
        form = $(form);
    }
    if (!form) return '';
    
    return new URLSearchParams(new FormData(form)).toString();
}

/**
 * Set input value
 */
export function setValue(selector, value) {
    const element = typeof selector === 'string' ? $(selector) : selector;
    if (element) {
        element.value = value;
    }
}

/**
 * Get input value
 */
export function getValue(selector) {
    const element = typeof selector === 'string' ? $(selector) : selector;
    return element ? element.value : '';
}

/**
 * Empty element
 */
export function empty(element) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.innerHTML = '';
    }
}

/**
 * Replace element content
 */
export function html(element, content) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.innerHTML = content;
    }
}

/**
 * Set element text
 */
export function text(element, content) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.textContent = content;
    }
}

export default {
    $,
    $$,
    createElement,
    delegate,
    toggleClass,
    addClass,
    removeClass,
    hasClass,
    show,
    hide,
    toggle,
    fadeIn,
    fadeOut,
    getFormData,
    serializeForm,
    setValue,
    getValue,
    empty,
    html,
    text
};

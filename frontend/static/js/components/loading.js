// frontend/static/js/components/loading.js
/**
 * Loading Components
 * Spinners, skeletons, progress indicators
 */

import { createElement, $ } from '../utils/dom.js';

/**
 * Spinner component
 */
export class Spinner {
    constructor(options = {}) {
        this.options = {
            size: options.size || 'md',
            color: options.color || 'primary',
            text: options.text || '',
            overlay: options.overlay || false
        };
        
        this.element = null;
    }
    
    getSizeClass() {
        const sizes = {
            xs: 'w-4 h-4',
            sm: 'w-6 h-6',
            md: 'w-8 h-8',
            lg: 'w-12 h-12',
            xl: 'w-16 h-16'
        };
        return sizes[this.options.size] || sizes.md;
    }
    
    getColorClass() {
        const colors = {
            primary: 'border-primary-600',
            secondary: 'border-gray-600',
            white: 'border-white',
            current: 'border-current'
        };
        return colors[this.options.color] || colors.primary;
    }
    
    create() {
        const wrapper = createElement('div', {
            class: `spinner-wrapper inline-flex flex-col items-center justify-center gap-2 ${this.options.overlay ? 'fixed inset-0 bg-white bg-opacity-80 z-50' : ''}`
        });
        
        const spinner = createElement('div', {
            class: `spinner animate-spin rounded-full border-2 border-t-transparent ${this.getSizeClass()} ${this.getColorClass()}`,
            role: 'status',
            'aria-label': 'Loading'
        });
        wrapper.appendChild(spinner);
        
        if (this.options.text) {
            const text = createElement('span', {
                class: 'text-sm text-gray-600',
                text: this.options.text
            });
            wrapper.appendChild(text);
        }
        
        this.element = wrapper;
        return this;
    }
    
    show(container = document.body) {
        if (!this.element) {
            this.create();
        }
        
        if (typeof container === 'string') {
            container = $(container);
        }
        
        container.appendChild(this.element);
        return this;
    }
    
    hide() {
        if (this.element) {
            this.element.remove();
        }
        return this;
    }
    
    setText(text) {
        if (this.element) {
            const textEl = this.element.querySelector('span');
            if (textEl) {
                textEl.textContent = text;
            }
        }
        return this;
    }
}

/**
 * Show spinner
 */
export function showSpinner(options = {}) {
    const spinner = new Spinner(options);
    return spinner.show(options.container);
}

/**
 * Button loading state
 */
export function setButtonLoading(button, loading = true, loadingText = null) {
    if (typeof button === 'string') {
        button = $(button);
    }
    if (!button) return;
    
    if (loading) {
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.classList.add('cursor-wait', 'opacity-75');
        button.innerHTML = `
            <span class="inline-flex items-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${loadingText || 'Loading...'}
            </span>
        `;
    } else {
        button.disabled = false;
        button.classList.remove('cursor-wait', 'opacity-75');
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
    }
}

/**
 * Skeleton loader
 */
export function skeleton(type = 'text', options = {}) {
    const baseClass = 'animate-pulse bg-gray-200 rounded';
    
    switch (type) {
        case 'text':
            return `<div class="${baseClass} h-4 ${options.width || 'w-full'}"></div>`;
            
        case 'title':
            return `<div class="${baseClass} h-6 ${options.width || 'w-3/4'}"></div>`;
            
        case 'avatar':
            const size = options.size || 'w-10 h-10';
            return `<div class="${baseClass} ${size} rounded-full"></div>`;
            
        case 'image':
            return `<div class="${baseClass} ${options.width || 'w-full'} ${options.height || 'h-48'}"></div>`;
            
        case 'button':
            return `<div class="${baseClass} h-10 ${options.width || 'w-24'}"></div>`;
            
        case 'card':
            return `
                <div class="border rounded-lg p-4 space-y-4">
                    <div class="${baseClass} h-48 w-full"></div>
                    <div class="${baseClass} h-4 w-3/4"></div>
                    <div class="${baseClass} h-4 w-1/2"></div>
                    <div class="${baseClass} h-6 w-1/4"></div>
                </div>
            `;
            
        case 'product-card':
            return `
                <div class="border rounded-lg overflow-hidden">
                    <div class="${baseClass} h-48 w-full rounded-none"></div>
                    <div class="p-4 space-y-3">
                        <div class="${baseClass} h-4 w-full"></div>
                        <div class="${baseClass} h-4 w-2/3"></div>
                        <div class="${baseClass} h-6 w-1/3"></div>
                    </div>
                </div>
            `;
            
        case 'list-item':
            return `
                <div class="flex items-center gap-4 py-4">
                    <div class="${baseClass} w-12 h-12 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                        <div class="${baseClass} h-4 w-3/4"></div>
                        <div class="${baseClass} h-3 w-1/2"></div>
                    </div>
                </div>
            `;
            
        default:
            return `<div class="${baseClass} ${options.class || 'h-4 w-full'}"></div>`;
    }
}

/**
 * Create skeleton grid
 */
export function skeletonGrid(type, count = 4, columns = 4) {
    const items = Array(count).fill(null).map(() => skeleton(type)).join('');
    return `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6">${items}</div>`;
}

/**
 * Progress bar
 */
export class ProgressBar {
    constructor(options = {}) {
        this.options = {
            value: options.value || 0,
            max: options.max || 100,
            showLabel: options.showLabel || false,
            color: options.color || 'primary',
            size: options.size || 'md',
            striped: options.striped || false,
            animated: options.animated || false
        };
        
        this.element = null;
    }
    
    getColorClass() {
        const colors = {
            primary: 'bg-primary-600',
            success: 'bg-green-600',
            warning: 'bg-yellow-600',
            danger: 'bg-red-600',
            info: 'bg-blue-600'
        };
        return colors[this.options.color] || colors.primary;
    }
    
    getSizeClass() {
        const sizes = {
            xs: 'h-1',
            sm: 'h-2',
            md: 'h-3',
            lg: 'h-4',
            xl: 'h-6'
        };
        return sizes[this.options.size] || sizes.md;
    }
    
    create() {
        const wrapper = createElement('div', { class: 'progress-wrapper' });
        
        if (this.options.showLabel) {
            const label = createElement('div', {
                class: 'flex justify-between text-sm mb-1'
            });
            label.innerHTML = `
                <span class="text-gray-600">Progress</span>
                <span class="progress-value font-medium">${this.getPercentage()}%</span>
            `;
            wrapper.appendChild(label);
        }
        
        const track = createElement('div', {
            class: `progress-track bg-gray-200 rounded-full overflow-hidden ${this.getSizeClass()}`
        });
        
        const barClasses = [
            'progress-bar',
            'h-full',
            'rounded-full',
            'transition-all',
            'duration-300',
            this.getColorClass()
        ];
        
        if (this.options.striped) {
            barClasses.push('bg-stripes');
        }
        
        if (this.options.animated) {
            barClasses.push('animate-stripes');
        }
        
        const bar = createElement('div', {
            class: barClasses.join(' '),
            style: `width: ${this.getPercentage()}%`,
            role: 'progressbar',
            'aria-valuenow': this.options.value,
            'aria-valuemin': '0',
            'aria-valuemax': this.options.max
        });
        
        track.appendChild(bar);
        wrapper.appendChild(track);
        
        this.element = wrapper;
        return this;
    }
    
    getPercentage() {
        return Math.round((this.options.value / this.options.max) * 100);
    }
    
    setValue(value) {
        this.options.value = Math.max(0, Math.min(value, this.options.max));
        
        if (this.element) {
            const bar = this.element.querySelector('.progress-bar');
            if (bar) {
                bar.style.width = `${this.getPercentage()}%`;
                bar.setAttribute('aria-valuenow', this.options.value);
            }
            
            const valueEl = this.element.querySelector('.progress-value');
            if (valueEl) {
                valueEl.textContent = `${this.getPercentage()}%`;
            }
        }
        
        return this;
    }
    
    increment(amount = 1) {
        return this.setValue(this.options.value + amount);
    }
    
    render(container) {
        if (!this.element) {
            this.create();
        }
        
        if (typeof container === 'string') {
            container = $(container);
        }
        
        container.appendChild(this.element);
        return this;
    }
}

/**
 * Full page loading overlay
 */
export function showPageLoading(message = 'Loading...') {
    let overlay = $('#page-loading-overlay');
    
    if (!overlay) {
        overlay = createElement('div', {
            id: 'page-loading-overlay',
            class: 'fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center'
        });
        
        overlay.innerHTML = `
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
                <p class="text-gray-600 loading-message">${message}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    } else {
        overlay.classList.remove('hidden');
        const msgEl = overlay.querySelector('.loading-message');
        if (msgEl) msgEl.textContent = message;
    }
    
    document.body.style.overflow = 'hidden';
    
    return overlay;
}

/**
 * Hide page loading
 */
export function hidePageLoading() {
    const overlay = $('#page-loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

export default {
    Spinner,
    showSpinner,
    setButtonLoading,
    skeleton,
    skeletonGrid,
    ProgressBar,
    showPageLoading,
    hidePageLoading
};

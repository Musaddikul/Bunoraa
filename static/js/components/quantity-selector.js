/**
 * Quantity Selector Component
 * Increment/decrement quantity input.
 */

import { $, $$, createElement } from '../utils/dom.js';

class QuantitySelector {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? $(container) : container;
        if (!this.container) return;

        this.options = {
            min: options.min || 1,
            max: options.max || 999,
            step: options.step || 1,
            value: options.value || 1,
            name: options.name || 'quantity',
            onChange: options.onChange || null,
            size: options.size || 'md', // sm, md, lg
            ...options
        };

        this.value = this.options.value;
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const sizes = {
            sm: { wrapper: 'h-8', button: 'w-8', text: 'text-sm' },
            md: { wrapper: 'h-10', button: 'w-10', text: 'text-base' },
            lg: { wrapper: 'h-12', button: 'w-12', text: 'text-lg' }
        };
        
        const size = sizes[this.options.size];

        this.container.innerHTML = `
            <div class="quantity-selector inline-flex items-center border border-gray-300 rounded-lg overflow-hidden ${size.wrapper}">
                <button 
                    type="button" 
                    class="quantity-decrease ${size.button} ${size.wrapper} flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    ${this.value <= this.options.min ? 'disabled' : ''}
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                </button>
                <input 
                    type="number" 
                    name="${this.options.name}" 
                    value="${this.value}" 
                    min="${this.options.min}" 
                    max="${this.options.max}" 
                    step="${this.options.step}"
                    class="quantity-input w-12 ${size.wrapper} ${size.text} text-center font-medium border-x border-gray-300 focus:outline-none focus:ring-0 appearance-none"
                >
                <button 
                    type="button" 
                    class="quantity-increase ${size.button} ${size.wrapper} flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    ${this.value >= this.options.max ? 'disabled' : ''}
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </div>
        `;

        this.input = $('.quantity-input', this.container);
        this.decreaseBtn = $('.quantity-decrease', this.container);
        this.increaseBtn = $('.quantity-increase', this.container);
    }

    bindEvents() {
        // Decrease
        this.decreaseBtn.addEventListener('click', () => {
            this.decrease();
        });

        // Increase
        this.increaseBtn.addEventListener('click', () => {
            this.increase();
        });

        // Input change
        this.input.addEventListener('change', (e) => {
            let value = parseInt(e.target.value) || this.options.min;
            value = Math.max(this.options.min, Math.min(this.options.max, value));
            this.setValue(value);
        });

        // Input focus select all
        this.input.addEventListener('focus', () => {
            this.input.select();
        });

        // Prevent non-numeric input
        this.input.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                e.key === 'ArrowUp' ? this.increase() : this.decrease();
            }
        });
    }

    increase() {
        if (this.value < this.options.max) {
            this.setValue(this.value + this.options.step);
        }
    }

    decrease() {
        if (this.value > this.options.min) {
            this.setValue(this.value - this.options.step);
        }
    }

    setValue(value) {
        const oldValue = this.value;
        this.value = value;
        this.input.value = value;
        
        // Update button states
        this.decreaseBtn.disabled = value <= this.options.min;
        this.increaseBtn.disabled = value >= this.options.max;

        // Callback
        if (oldValue !== value) {
            this.options.onChange?.(value, oldValue);
        }
    }

    getValue() {
        return this.value;
    }

    setMin(min) {
        this.options.min = min;
        this.input.min = min;
        if (this.value < min) {
            this.setValue(min);
        }
    }

    setMax(max) {
        this.options.max = max;
        this.input.max = max;
        if (this.value > max) {
            this.setValue(max);
        }
    }
}

// Auto-initialize
function initQuantitySelectors() {
    $$('[data-quantity-selector]').forEach(container => {
        new QuantitySelector(container, {
            min: parseInt(container.dataset.min) || 1,
            max: parseInt(container.dataset.max) || 999,
            value: parseInt(container.dataset.value) || 1,
            name: container.dataset.name || 'quantity'
        });
    });
}

export default QuantitySelector;
export { QuantitySelector, initQuantitySelectors };

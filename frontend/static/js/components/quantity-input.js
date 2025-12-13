// frontend/static/js/components/quantity-input.js
/**
 * Quantity Input Component
 * Increment/decrement number input with validation
 */

import { $, $$, createElement } from '../utils/dom.js';

/**
 * Quantity Input class
 */
export class QuantityInput {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? $(element) : element;
        if (!this.element) return;
        
        this.options = {
            min: parseInt(options.min) || parseInt(this.element.dataset.min) || 1,
            max: parseInt(options.max) || parseInt(this.element.dataset.max) || 9999,
            step: parseInt(options.step) || parseInt(this.element.dataset.step) || 1,
            onChange: options.onChange || null,
            inputSelector: options.inputSelector || 'input[type="number"]',
            decreaseSelector: options.decreaseSelector || '[data-decrease]',
            increaseSelector: options.increaseSelector || '[data-increase]'
        };
        
        this.input = this.element.querySelector(this.options.inputSelector);
        this.decreaseBtn = this.element.querySelector(this.options.decreaseSelector);
        this.increaseBtn = this.element.querySelector(this.options.increaseSelector);
        
        if (!this.input) {
            this.createInput();
        }
        
        this.init();
    }
    
    createInput() {
        // Create full quantity input structure
        this.element.innerHTML = `
            <button type="button" data-decrease class="w-10 h-10 flex items-center justify-center rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
            </button>
            <input type="number" value="1" min="${this.options.min}" max="${this.options.max}" step="${this.options.step}" 
                class="w-16 h-10 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <button type="button" data-increase class="w-10 h-10 flex items-center justify-center rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        `;
        
        this.input = this.element.querySelector('input');
        this.decreaseBtn = this.element.querySelector('[data-decrease]');
        this.increaseBtn = this.element.querySelector('[data-increase]');
    }
    
    init() {
        // Set attributes
        this.input.min = this.options.min;
        this.input.max = this.options.max;
        this.input.step = this.options.step;
        
        // Decrease button
        if (this.decreaseBtn) {
            this.decreaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.decrease();
            });
        }
        
        // Increase button
        if (this.increaseBtn) {
            this.increaseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.increase();
            });
        }
        
        // Input change
        this.input.addEventListener('change', () => this.validate());
        this.input.addEventListener('input', () => this.validate());
        
        // Initial validation
        this.updateButtonStates();
    }
    
    getValue() {
        return parseInt(this.input.value) || this.options.min;
    }
    
    setValue(value) {
        const oldValue = this.getValue();
        value = Math.max(this.options.min, Math.min(this.options.max, parseInt(value) || this.options.min));
        this.input.value = value;
        this.updateButtonStates();
        
        if (oldValue !== value && this.options.onChange) {
            this.options.onChange(value, oldValue);
        }
        
        return this;
    }
    
    increase() {
        const current = this.getValue();
        const newValue = Math.min(current + this.options.step, this.options.max);
        this.setValue(newValue);
    }
    
    decrease() {
        const current = this.getValue();
        const newValue = Math.max(current - this.options.step, this.options.min);
        this.setValue(newValue);
    }
    
    validate() {
        let value = parseInt(this.input.value);
        
        if (isNaN(value) || value < this.options.min) {
            value = this.options.min;
        } else if (value > this.options.max) {
            value = this.options.max;
        }
        
        this.input.value = value;
        this.updateButtonStates();
        
        if (this.options.onChange) {
            this.options.onChange(value);
        }
    }
    
    updateButtonStates() {
        const value = this.getValue();
        
        if (this.decreaseBtn) {
            this.decreaseBtn.disabled = value <= this.options.min;
            this.decreaseBtn.classList.toggle('opacity-50', value <= this.options.min);
            this.decreaseBtn.classList.toggle('cursor-not-allowed', value <= this.options.min);
        }
        
        if (this.increaseBtn) {
            this.increaseBtn.disabled = value >= this.options.max;
            this.increaseBtn.classList.toggle('opacity-50', value >= this.options.max);
            this.increaseBtn.classList.toggle('cursor-not-allowed', value >= this.options.max);
        }
    }
    
    setMin(min) {
        this.options.min = min;
        this.input.min = min;
        this.validate();
        return this;
    }
    
    setMax(max) {
        this.options.max = max;
        this.input.max = max;
        this.validate();
        return this;
    }
    
    disable() {
        this.input.disabled = true;
        if (this.decreaseBtn) this.decreaseBtn.disabled = true;
        if (this.increaseBtn) this.increaseBtn.disabled = true;
        this.element.classList.add('opacity-50');
        return this;
    }
    
    enable() {
        this.input.disabled = false;
        this.element.classList.remove('opacity-50');
        this.updateButtonStates();
        return this;
    }
}

/**
 * Initialize all quantity inputs
 */
export function initQuantityInputs() {
    const instances = [];
    
    $$('[data-quantity-input]').forEach(element => {
        instances.push(new QuantityInput(element));
    });
    
    return instances;
}

export default {
    QuantityInput,
    initQuantityInputs
};

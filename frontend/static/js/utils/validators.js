// frontend/static/js/utils/validators.js
/**
 * Form Validation Utilities
 */

/**
 * Validation rules
 */
export const rules = {
    required: (value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        return value !== null && value !== undefined;
    },
    
    email: (value) => {
        if (!value) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    
    phone: (value) => {
        if (!value) return true;
        return /^[\d\s\-+()]{10,20}$/.test(value.replace(/\s/g, ''));
    },
    
    minLength: (min) => (value) => {
        if (!value) return true;
        return value.length >= min;
    },
    
    maxLength: (max) => (value) => {
        if (!value) return true;
        return value.length <= max;
    },
    
    min: (min) => (value) => {
        if (value === '' || value === null || value === undefined) return true;
        return Number(value) >= min;
    },
    
    max: (max) => (value) => {
        if (value === '' || value === null || value === undefined) return true;
        return Number(value) <= max;
    },
    
    pattern: (regex) => (value) => {
        if (!value) return true;
        return regex.test(value);
    },
    
    numeric: (value) => {
        if (!value) return true;
        return /^\d+$/.test(value);
    },
    
    alphanumeric: (value) => {
        if (!value) return true;
        return /^[a-zA-Z0-9]+$/.test(value);
    },
    
    url: (value) => {
        if (!value) return true;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
    
    match: (fieldName) => (value, formData) => {
        if (!value) return true;
        return value === formData[fieldName];
    },
    
    creditCard: (value) => {
        if (!value) return true;
        const cleaned = value.replace(/\s|-/g, '');
        if (!/^\d{13,19}$/.test(cleaned)) return false;
        
        // Luhn algorithm
        let sum = 0;
        let isEven = false;
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i], 10);
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            isEven = !isEven;
        }
        return sum % 10 === 0;
    },
    
    expiryDate: (value) => {
        if (!value) return true;
        const match = value.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;
        
        const month = parseInt(match[1], 10);
        const year = parseInt('20' + match[2], 10);
        
        if (month < 1 || month > 12) return false;
        
        const now = new Date();
        const expiry = new Date(year, month - 1);
        return expiry > now;
    },
    
    cvv: (value) => {
        if (!value) return true;
        return /^\d{3,4}$/.test(value);
    },
    
    postalCode: (value) => {
        if (!value) return true;
        // Generic postal code - supports various formats
        return /^[A-Za-z0-9\s-]{3,10}$/.test(value);
    },
    
    password: (value) => {
        if (!value) return true;
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
    }
};

/**
 * Default error messages
 */
export const messages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    minLength: (min) => `Must be at least ${min} characters`,
    maxLength: (max) => `Must be no more than ${max} characters`,
    min: (min) => `Must be at least ${min}`,
    max: (max) => `Must be no more than ${max}`,
    pattern: 'Invalid format',
    numeric: 'Must contain only numbers',
    alphanumeric: 'Must contain only letters and numbers',
    url: 'Please enter a valid URL',
    match: 'Fields do not match',
    creditCard: 'Please enter a valid credit card number',
    expiryDate: 'Please enter a valid expiry date (MM/YY)',
    cvv: 'Please enter a valid CVV',
    postalCode: 'Please enter a valid postal code',
    password: 'Password must be at least 8 characters with uppercase, lowercase, and number'
};

/**
 * Validate a single value against rules
 */
export function validateValue(value, validationRules, formData = {}) {
    const errors = [];
    
    for (const rule of validationRules) {
        let ruleName, ruleParams, validator, message;
        
        if (typeof rule === 'string') {
            ruleName = rule;
            validator = rules[rule];
            message = messages[rule];
        } else if (typeof rule === 'object') {
            ruleName = rule.rule;
            ruleParams = rule.params;
            message = rule.message;
            
            if (typeof rules[ruleName] === 'function') {
                if (ruleParams !== undefined) {
                    validator = rules[ruleName](ruleParams);
                    if (typeof messages[ruleName] === 'function') {
                        message = message || messages[ruleName](ruleParams);
                    }
                } else {
                    validator = rules[ruleName];
                }
            }
        }
        
        if (validator && !validator(value, formData)) {
            errors.push(message || `Validation failed: ${ruleName}`);
        }
    }
    
    return errors;
}

/**
 * Validate form data against schema
 */
export function validateForm(formData, schema) {
    const errors = {};
    let isValid = true;
    
    for (const [field, fieldRules] of Object.entries(schema)) {
        const value = formData[field];
        const fieldErrors = validateValue(value, fieldRules, formData);
        
        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
            isValid = false;
        }
    }
    
    return { isValid, errors };
}

/**
 * Form validator class
 */
export class FormValidator {
    constructor(form, schema, options = {}) {
        this.form = typeof form === 'string' ? document.querySelector(form) : form;
        this.schema = schema;
        this.options = {
            validateOnBlur: true,
            validateOnChange: false,
            showErrors: true,
            errorClass: 'error',
            errorMessageClass: 'error-message',
            validClass: 'valid',
            ...options
        };
        this.errors = {};
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        if (this.options.validateOnBlur) {
            this.form.addEventListener('blur', this.handleBlur.bind(this), true);
        }
        
        if (this.options.validateOnChange) {
            this.form.addEventListener('change', this.handleChange.bind(this));
        }
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    
    handleBlur(event) {
        const field = event.target.name;
        if (field && this.schema[field]) {
            this.validateField(field);
        }
    }
    
    handleChange(event) {
        const field = event.target.name;
        if (field && this.schema[field]) {
            this.validateField(field);
        }
    }
    
    handleSubmit(event) {
        if (!this.validate()) {
            event.preventDefault();
        }
    }
    
    validateField(fieldName) {
        const input = this.form.elements[fieldName];
        if (!input) return true;
        
        const value = input.value;
        const formData = this.getFormData();
        const fieldErrors = validateValue(value, this.schema[fieldName], formData);
        
        if (fieldErrors.length > 0) {
            this.errors[fieldName] = fieldErrors;
            if (this.options.showErrors) {
                this.showFieldError(input, fieldErrors[0]);
            }
            return false;
        } else {
            delete this.errors[fieldName];
            if (this.options.showErrors) {
                this.clearFieldError(input);
            }
            return true;
        }
    }
    
    validate() {
        const formData = this.getFormData();
        const { isValid, errors } = validateForm(formData, this.schema);
        
        this.errors = errors;
        
        if (this.options.showErrors) {
            // Clear all errors first
            Object.keys(this.schema).forEach(field => {
                const input = this.form.elements[field];
                if (input) {
                    this.clearFieldError(input);
                }
            });
            
            // Show errors
            Object.entries(errors).forEach(([field, fieldErrors]) => {
                const input = this.form.elements[field];
                if (input) {
                    this.showFieldError(input, fieldErrors[0]);
                }
            });
        }
        
        return isValid;
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }
    
    showFieldError(input, message) {
        input.classList.add(this.options.errorClass);
        input.classList.remove(this.options.validClass);
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector(`.${this.options.errorMessageClass}`);
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorEl = document.createElement('span');
        errorEl.className = this.options.errorMessageClass;
        errorEl.textContent = message;
        input.parentElement.appendChild(errorEl);
    }
    
    clearFieldError(input) {
        input.classList.remove(this.options.errorClass);
        input.classList.add(this.options.validClass);
        
        const existingError = input.parentElement.querySelector(`.${this.options.errorMessageClass}`);
        if (existingError) {
            existingError.remove();
        }
    }
    
    getErrors() {
        return this.errors;
    }
    
    hasErrors() {
        return Object.keys(this.errors).length > 0;
    }
    
    reset() {
        this.errors = {};
        Object.keys(this.schema).forEach(field => {
            const input = this.form.elements[field];
            if (input) {
                this.clearFieldError(input);
            }
        });
    }
}

export default {
    rules,
    messages,
    validateValue,
    validateForm,
    FormValidator
};

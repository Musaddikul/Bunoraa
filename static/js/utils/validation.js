// static/js/utils/validation.js
/**
 * Form Validation Utilities
 * Client-side form validation
 */

const Validation = {
    /**
     * Email validation
     */
    isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Phone validation (international)
     */
    isPhone(phone) {
        const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return regex.test(phone.replace(/\s/g, ''));
    },

    /**
     * Bangladesh phone validation
     */
    isBDPhone(phone) {
        const regex = /^(\+880|880|0)?1[3-9]\d{8}$/;
        return regex.test(phone.replace(/[\s-]/g, ''));
    },

    /**
     * URL validation
     */
    isURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Minimum length
     */
    minLength(value, min) {
        return value.length >= min;
    },

    /**
     * Maximum length
     */
    maxLength(value, max) {
        return value.length <= max;
    },

    /**
     * Length range
     */
    lengthBetween(value, min, max) {
        return value.length >= min && value.length <= max;
    },

    /**
     * Required field
     */
    isRequired(value) {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
    },

    /**
     * Number validation
     */
    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    /**
     * Integer validation
     */
    isInteger(value) {
        return Number.isInteger(Number(value));
    },

    /**
     * Positive number
     */
    isPositive(value) {
        return this.isNumber(value) && Number(value) > 0;
    },

    /**
     * Number range
     */
    numberBetween(value, min, max) {
        const num = Number(value);
        return this.isNumber(value) && num >= min && num <= max;
    },

    /**
     * Password strength validation
     */
    isStrongPassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    },

    /**
     * Get password strength score (0-4)
     */
    getPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&#]/.test(password)) score++;
        return Math.min(score, 4);
    },

    /**
     * Match values (e.g., confirm password)
     */
    matches(value, compareTo) {
        return value === compareTo;
    },

    /**
     * Credit card number (Luhn algorithm)
     */
    isCreditCard(number) {
        const cleaned = number.replace(/\s|-/g, '');
        if (!/^\d{13,19}$/.test(cleaned)) return false;

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

    /**
     * Date validation
     */
    isDate(value) {
        const date = new Date(value);
        return !isNaN(date.getTime());
    },

    /**
     * Future date
     */
    isFutureDate(value) {
        const date = new Date(value);
        return this.isDate(value) && date > new Date();
    },

    /**
     * Past date
     */
    isPastDate(value) {
        const date = new Date(value);
        return this.isDate(value) && date < new Date();
    },

    /**
     * Age validation
     */
    isMinAge(birthDate, minAge) {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            return age - 1 >= minAge;
        }
        return age >= minAge;
    },

    /**
     * Postal code validation (generic)
     */
    isPostalCode(value, country = 'US') {
        const patterns = {
            US: /^\d{5}(-\d{4})?$/,
            UK: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
            CA: /^[A-Z]\d[A-Z]\s*\d[A-Z]\d$/i,
            BD: /^\d{4}$/,
            default: /^[\w\s-]{3,10}$/
        };
        const pattern = patterns[country] || patterns.default;
        return pattern.test(value);
    },

    /**
     * Alpha only
     */
    isAlpha(value) {
        return /^[a-zA-Z]+$/.test(value);
    },

    /**
     * Alphanumeric
     */
    isAlphanumeric(value) {
        return /^[a-zA-Z0-9]+$/.test(value);
    },

    /**
     * Slug format
     */
    isSlug(value) {
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
    },

    /**
     * File type validation
     */
    isValidFileType(file, allowedTypes) {
        const extension = file.name.split('.').pop().toLowerCase();
        const mimeType = file.type;

        return allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return extension === type.slice(1);
            }
            if (type.endsWith('/*')) {
                return mimeType.startsWith(type.slice(0, -1));
            }
            return mimeType === type;
        });
    },

    /**
     * File size validation
     */
    isValidFileSize(file, maxSizeMB) {
        return file.size <= maxSizeMB * 1024 * 1024;
    },

    /**
     * Image dimensions validation
     */
    async isValidImageDimensions(file, { minWidth, maxWidth, minHeight, maxHeight }) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const valid = 
                    (!minWidth || img.width >= minWidth) &&
                    (!maxWidth || img.width <= maxWidth) &&
                    (!minHeight || img.height >= minHeight) &&
                    (!maxHeight || img.height <= maxHeight);
                resolve(valid);
            };
            img.onerror = () => resolve(false);
            img.src = URL.createObjectURL(file);
        });
    },

    /**
     * Validate form data against rules
     */
    validateForm(data, rules) {
        const errors = {};

        Object.entries(rules).forEach(([field, fieldRules]) => {
            const value = data[field];
            const fieldErrors = [];

            if (Array.isArray(fieldRules)) {
                fieldRules.forEach(rule => {
                    const error = this._validateRule(value, rule, data);
                    if (error) fieldErrors.push(error);
                });
            } else {
                const error = this._validateRule(value, fieldRules, data);
                if (error) fieldErrors.push(error);
            }

            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    /**
     * Validate single rule
     */
    _validateRule(value, rule, allData) {
        if (typeof rule === 'string') {
            return this._validateStringRule(value, rule, allData);
        }

        if (typeof rule === 'object') {
            const { type, message, ...params } = rule;
            const isValid = this._validateStringRule(value, type, allData, params);
            return isValid ? null : (message || `Validation failed for ${type}`);
        }

        if (typeof rule === 'function') {
            return rule(value, allData);
        }

        return null;
    },

    /**
     * Validate string rule
     */
    _validateStringRule(value, rule, allData, params = {}) {
        switch (rule) {
            case 'required':
                return this.isRequired(value) ? null : 'This field is required';
            case 'email':
                return !value || this.isEmail(value) ? null : 'Invalid email address';
            case 'phone':
                return !value || this.isPhone(value) ? null : 'Invalid phone number';
            case 'url':
                return !value || this.isURL(value) ? null : 'Invalid URL';
            case 'number':
                return !value || this.isNumber(value) ? null : 'Must be a number';
            case 'integer':
                return !value || this.isInteger(value) ? null : 'Must be an integer';
            case 'positive':
                return !value || this.isPositive(value) ? null : 'Must be a positive number';
            case 'alpha':
                return !value || this.isAlpha(value) ? null : 'Only letters allowed';
            case 'alphanumeric':
                return !value || this.isAlphanumeric(value) ? null : 'Only letters and numbers allowed';
            case 'min':
                return !value || this.minLength(value, params.value) ? null : `Minimum ${params.value} characters`;
            case 'max':
                return !value || this.maxLength(value, params.value) ? null : `Maximum ${params.value} characters`;
            case 'match':
                return !value || this.matches(value, allData[params.field]) ? null : 'Values do not match';
            case 'strongPassword':
                return !value || this.isStrongPassword(value) ? null : 'Password must be at least 8 characters with uppercase, lowercase, and number';
            default:
                return null;
        }
    }
};

// Export
export default Validation;
window.Validation = Validation;

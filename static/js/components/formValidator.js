/**
 * Form Validator Component
 * @module components/formValidator
 */

const FormValidator = (function() {
    'use strict';

    const validators = {
        required: (value) => {
            if (value === null || value === undefined) return false;
            if (typeof value === 'string') return value.trim().length > 0;
            if (Array.isArray(value)) return value.length > 0;
            return true;
        },

        email: (value) => {
            if (!value) return true;
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(value);
        },

        phone: (value) => {
            if (!value) return true;
            const pattern = /^[\d\s+\-()]{10,20}$/;
            return pattern.test(value);
        },

        minLength: (value, min) => {
            if (!value) return true;
            return String(value).length >= min;
        },

        maxLength: (value, max) => {
            if (!value) return true;
            return String(value).length <= max;
        },

        min: (value, min) => {
            if (!value) return true;
            return parseFloat(value) >= min;
        },

        max: (value, max) => {
            if (!value) return true;
            return parseFloat(value) <= max;
        },

        pattern: (value, pattern) => {
            if (!value) return true;
            const regex = new RegExp(pattern);
            return regex.test(value);
        },

        match: (value, fieldName, form) => {
            const otherValue = form?.querySelector(`[name="${fieldName}"]`)?.value;
            return value === otherValue;
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

        numeric: (value) => {
            if (!value) return true;
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        integer: (value) => {
            if (!value) return true;
            return Number.isInteger(parseFloat(value));
        },

        alpha: (value) => {
            if (!value) return true;
            return /^[a-zA-Z]+$/.test(value);
        },

        alphanumeric: (value) => {
            if (!value) return true;
            return /^[a-zA-Z0-9]+$/.test(value);
        },

        date: (value) => {
            if (!value) return true;
            const date = new Date(value);
            return !isNaN(date.getTime());
        },

        before: (value, date) => {
            if (!value) return true;
            return new Date(value) < new Date(date);
        },

        after: (value, date) => {
            if (!value) return true;
            return new Date(value) > new Date(date);
        }
    };

    const messages = {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        minLength: 'Must be at least {{param}} characters',
        maxLength: 'Must be no more than {{param}} characters',
        min: 'Must be at least {{param}}',
        max: 'Must be no more than {{param}}',
        pattern: 'Please enter a valid value',
        match: 'Fields do not match',
        url: 'Please enter a valid URL',
        numeric: 'Please enter a number',
        integer: 'Please enter a whole number',
        alpha: 'Please enter only letters',
        alphanumeric: 'Please enter only letters and numbers',
        date: 'Please enter a valid date',
        before: 'Date must be before {{param}}',
        after: 'Date must be after {{param}}'
    };

    function addValidator(name, fn, message) {
        validators[name] = fn;
        if (message) messages[name] = message;
    }

    function getMessage(rule, param) {
        const msg = messages[rule] || 'Invalid value';
        return msg.replace('{{param}}', param);
    }

    function validateField(field, form = null) {
        const value = field.type === 'checkbox' ? field.checked : field.value;
        const rules = parseRules(field);
        const errors = [];

        for (const { rule, param } of rules) {
            const validator = validators[rule];
            if (!validator) continue;

            const isValid = rule === 'match' 
                ? validator(value, param, form) 
                : validator(value, param);

            if (!isValid) {
                errors.push(getMessage(rule, param));
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    function parseRules(field) {
        const rules = [];

        if (field.required) {
            rules.push({ rule: 'required' });
        }

        if (field.type === 'email') {
            rules.push({ rule: 'email' });
        }

        if (field.type === 'url') {
            rules.push({ rule: 'url' });
        }

        if (field.type === 'tel') {
            rules.push({ rule: 'phone' });
        }

        if (field.minLength > 0) {
            rules.push({ rule: 'minLength', param: field.minLength });
        }

        if (field.maxLength > 0) {
            rules.push({ rule: 'maxLength', param: field.maxLength });
        }

        if (field.min !== '') {
            rules.push({ rule: 'min', param: parseFloat(field.min) });
        }

        if (field.max !== '') {
            rules.push({ rule: 'max', param: parseFloat(field.max) });
        }

        if (field.pattern) {
            rules.push({ rule: 'pattern', param: field.pattern });
        }

        const dataValidate = field.dataset.validate;
        if (dataValidate) {
            dataValidate.split('|').forEach(ruleStr => {
                const [rule, param] = ruleStr.split(':');
                rules.push({ rule, param });
            });
        }

        return rules;
    }

    function showError(field, message) {
        clearError(field);

        field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.remove('border-gray-300', 'focus:border-primary-500', 'focus:ring-primary-500');

        const errorEl = document.createElement('p');
        errorEl.className = 'mt-1 text-sm text-red-600 field-error';
        errorEl.textContent = message;
        errorEl.id = `${field.id || field.name}-error`;
        field.setAttribute('aria-describedby', errorEl.id);
        field.setAttribute('aria-invalid', 'true');

        field.parentNode.appendChild(errorEl);
    }

    function clearError(field) {
        field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        field.classList.add('border-gray-300', 'focus:border-primary-500', 'focus:ring-primary-500');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');

        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) errorEl.remove();
    }

    function validateForm(form, options = {}) {
        const { showErrors = true, focusFirst = true } = options;
        const fields = form.querySelectorAll('input, select, textarea');
        const errors = new Map();
        let firstInvalid = null;

        fields.forEach(field => {
            if (field.disabled || field.type === 'hidden' || field.type === 'submit') return;

            const result = validateField(field, form);
            
            if (!result.valid) {
                errors.set(field.name || field.id, result.errors);
                
                if (showErrors) {
                    showError(field, result.errors[0]);
                }
                
                if (!firstInvalid) {
                    firstInvalid = field;
                }
            } else if (showErrors) {
                clearError(field);
            }
        });

        if (focusFirst && firstInvalid) {
            firstInvalid.focus();
        }

        return {
            valid: errors.size === 0,
            errors: Object.fromEntries(errors)
        };
    }

    function init(form, options = {}) {
        if (typeof form === 'string') {
            form = document.querySelector(form);
        }
        if (!form) return;

        const { validateOnBlur = true, validateOnInput = false, onSubmit = null } = options;

        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (validateOnBlur) {
                field.addEventListener('blur', () => {
                    const result = validateField(field, form);
                    if (!result.valid) {
                        showError(field, result.errors[0]);
                    } else {
                        clearError(field);
                    }
                });
            }

            if (validateOnInput) {
                field.addEventListener('input', Debounce.debounce(() => {
                    const result = validateField(field, form);
                    if (!result.valid) {
                        showError(field, result.errors[0]);
                    } else {
                        clearError(field);
                    }
                }, 300));
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const result = validateForm(form);
            
            if (result.valid && onSubmit) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                await onSubmit(data, form);
            }
        });

        return {
            validate: () => validateForm(form),
            reset: () => {
                fields.forEach(clearError);
                form.reset();
            },
            setErrors: (errors) => {
                Object.entries(errors).forEach(([name, msgs]) => {
                    const field = form.querySelector(`[name="${name}"]`);
                    if (field) {
                        showError(field, Array.isArray(msgs) ? msgs[0] : msgs);
                    }
                });
            }
        };
    }

    return {
        init,
        validateForm,
        validateField,
        showError,
        clearError,
        addValidator,
        validators,
        messages
    };
})();

window.FormValidator = FormValidator;

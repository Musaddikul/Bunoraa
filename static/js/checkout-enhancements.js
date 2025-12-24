/**
 * Bunoraa Checkout Enhancements
 * Dynamic data loading, animations, and improved UX
 */

(function() {
    'use strict';

    // ========================================
    // Animation Utilities
    // ========================================
    const Animations = {
        // Fade in element with slide
        fadeInUp(element, delay = 0) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        },

        // Fade in element with scale
        fadeInScale(element, delay = 0) {
            element.style.opacity = '0';
            element.style.transform = 'scale(0.95)';
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }, delay);
        },

        // Slide in from left
        slideInLeft(element, delay = 0) {
            element.style.opacity = '0';
            element.style.transform = 'translateX(-20px)';
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, delay);
        },

        // Pulse animation for highlights
        pulse(element) {
            element.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.02)' },
                { transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-in-out'
            });
        },

        // Shake animation for errors
        shake(element) {
            element.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], {
                duration: 400,
                easing: 'ease-in-out'
            });
        },

        // Highlight animation for updates
        highlight(element) {
            const originalBg = element.style.backgroundColor;
            element.style.transition = 'background-color 0.3s ease';
            element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            
            setTimeout(() => {
                element.style.backgroundColor = originalBg;
            }, 500);
        },

        // Stagger animation for list items
        staggerFadeIn(elements, baseDelay = 50) {
            elements.forEach((el, index) => {
                this.fadeInUp(el, index * baseDelay);
            });
        },

        // Progress bar animation
        animateProgress(element, targetWidth) {
            element.style.transition = 'width 0.5s ease-out';
            element.style.width = targetWidth;
        },

        // Counter animation
        animateCounter(element, targetValue, duration = 500) {
            const startValue = parseFloat(element.textContent.replace(/[^\d.]/g, '')) || 0;
            const startTime = performance.now();
            const symbol = element.textContent.match(/[^\d.,\s]+/)?.[0] || '';
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (targetValue - startValue) * easeOut;
                
                element.textContent = symbol + currentValue.toFixed(2);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
    };

    // ========================================
    // Dynamic Data Loader
    // ========================================
    const DataLoader = {
        config: null,

        async loadConfig() {
            if (this.config) return this.config;
            
            try {
                const response = await fetch('/api/v1/checkout/config/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'same-origin',
                });
                
                const data = await response.json();
                if (data.success) {
                    this.config = data.data;
                    return this.config;
                }
            } catch (error) {
                console.error('Failed to load checkout config:', error);
            }
            
            return null;
        },

        async loadDivisions(countryCode = 'BD') {
            try {
                const response = await fetch(`/api/v1/localization/countries/${countryCode}/divisions/`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin',
                });
                
                const data = await response.json();
                return data.success ? data.data : [];
            } catch (error) {
                console.error('Failed to load divisions:', error);
                return [];
            }
        },

        async loadDistricts(divisionCode) {
            try {
                const response = await fetch(`/api/v1/localization/divisions/${divisionCode}/districts/`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin',
                });
                
                const data = await response.json();
                return data.success ? data.data : [];
            } catch (error) {
                console.error('Failed to load districts:', error);
                return [];
            }
        }
    };

    // ========================================
    // Country/Division/District Cascading
    // ========================================
    const LocationHandler = {
        init() {
            const countrySelect = document.getElementById('country');
            const divisionSelect = document.getElementById('division') || document.getElementById('state');
            const districtSelect = document.getElementById('district') || document.getElementById('city');
            
            if (countrySelect) {
                countrySelect.addEventListener('change', async (e) => {
                    const country = e.target.value;
                    
                    if (country === 'BD' && divisionSelect) {
                        await this.loadDivisions(divisionSelect);
                    }
                });
            }
            
            if (divisionSelect) {
                divisionSelect.addEventListener('change', async (e) => {
                    const divisionCode = e.target.value;
                    
                    if (districtSelect && divisionCode) {
                        await this.loadDistricts(districtSelect, divisionCode);
                    }
                });
            }
        },

        async loadDivisions(selectElement) {
            selectElement.innerHTML = '<option value="">Loading...</option>';
            selectElement.disabled = true;
            
            const divisions = await DataLoader.loadDivisions('BD');
            
            selectElement.innerHTML = '<option value="">Select Division</option>';
            divisions.forEach(div => {
                const option = document.createElement('option');
                option.value = div.code;
                option.textContent = div.name;
                if (div.native_name) {
                    option.textContent += ` (${div.native_name})`;
                }
                selectElement.appendChild(option);
            });
            
            selectElement.disabled = false;
            Animations.pulse(selectElement);
        },

        async loadDistricts(selectElement, divisionCode) {
            selectElement.innerHTML = '<option value="">Loading...</option>';
            selectElement.disabled = true;
            
            const districts = await DataLoader.loadDistricts(divisionCode);
            
            selectElement.innerHTML = '<option value="">Select District</option>';
            districts.forEach(dist => {
                const option = document.createElement('option');
                option.value = dist.name;
                option.textContent = dist.name;
                if (dist.native_name) {
                    option.textContent += ` (${dist.native_name})`;
                }
                selectElement.appendChild(option);
            });
            
            selectElement.disabled = false;
            Animations.pulse(selectElement);
        }
    };

    // ========================================
    // Enhanced Order Summary
    // ========================================
    const OrderSummary = {
        init() {
            this.setupCollapsible();
            this.animateOnLoad();
        },

        setupCollapsible() {
            const toggleBtn = document.getElementById('order-summary-toggle');
            const summaryContent = document.getElementById('order-summary-content');
            
            if (toggleBtn && summaryContent) {
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = summaryContent.style.maxHeight !== '0px';
                    
                    if (isExpanded) {
                        summaryContent.style.maxHeight = '0px';
                        summaryContent.style.opacity = '0';
                    } else {
                        summaryContent.style.maxHeight = summaryContent.scrollHeight + 'px';
                        summaryContent.style.opacity = '1';
                    }
                    
                    toggleBtn.querySelector('.toggle-icon')?.classList.toggle('rotate-180');
                });
            }
        },

        animateOnLoad() {
            const items = document.querySelectorAll('.cart-item');
            if (items.length) {
                Animations.staggerFadeIn(items);
            }
        },

        updateTotal(newTotal, animate = true) {
            const totalElement = document.getElementById('order-total');
            if (totalElement) {
                if (animate) {
                    Animations.animateCounter(totalElement, newTotal);
                } else {
                    const symbol = totalElement.textContent.match(/[^\d.,\s]+/)?.[0] || '৳';
                    totalElement.textContent = symbol + newTotal.toFixed(2);
                }
                Animations.highlight(totalElement.parentElement);
            }
        },

        updateDiscount(amount, code) {
            const discountRow = document.getElementById('discount-row');
            const discountAmount = document.getElementById('discount-amount');
            const discountCode = document.getElementById('discount-code');
            
            if (amount > 0) {
                if (discountRow) {
                    discountRow.classList.remove('hidden');
                    Animations.fadeInUp(discountRow);
                }
                if (discountAmount) {
                    discountAmount.textContent = `-৳${amount.toFixed(2)}`;
                    Animations.highlight(discountAmount);
                }
                if (discountCode && code) {
                    discountCode.textContent = code;
                }
            } else if (discountRow) {
                discountRow.classList.add('hidden');
            }
        },

        updateShipping(cost) {
            const shippingCost = document.getElementById('shipping-cost');
            if (shippingCost) {
                shippingCost.textContent = cost === 0 ? 'Free' : `৳${cost.toFixed(2)}`;
                Animations.highlight(shippingCost.parentElement);
            }
        }
    };

    // ========================================
    // Form Enhancements
    // ========================================
    const FormEnhancements = {
        init() {
            this.setupInputAnimations();
            this.setupValidationFeedback();
            this.setupAutoFormat();
        },

        setupInputAnimations() {
            const inputs = document.querySelectorAll('.checkout-form input, .checkout-form select, .checkout-form textarea');
            
            inputs.forEach(input => {
                // Focus animations
                input.addEventListener('focus', () => {
                    const wrapper = input.closest('.form-group') || input.parentElement;
                    wrapper?.classList.add('ring-2', 'ring-primary-500/20');
                });
                
                input.addEventListener('blur', () => {
                    const wrapper = input.closest('.form-group') || input.parentElement;
                    wrapper?.classList.remove('ring-2', 'ring-primary-500/20');
                });
            });
        },

        setupValidationFeedback() {
            const form = document.querySelector('.checkout-form');
            if (!form) return;
            
            form.addEventListener('submit', (e) => {
                const invalidFields = form.querySelectorAll(':invalid');
                
                if (invalidFields.length > 0) {
                    e.preventDefault();
                    
                    // Animate invalid fields
                    invalidFields.forEach(field => {
                        Animations.shake(field);
                        field.classList.add('border-red-500');
                    });
                    
                    // Scroll to first invalid
                    invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    invalidFields[0].focus();
                }
            });
        },

        setupAutoFormat() {
            // Phone number formatting
            const phoneInput = document.querySelector('input[type="tel"]');
            if (phoneInput) {
                phoneInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    // Bangladesh phone format: +880 XXXX-XXXXXX
                    if (value.startsWith('880')) {
                        value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 7) + '-' + value.slice(7, 13);
                    } else if (value.startsWith('0')) {
                        value = value.slice(0, 5) + '-' + value.slice(5, 11);
                    }
                    
                    e.target.value = value;
                });
            }
            
            // Postal code formatting
            const postalInput = document.querySelector('input[name="postal_code"]');
            if (postalInput) {
                postalInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
                });
            }
        }
    };

    // ========================================
    // Payment Method Animations
    // ========================================
    const PaymentAnimations = {
        init() {
            const paymentOptions = document.querySelectorAll('.payment-option');
            
            paymentOptions.forEach(option => {
                const radio = option.querySelector('input[type="radio"]');
                
                option.addEventListener('click', () => {
                    // Remove selection from all
                    paymentOptions.forEach(opt => {
                        opt.classList.remove('ring-2', 'ring-primary-500', 'border-primary-500');
                        opt.classList.add('border-gray-200', 'dark:border-gray-700');
                    });
                    
                    // Add selection to clicked
                    option.classList.remove('border-gray-200', 'dark:border-gray-700');
                    option.classList.add('ring-2', 'ring-primary-500', 'border-primary-500');
                    
                    // Check radio
                    if (radio) radio.checked = true;
                    
                    // Animate
                    Animations.pulse(option);
                    
                    // Show relevant form
                    this.showPaymentForm(radio?.value);
                });
            });
        },

        showPaymentForm(method) {
            const forms = document.querySelectorAll('.payment-form');
            
            forms.forEach(form => {
                if (form.dataset.method === method) {
                    form.classList.remove('hidden');
                    Animations.fadeInUp(form);
                } else {
                    form.classList.add('hidden');
                }
            });
        }
    };

    // ========================================
    // Shipping Method Animations
    // ========================================
    const ShippingAnimations = {
        init() {
            const shippingOptions = document.querySelectorAll('.shipping-option');
            
            shippingOptions.forEach(option => {
                const radio = option.querySelector('input[type="radio"]');
                
                option.addEventListener('click', () => {
                    // Remove selection from all
                    shippingOptions.forEach(opt => {
                        opt.classList.remove('ring-2', 'ring-primary-500', 'border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
                    });
                    
                    // Add selection to clicked
                    option.classList.add('ring-2', 'ring-primary-500', 'border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
                    
                    // Check radio
                    if (radio) radio.checked = true;
                    
                    // Animate
                    Animations.pulse(option);
                    
                    // Update shipping cost display
                    const price = parseFloat(option.dataset.price) || 0;
                    OrderSummary.updateShipping(price);
                });
            });
        }
    };

    // ========================================
    // Progress Steps Animation
    // ========================================
    const ProgressSteps = {
        init() {
            const steps = document.querySelectorAll('.checkout-step');
            
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('opacity-100');
                    step.classList.remove('opacity-0');
                }, index * 100);
            });
        },

        setActive(stepNumber) {
            const steps = document.querySelectorAll('.checkout-step');
            
            steps.forEach((step, index) => {
                const stepNum = index + 1;
                const indicator = step.querySelector('.step-indicator');
                
                if (stepNum < stepNumber) {
                    // Completed
                    indicator?.classList.add('bg-green-600');
                    indicator?.classList.remove('bg-primary-600', 'bg-gray-300');
                } else if (stepNum === stepNumber) {
                    // Active
                    indicator?.classList.add('bg-primary-600');
                    indicator?.classList.remove('bg-green-600', 'bg-gray-300');
                    Animations.pulse(indicator);
                } else {
                    // Upcoming
                    indicator?.classList.add('bg-gray-300');
                    indicator?.classList.remove('bg-primary-600', 'bg-green-600');
                }
            });
        }
    };

    // ========================================
    // Initialize
    // ========================================
    document.addEventListener('DOMContentLoaded', async () => {
        // Load config from backend
        await DataLoader.loadConfig();
        
        // Initialize components
        LocationHandler.init();
        OrderSummary.init();
        FormEnhancements.init();
        PaymentAnimations.init();
        ShippingAnimations.init();
        ProgressSteps.init();
        
        // Animate page content
        const mainContent = document.querySelector('.checkout-content');
        if (mainContent) {
            Animations.fadeInUp(mainContent);
        }
        
        // Animate form sections
        const sections = document.querySelectorAll('.checkout-section');
        Animations.staggerFadeIn(sections, 100);
    });

    // Export for external use
    window.CheckoutEnhancements = {
        Animations,
        DataLoader,
        OrderSummary,
        LocationHandler,
        ProgressSteps
    };
})();

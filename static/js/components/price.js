/**
 * Price Component
 * @module components/price
 */

const Price = (function() {
    'use strict';

    const defaultCurrency = 'BDT';
    const defaultLocale = 'en-BD';

    function format(amount, options = {}) {
        const {
            currency = defaultCurrency,
            locale = defaultLocale,
            showSymbol = true,
            decimals = 0
        } = options;

        if (amount === null || amount === undefined) return '';

        const num = parseFloat(amount);
        if (isNaN(num)) return '';

        if (showSymbol) {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(num);
        }

        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    function render(product, options = {}) {
        const {
            size = 'md',
            showOriginal = true,
            showDiscount = true,
            layout = 'inline'
        } = options;

        const price = parseFloat(product.price);
        const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
        const isOnSale = salePrice && salePrice < price;
        const discount = isOnSale ? Math.round((1 - salePrice / price) * 100) : 0;

        const sizeClasses = {
            sm: { price: 'text-sm', original: 'text-xs' },
            md: { price: 'text-lg', original: 'text-sm' },
            lg: { price: 'text-2xl', original: 'text-base' },
            xl: { price: 'text-3xl', original: 'text-lg' }
        };

        const sizes = sizeClasses[size] || sizeClasses.md;
        const containerClass = layout === 'stacked' ? 'flex flex-col' : 'flex items-center gap-2';

        if (isOnSale) {
            return `
                <div class="${containerClass}">
                    <span class="${sizes.price} font-bold text-red-600">${format(salePrice)}</span>
                    ${showOriginal ? `
                        <span class="${sizes.original} text-gray-400 line-through">${format(price)}</span>
                    ` : ''}
                    ${showDiscount ? `
                        <span class="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">-${discount}%</span>
                    ` : ''}
                </div>
            `;
        }

        return `
            <div class="${containerClass}">
                <span class="${sizes.price} font-bold text-gray-900">${format(price)}</span>
            </div>
        `;
    }

    function renderRange(minPrice, maxPrice, options = {}) {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (isNaN(min) || isNaN(max)) return '';

        if (min === max) {
            return format(min, options);
        }

        return `${format(min, options)} - ${format(max, options)}`;
    }

    function calculateDiscount(originalPrice, salePrice) {
        const original = parseFloat(originalPrice);
        const sale = parseFloat(salePrice);

        if (isNaN(original) || isNaN(sale) || original <= 0) return 0;

        return Math.round((1 - sale / original) * 100);
    }

    function calculateSavings(originalPrice, salePrice) {
        const original = parseFloat(originalPrice);
        const sale = parseFloat(salePrice);

        if (isNaN(original) || isNaN(sale)) return 0;

        return original - sale;
    }

    return {
        format,
        render,
        renderRange,
        calculateDiscount,
        calculateSavings
    };
})();

window.Price = Price;

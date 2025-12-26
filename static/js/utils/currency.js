// Currency utility helpers
// Provides formatCurrency(value, currency = null, locale = navigator.language)
// and convertCurrency(amount, from, to) which calls the server API.

export async function convertCurrency(amount, from, to) {
    // Call API /api/v1/currencies/convert/
    try {
        const resp = await fetch('/api/v1/currencies/convert/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: String(amount), from_currency: String(from), to_currency: String(to), round_result: true })
        });
        if (!resp.ok) throw new Error('Conversion failed');
        const data = await resp.json();
        if (data && data.success) return data.data;
    } catch (e) {
        console.warn('Currency conversion error', e);
    }
    return null;
}

export function formatCurrency(value, currency = null, locale = navigator.language) {
    // Accept currency as code string or object with symbol/decimal settings
    if (!currency && typeof window !== 'undefined' && window.BUNORAA_CURRENCY) {
        currency = window.BUNORAA_CURRENCY;
    }

    if (!currency) {
        return String(value);
    }

    // Normalize value
    let num = Number(value);
    if (Number.isNaN(num)) return String(value);

    // If currency is a string code, we can try to use Intl.NumberFormat
    if (typeof currency === 'string') {
        try {
            return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
        } catch (e) {
            return String(num.toFixed(2));
        }
    }

    // If argument is an object with formatting details
    const symbol = currency.symbol || '';
    const decimals = typeof currency.decimal_places === 'number' ? currency.decimal_places : 2;
    const thousand = currency.thousand_separator || ',';
    const dec_sep = currency.decimal_separator || '.';
    const symbol_pos = currency.symbol_position || 'before';

    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    let intPart = parts[0];
    const decPart = parts[1] || '';

    // Add thousand separator
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);

    const formattedNumber = decimals > 0 ? intPart + dec_sep + decPart : intPart;

    return symbol_pos === 'before' ? (symbol + formattedNumber) : (formattedNumber + ' ' + symbol);
}

export default { convertCurrency, formatCurrency };

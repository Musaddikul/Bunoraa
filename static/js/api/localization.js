/**
 * Localization API Module
 * @module api/localization
 */

const LocalizationApi = (function() {
    'use strict';

    const CURRENCY_KEY = 'selected_currency';
    const CURRENCY_RATE_KEY = 'currency_rate';
    const LANGUAGE_KEY = 'selected_language';
    const TIMEZONE_KEY = 'selected_timezone';
    const BASE_CURRENCY = 'BDT';

    async function getCurrencies() {
        return ApiClient.get('/currencies/', {}, { useCache: true, cacheTTL: 3600000 });
    }

    async function getLanguages() {
        return ApiClient.get('/localization/languages/', {}, { useCache: true, cacheTTL: 3600000 });
    }

    async function getTimezones() {
        return ApiClient.get('/localization/timezones/', {}, { useCache: true, cacheTTL: 3600000 });
    }

    async function getCountries() {
        return ApiClient.get('/localization/countries/', {}, { useCache: true, cacheTTL: 3600000 });
    }

    async function getDivisions(countryCode) {
        return ApiClient.get(`/localization/countries/${countryCode}/divisions/`, {}, { useCache: true, cacheTTL: 3600000 });
    }

    async function convertCurrency(amount, from, to) {
        return ApiClient.get('/currencies/convert/', { amount, from, to });
    }
    
    async function getExchangeRate(from, to) {
        try {
            // Use GET endpoint for simpler exchange rate lookup
            const response = await ApiClient.get('/currencies/exchange-rates/rate/', {
                from: from,
                to: to
            });
            if (response && response.data && response.data.rate) {
                return parseFloat(response.data.rate);
            }
            // Try alternate response structure
            if (response && response.rate) {
                return parseFloat(response.rate);
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        }
        return 1;
    }

    async function setCurrency(code) {
        localStorage.setItem(CURRENCY_KEY, code);
        
        // Fetch and store exchange rate
        if (code !== BASE_CURRENCY) {
            try {
                const rate = await getExchangeRate(BASE_CURRENCY, code);
                localStorage.setItem(CURRENCY_RATE_KEY, rate.toString());
            } catch (error) {
                console.error('Error setting exchange rate:', error);
                localStorage.setItem(CURRENCY_RATE_KEY, '1');
            }
        } else {
            localStorage.setItem(CURRENCY_RATE_KEY, '1');
        }
        
        window.dispatchEvent(new CustomEvent('currency:changed', { detail: code }));
    }

    function getCurrency() {
        return localStorage.getItem(CURRENCY_KEY) || 'BDT';
    }
    
    function getStoredExchangeRate() {
        const rate = localStorage.getItem(CURRENCY_RATE_KEY);
        return rate ? parseFloat(rate) : 1;
    }

    function setLanguage(code) {
        localStorage.setItem(LANGUAGE_KEY, code);
        window.dispatchEvent(new CustomEvent('language:changed', { detail: code }));
    }

    function getLanguage() {
        return localStorage.getItem(LANGUAGE_KEY) || 'en';
    }

    function setTimezone(tz) {
        localStorage.setItem(TIMEZONE_KEY, tz);
        window.dispatchEvent(new CustomEvent('timezone:changed', { detail: tz }));
    }

    function getTimezone() {
        return localStorage.getItem(TIMEZONE_KEY) || Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    return {
        getCurrencies,
        getLanguages,
        getTimezones,
        getCountries,
        getDivisions,
        convertCurrency,
        getExchangeRate,
        setCurrency,
        getCurrency,
        getStoredExchangeRate,
        setLanguage,
        getLanguage,
        setTimezone,
        getTimezone
    };
})();

window.LocalizationApi = LocalizationApi;

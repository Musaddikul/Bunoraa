/**
 * Localization API Module
 * @module api/localization
 */

const LocalizationApi = (function() {
    'use strict';

    const CURRENCY_KEY = 'selected_currency';
    const LANGUAGE_KEY = 'selected_language';
    const TIMEZONE_KEY = 'selected_timezone';

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

    function setCurrency(code) {
        localStorage.setItem(CURRENCY_KEY, code);
        window.dispatchEvent(new CustomEvent('currency:changed', { detail: code }));
    }

    function getCurrency() {
        return localStorage.getItem(CURRENCY_KEY) || 'BDT';
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
        setCurrency,
        getCurrency,
        setLanguage,
        getLanguage,
        setTimezone,
        getTimezone
    };
})();

window.LocalizationApi = LocalizationApi;

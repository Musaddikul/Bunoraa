// frontend/static/js/api/index.js
/**
 * API Module Index
 * Exports all API modules for easy import
 */

export { api, ApiError } from './client.js';
export { authApi } from './auth.js';
export { productsApi } from './products.js';
export { cartApi } from './cart.js';
export { ordersApi } from './orders.js';

// Default export with all APIs
import api from './client.js';
import authApi from './auth.js';
import productsApi from './products.js';
import cartApi from './cart.js';
import ordersApi from './orders.js';

export default {
    client: api,
    auth: authApi,
    products: productsApi,
    cart: cartApi,
    orders: ordersApi
};

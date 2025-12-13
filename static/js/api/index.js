/**
 * API Module Index
 * Central export for all API modules.
 */

import api from './client.js';
import auth from './auth.js';
import cart from './cart.js';
import products from './products.js';
import orders from './orders.js';
import wishlist from './wishlist.js';
import vendors from './vendors.js';

// Export all modules
export {
    api,
    auth,
    cart,
    products,
    orders,
    wishlist,
    vendors
};

// Export default as combined object
export default {
    api,
    auth,
    cart,
    products,
    orders,
    wishlist,
    vendors
};

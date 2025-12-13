// frontend/static/js/store/index.js
/**
 * Store Module Index
 * Re-exports all stores
 */

export { authStore } from './auth.js';
export { cartStore } from './cart.js';

import authStore from './auth.js';
import cartStore from './cart.js';

export default {
    auth: authStore,
    cart: cartStore
};

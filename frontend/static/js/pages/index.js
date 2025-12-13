// frontend/static/js/pages/index.js
/**
 * Pages Module Index
 * Re-exports all page modules
 */

export { HomePage, initHomePage } from './home.js';
export { ProductDetail, initProductDetail } from './product-detail.js';
export { CartPage, initCartPage } from './cart.js';
export { CheckoutPage, initCheckoutPage } from './checkout.js';
export { AccountDashboard, ProfilePage, OrdersPage, AddressesPage, ChangePasswordPage, initAccountPages } from './account.js';

import home from './home.js';
import productDetail from './product-detail.js';
import cart from './cart.js';
import checkout from './checkout.js';
import account from './account.js';

export default {
    home,
    productDetail,
    cart,
    checkout,
    account
};

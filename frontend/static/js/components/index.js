// frontend/static/js/components/index.js
/**
 * Components Module Index
 * Re-exports all UI components
 */

export { Modal, showModal, alert, confirm, prompt, initModals } from './modal.js';
export { Toast, show as showToast, success, error, warning, info, clearAll as clearToasts } from './toast.js';
export { Dropdown, initDropdowns } from './dropdown.js';
export { Tabs, initTabs } from './tabs.js';
export { Accordion, initAccordions } from './accordion.js';
export { Gallery, openGallery, initGalleries } from './image-gallery.js';
export { CartDrawer, getCartDrawer, initCartDrawer } from './cart-drawer.js';
export { QuantityInput, initQuantityInputs } from './quantity-input.js';
export { Spinner, showSpinner, setButtonLoading, skeleton, skeletonGrid, ProgressBar, showPageLoading, hidePageLoading } from './loading.js';
export { Search, initSearch } from './search.js';

import modal from './modal.js';
import toast from './toast.js';
import dropdown from './dropdown.js';
import tabs from './tabs.js';
import accordion from './accordion.js';
import gallery from './image-gallery.js';
import cartDrawer from './cart-drawer.js';
import quantityInput from './quantity-input.js';
import loading from './loading.js';
import search from './search.js';

/**
 * Initialize all components
 */
export function initComponents() {
    modal.initModals();
    dropdown.initDropdowns();
    tabs.initTabs();
    accordion.initAccordions();
    gallery.initGalleries();
    cartDrawer.initCartDrawer();
    quantityInput.initQuantityInputs();
    search.initSearch();
}

export default {
    modal,
    toast,
    dropdown,
    tabs,
    accordion,
    gallery,
    cartDrawer,
    quantityInput,
    loading,
    search,
    initComponents
};

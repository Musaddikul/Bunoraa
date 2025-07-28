/**
 * cart_js_interactions.js
 *
 * This file handles all client-side JavaScript interactions for the shopping cart,
 * including fetching cart data from the Django REST Framework API,
 * dynamically rendering cart items, order summary, saved items, and shipping options,
 * and managing user interactions like quantity updates, item removal,
 * saving for later, applying/removing coupons, and updating shipping methods.
 *
 * It replaces the previous HTMX-driven approach for these sections.
 */

// Ensure this script only runs once
if (window.cartInteractionsInitialized) {
    
} else {
    window.cartInteractionsInitialized = true;

    // API Endpoints (ensure these match your Django urls.py)
    window.API_ENDPOINTS = {
        CART_DETAIL: '/cart/api/',
        CART_ITEM_ADD: '/cart/api/items/', // POST
        CART_ITEM_DETAIL: (productId) => `/cart/api/items/${productId}/`, // PUT, DELETE
        CART_ITEM_TOGGLE_SAVED: (productId) => `/cart/api/items/${productId}/toggle-saved/`, // POST
        CART_COUPON_APPLY: '/cart/api/coupons/apply/', // POST
        CART_COUPON_REMOVE: '/cart/api/coupons/apply/', // DELETE
        CART_SHIPPING: '/cart/api/shipping/', // POST
        CART_CHECKOUT: '/cart/api/checkout/', // POST
        CART_CLEAR: '/cart/api/empty/', // POST
        PAYMENT_METHODS: '/payments/api/methods/',
        SHIPPING_METHODS: '/shipping/api/methods/',
        RELATED_PRODUCTS: '/api/products/related-products/',
    };

    // DOM Elements
    const cartSectionWrapper = document.getElementById('cart-section-wrapper');
    const relatedProductsSection = document.getElementById('related-products-section'); // Keep if related products are still HTMX or JS loaded
    const quickCartSidebarContentWrapper = document.getElementById('cart-sidebar-content-wrapper');

    // Global state to store fetched data
    let cachedPaymentMethods = [];
    let cachedShippingMethods = [];
    let currentCartData = null;

    /**
     * Utility function to fetch cart data, payment methods, and shipping methods concurrently.
     * @returns {Promise<{cart: object, paymentMethods: Array, shippingMethods: Array}>}
     */
    async function fetchCartData() {
        try {
            const [cartResponse, paymentMethodsResponse, shippingMethodsResponse] = await Promise.all([
                fetch(window.API_ENDPOINTS.CART_DETAIL, { cache: 'no-store' }),
                fetch(window.API_ENDPOINTS.PAYMENT_METHODS),
                fetch(window.API_ENDPOINTS.SHIPPING_METHODS)
            ]);

            if (!cartResponse.ok) {
                const errorData = await cartResponse.json();
                throw new Error(errorData.error || `HTTP error! status: ${cartResponse.status}`);
            }
            const cartData = await cartResponse.json();

            // Validate cartData to ensure it has expected properties
            if (!cartData || typeof cartData.total_price === 'undefined') {
                console.error('Received invalid cart data from API:', cartData);
                throw new Error('Invalid cart data received from server. Please try again.');
            }

            currentCartData = cartData;

            if (paymentMethodsResponse.ok) {
                cachedPaymentMethods = await paymentMethodsResponse.json();
            } else {
                const errorData = await paymentMethodsResponse.json();
                console.warn('Failed to fetch payment methods:', errorData.error || `HTTP error! status: ${paymentMethodsResponse.status}`);
                cachedPaymentMethods = [];
            }

            if (shippingMethodsResponse.ok) {
                cachedShippingMethods = await shippingMethodsResponse.json();
            } else {
                const errorData = await shippingMethodsResponse.json();
                console.warn('Failed to fetch shipping methods:', errorData.error || `HTTP error! status: ${shippingMethodsResponse.status}`);
                cachedShippingMethods = [];
            }

            return { cart: cartData, paymentMethods: cachedPaymentMethods, shippingMethods: cachedShippingMethods };

        } catch (error) {
            console.error("Error fetching cart data:", error);
            throw error; // Re-throw to be caught by calling functions
        }
    }

    /**
     * Fetches cart data and renders the main cart page.
     * Displays a loading state while fetching.
     */
    async function fetchAndRenderMainCartPage(initialCart = null) {
        if (!cartSectionWrapper) {
            console.error("Cart section wrapper not found. Cannot initialize cart interactions.");
            return;
        }

        // Show loading state
        cartSectionWrapper.innerHTML = `
            <div class="lg:col-span-3 text-center py-10">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">Loading your cart...</p>
            </div>
        `;

        try {
            let cartToRender;
            let paymentMethodsToRender;
            let shippingMethodsToRender;

            if (initialCart) {
                cartToRender = initialCart;
                // If initialCart is provided, assume payment and shipping methods are already cached or not needed for this specific render path
                // For full consistency, you might want to re-fetch them or ensure they are part of initialCart if always needed.
                // For now, we'll use the cached ones if initialCart is provided.
                paymentMethodsToRender = cachedPaymentMethods;
                shippingMethodsToRender = cachedShippingMethods;
            } else {
                const { cart, paymentMethods, shippingMethods } = await fetchCartData();
                cartToRender = cart;
                paymentMethodsToRender = paymentMethods;
                shippingMethodsToRender = shippingMethods;
            }

            renderCartSection(cartToRender, paymentMethodsToRender, shippingMethodsToRender);
            // Dispatch event for cart count update in navbar/sidebar
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: cartToRender.total_items }));
            fetchAndRenderRelatedProducts(); // Call to fetch and render related products
        } catch (error) {
            console.error("Error fetching or rendering main cart page:", error);
            cartSectionWrapper.innerHTML = `
                <div class="lg:col-span-3 text-center py-10 text-red-600">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>Failed to load your cart. Please try again later.</p>
                    <p class="text-sm text-red-400">${error.message}</p>
                </div>
            `;
            showToast(`Failed to load cart: ${error.message}`, 'error');
        }
    }

    /**
     * Fetches cart data and renders the quick cart sidebar.
     * Displays a loading state while fetching.
     */
    async function fetchAndRenderSidebarCart(initialCart = null) {
        if (!quickCartSidebarContentWrapper) {
            console.error("Quick cart sidebar content wrapper not found. Cannot render sidebar.");
            return;
        }

        // Show loading state in sidebar
        quickCartSidebarContentWrapper.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <p>Loading cart content...</p>
            </div>
        `;

        try {
            let cartToRender;
            if (initialCart) {
                cartToRender = initialCart;
            } else {
                const { cart } = await fetchCartData(); // Sidebar only needs cart data for now
                cartToRender = cart;
            }
            renderCartSidebar(cartToRender);
        } catch (error) {
            console.error("Error fetching or rendering sidebar cart:", error);
            quickCartSidebarContentWrapper.innerHTML = `
                <div class="p-4 text-center text-red-600">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Failed to load cart.</p>
                </div>
            `;
            showToast(`Failed to load sidebar cart: ${error.message}`, 'error');
        }
    }


    /**
     * Renders the entire cart section on the main cart page based on the provided cart data.
     * This function will replace the content of the #cart-section-wrapper.
     * @param {object} cart - The cart data object from the API.
     * @param {Array} paymentMethods - Array of available payment methods.
     * @param {Array} shippingMethods - Array of available shipping methods.
     */
    function renderCartSection(cart, paymentMethods, shippingMethods) {
        if (!cartSectionWrapper) return;

        const activeItems = cart.active_items || [];
        const savedItems = cart.saved_items || [];
        const isEmpty = activeItems.length === 0 && savedItems.length === 0;

        let htmlContent = '';

        if (isEmpty) {
            htmlContent = `
                <div class="lg:col-span-3">
                    <div class="p-8 text-center">
                        <img src="/static/images/empty_cart.svg" class="mx-auto h-32 mb-4" alt="Empty Cart">
                        <h2 class="text-xl font-bold mb-2">Your cart is empty</h2>
                        <p class="text-gray-500 mb-4">Browse products and add to cart!</p>
                        <a href="/products/" class="btn btn-outline-primary">Continue Shopping</a>
                    </div>
                </div>
            `;
        } else {
            const groupedItemsBySeller = groupCartItemsBySeller(activeItems);
            let cartItemsHtml = '';
            if (groupedItemsBySeller.length > 0) {
                cartItemsHtml = groupedItemsBySeller.map(group => renderSellerGroup(group)).join('');
            } else {
                cartItemsHtml = `
                    <div class="border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6">
                        <h2 class="text-lg font-semibold">Active Items</h2>
                        <p class="text-gray-500">No active items in cart.</p>
                    </div>
                `;
            }

            const savedItemsHtml = renderSavedItems(savedItems, false); // Render for main page
            const orderSummaryHtml = renderOrderSummary(cart, paymentMethods, shippingMethods);

            htmlContent = `
                <div class="lg:col-span-2 space-y-6">
                    ${cartItemsHtml}
                    ${savedItems.length > 0 ? savedItemsHtml : ''}
                </div>
                <div class="lg:col-span-1">
                    ${orderSummaryHtml}
                </div>
            `;
        }

        cartSectionWrapper.innerHTML = htmlContent;
        attachCartEventListeners(); // Re-attach listeners after rendering
    }

    /**
     * Renders the content of the quick cart sidebar.
     * @param {object} cart - The cart data object from the API.
     */
    /**
     * Fetches and renders related products into the relatedProductsSection.
     */
    async function fetchAndRenderRelatedProducts() {
        if (!relatedProductsSection) {
            console.warn("Related products section wrapper not found. Cannot render related products.");
            return;
        }

        // Show loading state
        relatedProductsSection.innerHTML = `
            <div class="text-center py-10">
                <i class="fas fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
                <p class="text-gray-600 dark:text-gray-400">Loading recommendations...</p>
            </div>
        `;

        try {
            const response = await fetch(window.API_ENDPOINTS.RELATED_PRODUCTS);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            renderRelatedProducts(products);
        } catch (error) {
            console.error("Error fetching related products:", error);
            relatedProductsSection.innerHTML = `
                <div class="text-center py-10 text-red-600">
                    <i class="fas fa-exclamation-triangle text-3xl mb-4"></i>
                    <p>Failed to load recommendations. Please try again later.</p>
                    <p class="text-sm text-red-400">${error.message}</p>
                </div>
            `;
            showToast(`Failed to load recommendations: ${error.message}`, 'error');
        }
    }

    /**
     * Renders the related products into the relatedProductsSection.
     * @param {Array} products - Array of product objects.
     */
    function renderRelatedProducts(products) {
        if (!relatedProductsSection) return;

        let productsHtml = '';
        if (products.length > 0) {
            productsHtml = products.map(product => `
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                     onclick="window.showQuickView(${product.id})">
                    <a href="${product.get_absolute_url}">
                        <img src="${product.image}" class="w-full h-32 object-cover rounded-md mb-2">
                        <div class="font-semibold text-sm text-gray-900 dark:text-white truncate">${product.name}</div>
                        <div class="text-xs text-gray-600 dark:text-gray-400">
                            ${product.is_discounted ? `
                                <span class="line-through mr-1">৳${parseFloat(product.price).toFixed(2)}</span>
                                <span class="text-green-700 dark:text-green-400">৳${parseFloat(product.discounted_price).toFixed(2)}</span>
                            ` : `
                                ৳${parseFloat(product.price).toFixed(2)}
                            `}
                        </div>
                    </a>
                </div>
            `).join('');
        } else {
            productsHtml = `
                <p class="text-center text-gray-500 col-span-full py-5">No recommendations found at the moment.</p>
            `;
        }

        relatedProductsSection.innerHTML = `
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${productsHtml}
            </div>
        `;
    }

    function renderCartSidebar(cart) {
        if (!quickCartSidebarContentWrapper) return;

        const activeItems = cart.active_items || [];
        const savedItems = cart.saved_items || [];
        const isEmpty = activeItems.length === 0;

        let sidebarHtml = `
            <div class="flex flex-col h-full bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h3 class="font-extrabold text-xl text-gray-900 dark:text-white flex items-center">
                        <i class="fas fa-shopping-cart text-blue-600 mr-3"></i> Your Cart
                        <span class="text-sm text-gray-500 ml-2 cart-count-span">(${cart.total_items || 0})</span>
                    </h3>
                </div>

                <!-- Cart Items List -->
                <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        `;

        if (isEmpty) {
            sidebarHtml += `
                    <div class="flex flex-col items-center justify-center h-full py-10 text-gray-500">
                        <i class="fas fa-shopping-basket text-6xl text-gray-300 mb-6"></i>
                        <p class="text-lg font-medium mb-3">Your cart is empty.</p>
                        <p class="text-sm text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
                        <a href="/products/" class="btn btn-primary btn-lg animate-bounce-once">
                            <i class="fas fa-shop mr-2"></i> Start Shopping
                        </a>
                    </div>
                `;
        } else {
            sidebarHtml += `<ul class="space-y-4">`;
            activeItems.forEach(item => {
                sidebarHtml += `
                    <li class="flex items-center gap-2 p-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <!-- Product Image -->
                        <img src="${item.product.image}" alt="${item.product.name}"
                            class="h-24 w-24 rounded-md object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0 shadow-inner">
                        
                        <!-- Product Info and Quantity Controls -->
                        <div class="flex-1 min-w-0">
                            <!-- Product Name and Price -->
                            <p class="font-semibold text-gray-900 dark:text-white truncate mb-1">${item.product.name}</p>
                            <p class="text-sm text-gray-500 mb-2">
                                ${item.quantity} × ৳${parseFloat(item.price).toFixed(2)}
                            </p>
                            
                            <!-- Quantity Controls and Remove Button -->
                            <div class="flex justify-between items-center mt-4 mb-2">
                                <div class="flex items-center space-x-2">
                                    <!-- Decrement Button -->
                                    <button type="button" class="w-2 h-auto flex items-center justify-center rounded-full text-background shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105 quantity-btn" data-action="decrement" data-product-id="${item.product.id}">
                                        <i class="fas fa-minus text-lg"></i>
                                    </button>
                                    
                                    <!-- Quantity Input -->
                                    <input type="number" value="${item.quantity}" min="1" max="${item.product.stock}"
                                        class="w-auto h-8 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                                        data-product-id="${item.product.id}" data-item-id="${item.id}" aria-label="Quantity">
                                    
                                    <!-- Increment Button -->
                                    <button type="button" class="w-2 h-auto flex items-center justify-center rounded-full text-background shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105 quantity-btn" data-action="increment" data-product-id="${item.product.id}">
                                        <i class="fas fa-plus text-lg"></i>
                                    </button>
                                </div>
                                
                                <!-- Remove Button (Aligned Right) -->
                                <button type="button" class="text-red-500 hover:text-red-700 text-xs font-mono transition-colors duration-300 remove-item-btn gap" data-product-id="${item.product.id}">
                                    <i class="fas fa-trash-alt mr-2"></i> Remove
                                </button>
                            </div>
                        </div>
                    </li>
                `;
            });
            sidebarHtml += `</ul>`;

            // Add saved items section to sidebar
            if (savedItems.length > 0) {
                sidebarHtml += renderSavedItems(savedItems, true); // Render for sidebar
            }
        }

        sidebarHtml += `</div>`; // Close flex-1 overflow-y-auto

        // Footer with total and buttons
        sidebarHtml += `
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-semibold text-gray-800 dark:text-gray-200">Subtotal:</span>
                        <span class="text-xl font-bold text-blue-600 dark:text-blue-400">৳${parseFloat(cart.total_price || 0).toFixed(2)}</span>
                    </div>
                    <a href="/checkout/" class="btn btn-primary w-full py-3 text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl mb-3">
                        <i class="fas fa-credit-card mr-2"></i> Proceed to Checkout
                    </a>
                    <a href="/cart/" class="btn btn-outline-secondary w-full py-3 text-lg mb-3">
                        <i class="fas fa-shopping-cart mr-2"></i> View Full Cart
                    </a>
                    <button id="empty-cart-btn" class="btn btn-danger-outline w-full py-2 text-sm">
                        <i class="fas fa-trash-alt mr-2"></i> Empty Cart
                    </button>
                </div>
            </div> <!-- Close flex-col h-full -->
        `;

        quickCartSidebarContentWrapper.innerHTML = sidebarHtml;
        attachCartEventListeners(); // Re-attach listeners for sidebar elements
    }

    /**
     * Helper to group cart items by seller.
     * @param {Array} activeItems - Array of active cart items.
     * @returns {Array} Grouped items.
     */
    function groupCartItemsBySeller(activeItems) {
        const sellerMap = new Map();

        activeItems.forEach(item => {
            const seller = item.product.seller;
            const sellerId = seller ? seller.id : 'default_store';

            if (!sellerMap.has(sellerId)) {
                sellerMap.set(sellerId, {
                    seller: seller || {
                        id: 'default_store',
                        store_name: 'Our Store',
                        profile: { image: { url: '/static/images/default-store.png' } }
                    },
                    items: [],
                    subtotal: 0,
                    item_total: 0
                });
            }
            const group = sellerMap.get(sellerId);
            group.items.push(item);
            group.subtotal += parseFloat(item.total_price);
            group.item_total += item.quantity;
        });

        const groupedItems = Array.from(sellerMap.values());
        groupedItems.sort((a, b) => (a.seller.store_name || '').localeCompare(b.seller.store_name || ''));
        return groupedItems;
    }

    /**
     * Renders a seller group section for the main cart page.
     * @param {object} group - Seller group object.
     * @returns {string} HTML string.
     */
    function renderSellerGroup(group) {
        let itemsHtml = group.items.map(item => renderCartItem(item)).join('');
        return `
            <div id="seller-group-${group.seller.id}" class="border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <img src="${group.seller.profile.image.url || '/static/images/default-store.png'}"
                             alt="${group.seller.store_name || 'Seller'}"
                             class="w-10 h-10 rounded-full object-cover border">
                        <h2 class="text-lg font-semibold">
                            ${group.seller.store_name || 'Our Store'}
                        </h2>
                    </div>
                    <a href="#" class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                        <i class="fas fa-store mr-1"></i> Visit Store
                    </a>
                </div>
                ${itemsHtml}
                <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span class="font-medium">Subtotal (${group.item_total} items):</span>
                    <span class="font-bold">৳${group.subtotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    /**
     * Renders a single cart item for the main cart page.
     * @param {object} item - Cart item data.
     * @returns {string} HTML string.
     */
    function renderCartItem(item) {
        const productPrice = parseFloat(item.product.price).toFixed(2);
        const discountedPrice = item.product.is_discounted ? parseFloat(item.product.discounted_price).toFixed(2) : null;
        const maxStock = item.product.stock;

        return `
            <div class="flex flex-col sm:flex-row gap-4 border-t border-gray-200 dark:border-gray-700 pt-6" data-item-id="${item.id}" data-product-id="${item.product.id}">
                <!-- Product Image -->
                <img src="${item.product.image}" alt="${item.product.name}"
                     class="w-56 h-48 object-cover rounded-md border hover:shadow-md transition-transform cursor-pointer lg:col-span-1"
                     onclick="window.showQuickView(${item.product.id})">

                <!-- Product Info and Actions Container -->
                <div class="lg:col-span-2 flex flex-col justify-between h-full space-y-15">
                    <!-- Product Info -->
                    <div class="flex-1 space-y-2 min-w-0">
                        <h3 class="font-medium text-lg hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                            onclick="window.showQuickView(${item.product.id})">
                            ${item.product.name}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                            ${item.product.category.name}
                            ${item.product.brand ? `• ${item.product.brand.name}` : ''}
                        </p>
                        <div class="flex items-center space-x-2">
                            ${discountedPrice ? `
                                <span class="line-through text-gray-400">৳${productPrice}</span>
                                <span class="text-green-700 dark:text-green-400 font-medium">৳${discountedPrice}</span>
                            ` : `
                                <span class="text-gray-800 dark:text-gray-200 font-medium">৳${productPrice}</span>
                            `}
                        </div>
                    </div>
                    <!-- Quantity Controls and Save & Remove Actions -->
                    <div class="flex justify-between items-center mt-2">
                        <!-- Quantity Controls -->
                        <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                            <button type="button" class="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 quantity-btn" data-action="decrement" data-product-id="${item.product.id}">
                                <i class="fas fa-minus text-xs"></i>
                            </button>
                            <input type="number" value="${item.quantity}" min="1" max="${maxStock}"
                                   class="w-20 text-center border-y-0 border-x border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-0 focus:border-transparent cart-item-quantity-input"
                                   data-product-id="${item.product.id}" data-item-id="${item.id}" aria-label="Quantity">
                            <button type="button" class="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 quantity-btn" data-action="increment" data-product-id="${item.product.id}">
                                <i class="fas fa-plus text-xs"></i>
                            </button>
                        </div>
                        <!-- Save & Remove Actions -->
                        <div class="flex space-x-4">
                            <button type="button" class="text-sm text-blue-600 dark:text-blue-400 hover:underline toggle-saved-btn" data-product-id="${item.product.id}">
                                <i class="far fa-bookmark mr-1"></i> ${item.saved_for_later ? 'Move to Cart' : 'Save for Later'}
                            </button>
                            <button type="button" class="text-sm text-red-600 dark:text-red-400 hover:underline remove-item-btn" data-product-id="${item.product.id}">
                                <i class="fas fa-trash-alt mr-1"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renders the saved items section.
     * @param {Array} savedItems - Array of saved cart items.
     * @param {boolean} isSidebar - True if rendering for the sidebar, false for the main cart page.
     * @returns {string} HTML string.
     */
    function renderSavedItems(savedItems, isSidebar = false) {
        if (savedItems.length === 0) {
            return isSidebar ? '' : `
                <div class="border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6 mt-10">
                    <h2 class="text-lg font-semibold flex items-center">
                        <i class="far fa-bookmark text-blue-500 mr-2"></i> Saved for Later (0)
                    </h2>
                    <p class="text-gray-500 text-center py-4">No items saved for later.</p>
                </div>
            `;
        }

        let itemsHtml = savedItems.map(item => `
            <div class="${isSidebar ? 'flex items-center gap-2' : 'border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow'}">
                <img src="${item.product.image}" alt="${item.product.name}"
                     class="${isSidebar ? 'w-12 h-12' : 'w-24 h-24'} object-cover object-center rounded-md flex-shrink-0">

                <div class="flex-1 min-w-0 ${isSidebar ? '' : 'ml-3'}">
                    <h3 class="${isSidebar ? 'text-sm' : 'text-base'} font-medium text-gray-900 dark:text-white truncate">${item.product.name}</h3>
                    <div class="mt-1 ${isSidebar ? 'text-xs' : ''}">
                        ${item.product.is_discounted ? `
                            <span class="line-through text-gray-400">৳${parseFloat(item.product.price).toFixed(2)}</span>
                            <span class="text-green-700 dark:text-green-400 font-medium">৳${parseFloat(item.product.discounted_price).toFixed(2)}</span>
                        ` : `
                            <span class="text-gray-800 dark:text-gray-200 font-medium">৳${parseFloat(item.product.price).toFixed(2)}</span>
                        `}
                    </div>
                    <div class="${isSidebar ? 'mt-1 flex flex-col' : 'mt-2 flex space-x-2'}">
                        <button type="button" class="${isSidebar ? 'text-xs text-blue-600 hover:underline' : 'text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700'} toggle-saved-btn" data-product-id="${item.product.id}">
                            Move to Cart
                        </button>
                        <button type="button" class="${isSidebar ? 'text-xs text-red-600 hover:underline' : 'text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600'} remove-item-btn" data-product-id="${item.product.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="${isSidebar ? 'mt-4 border-t border-gray-200 dark:border-gray-700 pt-4' : 'border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6 mt-10'}">
                <h2 class="${isSidebar ? 'text-md' : 'text-lg'} font-semibold flex items-center mb-3">
                    <i class="far fa-bookmark text-blue-500 mr-2"></i> Saved for Later (${savedItems.length})
                </h2>
                <div class="${isSidebar ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'}">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }


    /**
     * Renders the order summary section.
     * @param {object} cart - The cart data object.
     * @param {Array} paymentMethods - Array of available payment methods.
     * @param {Array} shippingMethods - Array of available shipping methods.
     * @returns {string} HTML string.
     */
    function renderOrderSummary(cart, paymentMethods, shippingMethods) {
        const couponApplied = cart.coupon !== null;

        let shippingOptionsHtml = '';
    if (shippingMethods && shippingMethods.results.length > 0) {
            shippingOptionsHtml = `
                <div class="border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6">
                    <h2 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fas fa-truck text-blue-500 mr-2"></i> Shipping Options
                    </h2>
                    <form id="shipping-form" data-api-url="/cart/api/shipping/" method="POST">
                        <div class="space-y-3">
                            ${shippingMethods.results.map(method => {
                                return `
                                <div class="flex items-start">
                                    <input type="radio"
                                           id="shipping-method-${method.id}"
                                           name="shipping_method_id"
                                           value="${method.id}"
                                           class="mt-1 shipping-method-radio"
                                           ${cart.shipping_method?.id === method.id ? 'checked' : ''}>
                                    <label for="shipping-method-${method.id}" class="ml-2 block cursor-pointer">
                                        <span class="font-medium">${method.name}</span>
                                        <span class="block text-sm text-gray-600 dark:text-gray-400">
                                            ৳${parseFloat(method.base_charge).toFixed(2)} • ${method.estimated_delivery_days}
                                        </span>
                                    </label>
                                </div>
                            `;
                            }).join('')}
                        </div>
                    </form>
                </div>
            `;
        } else {
            shippingOptionsHtml = `
                <div class="border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6">
                    <h2 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fas fa-truck text-blue-500 mr-2"></i> Shipping Options
                    </h2>
                    <p class="text-gray-500 text-center py-4">No shipping methods available.</p>
                </div>
            `;
        }


        // Render payment methods
        let paymentMethodsHtml = '';
        if (paymentMethods && paymentMethods.results.length > 0) {
            paymentMethodsHtml = paymentMethods.results.map(method => `
                <div class="bg-gray-100 dark:bg-gray-800 rounded p-2 flex items-center justify-center">
                    <img src="${method.icon || '/static/images/payments/default.png'}" alt="${method.name}" class="h-6">
                </div>
            `).join('');
        } else {
            paymentMethodsHtml = `
                <div class="col-span-4 text-center text-gray-500">No payment methods available.</div>
            `;
        }


        return `
            <div id="order-summary-content" class="space-y-6">
                <div class="border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6 sticky top-6">
                    <h2 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fas fa-receipt mr-2 text-blue-500"></i> Order Summary
                    </h2>

                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Subtotal (${cart.total_items || 0} items)</span>
                            <span class="cart-subtotal-display">৳${parseFloat(cart.total_price || 0).toFixed(2)}</span>
                        </div>

                        ${(cart.get_tax_amount || 0) > 0 ? `
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">VAT (${(parseFloat(cart.tax_rate || 0) * 100).toFixed(0)}%):</span>
                                <span class="cart-tax-amount-display">৳${parseFloat(cart.get_tax_amount || 0).toFixed(2)}</span>
                            </div>
                        ` : ''}

                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                            <span class="cart-shipping-cost-display">৳${parseFloat(cart.get_shipping_cost || 0).toFixed(2)}</span>
                        </div>

                        <div class="flex justify-between text-green-600 dark:text-green-400">
                            <span>Discount</span>
                            <span class="cart-discount-amount-display">-৳${parseFloat(cart.get_discount_amount || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    <hr class="my-4 border-gray-200 dark:border-gray-700">

                    <div class="flex justify-between items-center font-bold text-lg text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span class="cart-final-total-display">৳${parseFloat(cart.final_total || 0).toFixed(2)}</span>
                    </div>

                    <a href="/checkout/" class="btn btn-primary w-full mt-6 py-3 text-lg bg-pink-500 hover:bg-pink-600 transition-colors duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Proceed to Checkout
                    </a>

                    <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-center">
                        <i class="fas fa-lock text-green-500 mr-1"></i> Secure Checkout
                    </p>

                    <div class="mt-6">
                        <h6 class="text-md font-semibold mb-2 flex items-center">
                            <i class="fas fa-tag text-blue-500 mr-2"></i> Have a coupon?
                        </h6>
                        ${couponApplied ? `
                            <div class="flex justify-between items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-md text-sm">
                                <span>Applied: <strong>${cart.coupon.code}</strong></span>
                                <button type="button" class="text-red-600 dark:text-red-400 hover:underline remove-coupon-btn">Remove</button>
                            </div>
                        ` : `
                            <form id="coupon-form" method="POST">
                                <div class="flex">
                                    <input type="text" name="code" value="" placeholder="Coupon code"
                                           class="flex-1 border rounded-l-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                                    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors text-sm">
                                        Apply
                                    </button>
                                </div>
                                <p class="text-red-500 text-xs mt-1 coupon-error-message"></p>
                            </form>
                        `}
                    </div>
                </div>
                ${shippingOptionsHtml}
                <div class="border rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-6">
                    <h2 class="text-lg font-semibold mb-4 flex items-center">
                        <i class="fas fa-shield-alt text-blue-500 mr-2"></i> Secure Payment
                    </h2>

                    <div class="grid grid-cols-4 gap-2" id="payment-methods-container">
                        ${paymentMethodsHtml}
                    </div>
                </div>
            </div>
        `;
    }


    /**
     * Attaches all necessary event listeners to cart-related elements.
     * This function should be called after the cart content is rendered or re-rendered.
     */
    function attachCartEventListeners() {
        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.removeEventListener('click', handleQuantityButtonClick); // Prevent double-listening
            button.addEventListener('click', handleQuantityButtonClick);
        });

        document.querySelectorAll('.cart-item-quantity-input').forEach(input => {
            input.removeEventListener('change', handleQuantityInputChange); // Prevent double-listening
            input.addEventListener('change', handleQuantityInputChange);
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.removeEventListener('click', handleRemoveItemClick);
            button.addEventListener('click', handleRemoveItemClick);
        });

        // Toggle saved for later buttons
        document.querySelectorAll('.toggle-saved-btn').forEach(button => {
            button.removeEventListener('click', handleToggleSavedClick);
            button.addEventListener('click', handleToggleSavedClick);
        });

        // Coupon form submission
        const couponForm = document.getElementById('coupon-form');
        if (couponForm) {
            couponForm.removeEventListener('submit', handleCouponFormSubmit);
            couponForm.addEventListener('submit', handleCouponFormSubmit);
        }

        // Remove coupon button
        const removeCouponBtn = document.querySelector('.remove-coupon-btn');
        if (removeCouponBtn) {
            removeCouponBtn.removeEventListener('click', handleRemoveCouponClick);
            removeCouponBtn.addEventListener('click', handleRemoveCouponClick);
        }

        // Shipping form submission (radio buttons and express checkbox)
        const shippingForm = document.getElementById('shipping-form');
        if (shippingForm) {
            // Listen for changes on radio buttons
            shippingForm.querySelectorAll('input[name="shipping_method_id"]').forEach(radio => {
                radio.removeEventListener('change', handleShippingChange);
                radio.addEventListener('change', handleShippingChange);
            });
            // Listen for changes on express checkbox
            const expressCheckbox = shippingForm.querySelector('input[name="is_express"]');
            if (expressCheckbox) {
                expressCheckbox.removeEventListener('change', handleShippingChange);
                expressCheckbox.addEventListener('change', handleShippingChange);
            }
        }

        // Add to cart buttons (on product detail pages, if this JS is shared)
        document.querySelectorAll('.add-to-cart-form').forEach(form => {
            form.removeEventListener('submit', handleAddToCartSubmit);
            form.addEventListener('submit', handleAddToCartSubmit);
        });

        // Empty cart button
        const emptyCartBtn = document.getElementById('empty-cart-btn');
        if (emptyCartBtn) {
            emptyCartBtn.removeEventListener('click', handleEmptyCartClick);
            emptyCartBtn.addEventListener('click', handleEmptyCartClick);
        }

        // Proceed to Checkout button
        document.querySelectorAll('a[href="/checkout/"]').forEach(button => {
            button.removeEventListener('click', handleCheckoutClick);
            button.addEventListener('click', handleCheckoutClick);
        });
    }

    /**
     * Handles clicks on quantity increment/decrement buttons.
     * @param {Event} event - The click event.
     */
    async function handleQuantityButtonClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const productId = button.dataset.productId;
        const input = document.querySelector(`.cart-item-quantity-input[data-product-id="${productId}"]`);

        if (!input) {
            console.error('Quantity input not found for product:', productId);
            return;
        }

        let currentQuantity = parseInt(input.value);
        const maxStock = parseInt(input.max);
        let newQuantity = currentQuantity;

        if (button.dataset.action === 'increment') {
            newQuantity++;
            if (!isNaN(maxStock) && newQuantity > maxStock) {
                showToast(`Cannot add more than available stock (${maxStock}).`, 'warning');
                return;
            }
        } else if (button.dataset.action === 'decrement') {
            newQuantity--;
            if (newQuantity < 1) {
                showToast('Quantity cannot be less than 1. To remove, click the "Remove" button.', 'warning');
                return;
            }
        }

        if (newQuantity !== currentQuantity) {
            input.value = newQuantity; // Update input value immediately
            await updateCartItemQuantity(productId, newQuantity);
        }
    }

    /**
     * Handles changes in quantity input fields.
     * @param {Event} event - The change event.
     */
    async function handleQuantityInputChange(event) {
        const input = event.currentTarget;
        const productId = input.dataset.productId;
        let newQuantity = parseInt(input.value);
        const maxStock = parseInt(input.max);

        if (isNaN(newQuantity) || newQuantity < 1) {
            showToast('Quantity must be at least 1.', 'error');
            // Revert to previous valid quantity if invalid input
            window.fetchAndRenderMainCartPage(); // Re-fetch to get correct quantity
            return;
        }

        if (!isNaN(maxStock) && newQuantity > maxStock) {
            showToast(`Quantity adjusted to maximum available stock (${maxStock}).`, 'warning');
            newQuantity = maxStock; // Adjust input value
            input.value = newQuantity;
        }

        await updateCartItemQuantity(productId, newQuantity);
    }

    /**
     * Sends an API request to update a cart item's quantity.
     * @param {string} productId - The ID of the product.
     * @param {number} quantity - The new quantity.
     */
    async function updateCartItemQuantity(productId, quantity) {
        try {
            const response = await fetch(window.API_ENDPOINTS.CART_ITEM_DETAIL(productId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ quantity: quantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update item quantity.');
            }

            showToast(data.message, 'success');
            // Update specific item's total price
            const itemElement = document.querySelector(`[data-product-id="${productId}"]`);
            if (itemElement) {
                const itemTotalPriceElement = itemElement.querySelector('.cart-item-total-price');
                if (itemTotalPriceElement) {
                    const updatedItem = data.cart.active_items.find(item => item.product.id == productId);
                    if (updatedItem) {
                        itemTotalPriceElement.textContent = `৳${parseFloat(updatedItem.total_price).toFixed(2)}`;
                    }
                }
            }

            // Update overall cart totals
            document.querySelectorAll('.cart-subtotal-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.total_price).toFixed(2)}`);
            document.querySelectorAll('.cart-tax-amount-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.get_tax_amount).toFixed(2)}`);
            document.querySelectorAll('.cart-shipping-cost-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.get_shipping_cost).toFixed(2)}`);
            document.querySelectorAll('.cart-discount-amount-display').forEach(el => el.textContent = `-৳${parseFloat(data.cart.get_discount_amount).toFixed(2)}`);
            document.querySelectorAll('.cart-final-total-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.final_total).toFixed(2)}`);

            // Update cart count in navbar/sidebar
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: data.cart.total_items }));

            // Update sidebar if it's open
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                renderCartSidebar(data.cart);
            }

        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            showToast(error.message || 'Failed to update quantity.', 'error');
            window.fetchAndRenderMainCartPage(); // Re-fetch to revert to consistent state
        }
    }

    /**
     * Handles clicks on remove item buttons.
     * @param {Event} event - The click event.
     */
    async function handleRemoveItemClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const productId = button.dataset.productId;

        // Custom confirmation dialog instead of alert/confirm
        if (!await showConfirmationDialog('Are you sure you want to remove this item from your cart?')) {
            return;
        }

        try {
            const response = await fetch(window.API_ENDPOINTS.CART_ITEM_DETAIL(productId), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove item.');
            }

            showToast(data.message, 'info');
            // Re-render both main cart page (if active) and sidebar
            window.fetchAndRenderMainCartPage();
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                window.fetchAndRenderSidebarCart();
            }
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: data.cart.total_items }));

        } catch (error) {
            console.error('Error removing cart item:', error);
            showToast(error.message || 'Failed to remove item.', 'error');
            window.fetchAndRenderMainCartPage(); // Re-fetch to revert to consistent state
        }
    }

    /**
     * Handles clicks on toggle saved for later buttons.
     * @param {Event} event - The click event.
     */
    async function handleToggleSavedClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const productId = button.dataset.productId;

        try {
            const response = await fetch(window.API_ENDPOINTS.CART_ITEM_TOGGLE_SAVED(productId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({}), // No specific data needed for toggle
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to toggle saved status.');
            }

            showToast(data.message, 'info');
            // Re-render both main cart page (if active) and sidebar
            window.fetchAndRenderMainCartPage();
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                window.fetchAndRenderSidebarCart();
            }
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: data.cart.total_items }));

        } catch (error) {
            console.error('Error toggling saved status:', error);
            showToast(error.message || 'Failed to toggle saved status.', 'error');
            window.fetchAndRenderMainCartPage(); // Re-fetch to revert to consistent state
        }
    }

    /**
     * Handles coupon form submission.
     * @param {Event} event - The submit event.
     */
    async function handleCouponFormSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const codeInput = form.querySelector('input[name="code"]');
        const code = codeInput ? codeInput.value : '';
        const errorMessageElement = form.querySelector('.coupon-error-message');
        if (errorMessageElement) errorMessageElement.textContent = '';

        if (!code) {
            if (errorMessageElement) errorMessageElement.textContent = 'Coupon code cannot be empty.';
            return;
        }

        try {
            const response = await fetch(window.API_ENDPOINTS.CART_COUPON_APPLY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({ 
                    code: code
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (errorMessageElement) errorMessageElement.textContent = data.error || 'Failed to apply coupon.';
                throw new Error(data.error || 'Failed to apply coupon.');
            }

            currentCartData = data.cart; // Update global cart data with the full cart object from the response

            // Update overall cart totals
            document.querySelectorAll('.cart-subtotal-display').forEach(el => el.textContent = `৳${parseFloat(currentCartData.total_price).toFixed(2)}`);
            document.querySelectorAll('.cart-tax-amount-display').forEach(el => el.textContent = `৳${parseFloat(currentCartData.get_tax_amount).toFixed(2)}`);
            document.querySelectorAll('.cart-shipping-cost-display').forEach(el => el.textContent = `৳${parseFloat(currentCartData.get_shipping_cost).toFixed(2)}`);
            document.querySelectorAll('.cart-discount-amount-display').forEach(el => el.textContent = `-৳${parseFloat(currentCartData.get_discount_amount).toFixed(2)}`);
            document.querySelectorAll('.cart-final-total-display').forEach(el => el.textContent = `৳${parseFloat(currentCartData.final_total).toFixed(2)}`);

            // Update cart count in navbar/sidebar
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: currentCartData.total_items }));

            // Update sidebar if it's open
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                renderCartSidebar(currentCartData);
            }

            // Re-render only the order summary section to reflect coupon change
            const orderSummaryContainer = document.getElementById('order-summary-content');
            if (orderSummaryContainer) {
                orderSummaryContainer.innerHTML = renderOrderSummary(currentCartData, cachedPaymentMethods, cachedShippingMethods);
                attachCartEventListeners(); // Re-attach listeners for the new elements
            }
            showToast(data.message, 'success');            
        } catch (error) {
            console.error('Error applying coupon:', error);
            showToast(error.message || 'Failed to apply coupon.', 'error');
        }
    }

    /**
     * Handles remove coupon button click.
     * @param {Event} event - The click event.
     */
    async function handleRemoveCouponClick(event) {
        event.preventDefault();
        try {
            const response = await fetch(window.API_ENDPOINTS.CART_COUPON_REMOVE, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove coupon.');
            }

            currentCartData = data.cart; // Update global cart data with the full cart object from the response

            // Now that cart data is refreshed, show toast and update count using the latest currentCartData
            showToast(data.message, 'info');
            localStorage.removeItem('promoCode'); // Clear promo code from localStorage
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: currentCartData.total_items }));

            // Re-render both main cart page (if active) and sidebar with the updated cart data
            window.fetchAndRenderMainCartPage(currentCartData);
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                window.fetchAndRenderSidebarCart(currentCartData);
            }

        } catch (error) {
            console.error('Error removing coupon:', error);
            showToast(error.message || 'Failed to remove coupon.', 'error');
            window.fetchAndRenderMainCartPage(); // Re-fetch to ensure UI consistency
        }
    }

    /**
     * Handles changes in shipping method (radio buttons or express checkbox).
     * @param {Event} event - The change event.
     */
    async function handleShippingChange(event) {
        const form = document.getElementById('shipping-form');
        if (!form) return;

        const shippingMethodRadio = form.querySelector('input[name="shipping_method_id"]:checked');
        const shippingMethodId = shippingMethodRadio ? parseInt(shippingMethodRadio.value) : null;

        if (shippingMethodId === null) {
            showToast('Please select a shipping method.', 'warning');
            return;
        }

        try {
            const response = await fetch(form.dataset.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    shipping_method_id: shippingMethodId,
                    is_express: false, // Set based on your UI
                    address_id: currentCartData.address ? currentCartData.address.id : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update shipping.');
            }

            showToast(data.message, 'success');
            currentCartData = data.cart; // Update global cart data

            // Update overall cart totals
            document.querySelectorAll('.cart-subtotal-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.total_price).toFixed(2)}`);
            document.querySelectorAll('.cart-tax-amount-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.get_tax_amount).toFixed(2)}`);
            document.querySelectorAll('.cart-shipping-cost-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.get_shipping_cost).toFixed(2)}`);
            document.querySelectorAll('.cart-discount-amount-display').forEach(el => el.textContent = `-৳${parseFloat(data.cart.get_discount_amount).toFixed(2)}`);
            document.querySelectorAll('.cart-final-total-display').forEach(el => el.textContent = `৳${parseFloat(data.cart.final_total).toFixed(2)}`);

            // Update cart count in navbar/sidebar
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: data.cart.total_items }));

            // Update sidebar if it's open
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                renderCartSidebar(data.cart);
            }
            
        } catch (error) {
            console.error('Error updating shipping:', error);
            showToast(error.message || 'Failed to update shipping.', 'error');
            // Revert UI to previous state
            window.fetchAndRenderMainCartPage();
        }
    }

    /**
     * Handles add to cart form submission (e.g., from product detail page or quick view).
     * @param {Event} event - The submit event.
     */
    async function handleAddToCartSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const productId = form.dataset.productId;
        const quantityInput = form.querySelector('input[name="quantity"]');
        const overrideInput = form.querySelector('input[name="override"]');
        const savedForLaterInput = form.querySelector('input[name="saved_for_later"]');

        const quantity = parseInt(quantityInput ? quantityInput.value : '1');
        const override = overrideInput ? overrideInput.checked : false;
        const savedForLater = savedForLaterInput ? savedForLaterInput.checked : false;

        if (isNaN(quantity) || quantity < 1) {
            showToast('Quantity must be at least 1.', 'error');
            return;
        }

        try {
            const response = await fetch(window.API_ENDPOINTS.CART_ITEM_ADD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity,
                    override_quantity: override,
                    saved_for_later: savedForLater,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add product to cart.');
            }

            if (data.message) {
                showToast(data.message, 'success'); // Assume any message from a successful API call is a success message
            } else {
                showToast('Product added to cart.', 'success'); // Fallback message
            }
            // Dispatch custom event to update cart count in navbar/sidebar
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: data.cart.total_items, message: data.message }));

            // If on the main cart page, re-render it. If sidebar is open, re-render it too.
            if (cartSectionWrapper && cartSectionWrapper.innerHTML.includes('Your Shopping Cart')) { // Simple check if on cart page
                window.fetchAndRenderMainCartPage();
            }
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                window.fetchAndRenderSidebarCart();
            }

        } catch (error) {
            console.error('Error adding product to cart:', error);
            showToast(error.message || 'Failed to add product to cart.', 'error');
        }
    }

    /**
     * Handles the empty cart button click.
     * @param {Event} event - The click event.
     */
    async function handleEmptyCartClick(event) {
        event.preventDefault();

        // Custom confirmation dialog instead of alert/confirm
        if (!await showConfirmationDialog('Are you sure you want to empty your entire cart?')) {
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.CART_CLEAR, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to empty cart.');
            }

            showToast(data.message, 'info');
            // Re-render both main cart page (if active) and sidebar
            window.fetchAndRenderMainCartPage();
            const quickCartSidebar = document.getElementById('quick-cart-sidebar');
            if (quickCartSidebar && !quickCartSidebar.classList.contains('translate-x-full')) {
                window.fetchAndRenderSidebarCart();
            }
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: data.cart.total_items }));

        } catch (error) {
            console.error('Error emptying cart:', error);
            showToast(error.message || 'Failed to empty cart.', 'error');
            window.fetchAndRenderMainCartPage(); // Re-fetch to ensure UI consistency
        }
    }

    /**
     * Handles the checkout button click.
     * @param {Event} event - The click event.
     */
    function handleCheckoutClick(event) {
        event.preventDefault();
        window.location.href = event.currentTarget.href;
    }

    /**
     * Displays a custom confirmation dialog.
     * @param {string} message - The message to display in the dialog.
     * @returns {Promise<boolean>} Resolves to true if confirmed, false otherwise.
     */
    function showConfirmationDialog(message) {
        return new Promise(resolve => {
            const dialogHtml = `
                <div id="custom-confirm-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Action</h3>
                        <p class="text-gray-700 dark:text-gray-300 mb-6">${message}</p>
                        <div class="flex justify-end space-x-3">
                            <button id="confirm-cancel-btn" class="btn btn-outline-secondary">Cancel</button>
                            <button id="confirm-ok-btn" class="btn btn-danger">Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', dialogHtml);

            const modal = document.getElementById('custom-confirm-modal');
            const okBtn = document.getElementById('confirm-ok-btn');
            const cancelBtn = document.getElementById('confirm-cancel-btn');

            const cleanup = () => {
                modal.remove();
                okBtn.removeEventListener('click', handleOk);
                cancelBtn.removeEventListener('click', handleCancel);
            };

            const handleOk = () => {
                resolve(true);
                cleanup();
            };

            const handleCancel = () => {
                resolve(false);
                cleanup();
            };

            okBtn.addEventListener('click', handleOk);
            cancelBtn.addEventListener('click', handleCancel);
        });
    }


    /**
     * Initializes cart-related JavaScript interactions.
     * This function should be called on DOMContentLoaded.
     * It primarily handles the initial fetch and render of the main cart page.
     */
    async function initCartInteractions() {
        // Always fetch cart data on initialization to update global cart count
        try {
            const { cart } = await fetchCartData();
            document.dispatchEvent(new CustomEvent('cartCountUpdate', { detail: cart.total_items }));
        } catch (error) {
            console.error("Error fetching initial cart data for global count:", error);
        }

        // Only fetch and render the main cart page if the wrapper element exists.
        if (cartSectionWrapper) {
            fetchAndRenderMainCartPage();
        }

        // Event listeners are attached after each render by renderCartSection/renderCartSidebar
    }

    // Expose global functions for use by other modules (e.g., app.js, cart.js)
    window.fetchAndRenderMainCartPage = fetchAndRenderMainCartPage;
    window.fetchAndRenderSidebarCart = fetchAndRenderSidebarCart;
    window.initCartInteractions = initCartInteractions;
    window.handleAddToCartSubmit = handleAddToCartSubmit; // Already exposed, ensuring consistency
}

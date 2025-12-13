/**
 * Account Page Module
 * User account dashboard, profile, orders, addresses, and wishlist.
 */

import { authApi } from '../api/auth.js';
import { Toast } from '../components/toast.js';

class AccountPage {
    constructor() {
        this.user = null;
        this.currentSection = 'dashboard';

        this.elements = {
            sidebar: document.getElementById('account-sidebar'),
            content: document.getElementById('account-content'),
            userInfo: document.getElementById('user-info'),
        };
    }

    /**
     * Initialize account page
     */
    async init() {
        // Get current section from URL
        this.currentSection = this.getSectionFromURL() || 'dashboard';

        // Check authentication
        if (!this.isAuthenticated()) {
            window.location.href = '/accounts/login/?next=' + encodeURIComponent(window.location.pathname);
            return;
        }

        // Load user data
        await this.loadUserData();

        // Render sidebar
        this.renderSidebar();

        // Load current section
        this.loadSection(this.currentSection);

        // Bind events
        this.bindEvents();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('access_token') || document.body.dataset.authenticated === 'true';
    }

    /**
     * Get section from URL
     */
    getSectionFromURL() {
        const match = window.location.pathname.match(/\/account\/([^/]+)/);
        return match ? match[1] : 'dashboard';
    }

    /**
     * Load user data
     */
    async loadUserData() {
        try {
            this.user = await authApi.getProfile();
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    /**
     * Render sidebar
     */
    renderSidebar() {
        if (!this.elements.sidebar) return;

        const menuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
            { id: 'wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
            { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'password', label: 'Change Password', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
        ];

        this.elements.sidebar.innerHTML = `
            <!-- User Info -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 flex items-center justify-center text-2xl font-bold">
                        ${this.user?.name?.charAt(0) || this.user?.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">${this.user?.name || 'User'}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${this.user?.email || ''}</p>
                    </div>
                </div>
            </div>

            <!-- Menu Items -->
            <nav class="p-4">
                <ul class="space-y-1">
                    ${menuItems.map(item => `
                        <li>
                            <a 
                                href="/account/${item.id}/"
                                class="menu-item flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${this.currentSection === item.id 
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }"
                                data-section="${item.id}"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"/>
                                </svg>
                                ${item.label}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>

            <!-- Logout -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                    id="logout-btn"
                    class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Logout
                </button>
            </div>
        `;
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        // Menu navigation
        document.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                e.preventDefault();
                const section = menuItem.dataset.section;
                this.navigateToSection(section);
            }
        });

        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.closest('#logout-btn')) {
                this.logout();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.currentSection = this.getSectionFromURL() || 'dashboard';
            this.loadSection(this.currentSection);
            this.updateSidebarActive();
        });
    }

    /**
     * Navigate to section
     */
    navigateToSection(section) {
        this.currentSection = section;
        window.history.pushState({}, '', `/account/${section}/`);
        this.loadSection(section);
        this.updateSidebarActive();
    }

    /**
     * Update sidebar active state
     */
    updateSidebarActive() {
        document.querySelectorAll('.menu-item').forEach(item => {
            const isActive = item.dataset.section === this.currentSection;
            item.classList.toggle('bg-primary-50', isActive);
            item.classList.toggle('dark:bg-primary-900/20', isActive);
            item.classList.toggle('text-primary-600', isActive);
            item.classList.toggle('text-gray-700', !isActive);
            item.classList.toggle('dark:text-gray-300', !isActive);
        });
    }

    /**
     * Load section content
     */
    loadSection(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'wishlist':
                this.loadWishlist();
                break;
            case 'addresses':
                this.loadAddresses();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'password':
                this.loadPasswordChange();
                break;
            default:
                this.loadDashboard();
        }
    }

    /**
     * Load dashboard
     */
    async loadDashboard() {
        if (!this.elements.content) return;

        try {
            const [ordersResponse, wishlistResponse] = await Promise.all([
                authApi.getOrders({ per_page: 5 }),
                authApi.getWishlist({ per_page: 4 })
            ]);

            const orders = ordersResponse.results || [];
            const wishlist = wishlistResponse.results || [];

            this.elements.content.innerHTML = `
                <div class="space-y-8">
                    <!-- Welcome -->
                    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
                        <h2 class="text-2xl font-bold mb-2">Welcome back, ${this.user?.name || 'User'}!</h2>
                        <p class="opacity-90">Manage your account, orders, and preferences from here.</p>
                    </div>

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
                            <div class="text-3xl font-bold text-gray-900 dark:text-white">${this.user?.total_orders || 0}</div>
                            <div class="text-gray-500 dark:text-gray-400">Total Orders</div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
                            <div class="text-3xl font-bold text-gray-900 dark:text-white">${wishlist.length || 0}</div>
                            <div class="text-gray-500 dark:text-gray-400">Wishlist Items</div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
                            <div class="text-3xl font-bold text-gray-900 dark:text-white">${this.user?.total_reviews || 0}</div>
                            <div class="text-gray-500 dark:text-gray-400">Reviews</div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
                            <div class="text-3xl font-bold text-gray-900 dark:text-white">${this.user?.addresses?.length || 0}</div>
                            <div class="text-gray-500 dark:text-gray-400">Addresses</div>
                        </div>
                    </div>

                    <!-- Recent Orders -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                            <a href="/account/orders/" class="text-primary-600 hover:underline text-sm">View All</a>
                        </div>
                        <div class="divide-y divide-gray-200 dark:divide-gray-700">
                            ${orders.length > 0 ? orders.map(order => `
                                <div class="p-6 flex items-center justify-between">
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">#${order.order_number}</p>
                                        <p class="text-sm text-gray-500">${new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div class="text-right">
                                        <span class="inline-flex px-3 py-1 rounded-full text-xs font-medium ${this.getStatusColor(order.status)}">
                                            ${order.status}
                                        </span>
                                        <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">৳${parseFloat(order.total).toLocaleString()}</p>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="p-6 text-center text-gray-500">
                                    No orders yet. <a href="/products/" class="text-primary-600 hover:underline">Start shopping</a>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Wishlist Preview -->
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Wishlist</h3>
                            <a href="/account/wishlist/" class="text-primary-600 hover:underline text-sm">View All</a>
                        </div>
                        <div class="p-6">
                            ${wishlist.length > 0 ? `
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    ${wishlist.map(item => `
                                        <a href="/products/${item.product?.slug || item.slug}/" class="block">
                                            <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                                                <img src="${item.product?.image || item.image || '/static/images/placeholder.jpg'}" alt="${item.product?.name || item.name}" class="w-full h-full object-cover">
                                            </div>
                                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${item.product?.name || item.name}</p>
                                            <p class="text-sm text-gray-500">৳${parseFloat(item.product?.price || item.price).toLocaleString()}</p>
                                        </a>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="text-center text-gray-500">
                                    Your wishlist is empty. <a href="/products/" class="text-primary-600 hover:underline">Browse products</a>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    }

    /**
     * Load orders
     */
    async loadOrders() {
        if (!this.elements.content) return;

        this.elements.content.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                <p class="mt-2 text-gray-500">Loading orders...</p>
            </div>
        `;

        try {
            const response = await authApi.getOrders();
            const orders = response.results || [];

            this.elements.content.innerHTML = `
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h2>

                    ${orders.length > 0 ? `
                        <div class="space-y-4">
                            ${orders.map(order => `
                                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                                    <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p class="font-semibold text-gray-900 dark:text-white">Order #${order.order_number}</p>
                                            <p class="text-sm text-gray-500">${new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium ${this.getStatusColor(order.status)}">
                                                ${order.status}
                                            </span>
                                            <span class="font-bold text-gray-900 dark:text-white">৳${parseFloat(order.total).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div class="p-6">
                                        <div class="flex flex-wrap gap-4">
                                            ${(order.items || []).slice(0, 3).map(item => `
                                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                    <img src="${item.product?.image || '/static/images/placeholder.jpg'}" alt="${item.product?.name}" class="w-full h-full object-cover">
                                                </div>
                                            `).join('')}
                                            ${(order.items?.length || 0) > 3 ? `
                                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                                                    +${order.items.length - 3}
                                                </div>
                                            ` : ''}
                                        </div>
                                        <div class="mt-4 flex justify-between items-center">
                                            <p class="text-sm text-gray-500">${order.items?.length || 0} item(s)</p>
                                            <a href="/orders/${order.order_number}/" class="text-primary-600 hover:underline text-sm font-medium">View Details →</a>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                            <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
                            <p class="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                            <a href="/products/" class="inline-flex px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                Start Shopping
                            </a>
                        </div>
                    `}
                </div>
            `;
        } catch (error) {
            console.error('Failed to load orders:', error);
            Toast.show({ message: 'Failed to load orders', type: 'error' });
        }
    }

    /**
     * Load wishlist
     */
    async loadWishlist() {
        if (!this.elements.content) return;

        this.elements.content.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
        `;

        try {
            const response = await authApi.getWishlist();
            const items = response.results || [];

            this.elements.content.innerHTML = `
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h2>

                    ${items.length > 0 ? `
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            ${items.map(item => {
                                const product = item.product || item;
                                return `
                                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden group">
                                        <div class="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                                            <a href="/products/${product.slug}/">
                                                <img src="${product.image || '/static/images/placeholder.jpg'}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                            </a>
                                            <button 
                                                class="remove-wishlist absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                                                data-product-id="${product.id}"
                                            >
                                                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="p-4">
                                            <a href="/products/${product.slug}/" class="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-2">
                                                ${product.name}
                                            </a>
                                            <p class="text-lg font-bold text-gray-900 dark:text-white mt-2">৳${parseFloat(product.price).toLocaleString()}</p>
                                            <button 
                                                class="add-to-cart-btn w-full mt-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                                                data-product-id="${product.id}"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <div class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                            <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
                            <p class="text-gray-500 mb-6">Save items you like by clicking the heart icon.</p>
                            <a href="/products/" class="inline-flex px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                Browse Products
                            </a>
                        </div>
                    `}
                </div>
            `;

            // Bind remove from wishlist
            document.querySelectorAll('.remove-wishlist').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const productId = btn.dataset.productId;
                    try {
                        await authApi.removeFromWishlist(productId);
                        btn.closest('.bg-white, .dark\\:bg-gray-800').remove();
                        Toast.show({ message: 'Removed from wishlist', type: 'success' });
                    } catch (error) {
                        Toast.show({ message: 'Failed to remove item', type: 'error' });
                    }
                });
            });
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        }
    }

    /**
     * Load addresses
     */
    async loadAddresses() {
        if (!this.elements.content) return;

        try {
            const response = await authApi.getAddresses();
            const addresses = response.results || response || [];

            this.elements.content.innerHTML = `
                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Addresses</h2>
                        <button id="add-address-btn" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Add New Address
                        </button>
                    </div>

                    <div id="address-list" class="grid md:grid-cols-2 gap-6">
                        ${addresses.length > 0 ? addresses.map(address => this.renderAddressCard(address)).join('') : `
                            <div class="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                                <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No addresses saved</h3>
                                <p class="text-gray-500 mb-6">Add an address for faster checkout.</p>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Address Modal -->
                <div id="address-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">Add Address</h3>
                            <button id="close-modal" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <form id="address-form" class="p-6 space-y-4">
                            <input type="hidden" name="id" id="address-id">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" name="full_name" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input type="tel" name="phone" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 1</label>
                                <input type="text" name="address_line_1" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 2 (Optional)</label>
                                <input type="text" name="address_line_2" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                    <input type="text" name="city" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                                    <input type="text" name="postal_code" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Division/State</label>
                                <select name="state" required class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                                    <option value="">Select Division</option>
                                    <option value="Dhaka">Dhaka</option>
                                    <option value="Chittagong">Chittagong</option>
                                    <option value="Rajshahi">Rajshahi</option>
                                    <option value="Khulna">Khulna</option>
                                    <option value="Sylhet">Sylhet</option>
                                    <option value="Barisal">Barisal</option>
                                    <option value="Rangpur">Rangpur</option>
                                    <option value="Mymensingh">Mymensingh</option>
                                </select>
                            </div>
                            <div>
                                <label class="flex items-center gap-2">
                                    <input type="checkbox" name="is_default" class="w-4 h-4 rounded border-gray-300 text-primary-600">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">Set as default address</span>
                                </label>
                            </div>
                            <div class="flex gap-4 pt-4">
                                <button type="button" id="cancel-address" class="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" class="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            this.bindAddressEvents();
        } catch (error) {
            console.error('Failed to load addresses:', error);
        }
    }

    /**
     * Render address card
     */
    renderAddressCard(address) {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm relative ${address.is_default ? 'ring-2 ring-primary-500' : ''}">
                ${address.is_default ? `
                    <span class="absolute top-4 right-4 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-medium rounded-full">Default</span>
                ` : ''}
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">${address.full_name}</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-1">${address.phone}</p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                    ${address.address_line_1}
                    ${address.address_line_2 ? `, ${address.address_line_2}` : ''}
                </p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                    ${address.city}${address.postal_code ? ` - ${address.postal_code}` : ''}, ${address.state}
                </p>
                <div class="flex gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button class="edit-address text-primary-600 hover:underline text-sm" data-address='${JSON.stringify(address)}'>Edit</button>
                    <button class="delete-address text-red-600 hover:underline text-sm" data-address-id="${address.id}">Delete</button>
                    ${!address.is_default ? `
                        <button class="set-default-address text-gray-600 hover:underline text-sm" data-address-id="${address.id}">Set as Default</button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Bind address events
     */
    bindAddressEvents() {
        const modal = document.getElementById('address-modal');
        const form = document.getElementById('address-form');

        // Open modal for new address
        document.getElementById('add-address-btn')?.addEventListener('click', () => {
            document.getElementById('modal-title').textContent = 'Add Address';
            form.reset();
            document.getElementById('address-id').value = '';
            modal.classList.remove('hidden');
        });

        // Close modal
        const closeModal = () => modal.classList.add('hidden');
        document.getElementById('close-modal')?.addEventListener('click', closeModal);
        document.getElementById('cancel-address')?.addEventListener('click', closeModal);

        // Edit address
        document.querySelectorAll('.edit-address').forEach(btn => {
            btn.addEventListener('click', () => {
                const address = JSON.parse(btn.dataset.address);
                document.getElementById('modal-title').textContent = 'Edit Address';
                document.getElementById('address-id').value = address.id;
                form.full_name.value = address.full_name;
                form.phone.value = address.phone;
                form.address_line_1.value = address.address_line_1;
                form.address_line_2.value = address.address_line_2 || '';
                form.city.value = address.city;
                form.postal_code.value = address.postal_code || '';
                form.state.value = address.state;
                form.is_default.checked = address.is_default;
                modal.classList.remove('hidden');
            });
        });

        // Delete address
        document.querySelectorAll('.delete-address').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this address?')) {
                    try {
                        await authApi.deleteAddress(btn.dataset.addressId);
                        Toast.show({ message: 'Address deleted', type: 'success' });
                        this.loadAddresses();
                    } catch (error) {
                        Toast.show({ message: 'Failed to delete address', type: 'error' });
                    }
                }
            });
        });

        // Set default
        document.querySelectorAll('.set-default-address').forEach(btn => {
            btn.addEventListener('click', async () => {
                try {
                    await authApi.setDefaultAddress(btn.dataset.addressId);
                    Toast.show({ message: 'Default address updated', type: 'success' });
                    this.loadAddresses();
                } catch (error) {
                    Toast.show({ message: 'Failed to update', type: 'error' });
                }
            });
        });

        // Submit form
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            data.is_default = form.is_default.checked;

            try {
                if (data.id) {
                    await authApi.updateAddress(data.id, data);
                } else {
                    await authApi.createAddress(data);
                }
                Toast.show({ message: 'Address saved', type: 'success' });
                closeModal();
                this.loadAddresses();
            } catch (error) {
                Toast.show({ message: 'Failed to save address', type: 'error' });
            }
        });
    }

    /**
     * Load profile
     */
    loadProfile() {
        if (!this.elements.content) return;

        this.elements.content.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>

                <form id="profile-form" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                            <input type="text" name="name" value="${this.user?.name || ''}" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input type="email" name="email" value="${this.user?.email || ''}" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                            <input type="tel" name="phone" value="${this.user?.phone || ''}" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                            <input type="date" name="date_of_birth" value="${this.user?.date_of_birth || ''}" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        </div>
                    </div>
                    
                    <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="submit" class="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Bind form submit
        document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            try {
                await authApi.updateProfile(data);
                this.user = { ...this.user, ...data };
                Toast.show({ message: 'Profile updated successfully', type: 'success' });
                this.renderSidebar();
            } catch (error) {
                Toast.show({ message: 'Failed to update profile', type: 'error' });
            }
        });
    }

    /**
     * Load password change
     */
    loadPasswordChange() {
        if (!this.elements.content) return;

        this.elements.content.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h2>

                <form id="password-form" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6 max-w-md">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                        <input type="password" name="current_password" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                        <input type="password" name="new_password" required minlength="8" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <p class="mt-1 text-sm text-gray-500">Must be at least 8 characters</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                        <input type="password" name="confirm_password" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    </div>
                    
                    <button type="submit" class="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                        Update Password
                    </button>
                </form>
            </div>
        `;

        // Bind form submit
        document.getElementById('password-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            if (data.new_password !== data.confirm_password) {
                Toast.show({ message: 'Passwords do not match', type: 'error' });
                return;
            }

            try {
                await authApi.changePassword(data);
                Toast.show({ message: 'Password updated successfully', type: 'success' });
                e.target.reset();
            } catch (error) {
                Toast.show({ message: error.message || 'Failed to update password', type: 'error' });
            }
        });
    }

    /**
     * Get status color class
     */
    getStatusColor(status) {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-700',
            'processing': 'bg-blue-100 text-blue-700',
            'shipped': 'bg-purple-100 text-purple-700',
            'delivered': 'bg-green-100 text-green-700',
            'cancelled': 'bg-red-100 text-red-700',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
    }

    /**
     * Logout
     */
    async logout() {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/';
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('account-sidebar') || document.getElementById('account-content')) {
        const accountPage = new AccountPage();
        accountPage.init();
    }
});

export { AccountPage };

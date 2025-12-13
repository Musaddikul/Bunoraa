// frontend/static/js/pages/account.js
/**
 * Account Pages JavaScript
 * Profile, orders, addresses, wishlist management
 */

import { $, $$, getFormData, delegate } from '../utils/dom.js';
import { formatPrice, formatDate } from '../utils/helpers.js';
import { authApi, ordersApi } from '../api/index.js';
import { FormValidator } from '../utils/validators.js';
import toast from '../components/toast.js';
import { setButtonLoading, skeleton } from '../components/loading.js';
import { confirm, showModal, Modal } from '../components/modal.js';
import { Tabs } from '../components/tabs.js';

/**
 * Account Dashboard
 */
export class AccountDashboard {
    constructor() {
        this.user = null;
        this.recentOrders = [];
        
        this.init();
    }
    
    async init() {
        await this.loadUser();
        this.render();
    }
    
    async loadUser() {
        try {
            const response = await authApi.getProfile();
            if (response.success) {
                this.user = response.data;
            } else {
                window.location.href = '/login/?next=/account/';
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            window.location.href = '/login/?next=/account/';
        }
    }
    
    render() {
        const welcomeEl = $('#welcome-message');
        if (welcomeEl && this.user) {
            welcomeEl.textContent = `Welcome, ${this.user.first_name || this.user.email}!`;
        }
    }
}

/**
 * Profile Page
 */
export class ProfilePage {
    constructor() {
        this.form = $('#profile-form');
        this.user = null;
        
        this.init();
    }
    
    async init() {
        await this.loadProfile();
        this.bindEvents();
    }
    
    async loadProfile() {
        try {
            const response = await authApi.getProfile();
            if (response.success) {
                this.user = response.data;
                this.populateForm();
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            toast.error('Failed to load profile');
        }
    }
    
    populateForm() {
        if (!this.form || !this.user) return;
        
        const fields = ['first_name', 'last_name', 'email', 'phone'];
        fields.forEach(field => {
            const input = this.form.querySelector(`[name="${field}"]`);
            if (input && this.user[field]) {
                input.value = this.user[field];
            }
        });
    }
    
    bindEvents() {
        this.form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProfile();
        });
    }
    
    async saveProfile() {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true, 'Saving...');
        
        try {
            const formData = getFormData(this.form);
            const response = await authApi.updateProfile(formData);
            
            if (response.success) {
                this.user = response.data;
                toast.success('Profile updated successfully');
            } else {
                toast.error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    }
}

/**
 * Orders Page
 */
export class OrdersPage {
    constructor() {
        this.container = $('#orders-container');
        this.orders = [];
        this.pagination = null;
        this.currentPage = 1;
        
        this.init();
    }
    
    async init() {
        await this.loadOrders();
    }
    
    async loadOrders(page = 1) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="space-y-4">
                ${skeleton('card')}
                ${skeleton('card')}
                ${skeleton('card')}
            </div>
        `;
        
        try {
            const response = await ordersApi.getOrders(page);
            
            if (response.success) {
                this.orders = response.data.results || response.data;
                this.pagination = response.meta;
                this.currentPage = page;
                this.render();
            } else {
                this.container.innerHTML = '<p class="text-center text-gray-500">Failed to load orders</p>';
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
            this.container.innerHTML = '<p class="text-center text-gray-500">Failed to load orders</p>';
        }
    }
    
    render() {
        if (this.orders.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p class="text-gray-500 mb-4">You haven't placed any orders yet</p>
                    <a href="/products/" class="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        Start Shopping
                    </a>
                </div>
            `;
            return;
        }
        
        let html = '<div class="space-y-4">';
        
        this.orders.forEach(order => {
            html += this.renderOrder(order);
        });
        
        html += '</div>';
        
        // Pagination
        if (this.pagination && this.pagination.total_pages > 1) {
            html += this.renderPagination();
        }
        
        this.container.innerHTML = html;
        
        // Bind events
        this.bindEvents();
    }
    
    renderOrder(order) {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800'
        };
        
        return `
            <div class="border rounded-lg overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-6">
                        <div>
                            <p class="text-xs text-gray-500">Order</p>
                            <p class="font-medium">#${order.order_number}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Date</p>
                            <p class="text-sm">${formatDate(order.created_at)}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500">Total</p>
                            <p class="font-medium">${formatPrice(order.total)}</p>
                        </div>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || statusColors.pending}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
                
                <div class="p-4">
                    <div class="flex gap-4 overflow-x-auto pb-2">
                        ${order.items?.slice(0, 4).map(item => `
                            <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                ${item.product?.image ? `<img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover">` : ''}
                            </div>
                        `).join('')}
                        ${order.items?.length > 4 ? `
                            <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
                                +${order.items.length - 4}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex items-center justify-between mt-4">
                        <div class="text-sm text-gray-600">
                            ${order.items?.length} item${order.items?.length !== 1 ? 's' : ''}
                        </div>
                        <div class="flex gap-2">
                            <a href="/orders/${order.order_number}/" class="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                                View Details
                            </a>
                            ${order.status === 'delivered' ? `
                                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700" data-reorder="${order.id}">
                                    Reorder
                                </button>
                            ` : ''}
                            ${order.status === 'pending' ? `
                                <button type="button" class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700" data-cancel-order="${order.id}">
                                    Cancel
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const { page, total_pages } = this.pagination;
        
        let html = '<div class="flex justify-center gap-2 mt-6">';
        
        // Previous
        html += `
            <button type="button" class="px-3 py-2 border rounded ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>
                Previous
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= total_pages; i++) {
            if (i === page) {
                html += `<button class="px-3 py-2 bg-primary-600 text-white rounded">${i}</button>`;
            } else if (i === 1 || i === total_pages || (i >= page - 1 && i <= page + 1)) {
                html += `<button type="button" class="px-3 py-2 border rounded hover:bg-gray-50" data-page="${i}">${i}</button>`;
            } else if (i === page - 2 || i === page + 2) {
                html += '<span class="px-2 py-2">...</span>';
            }
        }
        
        // Next
        html += `
            <button type="button" class="px-3 py-2 border rounded ${page >= total_pages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}" data-page="${page + 1}" ${page >= total_pages ? 'disabled' : ''}>
                Next
            </button>
        `;
        
        html += '</div>';
        
        return html;
    }
    
    bindEvents() {
        // Pagination
        delegate(this.container, 'click', '[data-page]', (e, target) => {
            const page = parseInt(target.dataset.page);
            if (page > 0) {
                this.loadOrders(page);
            }
        });
        
        // Cancel order
        delegate(this.container, 'click', '[data-cancel-order]', async (e, target) => {
            const orderId = target.dataset.cancelOrder;
            const confirmed = await confirm('Are you sure you want to cancel this order?', 'Cancel Order');
            if (confirmed) {
                await this.cancelOrder(orderId);
            }
        });
        
        // Reorder
        delegate(this.container, 'click', '[data-reorder]', async (e, target) => {
            const orderId = target.dataset.reorder;
            await this.reorder(orderId);
        });
    }
    
    async cancelOrder(orderId) {
        try {
            const response = await ordersApi.cancelOrder(orderId);
            if (response.success) {
                toast.success('Order cancelled successfully');
                await this.loadOrders(this.currentPage);
            } else {
                toast.error(response.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Failed to cancel order:', error);
            toast.error('Failed to cancel order');
        }
    }
    
    async reorder(orderId) {
        try {
            // TODO: Implement reorder API
            toast.success('Items added to cart');
            window.location.href = '/cart/';
        } catch (error) {
            console.error('Failed to reorder:', error);
            toast.error('Failed to reorder');
        }
    }
}

/**
 * Addresses Page
 */
export class AddressesPage {
    constructor() {
        this.container = $('#addresses-container');
        this.addresses = [];
        
        this.init();
    }
    
    async init() {
        await this.loadAddresses();
        this.bindEvents();
    }
    
    async loadAddresses() {
        if (!this.container) return;
        
        this.container.innerHTML = skeleton('card');
        
        try {
            const response = await authApi.getAddresses();
            if (response.success) {
                this.addresses = response.data || [];
                this.render();
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
            this.container.innerHTML = '<p class="text-center text-gray-500">Failed to load addresses</p>';
        }
    }
    
    render() {
        let html = '<div class="grid md:grid-cols-2 gap-4">';
        
        // Add new address card
        html += `
            <button type="button" id="add-address-btn" class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors min-h-[200px]">
                <svg class="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Address</span>
            </button>
        `;
        
        // Existing addresses
        this.addresses.forEach(address => {
            html += this.renderAddress(address);
        });
        
        html += '</div>';
        
        this.container.innerHTML = html;
    }
    
    renderAddress(address) {
        return `
            <div class="border rounded-lg p-4 relative ${address.is_default ? 'border-primary-500 bg-primary-50' : ''}">
                ${address.is_default ? `
                    <span class="absolute top-2 right-2 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        Default
                    </span>
                ` : ''}
                
                <p class="font-medium">${address.first_name} ${address.last_name}</p>
                <p class="text-sm text-gray-600 mt-1">${address.address_line1}</p>
                ${address.address_line2 ? `<p class="text-sm text-gray-600">${address.address_line2}</p>` : ''}
                <p class="text-sm text-gray-600">${address.city}, ${address.state} ${address.postal_code}</p>
                <p class="text-sm text-gray-600">${address.country}</p>
                ${address.phone ? `<p class="text-sm text-gray-600 mt-2">${address.phone}</p>` : ''}
                
                <div class="flex gap-2 mt-4">
                    <button type="button" class="text-sm text-primary-600 hover:underline" data-edit-address="${address.id}">
                        Edit
                    </button>
                    ${!address.is_default ? `
                        <button type="button" class="text-sm text-gray-600 hover:underline" data-set-default="${address.id}">
                            Set as default
                        </button>
                    ` : ''}
                    <button type="button" class="text-sm text-red-600 hover:underline" data-delete-address="${address.id}">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Add address
        delegate(this.container, 'click', '#add-address-btn', () => {
            this.showAddressModal();
        });
        
        // Edit address
        delegate(this.container, 'click', '[data-edit-address]', (e, target) => {
            const address = this.addresses.find(a => a.id === target.dataset.editAddress);
            if (address) {
                this.showAddressModal(address);
            }
        });
        
        // Set default
        delegate(this.container, 'click', '[data-set-default]', async (e, target) => {
            await this.setDefault(target.dataset.setDefault);
        });
        
        // Delete address
        delegate(this.container, 'click', '[data-delete-address]', async (e, target) => {
            const confirmed = await confirm('Are you sure you want to delete this address?', 'Delete Address');
            if (confirmed) {
                await this.deleteAddress(target.dataset.deleteAddress);
            }
        });
    }
    
    showAddressModal(address = null) {
        const isEdit = !!address;
        
        const modal = new Modal({
            title: isEdit ? 'Edit Address' : 'Add New Address',
            content: `
                <form id="address-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input type="text" name="first_name" required value="${address?.first_name || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input type="text" name="last_name" required value="${address?.last_name || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" value="${address?.phone || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="address_line1" required value="${address?.address_line1 || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input type="text" name="address_line2" value="${address?.address_line2 || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input type="text" name="city" required value="${address?.city || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
                            <input type="text" name="state" required value="${address?.state || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input type="text" name="postal_code" required value="${address?.postal_code || ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select name="country" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option value="">Select country</option>
                                <option value="US" ${address?.country === 'US' ? 'selected' : ''}>United States</option>
                                <option value="CA" ${address?.country === 'CA' ? 'selected' : ''}>Canada</option>
                                <option value="GB" ${address?.country === 'GB' ? 'selected' : ''}>United Kingdom</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" name="is_default" ${address?.is_default ? 'checked' : ''} class="rounded">
                            <span class="text-sm">Set as default address</span>
                        </label>
                    </div>
                </form>
            `,
            showConfirm: true,
            confirmText: isEdit ? 'Save Changes' : 'Add Address',
            size: 'lg',
            onConfirm: async () => {
                const form = modal.getBody().querySelector('#address-form');
                const formData = getFormData(form);
                
                try {
                    let response;
                    if (isEdit) {
                        response = await authApi.updateAddress(address.id, formData);
                    } else {
                        response = await authApi.createAddress(formData);
                    }
                    
                    if (response.success) {
                        modal.close();
                        toast.success(isEdit ? 'Address updated' : 'Address added');
                        await this.loadAddresses();
                    } else {
                        toast.error(response.message || 'Failed to save address');
                    }
                } catch (error) {
                    console.error('Failed to save address:', error);
                    toast.error('Failed to save address');
                }
            }
        });
        
        modal.open();
    }
    
    async setDefault(addressId) {
        try {
            const response = await authApi.setDefaultAddress(addressId);
            if (response.success) {
                toast.success('Default address updated');
                await this.loadAddresses();
            } else {
                toast.error(response.message || 'Failed to update default address');
            }
        } catch (error) {
            console.error('Failed to set default:', error);
            toast.error('Failed to set default address');
        }
    }
    
    async deleteAddress(addressId) {
        try {
            const response = await authApi.deleteAddress(addressId);
            if (response.success) {
                toast.success('Address deleted');
                await this.loadAddresses();
            } else {
                toast.error(response.message || 'Failed to delete address');
            }
        } catch (error) {
            console.error('Failed to delete address:', error);
            toast.error('Failed to delete address');
        }
    }
}

/**
 * Change Password Page
 */
export class ChangePasswordPage {
    constructor() {
        this.form = $('#password-form');
        this.init();
    }
    
    init() {
        this.form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.changePassword();
        });
    }
    
    async changePassword() {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true, 'Updating...');
        
        try {
            const formData = getFormData(this.form);
            
            if (formData.new_password !== formData.confirm_password) {
                toast.error('Passwords do not match');
                return;
            }
            
            const response = await authApi.changePassword({
                current_password: formData.current_password,
                new_password: formData.new_password
            });
            
            if (response.success) {
                toast.success('Password updated successfully');
                this.form?.reset();
            } else {
                toast.error(response.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            toast.error('Failed to update password');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    }
}

/**
 * Initialize account pages based on current page
 */
export function initAccountPages() {
    const page = document.body.dataset.page;
    
    switch (page) {
        case 'account-dashboard':
            return new AccountDashboard();
        case 'account-profile':
            return new ProfilePage();
        case 'account-orders':
            return new OrdersPage();
        case 'account-addresses':
            return new AddressesPage();
        case 'account-password':
            return new ChangePasswordPage();
        default:
            return null;
    }
}

export default {
    AccountDashboard,
    ProfilePage,
    OrdersPage,
    AddressesPage,
    ChangePasswordPage,
    initAccountPages
};

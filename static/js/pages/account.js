/**
 * Account Page
 * @module pages/account
 */

const AccountPage = (function() {
    'use strict';

    let currentUser = null;

    async function init() {
        if (!AuthGuard.requireAuth()) return;

        await loadUserProfile();
        initProfileTabs();
        initProfileForm();
        initPasswordForm();
        initAddressManagement();
    }

    async function loadUserProfile() {
        try {
            const response = await AuthApi.getProfile();
            currentUser = response.data;
            renderProfile();
        } catch (error) {
            console.error('Failed to load profile:', error);
            Toast.error('Failed to load profile.');
        }
    }

    function initProfileTabs() {
        const tabs = document.querySelectorAll('[data-profile-tab]');
        const panels = document.querySelectorAll('[data-profile-panel]');
        if (!tabs.length || !panels.length) return;

        const setActive = (target) => {
            panels.forEach(panel => {
                panel.classList.toggle('hidden', panel.dataset.profilePanel !== target);
            });
            tabs.forEach(btn => {
                const isActive = btn.dataset.profileTab === target;
                btn.classList.toggle('bg-amber-600', isActive);
                btn.classList.toggle('text-white', isActive);
                btn.classList.toggle('shadow-sm', isActive);
                btn.classList.toggle('text-stone-700', !isActive);
                btn.classList.toggle('dark:text-stone-200', !isActive);
            });
            localStorage.setItem('profileTab', target);
        };

        const initial = localStorage.getItem('profileTab') || 'overview';
        setActive(initial);

        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                setActive(btn.dataset.profileTab);
            });
        });
    }

    function renderProfile() {
        const container = document.getElementById('profile-info');
        if (!container || !currentUser) return;

        const name = `${Templates.escapeHtml(currentUser.first_name || '')} ${Templates.escapeHtml(currentUser.last_name || '')}`.trim() || Templates.escapeHtml(currentUser.email || 'User');
        const memberSince = Templates.formatDate(currentUser.created_at || currentUser.date_joined);
        const avatarImg = currentUser.avatar ? `<img id="avatar-preview" src="${currentUser.avatar}" alt="Profile" class="w-full h-full object-cover">` : `
            <span class="flex h-full w-full items-center justify-center text-3xl font-semibold text-stone-500">
                ${(currentUser.first_name?.[0] || currentUser.email?.[0] || 'U').toUpperCase()}
            </span>`;

        container.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-amber-100/60 to-transparent dark:from-amber-900/20 dark:via-amber-800/10" aria-hidden="true"></div>
            <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div class="relative">
                    <div class="w-24 h-24 rounded-2xl ring-4 ring-amber-100 dark:ring-amber-900/40 overflow-hidden bg-stone-100 dark:bg-stone-800">
                        ${avatarImg}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">Profile</p>
                    <h1 class="text-2xl font-bold text-stone-900 dark:text-white leading-tight truncate">${name}</h1>
                    <p class="text-sm text-stone-600 dark:text-stone-300 truncate">${Templates.escapeHtml(currentUser.email)}</p>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">Member since ${memberSince}</p>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button type="button" id="change-avatar-btn" class="btn btn-primary btn-sm">Update photo</button>
                        ${currentUser.avatar ? `<button type="button" id="remove-avatar-btn" class="btn btn-ghost btn-sm text-red-600 hover:text-red-700 dark:text-red-400">Remove photo</button>` : ''}
                    </div>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-3">JPG, GIF or PNG. Max size 5MB.</p>
                </div>
            </div>
        `;

        setupAvatarHandlers();
    }

    function initTabs() {
        Tabs.init();
    }

    function initProfileForm() {
        const form = document.getElementById('profile-form');
        if (!form || !currentUser) return;

        const firstNameInput = document.getElementById('profile-first-name');
        const lastNameInput = document.getElementById('profile-last-name');
        const emailInput = document.getElementById('profile-email');
        const phoneInput = document.getElementById('profile-phone');

        if (firstNameInput) firstNameInput.value = currentUser.first_name || '';
        if (lastNameInput) lastNameInput.value = currentUser.last_name || '';
        if (emailInput) emailInput.value = currentUser.email || '';
        if (phoneInput) phoneInput.value = currentUser.phone || '';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                phone: formData.get('phone')
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                await AuthApi.updateProfile(data);
                Toast.success('Profile updated successfully!');
                await loadUserProfile();
            } catch (error) {
                Toast.error(error.message || 'Failed to update profile.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Changes';
            }
        });
    }

    function setupAvatarHandlers() {
        const avatarInput = document.getElementById('avatar-input');
        const avatarBtn = document.getElementById('change-avatar-btn');
        const removeBtn = document.getElementById('remove-avatar-btn');

        avatarBtn?.addEventListener('click', () => {
            avatarInput?.click();
        });

        removeBtn?.addEventListener('click', () => {
            if (typeof window.removeAvatar === 'function') {
                window.removeAvatar();
            }
        });

        avatarInput?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                Toast.error('Please select an image file.');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                Toast.error('Image must be smaller than 5MB.');
                return;
            }

            try {
                await AuthApi.uploadAvatar(file);
                Toast.success('Avatar updated!');
                await loadUserProfile();
            } catch (error) {
                Toast.error(error.message || 'Failed to update avatar.');
            }
        });
    }

    function initPasswordForm() {
        const form = document.getElementById('password-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const currentPassword = formData.get('current_password');
            const newPassword = formData.get('new_password');
            const confirmPassword = formData.get('confirm_password');

            if (newPassword !== confirmPassword) {
                Toast.error('Passwords do not match.');
                return;
            }

            if (newPassword.length < 8) {
                Toast.error('Password must be at least 8 characters.');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            try {
                await AuthApi.changePassword(currentPassword, newPassword);
                Toast.success('Password updated successfully!');
                form.reset();
            } catch (error) {
                Toast.error(error.message || 'Failed to update password.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Update Password';
            }
        });
    }

    function initAddressManagement() {
        loadAddresses();

        const addAddressBtn = document.getElementById('add-address-btn');
        addAddressBtn?.addEventListener('click', () => {
            showAddressModal();
        });
    }

    async function loadAddresses() {
        const container = document.getElementById('addresses-list');
        if (!container) return;

        Loader.show(container, 'spinner');

        try {
            const response = await AuthApi.getAddresses();
            const addresses = response.data || [];

            if (addresses.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-gray-500">No saved addresses yet.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${addresses.map(addr => `
                        <div class="p-4 border border-gray-200 rounded-lg relative" data-address-id="${addr.id}">
                            ${addr.is_default ? `
                                <span class="absolute top-2 right-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">Default</span>
                            ` : ''}
                            <p class="font-medium text-gray-900">${Templates.escapeHtml(addr.full_name || `${addr.first_name} ${addr.last_name}`)}</p>
                            <p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(addr.address_line_1)}</p>
                            ${addr.address_line_2 ? `<p class="text-sm text-gray-600">${Templates.escapeHtml(addr.address_line_2)}</p>` : ''}
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(addr.city)}, ${Templates.escapeHtml(addr.state || '')} ${Templates.escapeHtml(addr.postal_code)}</p>
                            <p class="text-sm text-gray-600">${Templates.escapeHtml(addr.country)}</p>
                            ${addr.phone ? `<p class="text-sm text-gray-600 mt-1">${Templates.escapeHtml(addr.phone)}</p>` : ''}
                            
                            <div class="mt-4 flex gap-2">
                                <button class="edit-address-btn text-sm text-primary-600 hover:text-primary-700" data-address-id="${addr.id}">Edit</button>
                                ${!addr.is_default ? `
                                    <button class="set-default-btn text-sm text-gray-600 hover:text-gray-700" data-address-id="${addr.id}">Set as Default</button>
                                ` : ''}
                                <button class="delete-address-btn text-sm text-red-600 hover:text-red-700" data-address-id="${addr.id}">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            bindAddressEvents();
        } catch (error) {
            console.error('Failed to load addresses:', error);
            container.innerHTML = '<p class="text-red-500">Failed to load addresses.</p>';
        }
    }

    function bindAddressEvents() {
        document.querySelectorAll('.edit-address-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const addressId = btn.dataset.addressId;
                try {
                    const response = await AuthApi.getAddress(addressId);
                    showAddressModal(response.data);
                } catch (error) {
                    Toast.error('Failed to load address.');
                }
            });
        });

        document.querySelectorAll('.set-default-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const addressId = btn.dataset.addressId;
                try {
                    await AuthApi.setDefaultAddress(addressId);
                    Toast.success('Default address updated.');
                    await loadAddresses();
                } catch (error) {
                    Toast.error('Failed to update default address.');
                }
            });
        });

        document.querySelectorAll('.delete-address-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const addressId = btn.dataset.addressId;
                const confirmed = await Modal.confirm({
                    title: 'Delete Address',
                    message: 'Are you sure you want to delete this address?',
                    confirmText: 'Delete',
                    cancelText: 'Cancel'
                });

                if (confirmed) {
                    try {
                        await AuthApi.deleteAddress(addressId);
                        Toast.success('Address deleted.');
                        await loadAddresses();
                    } catch (error) {
                        Toast.error('Failed to delete address.');
                    }
                }
            });
        });
    }

    function showAddressModal(address = null) {
        const isEdit = !!address;

        Modal.open({
            title: isEdit ? 'Edit Address' : 'Add New Address',
            content: `
                <form id="address-modal-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input type="text" name="first_name" value="${address?.first_name || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input type="text" name="last_name" value="${address?.last_name || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" name="phone" value="${address?.phone || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                        <input type="text" name="address_line_1" value="${address?.address_line_1 || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input type="text" name="address_line_2" value="${address?.address_line_2 || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input type="text" name="city" value="${address?.city || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                            <input type="text" name="state" value="${address?.state || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input type="text" name="postal_code" value="${address?.postal_code || ''}" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select name="country" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Select country</option>
                                <option value="BD" ${address?.country === 'BD' ? 'selected' : ''}>Bangladesh</option>
                                <option value="US" ${address?.country === 'US' ? 'selected' : ''}>United States</option>
                                <option value="UK" ${address?.country === 'UK' ? 'selected' : ''}>United Kingdom</option>
                                <option value="CA" ${address?.country === 'CA' ? 'selected' : ''}>Canada</option>
                                <option value="AU" ${address?.country === 'AU' ? 'selected' : ''}>Australia</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" name="is_default" ${address?.is_default ? 'checked' : ''} class="text-primary-600 focus:ring-primary-500 rounded">
                            <span class="ml-2 text-sm text-gray-600">Set as default address</span>
                        </label>
                    </div>
                </form>
            `,
            confirmText: isEdit ? 'Save Changes' : 'Add Address',
            onConfirm: async () => {
                const form = document.getElementById('address-modal-form');
                const formData = new FormData(form);
                const data = {
                    first_name: formData.get('first_name'),
                    last_name: formData.get('last_name'),
                    phone: formData.get('phone'),
                    address_line_1: formData.get('address_line_1'),
                    address_line_2: formData.get('address_line_2'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    postal_code: formData.get('postal_code'),
                    country: formData.get('country'),
                    is_default: formData.get('is_default') === 'on'
                };

                try {
                    if (isEdit) {
                        await AuthApi.updateAddress(address.id, data);
                        Toast.success('Address updated!');
                    } else {
                        await AuthApi.addAddress(data);
                        Toast.success('Address added!');
                    }
                    await loadAddresses();
                    return true;
                } catch (error) {
                    Toast.error(error.message || 'Failed to save address.');
                    return false;
                }
            }
        });
    }

    function destroy() {
        currentUser = null;
    }

    return {
        init,
        destroy
    };
})();

window.AccountPage = AccountPage;

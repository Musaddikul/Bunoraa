/**
 * Contact Page
 * @module pages/contact
 */

const ContactPage = (function() {
    'use strict';

    async function init() {
        initContactForm();
        await loadContactInfo();
    }

    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const validator = FormValidator.create(form, {
            name: {
                required: true,
                minLength: 2,
                maxLength: 100
            },
            email: {
                required: true,
                email: true
            },
            subject: {
                required: true,
                minLength: 5,
                maxLength: 200
            },
            message: {
                required: true,
                minLength: 20,
                maxLength: 2000
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validator.validate()) {
                Toast.error('Please fill in all required fields correctly.');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

            try {
                const formData = new FormData(form);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    subject: formData.get('subject'),
                    message: formData.get('message')
                };

                await SupportApi.submitContactForm(data);
                
                Toast.success('Thank you for your message! We\'ll get back to you soon.');
                form.reset();
                validator.clearErrors();
                
                showSuccessState();
            } catch (error) {
                Toast.error(error.message || 'Failed to send message. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    function showSuccessState() {
        const form = document.getElementById('contact-form');
        const successContainer = document.getElementById('contact-success');

        if (form && successContainer) {
            form.classList.add('hidden');
            successContainer.classList.remove('hidden');
            successContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p class="text-gray-600 mb-6">Thank you for reaching out. We'll respond to your inquiry within 24-48 hours.</p>
                    <button id="send-another-btn" class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Send Another Message
                    </button>
                </div>
            `;

            document.getElementById('send-another-btn')?.addEventListener('click', () => {
                form.classList.remove('hidden');
                successContainer.classList.add('hidden');
            });
        }
    }

    async function loadContactInfo() {
        const container = document.getElementById('contact-info');
        if (!container) return;

        try {
            const response = await PagesApi.getContactInfo();
            const info = response.data;

            if (!info) return;

            container.innerHTML = `
                <div class="space-y-6">
                    ${info.address ? `
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Address</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(info.address)}</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${info.phone ? `
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Phone</h3>
                                <a href="tel:${info.phone}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(info.phone)}</a>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${info.email ? `
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Email</h3>
                                <a href="mailto:${info.email}" class="text-gray-600 hover:text-primary-600">${Templates.escapeHtml(info.email)}</a>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${info.business_hours ? `
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Business Hours</h3>
                                <p class="text-gray-600">${Templates.escapeHtml(info.business_hours)}</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${info.social_links && Object.keys(info.social_links).length > 0 ? `
                        <div class="pt-4 border-t border-gray-200">
                            <h3 class="font-semibold text-gray-900 mb-3">Follow Us</h3>
                            <div class="flex gap-3">
                                ${info.social_links.facebook ? `
                                    <a href="${info.social_links.facebook}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                ` : ''}
                                ${info.social_links.instagram ? `
                                    <a href="${info.social_links.instagram}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    </a>
                                ` : ''}
                                ${info.social_links.twitter ? `
                                    <a href="${info.social_links.twitter}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                    </a>
                                ` : ''}
                                ${info.social_links.youtube ? `
                                    <a href="${info.social_links.youtube}" target="_blank" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <svg class="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (error) {
            console.error('Failed to load contact info:', error);
        }
    }

    function destroy() {}

    return {
        init,
        destroy
    };
})();

window.ContactPage = ContactPage;
export default ContactPage;

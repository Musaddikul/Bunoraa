// frontend/static/js/main.js
/**
 * Main Application Entry Point
 * Initializes all components and page-specific functionality
 */

import { initComponents } from './components/index.js';
import { authStore, cartStore } from './store/index.js';
import { $, $$ } from './utils/dom.js';

// Page initializers
import { initHomePage } from './pages/home.js';
import { initProductDetail } from './pages/product-detail.js';
import { initCartPage } from './pages/cart.js';
import { initCheckoutPage } from './pages/checkout.js';
import { initAccountPages } from './pages/account.js';

/**
 * Application class
 */
class App {
    constructor() {
        this.page = document.body.dataset.page || 'default';
        this.initialized = false;
    }
    
    /**
     * Initialize application
     */
    async init() {
        if (this.initialized) return;
        
        console.log(`[Bunoraa] Initializing app - Page: ${this.page}`);
        
        // Initialize global components
        initComponents();
        
        // Initialize stores
        await this.initStores();
        
        // Initialize header
        this.initHeader();
        
        // Initialize page-specific functionality
        this.initPage();
        
        // Initialize global event listeners
        this.initGlobalEvents();
        
        this.initialized = true;
        
        console.log('[Bunoraa] App initialized');
    }
    
    /**
     * Initialize stores
     */
    async initStores() {
        // Fetch cart on load
        try {
            await cartStore.fetch();
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
        
        // Update UI when cart changes
        cartStore.subscribe(({ itemCount }) => {
            this.updateCartCount(itemCount);
        });
        
        // Update UI when auth changes
        authStore.subscribe(({ isAuthenticated, user }) => {
            this.updateAuthUI(isAuthenticated, user);
        });
    }
    
    /**
     * Initialize header
     */
    initHeader() {
        // Mobile menu toggle
        const menuToggle = $('#mobile-menu-toggle');
        const mobileMenu = $('#mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                menuToggle.setAttribute(
                    'aria-expanded',
                    mobileMenu.classList.contains('hidden') ? 'false' : 'true'
                );
            });
        }
        
        // User dropdown
        const userDropdown = $('#user-dropdown');
        if (userDropdown) {
            const toggle = userDropdown.querySelector('[data-dropdown-toggle]');
            const menu = userDropdown.querySelector('[data-dropdown-menu]');
            
            toggle?.addEventListener('click', () => {
                menu?.classList.toggle('hidden');
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target)) {
                    menu?.classList.add('hidden');
                }
            });
        }
        
        // Sticky header
        const header = $('header');
        if (header?.dataset.sticky === 'true') {
            let lastScrollY = 0;
            
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                
                if (scrollY > 100) {
                    header.classList.add('shadow-md');
                    
                    if (scrollY > lastScrollY) {
                        // Scrolling down
                        header.classList.add('-translate-y-full');
                    } else {
                        // Scrolling up
                        header.classList.remove('-translate-y-full');
                    }
                } else {
                    header.classList.remove('shadow-md', '-translate-y-full');
                }
                
                lastScrollY = scrollY;
            }, { passive: true });
        }
    }
    
    /**
     * Initialize page-specific functionality
     */
    initPage() {
        switch (this.page) {
            case 'home':
                initHomePage();
                break;
                
            case 'product-detail':
                const productId = document.body.dataset.productId;
                initProductDetail(productId);
                break;
                
            case 'cart':
                initCartPage();
                break;
                
            case 'checkout':
                initCheckoutPage();
                break;
                
            case 'account-dashboard':
            case 'account-profile':
            case 'account-orders':
            case 'account-addresses':
            case 'account-password':
                initAccountPages();
                break;
                
            default:
                // No page-specific initialization
                break;
        }
    }
    
    /**
     * Initialize global event listeners
     */
    initGlobalEvents() {
        // Add to cart buttons (global)
        document.addEventListener('click', async (e) => {
            const addToCartBtn = e.target.closest('[data-add-to-cart]');
            if (addToCartBtn) {
                e.preventDefault();
                
                const productId = addToCartBtn.dataset.productId;
                const variantId = addToCartBtn.dataset.variantId;
                const quantity = parseInt(addToCartBtn.dataset.quantity) || 1;
                
                if (productId) {
                    // Show loading state
                    addToCartBtn.disabled = true;
                    const originalContent = addToCartBtn.innerHTML;
                    addToCartBtn.innerHTML = '<span class="animate-spin">⏳</span>';
                    
                    const result = await cartStore.addItem(productId, quantity, variantId);
                    
                    // Restore button
                    addToCartBtn.disabled = false;
                    addToCartBtn.innerHTML = originalContent;
                    
                    // Show toast
                    const { success, error, warning, info } = await import('./components/toast.js');
                    if (result.success) {
                        success(result.message);
                    } else {
                        error(result.message);
                    }
                }
            }
        });
        
        // Wishlist buttons (global)
        document.addEventListener('click', async (e) => {
            const wishlistBtn = e.target.closest('[data-wishlist-toggle]');
            if (wishlistBtn) {
                e.preventDefault();
                
                const productId = wishlistBtn.dataset.productId;
                if (productId) {
                    // TODO: Toggle wishlist
                    const { success } = await import('./components/toast.js');
                    success('Added to wishlist');
                }
            }
        });
        
        // Back to top button
        const backToTop = $('#back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTop.classList.remove('hidden', 'opacity-0');
                    backToTop.classList.add('opacity-100');
                } else {
                    backToTop.classList.add('opacity-0');
                    setTimeout(() => {
                        if (window.scrollY <= 500) {
                            backToTop.classList.add('hidden');
                        }
                    }, 300);
                }
            }, { passive: true });
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Handle logout
        document.addEventListener('click', async (e) => {
            const logoutBtn = e.target.closest('[data-logout]');
            if (logoutBtn) {
                e.preventDefault();
                await authStore.logout();
                window.location.href = '/';
            }
        });
    }
    
    /**
     * Update cart count in UI
     */
    updateCartCount(count) {
        $$('[data-cart-count]').forEach(el => {
            el.textContent = count;
            el.classList.toggle('hidden', count === 0);
        });
    }
    
    /**
     * Update auth UI
     */
    updateAuthUI(isAuthenticated, user) {
        // Show/hide auth-dependent elements
        $$('[data-auth-required]').forEach(el => {
            el.classList.toggle('hidden', !isAuthenticated);
        });
        
        $$('[data-guest-only]').forEach(el => {
            el.classList.toggle('hidden', isAuthenticated);
        });
        
        // Update user name
        $$('[data-user-name]').forEach(el => {
            el.textContent = user?.first_name || user?.email?.split('@')[0] || 'Account';
        });
        
        // Update avatar
        $$('[data-user-avatar]').forEach(el => {
            if (user?.avatar) {
                el.src = user.avatar;
            }
        });
    }
}

// Create app instance
const app = new App();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for external use
export { app };
export default app;

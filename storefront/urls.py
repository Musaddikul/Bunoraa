# storefront/urls.py
"""
Storefront URLs
Public-facing web pages.
"""
from django.urls import path
from . import views

app_name = 'storefront'

urlpatterns = [
    # Home
    path('', views.HomeView.as_view(), name='home'),
    
    # Catalog
    path('shop/', views.ShopView.as_view(), name='shop'),
    path('category/<slug:slug>/', views.CategoryView.as_view(), name='category'),
    path('product/<slug:slug>/', views.ProductDetailView.as_view(), name='product'),
    path('brands/', views.BrandsView.as_view(), name='brands'),
    path('brand/<slug:slug>/', views.BrandView.as_view(), name='brand'),
    
    # Vendors
    path('vendors/', views.VendorsView.as_view(), name='vendors'),
    path('vendor/<slug:slug>/', views.VendorView.as_view(), name='vendor'),
    
    # Search
    path('search/', views.SearchView.as_view(), name='search'),
    
    # Cart & Checkout
    path('cart/', views.CartView.as_view(), name='cart'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('checkout/success/<str:order_number>/', views.CheckoutSuccessView.as_view(), name='checkout_success'),
    
    # User Account
    path('account/', views.AccountDashboardView.as_view(), name='account'),
    path('account/orders/', views.OrdersView.as_view(), name='orders'),
    path('account/orders/<str:order_number>/', views.OrderDetailView.as_view(), name='order_detail'),
    path('account/addresses/', views.AddressesView.as_view(), name='addresses'),
    path('account/wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('account/settings/', views.SettingsView.as_view(), name='settings'),
    
    # Auth
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/<str:token>/', views.ResetPasswordView.as_view(), name='reset_password'),
    
    # Promotions
    path('sales/', views.SalesView.as_view(), name='sales'),
    path('sale/<slug:slug>/', views.SaleDetailView.as_view(), name='sale'),
    path('flash-deals/', views.FlashDealsView.as_view(), name='flash_deals'),
    
    # Static Pages
    path('about/', views.AboutView.as_view(), name='about'),
    path('contact/', views.ContactView.as_view(), name='contact'),
    path('faq/', views.FAQView.as_view(), name='faq'),
    path('privacy/', views.PrivacyView.as_view(), name='privacy'),
    path('terms/', views.TermsView.as_view(), name='terms'),
    path('shipping-info/', views.ShippingInfoView.as_view(), name='shipping_info'),
    path('returns/', views.ReturnsView.as_view(), name='returns'),
]

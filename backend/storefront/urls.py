# storefront/urls.py
"""
URL configuration for the storefront web pages.
"""
from django.urls import path

from . import views

app_name = 'storefront'

urlpatterns = [
    # Homepage
    path('', views.HomeView.as_view(), name='home'),
    
    # Products
    path('products/', views.ProductListView.as_view(), name='products'),
    path('products/', views.ProductListView.as_view(), name='product_list'),  # Alias
    path('product/<slug:slug>/', views.ProductDetailView.as_view(), name='product_detail'),
    path('category/<slug:slug>/', views.CategoryView.as_view(), name='category'),
    
    # Sale
    path('sale/', views.SaleView.as_view(), name='sale'),
    
    # Search
    path('search/', views.SearchView.as_view(), name='search'),
    
    # Cart & Checkout
    path('cart/', views.CartView.as_view(), name='cart'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    
    # Order confirmation
    path('order/confirmation/<uuid:order_id>/', views.OrderConfirmationView.as_view(), name='order_confirmation'),
    
    # Static pages
    path('contact/', views.ContactView.as_view(), name='contact'),
    path('about/', views.AboutView.as_view(), name='about'),
    
    # Newsletter
    path('newsletter/subscribe/', views.NewsletterSubscribeView.as_view(), name='newsletter_subscribe'),
    
    # Support pages
    path('faq/', views.FAQListView.as_view(), name='faq'),
    path('shipping/', views.ShippingInfoView.as_view(), name='shipping'),
    path('returns/', views.ReturnsPolicyView.as_view(), name='returns'),
    path('track-order/', views.OrderTrackingView.as_view(), name='order_tracking'),
    
    # Legal pages
    path('privacy/', views.PrivacyPolicyView.as_view(), name='privacy'),
    path('terms/', views.TermsOfServiceView.as_view(), name='terms'),
    path('cookies/', views.CookiePolicyView.as_view(), name='cookies'),
    
    # CMS pages
    path('page/<slug:slug>/', views.CMSPageView.as_view(), name='page'),
]

"""
Checkout URL configuration
"""
from django.urls import path
from . import views


app_name = 'checkout'

urlpatterns = [
    # Main checkout flow
    path('', views.CheckoutView.as_view(), name='checkout'),
    path('information/', views.InformationView.as_view(), name='information'),
    path('shipping/', views.ShippingView.as_view(), name='shipping'),
    path('payment/', views.PaymentView.as_view(), name='payment'),
    path('review/', views.ReviewView.as_view(), name='review'),
    path('complete/', views.CompleteView.as_view(), name='complete'),
    path('success/<uuid:order_id>/', views.SuccessView.as_view(), name='success'),
    
    # AJAX endpoints
    path('apply-coupon/', views.ApplyCouponView.as_view(), name='apply_coupon'),
    path('remove-coupon/', views.RemoveCouponView.as_view(), name='remove_coupon'),
    path('update-shipping/', views.UpdateShippingMethodView.as_view(), name='update_shipping'),
    path('summary/', views.GetCheckoutSummaryView.as_view(), name='get_summary'),
    path('validate/', views.ValidateCheckoutView.as_view(), name='validate'),
]

# returns/urls.py
from django.urls import path
from . import views

app_name = 'returns'

urlpatterns = [
    path('request/',             views.ReturnRequestCreateView.as_view(), name='request'),
    path('partials/items/',      views.OrderItemsPartialView.as_view(),    name='items_partial'),
    path('api/returns/',         views.ReturnRequestListAPI.as_view(),     name='returns_list_api'),
    path('api/returns/<int:pk>/',views.ReturnRequestDetailAPI.as_view(),   name='returns_detail_api'),
    path('api/returns/<int:pk>/approve/', views.ApproveReturnAPI.as_view(),    name='returns_approve_api'),
    path('api/returns/<int:pk>/label/',   views.GenerateReturnLabelAPI.as_view(),name='returns_label_api'),
    path('api/returns/<int:pk>/refund/',  views.ProcessRefundAPI.as_view(),     name='returns_refund_api'),
]

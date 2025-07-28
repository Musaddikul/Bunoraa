# analytics/urls.py
from django.urls import path
from .views import DashboardView, MetricsAPI, MetricsRangeAPI

app_name = 'analytics'

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('api/metrics/', MetricsAPI.as_view(), name='metrics_api'),
    path('api/metrics/range/', MetricsRangeAPI.as_view(), name='metrics_range_api'),
]

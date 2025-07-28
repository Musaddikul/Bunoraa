# analytics/views.py
from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from .selectors import get_latest_metrics, get_metrics_range

class DashboardView(View):
    """
    Renders the main analytics dashboard with embedded charts.
    """
    template_name = 'analytics/dashboard.html'

    def get(self, request):
        metrics   = get_latest_metrics()
        chart_data = get_metrics_range(days=7)
        return render(request, self.template_name, {
            'metrics': metrics,
            'chart_data': chart_data
        })

class MetricsAPI(View):
    """
    JSON endpoint returning today's metrics.
    """
    def get(self, request):
        return JsonResponse(get_latest_metrics())

class MetricsRangeAPI(View):
    """
    JSON endpoint for Chart.js: ?days=N
    """
    def get(self, request):
        days = int(request.GET.get('days', 7))
        return JsonResponse(get_metrics_range(days=days), safe=False)

# apps/analytics/views.py
"""
Analytics Views
"""
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count, Avg, F
from datetime import timedelta

from .models import DailyStat, SalesReport, SearchQuery
from .serializers import SalesReportSerializer


class DashboardView(generics.GenericAPIView):
    """
    Admin dashboard statistics.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        from apps.orders.models import Order
        from apps.products.models import Product
        from apps.reviews.models import Review
        
        today = timezone.now().date()
        week_start = today - timedelta(days=7)
        month_start = today - timedelta(days=30)
        
        # Today's stats
        today_orders = Order.objects.filter(created_at__date=today)
        today_revenue = today_orders.filter(
            payment_status=Order.PaymentStatus.PAID
        ).aggregate(Sum('total'))['total__sum'] or 0
        
        # Get today's visitors from DailyStat
        daily_stat = DailyStat.objects.filter(date=today).first()
        today_visitors = daily_stat.unique_visitors if daily_stat else 0
        
        # Week stats
        week_orders = Order.objects.filter(created_at__date__gte=week_start)
        week_revenue = week_orders.filter(
            payment_status=Order.PaymentStatus.PAID
        ).aggregate(Sum('total'))['total__sum'] or 0
        
        # Month stats
        month_orders = Order.objects.filter(created_at__date__gte=month_start)
        month_revenue = month_orders.filter(
            payment_status=Order.PaymentStatus.PAID
        ).aggregate(Sum('total'))['total__sum'] or 0
        
        # Action items
        pending_orders = Order.objects.filter(status=Order.Status.PENDING).count()
        low_stock_products = Product.objects.filter(stock__lte=F('low_stock_threshold')).count()
        pending_reviews = Review.objects.filter(status=Review.Status.PENDING).count()
        
        return Response({
            'today_revenue': today_revenue,
            'today_orders': today_orders.count(),
            'today_visitors': today_visitors,
            'week_revenue': week_revenue,
            'week_orders': week_orders.count(),
            'month_revenue': month_revenue,
            'month_orders': month_orders.count(),
            'pending_orders': pending_orders,
            'low_stock_products': low_stock_products,
            'pending_reviews': pending_reviews,
        })


class RevenueChartView(generics.GenericAPIView):
    """
    Revenue chart data.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        from apps.orders.models import Order
        
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Get daily revenue
        orders = Order.objects.filter(
            created_at__date__gte=start_date,
            payment_status=Order.PaymentStatus.PAID
        ).extra(
            select={'day': 'date(created_at)'}
        ).values('day').annotate(
            revenue=Sum('total'),
            count=Count('id')
        ).order_by('day')
        
        # Fill in missing days
        labels = []
        revenue_data = []
        order_data = []
        
        current = start_date
        order_dict = {str(o['day']): o for o in orders}
        
        while current <= end_date:
            labels.append(current.strftime('%Y-%m-%d'))
            day_data = order_dict.get(str(current), {})
            revenue_data.append(float(day_data.get('revenue', 0)))
            order_data.append(day_data.get('count', 0))
            current += timedelta(days=1)
        
        return Response({
            'labels': labels,
            'revenue': revenue_data,
            'orders': order_data,
        })


class TopProductsView(generics.GenericAPIView):
    """
    Top selling products.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        from apps.orders.models import OrderItem
        
        days = int(request.query_params.get('days', 30))
        limit = int(request.query_params.get('limit', 10))
        start_date = timezone.now() - timedelta(days=days)
        
        top_products = OrderItem.objects.filter(
            order__created_at__gte=start_date,
            order__payment_status='paid'
        ).values(
            'product_id', 'product_name'
        ).annotate(
            units_sold=Sum('quantity'),
            revenue=Sum('total')
        ).order_by('-units_sold')[:limit]
        
        return Response(list(top_products))


class TopSearchesView(generics.GenericAPIView):
    """
    Top search queries.
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        days = int(request.query_params.get('days', 30))
        limit = int(request.query_params.get('limit', 20))
        start_date = timezone.now() - timedelta(days=days)
        
        top_searches = SearchQuery.objects.filter(
            timestamp__gte=start_date
        ).values('query').annotate(
            count=Count('id'),
            avg_results=Avg('results_count')
        ).order_by('-count')[:limit]
        
        return Response(list(top_searches))


class SalesReportViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Sales reports.
    """
    serializer_class = SalesReportSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = SalesReport.objects.all()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        period = self.request.query_params.get('period')
        if period:
            queryset = queryset.filter(period=period)
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Generate a new report."""
        from .tasks import generate_sales_report
        
        period = request.data.get('period', 'daily')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        generate_sales_report.delay(period, start_date, end_date)
        
        return Response({'message': 'Report generation started'})

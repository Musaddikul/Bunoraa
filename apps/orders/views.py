"""
Orders views
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages

from .models import Order
from .services import OrderService


class OrderListView(LoginRequiredMixin, ListView):
    """User order list."""
    model = Order
    template_name = 'accounts/orders.html'
    context_object_name = 'orders'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = Order.objects.filter(
            user=self.request.user,
            is_deleted=False
        ).prefetch_related('items')
        
        # Filter by status
        status = self.request.GET.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'My Orders'
        context['status_choices'] = Order.STATUS_CHOICES
        context['current_status'] = self.request.GET.get('status', '')
        return context


class OrderDetailView(LoginRequiredMixin, DetailView):
    """Order detail page."""
    model = Order
    template_name = 'accounts/order_detail.html'
    context_object_name = 'order'
    
    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user,
            is_deleted=False
        ).prefetch_related('items', 'status_history')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = f'Order {self.object.order_number}'
        return context
    
    def post(self, request, *args, **kwargs):
        """Handle order cancellation."""
        self.object = self.get_object()
        
        if 'cancel_order' in request.POST:
            reason = request.POST.get('cancel_reason', '')
            success, message = OrderService.cancel_order(
                self.object,
                reason=reason,
                cancelled_by=request.user
            )
            
            if success:
                messages.success(request, message)
            else:
                messages.error(request, message)
        
        return redirect('orders:detail', pk=self.object.pk)


class OrderTrackView(TemplateView):
    """Public order tracking page."""
    template_name = 'accounts/orders.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        order_number = self.kwargs.get('order_number')
        
        order = get_object_or_404(
            Order.objects.prefetch_related('status_history'),
            order_number=order_number,
            is_deleted=False
        )
        
        context['page_title'] = f'Track Order {order_number}'
        context['order'] = order
        
        return context

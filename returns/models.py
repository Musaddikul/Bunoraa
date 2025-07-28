# returns/models.py
from django.db import models
from django.conf import settings
from decimal import Decimal
from django.utils import timezone

class ReturnReason(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class ReturnRequest(models.Model):
    STATUS_REQUESTED = 'requested'
    STATUS_APPROVED  = 'approved'
    STATUS_REJECTED  = 'rejected'
    STATUS_SHIPPED   = 'shipped'
    STATUS_RECEIVED  = 'received'
    STATUS_REFUNDED  = 'refunded'
    STATUS_CHOICES   = [
        (STATUS_REQUESTED, 'Requested'),
        (STATUS_APPROVED,  'Approved'),
        (STATUS_REJECTED,  'Rejected'),
        (STATUS_SHIPPED,   'Shipped'),
        (STATUS_RECEIVED,  'Received'),
        (STATUS_REFUNDED,  'Refunded'),
    ]

    order            = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name='return_requests')
    user             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='return_requests', null=True, blank=True, help_text="User who initiated the return", default=None)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_REQUESTED)
    reason_category  = models.ForeignKey(ReturnReason, on_delete=models.SET_NULL, null=True, related_name='return_requests')
    reason_text      = models.TextField()
    return_label_url = models.URLField(blank=True)
    tracking_number  = models.CharField(max_length=100, blank=True)
    refund_amount    = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    requested_at = models.DateTimeField(default=timezone.now)
    approved_at  = models.DateTimeField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    refunded_at  = models.DateTimeField(null=True, blank=True)
    updated_at   = models.DateTimeField(auto_now=True)
    is_active    = models.BooleanField(default=True)

    class Meta:
        ordering = ['-requested_at']

    def __str__(self):
        return f"Return #{self.pk} for Order {self.order.pk} ({self.get_status_display()})"

    def log_event(self, event, notes=''):
        ReturnEvent.objects.create(return_request=self, event=event, notes=notes)

    def approve(self):
        self.status = self.STATUS_APPROVED
        self.approved_at = timezone.now()
        self.save()
        self.log_event('approved')

    def reject(self, reason=''):
        self.status = self.STATUS_REJECTED
        self.processed_at = timezone.now()
        self.save()
        self.log_event('rejected', notes=reason)

    def mark_shipped(self, tracking_number, label_url=''):
        self.status = self.STATUS_SHIPPED
        self.tracking_number = tracking_number
        self.return_label_url = label_url
        self.updated_at = timezone.now()
        self.save()
        self.log_event('shipped', notes=f"Tracking: {tracking_number}")

    def mark_received(self):
        self.status = self.STATUS_RECEIVED
        self.processed_at = timezone.now()
        self.save()
        self.log_event('received')

    def refund(self, amount):
        self.status = self.STATUS_REFUNDED
        self.refunded_at = timezone.now()
        self.refund_amount = Decimal(amount)
        self.save()
        self.log_event('refunded', notes=f"Amount: {amount}")

class ReturnItem(models.Model):
    return_request = models.ForeignKey(ReturnRequest, on_delete=models.CASCADE, related_name='items')
    order_item     = models.ForeignKey("orders.OrderItem", on_delete=models.CASCADE)
    quantity       = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} × {self.order_item.product.name}"

class ReturnEvent(models.Model):
    return_request = models.ForeignKey(ReturnRequest, on_delete=models.CASCADE, related_name='events')
    timestamp      = models.DateTimeField(default=timezone.now)
    event          = models.CharField(max_length=100)
    notes          = models.TextField(blank=True)

    def __str__(self):
        return f"[{self.timestamp}] {self.event}"

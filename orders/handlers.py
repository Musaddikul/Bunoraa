# orders/handlers.py
from django.db.models.signals import post_migrate
from .models import OrderStatus

def create_default_statuses(sender, **kwargs):
    """Create default order statuses after migration"""
    statuses = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    for code, name in statuses:
        OrderStatus.objects.get_or_create(code=code, defaults={'name': name})


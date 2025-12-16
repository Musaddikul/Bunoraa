"""
Support Signals
"""
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='support.TicketMessage')
def update_ticket_on_message(sender, instance, created, **kwargs):
    """Update ticket timestamp when message is added."""
    if created and instance.ticket:
        from django.utils import timezone
        instance.ticket.updated_at = timezone.now()
        instance.ticket.save(update_fields=['updated_at'])

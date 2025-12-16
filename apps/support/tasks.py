"""
Support Tasks
"""
from celery import shared_task


@shared_task
def check_overdue_tickets():
    """Check for overdue tickets and send alerts."""
    from django.utils import timezone
    from .models import Ticket
    
    now = timezone.now()
    
    # Find response overdue
    response_overdue = Ticket.objects.filter(
        status__in=['open', 'in_progress'],
        first_response_at__isnull=True,
        response_due_at__lt=now,
        is_escalated=False
    )
    
    # Find resolution overdue
    resolution_overdue = Ticket.objects.filter(
        status__in=['open', 'pending', 'in_progress', 'on_hold'],
        resolution_due_at__lt=now,
        is_escalated=False
    )
    
    # Auto-escalate overdue tickets
    escalated = 0
    for ticket in response_overdue | resolution_overdue:
        ticket.is_escalated = True
        ticket.priority = 'urgent'
        ticket.save(update_fields=['is_escalated', 'priority'])
        escalated += 1
    
    return f"Escalated {escalated} overdue tickets"


@shared_task
def send_ticket_reminders():
    """Send reminders for tickets pending customer response."""
    from datetime import timedelta
    from django.utils import timezone
    from django.core.mail import send_mail
    from django.conf import settings
    from .models import Ticket
    
    # Find tickets pending for more than 48 hours
    cutoff = timezone.now() - timedelta(hours=48)
    
    pending_tickets = Ticket.objects.filter(
        status='pending',
        updated_at__lt=cutoff
    )
    
    sent = 0
    for ticket in pending_tickets:
        try:
            send_mail(
                subject=f"Reminder: [Ticket #{ticket.ticket_number}] {ticket.subject}",
                message=f"We're waiting for your response on ticket #{ticket.ticket_number}.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[ticket.email],
                fail_silently=True
            )
            sent += 1
        except Exception:
            pass
    
    return f"Sent {sent} ticket reminders"


@shared_task
def auto_close_resolved_tickets():
    """Auto-close resolved tickets after period of inactivity."""
    from datetime import timedelta
    from django.utils import timezone
    from .models import Ticket
    
    # Close resolved tickets older than 7 days
    cutoff = timezone.now() - timedelta(days=7)
    
    closed = Ticket.objects.filter(
        status='resolved',
        resolved_at__lt=cutoff
    ).update(status='closed', closed_at=timezone.now())
    
    return f"Auto-closed {closed} resolved tickets"

# support/selectors.py
from django.core.cache import cache
from django.utils import timezone
from .models import SupportTicket, TicketResponse

CACHE_TTL = 300  # seconds

def get_user_tickets(user, status=None):
    qs = SupportTicket.objects.filter(user=user)
    if status:
        qs = qs.filter(status=status)
    return qs.select_related('assigned_to').prefetch_related('responses','attachments')

def get_agent_tickets(agent, status=None):
    qs = SupportTicket.objects.filter(assigned_to=agent)
    if status:
        qs = qs.filter(status=status)
    return qs.select_related('user').prefetch_related('responses')

def get_ticket_detail(ticket_id):
    return SupportTicket.objects.prefetch_related('responses__attachments','attachments').get(pk=ticket_id)

def get_sla_violations():
    now = timezone.now()
    return SupportTicket.objects.filter(sla_due__lt=now, status__in=['open','pending'])

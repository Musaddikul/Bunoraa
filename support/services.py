# support/services.py
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import SupportTicket, TicketAttachment, TicketResponse, TicketStatus
from .selectors import get_sla_violations

def create_ticket(user, subject, description, category, priority, assigned_to=None, tags=None, attachments=None):
    sla_hours = getattr(settings, 'SUPPORT_SLA_HOURS', 48)
    sla_due = timezone.now() + timezone.timedelta(hours=sla_hours)
    ticket = SupportTicket.objects.create(
        user=user,
        subject=subject,
        description=description,
        category=category,
        priority=priority,
        assigned_to=assigned_to,
        sla_due=sla_due,
        metadata={}
    )
    if tags:
        ticket.tags.set(tags)
    if attachments:
        for f in attachments:
            TicketAttachment.objects.create(ticket=ticket, file=f, uploaded_by=user)
    return ticket

def add_response(ticket_id, user, message, files=None):
    ticket = SupportTicket.objects.get(pk=ticket_id)
    resp = TicketResponse.objects.create(ticket=ticket, user=user, message=message)
    if files:
        for f in files:
            att = TicketAttachment.objects.create(ticket=ticket, file=f, uploaded_by=user)
            resp.attachments.add(att)
    if user != ticket.user:
        ticket.status = TicketStatus.PENDING
        ticket.assigned_to = user
        ticket.save(update_fields=['status','assigned_to','updated_at'])
    return resp

def resolve_ticket(ticket_id):
    ticket = SupportTicket.objects.get(pk=ticket_id)
    ticket.mark_resolved()
    return ticket

def escalate_ticket(ticket_id):
    ticket = SupportTicket.objects.get(pk=ticket_id)
    ticket.escalate()
    return ticket

def check_sla_violations():
    tickets = get_sla_violations()
    return tickets

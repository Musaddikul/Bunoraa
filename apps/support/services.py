"""
Support Services
"""
from django.utils import timezone
from django.db import transaction
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings as django_settings

from .models import (
    Ticket, TicketMessage, TicketAttachment, TicketCategory,
    HelpArticle, ContactMessage
)


class TicketService:
    """Service for ticket operations."""
    
    @staticmethod
    @transaction.atomic
    def create_ticket(
        subject,
        description,
        email,
        name,
        category_id=None,
        user=None,
        order_id=None,
        priority=None,
        phone='',
        attachments=None
    ):
        """Create a new support ticket."""
        category = None
        if category_id:
            category = TicketCategory.objects.filter(id=category_id, is_active=True).first()
        
        # Get priority from category or default
        if not priority:
            priority = category.priority_default if category else 'medium'
        
        # Create ticket
        ticket = Ticket.objects.create(
            user=user,
            email=email,
            name=name,
            phone=phone,
            category=category,
            subject=subject,
            description=description,
            priority=priority,
            order_id=order_id
        )
        
        # Add initial message
        TicketMessage.objects.create(
            ticket=ticket,
            user=user,
            is_staff_reply=False,
            sender_name=name,
            message=description
        )
        
        # Add attachments
        if attachments:
            for attachment in attachments:
                TicketAttachment.objects.create(
                    ticket=ticket,
                    file=attachment,
                    filename=attachment.name,
                    file_size=attachment.size,
                    content_type=attachment.content_type,
                    uploaded_by=user
                )
        
        # Send confirmation email
        TicketService._send_confirmation_email(ticket)
        
        # Send auto-response if configured
        if category and category.auto_response:
            TicketService.add_message(
                ticket=ticket,
                message=category.auto_response,
                is_staff_reply=True,
                is_internal=False,
                sender_name='Support Team'
            )
        
        return ticket
    
    @staticmethod
    def add_message(
        ticket,
        message,
        user=None,
        is_staff_reply=False,
        is_internal=False,
        sender_name='',
        attachments=None
    ):
        """Add a message to a ticket."""
        ticket_message = TicketMessage.objects.create(
            ticket=ticket,
            user=user,
            is_staff_reply=is_staff_reply,
            is_internal=is_internal,
            sender_name=sender_name or (user.get_full_name() if user else 'Customer'),
            message=message
        )
        
        # Add attachments
        if attachments:
            for attachment in attachments:
                TicketAttachment.objects.create(
                    ticket=ticket,
                    message=ticket_message,
                    file=attachment,
                    filename=attachment.name,
                    file_size=attachment.size,
                    content_type=attachment.content_type,
                    uploaded_by=user
                )
        
        # Update ticket
        ticket.updated_at = timezone.now()
        
        # Set first response time
        if is_staff_reply and not ticket.first_response_at:
            ticket.first_response_at = timezone.now()
        
        # Update status based on reply
        if is_staff_reply and ticket.status == 'open':
            ticket.status = 'pending'
        elif not is_staff_reply and ticket.status == 'pending':
            ticket.status = 'open'
        
        ticket.save()
        
        # Send notification
        if is_staff_reply and not is_internal:
            TicketService._send_reply_notification(ticket, ticket_message)
        
        return ticket_message
    
    @staticmethod
    def update_status(ticket, status, user=None, note=''):
        """Update ticket status."""
        old_status = ticket.status
        ticket.status = status
        
        if status == 'resolved':
            ticket.resolved_at = timezone.now()
        elif status == 'closed':
            ticket.closed_at = timezone.now()
        
        ticket.save()
        
        # Add internal note if provided
        if note:
            TicketService.add_message(
                ticket=ticket,
                message=f"Status changed from {old_status} to {status}. {note}",
                user=user,
                is_staff_reply=True,
                is_internal=True,
                sender_name='System'
            )
        
        return ticket
    
    @staticmethod
    def assign_ticket(ticket, staff_user, note=''):
        """Assign ticket to a staff member."""
        old_assignee = ticket.assigned_to
        ticket.assigned_to = staff_user
        
        if ticket.status == 'open':
            ticket.status = 'in_progress'
        
        ticket.save()
        
        # Add internal note
        TicketService.add_message(
            ticket=ticket,
            message=f"Ticket assigned to {staff_user.get_full_name() or staff_user.email}. {note}",
            user=staff_user,
            is_staff_reply=True,
            is_internal=True,
            sender_name='System'
        )
        
        return ticket
    
    @staticmethod
    def escalate_ticket(ticket, reason=''):
        """Escalate a ticket."""
        ticket.is_escalated = True
        ticket.priority = 'urgent'
        ticket.save()
        
        TicketService.add_message(
            ticket=ticket,
            message=f"Ticket escalated. Reason: {reason}",
            is_staff_reply=True,
            is_internal=True,
            sender_name='System'
        )
        
        return ticket
    
    @staticmethod
    def rate_ticket(ticket, rating, feedback=''):
        """Rate a resolved ticket."""
        if ticket.status not in ['resolved', 'closed']:
            raise ValueError("Can only rate resolved or closed tickets")
        
        ticket.satisfaction_rating = rating
        ticket.rating_feedback = feedback
        ticket.save()
        
        return ticket
    
    @staticmethod
    def get_user_tickets(user, status=None):
        """Get tickets for a user."""
        queryset = Ticket.objects.filter(user=user)
        
        if status:
            if status == 'open':
                queryset = queryset.filter(status__in=['open', 'pending', 'in_progress', 'on_hold'])
            else:
                queryset = queryset.filter(status=status)
        
        return queryset.select_related('category', 'assigned_to')
    
    @staticmethod
    def get_ticket_by_number(ticket_number, user=None):
        """Get ticket by number, optionally verified by user."""
        queryset = Ticket.objects.select_related('category', 'assigned_to', 'order', 'user')
        
        try:
            ticket = queryset.get(ticket_number=ticket_number)
            
            # Verify ownership if user provided
            if user and not user.is_staff:
                if ticket.user != user and ticket.email != user.email:
                    return None
            
            return ticket
        except Ticket.DoesNotExist:
            return None
    
    @staticmethod
    def _send_confirmation_email(ticket):
        """Send ticket confirmation email."""
        try:
            context = {
                'ticket': ticket,
                'site_name': getattr(django_settings, 'SITE_NAME', 'Bunoraa'),
            }
            
            html_message = render_to_string(
                'emails/ticket_confirmation.html', context
            )
            
            send_mail(
                subject=f"[Ticket #{ticket.ticket_number}] {ticket.subject}",
                message=f"Your support ticket has been created. Reference: #{ticket.ticket_number}",
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[ticket.email],
                html_message=html_message,
                fail_silently=True
            )
        except Exception:
            pass
    
    @staticmethod
    def _send_reply_notification(ticket, message):
        """Send notification when staff replies."""
        try:
            context = {
                'ticket': ticket,
                'message': message,
                'site_name': getattr(django_settings, 'SITE_NAME', 'Bunoraa'),
            }
            
            html_message = render_to_string(
                'emails/ticket_reply.html', context
            )
            
            send_mail(
                subject=f"Re: [Ticket #{ticket.ticket_number}] {ticket.subject}",
                message=message.message,
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[ticket.email],
                html_message=html_message,
                fail_silently=True
            )
        except Exception:
            pass


class HelpArticleService:
    """Service for help center operations."""
    
    @staticmethod
    def get_published_articles(category_id=None, featured_only=False):
        """Get published help articles."""
        queryset = HelpArticle.objects.filter(is_published=True)
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        if featured_only:
            queryset = queryset.filter(is_featured=True)
        
        return queryset.select_related('category')
    
    @staticmethod
    def get_article_by_slug(slug):
        """Get article by slug and increment view count."""
        try:
            article = HelpArticle.objects.get(slug=slug, is_published=True)
            article.view_count += 1
            article.save(update_fields=['view_count'])
            return article
        except HelpArticle.DoesNotExist:
            return None
    
    @staticmethod
    def mark_helpful(article, is_helpful):
        """Mark article as helpful or not helpful."""
        if is_helpful:
            article.helpful_count += 1
        else:
            article.not_helpful_count += 1
        article.save(update_fields=['helpful_count', 'not_helpful_count'])
        return article
    
    @staticmethod
    def search_articles(query):
        """Search help articles."""
        from django.db.models import Q
        
        return HelpArticle.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(summary__icontains=query),
            is_published=True
        ).select_related('category')


class ContactMessageService:
    """Service for contact form operations."""
    
    @staticmethod
    def create_message(
        name,
        email,
        subject,
        message,
        subject_type='general',
        phone='',
        company='',
        ip_address=None,
        user_agent=''
    ):
        """Create a contact message."""
        contact = ContactMessage.objects.create(
            name=name,
            email=email,
            phone=phone,
            company=company,
            subject_type=subject_type,
            subject=subject,
            message=message,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Send confirmation email
        ContactMessageService._send_confirmation(contact)
        
        return contact
    
    @staticmethod
    def convert_to_ticket(contact_message, category_id=None):
        """Convert a contact message to a support ticket."""
        if contact_message.converted_to_ticket:
            return contact_message.converted_to_ticket
        
        ticket = TicketService.create_ticket(
            subject=contact_message.subject,
            description=contact_message.message,
            email=contact_message.email,
            name=contact_message.name,
            category_id=category_id,
            phone=contact_message.phone
        )
        
        contact_message.converted_to_ticket = ticket
        contact_message.save(update_fields=['converted_to_ticket'])
        
        return ticket
    
    @staticmethod
    def _send_confirmation(contact):
        """Send confirmation email for contact form."""
        try:
            context = {
                'contact': contact,
                'site_name': getattr(django_settings, 'SITE_NAME', 'Bunoraa'),
            }
            
            html_message = render_to_string(
                'emails/contact_confirmation.html', context
            )
            
            send_mail(
                subject=f"We received your message: {contact.subject}",
                message="Thank you for contacting us. We'll get back to you soon.",
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact.email],
                html_message=html_message,
                fail_silently=True
            )
        except Exception:
            pass

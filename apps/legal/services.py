"""
Legal Services
"""
import secrets
from django.utils import timezone
from django.core.cache import cache
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings as django_settings

from .models import (
    LegalDocument, LegalDocumentVersion, UserConsent,
    CookieConsent, GDPRRequest
)


class LegalDocumentService:
    """Service for legal document operations."""
    
    CACHE_TIMEOUT = 3600  # 1 hour
    
    @staticmethod
    def get_document(document_type):
        """Get a legal document by type."""
        cache_key = f'legal_document_{document_type}'
        document = cache.get(cache_key)
        
        if document is None:
            document = LegalDocument.objects.filter(
                document_type=document_type,
                is_published=True
            ).first()
            
            if document:
                cache.set(cache_key, document, LegalDocumentService.CACHE_TIMEOUT)
        
        return document
    
    @staticmethod
    def get_document_by_slug(slug):
        """Get a legal document by slug."""
        return LegalDocument.objects.filter(slug=slug, is_published=True).first()
    
    @staticmethod
    def get_all_published():
        """Get all published legal documents."""
        cache_key = 'legal_documents_all'
        documents = cache.get(cache_key)
        
        if documents is None:
            documents = list(LegalDocument.objects.filter(is_published=True))
            cache.set(cache_key, documents, LegalDocumentService.CACHE_TIMEOUT)
        
        return documents
    
    @staticmethod
    def get_documents_requiring_acceptance():
        """Get documents that require user acceptance."""
        return LegalDocument.objects.filter(
            is_published=True,
            requires_acceptance=True
        )
    
    @staticmethod
    def create_version(document, content, version, change_summary='', user=None):
        """Create a new version of a document."""
        # Archive current version
        if document.content:
            LegalDocumentVersion.objects.create(
                document=document,
                version=document.version,
                content=document.content,
                effective_date=document.effective_date,
                change_summary=change_summary,
                created_by=user
            )
        
        # Update document
        document.content = content
        document.version = version
        document.effective_date = timezone.now().date()
        document.last_updated_by = user
        document.save()
        
        # Clear cache
        cache.delete(f'legal_document_{document.document_type}')
        cache.delete('legal_documents_all')
        
        return document
    
    @staticmethod
    def get_version_history(document):
        """Get version history for a document."""
        return document.versions.all()


class ConsentService:
    """Service for user consent operations."""
    
    @staticmethod
    def record_consent(user, consent_type, document=None, ip_address=None, user_agent=''):
        """Record user consent."""
        consent_data = {
            'user': user,
            'consent_type': consent_type,
            'is_granted': True,
            'ip_address': ip_address,
            'user_agent': user_agent,
        }
        
        if document:
            consent_data['document'] = document
            consent_data['document_version'] = document.version
        
        # Check for existing consent and update
        existing = UserConsent.objects.filter(
            user=user,
            consent_type=consent_type
        ).first()
        
        if existing:
            existing.is_granted = True
            existing.revoked_at = None
            existing.ip_address = ip_address
            existing.user_agent = user_agent
            if document:
                existing.document = document
                existing.document_version = document.version
            existing.save()
            return existing
        
        return UserConsent.objects.create(**consent_data)
    
    @staticmethod
    def revoke_consent(user, consent_type):
        """Revoke user consent."""
        try:
            consent = UserConsent.objects.get(
                user=user,
                consent_type=consent_type,
                is_granted=True
            )
            consent.revoke()
            return True
        except UserConsent.DoesNotExist:
            return False
    
    @staticmethod
    def check_consent(user, consent_type):
        """Check if user has given consent."""
        return UserConsent.objects.filter(
            user=user,
            consent_type=consent_type,
            is_granted=True
        ).exists()
    
    @staticmethod
    def get_user_consents(user):
        """Get all consents for a user."""
        return UserConsent.objects.filter(user=user).order_by('-granted_at')
    
    @staticmethod
    def check_required_consents(user):
        """Check if user has accepted all required documents."""
        required_docs = LegalDocument.objects.filter(
            is_published=True,
            requires_acceptance=True
        )
        
        for doc in required_docs:
            consent = UserConsent.objects.filter(
                user=user,
                document=doc,
                is_granted=True
            ).first()
            
            if not consent or consent.document_version != doc.version:
                return False, doc
        
        return True, None


class CookieConsentService:
    """Service for cookie consent operations."""
    
    @staticmethod
    def save_consent(user=None, visitor_id='', choices=None, ip_address=None, user_agent=''):
        """Save cookie consent choices."""
        if not choices:
            choices = {}
        
        # Find existing consent
        if user:
            consent = CookieConsent.objects.filter(user=user).first()
        elif visitor_id:
            consent = CookieConsent.objects.filter(visitor_id=visitor_id).first()
        else:
            consent = None
        
        if consent:
            # Update existing
            consent.analytics = choices.get('analytics', False)
            consent.marketing = choices.get('marketing', False)
            consent.preferences = choices.get('preferences', False)
            consent.ip_address = ip_address
            consent.user_agent = user_agent
            consent.save()
        else:
            # Create new
            consent = CookieConsent.objects.create(
                user=user,
                visitor_id=visitor_id,
                analytics=choices.get('analytics', False),
                marketing=choices.get('marketing', False),
                preferences=choices.get('preferences', False),
                ip_address=ip_address,
                user_agent=user_agent
            )
        
        return consent
    
    @staticmethod
    def get_consent(user=None, visitor_id=''):
        """Get cookie consent for user or visitor."""
        if user:
            return CookieConsent.objects.filter(user=user).first()
        elif visitor_id:
            return CookieConsent.objects.filter(visitor_id=visitor_id).first()
        return None
    
    @staticmethod
    def accept_all(user=None, visitor_id='', ip_address=None, user_agent=''):
        """Accept all cookies."""
        return CookieConsentService.save_consent(
            user=user,
            visitor_id=visitor_id,
            choices={
                'analytics': True,
                'marketing': True,
                'preferences': True,
            },
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    @staticmethod
    def reject_all(user=None, visitor_id='', ip_address=None, user_agent=''):
        """Reject all optional cookies."""
        return CookieConsentService.save_consent(
            user=user,
            visitor_id=visitor_id,
            choices={
                'analytics': False,
                'marketing': False,
                'preferences': False,
            },
            ip_address=ip_address,
            user_agent=user_agent
        )


class GDPRService:
    """Service for GDPR request operations."""
    
    @staticmethod
    def create_request(request_type, email, user=None, description=''):
        """Create a GDPR request."""
        request = GDPRRequest.objects.create(
            user=user,
            email=email,
            request_type=request_type,
            description=description,
            verification_token=secrets.token_urlsafe(32)
        )
        
        # Send verification email for non-authenticated requests
        if not user:
            GDPRService._send_verification_email(request)
        else:
            request.is_verified = True
            request.verified_at = timezone.now()
            request.save()
        
        # Send notification to admin
        GDPRService._notify_admin(request)
        
        return request
    
    @staticmethod
    def verify_request(token):
        """Verify a GDPR request."""
        try:
            request = GDPRRequest.objects.get(
                verification_token=token,
                is_verified=False
            )
            request.is_verified = True
            request.verified_at = timezone.now()
            request.save()
            return request
        except GDPRRequest.DoesNotExist:
            return None
    
    @staticmethod
    def process_request(gdpr_request, processor_user, response=''):
        """Mark request as in progress."""
        gdpr_request.status = 'in_progress'
        gdpr_request.processed_by = processor_user
        gdpr_request.response = response
        gdpr_request.save()
        
        return gdpr_request
    
    @staticmethod
    def complete_request(gdpr_request, response=''):
        """Complete a GDPR request."""
        gdpr_request.status = 'completed'
        gdpr_request.completed_at = timezone.now()
        if response:
            gdpr_request.response = response
        gdpr_request.save()
        
        # Send completion email
        GDPRService._send_completion_email(gdpr_request)
        
        return gdpr_request
    
    @staticmethod
    def get_user_requests(user):
        """Get all GDPR requests for a user."""
        return GDPRRequest.objects.filter(user=user)
    
    @staticmethod
    def get_pending_requests():
        """Get all pending GDPR requests."""
        return GDPRRequest.objects.filter(
            status__in=['pending', 'in_progress'],
            is_verified=True
        )
    
    @staticmethod
    def export_user_data(user):
        """Export all data for a user (for data access requests)."""
        from apps.accounts.models import User
        from apps.orders.models import Order
        from apps.wishlist.models import Wishlist
        from apps.reviews.models import Review
        
        data = {
            'account': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone': getattr(user, 'phone', ''),
                'date_joined': str(user.date_joined),
            },
            'orders': [],
            'reviews': [],
            'consents': [],
        }
        
        # Orders
        for order in Order.objects.filter(user=user):
            data['orders'].append({
                'order_number': order.order_number,
                'status': order.status,
                'total': str(order.total),
                'created_at': str(order.created_at),
            })
        
        # Reviews
        for review in Review.objects.filter(user=user):
            data['reviews'].append({
                'product': review.product.name,
                'rating': review.rating,
                'comment': review.comment,
                'created_at': str(review.created_at),
            })
        
        # Consents
        for consent in UserConsent.objects.filter(user=user):
            data['consents'].append({
                'type': consent.consent_type,
                'granted': consent.is_granted,
                'granted_at': str(consent.granted_at),
            })
        
        return data
    
    @staticmethod
    def _send_verification_email(request):
        """Send verification email for GDPR request."""
        try:
            context = {
                'request': request,
                'verification_url': f"/legal/gdpr/verify/{request.verification_token}/",
                'site_name': getattr(django_settings, 'SITE_NAME', 'Bunoraa'),
            }
            
            html_message = render_to_string(
                'emails/gdpr_verification.html', context
            )
            
            send_mail(
                subject="Verify your data request",
                message=f"Please verify your request by clicking the link in this email.",
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.email],
                html_message=html_message,
                fail_silently=True
            )
        except Exception:
            pass
    
    @staticmethod
    def _send_completion_email(request):
        """Send completion notification email."""
        try:
            context = {
                'request': request,
                'site_name': getattr(django_settings, 'SITE_NAME', 'Bunoraa'),
            }
            
            html_message = render_to_string(
                'emails/gdpr_completed.html', context
            )
            
            send_mail(
                subject=f"Your {request.get_request_type_display()} has been completed",
                message=f"Your {request.get_request_type_display()} has been processed.",
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.email],
                html_message=html_message,
                fail_silently=True
            )
        except Exception:
            pass
    
    @staticmethod
    def _notify_admin(request):
        """Notify admin of new GDPR request."""
        try:
            admin_email = getattr(django_settings, 'ADMIN_EMAIL', None)
            if admin_email:
                send_mail(
                    subject=f"New GDPR Request: {request.get_request_type_display()}",
                    message=f"A new GDPR {request.get_request_type_display()} has been submitted by {request.email}.",
                    from_email=django_settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[admin_email],
                    fail_silently=True
                )
        except Exception:
            pass

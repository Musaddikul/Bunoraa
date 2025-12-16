"""
Legal API Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from ..models import LegalDocument
from ..services import (
    LegalDocumentService, ConsentService, CookieConsentService, GDPRService
)
from .serializers import (
    LegalDocumentSerializer, LegalDocumentListSerializer,
    UserConsentSerializer, RecordConsentSerializer, RevokeConsentSerializer,
    CookieConsentSerializer, SaveCookieConsentSerializer,
    GDPRRequestSerializer, CreateGDPRRequestSerializer
)


class LegalDocumentViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for legal documents."""
    queryset = LegalDocument.objects.filter(is_published=True)
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return LegalDocumentListSerializer
        return LegalDocumentSerializer
    
    def list(self, request):
        """List all published legal documents."""
        documents = LegalDocumentService.get_all_published()
        serializer = LegalDocumentListSerializer(documents, many=True)
        
        return Response({
            'success': True,
            'message': 'Legal documents retrieved',
            'data': serializer.data
        })
    
    def retrieve(self, request, slug=None):
        """Get a legal document by slug."""
        document = LegalDocumentService.get_document_by_slug(slug)
        
        if not document:
            return Response({
                'success': False,
                'message': 'Document not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = LegalDocumentSerializer(document)
        return Response({
            'success': True,
            'message': 'Document retrieved',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def terms(self, request):
        """Get terms of service."""
        document = LegalDocumentService.get_document('terms')
        if document:
            return Response({
                'success': True,
                'message': 'Terms retrieved',
                'data': LegalDocumentSerializer(document).data
            })
        return Response({
            'success': False,
            'message': 'Terms not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def privacy(self, request):
        """Get privacy policy."""
        document = LegalDocumentService.get_document('privacy')
        if document:
            return Response({
                'success': True,
                'message': 'Privacy policy retrieved',
                'data': LegalDocumentSerializer(document).data
            })
        return Response({
            'success': False,
            'message': 'Privacy policy not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def cookies(self, request):
        """Get cookie policy."""
        document = LegalDocumentService.get_document('cookies')
        if document:
            return Response({
                'success': True,
                'message': 'Cookie policy retrieved',
                'data': LegalDocumentSerializer(document).data
            })
        return Response({
            'success': False,
            'message': 'Cookie policy not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)


class ConsentViewSet(viewsets.ViewSet):
    """API endpoint for user consents."""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """List user's consents."""
        consents = ConsentService.get_user_consents(request.user)
        serializer = UserConsentSerializer(consents, many=True)
        
        return Response({
            'success': True,
            'message': 'Consents retrieved',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def record(self, request):
        """Record a consent."""
        serializer = RecordConsentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        document = None
        if data.get('document_id'):
            document = LegalDocument.objects.filter(id=data['document_id']).first()
        
        ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        consent = ConsentService.record_consent(
            user=request.user,
            consent_type=data['consent_type'],
            document=document,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        return Response({
            'success': True,
            'message': 'Consent recorded',
            'data': UserConsentSerializer(consent).data
        })
    
    @action(detail=False, methods=['post'])
    def revoke(self, request):
        """Revoke a consent."""
        serializer = RevokeConsentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        success = ConsentService.revoke_consent(
            request.user,
            serializer.validated_data['consent_type']
        )
        
        if success:
            return Response({
                'success': True,
                'message': 'Consent revoked',
                'data': None
            })
        
        return Response({
            'success': False,
            'message': 'Consent not found',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def check_required(self, request):
        """Check if user has accepted all required documents."""
        is_complete, pending_doc = ConsentService.check_required_consents(request.user)
        
        return Response({
            'success': True,
            'message': 'Consent check complete',
            'data': {
                'all_accepted': is_complete,
                'pending_document': LegalDocumentListSerializer(pending_doc).data if pending_doc else None
            }
        })


class CookieConsentView(APIView):
    """API endpoint for cookie consent."""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get current cookie consent."""
        user = request.user if request.user.is_authenticated else None
        visitor_id = request.COOKIES.get('visitor_id', '')
        
        consent = CookieConsentService.get_consent(user=user, visitor_id=visitor_id)
        
        if consent:
            return Response({
                'success': True,
                'message': 'Cookie consent retrieved',
                'data': CookieConsentSerializer(consent).data
            })
        
        return Response({
            'success': True,
            'message': 'No cookie consent found',
            'data': None
        })
    
    def post(self, request):
        """Save cookie consent."""
        serializer = SaveCookieConsentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        user = request.user if request.user.is_authenticated else None
        
        consent = CookieConsentService.save_consent(
            user=user,
            visitor_id=data.get('visitor_id', ''),
            choices={
                'analytics': data.get('analytics', False),
                'marketing': data.get('marketing', False),
                'preferences': data.get('preferences', False),
            },
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'success': True,
            'message': 'Cookie consent saved',
            'data': CookieConsentSerializer(consent).data
        })


class CookieConsentAcceptAllView(APIView):
    """Accept all cookies endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Accept all cookies."""
        user = request.user if request.user.is_authenticated else None
        visitor_id = request.data.get('visitor_id', '')
        
        consent = CookieConsentService.accept_all(
            user=user,
            visitor_id=visitor_id,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'success': True,
            'message': 'All cookies accepted',
            'data': CookieConsentSerializer(consent).data
        })


class CookieConsentRejectAllView(APIView):
    """Reject optional cookies endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Reject all optional cookies."""
        user = request.user if request.user.is_authenticated else None
        visitor_id = request.data.get('visitor_id', '')
        
        consent = CookieConsentService.reject_all(
            user=user,
            visitor_id=visitor_id,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'success': True,
            'message': 'Optional cookies rejected',
            'data': CookieConsentSerializer(consent).data
        })


class GDPRRequestViewSet(viewsets.ViewSet):
    """API endpoint for GDPR requests."""
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def list(self, request):
        """List user's GDPR requests."""
        requests = GDPRService.get_user_requests(request.user)
        serializer = GDPRRequestSerializer(requests, many=True)
        
        return Response({
            'success': True,
            'message': 'GDPR requests retrieved',
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a GDPR request."""
        serializer = CreateGDPRRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        user = request.user if request.user.is_authenticated else None
        email = data.get('email') or (user.email if user else None)
        
        if not email:
            return Response({
                'success': False,
                'message': 'Email is required',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        gdpr_request = GDPRService.create_request(
            request_type=data['request_type'],
            email=email,
            user=user,
            description=data.get('description', '')
        )
        
        message = 'Request submitted.'
        if not user:
            message += ' Please check your email to verify your request.'
        
        return Response({
            'success': True,
            'message': message,
            'data': GDPRRequestSerializer(gdpr_request).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def export_data(self, request):
        """Export user's data."""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'Authentication required',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        data = GDPRService.export_user_data(request.user)
        
        return Response({
            'success': True,
            'message': 'Data exported',
            'data': data
        })


class GDPRVerifyView(APIView):
    """Verify GDPR request."""
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        """Verify a GDPR request by token."""
        gdpr_request = GDPRService.verify_request(token)
        
        if gdpr_request:
            return Response({
                'success': True,
                'message': 'Request verified successfully',
                'data': GDPRRequestSerializer(gdpr_request).data
            })
        
        return Response({
            'success': False,
            'message': 'Invalid or expired verification token',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)

"""
Support API Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from ..models import TicketCategory, Ticket, HelpArticle
from ..services import TicketService, HelpArticleService, ContactMessageService
from .serializers import (
    TicketCategorySerializer, TicketSerializer, TicketListSerializer,
    CreateTicketSerializer, AddMessageSerializer, RateTicketSerializer,
    HelpArticleSerializer, HelpArticleListSerializer, HelpfulFeedbackSerializer,
    CreateContactMessageSerializer
)


class TicketCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for ticket categories."""
    queryset = TicketCategory.objects.filter(is_active=True)
    serializer_class = TicketCategorySerializer
    permission_classes = [AllowAny]


class TicketViewSet(viewsets.ViewSet):
    """API endpoint for support tickets."""
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """List user's tickets."""
        status_filter = request.query_params.get('status')
        tickets = TicketService.get_user_tickets(request.user, status=status_filter)
        serializer = TicketListSerializer(tickets, many=True)
        
        return Response({
            'success': True,
            'message': 'Tickets retrieved',
            'data': serializer.data
        })
    
    def retrieve(self, request, pk=None):
        """Get ticket details."""
        ticket = TicketService.get_ticket_by_number(pk, user=request.user)
        
        if not ticket:
            return Response({
                'success': False,
                'message': 'Ticket not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TicketSerializer(ticket, context={'request': request})
        return Response({
            'success': True,
            'message': 'Ticket retrieved',
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a new ticket."""
        serializer = CreateTicketSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        ticket = TicketService.create_ticket(
            subject=data['subject'],
            description=data['description'],
            email=data['email'],
            name=data['name'],
            category_id=data.get('category_id'),
            user=request.user,
            order_id=data.get('order_id'),
            priority=data.get('priority'),
            phone=data.get('phone', '')
        )
        
        return Response({
            'success': True,
            'message': 'Ticket created successfully',
            'data': TicketSerializer(ticket, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def message(self, request, pk=None):
        """Add a message to a ticket."""
        ticket = TicketService.get_ticket_by_number(pk, user=request.user)
        
        if not ticket:
            return Response({
                'success': False,
                'message': 'Ticket not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not ticket.is_open:
            return Response({
                'success': False,
                'message': 'Cannot add message to closed ticket',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AddMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        message = TicketService.add_message(
            ticket=ticket,
            message=serializer.validated_data['message'],
            user=request.user,
            is_staff_reply=False
        )
        
        return Response({
            'success': True,
            'message': 'Message added',
            'data': TicketSerializer(ticket, context={'request': request}).data
        })
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Request to close a ticket."""
        ticket = TicketService.get_ticket_by_number(pk, user=request.user)
        
        if not ticket:
            return Response({
                'success': False,
                'message': 'Ticket not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        TicketService.update_status(ticket, 'closed', request.user, 'Closed by customer')
        
        return Response({
            'success': True,
            'message': 'Ticket closed',
            'data': TicketSerializer(ticket, context={'request': request}).data
        })
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate a resolved/closed ticket."""
        ticket = TicketService.get_ticket_by_number(pk, user=request.user)
        
        if not ticket:
            return Response({
                'success': False,
                'message': 'Ticket not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RateTicketSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            TicketService.rate_ticket(
                ticket,
                serializer.validated_data['rating'],
                serializer.validated_data.get('feedback', '')
            )
            
            return Response({
                'success': True,
                'message': 'Thank you for your feedback',
                'data': None
            })
        except ValueError as e:
            return Response({
                'success': False,
                'message': str(e),
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)


class GuestTicketView(APIView):
    """API endpoint for guest ticket lookup."""
    permission_classes = [AllowAny]
    
    def get(self, request, ticket_number):
        """Look up ticket by number and email."""
        email = request.query_params.get('email')
        
        if not email:
            return Response({
                'success': False,
                'message': 'Email required',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ticket = Ticket.objects.get(
                ticket_number=ticket_number,
                email=email
            )
            
            return Response({
                'success': True,
                'message': 'Ticket found',
                'data': TicketSerializer(ticket, context={'request': request}).data
            })
        except Ticket.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Ticket not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        """Create a guest ticket."""
        serializer = CreateTicketSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        ticket = TicketService.create_ticket(
            subject=data['subject'],
            description=data['description'],
            email=data['email'],
            name=data['name'],
            category_id=data.get('category_id'),
            priority=data.get('priority'),
            phone=data.get('phone', '')
        )
        
        return Response({
            'success': True,
            'message': 'Ticket created. Check your email for confirmation.',
            'data': {
                'ticket_number': ticket.ticket_number
            }
        }, status=status.HTTP_201_CREATED)


class HelpArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for help articles."""
    queryset = HelpArticle.objects.filter(is_published=True)
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return HelpArticleListSerializer
        return HelpArticleSerializer
    
    def list(self, request):
        """List published help articles."""
        category_id = request.query_params.get('category')
        featured = request.query_params.get('featured') == 'true'
        query = request.query_params.get('q')
        
        if query:
            articles = HelpArticleService.search_articles(query)
        else:
            articles = HelpArticleService.get_published_articles(
                category_id=category_id,
                featured_only=featured
            )
        
        serializer = HelpArticleListSerializer(articles, many=True)
        return Response({
            'success': True,
            'message': 'Articles retrieved',
            'data': serializer.data
        })
    
    def retrieve(self, request, slug=None):
        """Get article by slug."""
        article = HelpArticleService.get_article_by_slug(slug)
        
        if not article:
            return Response({
                'success': False,
                'message': 'Article not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = HelpArticleSerializer(article)
        return Response({
            'success': True,
            'message': 'Article retrieved',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def feedback(self, request, slug=None):
        """Mark article as helpful or not."""
        article = HelpArticleService.get_article_by_slug(slug)
        
        if not article:
            return Response({
                'success': False,
                'message': 'Article not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = HelpfulFeedbackSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        HelpArticleService.mark_helpful(article, serializer.validated_data['is_helpful'])
        
        return Response({
            'success': True,
            'message': 'Thank you for your feedback',
            'data': None
        })


class ContactMessageView(APIView):
    """API endpoint for contact form."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Submit a contact message."""
        serializer = CreateContactMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': None,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Get client info
        ip_address = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        contact = ContactMessageService.create_message(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message'],
            subject_type=data.get('subject_type', 'general'),
            phone=data.get('phone', ''),
            company=data.get('company', ''),
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        return Response({
            'success': True,
            'message': 'Your message has been sent. We\'ll get back to you soon.',
            'data': None
        }, status=status.HTTP_201_CREATED)

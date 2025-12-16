"""
Reviews API views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from ..models import Review
from ..services import ReviewService
from .serializers import (
    ReviewSerializer,
    CreateReviewSerializer,
    UpdateReviewSerializer,
    VoteReviewSerializer,
    ReviewStatisticsSerializer,
)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for review operations.
    
    Endpoints:
    - GET /api/v1/reviews/ - List user's reviews
    - POST /api/v1/reviews/ - Create review
    - GET /api/v1/reviews/{id}/ - Get review detail
    - PATCH /api/v1/reviews/{id}/ - Update review
    - DELETE /api/v1/reviews/{id}/ - Delete review
    - POST /api/v1/reviews/{id}/vote/ - Vote on review
    - GET /api/v1/reviews/product/{product_id}/ - Get product reviews
    - GET /api/v1/reviews/product/{product_id}/statistics/ - Get product review stats
    """
    serializer_class = ReviewSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'product_reviews', 'statistics']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Review.objects.filter(
                user=self.request.user,
                is_deleted=False
            ).select_related('product', 'user').prefetch_related('images', 'reply')
        return Review.objects.none()
    
    def list(self, request):
        """List user's reviews."""
        if not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'Authentication required',
                'data': None
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        queryset = ReviewService.get_user_reviews(request.user)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'message': 'Reviews retrieved',
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a new review."""
        serializer = CreateReviewSerializer(data=request.data, context={'request': request})
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        product = serializer.context['product']
        
        review, message = ReviewService.create_review(
            product=product,
            user=request.user,
            rating=serializer.validated_data['rating'],
            content=serializer.validated_data['content'],
            title=serializer.validated_data.get('title', '')
        )
        
        if not review:
            return Response({
                'success': False,
                'message': message,
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'message': message,
            'data': ReviewSerializer(review, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        """Update a review."""
        review = self.get_object()
        
        if review.user != request.user:
            return Response({
                'success': False,
                'message': 'Permission denied',
                'data': None
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = UpdateReviewSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update fields
        for field, value in serializer.validated_data.items():
            setattr(review, field, value)
        
        review.status = Review.STATUS_PENDING  # Require re-moderation
        review.save()
        
        return Response({
            'success': True,
            'message': 'Review updated',
            'data': ReviewSerializer(review, context={'request': request}).data
        })
    
    def destroy(self, request, pk=None):
        """Delete a review."""
        review = self.get_object()
        
        if review.user != request.user and not request.user.is_staff:
            return Response({
                'success': False,
                'message': 'Permission denied',
                'data': None
            }, status=status.HTTP_403_FORBIDDEN)
        
        ReviewService.delete_review(review)
        
        return Response({
            'success': True,
            'message': 'Review deleted',
            'data': None
        })
    
    @action(detail=True, methods=['post'], url_path='vote')
    def vote(self, request, pk=None):
        """Vote on a review."""
        review = Review.objects.filter(
            id=pk,
            status=Review.STATUS_APPROVED,
            is_deleted=False
        ).first()
        
        if not review:
            return Response({
                'success': False,
                'message': 'Review not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = VoteReviewSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'data': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        success, message = ReviewService.vote_review(
            review=review,
            user=request.user,
            is_helpful=serializer.validated_data['is_helpful']
        )
        
        if not success:
            return Response({
                'success': False,
                'message': message,
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        review.refresh_from_db()
        
        return Response({
            'success': True,
            'message': message,
            'data': ReviewSerializer(review, context={'request': request}).data
        })
    
    @action(detail=False, methods=['get'], url_path='product/(?P<product_id>[^/.]+)')
    def product_reviews(self, request, product_id=None):
        """Get reviews for a product."""
        from apps.products.models import Product
        
        try:
            product = Product.objects.get(id=product_id, is_active=True, is_deleted=False)
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Product not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get ordering
        ordering = request.query_params.get('ordering', '-created_at')
        valid_orderings = ['-created_at', 'created_at', '-rating', 'rating', '-helpful_count']
        if ordering not in valid_orderings:
            ordering = '-created_at'
        
        # Get rating filter
        rating = request.query_params.get('rating')
        
        reviews = ReviewService.get_product_reviews(product, ordering=ordering)
        
        if rating:
            reviews = reviews.filter(rating=int(rating))
        
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = ReviewSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = ReviewSerializer(reviews, many=True, context={'request': request})
        
        return Response({
            'success': True,
            'message': 'Reviews retrieved',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='product/(?P<product_id>[^/.]+)/statistics')
    def statistics(self, request, product_id=None):
        """Get review statistics for a product."""
        from apps.products.models import Product
        
        try:
            product = Product.objects.get(id=product_id, is_active=True, is_deleted=False)
        except Product.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Product not found',
                'data': None
            }, status=status.HTTP_404_NOT_FOUND)
        
        stats = ReviewService.get_review_statistics(product)
        
        # Check if user can review
        can_review = False
        can_review_reason = ''
        if request.user.is_authenticated:
            can_review, can_review_reason = ReviewService.can_review(product, request.user)
        
        stats['can_review'] = can_review
        stats['can_review_reason'] = can_review_reason
        
        return Response({
            'success': True,
            'message': 'Statistics retrieved',
            'data': stats
        })

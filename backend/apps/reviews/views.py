# apps/reviews/views.py
"""
Review views.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count

from .models import Review, ReviewResponse
from .serializers import (
    ReviewListSerializer,
    ReviewDetailSerializer,
    ReviewCreateSerializer,
    ReviewUpdateSerializer,
    ReviewVoteSerializer,
    ReviewResponseCreateSerializer,
)


class ProductReviewsView(ListAPIView):
    """List reviews for a product."""
    
    serializer_class = ReviewListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        queryset = Review.objects.filter(
            product_id=product_id,
            status=Review.Status.APPROVED
        ).select_related('user').prefetch_related('images', 'response')
        
        # Sort options
        sort = self.request.query_params.get('sort', '-created_at')
        if sort == 'helpful':
            queryset = queryset.order_by('-helpful_votes', '-created_at')
        elif sort == 'rating_high':
            queryset = queryset.order_by('-rating', '-created_at')
        elif sort == 'rating_low':
            queryset = queryset.order_by('rating', '-created_at')
        elif sort == 'oldest':
            queryset = queryset.order_by('created_at')
        else:
            queryset = queryset.order_by('-created_at')
        
        # Filter by rating
        rating = self.request.query_params.get('rating')
        if rating:
            queryset = queryset.filter(rating=int(rating))
        
        # Filter verified only
        verified = self.request.query_params.get('verified')
        if verified == 'true':
            queryset = queryset.filter(is_verified_purchase=True)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Get review stats
        stats = queryset.aggregate(
            avg_rating=Avg('rating'),
            total_reviews=Count('id'),
            five_star=Count('id', filter=models.Q(rating=5)),
            four_star=Count('id', filter=models.Q(rating=4)),
            three_star=Count('id', filter=models.Q(rating=3)),
            two_star=Count('id', filter=models.Q(rating=2)),
            one_star=Count('id', filter=models.Q(rating=1)),
        )
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            response.data['stats'] = stats
            return response
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Reviews retrieved',
            'data': serializer.data,
            'meta': {'stats': stats}
        })


class CreateReviewView(APIView):
    """Create a review for a product."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ReviewCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Review submitted for approval',
            'data': ReviewDetailSerializer(review).data,
            'meta': None
        }, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):
    """Get, update, or delete a review."""
    
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get(self, request, review_id):
        review = get_object_or_404(Review, id=review_id)
        serializer = ReviewDetailSerializer(review)
        
        return Response({
            'success': True,
            'message': 'Review retrieved',
            'data': serializer.data,
            'meta': None
        })
    
    def patch(self, request, review_id):
        review = get_object_or_404(Review, id=review_id, user=request.user)
        
        serializer = ReviewUpdateSerializer(
            review,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        
        # Reset status to pending for re-review
        review = serializer.save(status=Review.Status.PENDING)
        
        return Response({
            'success': True,
            'message': 'Review updated and submitted for re-approval',
            'data': ReviewDetailSerializer(review).data,
            'meta': None
        })
    
    def delete(self, request, review_id):
        review = get_object_or_404(Review, id=review_id, user=request.user)
        review.delete()
        
        return Response({
            'success': True,
            'message': 'Review deleted',
            'data': None,
            'meta': None
        })


class ReviewVoteView(APIView):
    """Vote on review helpfulness."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, review_id):
        review = get_object_or_404(Review, id=review_id)
        
        if review.user == request.user:
            return Response({
                'success': False,
                'message': 'You cannot vote on your own review',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ReviewVoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        is_helpful = serializer.validated_data['is_helpful']
        
        if is_helpful:
            review.mark_helpful(request.user)
        else:
            review.mark_not_helpful(request.user)
        
        return Response({
            'success': True,
            'message': 'Vote recorded',
            'data': {
                'helpful_votes': review.helpful_votes,
                'not_helpful_votes': review.not_helpful_votes
            },
            'meta': None
        })


class UserReviewsView(ListAPIView):
    """List user's own reviews."""
    
    serializer_class = ReviewDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Review.objects.filter(
            user=self.request.user
        ).select_related('product').prefetch_related('images')


# Admin views
class AdminReviewListView(ListAPIView):
    """Admin: List all reviews with filtering."""
    
    serializer_class = ReviewDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = Review.objects.all().select_related('user', 'product')
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by product
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        return queryset


class AdminReviewApproveView(APIView):
    """Admin: Approve or reject a review."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, review_id):
        review = get_object_or_404(Review, id=review_id)
        action = request.data.get('action')  # 'approve' or 'reject'
        notes = request.data.get('notes', '')
        
        if action == 'approve':
            review.status = Review.Status.APPROVED
            message = 'Review approved'
        elif action == 'reject':
            review.status = Review.Status.REJECTED
            message = 'Review rejected'
        else:
            return Response({
                'success': False,
                'message': 'Invalid action',
                'data': None,
                'meta': None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if notes:
            review.admin_notes = notes
        
        review.save()
        
        return Response({
            'success': True,
            'message': message,
            'data': ReviewDetailSerializer(review).data,
            'meta': None
        })


class AdminReviewRespondView(APIView):
    """Admin: Respond to a review."""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, review_id):
        review = get_object_or_404(Review, id=review_id)
        
        serializer = ReviewResponseCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create or update response
        response_obj, created = ReviewResponse.objects.update_or_create(
            review=review,
            defaults={
                'responder': request.user,
                'content': serializer.validated_data['content']
            }
        )
        
        return Response({
            'success': True,
            'message': 'Response added' if created else 'Response updated',
            'data': ReviewDetailSerializer(review).data,
            'meta': None
        })

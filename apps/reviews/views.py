# apps/reviews/views.py
"""
Review Views
"""
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count

from core.permissions import IsOwner
# Product accessed via review.product
from .models import Review, ReviewVote, ReviewReport
from .serializers import (
    ReviewSerializer, ReviewListSerializer, CreateReviewSerializer,
    ReviewVoteSerializer, ReviewReportSerializer, AdminReviewSerializer
)


class ProductReviewViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Product reviews - public access.
    """
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ReviewListSerializer
        return ReviewSerializer
    
    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(
            product_id=product_id,
            status=Review.Status.APPROVED,
            is_deleted=False
        ).select_related('user').prefetch_related('images')
    
    @action(detail=False, methods=['get'])
    def stats(self, request, product_id=None):
        """Get review statistics for a product."""
        reviews = Review.objects.filter(
            product_id=product_id,
            status=Review.Status.APPROVED,
            is_deleted=False
        )
        
        stats = reviews.aggregate(
            average_rating=Avg('rating'),
            total_reviews=Count('id')
        )
        
        # Rating distribution
        distribution = {}
        for i in range(1, 6):
            distribution[str(i)] = reviews.filter(rating=i).count()
        
        # Verified purchase percentage
        verified_count = reviews.filter(is_verified_purchase=True).count()
        total = stats['total_reviews'] or 1
        verified_percentage = (verified_count / total) * 100
        
        return Response({
            'average_rating': stats['average_rating'] or 0,
            'total_reviews': stats['total_reviews'],
            'rating_distribution': distribution,
            'verified_purchase_percentage': round(verified_percentage, 2)
        })


class MyReviewViewSet(viewsets.ModelViewSet):
    """
    User's own reviews.
    """
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateReviewSerializer
        return ReviewSerializer
    
    def get_queryset(self):
        return Review.objects.filter(
            user=self.request.user,
            is_deleted=False
        )
    
    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        
        # Check for verified purchase
        from apps.orders.models import OrderItem, Order
        is_verified = OrderItem.objects.filter(
            order__user=self.request.user,
            order__status=Order.Status.DELIVERED,
            product=product
        ).exists()
        
        serializer.save(
            user=self.request.user,
            is_verified_purchase=is_verified
        )


class ReviewVoteView(generics.CreateAPIView):
    """
    Vote on a review (helpful/not helpful).
    """
    serializer_class = ReviewVoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, review_id):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        review = get_object_or_404(Review, pk=review_id, status=Review.Status.APPROVED)
        
        vote, created = ReviewVote.objects.update_or_create(
            review=review,
            user=request.user,
            defaults={'is_helpful': serializer.validated_data['is_helpful']}
        )
        
        return Response({
            'message': 'Vote recorded',
            'helpful_count': review.helpful_count,
            'not_helpful_count': review.not_helpful_count
        })
    
    def delete(self, request, review_id):
        """Remove vote."""
        ReviewVote.objects.filter(
            review_id=review_id,
            user=request.user
        ).delete()
        
        return Response({'message': 'Vote removed'})


class ReviewReportView(generics.CreateAPIView):
    """
    Report a review.
    """
    serializer_class = ReviewReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)


class AdminReviewViewSet(viewsets.ModelViewSet):
    """
    Admin review management.
    """
    serializer_class = AdminReviewSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Review.all_objects.all()  # Include deleted
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a review."""
        review = self.get_object()
        review.approve()
        return Response({
            'message': 'Review approved',
            'review': AdminReviewSerializer(review).data
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a review."""
        review = self.get_object()
        note = request.data.get('note', '')
        review.reject(note)
        return Response({
            'message': 'Review rejected',
            'review': AdminReviewSerializer(review).data
        })
    
    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        """Add admin response to review."""
        from django.utils import timezone
        review = self.get_object()
        review.admin_response = request.data.get('response', '')
        review.admin_response_at = timezone.now()
        review.save()
        return Response({
            'message': 'Response added',
            'review': AdminReviewSerializer(review).data
        })
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending reviews."""
        reviews = Review.objects.filter(status=Review.Status.PENDING)
        return Response(AdminReviewSerializer(reviews, many=True).data)
    
    @action(detail=False, methods=['get'])
    def reported(self, request):
        """Get reported reviews."""
        reported_ids = ReviewReport.objects.filter(
            status=ReviewReport.Status.PENDING
        ).values_list('review_id', flat=True)
        
        reviews = Review.objects.filter(id__in=reported_ids)
        return Response(AdminReviewSerializer(reviews, many=True).data)

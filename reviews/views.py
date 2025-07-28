# reviews/views.py
from django.views import View
from django.shortcuts import redirect, get_object_or_404, render
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .pagination import ReviewPagination
from .forms import ReviewForm
from .services import submit_review, vote_review, flag_review, get_review_summary
from .selectors import get_approved_reviews, get_review_by_id, get_product_review_stats
from .serializers import ReviewSerializer, ReviewImageSerializer
from products.models import Product
from django.core.exceptions import ValidationError as DjangoValidationError

# --- Traditional Django View for Form Submission (if still needed) ---
@method_decorator(login_required, name='dispatch')
class SubmitReviewView(View):
    """
    Traditional Django view to handle HTML form submission for reviews.
    Redirects back to product detail page with messages.
    """
    def post(self, request, product_id):
        product = get_object_or_404(Product, pk=product_id)
        form = ReviewForm(request.POST, request.FILES)

        if form.is_valid():
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            ip_address = request.META.get('REMOTE_ADDR', '')
            try:
                submit_review(
                    request.user,
                    product.pk, # Pass product ID instead of object
                    form.cleaned_data['rating'],
                    form.cleaned_data['comment'],
                    images=form.cleaned_data['images'],
                    user_agent=user_agent,
                    ip_address=ip_address
                )
                messages.success(request, "Your review has been submitted successfully and is awaiting moderation.")
            except DjangoValidationError as e:
                messages.error(request, f"Review submission failed: {e.message}")
            except Product.DoesNotExist:
                messages.error(request, "Review submission failed: Product not found.")
            except Exception as e:
                messages.error(request, f"An unexpected error occurred during review submission: {e}")
        else:
            # Iterate through form errors and add them as messages
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"Error in {field}: {error}")

        return redirect('products:product_detail', category_slug=product.category.slug, product_slug=product.slug) # Adjust redirect based on your actual product URL structure

# --- REST Framework API Views ---

# ReviewPagination class is now in reviews/pagination.py

class ReviewListAPI(generics.ListAPIView):
    """
    API endpoint to list approved reviews for a specific product.
    Supports pagination.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = ReviewPagination

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        # Use selector for approved reviews with potential ordering
        return get_approved_reviews(product_id)

class ReviewCreateAPI(APIView):
    """
    API endpoint for authenticated users to submit a new review.
    Handles both JSON data and multipart/form-data for images.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        form = ReviewForm(request.POST, request.FILES) # Use Django form for initial validation

        if form.is_valid():
            try:
                user_agent = request.META.get('HTTP_USER_AGENT', '')
                ip_address = request.META.get('REMOTE_ADDR', '')

                review = submit_review(
                    request.user,
                    product_id,
                    form.cleaned_data['rating'],
                    form.cleaned_data['comment'],
                    images=form.cleaned_data['images'],
                    user_agent=user_agent,
                    ip_address=ip_address
                )
                serializer = ReviewSerializer(review, context={'request': request})
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DjangoValidationError as e:
                return Response({'detail': e.message}, status=status.HTTP_400_BAD_REQUEST)
            except Product.DoesNotExist:
                return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                # Log the exception for debugging
                return Response({'detail': f"An unexpected error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDetailAPI(APIView):
    """
    API endpoint to retrieve a single approved review by ID.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            review = get_review_by_id(pk)
            serializer = ReviewSerializer(review, context={'request': request})
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response({'detail': 'Review not found or not approved.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': f"An unexpected error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VoteAPI(APIView):
    """
    API endpoint for users to vote on a review (helpful/not helpful).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        is_helpful = request.data.get('helpful', True)
        try:
            helpful_count, not_helpful_count = vote_review(request.user, pk, is_helpful)
            # Fetch the updated review to send back full review data
            updated_review = get_review_by_id(pk)
            serializer = ReviewSerializer(updated_review, context={'request':request})
            return Response(serializer.data) # Send back the entire review to update UI
        except DjangoValidationError as e:
            return Response({'detail': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Review.DoesNotExist:
            return Response({'detail': 'Review not found or not approved.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': f"An unexpected error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FlagAPI(APIView):
    """
    API endpoint for users to flag a review.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        reason = request.data.get('reason', '')
        try:
            flag_count = flag_review(request.user, pk, reason)
            # Fetch the updated review to send back full review data
            updated_review = get_review_by_id(pk)
            serializer = ReviewSerializer(updated_review, context={'request':request})
            return Response(serializer.data) # Send back the entire review to update UI
        except DjangoValidationError as e:
            return Response({'detail': e.message}, status=status.HTTP_400_BAD_REQUEST)
        except Review.DoesNotExist:
            return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': f"An unexpected error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SummaryAPI(APIView):
    """
    API endpoint to retrieve product review summary statistics.
    """
    permission_classes = [permissions.AllowAny]
    def get(self, request, product_id):
        try:
            summary = get_review_summary(product_id)
            return Response(summary)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': f"An unexpected error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

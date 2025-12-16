"""
FAQ Services
"""
from django.db.models import Q, F
from django.utils import timezone
from django.core.cache import cache

from .models import FAQCategory, FAQQuestion, FAQFeedback, FAQSearch, FAQSuggestion


class FAQService:
    """Service for FAQ operations."""
    
    CACHE_TIMEOUT = 3600
    
    @staticmethod
    def get_active_categories():
        """Get all active FAQ categories."""
        cache_key = 'faq_active_categories'
        categories = cache.get(cache_key)
        
        if categories is None:
            categories = list(
                FAQCategory.objects.filter(is_active=True)
                .prefetch_related('questions')
            )
            cache.set(cache_key, categories, FAQService.CACHE_TIMEOUT)
        
        return categories
    
    @staticmethod
    def get_category(slug):
        """Get a category by slug."""
        return FAQCategory.objects.filter(slug=slug, is_active=True).first()
    
    @staticmethod
    def get_category_questions(category_slug):
        """Get questions for a category."""
        return FAQQuestion.objects.filter(
            category__slug=category_slug,
            category__is_active=True,
            is_active=True
        ).order_by('order', 'question')
    
    @staticmethod
    def get_featured_questions(limit=5):
        """Get featured FAQ questions."""
        cache_key = f'faq_featured_{limit}'
        questions = cache.get(cache_key)
        
        if questions is None:
            questions = list(
                FAQQuestion.objects.filter(is_featured=True, is_active=True)
                .select_related('category')
                .order_by('order')[:limit]
            )
            cache.set(cache_key, questions, FAQService.CACHE_TIMEOUT)
        
        return questions
    
    @staticmethod
    def get_popular_questions(limit=10):
        """Get most viewed questions."""
        return FAQQuestion.objects.filter(is_active=True).select_related(
            'category'
        ).order_by('-view_count')[:limit]
    
    @staticmethod
    def get_question(category_slug, question_slug):
        """Get a specific question."""
        return FAQQuestion.objects.filter(
            category__slug=category_slug,
            slug=question_slug,
            is_active=True
        ).select_related('category').first()
    
    @staticmethod
    def get_question_by_id(question_id):
        """Get question by ID."""
        return FAQQuestion.objects.filter(
            id=question_id,
            is_active=True
        ).select_related('category').first()
    
    @staticmethod
    def increment_view_count(question_id):
        """Increment view count for a question."""
        FAQQuestion.objects.filter(id=question_id).update(view_count=F('view_count') + 1)
    
    @staticmethod
    def search_questions(query, category_slug=None, limit=20):
        """Search FAQ questions."""
        qs = FAQQuestion.objects.filter(is_active=True).select_related('category')
        
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        
        # Search in question and answer
        qs = qs.filter(
            Q(question__icontains=query) | Q(answer__icontains=query)
        )
        
        return qs[:limit]


class FAQFeedbackService:
    """Service for FAQ feedback."""
    
    @staticmethod
    def submit_feedback(question_id, feedback_type, user=None, session_key='', comment=''):
        """Submit feedback for a question."""
        question = FAQQuestion.objects.filter(id=question_id, is_active=True).first()
        if not question:
            return None
        
        # Check if user/session already submitted feedback
        existing = FAQFeedback.objects.filter(question=question)
        if user:
            existing = existing.filter(user=user)
        elif session_key:
            existing = existing.filter(session_key=session_key)
        else:
            # Allow feedback without tracking
            pass
        
        if existing.exists():
            # Update existing feedback
            feedback = existing.first()
            old_type = feedback.feedback_type
            
            if old_type != feedback_type:
                # Update counts
                if old_type == 'helpful':
                    question.helpful_count = max(0, question.helpful_count - 1)
                else:
                    question.not_helpful_count = max(0, question.not_helpful_count - 1)
                
                if feedback_type == 'helpful':
                    question.helpful_count += 1
                else:
                    question.not_helpful_count += 1
                
                question.save(update_fields=['helpful_count', 'not_helpful_count'])
                
                feedback.feedback_type = feedback_type
                feedback.comment = comment
                feedback.save()
        else:
            # Create new feedback
            feedback = FAQFeedback.objects.create(
                question=question,
                user=user if user and user.is_authenticated else None,
                session_key=session_key,
                feedback_type=feedback_type,
                comment=comment
            )
            
            # Update question counts
            if feedback_type == 'helpful':
                question.helpful_count += 1
            else:
                question.not_helpful_count += 1
            question.save(update_fields=['helpful_count', 'not_helpful_count'])
        
        return feedback
    
    @staticmethod
    def get_user_feedback(question_id, user=None, session_key=''):
        """Get user's feedback for a question."""
        qs = FAQFeedback.objects.filter(question_id=question_id)
        
        if user and user.is_authenticated:
            return qs.filter(user=user).first()
        elif session_key:
            return qs.filter(session_key=session_key).first()
        
        return None


class FAQSearchService:
    """Service for FAQ search tracking."""
    
    @staticmethod
    def log_search(query, results_count, user=None, session_key=''):
        """Log a search query."""
        return FAQSearch.objects.create(
            query=query[:255],
            results_count=results_count,
            user=user if user and user.is_authenticated else None,
            session_key=session_key
        )
    
    @staticmethod
    def log_search_click(search_id, question_id):
        """Log that a user clicked on a search result."""
        FAQSearch.objects.filter(id=search_id).update(clicked_result_id=question_id)
    
    @staticmethod
    def get_popular_searches(limit=10, days=30):
        """Get popular search queries."""
        from django.db.models import Count
        from datetime import timedelta
        
        cutoff = timezone.now() - timedelta(days=days)
        
        return FAQSearch.objects.filter(
            created_at__gte=cutoff
        ).values('query').annotate(
            count=Count('id')
        ).order_by('-count')[:limit]
    
    @staticmethod
    def get_zero_result_searches(limit=20, days=30):
        """Get searches with zero results (content gaps)."""
        from django.db.models import Count
        from datetime import timedelta
        
        cutoff = timezone.now() - timedelta(days=days)
        
        return FAQSearch.objects.filter(
            created_at__gte=cutoff,
            results_count=0
        ).values('query').annotate(
            count=Count('id')
        ).order_by('-count')[:limit]


class FAQSuggestionService:
    """Service for FAQ suggestions."""
    
    @staticmethod
    def create_suggestion(question, user=None, email='', answer='', category=None):
        """Create a new FAQ suggestion."""
        return FAQSuggestion.objects.create(
            user=user if user and user.is_authenticated else None,
            email=email,
            suggested_question=question,
            suggested_answer=answer,
            category=category
        )
    
    @staticmethod
    def get_pending_suggestions():
        """Get pending suggestions for review."""
        return FAQSuggestion.objects.filter(status='pending').order_by('-created_at')
    
    @staticmethod
    def approve_suggestion(suggestion_id, admin_user, notes=''):
        """Approve a suggestion."""
        suggestion = FAQSuggestion.objects.filter(id=suggestion_id).first()
        if not suggestion:
            return None
        
        suggestion.status = 'approved'
        suggestion.admin_notes = notes
        suggestion.reviewed_at = timezone.now()
        suggestion.reviewed_by = admin_user
        suggestion.save()
        
        return suggestion
    
    @staticmethod
    def reject_suggestion(suggestion_id, admin_user, notes=''):
        """Reject a suggestion."""
        suggestion = FAQSuggestion.objects.filter(id=suggestion_id).first()
        if not suggestion:
            return None
        
        suggestion.status = 'rejected'
        suggestion.admin_notes = notes
        suggestion.reviewed_at = timezone.now()
        suggestion.reviewed_by = admin_user
        suggestion.save()
        
        return suggestion
    
    @staticmethod
    def publish_suggestion(suggestion_id, category, answer, admin_user):
        """Publish a suggestion as an FAQ question."""
        suggestion = FAQSuggestion.objects.filter(id=suggestion_id).first()
        if not suggestion:
            return None
        
        # Create the FAQ question
        question = FAQQuestion.objects.create(
            category=category,
            question=suggestion.suggested_question,
            answer=answer,
            is_active=True
        )
        
        suggestion.status = 'published'
        suggestion.published_question = question
        suggestion.reviewed_at = timezone.now()
        suggestion.reviewed_by = admin_user
        suggestion.save()
        
        # Clear cache
        cache.delete('faq_active_categories')
        
        return question

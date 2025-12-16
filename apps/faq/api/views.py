"""
FAQ API Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from ..models import FAQCategory, FAQQuestion
from ..services import FAQService, FAQFeedbackService, FAQSearchService, FAQSuggestionService
from .serializers import (
    FAQCategoryListSerializer, FAQCategoryDetailSerializer,
    FAQQuestionListSerializer, FAQQuestionDetailSerializer,
    FAQFeedbackSerializer, FAQSearchSerializer,
    FAQSuggestionCreateSerializer, FAQSuggestionSerializer
)


class FAQCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for FAQ categories."""
    
    queryset = FAQCategory.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FAQCategoryDetailSerializer
        return FAQCategoryListSerializer
    
    def list(self, request):
        """List all FAQ categories."""
        categories = FAQService.get_active_categories()
        serializer = FAQCategoryListSerializer(categories, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def retrieve(self, request, slug=None):
        """Get category with its questions."""
        category = FAQService.get_category(slug)
        if not category:
            return Response({
                'success': False,
                'message': 'Category not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = FAQCategoryDetailSerializer(category)
        return Response({
            'success': True,
            'data': serializer.data
        })


class FAQQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for FAQ questions."""
    
    queryset = FAQQuestion.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FAQQuestionDetailSerializer
        return FAQQuestionListSerializer
    
    def list(self, request):
        """List FAQ questions."""
        category_slug = request.query_params.get('category')
        
        if category_slug:
            questions = FAQService.get_category_questions(category_slug)
        else:
            questions = self.get_queryset().select_related('category').order_by('category', 'order')
        
        serializer = self.get_serializer(questions, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def retrieve(self, request, pk=None):
        """Get a specific question and increment view count."""
        question = FAQService.get_question_by_id(pk)
        if not question:
            return Response({
                'success': False,
                'message': 'Question not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Increment view count
        FAQService.increment_view_count(pk)
        
        serializer = FAQQuestionDetailSerializer(question)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured questions."""
        limit = int(request.query_params.get('limit', 5))
        questions = FAQService.get_featured_questions(limit=limit)
        serializer = FAQQuestionListSerializer(questions, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular questions."""
        limit = int(request.query_params.get('limit', 10))
        questions = FAQService.get_popular_questions(limit=limit)
        serializer = FAQQuestionListSerializer(questions, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })


class FAQSearchView(APIView):
    """View for FAQ search."""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Search FAQ questions."""
        serializer = FAQSearchSerializer(data=request.query_params)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid search parameters',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        query = serializer.validated_data['query']
        category = serializer.validated_data.get('category')
        
        questions = FAQService.search_questions(query, category_slug=category)
        results_count = len(questions)
        
        # Log search
        session_key = request.session.session_key or ''
        search_log = FAQSearchService.log_search(
            query=query,
            results_count=results_count,
            user=request.user if request.user.is_authenticated else None,
            session_key=session_key
        )
        
        question_serializer = FAQQuestionListSerializer(questions, many=True)
        
        return Response({
            'success': True,
            'data': {
                'query': query,
                'results': question_serializer.data,
                'count': results_count,
                'search_id': str(search_log.id)
            }
        })


class FAQSearchClickView(APIView):
    """View to log search result clicks."""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Log that a search result was clicked."""
        search_id = request.data.get('search_id')
        question_id = request.data.get('question_id')
        
        if not search_id or not question_id:
            return Response({
                'success': False,
                'message': 'search_id and question_id are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        FAQSearchService.log_search_click(search_id, question_id)
        
        return Response({
            'success': True,
            'message': 'Click logged'
        })


class FAQFeedbackView(APIView):
    """View for FAQ feedback."""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get user's feedback for a question."""
        question_id = request.query_params.get('question_id')
        
        if not question_id:
            return Response({
                'success': False,
                'message': 'question_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        session_key = request.session.session_key or ''
        feedback = FAQFeedbackService.get_user_feedback(
            question_id,
            user=request.user if request.user.is_authenticated else None,
            session_key=session_key
        )
        
        if feedback:
            return Response({
                'success': True,
                'data': {
                    'feedback_type': feedback.feedback_type
                }
            })
        
        return Response({
            'success': True,
            'data': None
        })
    
    def post(self, request):
        """Submit feedback for a question."""
        serializer = FAQFeedbackSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        session_key = request.session.session_key or ''
        
        feedback = FAQFeedbackService.submit_feedback(
            question_id=data['question_id'],
            feedback_type=data['feedback_type'],
            user=request.user if request.user.is_authenticated else None,
            session_key=session_key,
            comment=data.get('comment', '')
        )
        
        if not feedback:
            return Response({
                'success': False,
                'message': 'Question not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'message': 'Thank you for your feedback!'
        })


class FAQSuggestionView(APIView):
    """View for FAQ suggestions."""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Submit a new FAQ suggestion."""
        serializer = FAQSuggestionCreateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        category = None
        if data.get('category_id'):
            category = FAQCategory.objects.filter(id=data['category_id']).first()
        
        suggestion = FAQSuggestionService.create_suggestion(
            question=data['question'],
            user=request.user if request.user.is_authenticated else None,
            email=data.get('email', ''),
            answer=data.get('answer', ''),
            category=category
        )
        
        return Response({
            'success': True,
            'message': 'Thank you for your suggestion! We will review it shortly.',
            'data': FAQSuggestionSerializer(suggestion).data
        }, status=status.HTTP_201_CREATED)


class PopularSearchesView(APIView):
    """View for popular FAQ searches."""
    
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get popular search queries."""
        limit = int(request.query_params.get('limit', 10))
        days = int(request.query_params.get('days', 30))
        
        searches = FAQSearchService.get_popular_searches(limit=limit, days=days)
        
        return Response({
            'success': True,
            'data': list(searches)
        })

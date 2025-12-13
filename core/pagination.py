# core/pagination.py
"""
Bunoraa Pagination Classes
Custom pagination for REST API responses.
"""
from rest_framework.pagination import PageNumberPagination, CursorPagination
from rest_framework.response import Response


class StandardResultsPagination(PageNumberPagination):
    """
    Standard page number pagination with customizable page size.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'page_size': self.get_page_size(self.request),
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })


class LargeResultsPagination(PageNumberPagination):
    """
    Pagination for large result sets.
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200
    
    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'page_size': self.get_page_size(self.request),
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })


class SmallResultsPagination(PageNumberPagination):
    """
    Pagination for small result sets (reviews, comments, etc.).
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
    
    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'page_size': self.get_page_size(self.request),
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })


class ProductCursorPagination(CursorPagination):
    """
    Cursor-based pagination for infinite scroll on product listings.
    More efficient for large datasets and real-time updates.
    """
    page_size = 24
    ordering = '-created_at'
    cursor_query_param = 'cursor'
    
    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })


class ReviewPagination(PageNumberPagination):
    """
    Pagination specifically for reviews.
    """
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 20
    
    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'count': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'page_size': self.get_page_size(self.request),
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })


class NotificationPagination(PageNumberPagination):
    """
    Pagination for notifications.
    """
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 50
    
    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'count': self.page.paginator.count,
                'unread_count': getattr(self, 'unread_count', 0),
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })

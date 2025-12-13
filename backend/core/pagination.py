# core/pagination.py
"""
Custom pagination classes for the API.
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination class with customizable page size.
    """
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Data retrieved successfully',
            'data': data,
            'meta': {
                'pagination': {
                    'count': self.page.paginator.count,
                    'page': self.page.number,
                    'pages': self.page.paginator.num_pages,
                    'page_size': self.get_page_size(self.request),
                    'next': self.get_next_link(),
                    'previous': self.get_previous_link(),
                }
            }
        })


class LargeResultsSetPagination(PageNumberPagination):
    """
    Pagination for large datasets.
    """
    page_size = 50
    page_size_query_param = 'limit'
    max_page_size = 200
    
    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Data retrieved successfully',
            'data': data,
            'meta': {
                'pagination': {
                    'count': self.page.paginator.count,
                    'page': self.page.number,
                    'pages': self.page.paginator.num_pages,
                    'page_size': self.get_page_size(self.request),
                    'next': self.get_next_link(),
                    'previous': self.get_previous_link(),
                }
            }
        })


class SmallResultsSetPagination(PageNumberPagination):
    """
    Pagination for small datasets.
    """
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 50
    
    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Data retrieved successfully',
            'data': data,
            'meta': {
                'pagination': {
                    'count': self.page.paginator.count,
                    'page': self.page.number,
                    'pages': self.page.paginator.num_pages,
                    'page_size': self.get_page_size(self.request),
                    'next': self.get_next_link(),
                    'previous': self.get_previous_link(),
                }
            }
        })

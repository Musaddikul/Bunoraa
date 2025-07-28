# reviews/pagination.py
from rest_framework import pagination

class ReviewPagination(pagination.PageNumberPagination):
    """
    Custom pagination for review lists.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

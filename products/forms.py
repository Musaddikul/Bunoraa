# products/forms.py
from django import forms
from django_filters import FilterSet, NumberFilter, ModelMultipleChoiceFilter
from .models import Product, Category


class ProductFilterForm(forms.Form):
    SORT_CHOICES = [
        ('', 'Default Sorting'),
        ('price_asc', 'Price: Low to High'),
        ('price_desc', 'Price: High to Low'),
        ('newest', 'Newest Arrivals'),
        ('popular', 'Most Popular'),
        ('rating', 'Highest Rated'),
    ]
    
    min_price = forms.DecimalField(
        required=False,
        widget=forms.NumberInput(attrs={
            'placeholder': 'Min',
            'class': 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500',
            'min': 0,
            'step': '0.01',
            'data-ajax-filter': 'true',  # AJAX filtering hook
        }),
        label='Minimum Price'
    )
    
    max_price = forms.DecimalField(
        required=False,
        widget=forms.NumberInput(attrs={
            'placeholder': 'Max',
            'class': 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500',
            'min': 0,
            'step': '0.01',
            'data-ajax-filter': 'true',  # AJAX filtering hook
        }),
        label='Maximum Price'
    )
    
    sort_by = forms.ChoiceField(
        choices=SORT_CHOICES,
        required=False,
        widget=forms.Select(attrs={
            'class': 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500',
            'data-ajax-filter': 'true',  # AJAX filtering hook
        }),
        label='Sort By'
    )


class ProductFilter(FilterSet):
    price = NumberFilter(
        field_name='price',
        lookup_expr='lte',
        widget=forms.NumberInput(attrs={
            'class': 'w-full px-3 py-2 border border-gray-300 rounded-md',
            'placeholder': 'Max price',
            'data-ajax-filter': 'true',
        })
    )
    
    categories = ModelMultipleChoiceFilter(
        field_name='category',
        queryset=Category.objects.filter(active=True),
        widget=forms.CheckboxSelectMultiple(attrs={
            'class': 'space-y-2',
            'data-ajax-filter': 'true',
        }),
        label='Categories'
    )
    
    class Meta:
        model = Product
        fields = ['category', 'price']

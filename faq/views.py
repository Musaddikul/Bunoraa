# faq/views.py
from django.views import View
from django.views.generic import ListView, DetailView, FormView, TemplateView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.http import JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FAQ
from .forms import FAQSearchForm, FAQRequestForm
from .selectors import get_categories, get_faqs, search_faqs, get_faq
from .serializers import FAQSerializer, FAQRequestSerializer
from .services import record_feedback, submit_request

class FAQListView(ListView):
    model               = FAQ
    template_name       = 'faq/list.html'
    context_object_name = 'faqs'
    paginate_by         = 20

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        return get_faqs(category_slug=slug, featured=self.request.GET.get('featured')=='1')

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['categories'] = get_categories()
        ctx['search_form'] = FAQSearchForm(self.request.GET)
        return ctx

class FAQSearchView(TemplateView):
    template_name = 'faq/partials/faq_list.html'
    def get(self, request, *args, **kwargs):
        form = FAQSearchForm(request.GET)
        faqs = form.is_valid() and search_faqs(form.cleaned_data['q'], form.cleaned_data['category']) or []
        return render(request, self.template_name, {'faqs': faqs})

class FAQDetailView(DetailView):
    model         = FAQ
    template_name = 'faq/detail.html'
    slug_field    = 'slug'

    def get_object(self):
        faq = get_faq(self.kwargs['slug'])
        faq.mark_viewed()
        return faq

class FAQRequestView(FormView):
    template_name = 'faq/request.html'
    form_class    = FAQRequestForm
    success_url   = reverse_lazy('faq:list')

    def form_valid(self, form):
        submit_request(form.cleaned_data['email'], form.cleaned_data['question_text'])
        return super().form_valid(form)

class FAQFeedbackAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            helpful, not_helpful = record_feedback(request.user, request.data['faq'], request.data['is_helpful'])
            return Response({'helpful_count': helpful, 'not_helpful_count': not_helpful})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FAQListAPI(generics.ListAPIView):
    queryset         = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

class FAQDetailAPI(generics.RetrieveAPIView):
    queryset         = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

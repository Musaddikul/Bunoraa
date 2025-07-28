# legal/views.py
from django.views import View
from django.views.generic import DetailView, ListView, FormView
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.contrib import messages
from django.http import JsonResponse, Http404
from rest_framework import generics, permissions
from .models import Policy
from .forms import SubscriberForm, UnsubscribeForm, PolicyAcceptanceForm
from .services import (
    subscribe_user, confirm_subscription, unsubscribe_user, record_acceptance
)
from .selectors import get_active_policy, get_policy_history, has_user_accepted
from .serializers import PolicySerializer, SubscriberSerializer

class PolicyListView(ListView):
    template_name = 'legal/policy_list.html'
    context_object_name = 'policies'
    def get_queryset(self):
        return Policy.objects.filter(is_active=True).order_by('policy_type','-version')

class PolicyDetailView(DetailView):
    model = Policy
    template_name = 'legal/policy_detail.html'
    slug_field = 'policy_type'
    slug_url_kwarg = 'slug'

    def get_object(self):
        policy = get_active_policy(self.kwargs['slug'], language=self.request.LANGUAGE_CODE)
        if not policy:
            raise Http404
        return policy

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        policy = ctx['policy']
        ctx['history'] = get_policy_history(policy.policy_type, policy.language)
        ctx['accepted'] = self.request.user.is_authenticated and has_user_accepted(self.request.user, policy)
        ctx['accept_form'] = PolicyAcceptanceForm(initial={'policy_id':policy.id,'version':policy.version})
        return ctx

class AcceptPolicyView(FormView):
    form_class = PolicyAcceptanceForm
    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid() and request.user.is_authenticated:
            pid = form.cleaned_data['policy_id']
            version = form.cleaned_data['version']
            policy = Policy.objects.get(pk=pid, version=version)
            record_acceptance(request.user, policy,
                              ip_address=request.META.get('REMOTE_ADDR'),
                              user_agent=request.META.get('HTTP_USER_AGENT',''))
            messages.success(request, "Policy accepted.")
        return redirect('legal:policy', slug=policy.policy_type)

class SubscribeView(FormView):
    form_class = SubscriberForm
    template_name = 'legal/subscribe.html'
    success_url = reverse_lazy('legal:policy_list')

    def form_valid(self, form):
        subscribe_user(form.cleaned_data['email'])
        messages.info(self.request, "Check your email to confirm subscription.")
        return super().form_valid(form)

class ConfirmSubscriptionView(View):
    def get(self, request):
        email = request.GET.get('email')
        token = request.GET.get('token')
        if confirm_subscription(email, token):
            messages.success(request, "Subscription confirmed.")
        else:
            messages.error(request, "Invalid confirmation link.")
        return redirect('legal:policy_list')

class UnsubscribeView(FormView):
    form_class = UnsubscribeForm
    template_name = 'legal/unsubscribe.html'
    success_url = reverse_lazy('legal:policy_list')

    def form_valid(self, form):
        if unsubscribe_user(form.cleaned_data['email'], form.cleaned_data['token']):
            messages.success(self.request, "You have been unsubscribed.")
        else:
            messages.error(self.request, "Invalid unsubscribe request.")
        return super().form_valid(form)

# REST APIs
class PolicyListAPI(generics.ListAPIView):
    queryset = Policy.objects.filter(is_active=True)
    serializer_class = PolicySerializer
    permission_classes = [permissions.AllowAny]

class PolicyDetailAPI(generics.RetrieveAPIView):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [permissions.AllowAny]

class SubscribeAPI(generics.CreateAPIView):
    serializer_class = SubscriberSerializer
    permission_classes = [permissions.AllowAny]
    def perform_create(self, serializer):
        sub = subscribe_user(serializer.validated_data['email'])
        serializer.instance = sub

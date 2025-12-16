"""
Account views - Frontend pages
"""
from django.shortcuts import redirect
from django.views.generic import TemplateView, View
from django.views.generic.edit import FormView
from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.urls import reverse_lazy
from django.conf import settings
from django.utils.http import url_has_allowed_host_and_scheme
from .services import UserService
from .forms import LoginForm, RegistrationForm


class AccountDashboardView(LoginRequiredMixin, TemplateView):
    """User account dashboard."""
    template_name = 'accounts/dashboard.html'
    login_url = '/account/login/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'My Account'
        return context


class ProfileView(LoginRequiredMixin, TemplateView):
    """User profile page."""
    template_name = 'accounts/profile.html'
    login_url = '/account/login/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'My Profile'
        return context


class AddressListView(LoginRequiredMixin, TemplateView):
    """User addresses page."""
    template_name = 'accounts/addresses.html'
    login_url = '/account/login/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'My Addresses'
        return context


class LoginView(FormView):
    """Login page."""
    template_name = 'accounts/login.html'
    form_class = LoginForm
    success_url = reverse_lazy('accounts:dashboard')

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            redirect_url = self._get_safe_next_url()
            return redirect(redirect_url or self.get_success_url())
        return super().dispatch(request, *args, **kwargs)

    def _get_safe_next_url(self):
        """Return a safe `next` parameter if provided."""
        next_url = self.request.POST.get('next') or self.request.GET.get('next')
        if not next_url:
            return None

        allowed_hosts = {self.request.get_host()}
        allowed_hosts.update(getattr(settings, 'ALLOWED_HOSTS', []))

        if url_has_allowed_host_and_scheme(next_url, allowed_hosts=allowed_hosts, require_https=self.request.is_secure()):
            return next_url
        return None

    def get_success_url(self):
        return self._get_safe_next_url() or super().get_success_url()

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Login'
        context['next'] = self.request.POST.get('next') or self.request.GET.get('next')
        return context

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)

        remember = form.cleaned_data.get('remember')
        if remember:
            self.request.session.set_expiry(60 * 60 * 24 * 30)
        else:
            self.request.session.set_expiry(0)

        messages.success(self.request, 'Welcome back! You are now logged in.')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'Unable to log in with the provided credentials.')
        return super().form_invalid(form)


class RegisterView(FormView):
    """Registration page."""
    template_name = 'accounts/register.html'
    form_class = RegistrationForm
    success_url = reverse_lazy('accounts:dashboard')

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('accounts:dashboard')
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Create Account'
        return context

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        messages.success(self.request, 'Welcome aboard! Your account is ready.')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'We could not create your account. Fix the issues below and try again.')
        return super().form_invalid(form)


class LogoutView(View):
    """Logout handler."""
    
    def get(self, request):
        logout(request)
        return redirect('home')
    
    def post(self, request):
        logout(request)
        return redirect('home')


class VerifyEmailView(View):
    """Email verification handler."""
    
    def get(self, request, token):
        user = UserService.verify_email(token)
        if user:
            messages.success(request, 'Your email has been verified successfully!')
            if request.user.is_authenticated:
                return redirect('accounts:dashboard')
            return redirect('accounts:login')
        messages.error(request, 'Invalid or expired verification link.')
        return redirect('home')


class ForgotPasswordView(TemplateView):
    """Forgot password page."""
    template_name = 'accounts/forgot_password.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Forgot Password'
        return context


class ResetPasswordView(TemplateView):
    """Reset password page."""
    template_name = 'accounts/reset_password.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['page_title'] = 'Reset Password'
        context['token'] = self.kwargs.get('token')
        return context

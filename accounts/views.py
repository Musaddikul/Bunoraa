# accounts/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from allauth.account.views import LoginView, SignupView, EmailVerificationSentView
from allauth.account.utils import complete_signup
from allauth.account import app_settings
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
import json

from .models import User, UserAddress, UserSettings # Import UserSettings
from locations.models import Division, District, Upazila
from locations.location_loader import load_json_file
from .forms import (
    UserProfileForm,
    UserAddressForm,
    CustomPasswordResetForm,
    CustomSetPasswordForm,
    CustomSignupForm,
    UserSettingsForm # Import UserSettingsForm
)

# Reusable context for location data
def location_context():
    return {
        'divisions_json': load_json_file('bd-divisions.json', 'divisions'),
        'districts_json': load_json_file('bd-districts.json', 'districts'),
        'upazilas_json': load_json_file('bd-upazilas.json', 'upazilas'),
    }

# ---------- Auth Views ----------

class CustomSignupView(SignupView):
    form_class = CustomSignupForm
    template_name = 'accounts/signup.html'
    success_url = reverse_lazy('accounts:email_verification_sent')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Create Account'
        return context

    def form_valid(self, form):
        self.request.session['account_verified_email'] = form.cleaned_data['email']
        response = super().form_valid(form)
        messages.success(self.request, "Account created successfully! Please check your email for verification.")
        return response

class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'
    success_url = reverse_lazy('accounts:profile')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Login'
        return context

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, f"Welcome back, {self.request.user.first_name}!")
        return response

class CustomPasswordResetView(auth_views.PasswordResetView):
    form_class = CustomPasswordResetForm
    template_name = 'accounts/password_reset.html'
    email_template_name = 'accounts/password_reset_email.html'
    subject_template_name = 'accounts/password_reset_subject.txt'
    success_url = reverse_lazy('accounts:password_reset_done')

    def form_valid(self, form):
        form.save(
            use_https=self.request.is_secure(),
            token_generator=default_token_generator,
            from_email=settings.DEFAULT_FROM_EMAIL,
            email_template_name=self.email_template_name,
            subject_template_name=self.subject_template_name,
            html_email_template_name='accounts/password_reset_email.html',
            request=self.request,
        )
        return super().form_valid(form)

class CustomPasswordResetConfirmView(auth_views.PasswordResetConfirmView):
    form_class = CustomSetPasswordForm
    template_name = 'accounts/password_reset_confirm.html'
    success_url = reverse_lazy('accounts:password_reset_complete')

class CustomEmailVerificationSentView(EmailVerificationSentView):
    template_name = 'accounts/email_verification_sent.html'


# ---------- Profile & Address Views ----------

@login_required
@require_http_methods(["GET", "POST"])
def profile(request):
    user = request.user
    profile_form = UserProfileForm(request.POST or None, request.FILES or None, instance=user)
    user_settings_instance, created = UserSettings.objects.get_or_create(user=user)
    settings_form = UserSettingsForm(request.POST or None, instance=user_settings_instance)

    if request.method == 'POST':
        if 'profile_submit' in request.POST: # Check if profile form was submitted
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, "Profile updated successfully.")
        elif 'settings_submit' in request.POST: # Check if settings form was submitted
            if settings_form.is_valid():
                settings_form.save()
                messages.success(request, "Settings updated successfully.")
        
        if request.htmx:
            response = render(request, 'accounts/partials/profile_section.html', {
                'profile_form': UserProfileForm(instance=user),
                'settings_form': UserSettingsForm(instance=user_settings_instance),
                'user': user,
                'addresses': user.addresses.all(),
            })
            response["HX-Trigger"] = "profileUpdated"
            return response
        return redirect('accounts:profile')

    template = 'accounts/partials/profile_section.html' if request.htmx else 'accounts/profile.html'
    return render(request, template, {
        'profile_form': profile_form,
        'settings_form': settings_form,
        'user': user,
        'addresses': user.addresses.all(),
    })

@login_required
@require_http_methods(["GET", "POST"])
def user_settings(request):
    user = request.user
    user_settings_instance, created = UserSettings.objects.get_or_create(user=user)
    form = UserSettingsForm(request.POST or None, instance=user_settings_instance)

    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, "Settings updated successfully.")
        return redirect('accounts:user_settings')

    return render(request, 'accounts/user_settings.html', {
        'form': form,
        'user_settings': user_settings_instance,
    })

@login_required
def add_address(request):
    if request.user.addresses.count() >= 4:
        messages.error(request, 'You can only have up to 4 addresses.')
        return redirect('accounts:profile')
    
    form = UserAddressForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        address = form.save(commit=False)
        address.user = request.user
        
        if form.cleaned_data.get('is_default'):
            UserAddress.objects.filter(user=request.user).update(is_default=False)
            address.is_default = True
        
        address.save()
        messages.success(request, 'Address saved successfully!')
        return redirect('accounts:profile')
    
    return render(request, 'accounts/add_address.html', {
        'form': form,
        **location_context(),
    })

@login_required
def edit_address(request, pk):
    address = get_object_or_404(UserAddress, pk=pk, user=request.user)

    form = UserAddressForm(request.POST or None, instance=address)
    
    if not request.POST:
        form.fields['division'].initial = address.state
        form.fields['district'].initial = address.city
        form.fields['upazila'].initial = address.upazila

    if request.method == 'POST' and form.is_valid():
        updated = form.save(commit=False)

        if form.cleaned_data.get('is_default'):
            UserAddress.objects.filter(user=request.user).update(is_default=False)
            updated.is_default = True

        updated.state = form.cleaned_data['division']
        updated.city = form.cleaned_data['district']
        updated.upazila = form.cleaned_data['upazila']
        
        updated.save()
        messages.success(request, 'Address updated successfully!')

        if request.htmx:
            html = render_to_string("accounts/partials/profile_section.html", {
                'profile_form': UserProfileForm(instance=request.user),
                'settings_form': UserSettingsForm(instance=user_settings_instance),
                'user': request.user,
                'addresses': request.user.addresses.all(),
            }, request=request)
            return HttpResponse(html)

        return redirect('accounts:profile')

    return render(request, 'accounts/edit_address.html', {
        'form': form,
        'title': 'Edit Shipping Address',
        **location_context(),
    })

@login_required
@require_http_methods(["POST"])
def delete_address(request, pk):
    address = get_object_or_404(UserAddress, pk=pk, user=request.user)
    address.delete()
    messages.success(request, 'Address deleted successfully!')
    
    if request.htmx:
        return HttpResponse('', status=204)
    
    return redirect('accounts:profile')

@login_required
@require_http_methods(["POST"])
def set_default_address(request, pk):
    address = get_object_or_404(UserAddress, pk=pk, user=request.user)
    UserAddress.objects.filter(user=request.user).update(is_default=False)
    address.is_default = True
    address.save()
    messages.success(request, 'Default address updated successfully!')
    return redirect('accounts:profile')

@login_required
def user_orders(request):
    from orders.models import Order # Import Order model here to avoid circular dependency
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'accounts/user_orders.html', {'orders': orders})

# ---------- Email Utility ----------

def send_verification_email(user, request):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_url = request.build_absolute_uri(
        reverse('account_confirm_email', args=[token])
    )
    subject = 'Verify your email address'
    message = f'Please click the link to verify your email: {verification_url}'
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)

# apps/accounts/views_web.py
"""
Account web views for template rendering.
Handles user authentication, profile, addresses, orders, and wishlist.
"""
from django.contrib import messages
from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.tokens import default_token_generator
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from django.views import View
from django.views.generic import ListView, TemplateView


class LoginView(TemplateView):
    """User login view."""
    
    template_name = 'accounts/login.html'
    
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('accounts:dashboard')
        return super().get(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['next'] = self.request.GET.get('next', '/')
        return context
    
    def post(self, request, *args, **kwargs):
        from django.contrib.auth import authenticate
        
        email = request.POST.get('email')
        password = request.POST.get('password')
        remember = request.POST.get('remember')
        next_url = request.POST.get('next', '/')
        
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            login(request, user)
            
            if not remember:
                request.session.set_expiry(0)
            
            messages.success(request, _('Welcome back, %(name)s!') % {'name': user.first_name or user.email})
            return redirect(next_url)
        else:
            messages.error(request, _('Invalid email or password.'))
            return render(request, self.template_name, {
                'form': {'email': {'value': email}},
                'next': next_url
            })


class RegisterView(TemplateView):
    """User registration view."""
    
    template_name = 'accounts/register.html'
    
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('accounts:dashboard')
        return super().get(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['next'] = self.request.GET.get('next', '/')
        return context
    
    def post(self, request, *args, **kwargs):
        from apps.accounts.models import User
        
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        subscribe = request.POST.get('subscribe')
        next_url = request.POST.get('next', '/')
        
        errors = {}
        
        # Validation
        if not first_name:
            errors['first_name'] = [_('First name is required.')]
        if not last_name:
            errors['last_name'] = [_('Last name is required.')]
        if not email:
            errors['email'] = [_('Email is required.')]
        elif User.objects.filter(email=email).exists():
            errors['email'] = [_('An account with this email already exists.')]
        if not password1:
            errors['password1'] = [_('Password is required.')]
        elif len(password1) < 8:
            errors['password1'] = [_('Password must be at least 8 characters.')]
        if password1 != password2:
            errors['password2'] = [_('Passwords do not match.')]
        
        if errors:
            return render(request, self.template_name, {
                'form': {
                    'first_name': {'value': first_name, 'errors': errors.get('first_name', [])},
                    'last_name': {'value': last_name, 'errors': errors.get('last_name', [])},
                    'email': {'value': email, 'errors': errors.get('email', [])},
                    'password1': {'errors': errors.get('password1', [])},
                    'password2': {'errors': errors.get('password2', [])},
                },
                'next': next_url
            })
        
        # Create user
        user = User.objects.create_user(
            email=email,
            password=password1,
            first_name=first_name,
            last_name=last_name,
        )
        
        # Set newsletter preference if exists
        if hasattr(user, 'newsletter_subscribed'):
            user.newsletter_subscribed = bool(subscribe)
            user.save(update_fields=['newsletter_subscribed'])
        
        login(request, user)
        messages.success(request, _('Welcome to Bunoraa! Your account has been created.'))
        return redirect(next_url)


class LogoutView(View):
    """User logout view."""
    
    def get(self, request, *args, **kwargs):
        logout(request)
        messages.success(request, _('You have been logged out.'))
        return redirect('storefront:home')
    
    def post(self, request, *args, **kwargs):
        return self.get(request, *args, **kwargs)


class PasswordResetView(TemplateView):
    """Password reset request view."""
    
    template_name = 'accounts/password_reset.html'
    
    def post(self, request, *args, **kwargs):
        from apps.accounts.models import User
        
        email = request.POST.get('email')
        
        try:
            user = User.objects.get(email=email)
            
            # Generate token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Build reset URL
            reset_url = request.build_absolute_uri(
                reverse('accounts:password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
            )
            
            # TODO: Send email
            # send_password_reset_email(user, reset_url)
            
        except User.DoesNotExist:
            pass  # Don't reveal if email exists
        
        return redirect('accounts:password_reset_done')


class PasswordResetDoneView(TemplateView):
    """Password reset email sent confirmation view."""
    
    template_name = 'accounts/password_reset_done.html'


class PasswordResetConfirmView(TemplateView):
    """Password reset confirmation view."""
    
    template_name = 'accounts/password_reset_confirm.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        from apps.accounts.models import User
        
        try:
            uid = force_str(urlsafe_base64_decode(kwargs['uidb64']))
            user = User.objects.get(pk=uid)
            token = kwargs['token']
            
            if default_token_generator.check_token(user, token):
                context['validlink'] = True
                context['user'] = user
            else:
                context['validlink'] = False
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            context['validlink'] = False
        
        return context
    
    def post(self, request, uidb64, token, *args, **kwargs):
        from apps.accounts.models import User
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if not default_token_generator.check_token(user, token):
                messages.error(request, _('Invalid or expired reset link.'))
                return redirect('accounts:password_reset')
            
            password1 = request.POST.get('new_password1')
            password2 = request.POST.get('new_password2')
            
            if password1 != password2:
                messages.error(request, _('Passwords do not match.'))
                return render(request, self.template_name, {
                    'validlink': True,
                    'form': {'new_password2': {'errors': [_('Passwords do not match.')]}}
                })
            
            if len(password1) < 8:
                messages.error(request, _('Password must be at least 8 characters.'))
                return render(request, self.template_name, {
                    'validlink': True,
                    'form': {'new_password1': {'errors': [_('Password must be at least 8 characters.')]}}
                })
            
            user.set_password(password1)
            user.save()
            
            return redirect('accounts:password_reset_complete')
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            messages.error(request, _('Invalid reset link.'))
            return redirect('accounts:password_reset')


class PasswordResetCompleteView(TemplateView):
    """Password reset complete view."""
    
    template_name = 'accounts/password_reset_complete.html'


class DashboardView(LoginRequiredMixin, TemplateView):
    """User dashboard view."""
    
    template_name = 'accounts/dashboard.html'
    login_url = 'accounts:login'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Get recent orders
        try:
            from apps.orders.models import Order
            context['recent_orders'] = Order.objects.filter(
                user=user
            ).order_by('-created_at')[:5]
            context['order_count'] = Order.objects.filter(user=user).count()
        except Exception:
            context['recent_orders'] = []
            context['order_count'] = 0
        
        # Get default address
        try:
            from apps.accounts.models import Address
            context['default_address'] = Address.objects.filter(
                user=user, is_default=True
            ).first()
        except Exception:
            context['default_address'] = None
        
        # Get wishlist count
        try:
            from apps.wishlist.models import WishlistItem
            context['wishlist_count'] = WishlistItem.objects.filter(user=user).count()
        except Exception:
            context['wishlist_count'] = 0
        
        return context


class ProfileView(LoginRequiredMixin, TemplateView):
    """User profile view."""
    
    template_name = 'accounts/profile.html'
    login_url = 'accounts:login'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
    
    def post(self, request, *args, **kwargs):
        user = request.user
        form_type = request.POST.get('form_type')
        
        if form_type == 'profile':
            user.first_name = request.POST.get('first_name', user.first_name)
            user.last_name = request.POST.get('last_name', user.last_name)
            
            # Update email if changed
            new_email = request.POST.get('email', user.email)
            if new_email != user.email:
                from apps.accounts.models import User
                if User.objects.filter(email=new_email).exclude(pk=user.pk).exists():
                    messages.error(request, _('This email is already in use.'))
                    return redirect('accounts:profile')
                user.email = new_email
            
            # Update optional fields
            if hasattr(user, 'phone'):
                user.phone = request.POST.get('phone', '')
            if hasattr(user, 'date_of_birth'):
                dob = request.POST.get('date_of_birth')
                user.date_of_birth = dob if dob else None
            
            user.save()
            messages.success(request, _('Profile updated successfully.'))
        
        elif form_type == 'preferences':
            if hasattr(user, 'newsletter_subscribed'):
                user.newsletter_subscribed = bool(request.POST.get('newsletter'))
            user.save()
            messages.success(request, _('Preferences updated successfully.'))
        
        return redirect('accounts:profile')


class ChangePasswordView(LoginRequiredMixin, TemplateView):
    """Change password view."""
    
    template_name = 'accounts/change_password.html'
    login_url = 'accounts:login'
    
    def post(self, request, *args, **kwargs):
        user = request.user
        old_password = request.POST.get('old_password')
        new_password1 = request.POST.get('new_password1')
        new_password2 = request.POST.get('new_password2')
        
        errors = {}
        
        if not user.check_password(old_password):
            errors['old_password'] = [_('Current password is incorrect.')]
        
        if new_password1 != new_password2:
            errors['new_password2'] = [_('Passwords do not match.')]
        
        if len(new_password1) < 8:
            errors['new_password1'] = [_('Password must be at least 8 characters.')]
        
        if errors:
            return render(request, self.template_name, {
                'form': {
                    'old_password': {'errors': errors.get('old_password', [])},
                    'new_password1': {'errors': errors.get('new_password1', [])},
                    'new_password2': {'errors': errors.get('new_password2', [])},
                }
            })
        
        user.set_password(new_password1)
        user.save()
        update_session_auth_hash(request, user)
        
        messages.success(request, _('Password changed successfully.'))
        return redirect('accounts:change_password')


class OrdersView(LoginRequiredMixin, ListView):
    """User orders list view."""
    
    template_name = 'accounts/orders.html'
    context_object_name = 'orders'
    paginate_by = 10
    login_url = 'accounts:login'
    
    def get_queryset(self):
        from apps.orders.models import Order
        
        queryset = Order.objects.filter(user=self.request.user).order_by('-created_at')
        
        status = self.request.GET.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status'] = self.request.GET.get('status', '')
        return context


class OrderDetailView(LoginRequiredMixin, TemplateView):
    """Order detail view."""
    
    template_name = 'orders/order_detail.html'
    login_url = 'accounts:login'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        from apps.orders.models import Order
        
        order = get_object_or_404(
            Order.objects.select_related('user').prefetch_related('items__product'),
            id=kwargs['order_id'],
            user=self.request.user
        )
        
        context['order'] = order
        return context


class AddressesView(LoginRequiredMixin, TemplateView):
    """User addresses view."""
    
    template_name = 'accounts/addresses.html'
    login_url = 'accounts:login'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        from apps.accounts.models import Address
        context['addresses'] = Address.objects.filter(
            user=self.request.user
        ).order_by('-is_default', '-created_at')
        
        return context


class AddAddressView(LoginRequiredMixin, View):
    """Add new address view."""
    
    login_url = 'accounts:login'
    
    def post(self, request, *args, **kwargs):
        from apps.accounts.models import Address
        
        address = Address.objects.create(
            user=request.user,
            first_name=request.POST.get('first_name'),
            last_name=request.POST.get('last_name'),
            phone=request.POST.get('phone', ''),
            address_line_1=request.POST.get('address_line_1'),
            address_line_2=request.POST.get('address_line_2', ''),
            city=request.POST.get('city'),
            state=request.POST.get('state', ''),
            postal_code=request.POST.get('postal_code'),
            country=request.POST.get('country'),
            is_default=bool(request.POST.get('is_default')),
        )
        
        # If set as default, unset others
        if address.is_default:
            Address.objects.filter(user=request.user).exclude(pk=address.pk).update(is_default=False)
        
        messages.success(request, _('Address added successfully.'))
        return redirect('accounts:addresses')


class EditAddressView(LoginRequiredMixin, View):
    """Edit address view."""
    
    login_url = 'accounts:login'
    
    def get(self, request, pk, *args, **kwargs):
        from apps.accounts.models import Address
        
        address = get_object_or_404(Address, pk=pk, user=request.user)
        
        return render(request, 'accounts/edit_address.html', {
            'address': address,
        })
    
    def post(self, request, pk, *args, **kwargs):
        from apps.accounts.models import Address
        
        address = get_object_or_404(Address, pk=pk, user=request.user)
        
        address.first_name = request.POST.get('first_name')
        address.last_name = request.POST.get('last_name')
        address.phone = request.POST.get('phone', '')
        address.address_line_1 = request.POST.get('address_line_1')
        address.address_line_2 = request.POST.get('address_line_2', '')
        address.city = request.POST.get('city')
        address.state = request.POST.get('state', '')
        address.postal_code = request.POST.get('postal_code')
        address.country = request.POST.get('country')
        address.is_default = bool(request.POST.get('is_default'))
        address.save()
        
        if address.is_default:
            Address.objects.filter(user=request.user).exclude(pk=address.pk).update(is_default=False)
        
        messages.success(request, _('Address updated successfully.'))
        return redirect('accounts:addresses')


class DeleteAddressView(LoginRequiredMixin, View):
    """Delete address view."""
    
    login_url = 'accounts:login'
    
    def post(self, request, pk, *args, **kwargs):
        from apps.accounts.models import Address
        
        address = get_object_or_404(Address, pk=pk, user=request.user)
        address.delete()
        
        messages.success(request, _('Address deleted successfully.'))
        return redirect('accounts:addresses')


class SetDefaultAddressView(LoginRequiredMixin, View):
    """Set address as default view."""
    
    login_url = 'accounts:login'
    
    def post(self, request, pk, *args, **kwargs):
        from apps.accounts.models import Address
        
        address = get_object_or_404(Address, pk=pk, user=request.user)
        
        Address.objects.filter(user=request.user).update(is_default=False)
        address.is_default = True
        address.save()
        
        messages.success(request, _('Default address updated.'))
        return redirect('accounts:addresses')


class WishlistView(LoginRequiredMixin, TemplateView):
    """User wishlist view."""
    
    template_name = 'accounts/wishlist.html'
    login_url = 'accounts:login'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        from apps.wishlist.models import WishlistItem
        
        items = WishlistItem.objects.filter(
            user=self.request.user
        ).select_related('product__category', 'product__brand').order_by('-created_at')
        
        paginator = Paginator(items, 12)
        page = self.request.GET.get('page', 1)
        context['wishlist_items'] = paginator.get_page(page)
        
        return context


class DeleteAccountView(LoginRequiredMixin, View):
    """Delete user account view."""
    
    login_url = 'accounts:login'
    
    def post(self, request, *args, **kwargs):
        password = request.POST.get('password')
        
        if not request.user.check_password(password):
            messages.error(request, _('Incorrect password.'))
            return redirect('accounts:profile')
        
        # Delete user
        user = request.user
        logout(request)
        user.delete()
        
        messages.success(request, _('Your account has been deleted.'))
        return redirect('storefront:home')

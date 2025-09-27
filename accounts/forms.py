# accounts/forms.py
from django import forms
from allauth.account.forms import (
    ResetPasswordForm as AllauthPasswordResetForm,
    SetPasswordForm as AllauthSetPasswordForm
)
from allauth.account.forms import SignupForm, LoginForm
from allauth.socialaccount.forms import SignupForm as SocialSignupForm
from .models import User, UserAddress, UserSettings # Import UserSettings
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from .constants import GENDER_CHOICES
import re
from django_countries.fields import Country # Import Country for choices
from currencies.models import Currency # Import Currency for choices
from django.conf import settings # Import settings

# Common Tailwind classes for form inputs
TAILWIND_INPUT_CLASSES = "block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
TAILWIND_SELECT_CLASSES = "block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3" # Added py-2 px-3 for select

class UserProfileForm(forms.ModelForm):
    phone_number = forms.CharField(
        label=_("Phone Number"),
        max_length=17,
        required=True,
        widget=forms.TextInput(attrs={
            'placeholder': '+8801XXXXXXXXX',
            'class': TAILWIND_INPUT_CLASSES # Changed from 'form-control'
        })
    )

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'phone_number',
            'date_of_birth',
            'profile_picture',
        ]
        widgets = {
            'first_name': forms.TextInput(attrs={'class': TAILWIND_INPUT_CLASSES}), # Changed
            'last_name': forms.TextInput(attrs={'class': TAILWIND_INPUT_CLASSES}),  # Changed
            'date_of_birth': forms.DateInput(format='%Y-%m-%d', attrs={'type': 'date', 'class': TAILWIND_INPUT_CLASSES}), # Changed
            'profile_picture': forms.FileInput(attrs={'class': TAILWIND_INPUT_CLASSES}), # Changed
        }
        labels = {
            'profile_picture': _('Profile Picture'),
        }

    def clean_phone_number(self):
        raw = self.cleaned_data.get('phone_number', '')
        phone = re.sub(r'\D', '', raw)

        # Normalize to +8801XXXXXXXXX
        if phone.startswith('01') and len(phone) == 11:
            phone = f'+880{phone[1:]}'
        elif phone.startswith('8801') and len(phone) == 13:
            phone = f'+{phone}'
        elif phone.startswith('+8801') and len(phone) == 14:
            pass  # already normalized
        else:
            phone = f'+8801{phone[-9:]}'  # fallback

        # Final validation
        if not re.fullmatch(r'^\+8801[3-9]\d{8}$', phone):
            raise forms.ValidationError(_("Enter a valid Bangladeshi phone number in the format +8801XXXXXXXXX."))

        return phone

class UserAddressForm(forms.ModelForm):
    # These are mapped dynamically from AlpineJS UI dropdowns
    phone_number = forms.CharField(
                label=_("Phone Number"),
                max_length=17,
                required=True,
                widget=forms.TextInput(attrs={'placeholder': '+8801XXXXXXXXX', 'class': TAILWIND_INPUT_CLASSES})
            ),
    division = forms.CharField(required=False, widget=forms.HiddenInput())
    district = forms.CharField(required=False, widget=forms.HiddenInput())
    upazila = forms.CharField(required=False, widget=forms.HiddenInput())

    class Meta:
        model = UserAddress
        exclude = ['user', 'created_at']
        labels = {
            'full_name': _('Full Name'),
            'phone_number': _('Phone Number'),
            'address_line_1': _('Address Line'),
            'address_line_2': _('Address Line 2 (optional)'),
            'state': _('Division'),
            'city': _('District'),
            'postal_code': _('Postal Code'),
            'country': _('Country'),
            'is_default': _('Set as default'),
        }
        widgets = {
            'full_name': forms.TextInput(attrs={'class': TAILWIND_INPUT_CLASSES, 'placeholder': 'Recipient name'}),
            'address_line_1': forms.TextInput(attrs={'class': TAILWIND_INPUT_CLASSES, 'placeholder': 'Street address or holding no'}),
            'address_line_2': forms.TextInput(attrs={'class': TAILWIND_INPUT_CLASSES, 'placeholder': 'Optional apartment, block, road'}),
            'postal_code': forms.TextInput(attrs={'class': TAILWIND_INPUT_CLASSES, 'placeholder': '4-digit postal code'}),
            'upazila': forms.HiddenInput(),
            'country': forms.Select(attrs={'class': TAILWIND_SELECT_CLASSES}),
            'is_default': forms.CheckboxInput(attrs={'class': 'rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'}), # Tailwind checkbox
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        instance = kwargs.get('instance')
        if instance:
            self.fields['division'].initial = instance.state
            self.fields['district'].initial = instance.city

        self.fields['country'].initial = 'BD'

    def clean_phone_number(self):
        raw = self.cleaned_data.get('phone_number', '')

        # Normalize: accept PhoneNumber object or string
        if not isinstance(raw, str):
            raw = str(raw)

        digits = re.sub(r'\D', '', raw)

        if digits.startswith('01') and len(digits) == 11:
            phone = f'+880{digits[1:]}'
        elif digits.startswith('8801') and len(digits) == 13:
            phone = f'+{digits}'
        elif digits.startswith('+8801') and len(digits) == 14:
            phone = digits
        else:
            phone = f'+8801{digits[-9:]}'

        if not re.fullmatch(r'^\+8801[3-9]\d{8}$', phone):
            raise forms.ValidationError(_("Enter a valid Bangladeshi phone number in the format +8801XXXXXXXXX."))

        return phone

    def clean_postal_code(self):
        code = self.cleaned_data.get('postal_code', '').strip()
        if not re.fullmatch(r'\d{4}', code):
            raise forms.ValidationError(_("Postal code must be a 4-digit number."))
        return code

    def clean(self):
        cleaned_data = super().clean()
        
        # Map the form fields to model fields
        division = cleaned_data.get('division', '').strip()
        district = cleaned_data.get('district', '').strip()
        upazila = cleaned_data.get('upazila', '').strip()
        
        if not division:
            self.add_error('division', _("Division is required."))
        if not district:
            self.add_error('district', _("District is required."))
        
        # Apply to model fields
        cleaned_data['state'] = division
        cleaned_data['city'] = district
        
        return cleaned_data


class CustomSignupForm(SignupForm):
    first_name = forms.CharField(
        max_length=30,
        label=_('First Name'),
        widget=forms.TextInput(attrs={
            'placeholder': _('First Name'),
            'class': TAILWIND_INPUT_CLASSES
        })
    )
    last_name = forms.CharField(
        max_length=30,
        label=_('Last Name'),
        widget=forms.TextInput(attrs={
            'placeholder': _('Last Name'),
            'class': TAILWIND_INPUT_CLASSES
        })
    )
    username = forms.CharField(
        max_length=30,
        label=_('Username'),
        widget=forms.TextInput(attrs={
            'placeholder': _('Username'),
            'class': TAILWIND_INPUT_CLASSES
        })
    )
    phone_number = forms.CharField(
        max_length=20,
        label=_('Phone Number'),
        widget=forms.TextInput(attrs={
            'placeholder': _('+8801XXXXXXXXX'),
            'class': TAILWIND_INPUT_CLASSES
        }),
        help_text=_('We may use this for order updates')
    )
    gender = forms.ChoiceField(
        choices=GENDER_CHOICES,
        label=_('Gender'),
        widget=forms.Select(attrs={
            'class': TAILWIND_SELECT_CLASSES,
        }),
        required=False
    )
    terms_accepted = forms.BooleanField(
        required=True,
        label=_('I accept the Terms and Conditions'),
        error_messages={
            'required': _('You must accept the terms and conditions to register.')
        },
        widget=forms.CheckboxInput(attrs={'class': 'rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'}) # Tailwind checkbox
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        field_order = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'gender', 'password1', 'password2', 'terms_accepted']
        
        # Reorder fields
        self.order_fields(field_order)
        
        # Update widget attributes
        if 'email' in self.fields:
            self.fields['email'].widget.attrs.update({
                'class': TAILWIND_INPUT_CLASSES,
                'placeholder': _('Email address'),
                'autocomplete': 'email'
            })
        if 'password1' in self.fields:
            self.fields['password1'].widget.attrs.update({
                'class': TAILWIND_INPUT_CLASSES,
                'placeholder': _('Password'),
                'autocomplete': 'new-password'
            })
        if 'password2' in self.fields: # Added 'in self.fields' check
            self.fields['password2'].widget.attrs.update({
                'class': TAILWIND_INPUT_CLASSES,
                'placeholder': _('Confirm Password'),
                'autocomplete': 'new-password'
            })

    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError(_('A user with that username already exists.'))
        return username

    def clean_phone_number(self):
        phone_number = self.cleaned_data['phone_number']
        # Add your phone validation logic here
        # Example: Check if phone already exists
        if User.objects.filter(phone_number=phone_number).exists():
            raise forms.ValidationError(_('This phone number is already registered.'))
        return phone_number
    
    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        user.phone_number = self.cleaned_data.get('phone_number', '')
        user.gender = self.cleaned_data.get('gender', '')
        user.save()
        return user

from django.contrib.auth import authenticate
from allauth.account.forms import LoginForm
from django import forms

class CustomLoginForm(LoginForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Customize the login field (email or username)
        self.fields['login'].widget.attrs.update({
            'class': TAILWIND_INPUT_CLASSES,
            'placeholder': _('Email or Username'),
            'autocomplete': 'username'
        })
        
        # Customize the password field
        self.fields['password'].widget.attrs.update({
            'class': TAILWIND_INPUT_CLASSES,
            'placeholder': _('Password'),
            'autocomplete': 'current-password'
        })
        
    def clean_login(self):
        login = self.cleaned_data.get('login')

        if '@' in login:
            user = authenticate(request=self.request, email=login)
        else:
            user = authenticate(request=self.request, username=login)

        if user is None:
            raise forms.ValidationError(_('Invalid username or email address'))
        
        return login

class CustomPasswordResetForm(AllauthPasswordResetForm):
    email = forms.EmailField(
        label=_("Email"),
        max_length=254,
        widget=forms.EmailInput(attrs={
            'autocomplete': 'email',
            'class': TAILWIND_INPUT_CLASSES,
            'placeholder': _('Enter your email address')
        })
    )

class CustomSetPasswordForm(AllauthSetPasswordForm):
    def __init__(self, *args, **kwargs):
        kwargs.pop('temp_key', None)  # Workaround for unexpected 'temp_key' argument
        super().__init__(*args, **kwargs)

    new_password1 = forms.CharField(
        label=_("New password"),
        widget=forms.PasswordInput(attrs={
            'autocomplete': 'new-password',
            'class': TAILWIND_INPUT_CLASSES,
            'placeholder': _('New password')
        }),
        strip=False,
        help_text=_("Your password must contain at least 8 characters."),
    )
    new_password2 = forms.CharField(
        label=_("New password confirmation"),
        strip=False,
        widget=forms.PasswordInput(attrs={
            'autocomplete': 'new-password',
            'class': TAILWIND_INPUT_CLASSES,
            'placeholder': _('Confirm new password')
        }),
    )

class CustomSocialSignupForm(SocialSignupForm):
    first_name = forms.CharField(
        max_length=30,
        label=_('First Name'),
        widget=forms.TextInput(attrs={
            'placeholder': _('First Name'),
            'class': TAILWIND_INPUT_CLASSES
        })
    )
    last_name = forms.CharField(
        max_length=30,
        label=_('Last Name'),
        widget=forms.TextInput(attrs={
            'placeholder': _('Last Name'),
            'class': TAILWIND_INPUT_CLASSES
        })
    )
    phone_number = forms.CharField(
        max_length=20,
        label=_('Phone Number'),
        widget=forms.TextInput(attrs={
            'placeholder': _('+8801XXXXXXXXX'),
            'class': TAILWIND_INPUT_CLASSES
        }),
        help_text=_('We may use this for order updates')
    )
    gender = forms.ChoiceField(
        choices=GENDER_CHOICES,
        label=_('Gender'),
        widget=forms.Select(attrs={
            'class': TAILWIND_SELECT_CLASSES,
        }),
        required=False
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure 'email' and 'username' fields are present if allauth expects them
        # and apply styling
        if 'email' in self.fields:
            self.fields['email'].widget.attrs.update({
                'class': TAILWIND_INPUT_CLASSES,
                'placeholder': _('Email address'),
                'autocomplete': 'email'
            })
        if 'username' in self.fields:
            self.fields['username'].widget.attrs.update({
                'class': TAILWIND_INPUT_CLASSES,
                'placeholder': _('Username'),
                'autocomplete': 'username'
            })

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        user.phone_number = self.cleaned_data.get('phone_number', '')
        user.gender = self.cleaned_data.get('gender', '')
        user.save()
        return user


from core.models import Language # Import Language model

class UserSettingsForm(forms.ModelForm):
    language = forms.ModelChoiceField(
        queryset=Language.objects.all(),
        to_field_name='code', # Use 'code' as the value for the select options
        empty_label=None, # Or provide a default empty label if desired
        label=_('Preferred Language'),
        widget=forms.Select(attrs={'class': TAILWIND_SELECT_CLASSES})
    )

    class Meta:
        model = UserSettings
        fields = ['currency', 'language', 'country', 'timezone']
        widgets = {
            'currency': forms.Select(attrs={'class': TAILWIND_SELECT_CLASSES}),
            'country': forms.Select(attrs={'class': TAILWIND_SELECT_CLASSES}),
            'timezone': forms.TextInput(attrs={'class': TAILWIND_INPUT_CLASSES}),
        }
# orders/forms.py
from django import forms
from django.core.exceptions import ValidationError
from django_countries.fields import CountryField
from django_countries.widgets import CountrySelectWidget
from django.utils import timezone

from .models import Order, OrderItem, OrderStatus
from accounts.models import UserAddress
from products.models import Product
from shipping.models import ShippingCarrier
from payments.models import PaymentMethod


class CartAddProductForm(forms.Form):
    quantity = forms.IntegerField(
        min_value=1,
        max_value=20,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Quantity'})
    )


class OrderCreateForm(forms.ModelForm):
    ADDRESS_CHOICE = [
        ('existing', 'Use existing address'),
        ('new', 'Add new address')
    ]
    address_choice = forms.ChoiceField(
        choices=ADDRESS_CHOICE,
        widget=forms.RadioSelect(attrs={'class': 'form-check-input'}),
        initial='existing'
    )
    existing_address = forms.ModelChoiceField(
        queryset=UserAddress.objects.none(),
        required=False,
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    full_name       = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Full Name'}))
    email           = forms.EmailField(required=False, widget=forms.EmailInput(attrs={'class':'form-control','placeholder':'Email'}))
    phone           = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Phone'}))
    address_line1   = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Address Line 1'}))
    address_line2   = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Address Line 2'}))
    city            = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control','placeholder':'City'}))
    state           = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control','placeholder':'State/Province'}))
    postal_code     = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Postal Code'}))
    country         = CountryField().formfield(required=False, widget=CountrySelectWidget(attrs={'class':'form-select'}))
    save_address    = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={'class':'form-check-input'}), label='Save this address for future use')

    # Replaced shipping_method → shipping_carrier
    shipping_carrier = forms.ModelChoiceField(
        queryset=ShippingCarrier.objects.filter(is_active=True),
        widget=forms.RadioSelect(attrs={'class': 'form-check-input'}),
        empty_label=None
    )

    payment_method = forms.ModelChoiceField(
        queryset=PaymentMethod.objects.filter(is_active=True),
        widget=forms.RadioSelect(attrs={'class': 'form-check-input'}),
        empty_label=None
    )

    class Meta:
        model  = Order
        fields = ['order_note']
        widgets = {
            'order_note': forms.Textarea(attrs={
                'class':'form-control','rows':3,'placeholder':'Special instructions for your order...'
            })
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if self.user:
            self.fields['existing_address'].queryset = UserAddress.objects.filter(user=self.user)
            self.fields['full_name'].initial = self.user.get_full_name()
            self.fields['email'].initial     = self.user.email
            if hasattr(self.user, 'profile'):
                self.fields['phone'].initial          = self.user.profile.phone
                self.fields['address_line1'].initial  = self.user.profile.address
                self.fields['city'].initial           = self.user.profile.city

    def clean(self):
        cleaned = super().clean()
        choice = cleaned.get('address_choice')
        if choice == 'existing':
            if not cleaned.get('existing_address'):
                self.add_error('existing_address','Please select an existing address')
        else:
            required = ['full_name','email','phone','address_line1','city','state','postal_code','country']
            for f in required:
                if not cleaned.get(f):
                    self.add_error(f, 'This field is required for new address')
        return cleaned


class ShippingCarrierForm(forms.Form):
    shipping_carrier = forms.ModelChoiceField(
        queryset=ShippingCarrier.objects.filter(is_active=True),
        widget=forms.RadioSelect(attrs={'class':'form-check-input'}),
        empty_label=None
    )


class PaymentMethodForm(forms.Form):
    payment_method = forms.ModelChoiceField(
        queryset=PaymentMethod.objects.filter(is_active=True),
        widget=forms.RadioSelect(attrs={'class':'form-check-input'}),
        empty_label=None
    )


class OrderSearchForm(forms.Form):
    order_number = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Search by order number'})
    )
    date_range   = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Select date range','autocomplete':'off'})
    )
    status       = forms.ModelChoiceField(
        queryset=OrderStatus.objects.filter(is_active=True).order_by('name'),
        required=False,
        empty_label="All Statuses",
        widget=forms.Select(attrs={'class':'form-select'})
    )


class OrderStatusUpdateForm(forms.ModelForm):
    send_notification = forms.BooleanField(
        required=False,
        initial=True,
        widget=forms.CheckboxInput(attrs={'class':'form-check-input'}),
        label="Send notification email to customer"
    )

    class Meta:
        model  = Order
        fields = ['status','tracking_number','shipping_carrier']
        widgets = {
            'status'         : forms.Select(attrs={'class':'form-select'}),
            'tracking_number': forms.TextInput(attrs={'class':'form-control'}),
            'shipping_carrier':forms.Select(attrs={'class':'form-select'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['status'].queryset           = OrderStatus.objects.filter(is_active=True)
        self.fields['shipping_carrier'].queryset = ShippingCarrier.objects.filter(is_active=True)
        for f in self.fields.values():
            f.required = False

    def clean(self):
        data = super().clean()
        status = data.get('status')
        if status and status.name.lower() == 'shipped':
            if not data.get('tracking_number'):
                self.add_error('tracking_number','Tracking number is required when status is Shipped.')
            if not data.get('shipping_carrier'):
                self.add_error('shipping_carrier','Shipping carrier is required when status is Shipped.')
        return data

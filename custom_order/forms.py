# custom_order/forms.py
import phonenumbers
from django import forms
from django.forms.models import inlineformset_factory
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from decimal import Decimal

from .models import CustomOrder, DesignImage, CustomerItemImage, SizeOption, SubCategory, Category, FabricType, ColorOption
from promotions.services import CouponService # Import the CouponService
from payments.models import PaymentMethod
from payments.selectors import get_active_payment_methods
from shipping.models import ShippingMethod
from shipping.selectors import get_available_shipping_methods_for_address
from accounts.models import UserAddress

class CustomOrderForm(forms.ModelForm):
    """
    Form for creating and updating CustomOrder instances.
    Handles dynamic fields and coupon validation.
    """
    ORDER_TYPE_CHOICES = CustomOrder.OrderType.choices
    CONTACT_METHOD_CHOICES = CustomOrder.ContactMethod.choices

    order_type = forms.ChoiceField(
        choices=ORDER_TYPE_CHOICES,
        widget=forms.RadioSelect(attrs={
            'class': 'order-type-radio',
            'x-model': 'orderType',
            '@change': 'selectOrderType($event.target.value)'
        })
    )

    contact_method = forms.ChoiceField(
        choices=CONTACT_METHOD_CHOICES,
        widget=forms.RadioSelect(attrs={
            'class': 'contact-method-radio'
        })
    )

    coupon_code = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': _('Enter coupon code'),
            'class': 'input input-bordered w-full'
        }),
        help_text=_("Apply a coupon for discount.")
    )

    class Meta:
        model = CustomOrder
        fields = [
            'order_type', 'customer_name', 'phone', 'email', 'contact_method',
            'category', 'subcategory', 'fabric_type', 'size_option', 'color_option', 'quantity',
            'design_description', 'customer_item_description', 'customer_item_condition',
            'size_info', 'expected_date', 'additional_info',
            'shipping_address', 'shipping_method', 'payment_method',
            'coupon',
            'is_draft'
        ]
        widgets = {
            'customer_name': forms.TextInput(attrs={'placeholder': _('Your Full Name')}),
            'phone': forms.TextInput(attrs={'placeholder': _('e.g., +88017XXXXXXXX')}),
            'email': forms.EmailInput(attrs={'placeholder': _('your.email@example.com')}),
            'design_description': forms.Textarea(attrs={'rows': 4, 'placeholder': _('Describe your design in detail...')}),
            'customer_item_description': forms.Textarea(attrs={'rows': 4, 'placeholder': _('Describe the product you are sending...')}),
            'customer_item_condition': forms.TextInput(attrs={'placeholder': _('e.g., Good condition, needs alteration')}),
            'quantity': forms.NumberInput(attrs={'min': 1}),
            'expected_date': forms.DateInput(attrs={'type': 'date'}),
            'additional_info': forms.Textarea(attrs={'rows': 3, 'placeholder': _('Any special instructions or notes...')}),
            'size_info': forms.HiddenInput(),
            'coupon': forms.HiddenInput(),
            'is_draft': forms.CheckboxInput(attrs={'class': 'checkbox'}),
        }
        help_texts = {
            'is_draft': _("Check this to save your order as a draft. You can complete it later from your account."),
        }

    def __init__(self, *args, **kwargs):
        """
        Initializes the form, dynamically setting choices for related fields
        and filtering size options based on subcategory.
        """
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

        # Set initial querysets for dropdowns
        self.fields['category'].queryset = Category.objects.filter(is_active=True)
        self.fields['fabric_type'].queryset = FabricType.objects.filter(is_active=True)

        # Dynamically filter subcategory and size options based on data
        category_id = self.data.get('category') or (self.instance.category.id if self.instance.category else None)
        if category_id:
            self.fields['subcategory'].queryset = SubCategory.objects.filter(category_id=category_id, is_active=True)
        else:
            self.fields['subcategory'].queryset = SubCategory.objects.none()

        subcategory_id = self.data.get('subcategory') or (self.instance.subcategory.id if self.instance.subcategory else None)
        if subcategory_id:
            self.fields['size_option'].queryset = SizeOption.objects.filter(
                is_active=True,
                subcategories__id=subcategory_id
            ).distinct()
        else:
            self.fields['size_option'].queryset = SizeOption.objects.none()

        fabric_type_id = self.data.get('fabric_type') or (self.instance.fabric_type.id if self.instance.fabric_type else None)
        if fabric_type_id:
            self.fields['color_option'].queryset = ColorOption.objects.filter(is_active=True)
        else:
            self.fields['color_option'].queryset = ColorOption.objects.none()

        # Populate shipping methods and payment methods
        self.fields['shipping_method'].queryset = ShippingMethod.objects.filter(is_active=True)
        self.fields['payment_method'].queryset = get_active_payment_methods()

        # Populate user addresses
        if self.user and self.user.is_authenticated:
            self.fields['shipping_address'].queryset = UserAddress.objects.filter(user=self.user)
        else:
            self.fields['shipping_address'].queryset = UserAddress.objects.none()

        # Adjust fields based on order_type for validation
        order_type = self.data.get('order_type') or (self.instance.order_type if self.instance.pk else None)
        if order_type == CustomOrder.OrderType.DIRECT_CONTACT:
            for field_name in ['category', 'subcategory', 'fabric_type', 'size_option', 'color_option', 'quantity',
                               'design_description', 'customer_item_description', 'customer_item_condition',
                               'shipping_address', 'shipping_method', 'payment_method']:
                self.fields[field_name].required = False
        elif order_type == CustomOrder.OrderType.OWN_DESIGN:
            self.fields['customer_item_description'].required = False
            self.fields['customer_item_condition'].required = False
            self.fields['design_description'].required = True
            self.fields['category'].required = True
            self.fields['subcategory'].required = True
            self.fields['fabric_type'].required = True
            self.fields['size_option'].required = True
            self.fields['color_option'].required = True
            self.fields['quantity'].required = True
        elif order_type == CustomOrder.OrderType.SEND_PRODUCT:
            self.fields['design_description'].required = False
            self.fields['size_option'].required = False
            self.fields['color_option'].required = False
            self.fields['customer_item_description'].required = True
            self.fields['category'].required = True
            self.fields['subcategory'].required = True
            self.fields['fabric_type'].required = True
            self.fields['quantity'].required = True

        def __init__(self, *args, **kwargs):
            self.user = kwargs.pop('user', None)
            super().__init__(*args, **kwargs)
            
            # Make fields optional for drafts
            if self.instance and self.instance.is_draft:
                for field in self.fields:
                    self.fields[field].required = False

    def clean(self):
        cleaned_data = super().clean()
        is_draft = cleaned_data.get('is_draft', False)
        
        if is_draft:
            return cleaned_data
            
        # Validate required fields for non-drafts
        if not cleaned_data.get('customer_name'):
            self.add_error('customer_name', 'Name is required')
        if not cleaned_data.get('phone'):
            self.add_error('phone', 'Phone is required')
        
        return cleaned_data
    
    def clean_phone(self):
        """
        Cleans and validates the phone number using phonenumbers library.
        """
        phone = self.cleaned_data.get('phone')
        if phone:
            try:
                parsed_phone = phonenumbers.parse(phone, "BD")
                if not phonenumbers.is_valid_number(parsed_phone):
                    raise ValidationError(_("Please enter a valid phone number."))
                return phonenumbers.format_number(parsed_phone, phonenumbers.PhoneNumberFormat.E164)
            except Exception:
                raise ValidationError(_("Please enter a valid phone number."))
        return phone

    def clean_coupon_code(self):
        """
        Validates the coupon code using the promotions service.
        """
        coupon_code = self.cleaned_data.get('coupon_code')
        if coupon_code:
            try:
                # For validation, we need a dummy amount if the actual order total isn't finalized yet.
                # The actual discount calculation will happen in services.finalize_pricing
                # or api_views.CalculatePriceAPIView
                dummy_amount = Decimal('1.00')
                coupon = CouponService.validate_coupon(coupon_code, dummy_amount, self.user)
                self.cleaned_data['coupon'] = coupon # Attach the coupon object to cleaned_data
            except ValidationError as e:
                self.add_error('coupon_code', e.message)
            except Exception as e:
                self.add_error('coupon_code', _('An unexpected error occurred during coupon validation.'))
        else:
            self.cleaned_data['coupon'] = None # Ensure coupon is None if code is empty

        return coupon_code


DesignImageFormSet = inlineformset_factory(
    CustomOrder, DesignImage,
    fields=['image', 'description', 'is_primary'],
    extra=1,
    can_delete=True,
    max_num=10,
    widgets={
        'image': forms.FileInput(attrs={
            'class': 'file-input',
            'accept': 'image/*'
        }),
        'description': forms.TextInput(attrs={
            'placeholder': _('Image description...')
        }),
        'is_primary': forms.CheckboxInput(attrs={
            'class': 'checkbox'
        })
    }
)

CustomerItemImageFormSet = inlineformset_factory(
    CustomOrder, CustomerItemImage,
    fields=['image', 'description'],
    extra=1,
    can_delete=True,
    max_num=10,
    widgets={
        'image': forms.FileInput(attrs={
            'class': 'file-input',
            'accept': 'image/*'
        }),
        'description': forms.TextInput(attrs={
            'placeholder': _('Item image description...')
        })
    }
)

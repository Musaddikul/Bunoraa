# cart/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _
from decimal import Decimal

# No need to import ShippingZone, ShippingCarrier, Coupon directly here
# as their selection is now handled via IDs and services.

class CartAddProductForm(forms.Form):
    """
    Form for adding a product to the cart or updating its quantity.
    """
    quantity = forms.IntegerField(
        min_value=1,
        initial=1,
        widget=forms.NumberInput(attrs={'class': 'form-input w-20 text-center'}),
        help_text=_("Quantity of the product.")
    )
    override = forms.BooleanField(
        required=False,
        initial=False,
        widget=forms.HiddenInput(),
        help_text=_("If true, overrides existing quantity; otherwise, adds to it.")
    )
    # New field to indicate if it should be saved for later
    saved_for_later = forms.BooleanField(
        required=False,
        initial=False,
        widget=forms.HiddenInput(),
        help_text=_("If true, adds to 'saved for later' instead of active cart.")
    )

class CouponForm(forms.Form):
    """
    Form for applying a coupon code.
    """
    code = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={'placeholder': _('Enter coupon code'), 'class': 'form-input flex-grow mr-2'}),
        help_text=_("Your coupon code.")
    )

class ShippingSelectionForm(forms.Form):
    """
    Form for selecting a shipping method for the cart.
    This form will be populated dynamically from available shipping methods.
    """
    shipping_method = forms.IntegerField(
        widget=forms.HiddenInput(), # This will be set by JS from a dropdown
        help_text=_("ID of the selected shipping method.")
    )

    # In a real scenario, you'd likely have a ModelChoiceField here
    # populated dynamically in the view or via AJAX.
    # For now, we expect the ID to be passed directly.
    # Example if you were to populate it directly in the view:
    # from shipping.models import ShippingMethod
    # shipping_method = forms.ModelChoiceField(
    #     queryset=ShippingMethod.objects.filter(is_active=True),
    #     empty_label=_("Select a shipping method"),
    #     widget=forms.Select(attrs={'class': 'form-select'})
    # )


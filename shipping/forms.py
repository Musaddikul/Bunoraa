# shipping/forms.py
from django import forms
from decimal import Decimal
from django.utils.translation import gettext_lazy as _
from phonenumber_field.formfields import PhoneNumberField

class CalculateShippingForm(forms.Form):
    """
    Form for calculating estimated shipping costs.
    This form is typically used for public-facing tools or initial estimates.
    """
    city = forms.CharField(max_length=100, help_text=_("City for shipping destination."))
    region = forms.CharField(max_length=100, help_text=_("Region/State/Division for shipping destination."))
    country = forms.CharField(max_length=100, help_text=_("Country for shipping destination."))
    postal_code = forms.CharField(max_length=20, required=False, help_text=_("Postal code for more precise zone matching."))
    
    weight_kg = forms.DecimalField(
        max_digits=6, decimal_places=2,
        min_value=Decimal('0.01'),
        help_text=_("Weight of the package in kilograms.")
    )
    length_cm = forms.DecimalField(
        max_digits=6, decimal_places=1,
        min_value=Decimal('0.1'),
        help_text=_("Length of the package in centimeters.")
    )
    width_cm = forms.DecimalField(
        max_digits=6, decimal_places=1,
        min_value=Decimal('0.1'),
        help_text=_("Width of the package in centimeters.")
    )
    height_cm = forms.DecimalField(
        max_digits=6, decimal_places=1,
        min_value=Decimal('0.1'),
        help_text=_("Height of the package in centimeters.")
    )
    express = forms.BooleanField(
        required=False,
        help_text=_("Check if express shipping is desired.")
    )

    def clean(self):
        """
        Custom validation for the form.
        Ensures dimensions are provided together if any is present.
        """
        cleaned_data = super().clean()
        length = cleaned_data.get('length_cm')
        width = cleaned_data.get('width_cm')
        height = cleaned_data.get('height_cm')

        # If any dimension is provided, all must be provided
        if any([length, width, height]) and not all([length, width, height]):
            raise forms.ValidationError(
                _("All dimensions (length, width, height) must be provided if any one is specified.")
            )
        return cleaned_data

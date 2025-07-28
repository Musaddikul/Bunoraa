# promotions/forms.py
from django import forms
from django.utils.translation import gettext_lazy as _

class ApplyCouponForm(forms.Form):
    """
    A simple form for users to input a coupon code.
    """
    code = forms.CharField(
        max_length=50,
        label=_("Coupon Code"),
        help_text=_("Enter your coupon code here.")
    )


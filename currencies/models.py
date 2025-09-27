
from django.db import models
from django.utils.translation import gettext_lazy as _

class Currency(models.Model):
    """
    Model to store currency information.
    """
    code = models.CharField(
        _("Currency Code"),
        max_length=3,
        unique=True,
        help_text=_("ISO 4217 currency code, e.g., USD, EUR, BDT.")
    )
    name = models.CharField(
        _("Currency Name"),
        max_length=50,
        help_text=_("Full name of the currency, e.g., United States Dollar.")
    )
    symbol = models.CharField(
        _("Symbol"),
        max_length=5,
        help_text=_("Currency symbol, e.g., $, €, ৳.")
    )
    exchange_rate = models.DecimalField(
        _("Exchange Rate"),
        max_digits=12,
        decimal_places=6,
        default=1.0,
        help_text=_("Exchange rate against the base currency (e.g., BDT).")
    )
    is_default = models.BooleanField(
        _("Default Currency"),
        default=False,
        help_text=_("Is this the default currency for the store?")
    )
    is_active = models.BooleanField(
        _("Active"),
        default=True,
        help_text=_("Is this currency available for use?")
    )
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)

    class Meta:
        verbose_name = _("Currency")
        verbose_name_plural = _("Currencies")
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"

    def save(self, *args, **kwargs):
        if self.is_default:
            # Ensure only one currency is the default
            Currency.objects.exclude(pk=self.pk).filter(is_default=True).update(is_default=False)
        super().save(*args, **kwargs)

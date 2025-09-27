
from django.contrib import admin, messages
from .models import Currency
from .services import ExchangeRateService

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'symbol', 'exchange_rate', 'is_default', 'is_active', 'updated_at')
    list_filter = ('is_default', 'is_active')
    search_fields = ('name', 'code')
    list_editable = ('exchange_rate', 'is_default', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['update_rates']

    def update_rates(self, request, queryset):
        service = ExchangeRateService()
        default_currency = Currency.objects.filter(is_default=True).first()
        if not default_currency:
            self.message_user(request, "No default currency is set.", level=messages.ERROR)
            return

        rates, error = service.get_exchange_rates(base_currency=default_currency.code)

        if error:
            self.message_user(request, f"Error updating rates: {error}", level=messages.ERROR)
            return

        updated_count = 0
        for currency in queryset:
            if currency.code in rates:
                currency.exchange_rate = rates[currency.code]
                currency.save()
                updated_count += 1
        
        self.message_user(request, f"{updated_count} currencies updated successfully.")

    update_rates.short_description = "Update exchange rates for selected currencies"


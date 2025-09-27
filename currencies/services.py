
import requests
from django.conf import settings

class ExchangeRateService:
    API_KEY = getattr(settings, 'EXCHANGERATE_API_KEY', None)
    BASE_URL = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/"

    def get_exchange_rates(self, base_currency='BDT'):
        if not self.API_KEY:
            # You can log this error or handle it as needed
            return None, "API key not configured."

        try:
            response = requests.get(f"{self.BASE_URL}{base_currency}")
            response.raise_for_status()  # Raise an exception for bad status codes
            data = response.json()
            if data.get('result') == 'success':
                return data.get('conversion_rates'), None
            else:
                return None, data.get('error-type', 'Unknown error')
        except requests.exceptions.RequestException as e:
            return None, str(e)

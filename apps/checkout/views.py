"""
Checkout views - Robust multi-step checkout process
"""
import json
import logging
from decimal import Decimal
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView, View
from django.contrib import messages
from django.conf import settings
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.urls import reverse

from apps.cart.services import CartService
from apps.currencies.services import CurrencyService
from apps.orders.models import Order
from apps.contacts.models import StoreLocation
from .models import CheckoutSession
from .services import CheckoutService, CheckoutError

logger = logging.getLogger(__name__)


class CheckoutMixin:
    """Mixin for checkout views with common functionality."""
    
    def get_cart(self):
        """Get current cart."""
        if self.request.user.is_authenticated:
            return CartService.get_cart(user=self.request.user)
        elif self.request.session.session_key:
            return CartService.get_cart(session_key=self.request.session.session_key)
        return None
    
    def get_checkout_session(self, cart=None):
        """Get or create checkout session."""
        if not cart:
            cart = self.get_cart()
        
        if not cart:
            return None
        
        if self.request.user.is_authenticated:
            return CheckoutService.get_or_create_session(
                cart=cart,
                user=self.request.user,
                request=self.request
            )
        else:
            if not self.request.session.session_key:
                self.request.session.create()
            return CheckoutService.get_or_create_session(
                cart=cart,
                session_key=self.request.session.session_key,
                request=self.request
            )
    
    # Country code to name mapping
    COUNTRY_NAMES = {
        'BD': 'Bangladesh', 'IN': 'India', 'US': 'United States', 'GB': 'United Kingdom',
        'CA': 'Canada', 'AU': 'Australia', 'DE': 'Germany', 'FR': 'France',
        'JP': 'Japan', 'SG': 'Singapore', 'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia',
        'MY': 'Malaysia', 'PK': 'Pakistan', 'NP': 'Nepal', 'LK': 'Sri Lanka',
        'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands', 'BE': 'Belgium',
        'CH': 'Switzerland', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
        'PL': 'Poland', 'AT': 'Austria', 'NZ': 'New Zealand', 'IE': 'Ireland',
        'PT': 'Portugal', 'GR': 'Greece', 'FI': 'Finland', 'CZ': 'Czech Republic',
        'HU': 'Hungary', 'RO': 'Romania', 'TH': 'Thailand', 'PH': 'Philippines',
        'VN': 'Vietnam', 'ID': 'Indonesia', 'HK': 'Hong Kong', 'TW': 'Taiwan',
        'KR': 'South Korea', 'CN': 'China', 'RU': 'Russia', 'TR': 'Turkey',
        'ZA': 'South Africa', 'EG': 'Egypt', 'NG': 'Nigeria', 'KE': 'Kenya',
        'BR': 'Brazil', 'MX': 'Mexico', 'AR': 'Argentina', 'CO': 'Colombia',
        'CL': 'Chile', 'PE': 'Peru', 'VE': 'Venezuela', 'QA': 'Qatar',
        'KW': 'Kuwait', 'BH': 'Bahrain', 'OM': 'Oman', 'JO': 'Jordan',
    }
    
    def get_country_name(self, code):
        """Get country name from code, using database first then fallback."""
        if not code:
            return ''
        
        # Try database first
        try:
            from apps.localization.models import Country
            country = Country.objects.filter(code=code).first()
            if country:
                return country.name
        except Exception:
            pass
        
        # Fallback to static mapping
        return self.COUNTRY_NAMES.get(code, code)
    
    def _get_countries(self):
        """Get list of countries for dropdown from admin-configured settings."""
        try:
            from apps.localization.models import Country
            countries = Country.objects.filter(
                is_active=True, 
                is_shipping_available=True
            ).order_by('sort_order', 'name').values('code', 'name')
            
            if countries.exists():
                return list(countries)
        except Exception:
            pass
        
        # Default fallback - Bangladesh only for now
        return [
            {'code': 'BD', 'name': 'Bangladesh'},
        ]
    
    def get_site_settings(self):
        """Get site settings with tax rate."""
        try:
            from apps.pages.models import SiteSettings
            return SiteSettings.get_settings()
        except Exception:
            return None
    
    def get_payment_gateways(self):
        """Get available payment gateways from database or fallback to defaults."""
        # Use user's selected currency from the currency switcher
        from apps.currencies.services import CurrencyService
        user_currency = CurrencyService.get_user_currency(
            user=self.request.user if self.request.user.is_authenticated else None,
            request=self.request
        )
        currency_code = user_currency.code if user_currency else 'BDT'
        
        # Try to get gateways from database
        try:
            from apps.payments.models import PaymentGateway
            db_gateways = PaymentGateway.get_active_gateways(currency=currency_code)
            
            if db_gateways:
                logger.debug('Found %d payment gateways in DB for currency %s', len(db_gateways), currency_code)
                gateways = []
                for g in db_gateways:
                    gateways.append({
                        'code': g.code,
                        'name': g.name,
                        'description': g.description,
                        'icon': g.icon_class or g.code,
                        'icon_url': g.icon.url if g.icon else f'/static/images/payments/{g.code}.svg',
                        'brand_icons': [],
                        'fee': float(g.fee_amount) if g.fee_type != 'none' else None,
                        'fee_text': g.fee_text,
                        'enabled': True,
                        'color': g.color,
                        'instructions': g.instructions,
                        # Expose publishable key for client-side integrations (Stripe)
                        'public_key': (g.api_key if g.code == g.CODE_STRIPE else None),
                        'requires_client': g.code == g.CODE_STRIPE,
                    })
                return gateways
        except Exception as exc:
            logger.exception('Error while loading payment gateways from DB: %s', exc)
        
        # If no gateways are configured in the DB, return an empty list.
        # We intentionally avoid placeholder/hardcoded gateways so production
        # uses only admin-configured payment providers.
        logger.warning('No payment gateways configured in DB for currency %s; not using placeholder defaults', currency_code)
        return []
    
    def get_common_context(self, checkout_session):
        """Get common context for all checkout steps."""
        # Get currency from user preference or request
        currency = CurrencyService.get_user_currency(
            user=self.request.user if self.request.user.is_authenticated else None,
            request=self.request
        )
        currency_symbol = currency.symbol if currency else '৳'
        currency_code = currency.code if currency else 'BDT'
        currency_decimal_places = currency.decimal_places if currency else 2
        currency_thousand_separator = currency.thousand_separator if currency else ','
        currency_decimal_separator = currency.decimal_separator if currency else '.'
        currency_symbol_position = currency.symbol_position if currency else 'before'
        # Heuristic locale mapping (keeps simple defaults; can be extended later)
        currency_locale = 'en-BD' if currency and getattr(currency, 'code', '') == 'BDT' else 'en-US'
        
        # Get site settings for tax
        site_settings = self.get_site_settings()
        tax_rate = float(site_settings.tax_rate) if site_settings else 0
        
        # Get payment gateways
        payment_gateways = self.get_payment_gateways()
        
        # Prefer gateway-provided stripe publishable key if available
        stripe_pub = getattr(settings, 'STRIPE_PUBLISHABLE_KEY', '')
        try:
            for g in payment_gateways:
                if g.get('code') == 'stripe' and g.get('public_key'):
                    stripe_pub = g.get('public_key')
                    break
        except Exception:
            pass

        # Build context with country names
        context = {
            'SITE_NAME': getattr(settings, 'SITE_NAME', 'Bunoraa'),
            'checkout_session': checkout_session,
            'checkout': checkout_session,  # Alias for templates
            'cart': checkout_session.cart if checkout_session else None,
            'stripe_publishable_key': stripe_pub,
            'currency': currency,
            'currency_symbol': currency_symbol,
            'currency_code': currency_code,
            'currency_locale': currency_locale,
            'currency_decimal_places': currency_decimal_places,
            'currency_thousand_separator': currency_thousand_separator,
            'currency_decimal_separator': currency_decimal_separator,
            'currency_symbol_position': currency_symbol_position,
            'tax_rate': tax_rate,
            'payment_gateways': payment_gateways,
            'countries': self._get_countries(),
            'country_names': self.COUNTRY_NAMES,
            'steps': [
                {'key': 'information', 'name': 'Information', 'number': 1},
                {'key': 'shipping', 'name': 'Shipping', 'number': 2},
                {'key': 'payment', 'name': 'Payment', 'number': 3},
            ],
        }
        
        # Add country name for shipping if available
        if checkout_session and checkout_session.shipping_country:
            context['shipping_country_name'] = self.get_country_name(checkout_session.shipping_country)
            # Resolve a 2-letter ISO country code if possible for client-side filtering
            try:
                sc = checkout_session.shipping_country
                if isinstance(sc, str) and len(sc) == 2 and sc.isalpha():
                    context['shipping_country_code'] = sc.upper()
                else:
                    # Try to match against available countries by name
                    for c in context.get('countries', []):
                        if c.get('name') and c.get('name').lower() == str(sc).lower():
                            context['shipping_country_code'] = c.get('code')
                            break
            except Exception:
                context['shipping_country_code'] = None

        if checkout_session and checkout_session.billing_country:
            context['billing_country_name'] = self.get_country_name(checkout_session.billing_country)
            try:
                bc = checkout_session.billing_country
                if isinstance(bc, str) and len(bc) == 2 and bc.isalpha():
                    context['billing_country_code'] = bc.upper()
                else:
                    for c in context.get('countries', []):
                        if c.get('name') and c.get('name').lower() == str(bc).lower():
                            context['billing_country_code'] = c.get('code')
                            break
            except Exception:
                context['billing_country_code'] = None
            
        return context
    
    def validate_cart(self, cart):
        """Validate cart before proceeding."""
        if not cart or not cart.items.exists():
            return False, "Your cart is empty."
        
        issues = CartService.validate_cart(cart)
        if issues:
            return False, issues
        
        return True, None


class CheckoutView(CheckoutMixin, TemplateView):
    """Main checkout entry - redirects to appropriate step."""
    
    def get(self, request, *args, **kwargs):
        cart = self.get_cart()
        
        if not cart or not cart.items.exists():
            messages.warning(request, 'Your cart is empty.')
            return redirect('cart:cart')
        
        # Validate cart
        is_valid, issues = self.validate_cart(cart)
        if not is_valid:
            if isinstance(issues, list):
                for issue in issues:
                    if isinstance(issue, dict):
                        messages.error(request, issue.get('issue', str(issue)))
                    else:
                        messages.error(request, str(issue))
            else:
                messages.error(request, issues)
            return redirect('cart:cart')
        
        checkout_session = self.get_checkout_session(cart)
        
        # Redirect to appropriate step based on current state
        if checkout_session.information_completed and checkout_session.shipping_completed:
            return redirect('checkout:payment')
        elif checkout_session.information_completed:
            return redirect('checkout:shipping')
        else:
            return redirect('checkout:information')


class InformationView(CheckoutMixin, View):
    """Customer information step - contact details and shipping address."""
    template_name = 'checkout/information.html'
    
    def get(self, request):
        cart = self.get_cart()
        
        is_valid, issues = self.validate_cart(cart)
        if not is_valid:
            messages.warning(request, 'Please review your cart.')
            return redirect('cart:cart')
        
        checkout_session = self.get_checkout_session(cart)
        
        from apps.currencies.services import CurrencyService
        target_currency = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)

        context = self.get_common_context(checkout_session)
        context.update({
            'page_title': 'Contact Information',
            'current_step': 'information',
            'cart_summary': CartService.get_cart_summary(cart, currency=target_currency),
            'cart_items': cart.items.select_related('product', 'variant').all() if cart else [],
        })

        # Precompute formatted gift wrap amount for templates (read from CartSettings)
        try:
            from apps.cart.models import CartSettings
            s = CartSettings.get_settings()
            if getattr(s, 'gift_wrap_enabled', False) and getattr(s, 'gift_wrap_amount', None) is not None:
                fee = s.gift_wrap_amount
            else:
                fee = None
            if fee is not None and fee > 0:
                context['formatted_gift_wrap'] = target_currency.format_amount(fee) if target_currency else f"{context.get('currency_symbol','৳')}{fee:,.2f}"
            else:
                context['formatted_gift_wrap'] = ''
        except Exception:
            context['formatted_gift_wrap'] = ''

        
        # Get saved addresses for authenticated users
        if request.user.is_authenticated:
            context['saved_addresses'] = request.user.addresses.filter(
                is_deleted=False
            ).order_by('-is_default', '-created_at')
        
        # Get countries list
        countries = self._get_countries()
        context['countries'] = countries
        # Build quick map code -> name for templates
        try:
            context['country_map'] = {c['code']: c['name'] for c in countries}
        except Exception:
            context['country_map'] = {}
        
        return render(request, self.template_name, context)
    
    def post(self, request):
        cart = self.get_cart()
        
        is_valid, issues = self.validate_cart(cart)
        if not is_valid:
            return redirect('cart:cart')
        
        checkout_session = self.get_checkout_session(cart)
        
        # Check for saved address selection
        saved_address_id = request.POST.get('saved_address')
        
        if saved_address_id and saved_address_id != 'new' and request.user.is_authenticated:
            # Use saved address
            try:
                saved_address = request.user.addresses.get(
                    id=saved_address_id,
                    is_deleted=False
                )
                # Parse full_name into first and last name
                name_parts = (saved_address.full_name or '').split(' ', 1)
                first_name = name_parts[0] if name_parts else request.user.first_name
                last_name = name_parts[1] if len(name_parts) > 1 else request.user.last_name
                
                data = {
                    'email': request.POST.get('email', request.user.email),
                    'first_name': first_name,
                    'last_name': last_name,
                    'company': '',
                    'phone': saved_address.phone or getattr(request.user, 'phone', ''),
                    'address_line_1': saved_address.address_line_1,
                    'address_line_2': saved_address.address_line_2 or '',
                    'city': saved_address.city,
                    'state': saved_address.state or '',
                    'postal_code': saved_address.postal_code,
                    'country': saved_address.country,
                    'subscribe_newsletter': request.POST.get('subscribe_newsletter') == 'on',
                    'is_gift': request.POST.get('is_gift') == 'on',
                    'gift_message': request.POST.get('gift_message', ''),
                    'gift_wrap': request.POST.get('gift_wrap') == 'on',
                    'order_notes': request.POST.get('order_notes', ''),
                }
            except Exception:
                messages.error(request, 'Selected address not found.')
                return redirect('checkout:information')
        else:
            # New address from form
            # Handle full_name - split into first and last name
            full_name = request.POST.get('full_name', '').strip()
            name_parts = full_name.split(' ', 1)
            first_name = name_parts[0] if name_parts else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Fall back to separate first/last name fields if full_name not provided
            if not first_name:
                first_name = request.POST.get('first_name', '')
            if not last_name:
                last_name = request.POST.get('last_name', '')
            
            data = {
                'email': request.POST.get('email', ''),
                'first_name': first_name,
                'last_name': last_name,
                'company': request.POST.get('company', ''),
                'phone': request.POST.get('phone', ''),
                'address_line_1': request.POST.get('address_line1', '') or request.POST.get('address_line_1', ''),
                'address_line_2': request.POST.get('address_line2', '') or request.POST.get('address_line_2', ''),
                'city': request.POST.get('city', ''),
                'state': request.POST.get('state', ''),
                'postal_code': request.POST.get('postal_code', ''),
                'country': request.POST.get('country', 'Bangladesh'),
                'save_address': request.POST.get('save_address') == 'true' or request.POST.get('save_address') == 'on',
                'subscribe_newsletter': request.POST.get('subscribe_newsletter') == 'on',
            }
        
        # Add gift options to data
        data['is_gift'] = request.POST.get('is_gift') == 'on'
        data['gift_message'] = request.POST.get('gift_message', '')
        data['gift_wrap'] = request.POST.get('gift_wrap') == 'on'
        data['order_notes'] = request.POST.get('order_notes', '')
        
        # Validate required fields
        required = ['email', 'address_line_1', 'city', 'postal_code']
        # Allow full_name or first_name
        if not data.get('first_name'):
            required.append('first_name')
        missing = [f for f in required if not data.get(f)]
        
        if missing:
            logger.warning('Missing required fields in InformationView POST: %s, checkout_session=%s', missing, getattr(checkout_session, 'id', None))
            for field in missing:
                messages.error(request, f'{field.replace("_", " ").title()} is required.')

            # Persist user-entered values so the form is not cleared on redirect
            try:
                checkout_session.email = data.get('email', checkout_session.email)
                checkout_session.shipping_email = data.get('email', checkout_session.shipping_email)
                checkout_session.shipping_first_name = data.get('first_name', checkout_session.shipping_first_name)
                checkout_session.shipping_last_name = data.get('last_name', checkout_session.shipping_last_name)
                checkout_session.shipping_phone = data.get('phone', checkout_session.shipping_phone)
                checkout_session.shipping_address_line_1 = data.get('address_line_1', checkout_session.shipping_address_line_1)
                checkout_session.shipping_address_line_2 = data.get('address_line_2', checkout_session.shipping_address_line_2)
                checkout_session.shipping_city = data.get('city', checkout_session.shipping_city)
                checkout_session.shipping_state = data.get('state', checkout_session.shipping_state)
                checkout_session.shipping_postal_code = data.get('postal_code', checkout_session.shipping_postal_code)
                checkout_session.shipping_country = data.get('country', checkout_session.shipping_country)
                # Gift options / order notes if present
                if 'is_gift' in data:
                    checkout_session.is_gift = data.get('is_gift')
                if 'gift_message' in data:
                    checkout_session.gift_message = data.get('gift_message')
                if 'gift_wrap' in data:
                    checkout_session.gift_wrap = data.get('gift_wrap')
                if 'order_notes' in data:
                    checkout_session.order_notes = data.get('order_notes')
                checkout_session.save()
            except Exception:
                logger.exception('Failed to persist form values for checkout %s', getattr(checkout_session, 'id', None))

            return redirect('checkout:information')
        
        try:
            CheckoutService.update_contact_information(checkout_session, data)
            return redirect('checkout:shipping')
        except CheckoutError as e:
            # Persist values when update fails and show message
            try:
                checkout_session.email = data.get('email', checkout_session.email)
                checkout_session.shipping_email = data.get('email', checkout_session.shipping_email)
                checkout_session.shipping_first_name = data.get('first_name', checkout_session.shipping_first_name)
                checkout_session.shipping_last_name = data.get('last_name', checkout_session.shipping_last_name)
                checkout_session.shipping_phone = data.get('phone', checkout_session.shipping_phone)
                checkout_session.shipping_address_line_1 = data.get('address_line_1', checkout_session.shipping_address_line_1)
                checkout_session.shipping_address_line_2 = data.get('address_line_2', checkout_session.shipping_address_line_2)
                checkout_session.shipping_city = data.get('city', checkout_session.shipping_city)
                checkout_session.shipping_state = data.get('state', checkout_session.shipping_state)
                checkout_session.shipping_postal_code = data.get('postal_code', checkout_session.shipping_postal_code)
                checkout_session.shipping_country = data.get('country', checkout_session.shipping_country)
                if 'is_gift' in data:
                    checkout_session.is_gift = data.get('is_gift')
                if 'gift_message' in data:
                    checkout_session.gift_message = data.get('gift_message')
                if 'gift_wrap' in data:
                    checkout_session.gift_wrap = data.get('gift_wrap')
                if 'order_notes' in data:
                    checkout_session.order_notes = data.get('order_notes')
                checkout_session.save()
            except Exception:
                logger.exception('Failed to persist form values after update_contact_information error for checkout %s', getattr(checkout_session, 'id', None))

            logger.exception('Failed to update contact information for checkout %s: %s', getattr(checkout_session, 'id', None), e)
            messages.error(request, str(e))
            return redirect('checkout:information')


class ShippingView(CheckoutMixin, View):
    """Shipping method selection step."""
    template_name = 'checkout/shipping.html'
    
    def get(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session or not checkout_session.information_completed:
            messages.warning(request, 'Please complete your information first.')
            return redirect('checkout:information')
        
        from apps.currencies.services import CurrencyService
        target_currency = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)

        context = self.get_common_context(checkout_session)
        context.update({
            'page_title': 'Shipping Method',
            'current_step': 'shipping',
            'cart_summary': CartService.get_cart_summary(cart, currency=target_currency),
            'checkout_summary': CheckoutService.get_checkout_summary(checkout_session),
            'cart_items': cart.items.select_related('product', 'variant').all() if cart else [],
            'shipping_options': CheckoutService.get_shipping_options(checkout_session),
            'pickup_locations': CheckoutService.get_pickup_locations(),
        })
        
        return render(request, self.template_name, context)
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session or not checkout_session.information_completed:
            return redirect('checkout:information')
        
        shipping_method = request.POST.get('shipping_method', CheckoutSession.SHIPPING_STANDARD)
        shipping_rate_id = request.POST.get('shipping_rate_id')
        pickup_location_id = request.POST.get('pickup_location_id')

        logger.info('ShippingView POST - Inputs: shipping_method=%s, shipping_rate_id=%s, pickup_location_id=%s, checkout=%s', shipping_method, shipping_rate_id, pickup_location_id, getattr(checkout_session, 'id', None))
        try:
            CheckoutService.set_shipping_method(
                checkout_session,
                shipping_method,
                shipping_rate_id=shipping_rate_id,
                pickup_location_id=pickup_location_id
            )
            
            # Handle order notes if provided
            order_notes = request.POST.get('order_notes', '')
            delivery_instructions = request.POST.get('delivery_instructions', '')
            if order_notes or delivery_instructions:
                CheckoutService.set_order_notes(checkout_session, order_notes, delivery_instructions)
            
            return redirect('checkout:payment')
        
        except CheckoutError as e:
            # Persist user inputs so form is not reset
            try:
                checkout_session.shipping_method = shipping_method or checkout_session.shipping_method
                # Save selected rate if valid
                if shipping_rate_id:
                    from apps.shipping.models import ShippingRate
                    rate = ShippingRate.objects.filter(id=shipping_rate_id).first()
                    if rate:
                        checkout_session.shipping_rate = rate
                # Save pickup location selection if provided
                if pickup_location_id:
                    from apps.contacts.models import StoreLocation
                    loc = StoreLocation.objects.filter(id=pickup_location_id, is_active=True).first()
                    if loc:
                        checkout_session.pickup_location = loc
                checkout_session.order_notes = request.POST.get('order_notes', checkout_session.order_notes)
                checkout_session.delivery_instructions = request.POST.get('delivery_instructions', checkout_session.delivery_instructions)
                checkout_session.save()
            except Exception:
                logger.exception('Failed to persist shipping form values for checkout %s', getattr(checkout_session, 'id', None))

            logger.exception('Failed to set shipping method for checkout %s: %s', getattr(checkout_session, 'id', None), e)
            messages.error(request, str(e))
            return redirect('checkout:shipping')


class PaymentView(CheckoutMixin, View):
    """Payment method and processing step."""
    template_name = 'checkout/payment.html'
    
    def get(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session or not checkout_session.shipping_completed:
            messages.warning(request, 'Please select a shipping method first.')
            return redirect('checkout:shipping')
        
        # Create payment intent if using Stripe
        payment_intent = None
        if checkout_session.payment_method == CheckoutSession.PAYMENT_STRIPE:
            try:
                payment_intent = CheckoutService.create_payment_intent(checkout_session)
            except Exception as e:
                messages.warning(request, 'Could not initialize card payment. Please try another method.')
        
        # Get common context (includes payment_gateways from backend)
        context = self.get_common_context(checkout_session)
        
        # Sync billing address from shipping if billing is empty
        billing_data = self._get_billing_sync_data(checkout_session)
        
        context.update({
            'page_title': 'Payment',
            'current_step': 'payment',
            'checkout_summary': CheckoutService.get_checkout_summary(checkout_session),
            'payment_intent': payment_intent,
            'client_secret': checkout_session.stripe_client_secret,
            'cart_items': cart.items.select_related('product', 'variant').all(),
            # Billing sync data for JS
            'billing_sync_data': billing_data,
        })
        
        # Get saved payment methods for authenticated users
        if request.user.is_authenticated:
            context['saved_payment_methods'] = request.user.payment_methods.filter(
                is_active=True
            ).order_by('-is_default', '-created_at')
        
        return render(request, self.template_name, context)
    
    def _get_billing_sync_data(self, checkout_session):
        """Get shipping data to sync with billing if billing is empty."""
        if checkout_session.billing_same_as_shipping:
            return {
                'sync': True,
                'first_name': checkout_session.shipping_first_name,
                'last_name': checkout_session.shipping_last_name,
                'address_line_1': checkout_session.shipping_address_line_1,
                'address_line_2': checkout_session.shipping_address_line_2 or '',
                'city': checkout_session.shipping_city,
                'state': checkout_session.shipping_state or '',
                'postal_code': checkout_session.shipping_postal_code,
                'country': checkout_session.shipping_country,
                'country_name': self.get_country_name(checkout_session.shipping_country),
            }
        return {'sync': False}
        
        return render(request, self.template_name, context)
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session or not checkout_session.shipping_completed:
            return redirect('checkout:shipping')
        
        payment_method = request.POST.get('payment_method', CheckoutSession.PAYMENT_COD)
        saved_payment_method_id = request.POST.get('saved_payment_method_id')
        
        logger.info(f"PaymentView POST - Payment method received: {payment_method}")
        logger.info(f"PaymentView POST - Checkout session ID: {checkout_session.id}")
        
        # Handle billing address
        billing_same = request.POST.get('billing_same_as_shipping') == 'on'
        if not billing_same:
            billing_data = {
                'same_as_shipping': False,
                'first_name': request.POST.get('billing_first_name', ''),
                'last_name': request.POST.get('billing_last_name', ''),
                'address_line_1': request.POST.get('billing_address_line_1', ''),
                'address_line_2': request.POST.get('billing_address_line_2', ''),
                'city': request.POST.get('billing_city', ''),
                'state': request.POST.get('billing_state', ''),
                'postal_code': request.POST.get('billing_postal_code', ''),
                'country': request.POST.get('billing_country', 'Bangladesh'),
            }
            CheckoutService.update_billing_address(checkout_session, billing_data)
        else:
            CheckoutService.update_billing_address(checkout_session, {'same_as_shipping': True})
        
        # Note: Gift options are set in InformationView, not here.
        # Only update gift options if they are explicitly in the form
        if 'is_gift' in request.POST:
            is_gift = request.POST.get('is_gift') == 'on'
            gift_message = request.POST.get('gift_message', '')
            gift_wrap = request.POST.get('gift_wrap') == 'on'
            CheckoutService.set_gift_options(checkout_session, is_gift, gift_message, gift_wrap)
        
        try:
            CheckoutService.set_payment_method(
                checkout_session,
                payment_method,
                saved_payment_method_id=saved_payment_method_id
            )
            
            # Refresh checkout session to verify save
            checkout_session.refresh_from_db()
            logger.info(f"PaymentView POST - Payment method after save: {checkout_session.payment_method}")
            logger.info(f"PaymentView POST - payment_setup_completed: {checkout_session.payment_setup_completed}")
            
            # For online payment methods, stay on page or redirect to gateway
            if payment_method == CheckoutSession.PAYMENT_STRIPE:
                # Create/update payment intent
                CheckoutService.create_payment_intent(checkout_session)
            
            return redirect('checkout:review')
        
        except CheckoutError as e:
            # Persist billing and selection so user doesn't lose data
            try:
                checkout_session.billing_same_as_shipping = billing_same
                if not billing_same:
                    checkout_session.billing_first_name = billing_data.get('first_name', checkout_session.billing_first_name)
                    checkout_session.billing_last_name = billing_data.get('last_name', checkout_session.billing_last_name)
                    checkout_session.billing_address_line_1 = billing_data.get('address_line_1', checkout_session.billing_address_line_1)
                    checkout_session.billing_address_line_2 = billing_data.get('address_line_2', checkout_session.billing_address_line_2)
                    checkout_session.billing_city = billing_data.get('city', checkout_session.billing_city)
                    checkout_session.billing_state = billing_data.get('state', checkout_session.billing_state)
                    checkout_session.billing_postal_code = billing_data.get('postal_code', checkout_session.billing_postal_code)
                    checkout_session.billing_country = billing_data.get('country', checkout_session.billing_country)
                # Save selected payment choice so form remains filled
                checkout_session.payment_method = payment_method or checkout_session.payment_method
                checkout_session.save()
            except Exception:
                logger.exception('Failed to persist payment form values for checkout %s', getattr(checkout_session, 'id', None))

            logger.error(f"PaymentView POST - Error: {e}")
            messages.error(request, str(e))
            return redirect('checkout:payment')


class ReviewView(CheckoutMixin, View):
    """Order review step before final submission."""
    template_name = 'checkout/review.html'
    
    def get(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        logger.info(f"ReviewView GET - Checkout session: {checkout_session}")
        if checkout_session:
            logger.info(f"ReviewView GET - payment_setup_completed: {checkout_session.payment_setup_completed}")
            logger.info(f"ReviewView GET - payment_method: {checkout_session.payment_method}")
        
        if not checkout_session or not checkout_session.payment_setup_completed:
            messages.warning(request, 'Please select a payment method first.')
            return redirect('checkout:payment')
        
        # Validate entire checkout
        validation_issues = CheckoutService.validate_checkout(checkout_session)
        
        logger.info(f"ReviewView GET - Validation issues: {validation_issues}")
        
        if validation_issues:
            for issue in validation_issues:
                messages.warning(request, issue.get('message', 'Please complete all required information.'))
            
            # Redirect to appropriate step
            if any(i.get('code') == 'empty_cart' for i in validation_issues):
                return redirect('cart:cart')
            elif not checkout_session.information_completed:
                return redirect('checkout:information')
            elif not checkout_session.shipping_completed:
                return redirect('checkout:shipping')
        
        # Mark review step
        CheckoutService.proceed_to_review(checkout_session)
        
        from apps.currencies.services import CurrencyService
        target_currency = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)

        context = self.get_common_context(checkout_session)
        context.update({
            'page_title': 'Review Order',
            'current_step': 'review',
            'checkout_summary': CheckoutService.get_checkout_summary(checkout_session),
            'cart_items': cart.items.select_related('product', 'variant').all(),
            'cart_summary': CartService.get_cart_summary(cart, currency=target_currency),
        })
        
        return render(request, self.template_name, context)


class CompleteView(CheckoutMixin, View):
    """Complete checkout and create order."""
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            messages.error(request, 'Checkout session not found.')
            return redirect('checkout:checkout')
        
        logger.info(f"CompleteView POST - Checkout session: {checkout_session.id}")
        logger.info(f"CompleteView POST - payment_method: '{checkout_session.payment_method}'")
        logger.info(f"CompleteView POST - payment_setup_completed: {checkout_session.payment_setup_completed}")
        logger.info(f"CompleteView POST - can_complete: {checkout_session.can_complete}")
        
        # Pre-validate before completing
        validation_issues = CheckoutService.validate_checkout(checkout_session)
        if validation_issues:
            logger.warning(f"CompleteView POST - Validation issues: {validation_issues}")
            # Log detailed state for debugging
            logger.warning(f"CompleteView POST - Debug state: cart={checkout_session.cart_id}, "
                          f"user={checkout_session.user_id}, session_key={checkout_session.session_key}")
            for issue in validation_issues:
                messages.error(request, issue.get('message', 'Please complete all required information.'))
            return redirect('checkout:review')
        
        # Get payment intent if Stripe
        payment_intent_id = request.POST.get('payment_intent_id')
        
        # Add final notes if provided
        order_notes = request.POST.get('order_notes', '')
        if order_notes:
            checkout_session.order_notes = order_notes
            checkout_session.save()
        
        # Complete checkout
        try:
            order, error = CheckoutService.complete_checkout(
                checkout_session,
                payment_intent_id=payment_intent_id
            )
            
            if error:
                logger.error(f"CompleteView POST - Checkout error: {error}")
                messages.error(request, f'Checkout failed: {error}')
                return redirect('checkout:review')
            
            if order:
                messages.success(request, 'Your order has been placed successfully!')
                return redirect('checkout:success', order_id=order.id)
            
            messages.error(request, 'Failed to create order. Please try again.')
            return redirect('checkout:review')
        
        except Exception as e:
            logger.exception(f"CompleteView POST - Exception: {e}")
            messages.error(request, f'An error occurred: {str(e)}')
            return redirect('checkout:review')


class SuccessView(TemplateView):
    """Order success page."""
    template_name = 'checkout/success.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        order_id = self.kwargs.get('order_id')
        
        # Get order
        order = get_object_or_404(Order, id=order_id)
        
        # Security check
        if self.request.user.is_authenticated:
            if order.user and order.user != self.request.user:
                from django.http import Http404
                raise Http404("Order not found")
        else:
            # For guest orders, verify by session or email
            checkout_session = CheckoutSession.objects.filter(
                order=order,
                session_key=self.request.session.session_key
            ).first()
            
            if not checkout_session:
                from django.http import Http404
                raise Http404("Order not found")
        
        # Try to find the checkout session associated with this order so we can show the same currency/summary
        checkout_session = CheckoutSession.objects.filter(order=order).select_related('cart').first()
        cart_summary = None
        currency_symbol_local = None
        currency_code_local = None

        try:
            from apps.cart.services import CartService
            from apps.currencies.services import CurrencyService
            if checkout_session and getattr(checkout_session, 'cart', None):
                currency_obj = CurrencyService.get_currency_by_code(checkout_session.currency) if getattr(checkout_session, 'currency', None) else None
                cart_summary = CartService.get_cart_summary(checkout_session.cart, currency=currency_obj)
                if cart_summary and cart_summary.get('currency'):
                    currency_symbol_local = cart_summary['currency'].get('symbol')
                    currency_code_local = cart_summary['currency'].get('code')
        except Exception:
            # Fall back to default currency settings
            try:
                from apps.currencies.services import CurrencyService
                default_cur = CurrencyService.get_default_currency()
                currency_symbol_local = getattr(default_cur, 'symbol', None)
                currency_code_local = getattr(default_cur, 'code', None)
            except Exception:
                currency_symbol_local = None
                currency_code_local = None

        # Compute display/converted shipping and formatted totals in the checkout currency
        display_shipping = order.shipping_cost
        formatted_shipping = None
        formatted_subtotal = None
        display_total = order.total
        formatted_total = None
        try:
            from apps.currencies.services import CurrencyService, CurrencyConversionService
            checkout_currency = CurrencyService.get_currency_by_code(currency_code_local) if currency_code_local else CurrencyService.get_default_currency()

            # If shipping_rate exists and has a currency different from checkout currency, convert order.shipping_cost
            if checkout_session and getattr(checkout_session, 'shipping_rate', None):
                rate_currency_obj = getattr(checkout_session.shipping_rate, 'currency', None)
                if rate_currency_obj and checkout_currency and rate_currency_obj.code != checkout_currency.code:
                    try:
                        display_shipping = CurrencyConversionService.convert_by_code(order.shipping_cost, rate_currency_obj.code, checkout_currency.code)
                    except Exception:
                        display_shipping = order.shipping_cost

            # Recompute items subtotal from order items (safer for historical orders)
            try:
                items_total = sum((Decimal(str(it.unit_price)) * Decimal(it.quantity)) for it in order.items.all())
            except Exception:
                items_total = order.subtotal or Decimal('0')

            # Recompute a display total using converted shipping and computed items_total
            display_total = (items_total or Decimal('0')) - (order.discount or Decimal('0')) + (display_shipping or Decimal('0')) + (order.tax or Decimal('0')) + (order.gift_wrap_cost or Decimal('0'))

            # Formatted strings
            formatted_subtotal = checkout_currency.format_amount(items_total.quantize(Decimal('0.01'))) if checkout_currency else f"{currency_symbol_local}{items_total}"
            formatted_shipping = 'Free' if Decimal(str(display_shipping)) == Decimal('0') else (checkout_currency.format_amount(display_shipping) if checkout_currency else f"{currency_symbol_local}{display_shipping}")
            formatted_total = checkout_currency.format_amount(display_total.quantize(Decimal('0.01'))) if checkout_currency else f"{currency_symbol_local}{display_total}"
            # Tax and discount formatting — prefer checkout session tax_amount when available
            sess_tax = None
            try:
                if checkout_session and getattr(checkout_session, 'tax_amount', None) is not None:
                    sess_tax = Decimal(str(checkout_session.tax_amount))
            except Exception:
                sess_tax = None

            tax_to_display = sess_tax if sess_tax is not None else (order.tax or Decimal('0.00'))
            formatted_tax = '' if not tax_to_display else (checkout_currency.format_amount(tax_to_display) if checkout_currency else f"{currency_symbol_local}{tax_to_display}")

            formatted_discount = ''
            if getattr(order, 'discount', None) and order.discount > 0:
                formatted_discount = checkout_currency.format_amount(order.discount) if checkout_currency else f"{currency_symbol_local}{order.discount}"
        except Exception:
            # Fallback to simple formatting
            formatted_subtotal = f"{currency_symbol_local}{order.subtotal}"
            formatted_shipping = f"{currency_symbol_local}{order.shipping_cost}"
            formatted_total = f"{currency_symbol_local}{order.total}"
            formatted_tax = f"{currency_symbol_local}{order.tax}"
            formatted_discount = f"{currency_symbol_local}{order.discount}"
        context.update({
            'page_title': f'Order Confirmed - {order.order_number}',
            'order': order,
            'order_items': order.items.select_related('product', 'variant').all(),
            'cart_summary': cart_summary,
            'currency_symbol_local': currency_symbol_local,
            'currency_code_local': currency_code_local,
            'display_shipping': display_shipping,
            'formatted_shipping': formatted_shipping,
            'formatted_subtotal': formatted_subtotal,
            'display_total': display_total,
            'formatted_total': formatted_total,
            'formatted_tax': formatted_tax,
            'formatted_discount': formatted_discount,
        })
        
        return context


# API-like views for AJAX operations

class ApplyCouponView(CheckoutMixin, View):
    """Apply coupon code via AJAX."""
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            return JsonResponse({
                'success': False,
                'message': 'Checkout session not found'
            }, status=400)
        
        # Handle both JSON and form-encoded data
        if request.content_type == 'application/json':
            import json
            try:
                data = json.loads(request.body)
                coupon_code = data.get('coupon_code', '').strip()
            except json.JSONDecodeError:
                coupon_code = ''
        else:
            coupon_code = request.POST.get('coupon_code', '').strip()
        
        if not coupon_code:
            return JsonResponse({
                'success': False,
                'message': 'Please enter a coupon code'
            }, status=400)
        
        success, message = CheckoutService.apply_coupon(checkout_session, coupon_code)
        
        if success:
            summary = CheckoutService.get_checkout_summary(checkout_session)
            return JsonResponse({
                'success': True,
                'message': message,
                'discount': summary['discount'],
                'formatted_discount': summary['formatted_discount'],
                'total': summary['total'],
                'formatted_total': summary['formatted_total'],
            })
        else:
            return JsonResponse({
                'success': False,
                'message': message
            }, status=400)


class RemoveCouponView(CheckoutMixin, View):
    """Remove coupon code via AJAX."""
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            return JsonResponse({
                'success': False,
                'message': 'Checkout session not found'
            }, status=400)
        
        CheckoutService.remove_coupon(checkout_session)
        
        summary = CheckoutService.get_checkout_summary(checkout_session)
        return JsonResponse({
            'success': True,
            'message': 'Coupon removed',
            'total': summary['total'],
            'formatted_total': summary['formatted_total'],
        })


class UpdateShippingMethodView(CheckoutMixin, View):
    """Update shipping method via AJAX."""
    
    def post(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            return JsonResponse({
                'success': False,
                'message': 'Checkout session not found'
            }, status=400)
        
        shipping_method = request.POST.get('shipping_method')
        shipping_rate_id = request.POST.get('shipping_rate_id')
        pickup_location_id = request.POST.get('pickup_location_id')
        
        try:
            CheckoutService.set_shipping_method(
                checkout_session,
                shipping_method,
                shipping_rate_id=shipping_rate_id,
                pickup_location_id=pickup_location_id
            )
            
            summary = CheckoutService.get_checkout_summary(checkout_session)
            return JsonResponse({
                'success': True,
                'shipping_cost': summary['shipping_cost'],
                'formatted_shipping': summary['formatted_shipping'],
                'total': summary['total'],
                'formatted_total': summary['formatted_total'],
            })
        
        except CheckoutError as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=400)


class GetCheckoutSummaryView(CheckoutMixin, View):
    """Get current checkout summary via AJAX."""
    
    def get(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            return JsonResponse({
                'success': False,
                'message': 'Checkout session not found'
            }, status=400)
        
        summary = CheckoutService.get_checkout_summary(checkout_session)
        return JsonResponse({
            'success': True,
            'data': summary
        })


class ValidateCheckoutView(CheckoutMixin, View):
    """Validate checkout before completion via AJAX."""
    
    def get(self, request):
        cart = self.get_cart()
        checkout_session = self.get_checkout_session(cart)
        
        if not checkout_session:
            return JsonResponse({
                'success': False,
                'valid': False,
                'issues': [{'message': 'Checkout session not found'}]
            }, status=400)
        
        issues = CheckoutService.validate_checkout(checkout_session)
        
        return JsonResponse({
            'success': True,
            'valid': len(issues) == 0,
            'issues': issues,
            'can_complete': checkout_session.can_complete,
        })

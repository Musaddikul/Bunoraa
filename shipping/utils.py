# shipping/utils.py
from decimal import Decimal
import random
import string
from django.utils import timezone
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def calculate_volumetric_weight(l_cm: Decimal, w_cm: Decimal, h_cm: Decimal, divisor: int = 5000) -> Decimal:
    """
    Calculates volumetric weight in kilograms.

    Formula: (Length * Width * Height) / Divisor

    Args:
        l_cm (Decimal): Length in centimeters.
        w_cm (Decimal): Width in centimeters.
        h_cm (Decimal): Height in centimeters.
        divisor (int): The volumetric divisor (e.g., 5000 for air freight, 6000 for sea freight).

    Returns:
        Decimal: The calculated volumetric weight in kilograms, rounded to two decimal places.
    """
    if not all([l_cm, w_cm, h_cm, divisor]):
        return Decimal('0.00')
    try:
        volume = l_cm * w_cm * h_cm
        return (volume / Decimal(divisor)).quantize(Decimal('0.01'))
    except Exception as e:
        logger.error(f"Error calculating volumetric weight: {e}", exc_info=True)
        return Decimal('0.00')

class CarrierAPIMockClient:
    """
    A mock API client to simulate interactions with external shipping carrier APIs.
    In a real application, this would be replaced by actual API integration code
    (e.g., using `requests` library to call carrier's REST APIs).
    """
    def __init__(self, carrier_name: str, api_key: str = None, base_url: str = None, credentials: dict = None):
        """
        Initializes the mock client.

        Args:
            carrier_name (str): The name of the carrier this client represents.
            api_key (str, optional): Mock API key.
            base_url (str, optional): Mock API base URL.
            credentials (dict, optional): Mock additional credentials.
        """
        self.carrier_name = carrier_name
        self.api_key = api_key
        self.base_url = base_url
        self.credentials = credentials
        logger.info(f"Initialized mock API client for {carrier_name}")

    def _generate_tracking_number(self) -> str:
        """Generates a mock tracking number."""
        prefix = ''.join(random.choices(string.ascii_uppercase, k=2))
        digits = ''.join(random.choices(string.digits, k=10))
        return f"{prefix}{digits}"

    def book_parcel(self, from_address: dict, to_address: dict, weight_kg: Decimal, dims_cm: dict, service_code: str, order_id: str) -> dict:
        """
        Simulates booking a parcel with the carrier.

        Args:
            from_address (dict): Sender's address details.
            to_address (dict): Recipient's address details.
            weight_kg (Decimal): Package weight.
            dims_cm (dict): Package dimensions.
            service_code (str): Carrier-specific service code.
            order_id (str): Internal order ID.

        Returns:
            dict: Mock API response for booking.
        """
        logger.info(f"Mocking booking for {self.carrier_name}: Order {order_id}, Service {service_code}")
        if random.random() < 0.1: # 10% chance of failure
            return {'success': False, 'error_message': 'Simulated booking failure: Carrier system error.'}
        
        tracking_number = self._generate_tracking_number()
        return {
            'success': True,
            'tracking_number': tracking_number,
            'label_url': f"https://mocklabel.com/{tracking_number}.pdf",
            'estimated_delivery_date': (timezone.now() + timezone.timedelta(days=random.randint(2, 7))).isoformat(),
            'carrier_reference_id': f"CR-{random.randint(10000, 99999)}",
            'raw_response': {'status': 'OK', 'details': 'Mock booking successful'}
        }

    def get_tracking_status(self, tracking_number: str) -> dict:
        """
        Simulates fetching tracking status for a parcel.

        Args:
            tracking_number (str): The tracking number to query.

        Returns:
            dict: Mock API response for tracking status.
        """
        logger.info(f"Mocking tracking status for {self.carrier_name}: {tracking_number}")
        if random.random() < 0.05: # 5% chance of error
            return {'success': False, 'error_message': 'Simulated tracking API error.'}

        statuses = [
            'PENDING', 'BOOKED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED'
        ]
        
        # Simulate progression
        current_status_index = random.randint(0, len(statuses) - 1)
        current_status = statuses[current_status_index]

        events = []
        for i in range(current_status_index + 1):
            event_type = statuses[i]
            description = f"Package {event_type.replace('_', ' ').lower()}."
            location = f"City {random.randint(1, 10)}"
            timestamp = (timezone.now() - timezone.timedelta(hours=random.randint(1, 24 * (len(statuses) - i)))).isoformat()
            events.append({
                'type': event_type,
                'description': description,
                'location': location,
                'timestamp': timestamp
            })

        return {
            'success': True,
            'tracking_number': tracking_number,
            'current_status': current_status,
            'events': events,
            'raw_response': {'status': 'OK', 'details': 'Mock tracking data'}
        }

    def request_pickup(self, shipment_id: str, tracking_number: str, pickup_address: dict, scheduled_time: timezone.datetime) -> dict:
        """
        Simulates requesting a pickup.

        Args:
            shipment_id (str): Internal shipment ID.
            tracking_number (str): Carrier tracking number.
            pickup_address (dict): Address for pickup.
            scheduled_time (datetime): Requested pickup time.

        Returns:
            dict: Mock API response for pickup request.
        """
        logger.info(f"Mocking pickup request for {self.carrier_name}: Shipment {shipment_id}")
        if random.random() < 0.15: # 15% chance of failure
            return {'success': False, 'error_message': 'Simulated pickup scheduling conflict.'}
        
        confirmation_id = f"PUC-{random.randint(100000, 999999)}"
        return {
            'success': True,
            'confirmation_id': confirmation_id,
            'scheduled_time': scheduled_time.isoformat(),
            'raw_response': {'status': 'OK', 'details': 'Mock pickup scheduled'}
        }

    def generate_label(self, shipment_id: str, tracking_number: str, package_details: dict, from_address: dict, to_address: dict) -> dict:
        """
        Simulates generating a shipping label.

        Args:
            shipment_id (str): Internal shipment ID.
            tracking_number (str): Carrier tracking number.
            package_details (dict): Weight, dimensions, service code.
            from_address (dict): Sender's address.
            to_address (dict): Recipient's address.

        Returns:
            dict: Mock API response for label generation.
        """
        logger.info(f"Mocking label generation for {self.carrier_name}: Shipment {shipment_id}")
        if random.random() < 0.08: # 8% chance of failure
            return {'success': False, 'error_message': 'Simulated label generation error: Invalid package data.'}
        
        label_url = f"https://mocklabel.com/generated/{tracking_number}_label.pdf"
        return {
            'success': True,
            'label_url': label_url,
            'raw_response': {'status': 'OK', 'details': 'Mock label generated'}
        }
    
    def cancel_shipment(self, tracking_number: str) -> dict:
        """
        Simulates cancelling a shipment.

        Args:
            tracking_number (str): The tracking number of the shipment to cancel.

        Returns:
            dict: Mock API response for cancellation.
        """
        logger.info(f"Mocking cancellation for {self.carrier_name}: {tracking_number}")
        if random.random() < 0.05: # 5% chance of failure
            return {'success': False, 'error_message': 'Simulated cancellation error: Shipment already processed.'}
        
        return {
            'success': True,
            'message': 'Shipment cancelled successfully.',
            'raw_response': {'status': 'OK', 'details': 'Mock cancellation successful'}
        }


def get_carrier_api_client(carrier) -> CarrierAPIMockClient | None:
    """
    Factory function to get an API client for a given carrier.
    In a real system, this would return an instance of a specific carrier's SDK client.

    Args:
        carrier (ShippingCarrier): The ShippingCarrier object.

    Returns:
        CarrierAPIMockClient | None: An instance of a mock API client, or None if not configured.
    """
    # This is where you would map carrier.code to actual API client classes
    # For now, we return a generic mock client.
    if carrier.api_base_url: # Only return a client if API is configured
        return CarrierAPIMockClient(
            carrier_name=carrier.name,
            api_key=carrier.api_key,
            base_url=carrier.api_base_url,
            credentials=carrier.get_credentials()
        )
    return None

if not hasattr(settings, 'OUR_WAREHOUSE_ADDRESS'):
    settings.OUR_WAREHOUSE_ADDRESS = {
        'address_line1': 'Bozra, Ulipur',
        'city': 'Kurigram',
        'state': 'Rangpur Division',
        'postal_code': '5621',
        'country': 'Bangladesh',
        'phone_number': '+880701922629',
        'contact_name': 'Bunoraa'
    }
    logger.warning("settings.OUR_WAREHOUSE_ADDRESS is not defined. Using mock address.")


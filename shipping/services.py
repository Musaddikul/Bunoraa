# shipping/services.py
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.core.cache import cache
from django.conf import settings
from django.db import transaction
from django.utils import timezone
import logging
import random # For mock responses

from .models import ShippingZone, ShippingMethod, ShippingCarrier, Shipment, ShipmentEvent, ShipmentStatusUpdate
from .utils import calculate_volumetric_weight, get_carrier_api_client, CarrierAPIMockClient
from accounts.models import UserAddress # Assuming UserAddress is in accounts app
from custom_order.models import CustomOrder # Assuming CustomOrder is in custom_order app

logger = logging.getLogger(__name__)

CACHE_TIMEOUT = 60 * 60 # Cache for 1 hour

def get_zone_for_address(address: UserAddress) -> ShippingZone | None:
    """
    Retrieves the appropriate ShippingZone for a given UserAddress.
    Caches the result for performance.

    Args:
        address (UserAddress): The user's address object.

    Returns:
        ShippingZone | None: The matched ShippingZone object, or None if no zone is found.
    """
    region_names = []
    if hasattr(address, 'upazila') and address.upazila:
        region_names.append(address.upazila)
    if hasattr(address, 'city') and address.city:
        region_names.append(address.city)
    if hasattr(address, 'state') and address.state: # Assuming 'state' can map to a region
        region_names.append(address.state)
    if hasattr(address, 'postal_code') and address.postal_code: # Use postal code for direct zone lookup
        # Attempt to find zone by exact postal code match first
        cache_key_postal = f"zone_for_postal_{address.postal_code}"
        zone = cache.get(cache_key_postal)
        if zone:
            return zone
        
        # Check postal code ranges
        for zone_candidate in ShippingZone.objects.filter(is_active=True, postal_codes__isnull=False):
            if zone_candidate.postal_codes:
                for pc_entry in zone_candidate.postal_codes:
                    if isinstance(pc_entry, str):
                        if '-' in pc_entry:
                            start, end = map(int, pc_entry.split('-'))
                            if start <= int(address.postal_code) <= end:
                                cache.set(cache_key_postal, zone_candidate, CACHE_TIMEOUT)
                                return zone_candidate
                        elif pc_entry == address.postal_code:
                            cache.set(cache_key_postal, zone_candidate, CACHE_TIMEOUT)
                            return zone_candidate
        
    if not region_names:
        logger.warning(f"No valid region information found for address ID: {address.id}")
        return None

    for region_name in region_names:
        cache_key = f"zone_for_region_{region_name.lower().replace(' ', '_')}"
        zone = cache.get(cache_key)
        if zone is None:
            zone = ShippingZone.objects.filter(regions__name__iexact=region_name, is_active=True).first()
            if zone:
                cache.set(cache_key, zone, CACHE_TIMEOUT)
        if zone:
            return zone
    
    logger.info(f"No active shipping zone found for address: {address.full_name}, regions: {region_names}")
    return None

def calculate_shipping_cost(
    shipping_method: ShippingMethod,
    address: UserAddress,
    weight_kg: Decimal,
    order_total: Decimal,
    dimensions_cm: dict = None, # {'l': Decimal, 'w': Decimal, 'h': Decimal}
    is_express: bool = False # This parameter might become redundant if is_express is on method
) -> Decimal:
    """
    Calculates the final shipping cost for a given method, address, weight, and order total.
    Applies zone-based pricing, method-specific rates, and free shipping thresholds.

    Args:
        shipping_method (ShippingMethod): The selected shipping method object.
        address (UserAddress): The user's shipping address.
        weight_kg (Decimal): The actual weight of the package in kilograms.
        order_total (Decimal): The total value of the order.
        dimensions_cm (dict, optional): Dictionary with 'l', 'w', 'h' in cm. Defaults to None.
        is_express (bool, optional): Indicates if express service is requested.
                                     (Can be derived from shipping_method.is_express).

    Returns:
        Decimal: The calculated shipping cost.

    Raises:
        ValidationError: If the method is not available for the address zone,
                         or if weight/dimensions are outside method limits.
    """
    try:
        address_zone = get_zone_for_address(address)
        if address_zone not in shipping_method.zones.all():
            raise ValidationError(_("Selected shipping method is not available for your address's zone."))

        # Check for free shipping threshold first
        if order_total >= address_zone.free_shipping_threshold > 0:
            return Decimal('0.00')

        # Validate weight and dimensions against method limits
        if shipping_method.min_weight_kg and weight_kg < shipping_method.min_weight_kg:
            raise ValidationError(_(f"Weight is below minimum allowed for this method ({shipping_method.min_weight_kg} kg)."))
        if shipping_method.max_weight_kg and weight_kg > shipping_method.max_weight_kg:
            raise ValidationError(_(f"Weight exceeds maximum allowed for this method ({shipping_method.max_weight_kg} kg)."))

        if dimensions_cm:
            l, w, h = dimensions_cm.get('l', Decimal('0')), dimensions_cm.get('w', Decimal('0')), dimensions_cm.get('h', Decimal('0'))
            if shipping_method.min_dims_cm:
                min_l = shipping_method.min_dims_cm.get('l', Decimal('0'))
                min_w = shipping_method.min_dims_cm.get('w', Decimal('0'))
                min_h = shipping_method.min_dims_cm.get('h', Decimal('0'))
                if l < min_l or w < min_w or h < min_h:
                    raise ValidationError(_(f"Dimensions are below minimum allowed for this method (Min L:{min_l}, W:{min_w}, H:{min_h} cm)."))
            if shipping_method.max_dims_cm:
                max_l = shipping_method.max_dims_cm.get('l', Decimal('0'))
                max_w = shipping_method.max_dims_cm.get('w', Decimal('0'))
                max_h = shipping_method.max_dims_cm.get('h', Decimal('0'))
                if l > max_l or w > max_w or h > max_h:
                    raise ValidationError(_(f"Dimensions exceed maximum allowed for this method (Max L:{max_l}, W:{max_w}, H:{max_h} cm)."))

        # Calculate chargeable weight (actual vs volumetric)
        chargeable_weight = weight_kg
        if dimensions_cm and all(k in dimensions_cm for k in ['l', 'w', 'h']):
            vol_weight = calculate_volumetric_weight(
                dimensions_cm['l'], dimensions_cm['w'], dimensions_cm['h'], address_zone.volumetric_divisor
            )
            chargeable_weight = max(weight_kg, vol_weight)
        
        cost = shipping_method.base_charge + (shipping_method.price_per_kg * chargeable_weight)
        cost += address_zone.base_cost
        return cost.quantize(Decimal('0.01'))

    except ValidationError as e:
        raise e
    except Exception as e:
        logger.error(f"Error in calculate_shipping_cost: {e}", exc_info=True)
        raise ValidationError(_(f"Shipping calculation failed: {e}"))

@transaction.atomic
def create_shipment_for_order(
    order: CustomOrder,
    shipping_method: ShippingMethod,
    cost: Decimal,
    weight_kg: Decimal,
    dims_cm: dict = None,
    notes: str = ""
) -> Shipment:
    """
    Creates a new Shipment record for a given CustomOrder.

    Args:
        order (CustomOrder): The CustomOrder object for which to create a shipment.
        shipping_method (ShippingMethod): The chosen shipping method object.
        cost (Decimal): The calculated cost for this shipment.
        weight_kg (Decimal): The weight of the package in kg.
        dims_cm (dict, optional): Dictionary with 'l', 'w', 'h' in cm. Defaults to None.
        notes (str, optional): Any additional notes for the shipment.

    Returns:
        Shipment: The newly created Shipment object.

    Raises:
        ValidationError: If the order already has a shipment or other validation issues.
    """
    if hasattr(order, 'shipment') and order.shipment:
        raise ValidationError(_("This order already has an associated shipment."))

    try:
        shipment = Shipment.objects.create(
            order=order,
            shipping_method=shipping_method,
            cost=cost,
            weight_kg=weight_kg,
            dims_cm=dims_cm,
            notes=notes,
            status=Shipment.ShipmentStatus.PENDING
        )
        # Record initial status update
        ShipmentStatusUpdate.objects.create(
            shipment=shipment,
            new_status=Shipment.ShipmentStatus.PENDING,
            notes=_("Shipment created and pending booking.")
        )
        logger.info(f"Shipment {shipment.id} created for order {order.order_id}")
        return shipment
    except Exception as e:
        logger.error(f"Error creating shipment for order {order.order_id}: {e}", exc_info=True)
        raise ValidationError(_(f"Failed to create shipment: {e}"))

@transaction.atomic
def update_shipment_status(shipment: Shipment, new_status: str, notes: str = "", updated_by=None) -> Shipment:
    """
    Updates the status of a shipment and records the change in ShipmentStatusUpdate.

    Args:
        shipment (Shipment): The Shipment object to update.
        new_status (str): The new status for the shipment (must be a valid ShipmentStatus choice).
        notes (str, optional): Notes regarding the status update. Defaults to "".
        updated_by (User, optional): The user who initiated the update. Defaults to None.

    Returns:
        Shipment: The updated Shipment object.

    Raises:
        ValidationError: If the new status is invalid or the transition is not allowed.
    """
    if new_status not in Shipment.ShipmentStatus.values:
        raise ValidationError(_(f"Invalid new status: {new_status}"))

    old_status = shipment.status
    shipment.status = new_status
    shipment.save(update_fields=['status', 'updated_at'])

    ShipmentStatusUpdate.objects.create(
        shipment=shipment,
        old_status=old_status,
        new_status=new_status,
        notes=notes,
        updated_by=updated_by
    )
    logger.info(f"Shipment {shipment.id} status updated from {old_status} to {new_status}")
    return shipment

def add_shipment_event(
    shipment: Shipment,
    event_type: str,
    description: str,
    location: str = "",
    event_timestamp: timezone.datetime = None,
    carrier_raw_data: dict = None
) -> ShipmentEvent:
    """
    Adds a new event to a shipment's history.

    Args:
        shipment (Shipment): The Shipment object to add the event to.
        event_type (str): The type of event (e.g., 'SCAN', 'DELIVERY_ATTEMPT').
        description (str): A description of the event.
        location (str, optional): The location where the event occurred. Defaults to "".
        event_timestamp (datetime, optional): The timestamp of the event. Defaults to now.
        carrier_raw_data (dict, optional): Raw data from the carrier's webhook/API. Defaults to None.

    Returns:
        ShipmentEvent: The newly created ShipmentEvent object.
    """
    event = ShipmentEvent.objects.create(
        shipment=shipment,
        event_type=event_type,
        description=description,
        location=location,
        event_timestamp=event_timestamp if event_timestamp else timezone.now(),
        carrier_raw_data=carrier_raw_data
    )
    logger.info(f"Shipment {shipment.id} event added: {event_type} at {location}")
    return event

@transaction.atomic
def book_shipment_via_carrier_api(shipment: Shipment) -> Shipment:
    """
    Simulates booking a shipment via an external carrier API.
    Updates shipment status and tracking information.

    Args:
        shipment (Shipment): The Shipment object to book.

    Returns:
        Shipment: The updated Shipment object with booking details.

    Raises:
        ValidationError: If booking fails or carrier API is not configured.
    """
    if not shipment.shipping_method or not shipment.shipping_method.carrier:
        raise ValidationError(_("Shipment is not associated with a valid shipping method or carrier."))
    
    carrier = shipment.shipping_method.carrier
    carrier_api_client = get_carrier_api_client(carrier)

    if not carrier_api_client:
        raise ValidationError(_(f"No API client configured for carrier: {carrier.name}"))

    try:
        # Simulate API call to book parcel
        booking_response = carrier_api_client.book_parcel(
            from_address=settings.OUR_WAREHOUSE_ADDRESS, # Define this in your settings.py
            to_address=shipment.order.shipping_address,
            weight_kg=shipment.weight_kg,
            dims_cm=shipment.dims_cm,
            service_code=shipment.shipping_method.service_code,
            order_id=str(shipment.order.order_id)
        )

        if booking_response.get('success'):
            shipment.tracking_number = booking_response.get('tracking_number')
            shipment.tracking_url_generated = carrier.get_tracking_link(shipment.tracking_number)
            shipment.carrier_response_data = booking_response
            update_shipment_status(shipment, Shipment.ShipmentStatus.BOOKED, notes=_("Shipment successfully booked with carrier."))
            add_shipment_event(shipment, 'BOOKED', _("Shipment booked with carrier."), location="Origin Hub")
            logger.info(f"Shipment {shipment.id} booked successfully with tracking {shipment.tracking_number}")
        else:
            error_message = booking_response.get('error_message', _("Unknown booking error"))
            update_shipment_status(shipment, Shipment.ShipmentStatus.FAILED, notes=f"Booking failed: {error_message}")
            logger.error(f"Shipment {shipment.id} booking failed: {error_message}")
            raise ValidationError(_(f"Shipment booking failed: {error_message}"))
        
        return shipment

    except Exception as e:
        logger.error(f"Error booking shipment {shipment.id} via carrier API: {e}", exc_info=True)
        raise ValidationError(_(f"Failed to book shipment with carrier: {e}"))

def fetch_tracking_status_from_carrier(shipment: Shipment) -> Shipment:
    """
    Simulates fetching the latest tracking status from an external carrier API.
    Updates shipment status and adds new events.

    Args:
        shipment (Shipment): The Shipment object to update tracking for.

    Returns:
        Shipment: The updated Shipment object.

    Raises:
        ValidationError: If tracking fails or carrier API is not configured.
    """
    if not shipment.shipping_method or not shipment.shipping_method.carrier:
        raise ValidationError(_("Shipment is not associated with a valid shipping method or carrier."))
    if not shipment.tracking_number:
        raise ValidationError(_("Shipment has no tracking number to fetch status."))

    carrier = shipment.shipping_method.carrier
    carrier_api_client = get_carrier_api_client(carrier)

    if not carrier_api_client:
        raise ValidationError(_(f"No API client configured for carrier: {carrier.name}"))

    try:
        tracking_response = carrier_api_client.get_tracking_status(shipment.tracking_number)

        if tracking_response.get('success'):
            new_status = tracking_response.get('current_status', shipment.status)
            events_data = tracking_response.get('events', [])

            # Update main shipment status
            if new_status != shipment.status:
                update_shipment_status(shipment, new_status, notes=_("Status updated from carrier tracking."))
            
            # Add new events, avoiding duplicates
            existing_event_timestamps = set(e.event_timestamp for e in shipment.events.all())
            for event_data in events_data:
                event_ts = timezone.datetime.fromisoformat(event_data['timestamp'])
                if event_ts not in existing_event_timestamps:
                    add_shipment_event(
                        shipment=shipment,
                        event_type=event_data.get('type', 'UNKNOWN'),
                        description=event_data.get('description', _("No description")),
                        location=event_data.get('location', _("Unknown location")),
                        event_timestamp=event_ts,
                        carrier_raw_data=event_data # Store raw event data
                    )
            
            shipment.carrier_response_data = tracking_response # Store latest raw response
            shipment.save(update_fields=['carrier_response_data', 'updated_at'])
            logger.info(f"Shipment {shipment.id} tracking status updated to {new_status}")
            return shipment
        else:
            error_message = tracking_response.get('error_message', _("Unknown tracking error"))
            logger.error(f"Shipment {shipment.id} tracking failed: {error_message}")
            raise ValidationError(_(f"Failed to fetch tracking status: {error_message}"))

    except Exception as e:
        logger.error(f"Error fetching tracking for shipment {shipment.id}: {e}", exc_info=True)
        raise ValidationError(_(f"Failed to fetch tracking status: {e}"))

@transaction.atomic
def request_carrier_pickup(shipment: Shipment) -> dict:
    """
    Simulates requesting a pickup for a shipment via an external carrier API.

    Args:
        shipment (Shipment): The Shipment object for which to request pickup.

    Returns:
        dict: A dictionary containing pickup confirmation details (e.g., confirmation_id, scheduled_time).

    Raises:
        ValidationError: If pickup request fails or carrier API is not configured.
    """
    if not shipment.shipping_method or not shipment.shipping_method.carrier:
        raise ValidationError(_("Shipment is not associated with a valid shipping method or carrier."))
    if shipment.status != Shipment.ShipmentStatus.BOOKED:
        raise ValidationError(_("Pickup can only be requested for booked shipments."))

    carrier = shipment.shipping_method.carrier
    carrier_api_client = get_carrier_api_client(carrier)

    if not carrier_api_client:
        raise ValidationError(_(f"No API client configured for carrier: {carrier.name}"))

    try:
        pickup_response = carrier_api_client.request_pickup(
            shipment_id=str(shipment.id),
            tracking_number=shipment.tracking_number,
            pickup_address=settings.OUR_WAREHOUSE_ADDRESS, # Define this in settings
            scheduled_time=timezone.now() + timezone.timedelta(hours=4) # Example: 4 hours from now
        )

        if pickup_response.get('success'):
            update_shipment_status(shipment, Shipment.ShipmentStatus.BOOKED, notes=_("Pickup requested from carrier."))
            add_shipment_event(shipment, 'PICKUP_REQUESTED', _("Pickup requested from carrier."), location=settings.OUR_WAREHOUSE_ADDRESS.get('city', ''))
            logger.info(f"Pickup requested for shipment {shipment.id}: {pickup_response.get('confirmation_id')}")
            return pickup_response
        else:
            error_message = pickup_response.get('error_message', _("Unknown pickup request error"))
            logger.error(f"Pickup request failed for shipment {shipment.id}: {error_message}")
            raise ValidationError(_(f"Pickup request failed: {error_message}"))

    except Exception as e:
        logger.error(f"Error requesting pickup for shipment {shipment.id}: {e}", exc_info=True)
        raise ValidationError(_(f"Failed to request pickup: {e}"))

@transaction.atomic
def generate_shipping_label(shipment: Shipment) -> str:
    """
    Simulates generating a shipping label via an external carrier API.

    Args:
        shipment (Shipment): The Shipment object for which to generate the label.

    Returns:
        str: The URL to the generated shipping label.

    Raises:
        ValidationError: If label generation fails or carrier API is not configured.
    """
    if not shipment.shipping_method or not shipment.shipping_method.carrier:
        raise ValidationError(_("Shipment is not associated with a valid shipping method or carrier."))
    if not shipment.tracking_number:
        raise ValidationError(_("Shipment has no tracking number; cannot generate label without it."))

    carrier = shipment.shipping_method.carrier
    carrier_api_client = get_carrier_api_client(carrier)

    if not carrier_api_client:
        raise ValidationError(_(f"No API client configured for carrier: {carrier.name}"))
    
    try:
        label_response = carrier_api_client.generate_label(
            shipment_id=str(shipment.id),
            tracking_number=shipment.tracking_number,
            package_details={
                'weight_kg': shipment.weight_kg,
                'dims_cm': shipment.dims_cm,
                'service_code': shipment.shipping_method.service_code
            },
            from_address=settings.OUR_WAREHOUSE_ADDRESS,
            to_address=shipment.order.shipping_address
        )

        if label_response.get('success') and label_response.get('label_url'):
            # Store the label URL on the shipment for easy access
            shipment.delivery_proof_url = label_response['label_url'] # Reusing this field, or add a new one
            shipment.save(update_fields=['delivery_proof_url', 'updated_at'])
            logger.info(f"Label generated for shipment {shipment.id}: {label_response['label_url']}")
            return label_response['label_url']
        else:
            error_message = label_response.get('error_message', _("Unknown label generation error"))
            logger.error(f"Label generation failed for shipment {shipment.id}: {error_message}")
            raise ValidationError(_(f"Label generation failed: {error_message}"))

    except Exception as e:
        logger.error(f"Error generating label for shipment {shipment.id}: {e}", exc_info=True)
        raise ValidationError(_(f"Failed to generate label: {e}"))

@transaction.atomic
def cancel_shipment(shipment: Shipment) -> Shipment:
    """
    Cancels a shipment, optionally communicating with the carrier API.

    Args:
        shipment (Shipment): The Shipment object to cancel.

    Returns:
        Shipment: The updated Shipment object with 'CANCELLED' status.

    Raises:
        ValidationError: If cancellation fails or is not allowed.
    """
    if shipment.status in [Shipment.ShipmentStatus.DELIVERED, Shipment.ShipmentStatus.RETURNED]:
        raise ValidationError(_("Cannot cancel a delivered or returned shipment."))
    
    carrier = shipment.shipping_method.carrier
    carrier_api_client = get_carrier_api_client(carrier)

    try:
        if carrier_api_client and hasattr(carrier_api_client, 'cancel_shipment'):
            cancellation_response = carrier_api_client.cancel_shipment(shipment.tracking_number)
            if not cancellation_response.get('success'):
                error_message = cancellation_response.get('error_message', _("Carrier cancellation failed"))
                raise ValidationError(_(f"Carrier cancellation failed: {error_message}"))
        
        update_shipment_status(shipment, Shipment.ShipmentStatus.CANCELLED, notes=_("Shipment cancelled by system/user."))
        add_shipment_event(shipment, 'CANCELLED', _("Shipment cancelled."), location="System")
        logger.info(f"Shipment {shipment.id} successfully cancelled.")
        return shipment
    except ValidationError:
        raise # Re-raise validation errors
    except Exception as e:
        logger.error(f"Error cancelling shipment {shipment.id}: {e}", exc_info=True)
        raise ValidationError(_(f"Failed to cancel shipment: {e}"))

def process_webhook_event(carrier_code: str, payload: dict) -> bool:
    """
    Processes an incoming webhook event from a carrier.
    This function would parse the payload and update relevant shipments/events.

    Args:
        carrier_code (str): The unique code of the carrier sending the webhook.
        payload (dict): The raw JSON payload from the webhook.

    Returns:
        bool: True if the webhook was processed successfully, False otherwise.
    """
    try:
        carrier = ShippingCarrier.objects.get(code=carrier_code)
        # Here, you'd typically verify the webhook signature using carrier.webhook_secret
        # For simplicity, this step is skipped.

        tracking_number = payload.get('tracking_number')
        event_type = payload.get('event_type')
        description = payload.get('description')
        location = payload.get('location')
        timestamp_str = payload.get('timestamp')
        new_status = payload.get('new_status') # Optional: carrier might send new status directly

        if not tracking_number or not event_type:
            logger.warning(f"Incomplete webhook payload from {carrier_code}: {payload}")
            return False

        shipment = Shipment.objects.filter(tracking_number=tracking_number, shipping_method__carrier=carrier).first()
        if not shipment:
            logger.warning(f"Webhook for unknown shipment tracking {tracking_number} from {carrier_code}")
            return False

        event_timestamp = timezone.datetime.fromisoformat(timestamp_str) if timestamp_str else timezone.now()

        # Add the event
        add_shipment_event(shipment, event_type, description, location, event_timestamp, payload)

        # Update shipment status if a new status is provided or derived
        if new_status and new_status != shipment.status:
            update_shipment_status(shipment, new_status, notes=f"Status updated via webhook from {carrier.name}.")
        
        # Example: If event_type indicates delivery, update status to DELIVERED
        if event_type == 'DELIVERED' and shipment.status != Shipment.ShipmentStatus.DELIVERED:
            update_shipment_status(shipment, Shipment.ShipmentStatus.DELIVERED, notes=_("Delivered via carrier webhook."))
            if payload.get('proof_of_delivery_url'):
                shipment.delivery_proof_url = payload['proof_of_delivery_url']
            if payload.get('signature_url'):
                shipment.delivery_signature_url = payload['signature_url']
            shipment.save(update_fields=['delivery_proof_url', 'delivery_signature_url', 'updated_at'])

        logger.info(f"Webhook event '{event_type}' processed for shipment {shipment.id} from {carrier.name}.")
        return True

    except ShippingCarrier.DoesNotExist:
        logger.error(f"Webhook received from unknown carrier code: {carrier_code}")
        return False
    except Exception as e:
        logger.error(f"Error processing webhook from {carrier_code}: {e}", exc_info=True)
        return False


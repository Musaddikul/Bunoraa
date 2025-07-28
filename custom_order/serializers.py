# custom_order/serializers.py
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import (
    CustomOrder, DesignImage, CustomerItemImage,
    OrderStatusUpdate, Category, SubCategory,
    FabricType, SizeOption, ColorOption
)
from accounts.models import UserAddress
from shipping.models import ShippingMethod
from payments.models import PaymentMethod
from shipping.api.serializers import ShippingMethodSerializer
from payments.api.serializers import PaymentMethodSerializer
from accounts.api.serializers import UserAddressSerializer
from promotions.models import Coupon
import logging

logger = logging.getLogger(__name__)

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    """
    class Meta:
        model = Category
        fields = ['id', 'name']

class SubCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the SubCategory model.
    """
    class Meta:
        model = SubCategory
        fields = ['id', 'name']

class FabricTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for the FabricType model.
    """
    class Meta:
        model = FabricType
        fields = ['id', 'name', 'base_price']

class SizeOptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the SizeOption model.
    """
    class Meta:
        model = SizeOption
        fields = ['id', 'name']

class ColorOptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the ColorOption model.
    """
    class Meta:
        model = ColorOption
        fields = ['id', 'name']

class DesignImageSerializer(serializers.ModelSerializer):
    """
    Serializer for DesignImage model.
    Used for nested representation in CustomOrder.
    """
    # Use a custom field to handle file uploads, but allow URL for retrieval
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = DesignImage
        fields = ['id', 'image', 'image_url', 'description', 'is_primary']
        read_only_fields = ['id', 'image_url'] # Image is writable for create/update, URL is read-only

    def get_image_url(self, obj):
        """
        Returns the URL of the image.
        """
        if obj.image:
            return obj.image.url
        return None

class CustomerItemImageSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomerItemImage model.
    Used for nested representation in CustomOrder.
    """
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomerItemImage
        fields = ['id', 'image', 'image_url', 'description']
        read_only_fields = ['id', 'image_url']

    def get_image_url(self, obj):
        """
        Returns the URL of the image.
        """
        if obj.image:
            return obj.image.url
        return None

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for OrderStatusUpdate model.
    Used for nested representation in CustomOrder.
    """
    updated_by = serializers.StringRelatedField() # Displays the username of the updater

    class Meta:
        model = OrderStatusUpdate
        fields = ['old_status', 'new_status', 'notes', 'created_at', 'updated_by']
        read_only_fields = ['old_status', 'new_status', 'created_at', 'updated_by']


class CustomOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomOrder model, used for retrieving and listing orders.
    Includes nested serializers for related models.
    """
    user = serializers.StringRelatedField() # Displays username
    category = CategorySerializer(read_only=True)
    subcategory = SubCategorySerializer(read_only=True)
    fabric_type = FabricTypeSerializer(read_only=True)
    size_option = SizeOptionSerializer(read_only=True)
    color_option = ColorOptionSerializer(read_only=True)
    shipping_address = UserAddressSerializer(read_only=True)
    shipping_method = ShippingMethodSerializer(read_only=True)
    payment_method = PaymentMethodSerializer(read_only=True)
    coupon = serializers.StringRelatedField() # Displays coupon code

    design_images = DesignImageSerializer(many=True, read_only=True)
    customer_item_images = CustomerItemImageSerializer(many=True, read_only=True)
    status_updates = OrderStatusUpdateSerializer(many=True, read_only=True)

    # Ensure calculated fields are included for display
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    vat_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    # Add vat_percentage for display if needed
    vat_percentage = serializers.SerializerMethodField()

    class Meta:
        model = CustomOrder
        fields = [
            'order_id', 'user', 'order_type', 'customer_name', 'phone', 'email',
            'contact_method', 'category', 'subcategory', 'fabric_type',
            'size_option', 'color_option', 'quantity', 'design_description',
            'customer_item_description', 'customer_item_condition', 'size_info',
            'expected_date', 'additional_info', 'shipping_address', 'shipping_method',
            'payment_method', 'coupon', 'is_draft', 'status', 'created_at', 'updated_at',
            'base_price', 'shipping_cost', 'vat_amount', 'discount_amount', 'total_amount',
            'design_images', 'customer_item_images', 'status_updates', 'vat_percentage'
        ]
        read_only_fields = [
            'order_id', 'user', 'status', 'created_at', 'updated_at',
            'base_price', 'shipping_cost', 'vat_amount', 'discount_amount', 'total_amount',
            'design_images', 'customer_item_images', 'status_updates', 'vat_percentage'
        ]

    def get_vat_percentage(self, obj):
        """
        Returns the VAT percentage associated with the order, or a default.
        This assumes VAT percentage might be stored or derivable.
        If not directly stored on the order, you might fetch it from TaxSetting.
        For now, returning a hardcoded value or None if not applicable.
        """
        # In a real scenario, you might have a vat_rate field on CustomOrder or fetch from TaxSetting
        # For demonstration, let's assume a default if not explicitly set on the order
        if hasattr(obj, 'vat_percentage') and obj.vat_percentage is not None:
             return float(obj.vat_percentage)
        # Fallback to fetching from TaxSetting if not on order object
        from core.models import TaxSetting
        tax_setting = TaxSetting.objects.filter(is_active=True).first()
        if tax_setting:
            return float(tax_setting.vat_rate)
        return 0.00 # Default if no tax setting found


class CustomOrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating CustomOrder instances.
    Handles nested creation/update of DesignImage and CustomerItemImage.
    """
    # Use PrimaryKeyRelatedField for foreign keys
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.filter(is_active=True), required=False, allow_null=True)
    subcategory = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.filter(is_active=True), required=False, allow_null=True)
    fabric_type = serializers.PrimaryKeyRelatedField(queryset=FabricType.objects.filter(is_active=True), required=False, allow_null=True)
    size_option = serializers.PrimaryKeyRelatedField(queryset=SizeOption.objects.filter(is_active=True), required=False, allow_null=True)
    color_option = serializers.PrimaryKeyRelatedField(queryset=ColorOption.objects.filter(is_active=True), required=False, allow_null=True)
    shipping_address = serializers.PrimaryKeyRelatedField(queryset=UserAddress.objects.all(), required=False, allow_null=True)
    shipping_method = serializers.PrimaryKeyRelatedField(queryset=ShippingMethod.objects.all(), required=False, allow_null=True)
    payment_method = serializers.PrimaryKeyRelatedField(queryset=PaymentMethod.objects.all(), required=False, allow_null=True)

    # Coupon is optional and comes as a PK from the frontend if applied
    coupon = serializers.PrimaryKeyRelatedField(queryset=Coupon.objects.filter(is_active=True), required=False, allow_null=True)

    # Nested serializers for images, allowing creation and update
    design_images = DesignImageSerializer(many=True, required=False)
    customer_item_images = CustomerItemImageSerializer(many=True, required=False)

    # These fields are calculated by the backend services, so they should be read-only here
    # However, they must be included in 'fields' for the serializer to process them
    base_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    vat_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    # Add payment_redirect_url for response only
    payment_redirect_url = serializers.CharField(write_only=True, required=False)
    payment_intent_id = serializers.CharField(write_only=True, required=False)
    client_secret = serializers.CharField(write_only=True, required=False)


    class Meta:
        model = CustomOrder
        fields = [
            'order_id', 'order_type', 'customer_name', 'phone', 'email',
            'contact_method', 'category', 'subcategory', 'fabric_type',
            'size_option', 'color_option', 'quantity', 'design_description',
            'customer_item_description', 'customer_item_condition', 'size_info',
            'expected_date', 'additional_info', 'shipping_address', 'shipping_method',
            'payment_method', 'coupon', 'is_draft', # is_draft is a writable field
            'base_price', 'shipping_cost', 'vat_amount', 'discount_amount', 'total_amount', # Read-only for incoming data
            'design_images', 'customer_item_images',
            'payment_redirect_url', 'payment_intent_id', 'client_secret' # Write-only for internal use/response
        ]
        read_only_fields = [
            'order_id',
            'base_price', 'shipping_cost', 'vat_amount', 'discount_amount', 'total_amount'
        ]

    def validate(self, data):
        """
        Custom validation for order types and required fields.
        """
        order_type = data.get('order_type')
        is_draft = data.get('is_draft', False) # Default to False if not provided

        logger.debug(f"Serializer validation: is_draft={is_draft}, order_type={order_type}")

        # Only enforce strict validation if it's not a draft
        if not is_draft:
            if not all([data.get('customer_name'), data.get('phone'), data.get('email')]):
                raise serializers.ValidationError(_("Customer name, phone, and email are required for a final order."))

            if order_type != CustomOrder.OrderType.DIRECT_CONTACT:
                if not all([data.get('category'), data.get('subcategory'), data.get('fabric_type'), data.get('quantity')]):
                    raise serializers.ValidationError(_("Category, subcategory, fabric type, and quantity are required for this order type."))

                if data.get('quantity') is not None and data.get('quantity') <= 0:
                    raise serializers.ValidationError(_("Quantity must be at least 1."))

                if not all([data.get('shipping_address'), data.get('shipping_method'), data.get('payment_method')]):
                    raise serializers.ValidationError(_("Shipping address, shipping method, and payment method are required for this order type."))

                if order_type == CustomOrder.OrderType.OWN_DESIGN:
                    if not data.get('design_description'):
                        raise serializers.ValidationError(_("Design description is required for 'Own Design' orders."))
                    # Check for design images
                    # For updates, self.instance will exist. For creation, check FILES.
                    if not self.instance and not self.context['request'].FILES.getlist('design_images-0-image'):
                         raise serializers.ValidationError(_("At least one design image is required for 'Own Design' orders."))

                elif order_type == CustomOrder.OrderType.SEND_PRODUCT:
                    if not data.get('customer_item_description'):
                        raise serializers.ValidationError(_("Customer item description is required for 'Send Product' orders."))
                    # Check for customer item images
                    # For updates, self.instance will exist. For creation, check FILES.
                    if not self.instance and not self.context['request'].FILES.getlist('customer_item_images-0-image'):
                        raise serializers.ValidationError(_("At least one customer item image is required for 'Send Product' orders."))

        return data

    def create(self, validated_data):
        """
        Custom create method to handle nested image creation and initial status.
        """
        design_images_data = validated_data.pop('design_images', [])
        customer_item_images_data = validated_data.pop('customer_item_images', [])

        # Pop payment related fields as they are write_only and not part of model fields
        validated_data.pop('payment_redirect_url', None)
        validated_data.pop('payment_intent_id', None)
        validated_data.pop('client_secret', None)

        # Set initial status based on is_draft
        is_draft = validated_data.get('is_draft', False)
        logger.debug(f"Serializer create method: is_draft={is_draft} received for new order.")

        if is_draft:
            validated_data['status'] = CustomOrder.Status.DRAFT
            logger.debug(f"New order status set to DRAFT as is_draft is True.")
        else:
            # For non-drafts, the status will be set to PENDING by create_order_from_draft service
            # No need to set it here, as create_order_from_draft overwrites it.
            # However, ensure it's not explicitly set to DRAFT if it's not meant to be.
            if 'status' in validated_data and validated_data['status'] == CustomOrder.Status.DRAFT:
                logger.warning(f"Attempted to create non-draft order with DRAFT status. Overriding.")
                del validated_data['status'] # Let the model's default or service handle it

        # Create the CustomOrder instance
        order = CustomOrder.objects.create(**validated_data)
        logger.debug(f"Order {order.order_id} created by serializer. Initial DB status: {order.status}, is_draft: {order.is_draft}")


        # Create nested DesignImage instances
        for image_data in design_images_data:
            DesignImage.objects.create(order=order, **image_data)

        # Create nested CustomerItemImage instances
        for image_data in customer_item_images_data:
            CustomerItemImage.objects.create(order=order, **image_data)

        return order

    def update(self, instance, validated_data):
        """
        Custom update method to handle nested image updates (add/remove) and status changes.
        """
        design_images_data = validated_data.pop('design_images', [])
        customer_item_images_data = validated_data.pop('customer_item_images', [])

        # Pop payment related fields as they are write_only and not part of model fields
        validated_data.pop('payment_redirect_url', None)
        validated_data.pop('payment_intent_id', None)
        validated_data.pop('client_secret', None)

        # Update CustomOrder fields
        # Explicitly handle is_draft if it's being changed
        if 'is_draft' in validated_data:
            new_is_draft = validated_data['is_draft']
            logger.debug(f"Serializer update method: is_draft changed from {instance.is_draft} to {new_is_draft} for order {instance.order_id}.")
            if instance.is_draft and not new_is_draft:
                # Transitioning from draft to non-draft, status will be handled by create_order_from_draft
                pass
            elif not instance.is_draft and new_is_draft:
                # Transitioning from non-draft to draft
                instance.status = CustomOrder.Status.DRAFT
                logger.debug(f"Order {instance.order_id} status set to DRAFT due to is_draft change.")
            # If is_draft remains the same, status should also remain as is (unless other logic changes it)
            setattr(instance, 'is_draft', new_is_draft)
            del validated_data['is_draft'] # Remove from validated_data to prevent double-setting

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save() # Save the order instance with updated fields

        logger.debug(f"Order {instance.order_id} updated by serializer. Current DB status: {instance.status}, is_draft: {instance.is_draft}")


        # Handle Design Images
        for image_data in design_images_data:
            image_id = image_data.get('id')
            if image_id: # Existing image
                image_instance = instance.design_images.get(id=image_id)
                if image_data.get('_delete'):
                    image_instance.delete()
                else:
                    for attr, value in image_data.items():
                        if attr not in ['id', '_delete']:
                            setattr(image_instance, attr, value)
                    image_instance.save()
            else: # New image
                DesignImage.objects.create(order=instance, **image_data)

        # Handle Customer Item Images
        for image_data in customer_item_images_data:
            image_id = image_data.get('id')
            if image_id: # Existing image
                image_instance = instance.customer_item_images.get(id=image_id)
                if image_data.get('_delete'):
                    image_instance.delete()
                else:
                    for attr, value in image_data.items():
                        if attr not in ['id', '_delete']:
                            setattr(image_instance, attr, value)
                    image_instance.save()
            else: # New image
                CustomerItemImage.objects.create(order=instance, **image_data)

        return instance

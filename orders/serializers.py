# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem, OrderStatus
from shipping.models import ShippingCarrier, ShippingMethod
from accounts.models import UserAddress, User
from payments.models import Payment, PaymentMethod
from products.models import Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id','email','get_full_name']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserAddress
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = ['id','payment_method','amount','status']

class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderStatus
        fields = ['name','description']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ['product_name','product_sku','price','quantity','discount','subtotal']
        read_only_fields = ['subtotal','product_name','product_sku']

class OrderSerializer(serializers.ModelSerializer):
    items   = OrderItemSerializer(many=True, read_only=True)
    user    = UserSerializer(read_only=True)
    address = AddressSerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)
    status  = OrderStatusSerializer(read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id','order_number','user','status','shipping_method_name',
            'payment','address','order_note','total','tax',
            'delivery_charge','discount','grand_total','items','invoice_url',
            'created_at'
        ]
        read_only_fields = ['order_number','grand_total','id','created_at']


class CheckoutItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity   = serializers.IntegerField(min_value=1)
    price      = serializers.DecimalField(max_digits=10,decimal_places=2)
    discount   = serializers.DecimalField(max_digits=10,decimal_places=2,default=0)

    def validate_product_id(self, value):
        try:
            return Product.objects.get(pk=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found.")


class CheckoutSerializer(serializers.Serializer):
    user_id               = serializers.IntegerField()
    address_id            = serializers.UUIDField()
    shipping_carrier_id   = serializers.IntegerField()
    shipping_method_id    = serializers.IntegerField()
    payment_method_id     = serializers.IntegerField()
    items                 = CheckoutItemSerializer(many=True)
    order_note            = serializers.CharField(required=False, allow_blank=True)
    tax                   = serializers.DecimalField(max_digits=10,decimal_places=2,required=False)
    discount              = serializers.DecimalField(max_digits=10,decimal_places=2,required=False)
    total                 = serializers.DecimalField(max_digits=10,decimal_places=2)
    promo_code            = serializers.CharField(required=False, allow_blank=True)

    def validate_user_id(self, value):
        try:
            return User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

    def validate_address_id(self, value):
        try:
            return UserAddress.objects.get(pk=value)
        except UserAddress.DoesNotExist:
            raise serializers.ValidationError("Address not found.")

    def validate_shipping_carrier_id(self, value):
        try:
            return ShippingCarrier.objects.get(pk=value, is_active=True)
        except ShippingCarrier.DoesNotExist:
            raise serializers.ValidationError("Shipping carrier not found.")

    def validate_payment_method_id(self, value):
        try:
            return PaymentMethod.objects.get(pk=value, is_active=True)
        except PaymentMethod.DoesNotExist:
            raise serializers.ValidationError("Payment method not found or is inactive.")

    def validate_shipping_method_id(self, value):
        try:
            return ShippingMethod.objects.get(pk=value, is_active=True)
        except ShippingMethod.DoesNotExist:
            raise serializers.ValidationError("Shipping method not found.")

    def validate(self, data):
        # Retrieve the actual User and UserAddress objects from validated data
        user = data.get('user')
        address = data.get('address')

        if user and address and address.user != user:
            raise serializers.ValidationError({"address_id":"Address does not belong to the specified user."})
        return data

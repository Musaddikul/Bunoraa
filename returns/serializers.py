# returns/serializers.py
from rest_framework import serializers
from .models import ReturnRequest, ReturnItem, ReturnReason, ReturnEvent

class ReturnReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnReason
        fields = ['id','name','description']

class ReturnItemSerializer(serializers.ModelSerializer):
    product = serializers.CharField(source='order_item.product.name', read_only=True)
    class Meta:
        model = ReturnItem
        fields = ['order_item','product','quantity']

class ReturnEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnEvent
        fields = ['timestamp','event','notes']

class ReturnRequestSerializer(serializers.ModelSerializer):
    items           = ReturnItemSerializer(many=True, read_only=True)
    events          = ReturnEventSerializer(many=True, read_only=True)
    reason_category = ReturnReasonSerializer(read_only=True)

    class Meta:
        model  = ReturnRequest
        fields = [
            'id','order','user','status',
            'reason_category','reason_text',
            'refund_amount','return_label_url','tracking_number',
            'requested_at','approved_at','refunded_at','updated_at',
            'items','events'
        ]

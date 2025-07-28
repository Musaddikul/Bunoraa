# support/serializers.py
from rest_framework import serializers
from .models import SupportTicket, TicketAttachment, TicketResponse

class TicketAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAttachment
        fields = ['id','file','uploaded_by','uploaded_at']

class TicketResponseSerializer(serializers.ModelSerializer):
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    class Meta:
        model = TicketResponse
        fields = ['id','user','message','attachments','created_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    responses   = TicketResponseSerializer(many=True, read_only=True)
    tags        = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            'id','user','subject','description','category','priority','status',
            'assigned_to','tags','metadata','sla_due',
            'created_at','updated_at','attachments','responses'
        ]
        read_only_fields = ['user','status','created_at','updated_at']

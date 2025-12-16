"""
Support API Serializers
"""
from rest_framework import serializers
from ..models import (
    TicketCategory, Ticket, TicketMessage, TicketAttachment,
    HelpArticle, ContactMessage
)


class TicketCategorySerializer(serializers.ModelSerializer):
    """Serializer for ticket categories."""
    
    class Meta:
        model = TicketCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'requires_order', 'response_time_hours', 'sort_order'
        ]


class TicketAttachmentSerializer(serializers.ModelSerializer):
    """Serializer for ticket attachments."""
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TicketAttachment
        fields = ['id', 'filename', 'file_url', 'file_size', 'content_type', 'created_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class TicketMessageSerializer(serializers.ModelSerializer):
    """Serializer for ticket messages."""
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = TicketMessage
        fields = [
            'id', 'sender_name', 'message', 'is_staff_reply',
            'is_internal', 'attachments', 'created_at'
        ]


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for tickets."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    messages = TicketMessageSerializer(many=True, read_only=True)
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    is_open = serializers.BooleanField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'subject', 'description',
            'status', 'status_display', 'priority', 'priority_display',
            'category', 'category_name', 'order',
            'assigned_to_name', 'is_escalated', 'is_open', 'is_overdue',
            'messages', 'attachments',
            'satisfaction_rating', 'rating_feedback',
            'created_at', 'updated_at', 'first_response_at',
            'resolved_at', 'closed_at'
        ]
        read_only_fields = [
            'id', 'ticket_number', 'created_at', 'updated_at',
            'first_response_at', 'resolved_at', 'closed_at'
        ]
    
    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.email
        return None


class TicketListSerializer(serializers.ModelSerializer):
    """Serializer for ticket listings."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'subject', 'status', 'status_display',
            'priority', 'priority_display', 'category_name',
            'message_count', 'is_open', 'created_at', 'updated_at'
        ]
    
    def get_message_count(self, obj):
        return obj.messages.filter(is_internal=False).count()


class CreateTicketSerializer(serializers.Serializer):
    """Serializer for creating a ticket."""
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    category_id = serializers.UUIDField(required=False, allow_null=True)
    order_id = serializers.UUIDField(required=False, allow_null=True)
    subject = serializers.CharField(max_length=500)
    description = serializers.CharField()
    priority = serializers.ChoiceField(
        choices=['low', 'medium', 'high', 'urgent'],
        required=False,
        default='medium'
    )


class AddMessageSerializer(serializers.Serializer):
    """Serializer for adding a message to a ticket."""
    message = serializers.CharField()


class RateTicketSerializer(serializers.Serializer):
    """Serializer for rating a ticket."""
    rating = serializers.IntegerField(min_value=1, max_value=5)
    feedback = serializers.CharField(required=False, allow_blank=True, default='')


class HelpArticleSerializer(serializers.ModelSerializer):
    """Serializer for help articles."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    helpful_percentage = serializers.FloatField(read_only=True)
    
    class Meta:
        model = HelpArticle
        fields = [
            'id', 'title', 'slug', 'category', 'category_name',
            'summary', 'content', 'is_featured',
            'view_count', 'helpful_count', 'not_helpful_count',
            'helpful_percentage', 'published_at'
        ]


class HelpArticleListSerializer(serializers.ModelSerializer):
    """Serializer for help article listings."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = HelpArticle
        fields = [
            'id', 'title', 'slug', 'category_name', 'summary',
            'is_featured', 'view_count', 'published_at'
        ]


class HelpfulFeedbackSerializer(serializers.Serializer):
    """Serializer for marking articles helpful."""
    is_helpful = serializers.BooleanField()


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for contact messages."""
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'company',
            'subject_type', 'subject', 'message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CreateContactMessageSerializer(serializers.Serializer):
    """Serializer for creating contact message."""
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    company = serializers.CharField(max_length=200, required=False, allow_blank=True)
    subject_type = serializers.ChoiceField(
        choices=['general', 'sales', 'support', 'feedback', 'partnership', 'press', 'other'],
        default='general'
    )
    subject = serializers.CharField(max_length=500)
    message = serializers.CharField()

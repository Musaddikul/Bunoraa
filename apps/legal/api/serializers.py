"""
Legal API Serializers
"""
from rest_framework import serializers
from ..models import LegalDocument, UserConsent, CookieConsent, GDPRRequest


class LegalDocumentSerializer(serializers.ModelSerializer):
    """Serializer for legal documents."""
    document_type_display = serializers.CharField(
        source='get_document_type_display', read_only=True
    )
    
    class Meta:
        model = LegalDocument
        fields = [
            'id', 'document_type', 'document_type_display', 'title', 'slug',
            'content', 'summary', 'version', 'effective_date',
            'meta_title', 'meta_description', 'requires_acceptance',
            'published_at', 'updated_at'
        ]


class LegalDocumentListSerializer(serializers.ModelSerializer):
    """Serializer for legal document listings."""
    document_type_display = serializers.CharField(
        source='get_document_type_display', read_only=True
    )
    
    class Meta:
        model = LegalDocument
        fields = [
            'id', 'document_type', 'document_type_display', 'title', 'slug',
            'summary', 'version', 'effective_date', 'requires_acceptance'
        ]


class UserConsentSerializer(serializers.ModelSerializer):
    """Serializer for user consents."""
    consent_type_display = serializers.CharField(
        source='get_consent_type_display', read_only=True
    )
    
    class Meta:
        model = UserConsent
        fields = [
            'id', 'consent_type', 'consent_type_display',
            'document_version', 'is_granted', 'granted_at', 'revoked_at'
        ]


class RecordConsentSerializer(serializers.Serializer):
    """Serializer for recording consent."""
    consent_type = serializers.ChoiceField(
        choices=['terms', 'privacy', 'marketing', 'cookies', 'newsletter']
    )
    document_id = serializers.UUIDField(required=False, allow_null=True)


class RevokeConsentSerializer(serializers.Serializer):
    """Serializer for revoking consent."""
    consent_type = serializers.ChoiceField(
        choices=['terms', 'privacy', 'marketing', 'cookies', 'newsletter']
    )


class CookieConsentSerializer(serializers.ModelSerializer):
    """Serializer for cookie consent."""
    consent_summary = serializers.DictField(read_only=True)
    
    class Meta:
        model = CookieConsent
        fields = [
            'id', 'analytics', 'marketing', 'preferences',
            'consent_summary', 'updated_at'
        ]


class SaveCookieConsentSerializer(serializers.Serializer):
    """Serializer for saving cookie consent."""
    visitor_id = serializers.CharField(required=False, allow_blank=True)
    analytics = serializers.BooleanField(default=False)
    marketing = serializers.BooleanField(default=False)
    preferences = serializers.BooleanField(default=False)


class GDPRRequestSerializer(serializers.ModelSerializer):
    """Serializer for GDPR requests."""
    request_type_display = serializers.CharField(
        source='get_request_type_display', read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display', read_only=True
    )
    
    class Meta:
        model = GDPRRequest
        fields = [
            'id', 'request_type', 'request_type_display',
            'status', 'status_display', 'description',
            'is_verified', 'deadline', 'created_at', 'completed_at'
        ]


class CreateGDPRRequestSerializer(serializers.Serializer):
    """Serializer for creating GDPR request."""
    request_type = serializers.ChoiceField(
        choices=['access', 'deletion', 'rectification', 'portability', 'restrict', 'object']
    )
    email = serializers.EmailField(required=False)
    description = serializers.CharField(required=False, allow_blank=True, default='')

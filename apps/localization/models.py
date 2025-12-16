"""
Localization Models
"""
import uuid
from django.db import models
from django.conf import settings


class Language(models.Model):
    """Available languages for the site."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True, help_text="Language code (e.g., en, fr, de)")
    name = models.CharField(max_length=100, help_text="Language name in English")
    native_name = models.CharField(max_length=100, help_text="Language name in native language")
    
    # Display settings
    is_rtl = models.BooleanField(default=False, help_text="Right-to-left language")
    flag_code = models.CharField(max_length=10, blank=True, help_text="Country code for flag icon")
    
    # Status
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    # Completeness tracking
    translation_progress = models.PositiveIntegerField(
        default=0,
        help_text="Percentage of translations complete (0-100)"
    )
    
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Language'
        verbose_name_plural = 'Languages'
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def save(self, *args, **kwargs):
        # Ensure only one default
        if self.is_default:
            Language.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class Timezone(models.Model):
    """Available timezones."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, help_text="IANA timezone name")
    display_name = models.CharField(max_length=200, help_text="User-friendly name")
    offset = models.CharField(max_length=10, help_text="UTC offset (e.g., +05:30)")
    offset_minutes = models.IntegerField(default=0, help_text="Offset in minutes for sorting")
    
    is_active = models.BooleanField(default=True)
    is_common = models.BooleanField(default=False, help_text="Show in common timezones list")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['offset_minutes', 'name']
        verbose_name = 'Timezone'
        verbose_name_plural = 'Timezones'
    
    def __str__(self):
        return f"{self.display_name} ({self.offset})"


class Country(models.Model):
    """Countries for localization."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=2, unique=True, help_text="ISO 3166-1 alpha-2 code")
    code_alpha3 = models.CharField(max_length=3, blank=True, help_text="ISO 3166-1 alpha-3 code")
    name = models.CharField(max_length=100)
    native_name = models.CharField(max_length=100, blank=True)
    
    # Localization defaults
    default_language = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='default_for_countries'
    )
    default_currency_code = models.CharField(max_length=3, blank=True)
    default_timezone = models.ForeignKey(
        Timezone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='default_for_countries'
    )
    
    # Phone
    phone_code = models.CharField(max_length=10, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_shipping_available = models.BooleanField(default=True)
    
    # Geo
    continent = models.CharField(max_length=50, blank=True)
    
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Country'
        verbose_name_plural = 'Countries'
    
    def __str__(self):
        return self.name


class UserLocalePreference(models.Model):
    """User's locale preferences."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='locale_preference'
    )
    
    language = models.ForeignKey(
        Language,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    timezone = models.ForeignKey(
        Timezone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    country = models.ForeignKey(
        Country,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # Date/Time formatting preferences
    date_format = models.CharField(
        max_length=20,
        choices=[
            ('MM/DD/YYYY', 'MM/DD/YYYY'),
            ('DD/MM/YYYY', 'DD/MM/YYYY'),
            ('YYYY-MM-DD', 'YYYY-MM-DD'),
            ('DD.MM.YYYY', 'DD.MM.YYYY'),
        ],
        default='MM/DD/YYYY'
    )
    time_format = models.CharField(
        max_length=10,
        choices=[
            ('12h', '12-hour'),
            ('24h', '24-hour'),
        ],
        default='12h'
    )
    
    # Measurement preferences
    measurement_system = models.CharField(
        max_length=10,
        choices=[
            ('metric', 'Metric'),
            ('imperial', 'Imperial'),
        ],
        default='metric'
    )
    
    # Auto-detect settings
    auto_detect_language = models.BooleanField(default=True)
    auto_detect_timezone = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User Locale Preference'
        verbose_name_plural = 'User Locale Preferences'
    
    def __str__(self):
        return f"Locale for {self.user.email}"


class Translation(models.Model):
    """Translation entries for dynamic content."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Content identification
    content_type = models.CharField(
        max_length=50,
        choices=[
            ('product', 'Product'),
            ('category', 'Category'),
            ('page', 'Page'),
            ('email', 'Email Template'),
            ('notification', 'Notification'),
            ('ui', 'UI Element'),
        ]
    )
    content_id = models.CharField(max_length=100, help_text="ID of the content being translated")
    field_name = models.CharField(max_length=100, help_text="Field name being translated")
    
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='translations')
    
    # Translation
    original_text = models.TextField(blank=True)
    translated_text = models.TextField()
    
    # Status
    is_approved = models.BooleanField(default=False)
    is_machine_translated = models.BooleanField(default=False)
    
    # Metadata
    translated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_translations'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['content_type', 'content_id', 'field_name']
        unique_together = ['content_type', 'content_id', 'field_name', 'language']
        verbose_name = 'Translation'
        verbose_name_plural = 'Translations'
    
    def __str__(self):
        return f"{self.content_type}.{self.content_id}.{self.field_name} ({self.language.code})"


class LocalizationSettings(models.Model):
    """Global localization settings (singleton)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    default_language = models.ForeignKey(
        Language,
        on_delete=models.PROTECT,
        related_name='+'
    )
    default_timezone = models.ForeignKey(
        Timezone,
        on_delete=models.PROTECT,
        related_name='+',
        null=True,
        blank=True
    )
    
    # Auto-detection
    auto_detect_language = models.BooleanField(default=True)
    auto_detect_timezone = models.BooleanField(default=True)
    
    # Display
    show_language_selector = models.BooleanField(default=True)
    show_timezone_selector = models.BooleanField(default=False)
    
    # Machine translation
    enable_machine_translation = models.BooleanField(default=False)
    translation_api_provider = models.CharField(
        max_length=50,
        choices=[
            ('google', 'Google Translate'),
            ('deepl', 'DeepL'),
            ('azure', 'Azure Translator'),
        ],
        blank=True
    )
    translation_api_key = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Localization Settings'
        verbose_name_plural = 'Localization Settings'
    
    def __str__(self):
        return "Localization Settings"
    
    def save(self, *args, **kwargs):
        if not self.pk and LocalizationSettings.objects.exists():
            raise ValueError("Only one LocalizationSettings instance allowed")
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create settings instance."""
        settings = cls.objects.first()
        if not settings:
            # Create default language if needed
            language, _ = Language.objects.get_or_create(
                code='en',
                defaults={
                    'name': 'English',
                    'native_name': 'English',
                    'is_default': True
                }
            )
            settings = cls.objects.create(default_language=language)
        return settings

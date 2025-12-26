"""
Pages models
"""
import uuid
from django.db import models


class Page(models.Model):
    """
    Static page model for CMS-like pages.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    
    # Content
    content = models.TextField(blank=True)
    excerpt = models.TextField(blank=True, max_length=500)
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True, max_length=300)
    
    # Featured image
    featured_image = models.ImageField(upload_to='pages/', blank=True, null=True)
    
    # Template
    TEMPLATE_DEFAULT = 'default'
    TEMPLATE_LANDING = 'landing'
    TEMPLATE_CONTACT = 'contact'
    TEMPLATE_ABOUT = 'about'
    TEMPLATE_FAQ = 'faq'
    TEMPLATE_CHOICES = [
        (TEMPLATE_DEFAULT, 'Default'),
        (TEMPLATE_LANDING, 'Landing Page'),
        (TEMPLATE_CONTACT, 'Contact Page'),
        (TEMPLATE_ABOUT, 'About Page'),
        (TEMPLATE_FAQ, 'FAQ Page'),
    ]
    template = models.CharField(
        max_length=20,
        choices=TEMPLATE_CHOICES,
        default=TEMPLATE_DEFAULT
    )
    
    # Menu
    show_in_header = models.BooleanField(default=False)
    show_in_footer = models.BooleanField(default=False)
    menu_order = models.PositiveIntegerField(default=0)
    
    # Status
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['menu_order', 'title']
        verbose_name = 'Page'
        verbose_name_plural = 'Pages'
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return f'/pages/{self.slug}/'


class FAQ(models.Model):
    """
    FAQ item model.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    question = models.CharField(max_length=500)
    answer = models.TextField()
    
    # Category
    category = models.CharField(max_length=100, blank=True)
    
    # Ordering
    sort_order = models.PositiveIntegerField(default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'created_at']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
    
    def __str__(self):
        return self.question[:100]


class ContactMessage(models.Model):
    """
    Contact form submission.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    
    # Status
    STATUS_NEW = 'new'
    STATUS_READ = 'read'
    STATUS_REPLIED = 'replied'
    STATUS_CLOSED = 'closed'
    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_READ, 'Read'),
        (STATUS_REPLIED, 'Replied'),
        (STATUS_CLOSED, 'Closed'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_NEW
    )
    
    # Admin notes
    admin_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


class SiteSettings(models.Model):
    """
    Site-wide settings (singleton).
    """
    # Basic info
    site_name = models.CharField(max_length=100, default='Bunoraa')
    site_tagline = models.CharField(max_length=200, blank=True)
    site_description = models.TextField(blank=True)
    
    # Logo
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    logo_dark = models.ImageField(upload_to='site/', blank=True, null=True)
    favicon = models.ImageField(upload_to='site/', blank=True, null=True)
    
    # Contact info
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_address = models.TextField(blank=True)
    
    # Social links
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)
    
    # SEO defaults
    default_meta_title = models.CharField(max_length=200, blank=True)
    default_meta_description = models.TextField(blank=True, max_length=300)
    
    # E-commerce settings
    currency = models.CharField(max_length=3, default='BDT')
    currency_symbol = models.CharField(max_length=5, default='৳')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    

    
    # Footer content
    footer_text = models.TextField(blank=True)
    copyright_text = models.CharField(max_length=200, blank=True)
    
    # Scripts
    google_analytics_id = models.CharField(max_length=50, blank=True)
    facebook_pixel_id = models.CharField(max_length=50, blank=True)
    custom_head_scripts = models.TextField(blank=True)
    custom_body_scripts = models.TextField(blank=True)
    
    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return 'Site Settings'
    
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
        # Clear cached site settings
        self._clear_cache()
    
    def delete(self, *args, **kwargs):
        pass  # Prevent deletion
    
    @staticmethod
    def _clear_cache():
        """Clear the site settings cache."""
        from django.core.cache import cache
        cache.delete('site_settings_context')
    
    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


from django.core.exceptions import ValidationError


def validate_svg_file(fieldfile_obj):
    """Basic validator for SVG files: checks extension and content type when available."""
    name = getattr(fieldfile_obj, 'name', '')
    if name and not name.lower().endswith('.svg'):
        raise ValidationError('Only SVG files are allowed for SVG icon field.')


class SocialLink(models.Model):
    """
    Social link to show in footer and emails. Managed as part of SiteSettings (inline in admin).
    """
    site = models.ForeignKey('pages.SiteSettings', on_delete=models.CASCADE, related_name='social_links', null=True, blank=True)
    name = models.CharField(max_length=100)
    url = models.URLField()
    def validate_icon_file(fieldfile_obj):
        """Allow common raster images and SVG for icons."""
        name = getattr(fieldfile_obj, 'name', '')
        if name:
            allowed = ('.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp')
            if not any(name.lower().endswith(ext) for ext in allowed):
                raise ValidationError('Icon must be one of: svg, png, jpg, jpeg, gif, webp')

    icon = models.FileField(upload_to='site/social/', validators=[validate_icon_file], blank=True, null=True, help_text='Upload an image or SVG (preferred).')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'

    def __str__(self):
        return self.name

    def get_icon_url(self):
        """Return the stored icon URL (svg or raster)."""
        if self.icon:
            try:
                return self.icon.url
            except Exception:
                pass
        return None

    def save(self, *args, **kwargs):
        # Ensure the SocialLink is associated with the singleton SiteSettings when possible
        if not self.site:
            try:
                self.site = SiteSettings.get_settings()
            except Exception:
                try:
                    from apps.pages.models import SiteSettings
                    self.site = SiteSettings.get_settings()
                except Exception:
                    self.site = None
        super().save(*args, **kwargs)
        # Clear cached site settings
        try:
            SiteSettings._clear_cache()
        except Exception:
            from django.core.cache import cache
            cache.delete('site_settings_context')


class Subscriber(models.Model):
    """
    Newsletter subscriber.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    # Source
    source = models.CharField(max_length=50, default='website')
    
    # Timestamps
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Subscriber'
        verbose_name_plural = 'Subscribers'
    
    def __str__(self):
        return self.email

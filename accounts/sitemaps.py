# accounts/sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import User

class AccountsSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.3
    protocol = 'https'

    def items(self):
        # Only include public profile pages if you have them
        # If not, you might not need this sitemap at all
        return []

    def location(self, obj):
        return reverse('accounts:profile', kwargs={'username': obj.username})
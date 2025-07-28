from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    changefreq = "monthly"  # How often the page changes
    priority = 0.5          # Importance (0.0 to 1.0)
    protocol = 'https'      # Use https for all URLs

    def items(self):
        return [
            'home',                   # Your homepage
            'products:all_products',  # All products listing
            'products:trending',      # Trending products
            'products:new_arrivals',  # New arrivals
            'custom_order:create',    # Custom order page
            'contacts:contact',       # Contact page
            'contacts:about',         # About page
            'faq:list',               # Privacy policy
            'legal:policy_list',      # Terms and conditions
        ]

    def location(self, item):
        # Generate the actual URL for each item
        return reverse(item)
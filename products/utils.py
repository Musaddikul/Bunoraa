from django.db.models import Min, Max, Avg
from django.utils.html import strip_tags

def get_price_range(queryset):
    aggregates = queryset.aggregate(min=Min('price'), max=Max('price'))
    return {
        'min': aggregates['min'] or 0,
        'max': aggregates['max'] or 10000
    }

def generate_structured_data(product, request):
    return {
        "@context": "http://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [request.build_absolute_uri(img.image.url) for img in product.images.all()],
        "description": product.short_description,
        "sku": product.sku,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "BDT",
            "price": str(product.discounted_price or product.price),
            "availability": "InStock" if product.available else "OutOfStock",
            "url": request.build_absolute_uri(product.get_absolute_url())
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.reviews.aggregate(Avg('rating'))['rating__avg'] or 0,
            "reviewCount": product.reviews.count()
        }
    }

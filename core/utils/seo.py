# core/utils/seo.py
def generate_structured_data(product, request):
    # Simple placeholder structured data
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [img.image.url for img in product.images.all()],
        "description": product.description,
        "sku": product.sku,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "BDT",
            "price": str(product.price),
            "availability": "https://schema.org/InStock" if product.available else "https://schema.org/OutOfStock",
            "url": request.build_absolute_uri(product.get_absolute_url())
        }
    }

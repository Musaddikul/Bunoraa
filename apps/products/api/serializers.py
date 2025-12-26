"""
Product API serializers
"""
from rest_framework import serializers
from ..models import (
    Product, ProductImage, ProductVariant, ProductAttribute,
    Tag, Attribute, AttributeValue
)


class TagSerializer(serializers.ModelSerializer):
    """Tag serializer."""
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class AttributeValueSerializer(serializers.ModelSerializer):
    """Attribute value serializer."""
    
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    
    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute_name', 'value']


class AttributeSerializer(serializers.ModelSerializer):
    """Attribute serializer with values."""
    
    values = AttributeValueSerializer(many=True, read_only=True)
    
    class Meta:
        model = Attribute
        fields = ['id', 'name', 'slug', 'values']


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer."""
    
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'alt_text', 'is_primary', 'order']
    
    def get_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductVariantSerializer(serializers.ModelSerializer):
    """Product variant serializer."""
    
    price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    price_converted = serializers.SerializerMethodField()
    attributes = AttributeValueSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'name', 'sku', 'price', 'price_converted', 'price_modifier',
            'stock_quantity', 'is_in_stock', 'attributes', 'image_url'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_price_converted(self, obj):
        request = self.context.get('request') if self.context else None
        target_code = None
        if request:
            target_code = request.query_params.get('currency')
            if not target_code:
                try:
                    from apps.currencies.services import CurrencyService
                    cur = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)
                    if cur:
                        target_code = cur.code
                except Exception:
                    target_code = None
        from_currency = obj.product.get_currency() if hasattr(obj.product, 'get_currency') else None
        from_code = (from_currency.code.upper() if from_currency and getattr(from_currency, 'code', None) else 'BDT')
        try:
            if target_code and target_code.upper() != from_code:
                from apps.currencies.services import CurrencyConversionService
                converted = CurrencyConversionService.convert_by_code(obj.price, from_code, target_code.upper())
                return converted
        except Exception:
            pass
        return obj.price


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product listings (compact)."""
    
    primary_image = serializers.SerializerMethodField()
    # current_price will be converted to request currency when requested
    current_price = serializers.SerializerMethodField()
    # Per-request converted price fields
    price_converted = serializers.SerializerMethodField()
    sale_price_converted = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    def get_currency(self, obj):
        cur = obj.get_currency() if hasattr(obj, 'get_currency') else None
        return cur.code if cur else None

    discount_percentage = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    
    aspect = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'short_description',
            'price', 'sale_price', 'price_converted', 'sale_price_converted', 'current_price', 'currency', 'discount_percentage',
            'is_on_sale', 'is_in_stock', 'is_featured', 'is_new',
            'primary_image', 'average_rating', 'review_count',
            'created_at', 'aspect', 'category'
        ]

    def get_category(self, obj):
        category = obj.categories.filter(is_active=True, is_deleted=False).first()
        if category:
            return {'id': str(category.id), 'name': category.name, 'slug': category.slug}
        return None

    def get_aspect(self, obj):
        eff = obj.get_effective_aspect()
        return {
            'width': str(eff.get('width')),
            'height': str(eff.get('height')),
            'unit': eff.get('unit'),
            'ratio': str(eff.get('ratio')),
            'css': eff.get('css') if eff.get('css') else f"{eff.get('width')}/{eff.get('height')}"
        }    
    def get_primary_image(self, obj):
        image = obj.primary_image
        if image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.image.url)
            return image.image.url
        return None

    def get_current_price(self, obj):
        """Return current price possibly converted to caller's currency.

        If request includes ?currency=XXX it will convert product's price from product.currency to the requested currency.
        Otherwise it returns product.current_price (original amount).
        """
        request = self.context.get('request') if self.context else None
        target_code = None
        if request:
            target_code = request.query_params.get('currency')
            # If no explicit param, use user's/session currency
            if not target_code:
                try:
                    from apps.currencies.services import CurrencyService
                    cur = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)
                    if cur:
                        target_code = cur.code
                except Exception:
                    target_code = None
        # Determine product's source currency via FK or default
        from_currency = obj.get_currency() if hasattr(obj, 'get_currency') else None
        from_code = (from_currency.code.upper() if from_currency and getattr(from_currency, 'code', None) else 'BDT')
        try:
            if target_code and target_code.upper() != from_code:
                from apps.currencies.services import CurrencyConversionService
                converted = CurrencyConversionService.convert_by_code(obj.current_price, from_code, target_code.upper())
                return converted
        except Exception:
            pass
        return obj.current_price

    def _convert_amount(self, amount, obj, request=None):
        """Helper to convert an arbitrary amount from product's currency to target/request currency."""
        if amount is None:
            return None
        target_code = None
        if request:
            target_code = request.query_params.get('currency')
            if not target_code:
                try:
                    from apps.currencies.services import CurrencyService
                    cur = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)
                    if cur:
                        target_code = cur.code
                except Exception:
                    target_code = None
        from_currency = obj.get_currency() if hasattr(obj, 'get_currency') else None
        from_code = (from_currency.code.upper() if from_currency and getattr(from_currency, 'code', None) else 'BDT')
        try:
            if target_code and target_code.upper() != from_code:
                from apps.currencies.services import CurrencyConversionService
                converted = CurrencyConversionService.convert_by_code(amount, from_code, target_code.upper())
                return converted
        except Exception:
            pass
        return amount

    def get_price_converted(self, obj):
        request = self.context.get('request') if self.context else None
        return self._convert_amount(obj.price, obj, request=request)

    def get_sale_price_converted(self, obj):
        request = self.context.get('request') if self.context else None
        return self._convert_amount(obj.sale_price, obj, request=request)


class ProductDetailSerializer(serializers.ModelSerializer):
    """Detailed product serializer."""
    
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    categories = serializers.SerializerMethodField()
    # current_price converted to request currency when requested
    current_price = serializers.SerializerMethodField()
    # Per-request converted price fields
    price_converted = serializers.SerializerMethodField()
    sale_price_converted = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    def get_currency(self, obj):
        cur = obj.get_currency() if hasattr(obj, 'get_currency') else None
        return cur.code if cur else None
    
    discount_percentage = serializers.IntegerField(read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    breadcrumbs = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()
    
    aspect = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'description', 'short_description',
            'price', 'sale_price', 'price_converted', 'sale_price_converted', 'current_price', 'currency', 'discount_percentage',
            'stock_quantity', 'is_on_sale', 'is_in_stock', 'is_low_stock',
            'is_featured', 'is_new', 'is_bestseller',
            'weight', 'length', 'width', 'height',
            'meta_title', 'meta_description',
            'images', 'variants', 'tags', 'categories',
            'average_rating', 'review_count', 'view_count', 'sold_count',
            'breadcrumbs', 'related_products',
            'created_at', 'updated_at', 'aspect'
        ]

    def get_aspect(self, obj):
        eff = obj.get_effective_aspect()
        return {
            'width': str(eff.get('width')),
            'height': str(eff.get('height')),
            'unit': eff.get('unit'),
            'ratio': str(eff.get('ratio')),
            'css': eff.get('css') if eff.get('css') else f"{eff.get('width')}/{eff.get('height')}"
        }    
    def get_categories(self, obj):
        from apps.categories.api.serializers import CategorySerializer
        return CategorySerializer(
            obj.categories.filter(is_active=True, is_deleted=False),
            many=True,
            context=self.context
        ).data
    
    def get_breadcrumbs(self, obj):
        breadcrumbs = [{'name': 'Home', 'slug': ''}]
        category = obj.categories.first()
        if category:
            for crumb in category.get_breadcrumbs():
                breadcrumbs.append(crumb)
        return breadcrumbs
    
    def get_related_products(self, obj):
        from ..services import ProductService
        related = ProductService.get_related_products(obj, limit=4)
        return ProductListSerializer(related, many=True, context=self.context).data

    def get_current_price(self, obj):
        request = self.context.get('request') if self.context else None
        target_code = None
        if request:
            target_code = request.query_params.get('currency')
            if not target_code:
                try:
                    from apps.currencies.services import CurrencyService
                    cur = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)
                    if cur:
                        target_code = cur.code
                except Exception:
                    target_code = None
        # Determine product's source currency via FK or default
        from_currency = obj.get_currency() if hasattr(obj, 'get_currency') else None
        from_code = (from_currency.code.upper() if from_currency and getattr(from_currency, 'code', None) else 'BDT')
        try:
            if target_code and target_code.upper() != from_code:
                from apps.currencies.services import CurrencyConversionService
                converted = CurrencyConversionService.convert_by_code(obj.current_price, from_code, target_code.upper())
                return converted
        except Exception:
            pass
        return obj.current_price

    def _convert_amount(self, amount, obj, request=None):
        """Helper to convert an arbitrary amount from product's currency to target/request currency."""
        if amount is None:
            return None
        target_code = None
        if request:
            target_code = request.query_params.get('currency')
            if not target_code:
                try:
                    from apps.currencies.services import CurrencyService
                    cur = CurrencyService.get_user_currency(user=request.user if request.user.is_authenticated else None, request=request)
                    if cur:
                        target_code = cur.code
                except Exception:
                    target_code = None
        from_currency = obj.get_currency() if hasattr(obj, 'get_currency') else None
        from_code = (from_currency.code.upper() if from_currency and getattr(from_currency, 'code', None) else 'BDT')
        try:
            if target_code and target_code.upper() != from_code:
                from apps.currencies.services import CurrencyConversionService
                converted = CurrencyConversionService.convert_by_code(amount, from_code, target_code.upper())
                return converted
        except Exception:
            pass
        return amount

    def get_price_converted(self, obj):
        request = self.context.get('request') if self.context else None
        return self._convert_amount(obj.price, obj, request=request)

    def get_sale_price_converted(self, obj):
        request = self.context.get('request') if self.context else None
        return self._convert_amount(obj.sale_price, obj, request=request)


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating products."""
    
    categories = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    tags = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'sku', 'description', 'short_description',
            'price', 'sale_price', 'cost_price', 'currency',
            'stock_quantity', 'low_stock_threshold', 'track_inventory', 'allow_backorder',
            'categories', 'tags',
            'weight', 'length', 'width', 'height',
            # Image aspect override
            'aspect_width', 'aspect_height', 'aspect_unit',
            'meta_title', 'meta_description', 'meta_keywords',
            'is_active', 'is_featured', 'is_new', 'is_bestseller'
        ]
        extra_kwargs = {
            'slug': {'required': False},
            'sku': {'required': False},
        }
    
    def create(self, validated_data):
        category_ids = validated_data.pop('categories', [])
        tag_ids = validated_data.pop('tags', [])

        # Allow passing currency as ISO code (e.g., 'USD') or as a Currency PK
        currency_val = validated_data.pop('currency', None)
        if currency_val:
            try:
                from apps.currencies.services import CurrencyService
                cur = None
                if isinstance(currency_val, str):
                    cur = CurrencyService.get_currency_by_code(currency_val)
                if not cur:
                    from apps.currencies.models import Currency
                    cur = Currency.objects.filter(id=currency_val).first() if currency_val else None
                if cur:
                    validated_data['currency'] = cur
            except Exception:
                pass

        product = Product.objects.create(**validated_data)
        
        if category_ids:
            from apps.categories.models import Category
            categories = Category.objects.filter(id__in=category_ids)
            product.categories.set(categories)
        
        if tag_ids:
            tags = Tag.objects.filter(id__in=tag_ids)
            product.tags.set(tags)
        
        return product


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating products."""
    
    categories = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    tags = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'sku', 'description', 'short_description',
            'price', 'sale_price', 'cost_price', 'currency',
            'stock_quantity', 'low_stock_threshold', 'track_inventory', 'allow_backorder',
            'categories', 'tags',
            'weight', 'length', 'width', 'height',
            'meta_title', 'meta_description', 'meta_keywords',
            'is_active', 'is_featured', 'is_new', 'is_bestseller'
        ]
    
    def update(self, instance, validated_data):
        category_ids = validated_data.pop('categories', None)
        tag_ids = validated_data.pop('tags', None)

        # Handle currency code or PK
        if 'currency' in validated_data:
            currency_val = validated_data.pop('currency')
            try:
                from apps.currencies.services import CurrencyService
                cur = None
                if isinstance(currency_val, str):
                    cur = CurrencyService.get_currency_by_code(currency_val)
                if not cur:
                    from apps.currencies.models import Currency
                    cur = Currency.objects.filter(id=currency_val).first() if currency_val else None
                if cur is not None:
                    instance.currency = cur
                else:
                    instance.currency = None
            except Exception:
                # Leave existing value if something goes wrong
                pass

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if category_ids is not None:
            from apps.categories.models import Category
            categories = Category.objects.filter(id__in=category_ids)
            instance.categories.set(categories)
        
        if tag_ids is not None:
            tags = Tag.objects.filter(id__in=tag_ids)
            instance.tags.set(tags)
        
        return instance


class ProductImageCreateSerializer(serializers.ModelSerializer):
    """Serializer for uploading product images."""
    
    class Meta:
        model = ProductImage
        fields = ['image', 'alt_text', 'is_primary', 'order']


class BulkStockUpdateSerializer(serializers.Serializer):
    """Serializer for bulk stock updates."""
    
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=0)
    operation = serializers.ChoiceField(choices=['set', 'add', 'subtract'], default='set')

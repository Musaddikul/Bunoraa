# wishlist/models.py
from django.db import models
from django.conf import settings
from products.models import Product
from django.utils import timezone
import uuid

class Wishlist(models.Model):
    """
    Represents a user's wishlist. Each user can have only one wishlist.
    It stores a many-to-many relationship with products.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist',
        verbose_name='User'
    )
    products = models.ManyToManyField(
        Product,
        related_name='wishlisted_by',
        blank=True,
        verbose_name='Products'
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        verbose_name='Created At',
        help_text='The date and time when the wishlist was created.'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At',
        help_text='The date and time when the wishlist was last updated.'
    )
    
    class Meta:
        """
        Meta options for the Wishlist model.
        """
        ordering = ['-updated_at']
        verbose_name = 'Wishlist'
        verbose_name_plural = 'Wishlists'
    
    def __str__(self):
        """
        String representation of the Wishlist object.
        """
        return f"{self.user.username}'s Wishlist"
    
    def save(self, *args, **kwargs):
        """
        Overrides the save method to set created_at timestamp on creation.
        """
        if not self.pk:
            self.created_at = timezone.now()
        super().save(*args, **kwargs)

    def add_product(self, product: Product):
        """
        Adds a product to the wishlist.
        Args:
            product (Product): The product instance to add.
        """
        if product not in self.products.all():
            self.products.add(product)
            self.save()

    def remove_product(self, product: Product):
        """
        Removes a product from the wishlist.
        Args:
            product (Product): The product instance to remove.
        """
        if product in self.products.all():
            self.products.remove(product)
            self.save()

    def has_product(self, product: Product) -> bool:
        """
        Checks if a product is in the wishlist.
        Args:
            product (Product): The product instance to check.
        Returns:
            bool: True if the product is in the wishlist, False otherwise.
        """
        return self.products.filter(id=product.id).exists()

    def get_product_count(self) -> int:
        """
        Returns the number of products in the wishlist.
        Returns:
            int: The count of products.
        """
        return self.products.count()


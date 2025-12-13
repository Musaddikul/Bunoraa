# core/permissions/base.py
"""
Base Permission Classes
Custom permission classes for the Bunoraa platform.
"""
from typing import Any
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwner(permissions.BasePermission):
    """
    Permission that allows only the owner of an object to access it.
    Expects the object to have a 'user' attribute.
    """
    
    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for owner
        return obj.user == request.user


class IsVendor(permissions.BasePermission):
    """
    Permission that allows only vendors to access the view.
    """
    message = 'You must be a registered vendor to perform this action.'
    
    def has_permission(self, request: Request, view: APIView) -> bool:
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'vendor_profile') and request.user.vendor_profile is not None  # type: ignore[union-attr]


class IsVendorOwner(permissions.BasePermission):
    """
    Permission that allows only the vendor owner of an object to access it.
    Expects the object to have a 'vendor' attribute.
    """
    
    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if user is the vendor owner
        if not request.user.is_authenticated:
            return False
        
        if not hasattr(request.user, 'vendor_profile'):
            return False
        
        return obj.vendor == request.user.vendor_profile  # type: ignore[union-attr]


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission that allows read access to anyone,
    but only admin users can modify.
    """
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_staff


class IsAuthenticatedOrCreateOnly(permissions.BasePermission):
    """
    Permission that allows authenticated users full access,
    but anonymous users can only create (POST).
    Useful for guest checkout.
    """
    
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return request.method == 'POST'


class IsVerifiedVendor(permissions.BasePermission):
    """
    Permission that requires the vendor to be verified.
    """
    message = 'Your vendor account must be verified to perform this action.'
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        vendor = getattr(request.user, 'vendor_profile', None)
        if vendor is None:
            return False
        
        return vendor.is_verified


class CanManageProduct(permissions.BasePermission):
    """
    Permission for product management.
    Allows vendor to manage their own products, admin to manage all.
    """
    
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return hasattr(request.user, 'vendor_profile')
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        
        vendor = getattr(request.user, 'vendor_profile', None)
        if vendor is None:
            return False
        
        return obj.vendor == vendor


class CanManageOrder(permissions.BasePermission):
    """
    Permission for order management.
    """
    
    def has_object_permission(self, request, view, obj):
        # Admin can manage all orders
        if request.user.is_staff:
            return True
        
        # Customer can view their own orders
        if obj.user == request.user:
            return request.method in permissions.SAFE_METHODS
        
        # Vendor can manage orders containing their products
        vendor = getattr(request.user, 'vendor_profile', None)
        if vendor:
            return obj.items.filter(product__vendor=vendor).exists()
        
        return False

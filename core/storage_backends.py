# core/storage_backends.py
from storages.backends.s3boto3 import S3Boto3Storage
from django.core.cache import cache
import boto3
from botocore.exceptions import ClientError
import os
import time
import logging

logger = logging.getLogger(__name__)

class StaticStorage(S3Boto3Storage):
    location = 'static'
    default_acl = 'public-read'
    
    def clear_cache(self):
        """Clear static files cache"""
        try:
            if 'AWS_CLOUDFRONT_DISTRIBUTION_ID' in os.environ:
                self._invalidate_cloudfront(['/static/*'])
            cache.delete_pattern('staticfiles:*')
        except Exception as e:
            logger.error(f"Error clearing static cache: {str(e)}")

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    
    def clear_cache(self):
        """Clear media files cache"""
        try:
            if 'AWS_CLOUDFRONT_DISTRIBUTION_ID' in os.environ:
                self._invalidate_cloudfront(['/media/*'])
            cache.delete_pattern('mediafiles:*')
        except Exception as e:
            logger.error(f"Error clearing media cache: {str(e)}")

    def _invalidate_cloudfront(self, paths):
        """Invalidate CloudFront cache for given paths"""
        cloudfront = boto3.client('cloudfront')
        cloudfront.create_invalidation(
            DistributionId=os.environ['AWS_CLOUDFRONT_DISTRIBUTION_ID'],
            InvalidationBatch={
                'Paths': {
                    'Quantity': len(paths),
                    'Items': paths
                },
                'CallerReference': str(time.time())
            }
        )

def clear_html_caches():
    """Clear all HTML-related caches"""
    # Clear Django template cache
    cache.delete_pattern('*.template.cache.*')
    
    # Clear static and media caches
    StaticStorage().clear_cache()
    MediaStorage().clear_cache()
    
    # Clear view cache
    cache.delete_pattern('views.decorators.cache.*')
    
    logger.info("Successfully cleared all HTML caches")
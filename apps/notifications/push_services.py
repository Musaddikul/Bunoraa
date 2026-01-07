"""
Advanced Push Notification Services for Bunoraa

Supports:
- Firebase Cloud Messaging (FCM) for Android/iOS/Web
- Web Push with VAPID for browsers
- Notification batching and priorities
- Rich notifications with images and actions
"""
import json
import logging
from typing import Optional, Dict, Any, List
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger('bunoraa.notifications.push')


class FCMService:
    """
    Firebase Cloud Messaging service for push notifications.
    
    Supports:
    - Android push notifications
    - iOS push notifications (via APNs through FCM)
    - Web push notifications
    """
    
    _client = None
    
    @classmethod
    def get_client(cls):
        """Get or create FCM client."""
        if cls._client is None:
            try:
                import firebase_admin
                from firebase_admin import messaging, credentials
                
                # Initialize Firebase app if not already done
                if not firebase_admin._apps:
                    cred_path = getattr(settings, 'FIREBASE_CREDENTIALS_PATH', None)
                    
                    if cred_path:
                        cred = credentials.Certificate(cred_path)
                    else:
                        # Use environment variable or default
                        cred = credentials.ApplicationDefault()
                    
                    firebase_admin.initialize_app(cred)
                
                cls._client = messaging
                
            except ImportError:
                logger.warning("firebase-admin not installed. Run: pip install firebase-admin")
                return None
            except Exception as e:
                logger.error(f"Failed to initialize Firebase: {e}")
                return None
        
        return cls._client
    
    @staticmethod
    def send_notification(
        token: str,
        title: str,
        body: str,
        data: Dict[str, Any] = None,
        image_url: str = None,
        click_action: str = None,
        priority: str = 'high',
        ttl_seconds: int = 3600,
        collapse_key: str = None,
        badge: int = None,
        sound: str = 'default'
    ) -> bool:
        """
        Send push notification to a single device.
        
        Args:
            token: FCM device token
            title: Notification title
            body: Notification body
            data: Additional data payload
            image_url: URL for notification image
            click_action: URL to open when notification is clicked
            priority: 'high' or 'normal'
            ttl_seconds: Time to live in seconds
            collapse_key: Key to collapse similar notifications
            badge: Badge count (iOS)
            sound: Sound file (default or custom)
        
        Returns:
            bool: True if sent successfully
        """
        messaging = FCMService.get_client()
        if not messaging:
            logger.warning("FCM client not available")
            return False
        
        try:
            # Build notification
            notification = messaging.Notification(
                title=title,
                body=body,
                image=image_url
            )
            
            # Android config
            android_config = messaging.AndroidConfig(
                priority=priority,
                ttl=timezone.timedelta(seconds=ttl_seconds),
                collapse_key=collapse_key,
                notification=messaging.AndroidNotification(
                    icon='ic_notification',
                    color='#6366F1',
                    sound=sound,
                    click_action=click_action
                )
            )
            
            # iOS (APNs) config
            apns_config = messaging.APNSConfig(
                payload=messaging.APNSPayload(
                    aps=messaging.Aps(
                        alert=messaging.ApsAlert(
                            title=title,
                            body=body
                        ),
                        badge=badge,
                        sound=sound,
                        content_available=True
                    )
                )
            )
            
            # Web push config
            webpush_config = messaging.WebpushConfig(
                notification=messaging.WebpushNotification(
                    title=title,
                    body=body,
                    icon='/static/icons/notification-icon.png',
                    badge='/static/icons/notification-badge.png',
                    image=image_url,
                    renotify=True if collapse_key else False,
                    tag=collapse_key
                ),
                fcm_options=messaging.WebpushFCMOptions(
                    link=click_action
                )
            )
            
            # Create message
            message = messaging.Message(
                notification=notification,
                data={k: str(v) for k, v in (data or {}).items()},
                token=token,
                android=android_config,
                apns=apns_config,
                webpush=webpush_config
            )
            
            # Send
            response = messaging.send(message)
            logger.info(f"FCM notification sent: {response}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send FCM notification: {e}")
            return False
    
    @staticmethod
    def send_multicast(
        tokens: List[str],
        title: str,
        body: str,
        data: Dict[str, Any] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Send push notification to multiple devices.
        
        Returns dict with success/failure counts and failed tokens.
        """
        messaging = FCMService.get_client()
        if not messaging:
            return {'success': 0, 'failure': len(tokens), 'failed_tokens': tokens}
        
        try:
            notification = messaging.Notification(
                title=title,
                body=body,
                image=kwargs.get('image_url')
            )
            
            message = messaging.MulticastMessage(
                notification=notification,
                data={k: str(v) for k, v in (data or {}).items()},
                tokens=tokens
            )
            
            response = messaging.send_each_for_multicast(message)
            
            # Track failed tokens
            failed_tokens = []
            for idx, send_response in enumerate(response.responses):
                if not send_response.success:
                    failed_tokens.append(tokens[idx])
            
            return {
                'success': response.success_count,
                'failure': response.failure_count,
                'failed_tokens': failed_tokens
            }
            
        except Exception as e:
            logger.error(f"Failed to send multicast: {e}")
            return {'success': 0, 'failure': len(tokens), 'error': str(e)}
    
    @staticmethod
    def send_to_topic(
        topic: str,
        title: str,
        body: str,
        data: Dict[str, Any] = None,
        **kwargs
    ) -> bool:
        """Send notification to a topic."""
        messaging = FCMService.get_client()
        if not messaging:
            return False
        
        try:
            notification = messaging.Notification(
                title=title,
                body=body,
                image=kwargs.get('image_url')
            )
            
            message = messaging.Message(
                notification=notification,
                data={k: str(v) for k, v in (data or {}).items()},
                topic=topic
            )
            
            response = messaging.send(message)
            logger.info(f"Topic notification sent: {response}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send topic notification: {e}")
            return False
    
    @staticmethod
    def subscribe_to_topic(tokens: List[str], topic: str) -> bool:
        """Subscribe tokens to a topic."""
        messaging = FCMService.get_client()
        if not messaging:
            return False
        
        try:
            response = messaging.subscribe_to_topic(tokens, topic)
            return response.success_count > 0
        except Exception as e:
            logger.error(f"Failed to subscribe to topic: {e}")
            return False


class WebPushService:
    """
    Web Push service using VAPID for browser notifications.
    
    Works with service workers for native browser push notifications
    without FCM dependency.
    """
    
    @staticmethod
    def get_vapid_keys():
        """Get VAPID keys from settings."""
        return {
            'public_key': getattr(settings, 'VAPID_PUBLIC_KEY', ''),
            'private_key': getattr(settings, 'VAPID_PRIVATE_KEY', ''),
            'claims': {
                'sub': f"mailto:{getattr(settings, 'VAPID_ADMIN_EMAIL', 'admin@bunoraa.com')}"
            }
        }
    
    @staticmethod
    def send_notification(
        subscription_info: Dict[str, Any],
        title: str,
        body: str,
        icon: str = None,
        badge: str = None,
        image: str = None,
        url: str = None,
        tag: str = None,
        data: Dict[str, Any] = None,
        actions: List[Dict[str, str]] = None,
        require_interaction: bool = False,
        vibrate: List[int] = None,
        ttl: int = 3600
    ) -> bool:
        """
        Send Web Push notification.
        
        Args:
            subscription_info: Push subscription object from browser
                {
                    'endpoint': 'https://...',
                    'keys': {
                        'p256dh': '...',
                        'auth': '...'
                    }
                }
            title: Notification title
            body: Notification body
            icon: URL for notification icon
            badge: URL for badge icon (small icon)
            image: URL for large image
            url: URL to open on click
            tag: Tag for grouping notifications
            data: Additional data
            actions: List of action buttons [{'action': 'view', 'title': 'View'}]
            require_interaction: Keep notification visible until interacted
            vibrate: Vibration pattern [200, 100, 200]
            ttl: Time to live in seconds
        
        Returns:
            bool: True if sent successfully
        """
        try:
            from pywebpush import webpush
        except ImportError:
            logger.warning("pywebpush not installed. Run: pip install pywebpush")
            return False
        
        vapid = WebPushService.get_vapid_keys()
        
        if not vapid['private_key']:
            logger.warning("VAPID keys not configured")
            return False
        
        # Build payload
        payload = {
            'title': title,
            'body': body,
            'icon': icon or '/static/icons/notification-icon-192.png',
            'badge': badge or '/static/icons/notification-badge-72.png',
            'tag': tag,
            'data': {
                'url': url,
                **(data or {})
            },
            'requireInteraction': require_interaction
        }
        
        if image:
            payload['image'] = image
        
        if actions:
            payload['actions'] = actions
        
        if vibrate:
            payload['vibrate'] = vibrate
        
        try:
            response = webpush(
                subscription_info=subscription_info,
                data=json.dumps(payload),
                vapid_private_key=vapid['private_key'],
                vapid_claims=vapid['claims'],
                ttl=ttl
            )
            
            logger.info(f"Web Push sent successfully: {response.status_code}")
            return response.status_code in (200, 201)
            
        except Exception as e:
            error_msg = str(e)
            
            # Handle expired subscriptions
            if '410' in error_msg or 'gone' in error_msg.lower():
                logger.info("Web Push subscription expired, should be removed")
                raise ExpiredSubscriptionError("Subscription expired")
            
            logger.error(f"Failed to send Web Push: {e}")
            return False
    
    @staticmethod
    def generate_vapid_keys():
        """Generate new VAPID keys (utility function)."""
        try:
            from py_vapid import Vapid
            
            vapid = Vapid()
            vapid.generate_keys()
            
            return {
                'public_key': vapid.public_key,
                'private_key': vapid.private_key
            }
        except ImportError:
            logger.warning("py_vapid not installed. Run: pip install py-vapid")
            return None


class ExpiredSubscriptionError(Exception):
    """Raised when a push subscription has expired."""
    pass


class PushNotificationManager:
    """
    High-level manager for push notifications.
    Handles token management, batching, and fallbacks.
    """
    
    @staticmethod
    def send_to_user(
        user_id: int,
        title: str,
        body: str,
        notification_type: str = None,
        priority: str = 'high',
        **kwargs
    ) -> Dict[str, Any]:
        """
        Send push notification to all user's registered devices.
        
        Returns summary of sends.
        """
        from apps.notifications.models import PushToken
        
        tokens = PushToken.objects.filter(
            user_id=user_id,
            is_active=True
        ).values_list('token', 'device_type')
        
        results = {
            'total': 0,
            'success': 0,
            'failed': 0,
            'devices': []
        }
        
        for token, device_type in tokens:
            results['total'] += 1
            
            if device_type in ('ios', 'android', 'fcm_web'):
                # Use FCM
                success = FCMService.send_notification(
                    token=token,
                    title=title,
                    body=body,
                    priority=priority,
                    data={'type': notification_type, **(kwargs.get('data', {}))},
                    **{k: v for k, v in kwargs.items() if k != 'data'}
                )
            elif device_type == 'web':
                # Use Web Push
                try:
                    subscription = json.loads(token)
                    success = WebPushService.send_notification(
                        subscription_info=subscription,
                        title=title,
                        body=body,
                        **kwargs
                    )
                except Exception:
                    success = False
            else:
                success = False
            
            if success:
                results['success'] += 1
                results['devices'].append({'type': device_type, 'status': 'sent'})
            else:
                results['failed'] += 1
                results['devices'].append({'type': device_type, 'status': 'failed'})
        
        return results
    
    @staticmethod
    def send_bulk(
        user_ids: List[int],
        title: str,
        body: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Send push notification to multiple users efficiently.
        Uses multicast for FCM tokens.
        """
        from apps.notifications.models import PushToken
        
        # Get all tokens
        tokens = PushToken.objects.filter(
            user_id__in=user_ids,
            is_active=True
        ).values_list('token', 'device_type')
        
        # Group by type
        fcm_tokens = []
        web_subscriptions = []
        
        for token, device_type in tokens:
            if device_type in ('ios', 'android', 'fcm_web'):
                fcm_tokens.append(token)
            elif device_type == 'web':
                try:
                    web_subscriptions.append(json.loads(token))
                except Exception:
                    pass
        
        results = {
            'fcm': None,
            'web_push': {'sent': 0, 'failed': 0}
        }
        
        # Send FCM multicast (batches of 500)
        if fcm_tokens:
            all_fcm_results = {'success': 0, 'failure': 0, 'failed_tokens': []}
            
            for i in range(0, len(fcm_tokens), 500):
                batch = fcm_tokens[i:i+500]
                batch_result = FCMService.send_multicast(
                    tokens=batch,
                    title=title,
                    body=body,
                    **kwargs
                )
                all_fcm_results['success'] += batch_result.get('success', 0)
                all_fcm_results['failure'] += batch_result.get('failure', 0)
                all_fcm_results['failed_tokens'].extend(batch_result.get('failed_tokens', []))
            
            results['fcm'] = all_fcm_results
            
            # Deactivate failed tokens
            if all_fcm_results['failed_tokens']:
                PushToken.objects.filter(
                    token__in=all_fcm_results['failed_tokens']
                ).update(is_active=False)
        
        # Send Web Push individually
        for subscription in web_subscriptions:
            try:
                success = WebPushService.send_notification(
                    subscription_info=subscription,
                    title=title,
                    body=body,
                    **kwargs
                )
                if success:
                    results['web_push']['sent'] += 1
                else:
                    results['web_push']['failed'] += 1
            except ExpiredSubscriptionError:
                results['web_push']['failed'] += 1
                # Deactivate expired subscription
                PushToken.objects.filter(
                    token=json.dumps(subscription)
                ).update(is_active=False)
        
        return results
    
    @staticmethod
    def register_token(
        user_id: int,
        token: str,
        device_type: str,
        device_name: str = None
    ):
        """Register or update a push token for a user."""
        from apps.notifications.models import PushToken
        
        obj, created = PushToken.objects.update_or_create(
            token=token,
            defaults={
                'user_id': user_id,
                'device_type': device_type,
                'device_name': device_name,
                'is_active': True
            }
        )
        
        return obj, created
    
    @staticmethod
    def unregister_token(token: str):
        """Unregister a push token."""
        from apps.notifications.models import PushToken
        
        return PushToken.objects.filter(token=token).update(is_active=False)

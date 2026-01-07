"""
SMS Notification Service for Bangladesh
Supports SSL Wireless, BulkSMS BD, and Infobip
"""
import logging
import requests
from typing import Optional, Dict, Any, List
from django.conf import settings

logger = logging.getLogger('bunoraa.sms')


class SMSService:
    """
    Unified SMS service supporting multiple Bangladesh providers.
    """
    
    def __init__(self, provider: Optional[str] = None):
        """Initialize SMS service with specified or default provider."""
        self.provider = provider or getattr(settings, 'SMS_PROVIDER', 'ssl_wireless')
        
        # Provider configurations
        self.providers = {
            'ssl_wireless': SSLWirelessSMS(),
            'bulksmsbd': BulkSMSBD(),
            'infobip': InfobipSMS(),
        }
    
    def send(
        self,
        phone: str,
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send SMS to a phone number.
        
        Args:
            phone: Phone number (with or without country code)
            message: Message content (max 160 chars for single SMS)
            sender_id: Optional sender ID
            
        Returns:
            Dict with status and message ID
        """
        # Normalize phone number for Bangladesh
        phone = self._normalize_phone(phone)
        
        provider = self.providers.get(self.provider)
        if not provider:
            return {
                'success': False,
                'message': f'Unknown SMS provider: {self.provider}'
            }
        
        try:
            return provider.send(phone, message, sender_id)
        except Exception as e:
            logger.error(f"SMS send error: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def send_bulk(
        self,
        phones: List[str],
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send SMS to multiple phone numbers."""
        phones = [self._normalize_phone(p) for p in phones]
        
        provider = self.providers.get(self.provider)
        if not provider:
            return {
                'success': False,
                'message': f'Unknown SMS provider: {self.provider}'
            }
        
        try:
            return provider.send_bulk(phones, message, sender_id)
        except Exception as e:
            logger.error(f"Bulk SMS error: {e}")
            return {
                'success': False,
                'message': str(e)
            }
    
    def _normalize_phone(self, phone: str) -> str:
        """Normalize phone number to Bangladesh format."""
        phone = ''.join(filter(str.isdigit, phone))
        
        if phone.startswith('880'):
            return phone
        elif phone.startswith('0'):
            return '880' + phone[1:]
        elif len(phone) == 10:
            return '880' + phone
        
        return phone


class SSLWirelessSMS:
    """
    SSL Wireless SMS provider for Bangladesh.
    Documentation: https://sslwireless.com/
    """
    
    API_URL = 'https://smsplus.sslwireless.com/api/v3/send-sms'
    
    def __init__(self):
        self.api_key = getattr(settings, 'SSL_WIRELESS_API_KEY', '')
        self.api_token = getattr(settings, 'SSL_WIRELESS_API_TOKEN', '')
        self.sid = getattr(settings, 'SSL_WIRELESS_SID', 'BUNORAA')
    
    def send(
        self,
        phone: str,
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send single SMS."""
        payload = {
            'api_token': self.api_token,
            'sid': sender_id or self.sid,
            'msisdn': phone,
            'sms': message,
            'csms_id': f'BUNORAA_{phone}_{int(__import__("time").time())}',
        }
        
        try:
            response = requests.post(
                self.API_URL,
                json=payload,
                timeout=30
            )
            
            result = response.json()
            
            if result.get('status') == 'SUCCESS':
                return {
                    'success': True,
                    'message_id': result.get('smsinfo', [{}])[0].get('csms_id'),
                    'raw': result
                }
            else:
                return {
                    'success': False,
                    'message': result.get('status_message', 'Unknown error'),
                    'raw': result
                }
                
        except Exception as e:
            logger.error(f"SSL Wireless SMS error: {e}")
            return {'success': False, 'message': str(e)}
    
    def send_bulk(
        self,
        phones: List[str],
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send bulk SMS."""
        results = []
        for phone in phones:
            result = self.send(phone, message, sender_id)
            results.append({'phone': phone, **result})
        
        success_count = sum(1 for r in results if r.get('success'))
        
        return {
            'success': success_count > 0,
            'total': len(phones),
            'sent': success_count,
            'failed': len(phones) - success_count,
            'results': results
        }


class BulkSMSBD:
    """
    BulkSMS BD provider for Bangladesh.
    Documentation: https://bulksmsbd.com/
    """
    
    API_URL = 'http://bulksmsbd.net/api/smsapi'
    
    def __init__(self):
        self.api_key = getattr(settings, 'BULKSMS_API_KEY', '')
        self.sender_id = getattr(settings, 'BULKSMS_SENDER_ID', 'BUNORAA')
    
    def send(
        self,
        phone: str,
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send single SMS."""
        params = {
            'api_key': self.api_key,
            'type': 'text',
            'number': phone,
            'senderid': sender_id or self.sender_id,
            'message': message,
        }
        
        try:
            response = requests.get(
                self.API_URL,
                params=params,
                timeout=30
            )
            
            result = response.json()
            
            if result.get('response_code') == 202:
                return {
                    'success': True,
                    'message_id': result.get('message_id'),
                    'raw': result
                }
            else:
                return {
                    'success': False,
                    'message': result.get('error_message', 'Unknown error'),
                    'raw': result
                }
                
        except Exception as e:
            logger.error(f"BulkSMS BD error: {e}")
            return {'success': False, 'message': str(e)}
    
    def send_bulk(
        self,
        phones: List[str],
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send bulk SMS."""
        # BulkSMS BD supports comma-separated numbers
        params = {
            'api_key': self.api_key,
            'type': 'text',
            'number': ','.join(phones),
            'senderid': sender_id or self.sender_id,
            'message': message,
        }
        
        try:
            response = requests.get(
                self.API_URL,
                params=params,
                timeout=60
            )
            
            result = response.json()
            
            return {
                'success': result.get('response_code') == 202,
                'total': len(phones),
                'raw': result
            }
            
        except Exception as e:
            logger.error(f"BulkSMS BD bulk error: {e}")
            return {'success': False, 'message': str(e)}


class InfobipSMS:
    """
    Infobip SMS provider (international).
    Documentation: https://www.infobip.com/docs/api
    """
    
    def __init__(self):
        self.api_key = getattr(settings, 'INFOBIP_API_KEY', '')
        self.base_url = getattr(settings, 'INFOBIP_BASE_URL', 'https://api.infobip.com')
        self.sender_id = getattr(settings, 'INFOBIP_SENDER_ID', 'BUNORAA')
    
    def send(
        self,
        phone: str,
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send single SMS."""
        headers = {
            'Authorization': f'App {self.api_key}',
            'Content-Type': 'application/json',
        }
        
        payload = {
            'messages': [{
                'from': sender_id or self.sender_id,
                'destinations': [{'to': phone}],
                'text': message,
            }]
        }
        
        try:
            response = requests.post(
                f'{self.base_url}/sms/2/text/advanced',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            result = response.json()
            
            if response.status_code == 200:
                message_result = result.get('messages', [{}])[0]
                return {
                    'success': message_result.get('status', {}).get('groupName') == 'PENDING',
                    'message_id': message_result.get('messageId'),
                    'raw': result
                }
            else:
                return {
                    'success': False,
                    'message': result.get('requestError', {}).get('serviceException', {}).get('text', 'Unknown error'),
                    'raw': result
                }
                
        except Exception as e:
            logger.error(f"Infobip SMS error: {e}")
            return {'success': False, 'message': str(e)}
    
    def send_bulk(
        self,
        phones: List[str],
        message: str,
        sender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send bulk SMS."""
        headers = {
            'Authorization': f'App {self.api_key}',
            'Content-Type': 'application/json',
        }
        
        payload = {
            'messages': [{
                'from': sender_id or self.sender_id,
                'destinations': [{'to': phone} for phone in phones],
                'text': message,
            }]
        }
        
        try:
            response = requests.post(
                f'{self.base_url}/sms/2/text/advanced',
                headers=headers,
                json=payload,
                timeout=60
            )
            
            result = response.json()
            
            return {
                'success': response.status_code == 200,
                'total': len(phones),
                'raw': result
            }
            
        except Exception as e:
            logger.error(f"Infobip bulk SMS error: {e}")
            return {'success': False, 'message': str(e)}


# SMS Templates for common notifications
class SMSTemplates:
    """Pre-defined SMS templates for Bangladesh (Bengali)."""
    
    @staticmethod
    def order_confirmation(order_number: str, total: str) -> str:
        return f"বুনরাআ: আপনার অর্ডার #{order_number} নিশ্চিত করা হয়েছে। মোট: ৳{total}। ধন্যবাদ!"
    
    @staticmethod
    def order_shipped(order_number: str, tracking: str) -> str:
        return f"বুনরাআ: আপনার অর্ডার #{order_number} শিপ করা হয়েছে। ট্র্যাকিং: {tracking}"
    
    @staticmethod
    def order_delivered(order_number: str) -> str:
        return f"বুনরাআ: আপনার অর্ডার #{order_number} ডেলিভারি হয়েছে। ধন্যবাদ!"
    
    @staticmethod
    def otp(code: str) -> str:
        return f"বুনরাআ: আপনার OTP কোড হলো {code}। ৫ মিনিটের মধ্যে ব্যবহার করুন।"
    
    @staticmethod
    def password_reset(code: str) -> str:
        return f"বুনরাআ: পাসওয়ার্ড রিসেট কোড: {code}। কাউকে শেয়ার করবেন না।"
    
    @staticmethod
    def payment_received(order_number: str, amount: str) -> str:
        return f"বুনরাআ: ৳{amount} পেমেন্ট পাওয়া গেছে অর্ডার #{order_number} এর জন্য।"
    
    @staticmethod
    def promotion(message: str) -> str:
        return f"বুনরাআ: {message} bunoraa.com এ ভিজিট করুন!"


# Singleton instance
sms_service = SMSService()

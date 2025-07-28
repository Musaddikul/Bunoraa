# payments/gateways.py
from abc import ABC, abstractmethod
from decimal import Decimal
import logging
import random
import uuid
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)

class PaymentGatewayClient(ABC):
    """
    Abstract Base Class for all payment gateway integrations.
    Defines the common interface for payment operations.
    """
    def __init__(self, method_config: dict):
        """
        Initializes the gateway client with method-specific configuration.
        
        Args:
            method_config (dict): Configuration dictionary for the payment method,
                                  typically from PaymentMethod.config_json.
        """
        self.method_config = method_config
        self.api_key = method_config.get('api_key')
        self.secret_key = method_config.get('secret_key')
        self.base_url = method_config.get('base_url')
        logger.info(f"Initialized abstract gateway client with config: {method_config}")

    @abstractmethod
    def create_payment_intent(self, amount: Decimal, currency: str, order_id: str, user_id: str, metadata: dict = None) -> dict:
        """
        Creates a payment intent or session with the gateway.
        
        Args:
            amount (Decimal): The amount to charge.
            currency (str): The currency code.
            order_id (str): Your internal order ID.
            user_id (str): Your internal user ID.
            metadata (dict, optional): Additional metadata to pass to the gateway.
            
        Returns:
            dict: A dictionary containing gateway-specific intent details,
                  e.g., {'payment_intent_id': '...', 'client_secret': '...', 'status': 'requires_action'}.
        """
        pass

    @abstractmethod
    def process_payment(self, payment_intent_id: str, amount: Decimal, currency: str, payment_data: dict = None) -> dict:
        """
        Processes or confirms a payment intent (e.g., captures authorized funds, finalizes charge).
        
        Args:
            payment_intent_id (str): The ID of the payment intent to process.
            amount (Decimal): The amount to process/capture.
            currency (str): The currency code.
            payment_data (dict, optional): Gateway-specific data for processing (e.g., card token).
            
        Returns:
            dict: A dictionary containing transaction details,
                  e.g., {'success': True, 'transaction_id': '...', 'status': 'completed'}.
        """
        pass

    @abstractmethod
    def initiate_refund(self, transaction_id: str, amount: Decimal, reason: str = None) -> dict:
        """
        Initiates a refund for a given transaction.
        
        Args:
            transaction_id (str): The gateway's transaction ID to refund.
            amount (Decimal): The amount to refund.
            reason (str, optional): Reason for the refund.
            
        Returns:
            dict: A dictionary containing refund details,
                  e.g., {'success': True, 'refund_id': '...', 'status': 'completed'}.
        """
        pass

    @abstractmethod
    def get_payment_status(self, payment_intent_id: str = None, transaction_id: str = None) -> dict:
        """
        Retrieves the current status of a payment from the gateway.
        
        Args:
            payment_intent_id (str, optional): The gateway's payment intent ID.
            transaction_id (str, optional): The gateway's transaction ID.
            
        Returns:
            dict: A dictionary containing the payment status and other details,
                  e.g., {'status': 'completed', 'is_verified': True}.
        """
        pass

    @abstractmethod
    def verify_webhook_signature(self, payload: bytes, signature: str, headers: dict) -> bool:
        """
        Verifies the signature of an incoming webhook to ensure its authenticity.
        
        Args:
            payload (bytes): The raw request body of the webhook.
            signature (str): The signature header provided by the gateway.
            headers (dict): All request headers.
            
        Returns:
            bool: True if the signature is valid, False otherwise.
        """
        pass


class StripeGatewayClient(PaymentGatewayClient):
    """
    Mock implementation for Stripe payment gateway.
    """
    def __init__(self, method_config: dict):
        super().__init__(method_config)
        self.stripe_secret_key = self.method_config.get('secret_key', 'sk_test_mockstripe')
        logger.info("Initialized mock Stripe gateway client.")

    def create_payment_intent(self, amount: Decimal, currency: str, order_id: str, user_id: str, metadata: dict = None) -> dict:
        """
        Mocks Stripe Payment Intent creation.
        """
        logger.info(f"Stripe Mock: Creating Payment Intent for {amount} {currency} (Order: {order_id})")
        if random.random() < 0.05: # 5% failure rate
            return {'success': False, 'error_message': 'Stripe mock: Payment Intent creation failed.'}
        
        intent_id = f"pi_mock_{uuid.uuid4().hex}"
        client_secret = f"cs_mock_{uuid.uuid4().hex}"
        
        return {
            'success': True,
            'payment_intent_id': intent_id,
            'client_secret': client_secret,
            'status': 'requires_payment_method', # Initial status
            'raw_response': {'id': intent_id, 'client_secret': client_secret, 'status': 'requires_payment_method'}
        }

    def process_payment(self, payment_intent_id: str, amount: Decimal, currency: str, payment_data: dict = None) -> dict:
        """
        Mocks Stripe Payment Intent confirmation/capture.
        """
        logger.info(f"Stripe Mock: Processing Payment Intent {payment_intent_id} for {amount} {currency}")
        if random.random() < 0.1: # 10% failure rate
            return {'success': False, 'error_message': 'Stripe mock: Payment processing failed.'}
        
        transaction_id = f"ch_mock_{uuid.uuid4().hex}"
        status = 'succeeded' if random.random() > 0.1 else 'failed' # Simulate some failures
        
        return {
            'success': status == 'succeeded',
            'transaction_id': transaction_id,
            'status': 'completed' if status == 'succeeded' else 'failed',
            'raw_response': {'id': transaction_id, 'status': status, 'amount': float(amount)}
        }

    def initiate_refund(self, transaction_id: str, amount: Decimal, reason: str = None) -> dict:
        """
        Mocks Stripe refund initiation.
        """
        logger.info(f"Stripe Mock: Initiating refund for transaction {transaction_id}, amount {amount}")
        if random.random() < 0.05: # 5% failure rate
            return {'success': False, 'error_message': 'Stripe mock: Refund failed.'}
        
        refund_id = f"re_mock_{uuid.uuid4().hex}"
        return {
            'success': True,
            'refund_id': refund_id,
            'status': 'succeeded',
            'raw_response': {'id': refund_id, 'status': 'succeeded', 'amount': float(amount)}
        }

    def get_payment_status(self, payment_intent_id: str = None, transaction_id: str = None) -> dict:
        """
        Mocks Stripe payment status retrieval.
        """
        logger.info(f"Stripe Mock: Getting status for Intent {payment_intent_id} / Txn {transaction_id}")
        if random.random() < 0.02: # 2% error rate
            return {'success': False, 'error_message': 'Stripe mock: Status retrieval error.'}
        
        # Simulate various statuses
        statuses = [
            PaymentStatus.PENDING, PaymentStatus.AUTHORIZED, PaymentStatus.CAPTURED,
            PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.REQUIRES_ACTION
        ]
        status = random.choice(statuses)
        
        return {
            'success': True,
            'status': status,
            'is_verified': status in [PaymentStatus.COMPLETED, PaymentStatus.CAPTURED],
            'raw_response': {'status': status, 'id': payment_intent_id or transaction_id}
        }

    def verify_webhook_signature(self, payload: bytes, signature: str, headers: dict) -> bool:
        """
        Mocks Stripe webhook signature verification.
        In real life, use stripe.Webhook.construct_event.
        """
        logger.info("Stripe Mock: Verifying webhook signature (always true for mock).")
        return True # Always true for mock

class BkashGatewayClient(PaymentGatewayClient):
    """
    Mock implementation for bKash payment gateway.
    """
    def __init__(self, method_config: dict):
        super().__init__(method_config)
        self.username = self.method_config.get('username', 'mock_bkash_user')
        self.password = self.method_config.get('password', 'mock_bkash_pass')
        self.app_key = self.method_config.get('app_key', 'mock_app_key')
        self.app_secret = self.method_config.get('app_secret', 'mock_app_secret')
        logger.info("Initialized mock bKash gateway client.")

    def create_payment_intent(self, amount: Decimal, currency: str, order_id: str, user_id: str, metadata: dict = None) -> dict:
        """
        Mocks bKash payment creation.
        """
        logger.info(f"bKash Mock: Creating Payment for {amount} {currency} (Order: {order_id})")
        if random.random() < 0.07:
            return {'success': False, 'error_message': 'bKash mock: Payment creation failed.'}
        
        payment_id = f"bkash_mock_{uuid.uuid4().hex}"
        return {
            'success': True,
            'payment_intent_id': payment_id, # bKash uses paymentID
            'redirect_url': f"https://mockbkash.com/pay?id={payment_id}&amount={amount}",
            'status': 'requires_customer_action', # Customer needs to redirect to bKash
            'raw_response': {'paymentID': payment_id, 'status': 'created'}
        }

    def process_payment(self, payment_intent_id: str, amount: Decimal, currency: str, payment_data: dict = None) -> dict:
        """
        Mocks bKash payment execution.
        """
        logger.info(f"bKash Mock: Executing Payment {payment_intent_id} for {amount} {currency}")
        if random.random() < 0.1:
            return {'success': False, 'error_message': 'bKash mock: Payment execution failed.'}
        
        transaction_id = f"txn_bkash_{uuid.uuid4().hex}"
        status = 'completed' if random.random() > 0.1 else 'failed'
        
        return {
            'success': status == 'completed',
            'transaction_id': transaction_id,
            'status': status,
            'raw_response': {'transactionStatus': status, 'trxID': transaction_id}
        }

    def initiate_refund(self, transaction_id: str, amount: Decimal, reason: str = None) -> dict:
        """
        Mocks bKash refund initiation.
        """
        logger.info(f"bKash Mock: Initiating refund for transaction {transaction_id}, amount {amount}")
        if random.random() < 0.05:
            return {'success': False, 'error_message': 'bKash mock: Refund failed.'}
        
        refund_id = f"ref_bkash_{uuid.uuid4().hex}"
        return {
            'success': True,
            'refund_id': refund_id,
            'status': 'completed',
            'raw_response': {'refundTrxID': refund_id, 'status': 'completed'}
        }

    def get_payment_status(self, payment_intent_id: str = None, transaction_id: str = None) -> dict:
        """
        Mocks bKash payment status retrieval.
        """
        logger.info(f"bKash Mock: Getting status for Payment {payment_intent_id} / Txn {transaction_id}")
        if random.random() < 0.02:
            return {'success': False, 'error_message': 'bKash mock: Status retrieval error.'}
        
        statuses = [
            PaymentStatus.PENDING, PaymentStatus.COMPLETED, PaymentStatus.FAILED
        ]
        status = random.choice(statuses)
        
        return {
            'success': True,
            'status': status,
            'is_verified': status == PaymentStatus.COMPLETED,
            'raw_response': {'transactionStatus': status}
        }

    def verify_webhook_signature(self, payload: bytes, signature: str, headers: dict) -> bool:
        """
        Mocks bKash webhook signature verification.
        """
        logger.info("bKash Mock: Verifying webhook signature (always true for mock).")
        return True # Always true for mock

class SSLCommerzGatewayClient(PaymentGatewayClient):
    """
    Mock implementation for SSLCommerz payment gateway.
    """
    def __init__(self, method_config: dict):
        super().__init__(method_config)
        self.store_id = self.method_config.get('store_id', 'mock_store_id')
        self.store_passwd = self.method_config.get('store_passwd', 'mock_store_passwd')
        logger.info("Initialized mock SSLCommerz gateway client.")

    def create_payment_intent(self, amount: Decimal, currency: str, order_id: str, user_id: str, metadata: dict = None) -> dict:
        """
        Mocks SSLCommerz payment initiation.
        """
        logger.info(f"SSLCommerz Mock: Initiating Payment for {amount} {currency} (Order: {order_id})")
        if random.random() < 0.08:
            return {'success': False, 'error_message': 'SSLCommerz mock: Payment initiation failed.'}
        
        session_id = f"sslc_mock_{uuid.uuid4().hex}"
        return {
            'success': True,
            'payment_intent_id': session_id, # SSLCommerz uses session ID
            'redirect_url': f"https://mocksslcommerz.com/pay?session={session_id}",
            'status': 'requires_customer_action',
            'raw_response': {'sessionkey': session_id, 'status': 'SUCCESS'}
        }

    def process_payment(self, payment_intent_id: str, amount: Decimal, currency: str, payment_data: dict = None) -> dict:
        """
        Mocks SSLCommerz payment validation.
        In SSLCommerz, 'processing' often happens via IPN/webhook.
        This method might be used for direct validation.
        """
        logger.info(f"SSLCommerz Mock: Validating Payment {payment_intent_id} for {amount} {currency}")
        if random.random() < 0.1:
            return {'success': False, 'error_message': 'SSLCommerz mock: Payment validation failed.'}
        
        transaction_id = f"sslc_txn_{uuid.uuid4().hex}"
        status = 'VALID' if random.random() > 0.1 else 'FAILED'
        
        return {
            'success': status == 'VALID',
            'transaction_id': transaction_id,
            'status': PaymentStatus.COMPLETED if status == 'VALID' else PaymentStatus.FAILED,
            'raw_response': {'status': status, 'tran_id': transaction_id}
        }

    def initiate_refund(self, transaction_id: str, amount: Decimal, reason: str = None) -> dict:
        """
        Mocks SSLCommerz refund initiation.
        """
        logger.info(f"SSLCommerz Mock: Initiating refund for transaction {transaction_id}, amount {amount}")
        if random.random() < 0.05:
            return {'success': False, 'error_message': 'SSLCommerz mock: Refund failed.'}
        
        refund_id = f"sslc_ref_{uuid.uuid4().hex}"
        return {
            'success': True,
            'refund_id': refund_id,
            'status': 'refunded',
            'raw_response': {'refund_ref_id': refund_id, 'status': 'Refunded'}
        }

    def get_payment_status(self, payment_intent_id: str = None, transaction_id: str = None) -> dict:
        """
        Mocks SSLCommerz payment status retrieval.
        """
        logger.info(f"SSLCommerz Mock: Getting status for Session {payment_intent_id} / Txn {transaction_id}")
        if random.random() < 0.02:
            return {'success': False, 'error_message': 'SSLCommerz mock: Status retrieval error.'}
        
        statuses = [
            PaymentStatus.PENDING, PaymentStatus.COMPLETED, PaymentStatus.FAILED
        ]
        status = random.choice(statuses)
        
        return {
            'success': True,
            'status': status,
            'is_verified': status == PaymentStatus.COMPLETED,
            'raw_response': {'status': status}
        }

    def verify_webhook_signature(self, payload: bytes, signature: str, headers: dict) -> bool:
        """
        Mocks SSLCommerz webhook signature verification.
        """
        logger.info("SSLCommerz Mock: Verifying webhook signature (always true for mock).")
        return True # Always true for mock


class PaymentGatewayFactory:
    """
    Factory class to get the appropriate PaymentGatewayClient instance.
    """
    _GATEWAYS = {
        'stripe': StripeGatewayClient,
        'bkash': BkashGatewayClient,
        'sslcommerz': SSLCommerzGatewayClient,
        # Add other gateway clients here
    }

    @classmethod
    def get_client(cls, payment_method_code: str) -> PaymentGatewayClient:
        """
        Returns an instance of the appropriate payment gateway client.

        Args:
            payment_method_code (str): The code of the payment method (e.g., 'stripe_card', 'bkash_mobile').

        Returns:
            PaymentGatewayClient: An instance of a payment gateway client.

        Raises:
            ValueError: If no gateway client is found for the given code.
        """
        from .models import PaymentMethod # Import here to avoid circular dependency

        try:
            payment_method = PaymentMethod.objects.get(code=payment_method_code, is_active=True)
        except PaymentMethod.DoesNotExist:
            raise ValidationError(_(f"Payment method '{payment_method_code}' not found or is inactive."))

        gateway_code = payment_method.gateway_code
        if not gateway_code:
            raise ValueError(_(f"Payment method '{payment_method_code}' does not have an associated gateway code."))

        gateway_class = cls._GATEWAYS.get(gateway_code)
        if not gateway_class:
            raise ValueError(_(f"No payment gateway client found for code: {gateway_code}"))

        # Pass the config_json from the PaymentMethod to the gateway client
        return gateway_class(payment_method.config_json or {})


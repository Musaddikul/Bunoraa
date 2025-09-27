# notifications/tests.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Notification, NotificationTemplate, NotificationPreference, NotificationType, NotificationChannel
from .services import send_notification
from unittest.mock import patch

User = get_user_model()

class NotificationModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password')

    def test_notification_creation(self):
        notif = Notification.objects.create(
            user=self.user,
            notif_type=NotificationType.SYSTEM_ALERT,
            channel=NotificationChannel.IN_APP,
            title='Test Notification',
            message='This is a test.'
        )
        self.assertEqual(Notification.objects.count(), 1)
        self.assertEqual(notif.user, self.user)
        self.assertEqual(notif.title, 'Test Notification')

class NotificationServiceTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password')
        NotificationPreference.objects.create(
            user=self.user,
            notif_type=NotificationType.ORDER_UPDATE,
            channel=NotificationChannel.EMAIL,
            enabled=True
        )
        NotificationTemplate.objects.create(
            name='Order Update Email',
            notif_type=NotificationType.ORDER_UPDATE,
            channel=NotificationChannel.EMAIL,
            subject='Your order {{order_id}} has been updated',
            body_html='<h1>Order Update</h1><p>Your order {{order_id}} is now {{status}}.</p>'
        )

    @patch('notifications.tasks.send_notification_task.delay')
    def test_send_notification(self, mock_send_task):
        context = {'order_id': '123', 'status': 'shipped'}
        send_notification(
            user=self.user,
            notif_type=NotificationType.ORDER_UPDATE,
            context=context
        )
        self.assertEqual(Notification.objects.count(), 1)
        notif = Notification.objects.first()
        self.assertEqual(notif.user, self.user)
        self.assertEqual(notif.title, 'Your order 123 has been updated')
        self.assertIn('shipped', notif.message)
        mock_send_task.assert_called_once_with(notif.id)

class NotificationAPITest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password')
        self.client.login(email='test@example.com', password='password')
        Notification.objects.create(
            user=self.user,
            notif_type=NotificationType.SYSTEM_ALERT,
            channel=NotificationChannel.IN_APP,
            title='Test Notification 1',
            message='This is a test.'
        )
        Notification.objects.create(
            user=self.user,
            notif_type=NotificationType.SYSTEM_ALERT,
            channel=NotificationChannel.IN_APP,
            title='Test Notification 2',
            message='This is another test.'
        )

    def test_mark_all_read_api(self):
        response = self.client.post('/notifications/mark-all-read/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Notification.objects.filter(user=self.user, is_read=False).count(), 0)
        notifs = Notification.objects.filter(user=self.user)
        self.assertNotEqual(notifs[0].read_at, notifs[1].read_at)
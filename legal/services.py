# legal/services.py
from django.core.mail import send_mail
from django.conf import settings
from django.template import Template, Context
from django.urls import reverse
from .models import Subscriber, PolicyAcceptance
from .selectors import get_confirmed_subscribers
from celery import shared_task

def subscribe_user(email):
    sub, created = Subscriber.objects.get_or_create(email=email)
    if not sub.confirmed:
        # send confirmation email
        link = f"{settings.CSRF_TRUSTED_ORIGINS}{reverse('legal:confirm')}?email={email}&token={sub.confirm_token}"
        send_mail(
            subject="Confirm your subscription",
            message=f"Click to confirm: {link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
    return sub

def confirm_subscription(email, token):
    try:
        sub = Subscriber.objects.get(email=email, confirm_token=token)
        sub.confirm()
        return True
    except Subscriber.DoesNotExist:
        return False

def unsubscribe_user(email, token):
    try:
        sub = Subscriber.objects.get(email=email, confirm_token=token)
        sub.unsubscribe()
        return True
    except Subscriber.DoesNotExist:
        return False

@shared_task
def notify_subscribers_of_update(policy_id):
    from .models import Policy
    try:
        policy = Policy.objects.get(pk=policy_id)
    except Policy.DoesNotExist:
        logger.error(f"Policy with id {policy_id} does not exist.")
        return

    subs = get_confirmed_subscribers()
    for sub in subs:
        link = f"{settings.CSRF_TRUSTED_ORIGINS}{reverse('legal:policy', args=[policy.policy_type])}"
        subject = f"Updated {policy.get_policy_type_display()} v{policy.version}"
        body = Template("The {{type}} has been updated. See: {{link}}").render(Context({
            'type': policy.get_policy_type_display(),
            'link': link
        }))
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [sub.email])

def record_acceptance(user, policy, ip_address=None, user_agent=''):
    if not PolicyAcceptance.objects.filter(user=user, policy=policy, version=policy.version).exists():
        PolicyAcceptance.objects.create(
            user=user,
            policy=policy,
            version=policy.version,
            ip_address=ip_address,
            user_agent=user_agent
        )

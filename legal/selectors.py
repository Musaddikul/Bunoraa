# legal/selectors.py
from django.core.cache import cache
from .models import Policy, Subscriber, PolicyAcceptance
from django.utils import timezone

CACHE_TTL = 600

def get_active_policy(policy_type, language='en'):
    key = f"legal_policy_{policy_type}_{language}"
    policy = cache.get(key)
    if policy is None:
        policy = Policy.objects.filter(policy_type=policy_type, language=language, is_active=True).order_by('-version').first()
        cache.set(key, policy, CACHE_TTL)
    return policy

def get_policy_history(policy_type, language='en'):
    return Policy.objects.filter(policy_type=policy_type, language=language).order_by('-version')

def get_confirmed_subscribers():
    return Subscriber.objects.filter(confirmed=True, unsubscribed_at__isnull=True)

def has_user_accepted(user, policy):
    return PolicyAcceptance.objects.filter(user=user, policy=policy, version=policy.version).exists()

# faq/services.py
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import FAQ, FAQFeedback, FAQRequest

def record_feedback(user, faq_id, is_helpful):
    faq = FAQ.objects.get(pk=faq_id, is_active=True)
    obj, created = FAQFeedback.objects.get_or_create(faq=faq, user=user, defaults={'is_helpful':is_helpful})
    if not created:
        if obj.is_helpful == is_helpful:
            raise ValidationError("Already voted.")
        obj.is_helpful = is_helpful
        obj.save(update_fields=['is_helpful'])
    faq.update_vote_counts()
    return faq.helpful_count, faq.not_helpful_count

def submit_request(email, question_text):
    req = FAQRequest.objects.create(email=email, question_text=question_text)
    # send admin notification email / webhook here
    return req

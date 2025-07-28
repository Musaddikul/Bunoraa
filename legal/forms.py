# legal/forms.py
from django import forms
from .models import Subscriber

class SubscriberForm(forms.ModelForm):
    class Meta:
        model = Subscriber
        fields = ['email']

class UnsubscribeForm(forms.Form):
    email = forms.EmailField()
    token = forms.UUIDField()

class PolicyAcceptanceForm(forms.Form):
    policy_id = forms.IntegerField(widget=forms.HiddenInput)
    version   = forms.IntegerField(widget=forms.HiddenInput)
    accept    = forms.BooleanField(label="I agree to this policy")

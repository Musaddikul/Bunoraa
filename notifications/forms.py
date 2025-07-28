# notifications/forms.py
from django import forms
from .models import NotificationTemplate, NotificationPreference

class NotificationTemplateForm(forms.ModelForm):
    class Meta:
        model = NotificationTemplate
        fields = ['name','notif_type','channel','subject','body_html','body_plain']

class NotificationPreferenceForm(forms.ModelForm):
    class Meta:
        model = NotificationPreference
        fields = ['notif_type','channel','enabled']

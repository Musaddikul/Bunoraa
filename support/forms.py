# support/forms.py
from django import forms
from .models import SupportTicket, TicketResponse

class SupportTicketForm(forms.ModelForm):
    attachments = forms.FileField(
        required=False, 
        widget=forms.ClearableFileInput(attrs={'allow_multiple_selected': True})
    )
    tags = forms.CharField(
        required=False, 
        help_text="Comma-separated tags"
    )

    class Meta:
        model = SupportTicket
        fields = ['subject','description','category','priority','assigned_to','tags','attachments']

    def clean_tags(self):
        tags = self.cleaned_data.get('tags','')
        return [t.strip() for t in tags.split(',') if t.strip()]

class TicketResponseForm(forms.ModelForm):
    attachments = forms.FileField(
        required=False,
        widget=forms.ClearableFileInput(attrs={'allow_multiple_selected': True})
    )

    class Meta:
        model = TicketResponse
        fields = ['message','attachments']

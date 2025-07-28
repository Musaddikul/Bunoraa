# faq/forms.py
from django import forms
from .models import FAQRequest

class FAQSearchForm(forms.Form):
    q = forms.CharField(required=False, label="Search FAQs", widget=forms.TextInput(attrs={'placeholder':'Search…'}))
    category = forms.ChoiceField(required=False, choices=[('', 'All')] ,label="Category")

    def __init__(self, *args, **kwargs):
        from .models import Category
        super().__init__(*args, **kwargs)
        cats = [(c.slug, c.name) for c in Category.objects.all()]
        self.fields['category'].choices += cats

class FAQRequestForm(forms.ModelForm):
    class Meta:
        model = FAQRequest
        fields = ['email','question_text']
        widgets = {'question_text': forms.Textarea(attrs={'rows':4})}

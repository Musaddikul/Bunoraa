# contacts/admin.py
from django.contrib import admin
from django import forms
from .models import Policy
from django_ckeditor_5.widgets import CKEditor5Widget

class PolicyAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['content'].required = False

    class Meta:
        model = Policy
        fields = '__all__'
        widgets = {
            'content': CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"},
                config_name="extends"
            ),
        }

@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    form = PolicyAdminForm
    list_display = ('title', 'policy_type', 'last_updated')
    list_filter = ('policy_type',)
    search_fields = ('title', 'content')
    
    class Media:
        css = {
            'all': ('django_ckeditor_5/css/admin.css',),
        }


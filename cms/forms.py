# cms/forms.py
from django import forms
from ckeditor.widgets import CKEditorWidget
from .models import Banner, Page, ContentBlock, SiteSetting

class BannerForm(forms.ModelForm):
    start_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type':'datetime-local'}))
    end_date   = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type':'datetime-local'}), required=False)
    class Meta:
        model  = Banner
        fields = ['title','image','alt_text','link','start_date','end_date','is_active','order','target_groups','ab_variant','ab_weight']

class PageForm(forms.ModelForm):
    content      = forms.CharField(widget=CKEditorWidget())
    publish_date = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type':'datetime-local'}))
    expire_date  = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'type':'datetime-local'}), required=False)
    class Meta:
        model  = Page
        fields = ['slug','title','subtitle','template_name','status','publish_date','expire_date','meta_title','meta_description','language','enable_comments','content','author']

class ContentBlockForm(forms.ModelForm):
    class Meta:
        model  = ContentBlock
        fields = ['identifier','block_type','order','settings','content']

class SiteSettingForm(forms.ModelForm):
    class Meta:
        model  = SiteSetting
        fields = ['key','value','description']

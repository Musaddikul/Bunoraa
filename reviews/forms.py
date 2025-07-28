# reviews/forms.py
from django import forms
from django.core.exceptions import ValidationError
from .models import Review, ReviewImage

class ReviewForm(forms.ModelForm):
    images = forms.FileField(required=False, widget=forms.ClearableFileInput(attrs={'allow_multiple_selected': True}),
                             help_text="Upload up to 5 images (jpg/png).")

    class Meta:
        model = Review
        fields = ['rating','comment','images']
        widgets = {
            'rating': forms.RadioSelect(attrs={'class':'peer hidden'}),
            'comment': forms.Textarea(attrs={
                'rows':4,'maxlength':2000,
                'placeholder':'Write an honest review (max 2000 chars)...'
            })
        }

    def clean_images(self):
        files = self.files.getlist('images')
        if len(files)>5:
            raise ValidationError("You can upload a maximum of 5 images.")
        for f in files:
            if f.content_type.split('/')[0]!='image':
                raise ValidationError("Only image files are allowed.")
            if f.size>2*1024*1024:
                raise ValidationError("Each image must be under 2MB.")
        return files

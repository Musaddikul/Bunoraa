# cms/serializers.py
from rest_framework import serializers
from .models import Banner, Page, ContentBlock, SiteSetting

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Banner
        fields = ['id','title','image','alt_text','link','order']

class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContentBlock
        fields = ['identifier','block_type','order','settings','content']

class PageSerializer(serializers.ModelSerializer):
    blocks = ContentBlockSerializer(many=True, read_only=True)
    class Meta:
        model  = Page
        fields = [
            'slug','title','subtitle','template_name','status',
            'publish_date','expire_date','meta_title','meta_description',
            'language','enable_comments','content','blocks'
        ]

class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SiteSetting
        fields = ['key','value']

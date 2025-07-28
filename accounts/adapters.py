from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import redirect

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request, sociallogin):
        return True 

    def save_user(self, request, sociallogin, form=None):
        user = sociallogin.user
        if not user.username:
            user.username = user.email.split('@')[0]
        user.save()
        return user

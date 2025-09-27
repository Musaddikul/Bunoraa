
from .models import UserSettings

def user_settings_context(request):
    if request.user.is_authenticated:
        settings, created = UserSettings.objects.get_or_create(user=request.user)
        return {'user_settings': settings}
    return {'user_settings': None}

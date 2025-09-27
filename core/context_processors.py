from core.models import Language

def active_languages(request):
    return {
        'active_languages': Language.objects.filter(is_active=True).order_by('name')
    }
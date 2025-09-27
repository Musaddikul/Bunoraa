from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.utils import translation

def health_check(request):
    return HttpResponse("OK", status=200)



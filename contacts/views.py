# contacts/views.py
from django.shortcuts import render, redirect
from django.views.generic import DetailView, ListView
from django.contrib import messages
from .forms import ContactForm
from .models import FAQ
from .forms import NewsletterForm
from .models import Policy


def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'contacts/success.html')
    else:
        form = ContactForm()
    return render(request, 'contacts/contact.html', {'form': form})


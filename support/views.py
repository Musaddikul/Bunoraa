# support/views.py
from django.views.generic import ListView, DetailView, CreateView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import SupportTicket
from .forms import SupportTicketForm, TicketResponseForm
from .services import create_ticket, add_response, resolve_ticket, escalate_ticket
from .selectors import get_user_tickets, get_ticket_detail
from .serializers import SupportTicketSerializer, TicketResponseSerializer

class TicketListView(LoginRequiredMixin, ListView):
    model = SupportTicket
    template_name = 'support/ticket_list.html'
    context_object_name = 'tickets'
    paginate_by = 20

    def get_queryset(self):
        return get_user_tickets(self.request.user)

class TicketCreateView(LoginRequiredMixin, CreateView):
    form_class    = SupportTicketForm
    template_name = 'support/ticket_create.html'
    success_url   = reverse_lazy('support:ticket_list')

    def form_valid(self, form):
        data = form.cleaned_data
        create_ticket(
            user=self.request.user,
            subject=data['subject'],
            description=data['description'],
            category=data['category'],
            priority=data['priority'],
            assigned_to=data.get('assigned_to'),
            tags=data.get('tags'),
            attachments=self.request.FILES.getlist('attachments')
        )
        return super().form_valid(form)

class TicketDetailView(LoginRequiredMixin, DetailView):
    model         = SupportTicket
    template_name = 'support/ticket_detail.html'
    context_object_name = 'ticket'

    def get_object(self):
        return get_ticket_detail(self.kwargs['pk'])

class TicketRespondView(LoginRequiredMixin, FormView):
    form_class    = TicketResponseForm
    template_name = 'support/partials/response_form.html'

    def form_valid(self, form):
        resp = add_response(
            ticket_id=self.kwargs['pk'],
            user=self.request.user,
            message=form.cleaned_data['message'],
            files=self.request.FILES.getlist('attachments')
        )
        if self.request.headers.get('HX-Request'):
            return render(self.request, 'support/partials/response_detail.html', {'response': resp})
        return redirect('support:ticket_detail', pk=self.kwargs['pk'])

# REST APIs
class TicketListAPI(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class  = SupportTicketSerializer

    def get_queryset(self):
        return get_user_tickets(self.request.user)

class TicketDetailAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class  = SupportTicketSerializer
    queryset          = SupportTicket.objects.all()

class TicketRespondAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        resp = add_response(pk, request.user, request.data.get('message'), request.FILES.getlist('attachments'))
        ser  = TicketResponseSerializer(resp)
        return Response(ser.data, status=status.HTTP_201_CREATED)

class TicketResolveAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        ticket = resolve_ticket(pk)
        ser    = SupportTicketSerializer(ticket)
        return Response(ser.data)

class TicketEscalateAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        ticket = escalate_ticket(pk)
        ser    = SupportTicketSerializer(ticket)
        return Response(ser.data)

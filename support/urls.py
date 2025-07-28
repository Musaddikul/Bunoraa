# support/urls.py
from django.urls import path
from . import views

app_name = 'support'

urlpatterns = [
    path('tickets/',                      views.TicketListView.as_view(),       name='ticket_list'),
    path('tickets/create/',               views.TicketCreateView.as_view(),     name='ticket_create'),
    path('tickets/<int:pk>/',             views.TicketDetailView.as_view(),     name='ticket_detail'),
    path('tickets/<int:pk>/respond/',     views.TicketRespondView.as_view(),    name='ticket_respond'),
    path('api/tickets/',                  views.TicketListAPI.as_view(),        name='ticket_list_api'),
    path('api/tickets/<int:pk>/',         views.TicketDetailAPI.as_view(),      name='ticket_detail_api'),
    path('api/tickets/<int:pk>/respond/', views.TicketRespondAPI.as_view(),     name='ticket_respond_api'),
    path('api/tickets/<int:pk>/resolve/', views.TicketResolveAPI.as_view(),     name='ticket_resolve_api'),
    path('api/tickets/<int:pk>/escalate/',views.TicketEscalateAPI.as_view(),    name='ticket_escalate_api'),
]

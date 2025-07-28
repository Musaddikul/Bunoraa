# returns/views.py
from django.views import View
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .forms import ReturnRequestForm, ReturnItemForm, ReturnItemFormSet
from .services import (
    request_return, approve_return,
    generate_return_label, process_refund
)
from .selectors import get_eligible_orders_for_user
from .models import ReturnReason, ReturnRequest
from .serializers import ReturnRequestSerializer
from django.core.exceptions import ValidationError
import json

class ReturnRequestCreateView(LoginRequiredMixin, View):
    def get(self, request):
        form    = ReturnRequestForm()
        reasons = ReturnReason.objects.all()
        eligible = get_eligible_orders_for_user(request.user)
        return render(request, 'returns/request_form.html', {
            'form': form, 'reasons': reasons, 'eligible_orders': eligible
        })

    def post(self, request):
        form = ReturnRequestForm(request.POST)
        items = json.loads(request.POST.get('items_json', '[]'))
        if form.is_valid():
            try:
                rr = request_return(
                    user=request.user,
                    order_id=form.cleaned_data['order'].id,
                    items=items,
                    reason_category_id=form.cleaned_data['reason_category'].id,
                    reason_text=form.cleaned_data['reason_text']
                )
                return JsonResponse({'status':'success','return_id':rr.id})
            except ValidationError as e:
                return JsonResponse({'status':'error','message':str(e)}, status=400)
        return JsonResponse({'status':'error','message':form.errors}, status=400)

class OrderItemsPartialView(LoginRequiredMixin, View):
    def get(self, request):
        order_id = request.GET.get('order_id')
        from orders.models import OrderItem
        items = OrderItem.objects.filter(order__id=order_id, order__user=request.user)
        return render(request, 'returns/partials/order_items.html', {'items': items})

class ReturnRequestListAPI(LoginRequiredMixin, APIView):
    def get(self, request):
        qs = ReturnRequest.objects.filter(user=request.user)
        serializer = ReturnRequestSerializer(qs, many=True)
        return Response(serializer.data)

class ReturnRequestDetailAPI(LoginRequiredMixin, APIView):
    def get(self, request, pk):
        try:
            rr = ReturnRequest.objects.get(pk=pk, user=request.user)
        except ReturnRequest.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ReturnRequestSerializer(rr)
        return Response(serializer.data)

class ApproveReturnAPI(LoginRequiredMixin, APIView):
    def post(self, request, pk):
        try:
            approve_return(pk)
            return Response({'status':'approved'})
        except ValidationError as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GenerateReturnLabelAPI(LoginRequiredMixin, APIView):
    def post(self, request, pk):
        try:
            url = generate_return_label(pk)
            return Response({'label_url':url})
        except ValidationError as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProcessRefundAPI(LoginRequiredMixin, APIView):
    def post(self, request, pk):
        try:
            amt = process_refund(pk)
            return Response({'refund_amount':str(amt)})
        except ValidationError as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)

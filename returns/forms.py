# returns/forms.py
from django import forms
from .models import ReturnRequest, ReturnReason
from orders.models import OrderItem, Order

class ReturnRequestForm(forms.ModelForm):
    class Meta:
        model = ReturnRequest
        fields = ['order','reason_category','reason_text']

class ReturnItemForm(forms.Form):
    order_item = forms.ModelChoiceField(queryset=OrderItem.objects.none())
    quantity   = forms.IntegerField(min_value=1)

    def __init__(self, user, *args, **kwargs):
        super().__init__(*args, **kwargs)
        qs = OrderItem.objects.filter(order__user=user, order__status='delivered')
        self.fields['order_item'].queryset = qs

ReturnItemFormSet = forms.formset_factory(ReturnItemForm, extra=1)

# returns/admin.py
from django.contrib import admin
from .models import ReturnRequest, ReturnReason, ReturnItem, ReturnEvent

class ReturnItemInline(admin.TabularInline):
    model = ReturnItem
    extra = 0
    readonly_fields = ('order_item', 'quantity')

class ReturnEventInline(admin.TabularInline):
    model = ReturnEvent
    extra = 0
    readonly_fields = ('timestamp', 'event', 'notes')

@admin.register(ReturnReason)
class ReturnReasonAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    list_display   = ('id','order','user','status','approved_at','refunded_at','is_active')
    list_filter    = ('status','approved_at','refunded_at','is_active')
    search_fields  = ('order__order_number','user__email')
    inlines        = [ReturnItemInline, ReturnEventInline]
    actions        = ['approve_requests','reject_requests']

    def approve_requests(self, request, queryset):
        for rr in queryset.filter(status=ReturnRequest.STATUS_REQUESTED):
            rr.approve()
        self.message_user(request, "Selected requests approved.")
    approve_requests.short_description = "Approve selected requests"

    def reject_requests(self, request, queryset):
        for rr in queryset.filter(status=ReturnRequest.STATUS_REQUESTED):
            rr.reject()
        self.message_user(request, "Selected requests rejected.")
    reject_requests.short_description = "Reject selected requests"

# support/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import SupportTicket, TicketAttachment, TicketResponse

class TicketAttachmentInline(admin.TabularInline):
    model = TicketAttachment
    extra = 0
    readonly_fields = ('uploaded_by','uploaded_at')

class TicketResponseInline(admin.StackedInline):
    model = TicketResponse
    extra = 0
    readonly_fields = ('user','message','created_at')
    filter_horizontal = ('attachments',)

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display   = ('subject','requester','status','priority','assigned_to','created_relative')
    list_filter    = ('status','priority','category','assigned_to')
    search_fields  = ('subject','description','user__email')
    readonly_fields= ('created_at','updated_at','sla_due')
    inlines        = [TicketResponseInline, TicketAttachmentInline]
    actions        = ['resolve_tickets','escalate_tickets']

    def requester(self,obj):
        return obj.user.username
    requester.short_description = 'Requester'

    def created_relative(self,obj):
        return format_html("<span title='{}'>{}</span>", obj.created_at, obj.created_at.strftime("%b %d"))
    created_relative.short_description = 'Created'

    @admin.action(description="Mark selected as Resolved")
    def resolve_tickets(self,request,queryset):
        for t in queryset: t.mark_resolved()

    @admin.action(description="Escalate selected tickets")
    def escalate_tickets(self,request,queryset):
        for t in queryset: t.escalate()

@admin.register(TicketResponse)
class TicketResponseAdmin(admin.ModelAdmin):
    list_display   = ('ticket','user','short_message','created_at')
    search_fields  = ('message','user__username')
    readonly_fields= ('ticket','user','message','created_at')

    def short_message(self,obj):
        return obj.message[:50]+'...' if len(obj.message)>50 else obj.message
    short_message.short_description = 'Message'

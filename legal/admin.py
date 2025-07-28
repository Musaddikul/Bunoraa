# legal/admin.py
from django.contrib import admin
from .models import Policy, PolicyAcceptance, Subscriber

@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display    = ('title','policy_type','version','language','is_active','published_at')
    list_filter     = ('policy_type','language','is_active')
    search_fields   = ('title','content')
    readonly_fields = ('version','published_at','created_at','updated_at')
    actions         = ['publish_new_version','deactivate_old_versions','notify_subscribers']

    def publish_new_version(self, request, queryset):
        for policy in queryset:
            # admin form must supply new title/content via popup or custom view
            pass
    publish_new_version.short_description = "Publish new version (use service)"

    def deactivate_old_versions(self, request, queryset):
        for policy in queryset:
            policy.is_active = False
            policy.save(update_fields=['is_active'])
    deactivate_old_versions.short_description = "Deactivate selected versions"

    def notify_subscribers(self, request, queryset):
        from .services import notify_subscribers_of_update
        for policy in queryset.filter(is_active=True):
            notify_subscribers_of_update(policy.id)
    notify_subscribers.short_description = "Notify subscribers of updated policy"

@admin.register(PolicyAcceptance)
class PolicyAcceptanceAdmin(admin.ModelAdmin):
    list_display  = ('user','policy','version','accepted_at')
    list_filter   = ('policy__policy_type','version')
    search_fields = ('user__email',)

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display   = ('email','confirmed','subscribed_at','unsubscribed_at')
    search_fields  = ('email',)
    actions        = ['confirm_subscriptions','unsubscribe_subscribers']

    def confirm_subscriptions(self, request, queryset):
        queryset.filter(confirmed=False).update(confirmed=True)
    confirm_subscriptions.short_description = "Confirm selected subscriptions"

    def unsubscribe_subscribers(self, request, queryset):
        for sub in queryset:
            sub.unsubscribe()
    unsubscribe_subscribers.short_description = "Unsubscribe selected"

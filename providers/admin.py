from django.contrib import admin
from .models import ProviderProfile, ProviderEnrolment


@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = (
        "business_name",
        "user",
        "service_category",
        "location",
        "is_available",
    )


@admin.register(ProviderEnrolment)
class ProviderEnrolmentAdmin(admin.ModelAdmin):
    list_display = (
        "business_name",
        "provider",
        "service_category",
        "status",
        "payment_status",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_status",
        "service_category",
    )

    search_fields = (
        "business_name",
        "provider__username",
        "provider__email",
        "payment_reference",
    )
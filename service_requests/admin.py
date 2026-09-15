from django.contrib import admin
from .models import ServiceRequest

# Register your models here.

# Register ServiceRequest so it can be managed through Django admin.
@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    # Display these fields in the admin request list.
    list_display = (
        "id",
        "service_title",
        "customer",
        "provider",
        "status",
        "preferred_date",
        "created_at",
    )

    # Allow filtering requests by status.
    list_filter = ("status",)

    # Allow searching by service title, description, or username.
    search_fields = (
        "service_title",
        "description",
        "customer__username",
        "provider__username",
    )

from django.contrib import admin
from .models import Payment, SubscriptionPlan


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "provider",
        "enrolment",
        "amount",
        "transaction_code",
        "status",
        "payment_date",
        "created_at",
    )

    list_filter = (
        "status",
        "plan",
        "payment_date",
    )

    search_fields = (
        "provider__username",
        "transaction_code",
        "phone_number",
    )


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "amount",
        "duration_days",
        "is_active",
    )
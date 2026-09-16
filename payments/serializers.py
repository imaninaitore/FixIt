from rest_framework import serializers
from .models import Payment, SubscriptionPlan


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "provider",
            "phone_number",
            "plan",
            "amount",
            "transaction_code",
            "payment_date",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "provider",
            "status",
            "created_at",
            "updated_at",
        ]
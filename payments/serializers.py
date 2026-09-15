from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="provider.username",
        read_only=True
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "username",
            "phone_number",
            "plan",
            "amount",
            "status",
            "mpesa_checkout_request_id",
            "mpesa_receipt_number",
            "transaction_date",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "username",
            "amount",
            "status",
            "mpesa_checkout_request_id",
            "mpesa_receipt_number",
            "transaction_date",
            "created_at",
            "updated_at",
        ]
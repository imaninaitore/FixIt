from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    # Display the customer's username instead of the full User object.
    customer = serializers.CharField(
        source="customer.username",
        read_only=True
    )

    # Display the provider's username instead of the full User object.
    provider = serializers.CharField(
        source="provider.username",
        read_only=True
    )

    # Display the related service request ID.
    service_request_id = serializers.IntegerField(
        source="service_request.id",
        read_only=True
    )

    class Meta:
        model = Review

        fields = [
            "id",
            "customer",
            "provider",
            "service_request_id",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "provider",
            "service_request_id",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self, value):
        # Ratings must be between 1 and 5.
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value

from rest_framework import serializers
from .models import ProviderEnrolment


class ProviderEnrolmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProviderEnrolment
        fields = [
            "id",
            "provider",
            "business_name",
            "service_category",
            "description",
            "location",
            "years_of_experience",
            "status",
            "payment_status",
            "payment_reference",
            "paid_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "provider",
            "status",
            "payment_status",
            "paid_at",
            "created_at",
            "updated_at",
        ]

class ProviderEnrolmentSubmissionSerializer(serializers.Serializer):

    business_name = serializers.CharField(max_length=255)
    service_category = serializers.CharField(max_length=100)
    description = serializers.CharField()
    location = serializers.CharField(max_length=255)
    years_of_experience = serializers.IntegerField(min_value=0)

    phone_number = serializers.CharField(max_length=20)
    plan = serializers.ChoiceField(
        choices=[
            ("provider_subscription", "Provider Subscription")
        ]
    )
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    transaction_code = serializers.CharField(max_length=100)
    payment_date = serializers.DateField()      

from rest_framework import serializers
from .models import ProviderEnrolment, ProviderProfile


class ProviderProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProviderProfile

        fields = [
            "id",
            "user",
            "business_name",
            "service_category",
            "description",
            "location",
            "years_of_experience",
            "phone_number",
            "is_available",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]    
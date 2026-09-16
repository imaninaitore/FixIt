from django.contrib.auth.models import User
from rest_framework import serializers

from .models import ProviderProfile,ProviderEnrolment

#this serializer converts the ProviderProfile model into JSON that Postman can understand.

class ProviderProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    class Meta:
        model = ProviderProfile
        fields = [
            "username",
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

# Converts provider enrolment data between JSON and the database
class ProviderEnrolmentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="provider.username",
        read_only=True
    )

    class Meta:
        model = ProviderEnrolment
        fields = [
            "id",
            "username",
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
        ]

        read_only_fields = [
            "id",
            "username",
            "status",
            "payment_status",
            "payment_reference",
            "paid_at",
            "created_at",
        ]

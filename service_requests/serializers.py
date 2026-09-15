from rest_framework import serializers
from django.contrib.auth.models import User

from .models import ServiceRequest
from accounts.models import Account


class ServiceRequestSerializer(serializers.ModelSerializer):
    # This allows the customer to send a provider_id
    # instead of submitting a full provider object.
    provider_id = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True
    )

    # These fields will be returned in the API response
    # but cannot be changed directly by the customer.
    customer = serializers.CharField(
        source="customer.username",
        read_only=True
    )

    provider = serializers.CharField(
        source="provider.username",
        read_only=True
    )

    class Meta:
        model = ServiceRequest

        # These are the fields the serializer handles.
        fields = [
            "id",
            "customer",
            "provider",
            "provider_id",
            "service_title",
            "description",
            "location",
            "preferred_date",
            "status",
            "created_at",
            "updated_at",
        ]

        # These fields are controlled by the system.
        read_only_fields = [
            "id",
            "customer",
            "provider",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_provider_id(self, value):
        # If no provider was supplied, allow the request
        # to continue without an assigned provider.
        if value is None:
            return value

        # Try to find the selected user.
        try:
            provider_user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "The selected provider does not exist."
            )

        # Check whether this user has an Account record.
        try:
            provider_account = Account.objects.get(user=provider_user)
        except Account.DoesNotExist:
            raise serializers.ValidationError(
                "The selected user does not have an account."
            )

        # Make sure the selected user is actually a provider.
        if provider_account.account_type != "provider":
            raise serializers.ValidationError(
                "The selected user is not a service provider."
            )

        # Return the valid provider ID.
        return value

    def create(self, validated_data):
        # Remove provider_id because it is not a direct field
        # on the ServiceRequest model.
        provider_id = validated_data.pop("provider_id", None)

        # Get the provider User object if a provider was supplied.
        provider = None

        if provider_id is not None:
            provider = User.objects.get(id=provider_id)

        # Get the logged-in customer from the request context.
        customer = self.context["request"].user

        # Create and save the service request.
        service_request = ServiceRequest.objects.create(
            customer=customer,
            provider=provider,
            **validated_data
        )

        return service_request

    def update(self, instance, validated_data):
    # Check whether provider_id was included in the request.
    # This lets us distinguish between:
    # 1. provider_id not supplied → keep the existing provider
    # 2. provider_id supplied → update the provider
     provider_id_was_supplied = "provider_id" in self.initial_data

    # Remove provider_id from the normal model fields.
     provider_id = validated_data.pop("provider_id", None)

    # Only change the provider if the client included provider_id.
     if provider_id_was_supplied:
        if provider_id is None:
            # Remove the assigned provider.
            instance.provider = None
        else:
            # Assign the selected provider.
            instance.provider = User.objects.get(id=provider_id)

    # Update the remaining fields.
     for attr, value in validated_data.items():
        setattr(instance, attr, value)

    # Save the updated request.
     instance.save()

     return instance

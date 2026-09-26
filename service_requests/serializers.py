from rest_framework import serializers
from django.contrib.auth.models import User

from .models import ServiceRequest
from accounts.models import Account


class ServiceRequestSerializer(serializers.ModelSerializer):
    # Allows the customer to send a provider ID when creating
    # or updating a service request.
    provider_id = serializers.IntegerField(
        write_only=True,
        required=False,
        allow_null=True
    )

    # Returns the provider's User ID in API responses.
    # This is used by the React frontend for actions such as
    # opening the provider's review page.
    provider_user_id = serializers.IntegerField(
        source="provider.id",
        read_only=True
    )

    # Return usernames instead of full User objects.
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

        fields = [
            "id",
            "customer",
            "provider",
            "provider_id",
            "provider_user_id",
            "service_title",
            "description",
            "location",
            "preferred_date",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "provider",
            "provider_user_id",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_provider_id(self, value):
        # Allow the request to have no provider.
        if value is None:
            return value

        # Check that the selected user exists.
        try:
            provider_user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "The selected provider does not exist."
            )

        # Check that the user has an Account.
        try:
            provider_account = Account.objects.get(user=provider_user)
        except Account.DoesNotExist:
            raise serializers.ValidationError(
                "The selected user does not have an account."
            )

        # Make sure the account belongs to a provider.
        if provider_account.account_type != "provider":
            raise serializers.ValidationError(
                "The selected user is not a service provider."
            )

        return value

    def create(self, validated_data):
        # Remove provider_id because it is not a model field.
        provider_id = validated_data.pop("provider_id", None)

        provider = None

        if provider_id is not None:
            provider = User.objects.get(id=provider_id)

        # The logged-in user becomes the customer.
        customer = self.context["request"].user

        service_request = ServiceRequest.objects.create(
            customer=customer,
            provider=provider,
            **validated_data
        )

        return service_request

    def update(self, instance, validated_data):
        # Check whether provider_id was included in the request.
        provider_id_was_supplied = "provider_id" in self.initial_data

        # Remove provider_id from the normal model fields.
        provider_id = validated_data.pop("provider_id", None)

        # Only change the provider if provider_id was supplied.
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

        instance.save()

        return instance
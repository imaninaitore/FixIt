from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Account


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    account_type = serializers.ChoiceField( choices=Account.ACCOUNT_TYPES )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "account_type",
        ]

    def create(self, validated_data):
        account_type = validated_data.pop("account_type")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        Account.objects.create( user=user, account_type=account_type )

        return user
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Account

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


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




class LoginSerializer(serializers.Serializer):
    #receive login details
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)#means the password can be received, but it won't be displayed as a field in the response.

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        #Check the credentials
        user = authenticate(
            username=username,
            password=password
        )

        #Reject incorrect credentials
        if user is None:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        refresh = RefreshToken.for_user(user) #create tokens

        return {
            "message": "Login successful.",
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

class UserProfileSerializer(serializers.ModelSerializer):
    account_type = serializers.CharField(
        source="account.account_type",
        read_only=True
    )

    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "account_type",
            "is_staff",
            "is_superuser",
        ]

        read_only_fields = [
            "username",
            "account_type",
            "is_staff",
            "is_superuser",
        ]
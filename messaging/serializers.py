from rest_framework import serializers

from .models import Conversation, Message


class ConversationSerializer(serializers.ModelSerializer):
    # Display the customer's username.
    customer = serializers.CharField(
        source="customer.username",
        read_only=True
    )

    # Display the provider's username.
    provider = serializers.CharField(
        source="provider.username",
        read_only=True
    )

    # Used when starting a conversation.
    provider_id = serializers.IntegerField(
        write_only=True,
        required=False
    )

    class Meta:
        model = Conversation

        fields = [
            "id",
            "customer",
            "provider",
            "provider_id",
            "is_archived",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "provider",
            "is_archived",
            "created_at",
            "updated_at",
        ]


class MessageSerializer(serializers.ModelSerializer):
    # Display the sender's username.
    sender = serializers.CharField(
        source="sender.username",
        read_only=True
    )

    # The conversation is supplied through the URL.
    conversation = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:
        model = Message

        fields = [
            "id",
            "conversation",
            "sender",
            "content",
            "is_read",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "conversation",
            "sender",
            "is_read",
            "created_at",
            "updated_at",
        ]

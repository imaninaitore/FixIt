from rest_framework import serializers

from .models import Conversation, Message


class ConversationSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(
        source="customer.username",
        read_only=True
    )

    provider = serializers.CharField(
        source="provider.username",
        read_only=True
    )

    provider_id = serializers.IntegerField(
        write_only=True,
        required=False
    )

    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation

        fields = [
            "id",
            "customer",
            "provider",
            "provider_id",
            "is_archived",
            "unread_count",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "customer",
            "provider",
            "is_archived",
            "unread_count",
            "created_at",
            "updated_at",
        ]

    def get_unread_count(self, conversation):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return 0

        return conversation.messages.filter(
            is_read=False
        ).exclude(
            sender=request.user
        ).count()


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(
        source="sender.username",
        read_only=True
    )

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
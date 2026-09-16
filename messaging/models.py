from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Conversation(models.Model):
    # The customer participating in the conversation.
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="customer_conversations"
    )

    # The provider participating in the conversation.
    provider = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="provider_conversations"
    )

    # Indicates whether the conversation has been archived.
    is_archived = models.BooleanField(default=False)

    # Automatically records when the conversation is created.
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatically updates whenever the conversation changes.
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Prevents duplicate conversations between the same customer and provider.
        constraints = [
            models.UniqueConstraint(
                fields=["customer", "provider"],
                name="unique_customer_provider_conversation"
            )
        ]

    def __str__(self):
        return (
            f"Conversation: {self.customer.username} and "
            f"{self.provider.username}"
        )


class Message(models.Model):
    # The conversation this message belongs to.
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    # The user who sent the message.
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    # The actual message content.
    content = models.TextField()

    # Indicates whether the recipient has read the message.
    is_read = models.BooleanField(default=False)

    # Automatically records when the message is created.
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatically updates whenever the message is edited.
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.sender.username}: "
            f"{self.content[:40]}"
        )

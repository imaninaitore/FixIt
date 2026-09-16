from django.contrib import admin

from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    # Columns displayed for conversations.
    list_display = (
        "id",
        "customer",
        "provider",
        "is_archived",
        "created_at",
        "updated_at",
    )

    # Filters available to the administrator.
    list_filter = (
        "is_archived",
        "created_at",
    )

    # Search by customer and provider usernames.
    search_fields = (
        "customer__username",
        "provider__username",
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    # Columns displayed for messages.
    list_display = (
        "id",
        "conversation",
        "sender",
        "is_read",
        "created_at",
    )

    # Filters available to the administrator.
    list_filter = (
        "is_read",
        "created_at",
    )

    # Search message content and sender.
    search_fields = (
        "content",
        "sender__username",
    )

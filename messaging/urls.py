from django.urls import path

from .views import (
    conversations_list,
    conversation_detail,
    conversation_messages,
    message_detail,
    mark_message_read,
    archive_conversation,
)


urlpatterns = [
    # GET: List user's conversations.
    # POST: Start a conversation.
    path("conversations/",conversations_list,name="conversations_list"),

    # GET: View one conversation.
    path( "conversations/<int:conversation_id>/", conversation_detail, name="conversation_detail" ),

    # GET: View messages.
    # POST: Send a message.
    path( "conversations/<int:conversation_id>/messages/", conversation_messages, name="conversation_messages" ),

    # PATCH: Edit a message.
    # DELETE: Delete a message.
    path( "messages/<int:message_id>/", message_detail, name="message_detail" ),

    # PATCH: Mark a message as read.
    path( "messages/<int:message_id>/read/", mark_message_read, name="mark_message_read" ),

    # POST: Archive a conversation.
    path( "conversations/<int:conversation_id>/archive/", archive_conversation, name="archive_conversation" ),
]

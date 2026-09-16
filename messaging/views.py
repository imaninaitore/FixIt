from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


def user_can_access_conversation(user, conversation):
    # A user can access a conversation only if they are
    # either the customer or the provider.
    return (
        user == conversation.customer
        or user == conversation.provider
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def conversations_list(request):
    # GET: List conversations belonging to the logged-in user.
    if request.method == "GET":
        conversations = Conversation.objects.filter(
            customer=request.user
        ) | Conversation.objects.filter(
            provider=request.user
        )

        conversations = conversations.order_by("-updated_at")

        serializer = ConversationSerializer(
            conversations,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # POST: Start a new conversation.
    if request.method == "POST":
        provider_id = request.data.get("provider_id")

        # A provider ID is required.
        if not provider_id:
            return Response(
                {
                    "error": "provider_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find the selected provider.
        provider = get_object_or_404(
            User,
            id=provider_id
        )

        # Prevent a user from starting a conversation with themselves.
        if provider == request.user:
            return Response(
                {
                    "error": "You cannot start a conversation with yourself."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether this conversation already exists.
        conversation = Conversation.objects.filter(
            customer=request.user,
            provider=provider
        ).first()

        if conversation:
            return Response(
                {
                    "message": "Conversation already exists.",
                    "conversation": ConversationSerializer(
                        conversation
                    ).data
                },
                status=status.HTTP_200_OK
            )

        # Create the conversation.
        conversation = Conversation.objects.create(
            customer=request.user,
            provider=provider
        )

        serializer = ConversationSerializer(conversation)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversation_detail(request, conversation_id):
    # Find the conversation.
    conversation = get_object_or_404(
        Conversation,
        id=conversation_id
    )

    # Only participants can view the conversation.
    if not user_can_access_conversation(
        request.user,
        conversation
    ):
        return Response(
            {
                "error": "You do not have permission to view this conversation."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = ConversationSerializer(conversation)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def conversation_messages(request, conversation_id):
    # Find the conversation.
    conversation = get_object_or_404(
        Conversation,
        id=conversation_id
    )

    # Only participants can access the messages.
    if not user_can_access_conversation(
        request.user,
        conversation
    ):
        return Response(
            {
                "error": "You do not have permission to access these messages."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # GET: View messages in the conversation.
    if request.method == "GET":
        messages = conversation.messages.order_by("created_at")

        serializer = MessageSerializer(
            messages,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # POST: Send a message.
    if request.method == "POST":
        # Do not allow messages in archived conversations.
        if conversation.is_archived:
            return Response(
                {
                    "error": "This conversation is archived."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = MessageSerializer(
            data=request.data
        )

        if serializer.is_valid():
            message = Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=serializer.validated_data["content"]
            )

            # Update the conversation's last activity time.
            conversation.save()

            response_serializer = MessageSerializer(message)

            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def message_detail(request, message_id):
    # Find the message.
    message = get_object_or_404(
        Message,
        id=message_id
    )

    # Only the sender can edit or delete their own message.
    if message.sender != request.user:
        return Response(
            {
                "error": "Only the sender can edit or delete this message."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # PATCH: Edit a message.
    if request.method == "PATCH":
        serializer = MessageSerializer(
            message,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE: Delete a message.
    if request.method == "DELETE":
        message.delete()

        return Response(
            {
                "message": "Message deleted successfully."
            },
            status=status.HTTP_200_OK
        )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_message_read(request, message_id):
    # Find the message.
    message = get_object_or_404(
        Message,
        id=message_id
    )

    # Make sure the logged-in user is part of the conversation.
    if not user_can_access_conversation(
        request.user,
        message.conversation
    ):
        return Response(
            {
                "error": "You do not have permission to access this message."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Only the recipient should mark a message as read.
    if message.sender == request.user:
        return Response(
            {
                "error": "You cannot mark your own message as read."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    message.is_read = True
    message.save()

    serializer = MessageSerializer(message)

    return Response(
        {
            "message": "Message marked as read.",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def archive_conversation(request, conversation_id):
    # Find the conversation.
    conversation = get_object_or_404(
        Conversation,
        id=conversation_id
    )

    # Only participants can archive the conversation.
    if not user_can_access_conversation(
        request.user,
        conversation
    ):
        return Response(
            {
                "error": "You do not have permission to archive this conversation."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Archive the conversation.
    conversation.is_archived = True
    conversation.save()

    serializer = ConversationSerializer(conversation)

    return Response(
        {
            "message": "Conversation archived successfully.",
            "conversation": serializer.data
        },
        status=status.HTTP_200_OK
    )

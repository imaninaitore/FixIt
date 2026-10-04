import { API_URL, authenticatedFetch } from "./api";

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.error ||
            data.detail ||
            "Something went wrong."
        );
    }

    return data;
}


// Get all conversations for the logged-in user
export async function getConversations() {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}


// Get one conversation
export async function getConversation(conversationId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/${conversationId}/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}


// Create a new conversation
export async function createConversation(providerId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider_id: providerId,
            }),
        }
    );

    return handleResponse(response);
}


// Get messages in a conversation
export async function getMessages(conversationId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/${conversationId}/messages/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}


// Alias used by Conversation.jsx
export async function getConversationMessages(conversationId) {
    return getMessages(conversationId);
}


// Send a message
export async function sendMessage(conversationId, content) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/${conversationId}/messages/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content,
            }),
        }
    );

    return handleResponse(response);
}


// Mark all messages in a conversation as read
export async function markConversationRead(conversationId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/${conversationId}/read/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}


// Mark one message as read
export async function markMessageRead(messageId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/messages/${messageId}/read/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}


// Edit a message
export async function editMessage(messageId, content) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/messages/${messageId}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content,
            }),
        }
    );

    return handleResponse(response);
}


// Delete a message
export async function deleteMessage(messageId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/messages/${messageId}/`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}


// Archive a conversation
export async function archiveConversation(conversationId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/${conversationId}/archive/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return handleResponse(response);
}
import { API_URL, authenticatedFetch } from "./api";


// Get all conversations belonging to the logged-in user
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch conversations."
        );
    }

    return data;
}


// Start a conversation with a provider
export async function createConversation(providerId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                provider_id: Number(providerId),
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to create conversation."
        );
    }

    return data;
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch conversation."
        );
    }

    return data;
}


// Get messages in a conversation
export async function getConversationMessages(conversationId) {
    const response = await authenticatedFetch(
        `${API_URL}/messaging/conversations/${conversationId}/messages/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch messages."
        );
    }

    return data;
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to send message."
        );
    }

    return data;
}


// Edit a message
export async function updateMessage(messageId, content) {
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to update message."
        );
    }

    return data;
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to delete message."
        );
    }

    return data;
}


// Mark a message as read
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to mark message as read."
        );
    }

    return data;
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to archive conversation."
        );
    }

    return data;
}

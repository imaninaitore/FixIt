import { API_URL } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// Get all conversations belonging to the logged-in user
export async function getConversations() {
    const response = await fetch(
        `${API_URL}/messaging/conversations/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/conversations/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/conversations/${conversationId}/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/conversations/${conversationId}/messages/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/conversations/${conversationId}/messages/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/messages/${messageId}/`,
        {
            method: "PATCH",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/messages/${messageId}/`,
        {
            method: "DELETE",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/messages/${messageId}/read/`,
        {
            method: "PATCH",
            headers: await getAuthHeaders(),
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
    const response = await fetch(
        `${API_URL}/messaging/conversations/${conversationId}/archive/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
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

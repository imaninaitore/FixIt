import { API_URL } from "./api";

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

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


export async function getConversations() {
    const response = await fetch(
        `${API_URL}/messages/conversations/`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    return handleResponse(response);
}


export async function getConversation(conversationId) {
    const response = await fetch(
        `${API_URL}/messages/conversations/${conversationId}/`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    return handleResponse(response);
}


export async function createConversation(providerId) {
    const response = await fetch(
        `${API_URL}/messages/conversations/`,
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                provider_id: providerId,
            }),
        }
    );

    return handleResponse(response);
}


export async function getMessages(conversationId) {
    const response = await fetch(
        `${API_URL}/messages/conversations/${conversationId}/messages/`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    return handleResponse(response);
}


export async function sendMessage(conversationId, content) {
    const response = await fetch(
        `${API_URL}/messages/conversations/${conversationId}/messages/`,
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                content,
            }),
        }
    );

    return handleResponse(response);
}


export async function markConversationRead(conversationId) {
    const response = await fetch(
        `${API_URL}/messages/conversations/${conversationId}/read/`,
        {
            method: "PATCH",
            headers: getAuthHeaders(),
        }
    );

    return handleResponse(response);
}


export async function markMessageRead(messageId) {
    const response = await fetch(
        `${API_URL}/messages/messages/${messageId}/read/`,
        {
            method: "PATCH",
            headers: getAuthHeaders(),
        }
    );

    return handleResponse(response);
}


export async function editMessage(messageId, content) {
    const response = await fetch(
        `${API_URL}/messages/messages/${messageId}/`,
        {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                content,
            }),
        }
    );

    return handleResponse(response);
}


export async function deleteMessage(messageId) {
    const response = await fetch(
        `${API_URL}/messages/messages/${messageId}/`,
        {
            method: "DELETE",
            headers: getAuthHeaders(),
        }
    );

    return handleResponse(response);
}


export async function archiveConversation(conversationId) {
    const response = await fetch(
        `${API_URL}/messages/conversations/${conversationId}/archive/`,
        {
            method: "POST",
            headers: getAuthHeaders(),
        }
    );

    return handleResponse(response);
}
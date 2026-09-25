import { API_URL } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getServiceRequests() {
    const response = await fetch(
        `${API_URL}/requests/`,
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
            "Failed to fetch service requests."
        );
    }

    return data;
}

export async function createServiceRequest(requestData) {
    const response = await fetch(
        `${API_URL}/requests/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(requestData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to create service request."
        );
    }

    return data;
}

export async function getServiceRequest(requestId) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/`,
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
            "Failed to fetch service request."
        );
    }

    return data;
}

export async function updateServiceRequest(requestId, requestData) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/`,
        {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify(requestData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to update service request."
        );
    }

    return data;
}
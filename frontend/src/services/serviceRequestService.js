import { API_URL } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

async function handleResponse(response, defaultMessage) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            defaultMessage
        );
    }

    return data;
}

// Customer: get all of the logged-in customer's service requests
export async function getServiceRequests() {
    const response = await fetch(
        `${API_URL}/requests/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
        }
    );

    return handleResponse(
        response,
        "Failed to fetch service requests."
    );
}

// Customer: create a new service request
export async function createServiceRequest(formData) {
    const response = await fetch(
        `${API_URL}/requests/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(formData),
        }
    );

    return handleResponse(
        response,
        "Failed to create service request."
    );
}

// Customer/provider: get one service request
export async function getServiceRequest(requestId) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
        }
    );

    return handleResponse(
        response,
        "Failed to fetch service request."
    );
}

// Customer: update a service request
export async function updateServiceRequest(
    requestId,
    formData
) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/`,
        {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify(formData),
        }
    );

    return handleResponse(
        response,
        "Failed to update service request."
    );
}

// Customer: cancel a service request
export async function cancelServiceRequest(requestId) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/`,
        {
            method: "DELETE",
            headers: await getAuthHeaders(),
        }
    );

    return handleResponse(
        response,
        "Failed to cancel service request."
    );
}

// Provider: get assigned service requests
export async function getProviderServiceRequests() {
    const response = await fetch(
        `${API_URL}/requests/provider/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
        }
    );

    return handleResponse(
        response,
        "Failed to fetch assigned service requests."
    );
}

// Provider: accept a request
export async function acceptServiceRequest(requestId) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/accept/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
        }
    );

    return handleResponse(
        response,
        "Failed to accept service request."
    );
}

// Provider: reject a request
export async function rejectServiceRequest(requestId) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/reject/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
        }
    );

    return handleResponse(
        response,
        "Failed to reject service request."
    );
}

// Provider: move request to in_progress or completed
export async function updateServiceRequestStatus(
    requestId,
    status
) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/status/`,
        {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify({
                status,
            }),
        }
    );

    return handleResponse(
        response,
        "Failed to update service request status."
    );
}

// Provider: mark request as completed
export async function completeServiceRequest(requestId) {
    const response = await fetch(
        `${API_URL}/requests/${requestId}/complete/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
        }
    );

    return handleResponse(
        response,
        "Failed to complete service request."
    );
}
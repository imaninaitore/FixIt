import { API_URL, authenticatedFetch } from "./api";


export async function getServiceRequests() {
    const response = await authenticatedFetch(
        `${API_URL}/requests/`,
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
            "Failed to fetch service requests."
        );
    }

    return data;
}


export async function createServiceRequest(requestData) {
    const response = await authenticatedFetch(
        `${API_URL}/requests/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
    const response = await authenticatedFetch(
        `${API_URL}/requests/${requestId}/`,
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
            "Failed to fetch service request."
        );
    }

    return data;
}


export async function updateServiceRequest(requestId, requestData) {
    const response = await authenticatedFetch(
        `${API_URL}/requests/${requestId}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        }
    );

    const data = await response.json();

    if (!r

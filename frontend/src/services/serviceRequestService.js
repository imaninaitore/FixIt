import { API_URL, authenticatedFetch } from "./api";

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
    const response = await authenticatedFetch(`${API_URL}/requests/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    const responseText = await response.text();

    let data = {};

    try {
        data = responseText ? JSON.parse(responseText) : {};
    } catch {
        data = { detail: responseText };
    }

    if (!response.ok) {
        console.error("Service request failed:", {
            status: response.status,
            response: data,
            submittedData: requestData,
        });

        const details =
            typeof data === "object"
                ? Object.entries(data)
                      .map(([field, messages]) => {
                          const message = Array.isArray(messages)
                              ? messages.join(", ")
                              : typeof messages === "object"
                                ? JSON.stringify(messages)
                                : String(messages);

                          return `${field}: ${message}`;
                      })
                      .join(" | ")
                : String(data);

        throw new Error(
            details || `Request failed with status ${response.status}`
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

// Get service requests sent to the logged-in provider
export async function getProviderServiceRequests() {
    const response = await fetch(
        `${API_URL}/requests/provider/`,
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
            "Failed to fetch provider service requests."
        );
    }

    return data;
}

import { API_URL, authenticatedFetch } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getServiceRequests() {
    const response = await fetch(`${API_URL}/requests/`, {
        method: "GET",
        headers: await getAuthHeaders(),
    });

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

    const responseText = await response.text();

    let data = {};

    try {
        data = responseText ? JSON.parse(responseText) : {};
    } catch {
        data = {};
    }

    if (!response.ok) {
        console.error("Create service request failed:", {
            status: response.status,
            response: data,
            submittedData: requestData,
        });

        const details =
            typeof data === "object" && data !== null
                ? Object.values(data)
                    .flat()
                    .join(" ")
                : "";

        throw new Error(
            data.detail ||
                data.error ||
                details ||
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

export async function updateServiceRequest(
    requestId,
    requestData
) {
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

export async function getProviderServiceRequests() {
    const response = await fetch(
        `${API_URL}/requests/provider/`,
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
                "Failed to fetch provider service requests."
        );
    }

    return data;
}

export async function completeServiceRequest(requestId) {
    const response = await authenticatedFetch(
        `${API_URL}/requests/${requestId}/complete/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const responseText = await response.text();

    let data = {};

    try {
        data = responseText ? JSON.parse(responseText) : {};
    } catch {
        data = {};
    }

    if (!response.ok) {
        const details =
            typeof data === "object" && data !== null
                ? Object.values(data)
                    .flat()
                    .join(" ")
                : "";

        throw new Error(
            data.detail ||
                data.error ||
                details ||
                "Failed to mark the service request as completed."
        );
    }

    return data;
}
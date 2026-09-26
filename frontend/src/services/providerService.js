import { API_URL } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}


// Get all approved providers
export async function getProviders() {
    const response = await fetch(
        `${API_URL}/providers/`,
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
            "Failed to fetch providers."
        );
    }

    return data;
}


// Get provider categories
export async function getProviderCategories() {
    const response = await fetch(
        `${API_URL}/providers/categories/`,
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
            "Failed to fetch provider categories."
        );
    }

    return data;
}


// Get one provider by ID
export async function getProvider(providerId) {
    const response = await fetch(
        `${API_URL}/providers/${providerId}/`,
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
            "Failed to fetch provider."
        );
    }

    return data;
}

// Get the logged-in provider's profile
export async function getMyProvider() {
    const response = await fetch(
        `${API_URL}/providers/me/`,
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
            "Failed to fetch your provider profile."
        );
    }

    return data;
}
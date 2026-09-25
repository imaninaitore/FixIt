import { API_URL } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}


// Submit provider enrolment and payment
export async function submitProviderEnrolment(formData) {
    const response = await fetch(
        `${API_URL}/providers/enrolment/submit/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(formData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to submit provider enrolment."
        );
    }

    return data;
}


// Get the logged-in provider's enrolment
export async function getMyProviderEnrolment() {
    const response = await fetch(
        `${API_URL}/providers/enrolment/me/`,
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
            "Failed to fetch your enrolment."
        );
    }

    return data;
}


// Update the logged-in provider's enrolment
export async function updateProviderEnrolment(formData) {
    const response = await fetch(
        `${API_URL}/providers/enrolment/me/update/`,
        {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify(formData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to update your enrolment."
        );
    }

    return data;
}


// Withdraw provider enrolment
export async function withdrawProviderEnrolment() {
    const response = await fetch(
        `${API_URL}/providers/enrolment/me/withdraw/`,
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
            "Failed to withdraw your enrolment."
        );
    }

    return data;
}

import { API_URL } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

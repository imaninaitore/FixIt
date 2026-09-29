import { API_URL, authenticatedFetch } from "./api";


// Submit provider enrolment and payment
export async function submitProviderEnrolment(formData) {
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/submit/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/me/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    // A 404 means the provider has not created an enrolment yet
    if (response.status === 404) {
        return null;
    }

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
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/me/update/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
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
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/me/withdraw/`,
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
            "Failed to withdraw your enrolment."
        );
    }

    return data;
}

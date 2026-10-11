import { API_URL, authenticatedFetch } from "./api";

// Convert the submitted data into the format expected by Django.
// FormData is required when uploading files.
function prepareRequestBody(formData) {
    if (formData instanceof FormData) {
        return {
            body: formData,
            headers: {},
        };
    }

    return {
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
        },
    };
}

// Safely read the response returned by Django.
async function readResponse(response) {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return response.json();
    }

    const message = await response.text();

    return message ? { detail: message } : {};
}

// Submit provider enrolment and payment.
export async function submitProviderEnrolment(formData) {
    const request = prepareRequestBody(formData);

    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/submit/`,
        {
            method: "POST",
            headers: request.headers,
            body: request.body,
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to submit provider enrolment."
        );
    }

    return data;
}

// Get the logged-in provider's enrolment.
export async function getMyProviderEnrolment() {
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/me/`,
        {
            method: "GET",
        }
    );

    // A 404 means the provider has not created an enrolment yet.
    if (response.status === 404) {
        return null;
    }

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch your enrolment."
        );
    }

    return data;
}

// Update the logged-in provider's enrolment.
export async function updateProviderEnrolment(formData) {
    const request = prepareRequestBody(formData);

    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/me/update/`,
        {
            method: "PATCH",
            headers: request.headers,
            body: request.body,
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to update your enrolment."
        );
    }

    return data;
}

// Withdraw provider enrolment.
export async function withdrawProviderEnrolment() {
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/me/withdraw/`,
        {
            method: "POST",
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to withdraw your enrolment."
        );
    }

    return data;
}
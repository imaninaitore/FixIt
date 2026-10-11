
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

// Convert backend field names into user-friendly labels.
function getFieldLabel(field) {
    const fieldLabels = {
        phone_number: "Phone number",
        qualification_document: "Professional qualification certificate",
        referee_name: "Referee name",
        referee_email: "Referee email",
        referee_phone: "Referee phone number",
        business_name: "Business name",
        service_category: "Service category",
        description: "Business description",
        location: "Business location",
        years_of_experience: "Years of experience",
        transaction_code: "M-Pesa transaction code",
        payment_date: "Payment date",
        plan: "Subscription plan",
        amount: "Payment amount",
        non_field_errors: "Submission error",
        detail: "Error",
    };

    if (fieldLabels[field]) {
        return fieldLabels[field];
    }

    return field
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Format Django validation errors into readable messages.
function getErrorMessage(data, fallbackMessage) {
    if (!data || typeof data !== "object") {
        return fallbackMessage;
    }

    // Handle general errors returned by Django.
    if (data.detail && typeof data.detail === "string") {
        return data.detail;
    }

    if (data.error && typeof data.error === "string") {
        return data.error;
    }

    const messages = Object.entries(data)
        .map(([field, errors]) => {
            const label = getFieldLabel(field);

            const errorList = Array.isArray(errors)
                ? errors
                : [errors];

            const details = errorList
                .map((error) => {
                    if (typeof error === "string") {
                        return error;
                    }

                    if (error && typeof error === "object") {
                        return JSON.stringify(error);
                    }

                    return String(error);
                })
                .filter(Boolean)
                .join(" ");

            if (!details) {
                return null;
            }

            return `${label}: ${details}`;
        })
        .filter(Boolean);

    return messages.length > 0
        ? messages.join("\n")
        : fallbackMessage;
}

// Submit provider enrolment and payment.
export async function submitProviderEnrolment(formData) {
    const { body, headers } = prepareRequestBody(formData);

    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/submit/`,
        {
            method: "POST",
            headers,
            body,
        }
    );

    const data = await readResponse(response);

    if (!response.ok) {
        console.error(
            "Provider enrolment API validation errors:",
            data
        );

        throw new Error(
            getErrorMessage(
                data,
                "We couldn't submit your enrolment. Please check your details and try again."
            )
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
            getErrorMessage(
                data,
                "We couldn't load your enrolment. Please try again."
            )
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
        console.error(
            "Provider enrolment update errors:",
            data
        );

        throw new Error(
            getErrorMessage(
                data,
                "We couldn't update your enrolment. Please check your details and try again."
            )
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
            getErrorMessage(
                data,
                "We couldn't withdraw your enrolment. Please try again."
            )
        );
    }

    return data;
}

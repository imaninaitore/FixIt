import { API_URL, authenticatedFetch } from "./api";

// Get admin dashboard statistics
export async function getAdminDashboard() {
    const response = await authenticatedFetch(
        `${API_URL}/admin/dashboard/`,
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
            "Failed to load admin dashboard."
        );
    }

    return data;
}

// Get all users
export async function getAdminUsers() {
    const response = await authenticatedFetch(
        `${API_URL}/admin/users/`,
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
            "Failed to load users."
        );
    }

    return data;
}

// Get one user
export async function getAdminUser(userId) {
    const response = await authenticatedFetch(
        `${API_URL}/admin/users/${userId}/`,
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
            "Failed to load user."
        );
    }

    return data;
}

// Change user active status
export async function updateUserStatus(userId, isActive) {
    const response = await authenticatedFetch(
        `${API_URL}/admin/users/${userId}/status/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                is_active: isActive,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to update user status."
        );
    }

    return data;
}

// Get all provider enrolments
export async function getAdminEnrolments() {
    const response = await authenticatedFetch(
        `${API_URL}/admin/enrolments/`,
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
            "Failed to load enrolments."
        );
    }

    return data;
}

// Get one provider enrolment
export async function getAdminEnrolment(enrolmentId) {
    const response = await authenticatedFetch(
        `${API_URL}/admin/enrolments/${enrolmentId}/`,
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
            "Failed to load enrolment."
        );
    }

    return data;
}

// Approve a provider enrolment
export async function approveEnrolment(enrolmentId) {
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/${enrolmentId}/approve/`,
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
            data.message ||
            "Failed to approve enrolment."
        );
    }

    return data;
}

// Reject a provider enrolment
export async function rejectEnrolment(enrolmentId) {
    const response = await authenticatedFetch(
        `${API_URL}/admin/enrolments/${enrolmentId}/reject/`,
        {
            method: "PATCH",
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
            "Failed to reject enrolment."
        );
    }

    return data;
}

// Get all service requests for administration
export async function getAdminServiceRequests() {
    const response = await authenticatedFetch(
        `${API_URL}/admin/requests/`,
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
            "Failed to load service requests."
        );
    }

    return data;
}

// Get all payments
export async function getAdminPayments() {
    const response = await authenticatedFetch(
        `${API_URL}/admin/payments/`,
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
            "Failed to load payments."
        );
    }

    return data;
}

// Get admin reports
export async function getAdminReports() {
    const response = await authenticatedFetch(
        `${API_URL}/admin/reports/`,
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
            "Failed to load reports."
        );
    }

    return data;
}

// Download a provider's qualification document.
export async function downloadQualificationDocument(enrolmentId) {
    const response = await authenticatedFetch(
        `${API_URL}/providers/enrolment/${enrolmentId}/qualification-document/`,
        {
            method: "GET",
        }
    );

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let message = "Failed to download qualification document.";

        if (contentType?.includes("application/json")) {
            const data = await response.json();
            message = data.detail || data.error || message;
        }

        throw new Error(message);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("content-disposition");
    const filenameMatch = contentDisposition?.match(
        /filename="?([^";]+)"?/i
    );

    const filename =
        filenameMatch?.[1] || `qualification-document-${enrolmentId}`;

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(objectUrl);
}
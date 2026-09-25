import { API_URL } from "./api";


async function getAdminHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}


// Get admin dashboard statistics
export async function getAdminDashboard() {
    const response = await fetch(
        `${API_URL}/admin/dashboard/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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
    const response = await fetch(
        `${API_URL}/admin/users/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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
    const response = await fetch(
        `${API_URL}/admin/users/${userId}/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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
    const response = await fetch(
        `${API_URL}/admin/users/${userId}/status/`,
        {
            method: "PATCH",
            headers: await getAdminHeaders(),
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


// Get provider enrolments
export async function getAdminEnrolments() {
    const response = await fetch(
        `${API_URL}/admin/enrolments/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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
    const response = await fetch(
        `${API_URL}/admin/enrolments/${enrolmentId}/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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


// Approve provider enrolment
export async function approveEnrolment(enrolmentId) {
    const response = await fetch(
        `${API_URL}/admin/enrolments/${enrolmentId}/approve/`,
        {
            method: "PATCH",
            headers: await getAdminHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to approve enrolment."
        );
    }

    return data;
}


// Reject provider enrolment
export async function rejectEnrolment(enrolmentId) {
    const response = await fetch(
        `${API_URL}/admin/enrolments/${enrolmentId}/reject/`,
        {
            method: "PATCH",
            headers: await getAdminHeaders(),
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


// Get service requests
export async function getAdminServiceRequests() {
    const response = await fetch(
        `${API_URL}/admin/requests/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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


// Get payments
export async function getAdminPayments() {
    const response = await fetch(
        `${API_URL}/admin/payments/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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


// Get reports
export async function getAdminReports() {
    const response = await fetch(
        `${API_URL}/admin/reports/`,
        {
            method: "GET",
            headers: await getAdminHeaders(),
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
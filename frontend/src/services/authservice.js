import { API_URL } from "./api";


export async function loginUser(username, password) {
    const response = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        if (Array.isArray(data.non_field_errors)) {
            throw new Error(data.non_field_errors[0]);
        }

        throw new Error(
            data.detail ||
            data.message ||
            "Invalid username or password."
        );
    }

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("username", data.username);

    // Get the logged-in user's Django account information
    const profile = await getMyProfile();

    localStorage.setItem(
        "account_type",
        profile.account_type || ""
    );

    localStorage.setItem(
        "is_staff",
        String(profile.is_staff)
    );

    localStorage.setItem(
        "is_superuser",
        String(profile.is_superuser)
    );

    return {
        ...data,
        profile,
    };
}


export async function registerUser(
    username,
    email,
    password,
    accountType
) {
    const response = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password,
            account_type: accountType,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.username?.[0] ||
            data.email?.[0] ||
            data.password?.[0] ||
            data.account_type?.[0] ||
            data.detail ||
            "Registration failed."
        );
    }

    return data;
}


export async function logoutUser() {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        return;
    }

    const response = await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: refreshToken,
        }),
    });

    const data = await response.json();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    if (!response.ok) {
        throw new Error(
            data.error || "Logout failed."
        );
    }

    return data;
}

export async function getMyProfile() {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/auth/me/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch your profile."
        );
    }

    return data;
}
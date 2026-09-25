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

    return data;
}


export async function registerUser(username, email, password, accountType) {
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
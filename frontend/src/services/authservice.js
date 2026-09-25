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
        // Django may return a non-field error as an array
        if (Array.isArray(data.non_field_errors)) {
            throw new Error(data.non_field_errors[0]);
        }

        throw new Error(
            data.detail ||
            data.message ||
            "Invalid username or password."
        );
    }

    // Store the JWT tokens so other API requests can use them
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    // Store username for frontend use
    localStorage.setItem("username", data.username);

    return data;
}
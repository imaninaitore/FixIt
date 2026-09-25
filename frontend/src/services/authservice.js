// src/services/authService.js

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
        throw new Error(
            data.detail ||
            data.message ||
            "Login failed. Please check your username and password."
        );
    }

    // Save the tokens returned by Django
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    return data;
}
export const API_URL = "http://127.0.0.1:8000/api";


/*
 * Refresh the access token using the refresh token.
 */
export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        return null;
    }

    const response = await fetch(`${API_URL}/auth/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: refreshToken,
        }),
    });

    if (!response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return null;
    }

    const data = await response.json();

    localStorage.setItem("access_token", data.access);

    return data.access;
}


/*
 * Make an authenticated API request.
 *
 * If the access token has expired and Django returns 401,
 * automatically refresh the token and retry the request once.
 */
export async function authenticatedFetch(url, options = {}) {
    let accessToken = localStorage.getItem("access_token");

    const makeRequest = (token) => {
        const headers = {
            ...(options.headers || {}),
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return fetch(url, {
            ...options,
            headers,
        });
    };

    let response = await makeRequest(accessToken);

    /*
     * Access token may have expired.
     * Try refreshing it once.
     */
    if (response.status === 401) {
        accessToken = await refreshAccessToken();

        if (!accessToken) {
            return response;
        }

        response = await makeRequest(accessToken);
    }

    return response;
}


/*
 * Get all approved providers.
 */
export async function getProviders() {
    const response = await fetch(`${API_URL}/providers/`);

    if (!response.ok) {
        throw new Error("Failed to fetch providers");
    }

    return response.json();
}

import { API_URL } from "./api";

async function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// Get all reviews for a provider
export async function getProviderReviews(providerId) {
    const response = await fetch(
        `${API_URL}/reviews/providers/${providerId}/reviews/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch provider reviews."
        );
    }

    return data;
}

// Create a review for a provider
export async function createReview(providerId, reviewData) {
    const response = await fetch(
        `${API_URL}/reviews/providers/${providerId}/reviews/`,
        {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(reviewData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to create review."
        );
    }

    return data;
}

// Get one review
export async function getReview(reviewId) {
    const response = await fetch(
        `${API_URL}/reviews/reviews/${reviewId}/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch review."
        );
    }

    return data;
}

// Update your own review
export async function updateReview(reviewId, reviewData) {
    const response = await fetch(
        `${API_URL}/reviews/reviews/${reviewId}/`,
        {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify(reviewData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to update review."
        );
    }

    return data;
}

// Delete your own review
export async function deleteReview(reviewId) {
    const response = await fetch(
        `${API_URL}/reviews/reviews/${reviewId}/`,
        {
            method: "DELETE",
            headers: await getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to delete review."
        );
    }

    return data;
}

// Get provider rating summary
export async function getProviderRating(providerId) {
    const response = await fetch(
        `${API_URL}/reviews/providers/${providerId}/rating/`,
        {
            method: "GET",
            headers: await getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.error ||
            "Failed to fetch provider rating."
        );
    }

    return data;
}
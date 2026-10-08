import { API_URL, authenticatedFetch } from "./api";


export async function getProviderReviews(providerId) {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/providers/${providerId}/reviews/`,
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
            "Failed to fetch provider reviews."
        );
    }

    return data;
}


export async function createReview(providerId, reviewData) {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/providers/${providerId}/reviews/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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


export async function getReview(reviewId) {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/reviews/${reviewId}/`,
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
            "Failed to fetch review."
        );
    }

    return data;
}


export async function updateReview(reviewId, reviewData) {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/reviews/${reviewId}/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
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


export async function deleteReview(reviewId) {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/reviews/${reviewId}/`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        throw new Error(
            data.detail ||
            data.error ||
            "Failed to delete review."
        );
    }

    return true;
}


export async function getProviderRating(providerId) {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/providers/${providerId}/rating/`,
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
            "Failed to fetch provider rating."
        );
    }

    return data;
}


export async function getMyReviews() {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/my-reviews/`,
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
            "Failed to fetch your reviews."
        );
    }

    return data;
}


export async function getPendingReviews() {
    const response = await authenticatedFetch(
        `${API_URL}/reviews/pending/`,
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
            "Failed to fetch pending reviews."
        );
    }

    return data;
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    getProviderReviews,
    getProviderRating,
} from "../../services/reviewService";

function ProviderReviews() {
    const { providerId } = useParams();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReviews();
    }, [providerId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const [reviewsData, ratingData] = await Promise.all([
                getProviderReviews(providerId),
                getProviderRating(providerId),
            ]);

            setReviews(reviewsData);
            setRating(ratingData);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load provider reviews."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

                    <button
                        onClick={() => navigate("/")}
                        className="text-2xl font-bold text-blue-600"
                    >
                        FixIt
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        Back
                    </button>

                </div>
            </nav>


            <main className="mx-auto max-w-4xl px-6 py-10">

                <h1 className="text-3xl font-bold text-gray-900">
                    Provider Reviews
                </h1>

                <p className="mt-2 text-gray-600">
                    See what customers have said about this provider.
                </p>


                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}


                {/* Rating summary */}
                {!loading && rating && (
                    <div className="mt-8 rounded-xl bg-white p-6 shadow">

                        <p className="text-sm text-gray-500">
                            Average rating
                        </p>

                        <div className="mt-2 flex items-center gap-3">

                            <span className="text-4xl font-bold text-gray-900">
                                {rating.average_rating ?? "0"}
                            </span>

                            <span className="text-gray-500">
                                / 5
                            </span>

                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            {rating.total_reviews ?? reviews.length}{" "}
                            review
                            {(rating.total_reviews ?? reviews.length) !== 1
                                ? "s"
                                : ""}
                        </p>

                    </div>
                )}


                {/* Loading */}
                {loading && (
                    <div className="mt-8 rounded-xl bg-white p-8 shadow">
                        <p className="text-gray-600">
                            Loading reviews...
                        </p>
                    </div>
                )}


                {/* Empty state */}
                {!loading && reviews.length === 0 && !error && (
                    <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">

                        <h2 className="text-xl font-semibold text-gray-900">
                            No reviews yet
                        </h2>

                        <p className="mt-2 text-gray-600">
                            This provider has not received any reviews yet.
                        </p>

                    </div>
                )}


                {/* Reviews */}
                {!loading && reviews.length > 0 && (
                    <div className="mt-8 space-y-5">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="rounded-xl bg-white p-6 shadow"
                            >

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            {review.customer}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(
                                                review.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span className="font-semibold text-blue-600">
                                        {review.rating}/5
                                    </span>

                                </div>


                                <p className="mt-4 text-gray-700">
                                    {review.comment}
                                </p>

                            </div>

                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}

export default ProviderReviews;
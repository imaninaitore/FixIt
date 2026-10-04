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
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: "url('/images/bg.png')",
            }}
        >
            {/* Light overlay keeps the background clear */}
            <div className="absolute inset-0 bg-slate-950/20" />

            <div className="relative z-10 min-h-screen">

                {/* Navbar */}
                <nav className="border-b border-white/20 bg-slate-950/35 backdrop-blur-md">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">

                        <button
                            onClick={() => navigate("/")}
                            className="text-xl font-bold text-white transition hover:text-blue-300 sm:text-2xl"
                        >
                            FixIt
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
                        >
                            Back
                        </button>

                    </div>
                </nav>

                <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">

                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">
                            Provider Reviews
                        </h1>

                        <p className="mt-2 text-sm text-white/80 sm:text-base">
                            See what customers have said about this provider.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-300/30 bg-red-500/15 p-4 text-sm text-white shadow-lg backdrop-blur-md">
                            {error}
                        </div>
                    )}

                    {/* Rating summary */}
                    {!loading && rating && (
                        <div className="rounded-2xl border border-white/20 bg-white/15 p-5 shadow-xl backdrop-blur-xl sm:p-6">

                            <p className="text-sm font-medium text-white/70">
                                Average rating
                            </p>

                            <div className="mt-2 flex items-end gap-2">

                                <span className="text-4xl font-bold text-white sm:text-5xl">
                                    {rating.average_rating ?? "0"}
                                </span>

                                <span className="mb-1 text-white/70">
                                    / 5
                                </span>

                            </div>

                            <p className="mt-2 text-sm text-white/70">
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
                        <div className="mt-6 rounded-2xl border border-white/20 bg-white/15 p-8 shadow-xl backdrop-blur-xl sm:mt-8">
                            <p className="text-center text-sm text-white/80">
                                Loading reviews...
                            </p>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && reviews.length === 0 && !error && (
                        <div className="mt-6 rounded-2xl border border-white/20 bg-white/15 p-8 text-center shadow-xl backdrop-blur-xl sm:mt-8 sm:p-10">

                            <h2 className="text-xl font-semibold text-white">
                                No reviews yet
                            </h2>

                            <p className="mt-2 text-sm text-white/70 sm:text-base">
                                This provider has not received any reviews yet.
                            </p>

                        </div>
                    )}

                    {/* Reviews */}
                    {!loading && reviews.length > 0 && (
                        <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">

                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-2xl border border-white/20 bg-white/15 p-5 shadow-lg backdrop-blur-xl transition hover:bg-white/20 sm:p-6"
                                >

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="min-w-0">
                                            <h2 className="truncate font-semibold text-white">
                                                {review.customer}
                                            </h2>

                                            <p className="mt-1 text-xs text-white/60 sm:text-sm">
                                                {new Date(
                                                    review.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-lg border border-blue-300/20 bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-100">
                                            {review.rating}/5
                                        </span>

                                    </div>

                                    <div className="mt-4 border-t border-white/10 pt-4">
                                        <p className="text-sm leading-6 text-white/80 sm:text-base">
                                            {review.comment}
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

export default ProviderReviews;
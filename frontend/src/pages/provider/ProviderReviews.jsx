import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

import {
    getProviderReviews,
    getProviderRating,
} from "../../services/reviewService";

function StarRating({ rating, size = 18 }) {
    const numericRating = Math.max(
        0,
        Math.min(5, Number(rating) || 0)
    );

    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${numericRating} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    strokeWidth={1.8}
                    className={
                        star <= numericRating
                            ? "fill-[#C66A4A] text-[#C66A4A]"
                            : "fill-white/10 text-white/40"
                    }
                />
            ))}
        </div>
    );
}

function ProviderReviews() {
    const { providerId } = useParams();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadReviews = async () => {
            if (!providerId || !Number.isInteger(Number(providerId))) {
                setError("A valid provider ID is required.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const [reviewsData, ratingData] = await Promise.all([
                    getProviderReviews(providerId),
                    getProviderRating(providerId),
                ]);

                if (!isMounted) return;

                setReviews(
                    Array.isArray(reviewsData) ? reviewsData : []
                );
                setRating(ratingData);
            } catch (err) {
                console.error("Failed to load provider reviews:", err);

                if (!isMounted) return;

                setReviews([]);
                setRating(null);
                setError(
                    err.message || "Failed to load provider reviews."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadReviews();

        return () => {
            isMounted = false;
        };
    }, [providerId]);

    const averageRating = Number(rating?.average_rating ?? 0);
    const totalReviews = Number(
        rating?.total_reviews ?? reviews.length
    );

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: "url('/images/bg.png')",
            }}
        >
            <div className="absolute inset-0 bg-slate-950/30" />

            <div className="relative z-10 min-h-screen">
                <nav className="border-b border-white/20 bg-slate-950/35 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-xl font-bold text-white transition hover:text-[#C66A4A] sm:text-2xl"
                        >
                            FixIt
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
                        >
                            Back
                        </button>
                    </div>
                </nav>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                    <div className="mb-7 sm:mb-9">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F2B9A3]">
                            Customer feedback
                        </p>

                        <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">
                            Provider Reviews
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                            See what customers have said about their
                            experience with this provider.
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 rounded-xl border border-red-300/30 bg-red-500/15 p-4 text-sm text-white shadow-lg backdrop-blur-xl"
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <section className="mb-7 flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl sm:mb-9 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <p className="text-sm font-medium text-white/70">
                                    Overall rating
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                    <span className="text-4xl font-bold text-white sm:text-5xl">
                                        {averageRating.toFixed(1)}
                                    </span>

                                    <div>
                                        <StarRating
                                            rating={averageRating}
                                            size={20}
                                        />

                                        <p className="mt-1 text-xs text-white/65">
                                            Out of 5 stars
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-4 sm:min-w-36">
                                <p className="text-2xl font-bold text-white">
                                    {totalReviews}
                                </p>

                                <p className="mt-1 text-sm text-white/65">
                                    {totalReviews === 1
                                        ? "Customer review"
                                        : "Customer reviews"}
                                </p>
                            </div>
                        </section>
                    )}

                    {loading && (
                        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl">
                            <p className="text-sm text-white/80">
                                Loading reviews...
                            </p>
                        </div>
                    )}

                    {!loading && !error && reviews.length === 0 && (
                        <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-12 text-center shadow-xl backdrop-blur-xl sm:py-16">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#C66A4A]/30 bg-[#C66A4A]/15">
                                <Star
                                    size={26}
                                    className="text-[#F2B9A3]"
                                />
                            </div>

                            <h2 className="mt-4 text-xl font-semibold text-white">
                                No reviews yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/70">
                                Customer reviews will appear here after
                                they share feedback about a completed
                                service.
                            </p>
                        </div>
                    )}

                    {!loading && !error && reviews.length > 0 && (
                        <section>
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h2 className="text-lg font-semibold text-white sm:text-xl">
                                    Customer experiences
                                </h2>

                                <span className="text-xs text-white/65 sm:text-sm">
                                    {reviews.length}{" "}
                                    {reviews.length === 1
                                        ? "review"
                                        : "reviews"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {reviews.map((review) => (
                                    <article
                                        key={review.id}
                                        className="flex min-w-0 flex-col rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#C66A4A]/50 hover:bg-white/15 hover:shadow-xl"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C66A4A]/30 bg-[#C66A4A]/20 text-sm font-bold text-white">
                                                    {(
                                                        review.customer ||
                                                        "C"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold text-white">
                                                        {review.customer ||
                                                            "Customer"}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-white/55">
                                                        {review.created_at
                                                            ? new Date(
                                                                  review.created_at
                                                              ).toLocaleDateString()
                                                            : "Date unavailable"}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="shrink-0 rounded-lg border border-[#C66A4A]/30 bg-[#C66A4A]/15 px-2 py-1 text-xs font-semibold text-white">
                                                {Number(
                                                    review.rating
                                                ) || 0}
                                                /5
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <StarRating
                                                rating={review.rating}
                                                size={17}
                                            />
                                        </div>

                                        <div className="my-4 border-t border-white/15" />

                                        <p className="flex-1 break-words text-sm leading-6 text-white/80">
                                            {review.comment?.trim()
                                                ? review.comment
                                                : "No written comment provided."}
                                        </p>

                                        <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-3">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#C66A4A]" />

                                            <span className="text-xs text-white/60">
                                                Verified customer feedback
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ProviderReviews;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ArrowRight, MessageSquare } from "lucide-react";

import {
    getMyReviews,
    getPendingReviews,
} from "../../services/reviewService";

function StarRating({ rating }) {
    const value = Number(rating) || 0;

    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${value} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={17}
                    className={
                        star <= value
                            ? "fill-[#C66A4A] text-[#C66A4A]"
                            : "text-[#D9B99B]"
                    }
                />
            ))}
        </div>
    );
}

function formatDate(date) {
    if (!date) {
        return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function GlassCard({ children, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-white/60 bg-white/75 shadow-lg shadow-[#172A46]/10 backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}

function SectionHeading({ title, description, count }) {
    return (
        <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#172A46] sm:text-xl">
                    {title}
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#536070]">
                    {description}
                </p>
            </div>

            <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full border border-[#C66A4A]/20 bg-[#C66A4A]/10 px-2 text-sm font-semibold text-[#172A46]">
                {count}
            </span>
        </div>
    );
}

function EmptyState({ icon: Icon, title, description }) {
    return (
        <GlassCard className="p-7 text-center sm:p-9">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C66A4A]/20 bg-[#C66A4A]/10">
                <Icon size={22} className="text-[#C66A4A]" />
            </div>

            <h3 className="mt-4 font-semibold text-[#172A46]">
                {title}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#536070]">
                {description}
            </p>
        </GlassCard>
    );
}

export default function Reviews() {
    const navigate = useNavigate();

    const [pendingReviews, setPendingReviews] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadReviews() {
            try {
                setLoading(true);
                setError("");

                const [pending, reviews] = await Promise.all([
                    getPendingReviews(),
                    getMyReviews(),
                ]);

                setPendingReviews(
                    Array.isArray(pending)
                        ? pending
                        : pending?.results || []
                );

                setMyReviews(
                    Array.isArray(reviews)
                        ? reviews
                        : reviews?.results || []
                );
            } catch (err) {
                setError(
                    err.message || "Failed to load your reviews."
                );
            } finally {
                setLoading(false);
            }
        }

        loadReviews();
    }, []);

    function handleLeaveReview(serviceRequest) {
        if (!serviceRequest.provider_id) {
            return;
        }

        navigate(
            `/providers/${serviceRequest.provider_id}/reviews/create?request=${serviceRequest.id}`
        );
    }

    return (
        <div className="relative min-h-full min-w-0">
            <main
                className="relative mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                }}
            >
                {/* Page heading */}
                <GlassCard className="mb-8 p-5 sm:p-7">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C66A4A]/15">
                            <MessageSquare
                                size={24}
                                className="text-[#C66A4A]"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C66A4A]">
                                Your feedback
                            </p>

                            <h1 className="mt-1 text-2xl font-semibold text-[#172A46] sm:text-3xl">
                                Reviews
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#536070] sm:text-base">
                                Share your experience with FixIt service
                                providers and keep track of the feedback
                                you have already submitted.
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {loading ? (
                    <GlassCard className="p-10 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#C66A4A]/25 border-t-[#C66A4A]" />

                        <p className="mt-4 text-sm text-[#536070]">
                            Loading your reviews...
                        </p>
                    </GlassCard>
                ) : error ? (
                    <GlassCard className="p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-[#172A46]">
                            Unable to load reviews
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-lg bg-[#C66A4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#172A46]"
                        >
                            Try Again
                        </button>
                    </GlassCard>
                ) : (
                    <>
                        {/* Pending reviews */}
                        <section className="mb-10">
                            <SectionHeading
                                title="Awaiting Your Review"
                                description="Completed services waiting for your feedback."
                                count={pendingReviews.length}
                            />

                            {pendingReviews.length === 0 ? (
                                <EmptyState
                                    icon={MessageSquare}
                                    title="No reviews waiting"
                                    description="When a service is completed, it can appear here for you to review."
                                />
                            ) : (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {pendingReviews.map(
                                        (serviceRequest) => (
                                            <GlassCard
                                                key={serviceRequest.id}
                                                className="flex h-full min-w-0 flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-white/90 hover:shadow-xl"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C66A4A]/10">
                                                        <MessageSquare
                                                            size={21}
                                                            className="text-[#C66A4A]"
                                                        />
                                                    </div>

                                                    <span className="rounded-full border border-[#C66A4A]/20 bg-[#C66A4A]/10 px-3 py-1 text-xs font-medium text-[#8E452F]">
                                                        Awaiting review
                                                    </span>
                                                </div>

                                                <h3 className="mt-4 break-words text-lg font-semibold text-[#172A46]">
                                                    {serviceRequest.service_title ||
                                                        "Service"}
                                                </h3>

                                                <p className="mt-1 text-sm text-[#536070]">
                                                    Provided by{" "}
                                                    <span className="font-semibold text-[#172A46]">
                                                        {serviceRequest.provider_username ||
                                                            "Provider"}
                                                    </span>
                                                </p>

                                                <div className="mt-4 border-t border-[#172A46]/10 pt-4">
                                                    <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                                                        Preferred service date
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-[#172A46]">
                                                        {formatDate(
                                                            serviceRequest.preferred_date
                                                        )}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleLeaveReview(
                                                            serviceRequest
                                                        )
                                                    }
                                                    disabled={
                                                        !serviceRequest.provider_id
                                                    }
                                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C66A4A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#172A46] disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Leave Review
                                                    <ArrowRight size={17} />
                                                </button>
                                            </GlassCard>
                                        )
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Submitted reviews */}
                        <section>
                            <SectionHeading
                                title="Your Reviews"
                                description="Your submitted feedback and ratings for FixIt service providers."
                                count={myReviews.length}
                            />

                            {myReviews.length === 0 ? (
                                <EmptyState
                                    icon={Star}
                                    title="You have not written any reviews yet"
                                    description="After a service is completed, you can share your experience and help other customers make informed decisions."
                                />
                            ) : (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {myReviews.map((review) => (
                                        <GlassCard
                                            key={review.id}
                                            className="flex h-full min-w-0 flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-white/90 hover:shadow-xl"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#172A46]/10 text-lg font-semibold text-[#172A46]">
                                                    {(review.provider || "P")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <span className="rounded-full border border-[#172A46]/10 bg-white/60 px-3 py-1 text-xs text-[#536070]">
                                                    Submitted
                                                </span>
                                            </div>

                                            <h3 className="mt-4 break-words text-lg font-semibold text-[#172A46]">
                                                {review.provider ||
                                                    "Service Provider"}
                                            </h3>

                                            <p className="mt-1 text-xs text-[#6B7280]">
                                                Reviewed on{" "}
                                                {formatDate(
                                                    review.created_at
                                                )}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                                <StarRating
                                                    rating={review.rating}
                                                />

                                                <span className="text-sm font-semibold text-[#172A46]">
                                                    {Number(
                                                        review.rating
                                                    ) || 0}
                                                    /5
                                                </span>
                                            </div>

                                            <div className="mt-4 flex-1 rounded-xl border border-white/60 bg-white/55 p-4">
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8E452F]">
                                                    Your feedback
                                                </p>

                                                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#536070]">
                                                    {review.comment?.trim() ||
                                                        "No written comment was provided with this rating."}
                                                </p>
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}

                <div className="mt-8">
                    <Link
                        to="/service-requests"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/75 px-4 py-3 text-sm font-semibold text-[#172A46] shadow-sm backdrop-blur-xl transition hover:bg-white"
                    >
                        <ArrowRight
                            size={16}
                            className="rotate-180"
                        />
                        View My Service Requests
                    </Link>
                </div>
            </main>
        </div>
    );
}

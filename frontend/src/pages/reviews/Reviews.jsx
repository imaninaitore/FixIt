import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ArrowRight, MessageSquare } from "lucide-react";

import {
    getMyReviews,
    getPendingReviews,
} from "../../services/reviewService";


function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={18}
                    className={
                        star <= rating
                            ? "text-[#C66A4A] fill-[#C66A4A]"
                            : "text-[#D9B99B]"
                    }
                />
            ))}
        </div>
    );
}


function formatDate(date) {
    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
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

                setPendingReviews(pending);
                setMyReviews(reviews);
            } catch (err) {
                setError(
                    err.message ||
                    "Failed to load your reviews."
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


    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4EDE5] p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] p-8 text-center shadow-sm">
                        <p className="text-[#536070]">
                            Loading your reviews...
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-[#F4EDE5] p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] p-8">
                        <h1 className="text-2xl font-semibold text-[#172A46]">
                            Reviews
                        </h1>

                        <p className="mt-3 text-[#C66A4A]">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-lg bg-[#C66A4A] px-5 py-2.5 font-medium text-white transition hover:bg-[#172A46]"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#F4EDE5] p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[#172A46] sm:text-3xl">
                        Reviews
                    </h1>

                    <p className="mt-2 text-sm text-[#536070] sm:text-base">
                        Share your experience and keep track of the reviews
                        you have written.
                    </p>
                </div>


                {/* Pending Reviews */}

                <section className="mb-10">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-[#172A46]">
                                Awaiting Your Review
                            </h2>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                Completed services that you have not reviewed yet.
                            </p>
                        </div>

                        <span className="rounded-full bg-[#D9B99B]/40 px-3 py-1 text-sm font-medium text-[#172A46]">
                            {pendingReviews.length}
                        </span>
                    </div>


                    {pendingReviews.length === 0 ? (
                        <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4EDE5]">
                                    <MessageSquare
                                        size={21}
                                        className="text-[#C66A4A]"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-[#172A46]">
                                        No reviews waiting
                                    </h3>

                                    <p className="mt-1 text-sm text-[#6B7280]">
                                        You have reviewed all your completed
                                        services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingReviews.map((serviceRequest) => (
                                <div
                                    key={serviceRequest.id}
                                    className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] p-5 shadow-sm"
                                >
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-[#172A46]">
                                                {serviceRequest.service_title}
                                            </h3>

                                            <p className="mt-1 text-sm text-[#536070]">
                                                Provider:{" "}
                                                <span className="font-medium text-[#172A46]">
                                                    {serviceRequest.provider_username ||
                                                        "Provider"}
                                                </span>
                                            </p>

                                            <p className="mt-1 text-xs text-[#6B7280]">
                                                Service date:{" "}
                                                {formatDate(
                                                    serviceRequest.preferred_date
                                                )}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleLeaveReview(
                                                    serviceRequest
                                                )
                                            }
                                            disabled={
                                                !serviceRequest.provider_id
                                            }
                                            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#C66A4A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#172A46] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Leave Review
                                            <ArrowRight size={17} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>


                {/* Existing Reviews */}

                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-[#172A46]">
                            Your Reviews
                        </h2>

                        <p className="mt-1 text-sm text-[#6B7280]">
                            Reviews you have submitted for completed services.
                        </p>
                    </div>


                    {myReviews.length === 0 ? (
                        <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] p-8 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4EDE5]">
                                <Star
                                    size={22}
                                    className="text-[#C66A4A]"
                                />
                            </div>

                            <h3 className="mt-4 font-semibold text-[#172A46]">
                                You have not written any reviews yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
                                Once you complete a service, you can share
                                your experience with the provider.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {myReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] p-5 shadow-sm"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="font-semibold text-[#172A46]">
                                                    {review.provider}
                                                </h3>

                                                <p className="mt-1 text-xs text-[#6B7280]">
                                                    Reviewed on{" "}
                                                    {formatDate(
                                                        review.created_at
                                                    )}
                                                </p>
                                            </div>

                                            <StarRating
                                                rating={review.rating}
                                            />
                                        </div>

                                        {review.comment && (
                                            <p className="rounded-xl bg-[#F4EDE5] p-4 text-sm leading-6 text-[#536070]">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>


                <div className="mt-8">
                    <Link
                        to="/service-requests"
                        className="text-sm font-medium text-[#C66A4A] transition hover:text-[#172A46]"
                    >
                        View My Service Requests
                    </Link>
                </div>

            </div>
        </div>
    );
}

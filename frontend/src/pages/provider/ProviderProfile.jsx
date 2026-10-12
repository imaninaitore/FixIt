import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Briefcase,
    CheckCircle,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
    Star,
} from "lucide-react";

import { getProvider } from "../../services/providerService";
import { createConversation } from "../../services/messagingService";
import {
    getProviderReviews,
    getProviderRating,
} from "../../services/reviewService";

function StarRating({ rating, size = 17 }) {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));

    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${value} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    strokeWidth={1.8}
                    className={
                        star <= value
                            ? "fill-[#C66A4A] text-[#C66A4A]"
                            : "fill-white/10 text-white/40"
                    }
                />
            ))}
        </div>
    );
}

function ProviderProfile() {
    const { providerId } = useParams();
    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(null);

    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewsError, setReviewsError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadProvider() {
            try {
                setLoading(true);
                setError("");

                const data = await getProvider(providerId);

                if (isMounted) {
                    setProvider(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.message || "Failed to load provider profile."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadProvider();

        return () => {
            isMounted = false;
        };
    }, [providerId]);

    useEffect(() => {
        let isMounted = true;

        async function loadReviews() {
            if (!provider?.user) {
                setReviews([]);
                setRating(null);
                setReviewsLoading(false);
                return;
            }

            // The review API expects the Django User ID,
            // not the ProviderProfile ID.
            const providerUserId =
                typeof provider.user === "object"
                    ? provider.user?.id
                    : provider.user;

            if (!providerUserId) {
                setReviews([]);
                setRating(null);
                setReviewsError("Unable to identify this provider's reviews.");
                setReviewsLoading(false);
                return;
            }

            try {
                setReviewsLoading(true);
                setReviewsError("");

                const [reviewsData, ratingData] = await Promise.all([
                    getProviderReviews(providerUserId),
                    getProviderRating(providerUserId),
                ]);

                if (!isMounted) return;

                setReviews(
                    Array.isArray(reviewsData) ? reviewsData : []
                );
                setRating(ratingData);
            } catch (err) {
                console.error("Failed to load provider reviews:", err);

                if (isMounted) {
                    setReviews([]);
                    setRating(null);
                    setReviewsError(
                        err.message || "Failed to load customer reviews."
                    );
                }
            } finally {
                if (isMounted) {
                    setReviewsLoading(false);
                }
            }
        }

        if (provider) {
            loadReviews();
        }

        return () => {
            isMounted = false;
        };
    }, [provider]);

    async function handleMessageProvider() {
        try {
            const data = await createConversation(provider.user);
            const conversation = data.conversation || data;

            navigate(`/messages/${conversation.id}`);
        } catch (err) {
            console.error(err);

            const message = err.message?.toLowerCase() || "";

            if (
                message.includes("authentication") ||
                message.includes("credentials") ||
                message.includes("token") ||
                message.includes("unauthorized")
            ) {
                navigate("/login");
                return;
            }

            alert(err.message || "Failed to start conversation.");
        }
    }

    if (loading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-6"
                style={{
                    backgroundImage: "url('/images/tools.jpg')",
                }}
            >
                <div className="rounded-xl border border-white/40 bg-[#FFFDF9]/75 px-5 py-4 shadow-lg backdrop-blur-lg">
                    <p className="text-sm font-medium text-[#172A46]">
                        Loading provider profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: "url('/images/tools.jpg')",
                }}
            >
                <div className="mx-auto max-w-5xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-5 flex items-center gap-2 rounded-lg border border-white/40 bg-[#FFFDF9]/75 px-3.5 py-2 text-sm font-medium text-[#172A46] shadow-sm backdrop-blur-lg transition hover:bg-[#FFFDF9] hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <div className="rounded-xl border border-red-200/70 bg-[#FFFDF9]/85 p-4 text-sm text-red-700 shadow-lg backdrop-blur-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!provider) {
        return null;
    }

    const profileImage = provider.profile_image || null;
    const averageRating = Number(rating?.average_rating ?? 0);
    const totalReviews = Number(
        rating?.total_reviews ?? reviews.length
    );

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/tools.jpg')",
            }}
        >
            <div className="min-h-screen bg-[#172A46]/60">
            
                <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center gap-2 rounded-lg border border-white/50 bg-[#FFFDF9]/75 px-3.5 py-2 text-sm font-medium text-[#172A46] shadow-sm backdrop-blur-lg transition hover:bg-[#FFFDF9] hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    {/* Provider details and actions */}
                    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
                        <section className="overflow-hidden rounded-xl border border-white/50 bg-[#FFFDF9]/70 shadow-xl backdrop-blur-lg">
                            <div className="border-b border-white/15 bg-[#172A46]/90 px-4 py-5 sm:px-5 sm:py-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={provider.business_name || "Provider"}
                                            className="h-20 w-20 shrink-0 rounded-full object-cover shadow-md ring-2 ring-[#C66A4A]/70"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#C66A4A] text-2xl font-semibold text-[#FFFDF9] shadow-md ring-2 ring-white/30">
                                            {(provider.business_name || "P")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="break-words text-xl font-semibold text-[#FFFDF9] sm:text-2xl">
                                                {provider.business_name || "Provider"}
                                            </h1>

                                            {provider.is_verified && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-[#C66A4A]/50 bg-[#C66A4A]/20 px-2 py-1 text-xs font-medium text-[#F2D8CC]">
                                                    <ShieldCheck size={14} />
                                                    Verified
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 flex items-start gap-2 text-sm text-[#F4EDE5]">
                                            <Briefcase
                                                size={15}
                                                className="mt-0.5 shrink-0 text-[#E5A48B]"
                                            />
                                            <span>
                                                {provider.service_category || "Service Provider"}
                                            </span>
                                        </p>

                                        {provider.location && (
                                            <p className="mt-1 flex items-start gap-2 text-sm text-[#F4EDE5]">
                                                <MapPin
                                                    size={15}
                                                    className="mt-0.5 shrink-0 text-[#E5A48B]"
                                                />
                                                <span className="break-words">
                                                    {provider.location}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-4 sm:p-5">
                                <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-4 shadow-sm backdrop-blur-sm">
                                    <h2 className="text-base font-semibold text-[#172A46]">
                                        About this provider
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-[#43516A]">
                                        {provider.description ||
                                            "This provider has not added a description yet."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <Briefcase size={16} className="shrink-0 text-[#C66A4A]" />
                                            Experience
                                        </div>
                                        <p className="mt-1.5 text-sm text-[#43516A]">
                                            {provider.years_of_experience ?? 0} years
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <MapPin size={16} className="shrink-0 text-[#C66A4A]" />
                                            Location
                                        </div>
                                        <p className="mt-1.5 break-words text-sm text-[#43516A]">
                                            {provider.location || "Not provided"}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <Phone size={16} className="shrink-0 text-[#C66A4A]" />
                                            Phone
                                        </div>
                                        <p className="mt-1.5 break-words text-sm text-[#43516A]">
                                            {provider.phone_number || "Not provided"}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <CheckCircle
                                                size={16}
                                                className={
                                                    provider.is_available
                                                        ? "shrink-0 text-[#54816C]"
                                                        : "shrink-0 text-slate-500"
                                                }
                                            />
                                            Availability
                                        </div>
                                        <p className="mt-1.5 text-sm text-[#43516A]">
                                            {provider.is_available
                                                ? "Available"
                                                : "Currently unavailable"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <aside className="min-w-0 lg:sticky lg:top-5">
                            <div className="rounded-xl border border-white/50 bg-[#FFFDF9]/75 p-4 shadow-xl backdrop-blur-lg sm:p-5">
                                <h2 className="text-base font-semibold text-[#172A46]">
                                    Need this service?
                                </h2>

                                <p className="mt-2 text-sm leading-5 text-[#43516A]">
                                    Contact this provider or send them a service request.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/service-requests/create?provider=${provider.id}`
                                        )
                                    }
                                    className="mt-4 w-full rounded-lg bg-[#C66A4A] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#AD563A] focus:outline-none focus:ring-2 focus:ring-[#C66A4A]/50 focus:ring-offset-2"
                                >
                                    Send Service Request
                                </button>

                                <button
                                    onClick={handleMessageProvider}
                                    className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#172A46]/20 bg-[#F4EDE5]/80 px-3.5 py-2.5 text-sm font-semibold text-[#172A46] transition hover:border-[#C66A4A]/50 hover:bg-[#F2D8CC]/70 hover:text-[#8E432E] focus:outline-none focus:ring-2 focus:ring-[#C66A4A]/40"
                                >
                                    <MessageCircle size={17} />
                                    Message Provider
                                </button>
                            </div>
                        </aside>
                    </div>

                    {/* Customer reviews below provider details */}
                    <section className="mt-7 sm:mt-9">
                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8E432E]">
                                    Customer feedback
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-[#C66A4A] sm:text-2xl">
                                    Reviews and ratings
                                </h2>

                                <p className="mt-1 text-sm text-white">
                                    Feedback from customers who have used this provider.
                                </p>
                            </div>

                            {!reviewsLoading && !reviewsError && (
                                <div className="flex items-center gap-3 self-start rounded-xl border border-white/60 bg-[#FFFDF9]/75 px-4 py-3 shadow-md backdrop-blur-lg sm:self-auto">
                                    <div>
                                        <p className="text-2xl font-bold text-[#172A46]">
                                            {averageRating.toFixed(1)}
                                        </p>
                                        <StarRating rating={averageRating} size={15} />
                                    </div>

                                    <div className="border-l border-[#172A46]/15 pl-3">
                                        <p className="text-sm font-semibold text-[#172A46]">
                                            {totalReviews}
                                        </p>
                                        <p className="text-xs text-[#43516A]">
                                            {totalReviews === 1 ? "Review" : "Reviews"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {reviewsLoading && (
                            <div className="rounded-xl border border-white/50 bg-[#FFFDF9]/65 p-8 text-center shadow-lg backdrop-blur-lg">
                                <p className="text-sm text-[#43516A]">
                                    Loading customer reviews...
                                </p>
                            </div>
                        )}

                        {!reviewsLoading && reviewsError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200/70 bg-[#FFFDF9]/85 p-4 text-sm text-red-700 shadow-lg backdrop-blur-lg"
                            >
                                {reviewsError}
                            </div>
                        )}

                        {!reviewsLoading &&
                            !reviewsError &&
                            reviews.length === 0 && (
                                <div className="rounded-xl border border-white/50 bg-[#FFFDF9]/65 px-5 py-10 text-center shadow-lg backdrop-blur-lg sm:py-12">
                                    <Star
                                        size={28}
                                        className="mx-auto text-[#C66A4A]"
                                    />
                                    <h3 className="mt-3 text-lg font-semibold text-[#172A46]">
                                        No reviews yet
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#43516A]">
                                        This provider has not received any customer reviews yet.
                                    </p>
                                </div>
                            )}

                        {!reviewsLoading &&
                            !reviewsError &&
                            reviews.length > 0 && (
                                <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {reviews.map((review) => (
                                        <article
                                            key={review.id}
                                            className="flex min-w-0 flex-col rounded-xl border border-white/50 bg-[#FFFDF9]/65 p-4 shadow-lg backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-[#C66A4A]/50 hover:bg-[#FFFDF9]/80 hover:shadow-xl sm:p-5"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#172A46] text-sm font-semibold text-white">
                                                        {(review.customer || "C")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-sm font-semibold text-[#172A46]">
                                                            {review.customer || "Customer"}
                                                        </h3>

                                                        <p className="mt-1 text-xs text-[#68748A]">
                                                            {review.created_at
                                                                ? new Date(
                                                                      review.created_at
                                                                  ).toLocaleDateString()
                                                                : "Date unavailable"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="shrink-0 rounded-md bg-[#F2D8CC] px-2 py-1 text-xs font-semibold text-[#8E432E]">
                                                    {Number(review.rating) || 0}/5
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <StarRating rating={review.rating} />
                                            </div>

                                            <div className="my-3 border-t border-[#172A46]/10" />

                                            <p className="flex-1 break-words text-sm leading-6 text-[#43516A]">
                                                {review.comment?.trim()
                                                    ? review.comment
                                                    : "No written comment provided."}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default ProviderProfile;

import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

import { createReview } from "../../services/reviewService";


export default function CreateReview() {
    const { providerId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const serviceRequestId = queryParams.get("request");

    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!serviceRequestId) {
            setError(
                "This review is missing the service request."
            );
            return;
        }

        if (!rating) {
            setError(
                "Please select a star rating."
            );
            return;
        }

        try {
            setLoading(true);

            await createReview(
                providerId,
                {
                    service_request_id: Number(serviceRequestId),
                    rating,
                    comment: comment.trim(),
                }
            );

            setSuccess(
                "Your review has been submitted successfully."
            );

            setTimeout(() => {
                navigate("/reviews");
            }, 800);

        } catch (err) {
            setError(
                err.message ||
                "Failed to submit your review."
            );
        } finally {
            setLoading(false);
        }
    }


    const displayedRating = hoveredRating || rating;


    return (
        <div className="min-h-screen bg-[#F4EDE5] p-4 sm:p-6">
            <div className="mx-auto max-w-2xl">

                <Link
                    to="/reviews"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#536070] transition hover:text-[#C66A4A]"
                >
                    <ArrowLeft size={17} />
                    Back to Reviews
                </Link>


                <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] p-6 shadow-sm sm:p-8">

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-[#172A46] sm:text-3xl">
                            Leave a Review
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                            Tell us about your experience with this service
                            provider.
                        </p>
                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-7"
                    >

                        {/* Rating */}

                        <div>
                            <label className="block text-sm font-semibold text-[#172A46]">
                                Your Rating
                            </label>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                Select between 1 and 5 stars.
                            </p>

                            <div className="mt-4 flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        aria-label={`Rate ${star} out of 5`}
                                        onMouseEnter={() =>
                                            setHoveredRating(star)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredRating(0)
                                        }
                                        onClick={() =>
                                            setRating(star)
                                        }
                                        className="rounded-md p-1 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C66A4A]/40"
                                    >
                                        <Star
                                            size={32}
                                            className={
                                                star <= displayedRating
                                                    ? "text-[#C66A4A] fill-[#C66A4A]"
                                                    : "text-[#D9B99B]"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>

                            {rating > 0 && (
                                <p className="mt-2 text-sm font-medium text-[#536070]">
                                    {rating} out of 5
                                </p>
                            )}
                        </div>


                        {/* Comment */}

                        <div>
                            <label
                                htmlFor="comment"
                                className="block text-sm font-semibold text-[#172A46]"
                            >
                                Comment
                            </label>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                Share anything that would help other customers.
                            </p>

                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(event) =>
                                    setComment(event.target.value)
                                }
                                rows={6}
                                placeholder="How was your experience?"
                                className="mt-4 w-full resize-none rounded-xl border border-[#D9B99B] bg-[#FFFDF9] px-4 py-3 text-sm text-[#172A46] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#C66A4A] focus:ring-2 focus:ring-[#C66A4A]/20"
                            />
                        </div>


                        {/* Messages */}

                        {error && (
                            <div className="rounded-xl border border-[#C66A4A]/30 bg-[#C66A4A]/10 px-4 py-3 text-sm text-[#9B4930]">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded-xl border border-[#D9B99B] bg-[#D9B99B]/20 px-4 py-3 text-sm font-medium text-[#172A46]">
                                {success}
                            </div>
                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#C66A4A] px-5 py-3 font-medium text-white transition hover:bg-[#172A46] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Submitting Review..."
                                : "Submit Review"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

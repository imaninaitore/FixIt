import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createReview } from "../../services/reviewService";

function CreateReview() {
    const navigate = useNavigate();

    // Get providerId from the URL path.
    const { providerId } = useParams();

    // Get the service request ID from the query string.
    const [searchParams] = useSearchParams();
    const serviceRequestId = searchParams.get("request");

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        // A review must be connected to a completed service request.
        if (!serviceRequestId) {
            setError(
                "A completed service request is required to leave a review."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await createReview(providerId, {
                service_request_id: Number(serviceRequestId),
                rating: Number(rating),
                comment: comment,
            });

            setSuccess("Review submitted successfully.");

            setTimeout(() => {
                navigate(`/providers/${providerId}/reviews`);
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to submit review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navigation */}
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">

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

            {/* Page content */}
            <main className="mx-auto max-w-2xl px-6 py-10">

                <h1 className="text-3xl font-bold text-gray-900">
                    Leave a Review
                </h1>

                <p className="mt-2 text-gray-600">
                    Share your experience with this service provider.
                </p>

                {/* Success message */}
                {success && (
                    <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
                        {success}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Review form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow"
                >

                    {/* Rating */}
                    <div>
                        <label
                            htmlFor="rating"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Rating
                        </label>

                        <select
                            id="rating"
                            value={rating}
                            onChange={(event) =>
                                setRating(event.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Very Poor</option>
                        </select>
                    </div>

                    {/* Comment */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Comment
                        </label>

                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(event) =>
                                setComment(event.target.value)
                            }
                            placeholder="Tell us about your experience..."
                            rows="6"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Information */}
                    <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                        This review is connected to your completed service
                        request.
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>

                </form>
            </main>
        </div>
    );
}

export default CreateReview;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    MapPin,
    MessageSquare,
    Star,
    User,
    X,
    XCircle,
} from "lucide-react";

import Footer from "../../components/Footer";

import {
    getServiceRequests,
    completeServiceRequest,
} from "../../services/serviceRequestService";

import {
    getPendingReviews,
    getMyReviews,
} from "../../services/reviewService";

import { createConversation } from "../../services/messagingService";

function ServiceRequests() {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [openingConversation, setOpeningConversation] =
        useState(false);

    const [completingRequestId, setCompletingRequestId] =
        useState(null);

    const [showCompletionConfirmation, setShowCompletionConfirmation] =
        useState(false);

    const [completionError, setCompletionError] = useState("");

    const [pendingReviewIds, setPendingReviewIds] = useState(null);
    const [reviewedRequestIds, setReviewedRequestIds] = useState(null);

    const navigate = useNavigate();
    const requestsPerPage = 5;

    useEffect(() => {
        loadServiceRequests();
    }, []);

    async function loadServiceRequests() {
        try {
            setLoading(true);
            setError("");

            const data = await getServiceRequests();
            setServiceRequests(data);

            loadReviewStatuses();
        } catch (err) {
            console.error(err);
            setError("Failed to load your service requests.");
        } finally {
            setLoading(false);
        }
    }

    async function loadReviewStatuses() {
        const [pendingResult, reviewedResult] =
            await Promise.allSettled([
                getPendingReviews(),
                getMyReviews(),
            ]);

        if (pendingResult.status === "fulfilled") {
            const pendingRequests = pendingResult.value;

            setPendingReviewIds(
                new Set(
                    (Array.isArray(pendingRequests)
                        ? pendingRequests
                        : []
                    ).map((request) => Number(request.id))
                )
            );
        } else {
            console.error(
                "Failed to load pending reviews:",
                pendingResult.reason
            );

            setPendingReviewIds(null);
        }

        if (reviewedResult.status === "fulfilled") {
            const submittedReviews = reviewedResult.value;

            setReviewedRequestIds(
                new Set(
                    (Array.isArray(submittedReviews)
                        ? submittedReviews
                        : []
                    )
                        .map((review) => review.service_request_id)
                        .filter((id) => id != null)
                        .map(Number)
                )
            );
        } else {
            console.error(
                "Failed to load submitted reviews:",
                reviewedResult.reason
            );

            setReviewedRequestIds(null);
        }
    }

    async function handleMessageProvider(providerId) {
        if (!providerId || openingConversation) {
            return;
        }

        try {
            setOpeningConversation(true);
            setError("");

            const conversation =
                await createConversation(providerId);

            navigate(`/messages/${conversation.id}`);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to open the conversation."
            );
        } finally {
            setOpeningConversation(false);
        }
    }

    async function handleCompleteRequest() {
        if (
            !selectedRequest ||
            completingRequestId !== null
        ) {
            return;
        }

        if (
            !["accepted", "in_progress"].includes(
                selectedRequest.status
            )
        ) {
            return;
        }

        try {
            setCompletingRequestId(selectedRequest.id);
            setCompletionError("");

            const result = await completeServiceRequest(
                selectedRequest.id
            );

            const completedRequest = result.request || result;

            if (
                Number(completedRequest.id) !==
                    Number(selectedRequest.id) ||
                completedRequest.status !== "completed"
            ) {
                throw new Error(
                    "The server response did not confirm that the request was completed. Please refresh and check its status."
                );
            }

            setServiceRequests((previousRequests) =>
                previousRequests.map((request) =>
                    Number(request.id) ===
                    Number(completedRequest.id)
                        ? completedRequest
                        : request
                )
            );

            setSelectedRequest(completedRequest);
            setShowCompletionConfirmation(false);

            await loadReviewStatuses();
        } catch (err) {
            console.error(err);

            setCompletionError(
                err.message ||
                    "Unable to mark this request as completed."
            );
        } finally {
            setCompletingRequestId(null);
        }
    }

    function getStatusStyles(status) {
        switch (status) {
            case "pending":
                return {
                    icon: Clock3,
                    container:
                        "bg-[#D9B99B]/30 text-[#8A5A42] border-[#D9B99B]",
                    label: "Pending",
                };

            case "accepted":
                return {
                    icon: CheckCircle2,
                    container:
                        "bg-[#E8DED2] text-[#365B4A] border-[#C9D8CE]",
                    label: "Accepted",
                };

            case "in_progress":
                return {
                    icon: Clock3,
                    container:
                        "bg-[#D9B99B]/25 text-[#7A573F] border-[#D9B99B]",
                    label: "In Progress",
                };

            case "completed":
                return {
                    icon: CheckCircle2,
                    container:
                        "bg-[#E8DED2] text-[#365B4A] border-[#C9D8CE]",
                    label: "Completed",
                };

            case "rejected":
                return {
                    icon: XCircle,
                    container:
                        "bg-[#F4E1DC] text-[#9B4930] border-[#E2B8AB]",
                    label: "Rejected",
                };

            case "cancelled":
                return {
                    icon: XCircle,
                    container:
                        "bg-[#F4EDE5] text-[#6B7280] border-[#D9B99B]",
                    label: "Cancelled",
                };

            default:
                return {
                    icon: Clock3,
                    container:
                        "bg-[#F4EDE5] text-[#536070] border-[#D9B99B]",
                    label: status,
                };
        }
    }

    function formatDate(date) {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function openRequest(request) {
        setCompletionError("");
        setShowCompletionConfirmation(false);
        setSelectedRequest(request);
    }

    function closeRequest() {
        if (completingRequestId !== null) {
            return;
        }

        setShowCompletionConfirmation(false);
        setSelectedRequest(null);
        setCompletionError("");
    }

    function closeCompletionConfirmation() {
        if (completingRequestId !== null) {
            return;
        }

        setShowCompletionConfirmation(false);
        setCompletionError("");
    }

    function handlePageChange(page) {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const totalPages = Math.ceil(
        serviceRequests.length / requestsPerPage
    );

    const startIndex =
        (currentPage - 1) * requestsPerPage;

    const currentRequests = serviceRequests.slice(
        startIndex,
        startIndex + requestsPerPage
    );

    const canCompleteSelectedRequest =
        selectedRequest &&
        ["accepted", "in_progress"].includes(
            selectedRequest.status
        );

    const selectedRequestId = selectedRequest
        ? Number(selectedRequest.id)
        : null;

    const selectedRequestNeedsReview =
        selectedRequest?.status === "completed" &&
        selectedRequest.provider_user_id &&
        pendingReviewIds?.has(selectedRequestId);

    const selectedRequestHasReview =
        selectedRequest?.status === "completed" &&
        reviewedRequestIds?.has(selectedRequestId);

    return (
        <div className="min-h-screen bg-[#F4EDE5]">
            {/* Hero */}
            <section className="relative overflow-hidden bg-[#172A46]">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C66A4A]/20 blur-3xl"></div>

                <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#D9B99B]/10 blur-3xl"></div>

                <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                My Service{" "}
                                <span className="text-[#D9B99B]">
                                    Requests
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-[#E8DED2]/80 sm:text-base">
                                Keep track of your requested services,
                                monitor their progress, and stay connected
                                with your service providers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                {/* Loading */}
                {loading && (
                    <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] shadow-sm">
                        <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#D9B99B] border-t-[#C66A4A]"></div>

                            <p className="mt-4 text-sm text-[#6B7280]">
                                Loading your service requests...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-[#E2B8AB] bg-[#FFFDF9] p-6 shadow-sm sm:p-7">
                        <h2 className="font-semibold text-[#172A46]">
                            Unable to load service requests
                        </h2>

                        <p className="mt-2 text-sm text-[#9B4930]">
                            {error}
                        </p>

                        <button
                            onClick={loadServiceRequests}
                            className="mt-5 rounded-lg bg-[#C66A4A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#172A46]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading &&
                    !error &&
                    serviceRequests.length === 0 && (
                        <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] px-6 py-16 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172A46] text-white">
                                <MessageSquare className="h-6 w-6" />
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-[#172A46] sm:text-2xl">
                                No service requests yet
                            </h2>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B7280]">
                                You haven't submitted a service request.
                                Find a professional and create your first
                                request when you're ready.
                            </p>

                            <button
                                onClick={() => navigate("/providers")}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C66A4A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#172A46]"
                            >
                                Find a Provider
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                {/* Request List */}
                {!loading &&
                    !error &&
                    serviceRequests.length > 0 && (
                        <div>
                            {/* List Header */}
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#172A46]">
                                        Your Requests
                                    </h2>

                                    <p className="mt-1 text-sm text-[#6B7280]">
                                        {serviceRequests.length}{" "}
                                        {serviceRequests.length === 1
                                            ? "request"
                                            : "requests"}{" "}
                                        submitted
                                    </p>
                                </div>

                                {totalPages > 1 && (
                                    <p className="text-xs text-[#6B7280]">
                                        Page {currentPage} of {totalPages}
                                    </p>
                                )}
                            </div>

                            {/* List */}
                            <div className="overflow-hidden rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] shadow-sm">
                                {/* Desktop Header */}
                                <div className="hidden border-b border-[#E8DED2] bg-[#F4EDE5] px-5 py-3 md:grid md:grid-cols-[1.7fr_1.1fr_1fr_1fr_auto] md:items-center md:gap-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#536070]">
                                        Service
                                    </p>

                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#536070]">
                                        Provider
                                    </p>

                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#536070]">
                                        Date
                                    </p>

                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#536070]">
                                        Status
                                    </p>

                                    <span></span>
                                </div>

                                {currentRequests.map((request) => {
                                    const status = getStatusStyles(
                                        request.status
                                    );

                                    const StatusIcon = status.icon;

                                    return (
                                        <article
                                            key={request.id}
                                            className="border-b border-[#E8DED2] last:border-b-0"
                                        >
                                            {/* Desktop Row */}
                                            <div className="hidden px-5 py-4 md:grid md:grid-cols-[1.7fr_1.1fr_1fr_1fr_auto] md:items-center md:gap-4">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleMessageProvider(
                                                                    request.provider_user_id
                                                                )
                                                            }
                                                            disabled={
                                                                !request.provider_user_id ||
                                                                openingConversation
                                                            }
                                                            aria-label={
                                                                request.provider_user_id
                                                                    ? `Message ${request.provider || "provider"}`
                                                                    : "No provider assigned"
                                                            }
                                                            title={
                                                                request.provider_user_id
                                                                    ? "Message provider"
                                                                    : "No provider assigned"
                                                            }
                                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#172A46] text-white transition hover:bg-[#C66A4A] disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <MessageSquare className="h-4 w-4" />
                                                        </button>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-[#172A46]">
                                                                {request.service_title}
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-[#6B7280]">
                                                                Request #{request.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm text-[#536070]">
                                                        {request.provider ||
                                                            "Not assigned"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-[#536070]">
                                                        {formatDate(
                                                            request.preferred_date
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.container}`}
                                                    >
                                                        <StatusIcon className="h-3 w-3" />
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        openRequest(request)
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-3 py-2 text-xs font-semibold text-[#172A46] transition hover:border-[#C66A4A] hover:text-[#C66A4A]"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    View
                                                </button>
                                            </div>

                                            {/* Mobile Row */}
                                            <div className="p-4 md:hidden">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleMessageProvider(
                                                                    request.provider_user_id
                                                                )
                                                            }
                                                            disabled={
                                                                !request.provider_user_id ||
                                                                openingConversation
                                                            }
                                                            aria-label={
                                                                request.provider_user_id
                                                                    ? `Message ${request.provider || "provider"}`
                                                                    : "No provider assigned"
                                                            }
                                                            title={
                                                                request.provider_user_id
                                                                    ? "Message provider"
                                                                    : "No provider assigned"
                                                            }
                                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172A46] text-white transition hover:bg-[#C66A4A] disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <MessageSquare className="h-4 w-4" />
                                                        </button>

                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-sm font-semibold text-[#172A46]">
                                                                {request.service_title}
                                                            </h3>

                                                            <p className="mt-1 text-xs text-[#6B7280]">
                                                                Request #{request.id}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${status.container}`}
                                                    >
                                                        <StatusIcon className="h-3 w-3" />
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <div className="mt-4 grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                                            Provider
                                                        </p>

                                                        <p className="mt-1 truncate text-xs font-medium text-[#536070]">
                                                            {request.provider ||
                                                                "Not assigned"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                                            Preferred Date
                                                        </p>

                                                        <p className="mt-1 text-xs font-medium text-[#536070]">
                                                            {formatDate(
                                                                request.preferred_date
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        openRequest(request)
                                                    }
                                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#D9B99B] px-3 py-2.5 text-xs font-semibold text-[#172A46] transition hover:border-[#C66A4A] hover:text-[#C66A4A]"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    View Request
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-[#6B7280]">
                                        Showing {startIndex + 1}–
                                        {Math.min(
                                            startIndex + requestsPerPage,
                                            serviceRequests.length
                                        )}{" "}
                                        of {serviceRequests.length}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-3 py-2 text-xs font-medium text-[#536070] transition hover:border-[#C66A4A] hover:text-[#C66A4A] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5" />
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from(
                                                { length: totalPages },
                                                (_, index) => index + 1
                                            ).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition ${
                                                        currentPage === page
                                                            ? "bg-[#172A46] text-white"
                                                            : "border border-[#D9B99B] bg-[#FFFDF9] text-[#536070] hover:border-[#C66A4A] hover:text-[#C66A4A]"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-3 py-2 text-xs font-medium text-[#536070] transition hover:border-[#C66A4A] hover:text-[#C66A4A] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
            </main>

            <Footer />

            {/* Request Details Modal */}
            {selectedRequest && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172A46]/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            completingRequestId === null
                        ) {
                            closeRequest();
                        }
                    }}
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E8DED2] bg-[#FFFDF9] px-5 py-4 sm:px-6">
                            <div className="min-w-0 pr-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C66A4A]">
                                    Service Request #{selectedRequest.id}
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-[#172A46]">
                                    {selectedRequest.service_title}
                                </h2>
                            </div>

                            <button
                                onClick={closeRequest}
                                disabled={completingRequestId !== null}
                                aria-label="Close request details"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D9B99B] text-[#536070] transition hover:border-[#C66A4A] hover:text-[#C66A4A] disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="space-y-6 p-5 sm:p-6">
                            {/* Status */}
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F4EDE5] p-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                        Current Status
                                    </p>

                                    <div className="mt-2">
                                        {(() => {
                                            const status =
                                                getStatusStyles(
                                                    selectedRequest.status
                                                );

                                            const StatusIcon = status.icon;

                                            return (
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.container}`}
                                                >
                                                    <StatusIcon className="h-3.5 w-3.5" />
                                                    {status.label}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-semibold text-[#172A46]">
                                    Request Description
                                </h3>

                                <p className="mt-2 rounded-xl border border-[#E8DED2] bg-white p-4 text-sm leading-7 text-[#536070]">
                                    {selectedRequest.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            {/* Details */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-[#C66A4A]" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                            Provider
                                        </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {selectedRequest.provider ||
                                            "Not assigned"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-[#C66A4A]" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                            Location
                                        </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {selectedRequest.location ||
                                            "Not provided"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-[#C66A4A]" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                            Preferred Date
                                        </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {formatDate(
                                            selectedRequest.preferred_date
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <Clock3 className="h-4 w-4 text-[#C66A4A]" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                            Created
                                        </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {formatDate(
                                            selectedRequest.created_at
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Updated */}
                            {selectedRequest.updated_at && (
                                <p className="text-xs text-[#9CA3AF]">
                                    Last updated{" "}
                                    {formatDate(
                                        selectedRequest.updated_at
                                    )}
                                </p>
                            )}

                            {/* Completion Error */}
                            {completionError && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-[#E2B8AB] bg-[#F4E1DC] px-4 py-3 text-sm text-[#9B4930]"
                                >
                                    {completionError}
                                </div>
                            )}

                            {/* Review Status */}
                            {selectedRequest.status === "completed" &&
                                selectedRequestHasReview && (
                                    <div className="flex items-center gap-2 rounded-xl border border-[#C9D8CE] bg-[#E8DED2] px-4 py-3 text-sm font-medium text-[#365B4A]">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        You have already reviewed this service.
                                    </div>
                                )}

                            {selectedRequest.status === "completed" &&
                                pendingReviewIds === null &&
                                reviewedRequestIds === null && (
                                    <p className="text-sm text-[#6B7280]">
                                        Review status could not be loaded.
                                        Please try refreshing the page.
                                    </p>
                                )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-[#E8DED2] bg-[#F4EDE5]/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                            <button
                                onClick={closeRequest}
                                disabled={completingRequestId !== null}
                                className="rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-5 py-2.5 text-sm font-medium text-[#536070] transition hover:border-[#172A46] hover:text-[#172A46] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Close
                            </button>

                            {canCompleteSelectedRequest && (
                                <button
                                    onClick={() => {
                                        setCompletionError("");
                                        setShowCompletionConfirmation(true);
                                    }}
                                    disabled={completingRequestId !== null}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#172A46] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C66A4A] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Mark as Completed
                                </button>
                            )}

                            {selectedRequestNeedsReview && (
                                <button
                                    onClick={() => {
                                        const reviewUrl =
                                            `/providers/${selectedRequest.provider_user_id}/reviews/create?request=${selectedRequest.id}`;

                                        closeRequest();
                                        navigate(reviewUrl);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C66A4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#172A46]"
                                >
                                    <Star className="h-4 w-4" />
                                    Leave Review
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Confirmation Modal */}
            {showCompletionConfirmation && selectedRequest && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#172A46]/55 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            completingRequestId === null
                        ) {
                            closeCompletionConfirmation();
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="completion-confirmation-title"
                        className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] shadow-2xl"
                    >
                        {/* Confirmation Header */}
                        <div className="flex items-center justify-between border-b border-[#E8DED2] px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#C66A4A]">
                                Confirm Completion
                            </p>

                            <button
                                type="button"
                                onClick={closeCompletionConfirmation}
                                disabled={completingRequestId !== null}
                                aria-label="Close confirmation"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#536070] transition hover:bg-[#F4EDE5] hover:text-[#172A46] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Confirmation Content */}
                        <div className="px-5 pb-5 pt-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2D8CC]">
                                <CheckCircle2 className="h-6 w-6 text-[#C66A4A]" />
                            </div>

                            <h3
                                id="completion-confirmation-title"
                                className="mt-4 text-lg font-bold text-[#172A46]"
                            >
                                Mark service as completed?
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#536070]">
                                Have you received the service from{" "}
                                <span className="font-semibold text-[#172A46]">
                                    {selectedRequest.provider ||
                                        "your provider"}
                                </span>
                                ? Confirm only if the work has been completed.
                            </p>

                            <div className="mt-4 rounded-lg border border-[#E8DED2] bg-[#F4EDE5]/70 px-3 py-2.5 text-left">
                                <p className="text-xs text-[#6B7280]">
                                    Service request
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[#172A46]">
                                    {selectedRequest.service_title}
                                </p>

                                <p className="mt-1 text-xs text-[#6B7280]">
                                    Request #{selectedRequest.id}
                                </p>
                            </div>

                            {completionError && (
                                <p
                                    role="alert"
                                    className="mt-4 rounded-lg border border-[#E2B8AB] bg-[#F4E1DC] px-3 py-2 text-left text-xs leading-5 text-[#9B4930]"
                                >
                                    {completionError}
                                </p>
                            )}
                        </div>

                        {/* Confirmation Actions */}
                        <div className="flex gap-3 border-t border-[#E8DED2] bg-[#F4EDE5]/60 px-5 py-4">
                            <button
                                type="button"
                                onClick={closeCompletionConfirmation}
                                disabled={completingRequestId !== null}
                                className="flex-1 rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-3 py-2.5 text-sm font-semibold text-[#172A46] transition hover:border-[#172A46] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleCompleteRequest}
                                disabled={completingRequestId !== null}
                                className="flex-1 rounded-lg bg-[#C66A4A] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#172A46] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {completingRequestId !== null
                                    ? "Processing..."
                                    : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceRequests;
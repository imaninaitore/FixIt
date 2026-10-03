import { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    MessageSquare,
    X,
    XCircle,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
    getProviderServiceRequests,
    updateServiceRequest,
} from "../../services/serviceRequestService";

function ProviderServiceRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    // Selected request for the details panel
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 6;

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        try {
            setLoading(true);
            setError("");

            const data = await getProviderServiceRequests();

            setRequests(data);
            setCurrentPage(1);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load service requests."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(requestId, status) {
        try {
            setUpdatingId(requestId);
            setError("");

            const updatedRequest = await updateServiceRequest(
                requestId,
                { status }
            );

            setRequests((previousRequests) =>
                previousRequests.map((request) =>
                    request.id === requestId
                        ? updatedRequest
                        : request
                )
            );

            // Also update the request currently being viewed
            setSelectedRequest((previousRequest) =>
                previousRequest?.id === requestId
                    ? updatedRequest
                    : previousRequest
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to update request."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function getStatusStyles(status) {
        switch (status) {
            case "pending":
                return {
                    icon: Clock3,
                    container:
                        "bg-amber-50 text-amber-700 border-amber-200",
                    label: "Pending",
                };

            case "accepted":
                return {
                    icon: CheckCircle2,
                    container:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    label: "Accepted",
                };

            case "completed":
                return {
                    icon: CheckCircle2,
                    container:
                        "bg-blue-50 text-blue-700 border-blue-200",
                    label: "Completed",
                };

            case "rejected":
                return {
                    icon: XCircle,
                    container:
                        "bg-red-50 text-red-700 border-red-200",
                    label: "Rejected",
                };

            default:
                return {
                    icon: Clock3,
                    container:
                        "bg-slate-50 text-slate-600 border-slate-200",
                    label: status,
                };
        }
    }

    function formatDate(date) {
        if (!date) {
            return "Not specified";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    // Pagination calculations
    const totalPages = Math.ceil(
        requests.length / requestsPerPage
    );

    const startIndex =
        (currentPage - 1) * requestsPerPage;

    const currentRequests = requests.slice(
        startIndex,
        startIndex + requestsPerPage
    );

    function goToPage(page) {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);

        // Keep the user at the request list
        window.scrollTo({
            top: 350,
            behavior: "smooth",
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100">

            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#071426] via-[#0d2b50] to-[#1769aa]">

                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

                <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">

                    <div className="max-w-2xl">

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                            Provider Portal
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Service{" "}
                            <span className="text-blue-300">
                                Requests
                            </span>
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100/80 sm:text-base sm:leading-7">
                            Review customer requests, view their
                            details, and manage requests assigned
                            to you.
                        </p>

                    </div>

                </div>
            </section>

            <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-white p-5 shadow-sm">

                        <h2 className="font-semibold text-red-800">
                            Unable to complete the request
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            onClick={loadRequests}
                            className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="text-center">

                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                            <p className="mt-4 text-sm text-slate-500">
                                Loading service requests...
                            </p>

                        </div>

                    </div>
                )}

                {/* Empty state */}
                {!loading &&
                    requests.length === 0 &&
                    !error && (
                        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-blue-100/60 px-5 py-16 text-center shadow-sm">

                            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-200/30 blur-3xl" />

                            <div className="relative">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-200">
                                    <MessageSquare className="h-7 w-7" />
                                </div>

                                <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
                                    No service requests yet
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                                    Service requests sent to you by
                                    customers will appear here.
                                </p>

                            </div>

                        </div>
                    )}

                {/* Request list */}
                {!loading &&
                    requests.length > 0 && (
                        <div>

                            {/* List header */}
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Customer Requests
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Showing{" "}
                                        {startIndex + 1}–
                                        {Math.min(
                                            startIndex + requestsPerPage,
                                            requests.length
                                        )}{" "}
                                        of {requests.length} requests
                                    </p>
                                </div>

                            </div>

                            {/* Request list */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                {currentRequests.map(
                                    (request, index) => {

                                        const status =
                                            getStatusStyles(
                                                request.status
                                            );

                                        const StatusIcon =
                                            status.icon;

                                        return (
                                            <button
                                                key={request.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedRequest(
                                                        request
                                                    )
                                                }
                                                className={`group w-full text-left transition hover:bg-blue-50/50 ${
                                                    index !==
                                                    currentRequests.length - 1
                                                        ? "border-b border-slate-100"
                                                        : ""
                                                }`}
                                            >

                                                <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5">

                                                    {/* Icon */}
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-sm transition group-hover:scale-105">

                                                        <MessageSquare className="h-5 w-5" />

                                                    </div>

                                                    {/* Main information */}
                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">

                                                            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                                                {request.service_title}
                                                            </h3>

                                                            <span
                                                                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.container}`}
                                                            >
                                                                <StatusIcon className="h-3 w-3" />

                                                                {
                                                                    status.label
                                                                }
                                                            </span>

                                                        </div>

                                                        <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                                                            {request.description}
                                                        </p>

                                                    </div>

                                                    {/* Request metadata */}
                                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:justify-end">

                                                        <span className="flex items-center gap-1.5">
                                                            <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                                                            {request.customer}
                                                        </span>

                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                                            {request.location}
                                                        </span>

                                                        <span className="flex items-center gap-1.5">
                                                            <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                                                            {formatDate(
                                                                request.preferred_date
                                                            )}
                                                        </span>

                                                    </div>

                                                    {/* View indicator */}
                                                    <div className="hidden shrink-0 text-xs font-semibold text-blue-600 sm:block">
                                                        View →
                                                    </div>

                                                </div>

                                            </button>
                                        );
                                    }
                                )}

                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">

                                    <p className="text-xs text-slate-500">
                                        Page{" "}
                                        <span className="font-semibold text-slate-700">
                                            {currentPage}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-semibold text-slate-700">
                                            {totalPages}
                                        </span>
                                    </p>

                                    <div className="flex items-center gap-1.5">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={
                                                currentPage === 1
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">

                                            {Array.from(
                                                {
                                                    length: totalPages,
                                                },
                                                (_, index) => index + 1
                                            ).map((page) => (
                                                <button
                                                    key={page}
                                                    type="button"
                                                    onClick={() =>
                                                        goToPage(
                                                            page
                                                        )
                                                    }
                                                    className={`h-9 min-w-9 rounded-lg px-2 text-xs font-semibold transition ${
                                                        currentPage ===
                                                        page
                                                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm"
                                                            : "border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToPage(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>
                    )}

            </main>

            {/* Request details modal */}
            {selectedRequest && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setSelectedRequest(null)
                    }
                >

                    <div
                        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/20 bg-white shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* Modal header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#071426] via-[#0d2b50] to-[#1769aa] px-5 py-6 sm:px-7">

                            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedRequest(null)
                                }
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                                aria-label="Close request details"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="relative">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-200 backdrop-blur-sm">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>

                                    <div className="pr-8">

                                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                                            Service Request
                                        </p>

                                        <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                                            {
                                                selectedRequest.service_title
                                            }
                                        </h2>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Modal content */}
                        <div className="p-5 sm:p-7">

                            {/* Status */}
                            {(() => {
                                const status =
                                    getStatusStyles(
                                        selectedRequest.status
                                    );

                                const StatusIcon =
                                    status.icon;

                                return (
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Request Status
                                        </span>

                                        <span
                                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.container}`}
                                        >
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {status.label}
                                        </span>

                                    </div>
                                );
                            })()}

                            {/* Description */}
                            <div className="mt-6">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Request Description
                                </p>

                                <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-4">

                                    <p className="text-sm leading-7 text-slate-700">
                                        {
                                            selectedRequest.description
                                        }
                                    </p>

                                </div>

                            </div>

                            {/* Details grid */}
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">

                                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

                                    <div className="flex items-center gap-2">

                                        <MessageSquare className="h-4 w-4 text-blue-600" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Customer
                                        </p>

                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {
                                            selectedRequest.customer ||
                                            "Not provided"
                                        }
                                    </p>

                                </div>

                                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

                                    <div className="flex items-center gap-2">

                                        <MapPin className="h-4 w-4 text-blue-600" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Location
                                        </p>

                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {
                                            selectedRequest.location ||
                                            "Not provided"
                                        }
                                    </p>

                                </div>

                                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

                                    <div className="flex items-center gap-2">

                                        <CalendarDays className="h-4 w-4 text-blue-600" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Preferred Date
                                        </p>

                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {formatDate(
                                            selectedRequest.preferred_date
                                        )}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

                                    <div className="flex items-center gap-2">

                                        <Clock3 className="h-4 w-4 text-blue-600" />

                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Request ID
                                        </p>

                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        #{selectedRequest.id}
                                    </p>

                                </div>

                            </div>

                            {/* Actions */}
                            {selectedRequest.status ===
                                "pending" && (
                                <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedRequest.id,
                                                "rejected"
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            selectedRequest.id
                                        }
                                        className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {updatingId ===
                                        selectedRequest.id
                                            ? "Updating..."
                                            : "Reject"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedRequest.id,
                                                "accepted"
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            selectedRequest.id
                                        }
                                        className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {updatingId ===
                                        selectedRequest.id
                                            ? "Updating..."
                                            : "Accept Request"}
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>

                </div>
            )}

            <Footer />

        </div>
    );
}

export default ProviderServiceRequests;

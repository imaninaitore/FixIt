
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Eye,
    MapPin,
    User,
    X,
    XCircle,
    ClipboardList,
    BriefcaseBusiness,
    Play,
} from "lucide-react";

import {
    getProviderServiceRequests,
    updateServiceRequest,
    updateProviderServiceRequestStatus,
} from "../../services/serviceRequestService";

function ProviderServiceRequests() {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [updatingRequestId, setUpdatingRequestId] = useState(null);

    const requestsPerPage = 5;

    useEffect(() => {
        loadServiceRequests();
    }, []);

    async function loadServiceRequests() {
        try {
            setLoading(true);
            setError("");

            const data = await getProviderServiceRequests();

            const requests = Array.isArray(data)
                ? data
                : Array.isArray(data?.results)
                  ? data.results
                  : [];

            setServiceRequests(requests);
        } catch (err) {
            console.error(err);
            setError(
                err.message || "Failed to load your service requests."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStatus(request, newStatus) {
        if (updatingRequestId !== null) return;

        try {
            setUpdatingRequestId(request.id);
            setError("");

            let result;

            if (newStatus === "in_progress") {
                // Use the dedicated provider status endpoint to start work.
                result = await updateProviderServiceRequestStatus(
                    request.id,
                    "in_progress"
                );
            } else {
                // Accepting and rejecting pending requests use the existing endpoint.
                result = await updateServiceRequest(
                    request.id,
                    { status: newStatus }
                );
            }

            // The status endpoint returns { message, request }, while
            // the detail endpoint returns the serialized request directly.
            const updatedRequest = result.request || result;

            setServiceRequests((previousRequests) =>
                previousRequests.map((item) =>
                    item.id === request.id
                        ? { ...item, ...updatedRequest }
                        : item
                )
            );

            setSelectedRequest((previousRequest) =>
                previousRequest?.id === request.id
                    ? { ...previousRequest, ...updatedRequest }
                    : previousRequest
            );
        } catch (err) {
            console.error(err);
            setError(
                err.message || "Unable to update this service request."
            );
        } finally {
            setUpdatingRequestId(null);
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
                    label: status
                        ? status.replaceAll("_", " ")
                        : "Unknown",
                };
        }
    }

    function formatDate(date) {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "—";

        return parsedDate.toLocaleDateString("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function openRequest(request) {
        setSelectedRequest(request);
    }

    function closeRequest() {
        setSelectedRequest(null);
    }

    function handleFilterChange(status) {
        setStatusFilter(status);
        setCurrentPage(1);
    }

    function handlePageChange(page) {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const pendingCount = serviceRequests.filter(
        (request) => request.status === "pending"
    ).length;

    const acceptedCount = serviceRequests.filter(
        (request) => request.status === "accepted"
    ).length;

    const completedCount = serviceRequests.filter(
        (request) => request.status === "completed"
    ).length;

    const filteredRequests =
        statusFilter === "all"
            ? serviceRequests
            : serviceRequests.filter(
                  (request) => request.status === statusFilter
              );

    const totalPages = Math.ceil(
        filteredRequests.length / requestsPerPage
    );

    const startIndex = (currentPage - 1) * requestsPerPage;

    const currentRequests = filteredRequests.slice(
        startIndex,
        startIndex + requestsPerPage
    );

    useEffect(() => {
        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        } else if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const statusCards = [
        {
            key: "pending",
            title: "Pending Requests",
            count: pendingCount,
            description: "Awaiting your response",
            icon: Clock3,
            iconStyle: "bg-[#D9B99B]/30 text-[#8A5A42]",
        },
        {
            key: "accepted",
            title: "Accepted Requests",
            count: acceptedCount,
            description: "Work you've accepted",
            icon: CheckCircle2,
            iconStyle: "bg-[#E8DED2] text-[#365B4A]",
        },
        {
            key: "completed",
            title: "Completed Requests",
            count: completedCount,
            description: "Successfully completed",
            icon: ClipboardList,
            iconStyle: "bg-[#E8DED2] text-[#365B4A]",
        },
    ];

    function renderRequestActions(request, location = "list") {
        if (request.status === "pending") {
            return (
                <div
                    className={
                        location === "modal"
                            ? "flex flex-col gap-2 sm:flex-row"
                            : "flex gap-2"
                    }
                >
                    <button
                        type="button"
                        onClick={() =>
                            handleUpdateStatus(request, "rejected")
                        }
                        disabled={updatingRequestId !== null}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E2B8AB] bg-[#FFFDF9] px-3 py-2 text-xs font-semibold text-[#9B4930] transition hover:bg-[#F4E1DC] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleUpdateStatus(request, "accepted")
                        }
                        disabled={updatingRequestId !== null}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#172A46] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#263F61] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Accept Request
                    </button>
                </div>
            );
        }

        if (request.status === "accepted") {
            return (
                <button
                    type="button"
                    onClick={() =>
                        handleUpdateStatus(request, "in_progress")
                    }
                    disabled={updatingRequestId !== null}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#C66A4A] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A95338] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Play className="h-3.5 w-3.5" />
                    {updatingRequestId === request.id
                        ? "Starting..."
                        : "Start Work"}
                </button>
            );
        }

        if (request.status === "in_progress") {
            return (
                <p className="text-xs font-medium text-[#7A573F]">
                    Work in progress — the customer confirms completion.
                </p>
            );
        }

        return null;
    }

    return (
        <div className="min-h-screen bg-[#F4EDE5]">
            <section className="relative overflow-hidden bg-[#172A46]">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C66A4A]/20 blur-3xl" />
                <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#D9B99B]/10 blur-3xl" />

                <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Service{" "}
                                <span className="text-[#D9B99B]">
                                    Requests
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-[#E8DED2]/80 sm:text-base">
                                Manage customer requests, review service
                                details, and keep track of the work you
                                have accepted.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                {loading && (
                    <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] shadow-sm">
                        <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#D9B99B] border-t-[#C66A4A]" />
                            <p className="mt-4 text-sm text-[#6B7280]">
                                Loading your service requests...
                            </p>
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-[#E2B8AB] bg-[#FFFDF9] p-6 shadow-sm sm:p-7">
                        <h2 className="font-semibold text-[#172A46]">
                            Unable to load or update service requests
                        </h2>

                        <p className="mt-2 text-sm text-[#9B4930]">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadServiceRequests}
                            className="mt-5 rounded-lg bg-[#C66A4A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#A95338]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && serviceRequests.length === 0 && (
                    <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172A46] text-white">
                            <ClipboardList className="h-6 w-6" />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#172A46] sm:text-2xl">
                            No service requests yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B7280]">
                            Customer requests assigned to you will appear
                            here. You can review each request and respond
                            when one arrives.
                        </p>
                    </div>
                )}

                {!loading && !error && serviceRequests.length > 0 && (
                    <div className="mb-8 space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[#172A46]">
                                    Request Overview
                                </h2>
                                <p className="mt-1 text-sm text-[#6B7280]">
                                    Select a category to filter your requests.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleFilterChange("all")}
                                aria-pressed={statusFilter === "all"}
                                className={`inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#C66A4A] focus:ring-offset-2 ${
                                    statusFilter === "all"
                                        ? "bg-[#172A46] text-white"
                                        : "border border-[#D9B99B] bg-[#FFFDF9] text-[#536070] hover:border-[#C66A4A] hover:text-[#C66A4A]"
                                }`}
                            >
                                <ClipboardList className="h-4 w-4" />
                                All Requests
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                                        statusFilter === "all"
                                            ? "bg-white/15 text-white"
                                            : "bg-[#F4EDE5] text-[#172A46]"
                                    }`}
                                >
                                    {serviceRequests.length}
                                </span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {statusCards.map((card) => {
                                const CardIcon = card.icon;
                                const isActive = statusFilter === card.key;

                                return (
                                    <button
                                        key={card.key}
                                        type="button"
                                        onClick={() =>
                                            handleFilterChange(card.key)
                                        }
                                        aria-pressed={isActive}
                                        className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C66A4A] focus:ring-offset-2 ${
                                            isActive
                                                ? "border-[#C66A4A] bg-[#172A46] shadow-md"
                                                : "border-[#D9B99B] bg-[#FFFDF9] hover:border-[#C66A4A]"
                                        }`}
                                    >
                                        {isActive && (
                                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#C66A4A]/15 blur-xl" />
                                        )}

                                        <div className="relative flex items-start justify-between gap-3">
                                            <div>
                                                <p
                                                    className={`text-sm font-medium ${
                                                        isActive
                                                            ? "text-[#E8DED2]"
                                                            : "text-[#6B7280]"
                                                    }`}
                                                >
                                                    {card.title}
                                                </p>
                                                <p
                                                    className={`mt-3 text-3xl font-bold ${
                                                        isActive
                                                            ? "text-white"
                                                            : "text-[#172A46]"
                                                    }`}
                                                >
                                                    {card.count}
                                                </p>
                                            </div>

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                                                    isActive
                                                        ? "bg-[#C66A4A] text-white"
                                                        : `${card.iconStyle} group-hover:bg-[#C66A4A] group-hover:text-white`
                                                }`}
                                            >
                                                <CardIcon className="h-5 w-5" />
                                            </div>
                                        </div>

                                        <div
                                            className={`relative mt-5 flex items-center justify-between border-t pt-3 ${
                                                isActive
                                                    ? "border-white/15"
                                                    : "border-[#E8DED2]"
                                            }`}
                                        >
                                            <span
                                                className={`text-xs ${
                                                    isActive
                                                        ? "text-[#E8DED2]"
                                                        : "text-[#6B7280]"
                                                }`}
                                            >
                                                {card.description}
                                            </span>
                                            <ArrowRight
                                                className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                                                    isActive
                                                        ? "text-[#D9B99B]"
                                                        : "text-[#C66A4A]"
                                                }`}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!loading && !error && serviceRequests.length > 0 && (
                    <div>
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-[#172A46]">
                                    {statusFilter === "all"
                                        ? "All Assigned Requests"
                                        : `${statusFilter
                                              .replaceAll("_", " ")
                                              .replace(/^./, (letter) =>
                                                  letter.toUpperCase()
                                              )} Requests`}
                                </h2>
                                <p className="mt-1 text-sm text-[#6B7280]">
                                    Showing {filteredRequests.length}{" "}
                                    {filteredRequests.length === 1
                                        ? "request"
                                        : "requests"}
                                    {statusFilter === "all"
                                        ? " assigned to you"
                                        : ` with ${statusFilter.replaceAll(
                                              "_",
                                              " "
                                          )} status`}
                                </p>
                            </div>

                            {totalPages > 0 && (
                                <p className="text-xs text-[#6B7280]">
                                    Page {currentPage} of {totalPages}
                                </p>
                            )}
                        </div>

                        {filteredRequests.length === 0 ? (
                            <div className="rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] px-6 py-12 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#172A46] text-white">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 font-semibold capitalize text-[#172A46]">
                                    No {statusFilter.replaceAll("_", " ")}{" "}
                                    requests
                                </h3>
                                <p className="mt-2 text-sm text-[#6B7280]">
                                    There are no requests in this category yet.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange("all")}
                                    className="mt-5 rounded-lg bg-[#C66A4A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A95338]"
                                >
                                    Show All Requests
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-hidden rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] shadow-sm">
                                    <div className="hidden border-b border-[#E8DED2] bg-[#F4EDE5] px-5 py-3 md:grid md:grid-cols-[1.6fr_1.1fr_1fr_1fr_auto] md:items-center md:gap-4">
                                        {["Service", "Customer", "Date", "Status"].map(
                                            (heading) => (
                                                <p
                                                    key={heading}
                                                    className="text-[11px] font-semibold uppercase tracking-wider text-[#536070]"
                                                >
                                                    {heading}
                                                </p>
                                            )
                                        )}
                                        <span />
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
                                                <div className="hidden px-5 py-4 md:grid md:grid-cols-[1.6fr_1.1fr_1fr_1fr_auto] md:items-center md:gap-4">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#172A46] text-white">
                                                            <BriefcaseBusiness className="h-4 w-4" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-[#172A46]">
                                                                {request.service_title ||
                                                                    "Service request"}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-[#6B7280]">
                                                                Request #{request.id}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="truncate text-sm text-[#536070]">
                                                        {request.customer ||
                                                            request.customer_name ||
                                                            "Customer"}
                                                    </p>
                                                    <p className="text-sm text-[#536070]">
                                                        {formatDate(request.preferred_date)}
                                                    </p>
                                                    <span
                                                        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.container}`}
                                                    >
                                                        <StatusIcon className="h-3 w-3" />
                                                        {status.label}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => openRequest(request)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-3 py-2 text-xs font-semibold text-[#172A46] transition hover:border-[#C66A4A] hover:text-[#C66A4A]"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        View
                                                    </button>
                                                </div>

                                                <div className="p-4 md:hidden">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex min-w-0 items-start gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172A46] text-white">
                                                                <BriefcaseBusiness className="h-4 w-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="text-sm font-semibold text-[#172A46]">
                                                                    {request.service_title ||
                                                                        "Service request"}
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
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                                                Customer
                                                            </p>
                                                            <p className="mt-1 truncate text-xs font-medium text-[#536070]">
                                                                {request.customer ||
                                                                    request.customer_name ||
                                                                    "Customer"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                                                                Preferred Date
                                                            </p>
                                                            <p className="mt-1 text-xs font-medium text-[#536070]">
                                                                {formatDate(request.preferred_date)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {request.status === "pending" && (
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {renderRequestActions(request)}
                                                        </div>
                                                    )}

                                                    {request.status === "accepted" && (
                                                        <div className="mt-4">
                                                            {renderRequestActions(request)}
                                                        </div>
                                                    )}

                                                    {request.status === "in_progress" && (
                                                        <div className="mt-4">
                                                            {renderRequestActions(request)}
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => openRequest(request)}
                                                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#D9B99B] px-3 py-2.5 text-xs font-semibold text-[#172A46] transition hover:border-[#C66A4A] hover:text-[#C66A4A]"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        View Request
                                                    </button>
                                                </div>

                                                {(request.status === "pending" ||
                                                    request.status === "accepted" ||
                                                    request.status === "in_progress") && (
                                                    <div className="hidden border-t border-[#E8DED2]/70 bg-[#F4EDE5]/40 px-5 py-3 md:flex md:items-center md:justify-between md:gap-3">
                                                        <span className="text-xs text-[#6B7280]">
                                                            {request.status === "pending"
                                                                ? "This request is awaiting your response."
                                                                : request.status === "accepted"
                                                                  ? "Ready to begin the service?"
                                                                  : "The customer will confirm completion."}
                                                        </span>
                                                        {renderRequestActions(request)}
                                                    </div>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-xs text-[#6B7280]">
                                            Showing {startIndex + 1}–
                                            {Math.min(
                                                startIndex + requestsPerPage,
                                                filteredRequests.length
                                            )}{" "}
                                            of {filteredRequests.length}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(currentPage - 1)
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
                                                        type="button"
                                                        key={page}
                                                        onClick={() =>
                                                            handlePageChange(page)
                                                        }
                                                        aria-current={
                                                            currentPage === page
                                                                ? "page"
                                                                : undefined
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
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(currentPage + 1)
                                                }
                                                disabled={currentPage === totalPages}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-3 py-2 text-xs font-medium text-[#536070] transition hover:border-[#C66A4A] hover:text-[#C66A4A] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Next
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>

            {selectedRequest && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172A46]/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeRequest();
                        }
                    }}
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#D9B99B] bg-[#FFFDF9] shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E8DED2] bg-[#FFFDF9] px-5 py-4 sm:px-6">
                            <div className="min-w-0 pr-4">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C66A4A]">
                                    Service Request #{selectedRequest.id}
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-[#172A46]">
                                    {selectedRequest.service_title ||
                                        "Service Request"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeRequest}
                                aria-label="Close request details"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D9B99B] text-[#536070] transition hover:border-[#C66A4A] hover:text-[#C66A4A]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-6 p-5 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F4EDE5] p-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                                        Current Status
                                    </p>
                                    <div className="mt-2">
                                        {(() => {
                                            const status = getStatusStyles(
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

                            <div>
                                <h3 className="text-sm font-semibold text-[#172A46]">
                                    Request Description
                                </h3>
                                <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[#E8DED2] bg-white p-4 text-sm leading-7 text-[#536070]">
                                    {selectedRequest.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-[#C66A4A]" />
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                                            Customer
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {selectedRequest.customer ||
                                            selectedRequest.customer_name ||
                                            "Customer"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-[#C66A4A]" />
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                                            Location
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {selectedRequest.location || "Not provided"}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-[#C66A4A]" />
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                                            Preferred Date
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {formatDate(selectedRequest.preferred_date)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8DED2] bg-white p-4">
                                    <div className="flex items-center gap-2">
                                        <Clock3 className="h-4 w-4 text-[#C66A4A]" />
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                                            Request Created
                                        </p>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-[#172A46]">
                                        {formatDate(selectedRequest.created_at)}
                                    </p>
                                </div>
                            </div>

                            {selectedRequest.updated_at && (
                                <p className="text-xs text-[#9CA3AF]">
                                    Last updated{" "}
                                    {formatDate(selectedRequest.updated_at)}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-[#E8DED2] bg-[#F4EDE5]/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <button
                                type="button"
                                onClick={closeRequest}
                                className="rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-5 py-2.5 text-sm font-medium text-[#536070] transition hover:border-[#172A46] hover:text-[#172A46]"
                            >
                                Close
                            </button>

                            {renderRequestActions(selectedRequest, "modal")}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProviderServiceRequests;

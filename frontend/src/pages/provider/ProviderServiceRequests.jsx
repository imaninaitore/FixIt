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
            "bg-amber-500/20 text-amber-900 border-amber-300/50 backdrop-blur-sm",
          label: "Pending",
        };

      case "accepted":
        return {
          icon: CheckCircle2,
          container:
            "bg-emerald-500/20 text-emerald-900 border-emerald-300/50 backdrop-blur-sm",
          label: "Accepted",
        };

      case "completed":
        return {
          icon: CheckCircle2,
          container:
            "bg-blue-500/20 text-blue-900 border-blue-300/50 backdrop-blur-sm",
          label: "Completed",
        };

      case "rejected":
        return {
          icon: XCircle,
          container:
            "bg-red-500/20 text-red-900 border-red-300/50 backdrop-blur-sm",
          label: "Rejected",
        };

      default:
        return {
          icon: Clock3,
          container:
            "bg-slate-500/20 text-slate-800 border-slate-300/50 backdrop-blur-sm",
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
    <div className="relative min-h-screen bg-slate-900 text-slate-900">
      {/* Clear background image (No Blur) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/dashboard2.jpg')` }}
      />
      {/* Optional faint overlay to increase text contrast over clear background */}
      <div className="fixed inset-0 z-0 bg-black/20" />

      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Hero Section with Glass styling */}
        <section className="relative overflow-hidden mx-auto mt-6 w-full max-w-4xl rounded-3xl border border-white/20 bg-slate-900/60 backdrop-blur-md px-6 py-10 shadow-2xl">
          <div className="relative mx-auto max-w-2xl text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Provider Portal
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Service <span className="text-blue-400">Requests</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
              Review customer requests, view their details, and manage requests assigned to you.
            </p>
          </div>
        </section>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200/60 bg-white/80 p-5 shadow-lg backdrop-blur-md">
              <h2 className="font-semibold text-red-800">
                Unable to complete the request
              </h2>

              <p className="mt-2 text-sm text-red-700">{error}</p>

              <button
                onClick={loadRequests}
                className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/30 bg-white/60 shadow-xl backdrop-blur-md">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                <p className="mt-4 text-sm font-medium text-slate-700">
                  Loading service requests...
                </p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && requests.length === 0 && !error && (
            <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/60 px-5 py-16 text-center shadow-xl backdrop-blur-md">
              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                  <MessageSquare className="h-7 w-7" />
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
                  No service requests yet
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                  Service requests sent to you by customers will appear here.
                </p>
              </div>
            </div>
          )}

          {/* Request list */}
          {!loading && requests.length > 0 && (
            <div>
              {/* List header */}
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white drop-shadow-sm">
                    Customer Requests
                  </h2>

                  <p className="text-sm text-slate-200">
                    Showing {startIndex + 1}–
                    {Math.min(
                      startIndex + requestsPerPage,
                      requests.length
                    )}{" "}
                    of {requests.length} requests
                  </p>
                </div>
              </div>

              {/* Glass Card Container */}
              <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-2xl backdrop-blur-md">
                {currentRequests.map((request, index) => {
                  const status = getStatusStyles(request.status);
                  const StatusIcon = status.icon;

                  return (
                    <button
                      key={request.id}
                      type="button"
                      onClick={() => setSelectedRequest(request)}
                      className={`group w-full text-left transition hover:bg-white/50 ${
                        index !== currentRequests.length - 1
                          ? "border-b border-slate-200/60"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                        {/* Icon */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md transition group-hover:scale-105">
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
                              {status.label}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-slate-600 sm:text-sm">
                            {request.description}
                          </p>
                        </div>

                        {/* Request metadata */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 sm:justify-end">
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                            {request.customer}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-blue-600" />
                            {request.location}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
                            {formatDate(request.preferred_date)}
                          </span>
                        </div>

                        {/* View indicator */}
                        <div className="hidden shrink-0 text-xs font-semibold text-blue-700 sm:block">
                          View 
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Glass Pagination Card */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-xl backdrop-blur-md sm:flex-row">
                  <p className="text-xs font-medium text-slate-700">
                    Page{" "}
                    <span className="font-bold text-slate-900">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-900">
                      {totalPages}
                    </span>
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page)}
                          className={`h-9 min-w-9 rounded-lg px-2 text-xs font-semibold transition shadow-sm ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                              : "border border-slate-300/80 bg-white/80 text-slate-700 hover:bg-white hover:text-blue-600"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-300/80 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Request details modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/30 bg-white/80 shadow-2xl backdrop-blur-lg"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#071426] via-[#0d2b50] to-[#1769aa] px-5 py-6 sm:px-7">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close request details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-200 backdrop-blur-sm">
                  <MessageSquare className="h-6 w-6" />
                </div>

                <div className="pr-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                    Service Request
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    {selectedRequest.service_title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-5 sm:p-7">
              {/* Status */}
              {(() => {
                const status = getStatusStyles(selectedRequest.status);
                const StatusIcon = status.icon;

                return (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Request Description
                </p>

                <div className="mt-2 rounded-xl border border-slate-200/80 bg-white/60 p-4">
                  <p className="text-sm leading-7 text-slate-800">
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              {/* Details grid */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedRequest.customer || "Not provided"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedRequest.location || "Not provided"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Preferred Date
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatDate(selectedRequest.preferred_date)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Request ID
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    #{selectedRequest.id}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === "pending" && (
                <div className="mt-7 flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedRequest.id, "rejected")
                    }
                    disabled={updatingId === selectedRequest.id}
                    className="rounded-xl border border-red-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(selectedRequest.id, "accepted")
                    }
                    disabled={updatingId === selectedRequest.id}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 shadow-md"
                  >
                    Accept Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderServiceRequests;
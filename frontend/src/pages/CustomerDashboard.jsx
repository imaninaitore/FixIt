import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ClipboardList,
    Clock3,
    CheckCircle2,
    Search,
    PlusCircle,
    ArrowRight,
    X,
    MapPin,
    CalendarDays,
    BarChart3,
} from "lucide-react";

import Footer from "../components/Footer";
import { getServiceRequests } from "../services/serviceRequestService";

function CustomerDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getServiceRequests();
            setServiceRequests(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load your dashboard.");
        } finally {
            setLoading(false);
        }
    };

    const totalRequests = serviceRequests.length;

    const pendingRequests = serviceRequests.filter(
        (request) => request.status === "pending"
    );

    const acceptedRequests = serviceRequests.filter(
        (request) => request.status === "accepted"
    );

    const completedRequests = serviceRequests.filter(
        (request) => request.status === "completed"
    );

    const analysisData = [
        {
            label: "Total Requests",
            value: totalRequests,
            color: "bg-[#172A46]",
            textColor: "text-[#172A46]",
        },
        {
            label: "Pending",
            value: pendingRequests.length,
            color: "bg-[#C66A4A]",
            textColor: "text-[#C66A4A]",
        },
        {
            label: "Accepted",
            value: acceptedRequests.length,
            color: "bg-[#B89573]",
            textColor: "text-[#B89573]",
        },
        {
            label: "Completed",
            value: completedRequests.length,
            color: "bg-[#647D71]",
            textColor: "text-[#647D71]",
        },
    ];

    const maximumValue = Math.max(
        ...analysisData.map((item) => item.value),
        1
    );

    const formatDate = (date) => {
        if (!date) return "Not specified";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#F4EDE5]">
            {/* Dashboard hero */}
            <section
                className="relative overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-[#172A46]/85"></div>

                <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
                    <div className="max-w-3xl">
                        {username && (
                            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[#D9B99B]">
                                Welcome back, {username}
                            </p>
                        )}

                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#C66A4A]">
                            Your FixIt Dashboard
                        </p>

                        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Everything You Need
                            <span className="block text-[#D9B99B]">
                                In One Place
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                            Find trusted professionals, create and manage
                            service requests, communicate with providers,
                            review completed services, and keep track of your
                            FixIt activity.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate("/providers")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C66A4A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#172A46]"
                            >
                                <Search className="h-4 w-4" />
                                Find a Provider
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Request analysis graph */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-10">
                <div className="overflow-hidden rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-[#E8DDD1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C66A4A]">
                                Dashboard overview
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-[#172A46] sm:text-2xl">
                                Request Analysis
                            </h2>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                An overview of your service request activity.
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172A46]/5">
                            <BarChart3 className="h-5 w-5 text-[#172A46]" />
                        </div>
                    </div>

                    <div className="p-5 sm:p-7">
                        {loading ? (
                            <div className="flex min-h-56 items-center justify-center">
                                <p className="text-sm text-[#536070]">
                                    Loading request analysis...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="flex min-h-40 items-center justify-center">
                                <p className="text-sm text-red-600">
                                    Unable to load request analysis.
                                </p>
                            </div>
                        ) : (
                            <div
                                className="space-y-6"
                                role="img"
                                aria-label={`Request analysis: ${totalRequests} total requests, ${pendingRequests.length} pending, ${acceptedRequests.length} accepted, and ${completedRequests.length} completed.`}
                            >
                                {analysisData.map((item) => {
                                    const barWidth =
                                        (item.value / maximumValue) * 100;

                                    return (
                                        <div
                                            key={item.label}
                                            className="grid grid-cols-[105px_minmax(0,1fr)_36px] items-center gap-3 sm:grid-cols-[145px_minmax(0,1fr)_44px] sm:gap-5"
                                        >
                                            <span className="text-xs font-medium text-[#536070] sm:text-sm">
                                                {item.label}
                                            </span>

                                            <div className="h-7 overflow-hidden rounded-md bg-[#F0E7DD] sm:h-8">
                                                <div
                                                    className={`h-full rounded-md ${item.color} transition-all duration-700`}
                                                    style={{
                                                        width: `${barWidth}%`,
                                                        minWidth:
                                                            item.value > 0
                                                                ? "6px"
                                                                : "0",
                                                    }}
                                                />
                                            </div>

                                            <span
                                                className={`text-right text-sm font-semibold tabular-nums ${item.textColor}`}
                                            >
                                                {item.value}
                                            </span>
                                        </div>
                                    );
                                })}

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E8DDD1] pt-5">
                                    {analysisData.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-2"
                                        >
                                            <span
                                                className={`h-2.5 w-2.5 rounded-sm ${item.color}`}
                                            />
                                            <span className="text-xs text-[#6B7280]">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

{/* Pending requests */}
<section className="bg-[#FFFDF9] py-8 sm:py-10">
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="mb-5 flex items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-semibold text-[#172A46]">
                    Pending Requests
                    <span className="ml-2 text-sm font-normal text-[#8B8178]">
                        ({pendingRequests.length})
                    </span>
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                    Requests awaiting a response.
                </p>
            </div>

            <button
                type="button"
                onClick={() => navigate("/service-requests")}
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#C66A4A] hover:text-[#172A46]"
            >
                View all
                <ArrowRight className="h-4 w-4" />
            </button>
        </div>

        {loading && (
            <p className="py-4 text-sm text-[#6B7280]">
                Loading requests...
            </p>
        )}

        {!loading && error && (
            <p className="py-3 text-sm text-red-600">
                {error}
            </p>
        )}

        {!loading && !error && pendingRequests.length === 0 && (
            <div className="border-y border-[#E8DDD1] py-6">
                <p className="text-sm font-medium text-[#172A46]">
                    No pending requests
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                    Your new service requests will appear here.
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/providers")}
                    className="mt-3 text-sm font-medium text-[#C66A4A] hover:text-[#172A46]"
                >
                    Find a provider
                </button>
            </div>
        )}

        {!loading && !error && pendingRequests.length > 0 && (
            <div className="divide-y divide-[#E8DDD1] border-y border-[#E8DDD1]">
                {pendingRequests.map((request) => (
                    <div
                        key={request.id}
                        className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <h3 className="text-sm font-semibold text-[#172A46]">
                                    {request.service_title || "Service Request"}
                                </h3>

                                <span className="text-xs font-medium text-[#C66A4A]">
                                    Pending
                                </span>
                            </div>

                            {request.description && (
                                <p className="mt-1 line-clamp-1 text-sm text-[#6B7280]">
                                    {request.description}
                                </p>
                            )}

                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#81786F]">
                                {request.provider && (
                                    <span>
                                        Provider: {request.provider}
                                    </span>
                                )}

                                {request.location && (
                                    <span>
                                        {request.location}
                                    </span>
                                )}

                                {request.preferred_date && (
                                    <span>
                                        Preferred date: {formatDate(request.preferred_date)}
                                    </span>
                                )}
                            </div>
                        </div>

<button
    type="button"
    onClick={() => setSelectedRequest(request)}
    className="inline-flex shrink-0 items-center gap-1 self-start text-xs font-medium text-[#172A46] hover:text-[#C66A4A] sm:self-center"
>
    View details
    <ArrowRight className="h-3.5 w-3.5" />
</button>
                    </div>
                ))}
            </div>
        )}
    </div>
</section>

{/* Request details popup */}
{selectedRequest && (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#172A46]/60 p-4 backdrop-blur-sm"
        onClick={() => setSelectedRequest(null)}
    >
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
            className="w-full max-w-lg overflow-hidden rounded-xl bg-[#FFFDF9] shadow-xl"
            onClick={(event) => event.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E8DDD1] px-5 py-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#C66A4A]">
                        Service request
                    </p>

                    <h2
                        id="request-modal-title"
                        className="mt-1 text-xl font-semibold text-[#172A46]"
                    >
                        {selectedRequest.service_title || "Service Request"}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    aria-label="Close request details"
                    className="rounded-md p-1.5 text-[#6B7280] transition hover:bg-[#F4EDE5] hover:text-[#172A46]"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Details */}
            <div className="space-y-5 px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-[#6B7280]">
                        Status
                    </span>

                    <span className="rounded-md bg-[#F2D8CC]/70 px-2.5 py-1 text-xs font-medium capitalize text-[#A65337]">
                        {selectedRequest.status}
                    </span>
                </div>

                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#81786F]">
                        Description
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#3F4A52]">
                        {selectedRequest.description || "No description provided."}
                    </p>
                </div>

                <div className="border-t border-[#E8DDD1]" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <p className="flex items-center gap-2 text-xs text-[#81786F]">
                            <ClipboardList className="h-4 w-4" />
                            Request ID
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-[#172A46]">
                            #{selectedRequest.id}
                        </p>
                    </div>

                    <div>
                        <p className="flex items-center gap-2 text-xs text-[#81786F]">
                            <MapPin className="h-4 w-4" />
                            Location
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-[#172A46]">
                            {selectedRequest.location || "Not provided"}
                        </p>
                    </div>

                    <div>
                        <p className="flex items-center gap-2 text-xs text-[#81786F]">
                            <CheckCircle2 className="h-4 w-4" />
                            Provider
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-[#172A46]">
                            {selectedRequest.provider || "Awaiting provider"}
                        </p>
                    </div>

                    <div>
                        <p className="flex items-center gap-2 text-xs text-[#81786F]">
                            <CalendarDays className="h-4 w-4" />
                            Preferred date
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-[#172A46]">
                            {formatDate(selectedRequest.preferred_date)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-[#E8DDD1] px-5 py-3">
                <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="rounded-lg bg-[#172A46] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#C66A4A]"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

            {/* Final CTA */}
            <section className="bg-[#172A46] py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-5 text-center sm:px-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#D9B99B]">
                        Need something fixed?
                    </p>

                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Find the right professional for the job.
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-white/70">
                        Browse trusted providers or create a service request
                        and let FixIt help you get started.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => navigate("/providers")}
                            className="rounded-xl bg-[#C66A4A] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#D98A6D]"
                        >
                            Find a Provider
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/service-requests/create")
                            }
                            className="rounded-xl border border-[#D9B99B]/40 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-[#D9B99B]/15"
                        >
                            Create a Request
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default CustomerDashboard;

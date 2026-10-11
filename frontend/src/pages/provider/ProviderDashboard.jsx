import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    BarChart3,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    MapPin,
    MessageSquare,
    Star,
    UserRound,
    Wrench,
    XCircle,
} from "lucide-react";

import { getMyProvider } from "../../services/providerService";
import { getProviderServiceRequests } from "../../services/serviceRequestService";
import { getConversations } from "../../services/messagingService";
import { getMyProviderEnrolment } from "../../services/providerEnrolmentService";

const statusStyles = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    accepted: "border-emerald-200 bg-emerald-50 text-emerald-800",
    completed: "border-blue-200 bg-blue-50 text-blue-800",
    rejected: "border-red-200 bg-red-50 text-red-800",
    in_progress: "border-violet-200 bg-violet-50 text-violet-800",
    cancelled: "border-stone-200 bg-stone-100 text-stone-700",
};

function ProviderDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [profile, setProfile] = useState(null);
    const [enrolment, setEnrolment] = useState(null);
    const [requests, setRequests] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const enrolmentData = await getMyProviderEnrolment();
            setEnrolment(enrolmentData);

            if (!enrolmentData) return;

            if (enrolmentData.status === "submitted") {
                navigate("/provider/pending", { replace: true });
                return;
            }

            if (enrolmentData.status === "approved") {
                const [
                    profileData,
                    requestsData,
                    conversationsData,
                ] = await Promise.all([
                    getMyProvider(),
                    getProviderServiceRequests(),
                    getConversations(),
                ]);

                setProfile(profileData);

                setRequests(
                    Array.isArray(requestsData)
                        ? requestsData
                        : requestsData?.results || []
                );

                setConversations(
                    Array.isArray(conversationsData)
                        ? conversationsData
                        : conversationsData?.results || []
                );
            } else if (enrolmentData.status === "rejected") {
                setError(
                    "Your provider enrolment was not approved. Please review your application."
                );
            }
        } catch (err) {
            console.error("Failed to load provider dashboard:", err);
            setError(
                err.message || "Failed to load your provider dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const pendingRequests = requests.filter(
        (request) => request.status === "pending"
    );

    const acceptedRequests = requests.filter(
        (request) => request.status === "accepted"
    );

    const completedRequests = requests.filter(
        (request) => request.status === "completed"
    );

    const rejectedRequests = requests.filter(
        (request) => request.status === "rejected"
    );

    const activeRequests =
        pendingRequests.length + acceptedRequests.length;

    const activityPercentage =
        requests.length > 0
            ? Math.round((activeRequests / requests.length) * 100)
            : 0;

    const requestPercentage = (count) =>
        requests.length > 0
            ? Math.round((count / requests.length) * 100)
            : 0;

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

    const getStatusClasses = (status) =>
        statusStyles[status] ||
        "border-stone-200 bg-stone-100 text-stone-700";

    const goToRequests = () =>
        navigate("/provider/service-requests");

    const goToProfile = () => {
        if (profile?.id) {
            navigate(`/providers/${profile.id}`);
        }
    };

    const analysisData = [
        {
            label: "Pending",
            value: pendingRequests.length,
            color: "#C66A4A",
            lightColor: "bg-[#C66A4A]",
        },
        {
            label: "Accepted",
            value: acceptedRequests.length,
            color: "#B89573",
            lightColor: "bg-[#B89573]",
        },
        {
            label: "Completed",
            value: completedRequests.length,
            color: "#647D71",
            lightColor: "bg-[#647D71]",
        },
        {
            label: "Rejected",
            value: rejectedRequests.length,
            color: "#B85C50",
            lightColor: "bg-[#B85C50]",
        },
    ];

    const maximumStatusValue = Math.max(
        ...analysisData.map((item) => item.value),
        1
    );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4EDE5] p-6">
                <div className="w-full max-w-sm rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-8 text-center shadow-sm">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D9B99B]/40 border-t-[#C66A4A]" />
                    <p className="mt-4 text-sm font-medium text-[#536070]">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4EDE5] p-5 sm:p-8">
                <div className="w-full max-w-lg rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-7 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <XCircle className="h-6 w-6" />
                    </div>

                    <h2 className="mt-4 text-xl font-semibold text-[#172A46]">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#536070]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadDashboard}
                        className="mt-5 rounded-xl bg-[#C66A4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#172A46]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!enrolment) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F4EDE5] p-5">
                <div className="w-full max-w-2xl rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#172A46] text-white">
                        <BriefcaseBusiness className="h-8 w-8" />
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#C66A4A]">
                        Provider Registration
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold text-[#172A46] sm:text-3xl">
                        Complete Your Enrolment
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#536070]">
                        Before you can receive and manage service requests,
                        you need to complete your provider enrolment.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/provider/enrolment")}
                        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C66A4A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#172A46]"
                    >
                        Complete Enrolment
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4EDE5]">

            {/* Dashboard hero */}
            <section
                className="relative overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-[#172A46]/85" />

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
                            Manage Your Business
                            <span className="block text-[#D9B99B]">
                                In One Place
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                            Track service requests, connect with customers,
                            monitor your business activity, and manage your
                            provider profile — all from one place.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={goToRequests}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C66A4A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B85B3E]"
                            >
                                <ClipboardList className="h-4 w-4" />
                                View Service Requests
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/messages")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                            >
                                <MessageSquare className="h-4 w-4" />
                                Open Messages
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Circular request analysis */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-10">
                <div className="overflow-hidden rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] shadow-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-[#E8DDD1] px-5 py-5 sm:px-7">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C66A4A]">
                                Dashboard Overview
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-[#172A46] sm:text-2xl">
                                Request Analysis
                            </h2>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                Monitor the status of your service requests.
                            </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172A46]/5">
                            <BarChart3 className="h-5 w-5 text-[#172A46]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-8 p-5 sm:p-7 md:grid-cols-2 md:gap-10">

                        {/* Circular activity graph */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative h-56 w-56 sm:h-64 sm:w-64">
                                <svg
                                    viewBox="0 0 200 200"
                                    className="h-full w-full -rotate-90"
                                    role="img"
                                    aria-label={`${activityPercentage}% of service requests are pending or accepted`}
                                >
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="78"
                                        fill="none"
                                        stroke="#E8DDD1"
                                        strokeWidth="16"
                                    />

                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="78"
                                        fill="none"
                                        stroke="#C66A4A"
                                        strokeWidth="16"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(activityPercentage / 100) * 490.09} 490.09`}
                                        className="transition-all duration-700"
                                    />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-4xl font-semibold tracking-tight text-[#172A46] sm:text-5xl">
                                        {activityPercentage}%
                                    </span>

                                    <span className="mt-2 text-sm font-medium text-[#6B7280]">
                                        Active requests
                                    </span>

                                    <span className="mt-1 text-xs text-[#8B8178]">
                                        {activeRequests} of {requests.length} total
                                    </span>
                                </div>
                            </div>

                            <p className="mt-3 max-w-xs text-center text-sm leading-6 text-[#6B7280]">
                                Percentage of requests that are awaiting action
                                or have been accepted.
                            </p>
                        </div>

                        {/* Request status breakdown */}
                        <div>
                            <h3 className="text-base font-semibold text-[#172A46]">
                                Request Breakdown
                            </h3>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                See how your requests are distributed.
                            </p>

                            <div className="mt-6 space-y-5">
                                {analysisData.map((item) => {
                                    const percentage = requestPercentage(
                                        item.value
                                    );

                                    const barWidth =
                                        (item.value / maximumStatusValue) * 100;

                                    return (
                                        <div key={item.label}>
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5">
                                                    <span
                                                        className="h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor: item.color,
                                                        }}
                                                    />

                                                    <span className="text-sm font-medium text-[#536070]">
                                                        {item.label}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-[#8B8178]">
                                                        {percentage}%
                                                    </span>

                                                    <span className="min-w-5 text-right text-sm font-semibold text-[#172A46]">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-[#F0E7DD]">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${barWidth}%`,
                                                        backgroundColor: item.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#E8DDD1] pt-5">
                                <div className="rounded-xl bg-[#F4EDE5] p-4">
                                    <p className="text-xs text-[#6B7280]">
                                        Total requests
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-[#172A46]">
                                        {requests.length}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F4EDE5] p-4">
                                    <p className="text-xs text-[#6B7280]">
                                        Conversations
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold text-[#172A46]">
                                        {conversations.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent service requests */}
            <section className="bg-[#FFFDF9] py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-[#172A46]">
                                Recent Requests
                                <span className="ml-2 text-sm font-normal text-[#8B8178]">
                                    ({requests.length})
                                </span>
                            </h2>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                Keep track of your latest customer requests.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={goToRequests}
                            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#C66A4A] hover:text-[#172A46]"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    {requests.length === 0 ? (
                        <div className="border-y border-[#E8DDD1] py-6">
                            <p className="text-sm font-medium text-[#172A46]">
                                No service requests yet
                            </p>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                New customer requests will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E8DDD1] border-y border-[#E8DDD1]">
                            {[...requests]
                                .sort(
                                    (a, b) =>
                                        new Date(b.created_at || 0) -
                                        new Date(a.created_at || 0)
                                )
                                .slice(0, 5)
                                .map((request) => (
                                    <button
                                        key={request.id}
                                        type="button"
                                        onClick={goToRequests}
                                        className="flex w-full flex-col gap-2 py-4 text-left transition hover:bg-[#F4EDE5]/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-3"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <h3 className="text-sm font-semibold text-[#172A46]">
                                                    {request.service_title || "Service Request"}
                                                </h3>

                                                <span
                                                    className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${getStatusClasses(request.status)}`}
                                                >
                                                    {request.status?.replace("_", " ") || "Unknown"}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-[#6B7280]">
                                                {request.customer || "Customer"}
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#81786F]">
                                                {request.location && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {request.location}
                                                    </span>
                                                )}

                                                <span className="inline-flex items-center gap-1">
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    {formatDate(request.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="inline-flex shrink-0 items-center gap-1 self-start text-xs font-medium text-[#172A46] sm:self-center">
                                            View requests
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Provider profile and enrolment */}
            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-10 sm:px-6 lg:grid-cols-2 lg:px-10">
                <div className="rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C66A4A]">
                                Your Business
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-[#172A46]">
                                Provider Profile
                            </h2>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                Your public provider information.
                            </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172A46]/5 text-[#172A46]">
                            <BriefcaseBusiness className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="text-xs text-[#81786F]">
                                Business name
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold text-[#172A46]">
                                {profile?.business_name || "Not available"}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-[#81786F]">
                                    Service category
                                </p>
                                <p className="mt-1 break-words text-sm font-medium text-[#172A46]">
                                    {profile?.service_category || "Not available"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#81786F]">
                                    Location
                                </p>
                                <p className="mt-1 break-words text-sm font-medium text-[#172A46]">
                                    {profile?.location || "Not available"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-[#81786F]">
                                Years of experience
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#172A46]">
                                {profile?.years_of_experience != null
                                    ? `${profile.years_of_experience} years`
                                    : "Not available"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={goToProfile}
                        disabled={!profile?.id}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9C2AD] px-5 py-3 text-sm font-semibold text-[#172A46] transition hover:border-[#C66A4A] hover:bg-[#F4EDE5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <UserRound className="h-4 w-4" />
                        Manage Profile
                    </button>
                </div>

                <div className="rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C66A4A]">
                                Account Details
                            </p>

                            <h2 className="mt-2 text-xl font-semibold text-[#172A46]">
                                Provider Enrolment
                            </h2>

                            <p className="mt-1 text-sm text-[#6B7280]">
                                Your registration and payment status.
                            </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172A46]/5 text-[#172A46]">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-[#F4EDE5] p-4">
                            <p className="text-xs text-[#81786F]">
                                Enrolment status
                            </p>
                            <p className="mt-2 text-sm font-semibold capitalize text-[#172A46]">
                                {enrolment?.status || "Unknown"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#F4EDE5] p-4">
                            <p className="text-xs text-[#81786F]">
                                Payment status
                            </p>
                            <p
                                className={`mt-2 text-sm font-semibold capitalize ${
                                    enrolment?.payment_status === "paid"
                                        ? "text-emerald-700"
                                        : "text-[#C66A4A]"
                                }`}
                            >
                                {enrolment?.payment_status || "Unknown"}
                            </p>
                        </div>
                    </div>

                    {enrolment?.business_name && (
                        <div className="mt-4">
                            <p className="text-xs text-[#81786F]">
                                Registered business
                            </p>
                            <p className="mt-1 break-words text-sm font-medium text-[#172A46]">
                                {enrolment.business_name}
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate("/provider/enrolment")}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9C2AD] px-5 py-3 text-sm font-semibold text-[#172A46] transition hover:border-[#C66A4A] hover:bg-[#F4EDE5]"
                    >
                        View Enrolment
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </section>

            {/* Final call to action */}
            <section className="bg-[#172A46] py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-5 text-center sm:px-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#D9B99B]">
                        Grow With FixIt
                    </p>

                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Ready for your next service request?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">
                        Keep your profile updated, respond to customers,
                        and use your dashboard to stay on top of your work.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={goToRequests}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C66A4A] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B85B3E]"
                        >
                            Manage Requests
                            <ArrowRight className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/messages")}
                            className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/20"
                        >
                            Open Messages
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProviderDashboard;
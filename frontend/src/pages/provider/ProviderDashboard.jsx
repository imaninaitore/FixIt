import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProvider } from "../../services/providerService";

import {
    getProviderServiceRequests,
} from "../../services/serviceRequestService";

import {
    getConversations,
} from "../../services/messagingService";

import {
    getMyProviderEnrolment,
} from "../../services/providerEnrolmentService";


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

            if (!enrolmentData) {
                return;
            }

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
            setRequests(requestsData || []);
            setConversations(conversationsData || []);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load your provider dashboard."
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


    const requestPercentage = (count) => {
        if (requests.length === 0) {
            return 0;
        }

        return Math.round(
            (count / requests.length) * 100
        );
    };


    const activeRequests =
        pendingRequests.length +
        acceptedRequests.length;


    const activityPercentage =
        requests.length > 0
            ? Math.round(
                  (activeRequests / requests.length) * 100
              )
            : 0;


    const formatDate = (date) => {
        if (!date) {
            return "No date";
        }

        return new Date(date).toLocaleDateString(
            "en-KE",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };


    const getStatusClasses = (status) => {
        switch (status) {
            case "pending":
                return "border-amber-200 bg-amber-50 text-amber-700";

            case "accepted":
                return "border-emerald-200 bg-emerald-50 text-emerald-700";

            case "completed":
                return "border-blue-200 bg-blue-50 text-blue-700";

            case "rejected":
                return "border-red-200 bg-red-50 text-red-700";

            default:
                return "border-slate-200 bg-slate-100 text-slate-600";
        }
    };


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-700 via-slate-300 to-blue-900 p-6">
                <div className="rounded-2xl border border-white/60 bg-white/80 px-8 py-7 text-center shadow-2xl backdrop-blur-xl">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-4 text-sm font-medium text-slate-600">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-700 via-slate-300 to-blue-900 p-4 sm:p-6 lg:p-8">
                <div className="rounded-2xl border border-white/60 bg-white/85 p-6 shadow-2xl backdrop-blur-xl">
                    <h2 className="font-semibold text-red-800">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }


    if (!enrolment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-700 via-slate-300 to-blue-900 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-2xl rounded-2xl border border-white/70 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M9 12l2 2 4-4m6-1a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Provider Registration
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Complete Your Enrolment
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500">
                        Before you can receive and manage service
                        requests, you need to complete your provider
                        enrolment.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/provider/enrolment")
                        }
                        className="mt-7 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Complete Enrolment
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-700 via-slate-300 to-blue-900 p-3 sm:p-4 md:p-5 lg:p-6">

            <div className="mx-auto w-full max-w-[1700px]">

                {/* Header */}
                <section className="mb-5">
                    <div className="rounded-2xl border border-white/50 bg-white/20 p-4 shadow-lg backdrop-blur-xl sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                                    Welcome back
                                </p>

                                <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                    {profile?.business_name ||
                                        username ||
                                        "Provider"}
                                </h1>

                                <p className="mt-1 max-w-2xl text-xs text-slate-700 sm:text-sm">
                                    Here is an overview of your FixIt
                                    business and customer activity.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="w-full rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 sm:w-auto"
                            >
                                View Service Requests
                            </button>

                        </div>
                    </div>
                </section>


                {/* Statistics */}
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

                    {/* Total Requests */}
                    <button
                        onClick={() =>
                            navigate(
                                "/provider/service-requests"
                            )
                        }
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/70
                            bg-gradient-to-br
                            from-slate-200
                            via-white
                            to-blue-400
                            p-[1px]
                            text-left
                            shadow-lg
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                        "
                    >
                        <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-white/95 via-slate-100/90 to-blue-100/80 px-4 py-3.5">
                            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/80 blur-2xl" />

                            <p className="relative text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Total Requests
                            </p>

                            <p className="relative mt-1 text-2xl font-black text-slate-900">
                                {requests.length}
                            </p>

                            <div className="mt-2 h-1 w-12 rounded-full bg-blue-600" />
                        </div>
                    </button>


                    {/* Pending */}
                    <button
                        onClick={() =>
                            navigate(
                                "/provider/service-requests"
                            )
                        }
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/70
                            bg-gradient-to-br
                            from-slate-200
                            via-white
                            to-blue-400
                            p-[1px]
                            text-left
                            shadow-lg
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                        "
                    >
                        <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-white/95 via-slate-100/90 to-blue-100/80 px-4 py-3.5">
                            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/80 blur-2xl" />

                            <p className="relative text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Pending
                            </p>

                            <p className="relative mt-1 text-2xl font-black text-slate-900">
                                {pendingRequests.length}
                            </p>

                            <div className="mt-2 h-1 w-12 rounded-full bg-blue-500" />
                        </div>
                    </button>


                    {/* Accepted */}
                    <button
                        onClick={() =>
                            navigate(
                                "/provider/service-requests"
                            )
                        }
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/70
                            bg-gradient-to-br
                            from-slate-200
                            via-white
                            to-blue-400
                            p-[1px]
                            text-left
                            shadow-lg
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                        "
                    >
                        <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-white/95 via-slate-100/90 to-blue-100/80 px-4 py-3.5">
                            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/80 blur-2xl" />

                            <p className="relative text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Accepted
                            </p>

                            <p className="relative mt-1 text-2xl font-black text-slate-900">
                                {acceptedRequests.length}
                            </p>

                            <div className="mt-2 h-1 w-12 rounded-full bg-blue-600" />
                        </div>
                    </button>


                    {/* Conversations */}
                    <button
                        onClick={() =>
                            navigate("/messages")
                        }
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/70
                            bg-gradient-to-br
                            from-slate-200
                            via-white
                            to-blue-400
                            p-[1px]
                            text-left
                            shadow-lg
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                        "
                    >
                        <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-white/95 via-slate-100/90 to-blue-100/80 px-4 py-3.5">
                            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/80 blur-2xl" />

                            <p className="relative text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Conversations
                            </p>

                            <p className="relative mt-1 text-2xl font-black text-slate-900">
                                {conversations.length}
                            </p>

                            <div className="mt-2 h-1 w-12 rounded-full bg-blue-500" />
                        </div>
                    </button>

                </section>


                {/* Main Dashboard Grid */}
                <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">

                    {/* Request Activity */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-white/95 via-slate-200/90 to-blue-100/90 p-4 shadow-xl backdrop-blur-xl lg:col-span-2">

                        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-300/30 blur-3xl" />

                        <div className="relative flex items-start justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                                    Request Activity
                                </h2>

                                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                                    Current service request breakdown
                                </p>
                            </div>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-md shadow-blue-300/40">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M4 13h6V4H4v9zm0 7h6v-4H4v4zm10 0h6v-9h-6v9zm0-16v4h6V4h-6z"
                                    />
                                </svg>
                            </div>
                        </div>


                        <div className="relative mt-3 grid items-center gap-4 sm:grid-cols-2">

                            {/* Gauge */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative h-[115px] w-[205px]">
                                    <svg
                                        viewBox="0 0 220 125"
                                        className="h-full w-full"
                                    >
                                        <defs>
                                            <linearGradient
                                                id="activityGradient"
                                                x1="0%"
                                                y1="0%"
                                                x2="100%"
                                                y2="0%"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#94a3b8"
                                                />

                                                <stop
                                                    offset="50%"
                                                    stopColor="#3b82f6"
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#1d4ed8"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <path
                                            d="M 20 110 A 90 90 0 0 1 200 110"
                                            fill="none"
                                            stroke="#cbd5e1"
                                            strokeWidth="18"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M 20 110 A 90 90 0 0 1 200 110"
                                            fill="none"
                                            stroke="url(#activityGradient)"
                                            strokeWidth="18"
                                            strokeLinecap="round"
                                            pathLength="100"
                                            strokeDasharray={`${activityPercentage} 100`}
                                        />
                                    </svg>

                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                                        <p className="text-2xl font-black text-slate-900">
                                            {activityPercentage}%
                                        </p>

                                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                            Active
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-0.5 text-[10px] text-slate-500">
                                    {activeRequests} of{" "}
                                    {requests.length} requests
                                </p>
                            </div>


                            {/* Breakdown */}
                            <div className="space-y-2">

                                <div className="flex items-center justify-between rounded-lg border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-amber-400" />

                                        <span className="text-[10px] font-medium text-slate-600">
                                            Pending
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-slate-900">
                                        {requestPercentage(
                                            pendingRequests.length
                                        )}
                                        %
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                        <span className="text-[10px] font-medium text-slate-600">
                                            Accepted
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-slate-900">
                                        {requestPercentage(
                                            acceptedRequests.length
                                        )}
                                        %
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />

                                        <span className="text-[10px] font-medium text-slate-600">
                                            Completed
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-slate-900">
                                        {requestPercentage(
                                            completedRequests.length
                                        )}
                                        %
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-400" />

                                        <span className="text-[10px] font-medium text-slate-600">
                                            Rejected
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-slate-900">
                                        {requestPercentage(
                                            rejectedRequests.length
                                        )}
                                        %
                                    </span>
                                </div>

                            </div>

                        </div>
                    </div>


                    {/* Recent Service Requests */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-white/95 via-slate-200/90 to-blue-100/90 shadow-xl backdrop-blur-xl">

                        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-300/30 blur-3xl" />

                        <div className="relative flex items-center justify-between border-b border-white/70 px-3.5 py-3">

                            <div>
                                <h2 className="text-xs font-bold text-slate-900 sm:text-sm">
                                    Recent Requests
                                </h2>

                                <p className="mt-0.5 text-[9px] text-slate-500">
                                    Latest customer activity
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="text-[10px] font-bold text-blue-700 hover:text-blue-900"
                            >
                                View all
                            </button>
                        </div>


                        {requests.length === 0 ? (
                            <div className="px-3 py-8 text-center">
                                <p className="text-xs font-semibold text-slate-900">
                                    No requests yet
                                </p>

                                <p className="mt-1 text-[10px] text-slate-500">
                                    New requests will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="relative divide-y divide-white/70">
                                {requests
                                    .slice(0, 3)
                                    .map((request) => (
                                        <button
                                            key={request.id}
                                            onClick={() =>
                                                navigate(
                                                    "/provider/service-requests"
                                                )
                                            }
                                            className="w-full px-3.5 py-2.5 text-left transition hover:bg-white/70"
                                        >
                                            <div className="flex items-start justify-between gap-2">

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-[11px] font-bold text-slate-900">
                                                        {request.service_title}
                                                    </h3>

                                                    <p className="mt-0.5 truncate text-[9px] text-slate-500">
                                                        {request.customer}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                                        {request.location}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-bold capitalize ${getStatusClasses(
                                                        request.status
                                                    )}`}
                                                >
                                                    {request.status}
                                                </span>

                                            </div>

                                            <p className="mt-1 text-[8px] text-slate-400">
                                                {formatDate(
                                                    request.created_at
                                                )}
                                            </p>
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>


                    {/* Recent Profile */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-white/95 via-slate-200/90 to-blue-100/90 shadow-xl backdrop-blur-xl">

                        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-300/30 blur-3xl" />

                        <div className="relative flex items-center justify-between border-b border-white/70 px-3.5 py-3">

                            <div>
                                <h2 className="text-xs font-bold text-slate-900 sm:text-sm">
                                    Recent Profile
                                </h2>

                                <p className="mt-0.5 text-[9px] text-slate-500">
                                    Provider information
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    profile?.id &&
                                    navigate(
                                        `/providers/${profile.id}`
                                    )
                                }
                                className="text-[10px] font-bold text-blue-700 hover:text-blue-900"
                            >
                                View
                            </button>
                        </div>


                        <div className="relative space-y-2.5 p-3.5">

                            <div className="rounded-lg border border-white/70 bg-white/60 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    Business
                                </p>

                                <p className="mt-0.5 truncate text-[11px] font-bold text-slate-900">
                                    {profile?.business_name ||
                                        "Not available"}
                                </p>
                            </div>


                            <div className="rounded-lg border border-white/70 bg-white/60 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    Category
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-slate-700">
                                    {profile?.service_category ||
                                        "Not available"}
                                </p>
                            </div>


                            <div className="rounded-lg border border-white/70 bg-white/60 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    Location
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-slate-700">
                                    {profile?.location ||
                                        "Not available"}
                                </p>
                            </div>


                            <div className="rounded-lg border border-white/70 bg-white/60 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    Experience
                                </p>

                                <p className="mt-0.5 text-[11px] text-slate-700">
                                    {profile?.years_of_experience !==
                                    undefined
                                        ? `${profile.years_of_experience} years`
                                        : "Not available"}
                                </p>
                            </div>


                            <button
                                onClick={() =>
                                    profile?.id &&
                                    navigate(
                                        `/providers/${profile.id}`
                                    )
                                }
                                className="w-full rounded-lg bg-blue-700 py-2 text-[10px] font-bold text-white shadow-md transition hover:bg-blue-800"
                            >
                                Manage Profile
                            </button>

                        </div>
                    </div>

                </section>


                {/* Provider Enrolment + Quick Actions */}
                <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

                    {/* Provider Enrolment */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-white/95 via-slate-200/90 to-blue-100/90 p-4 shadow-xl backdrop-blur-xl">

                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-300/30 blur-3xl" />

                        <div className="relative flex items-center justify-between">

                            <div>
                                <h2 className="text-sm font-bold text-slate-900">
                                    Provider Enrolment
                                </h2>

                                <p className="mt-1 text-[10px] text-slate-500">
                                    Your FixIt provider account
                                </p>
                            </div>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-md">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M9 12l2 2 4-4m6-1a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                        </div>


                        <div className="relative mt-3 grid gap-2 sm:grid-cols-2">

                            <div className="rounded-xl border border-white/70 bg-white/60 px-3 py-2.5">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    Enrolment
                                </p>

                                <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold capitalize text-emerald-700">
                                    {enrolment?.status ||
                                        "Unknown"}
                                </span>
                            </div>


                            <div className="rounded-xl border border-white/70 bg-white/60 px-3 py-2.5">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    Payment
                                </p>

                                <span
                                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-[9px] font-bold capitalize ${
                                        enrolment?.payment_status ===
                                        "paid"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                    }`}
                                >
                                    {enrolment?.payment_status ||
                                        "Unknown"}
                                </span>
                            </div>

                        </div>


                        {enrolment?.business_name && (
                            <div className="relative mt-2 rounded-xl border border-white/70 bg-white/60 px-3 py-2.5">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                                    Registered Business
                                </p>

                                <p className="mt-0.5 truncate text-[11px] font-bold text-slate-900">
                                    {enrolment.business_name}
                                </p>
                            </div>
                        )}


                        <button
                            onClick={() =>
                                navigate(
                                    "/provider/enrolment"
                                )
                            }
                            className="relative mt-3 w-full rounded-xl bg-slate-900 py-2 text-[10px] font-bold text-white transition hover:bg-blue-700"
                        >
                            View Enrolment
                        </button>

                    </div>


                    {/* Quick Actions */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-white/95 via-slate-200/90 to-blue-100/90 p-4 shadow-xl backdrop-blur-xl">

                        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-blue-300/30 blur-3xl" />

                        <div className="relative">
                            <h2 className="text-sm font-bold text-slate-900">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-[10px] text-slate-500">
                                Quickly access the areas you use most.
                            </p>
                        </div>


                        <div className="relative mt-3 grid grid-cols-2 gap-2">

                            {/* Requests */}
                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="rounded-xl border border-white/70 bg-white/60 p-2.5 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M9 5h6M9 9h6M9 13h4M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                            />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-[10px] font-bold text-slate-900">
                                            Requests
                                        </h3>

                                        <p className="truncate text-[8px] text-slate-500">
                                            Manage requests
                                        </p>
                                    </div>

                                </div>
                            </button>


                            {/* Messages */}
                            <button
                                onClick={() =>
                                    navigate("/messages")
                                }
                                className="rounded-xl border border-white/70 bg-white/60 p-2.5 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M21 11.5a8.5 8.5 0 01-9 8.5 9.2 9.2 0 01-4.5-1.2L3 20l1.2-4.5A8.5 8.5 0 1111.5 20"
                                            />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-[10px] font-bold text-slate-900">
                                            Messages
                                        </h3>

                                        <p className="truncate text-[8px] text-slate-500">
                                            Customer messages
                                        </p>
                                    </div>

                                </div>
                            </button>


                            {/* Profile */}
                            <button
                                onClick={() =>
                                    profile?.id &&
                                    navigate(
                                        `/providers/${profile.id}`
                                    )
                                }
                                className="rounded-xl border border-white/70 bg-white/60 p-2.5 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M20 21a8 8 0 00-16 0M12 13a4 4 0 100-8 4 4 0 000 8z"
                                            />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-[10px] font-bold text-slate-900">
                                            Profile
                                        </h3>

                                        <p className="truncate text-[8px] text-slate-500">
                                            View your profile
                                        </p>
                                    </div>

                                </div>
                            </button>


                            {/* Reviews */}
                            <button
                                onClick={() =>
                                    profile?.id &&
                                    navigate(
                                        `/providers/${profile.id}/reviews`
                                    )
                                }
                                className="rounded-xl border border-white/70 bg-white/60 p-2.5 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"
                                            />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-[10px] font-bold text-slate-900">
                                            Reviews
                                        </h3>

                                        <p className="truncate text-[8px] text-slate-500">
                                            Customer feedback
                                        </p>
                                    </div>

                                </div>
                            </button>

                        </div>
                    </div>

                </section>

            </div>
        </div>
    );
}

export default ProviderDashboard;

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
                return "border-amber-300/30 bg-amber-400/15 text-amber-100";

            case "accepted":
                return "border-emerald-300/30 bg-emerald-400/15 text-emerald-100";

            case "completed":
                return "border-blue-300/30 bg-blue-300/20 text-blue-100";

            case "rejected":
                return "border-red-300/30 bg-red-400/15 text-red-100";

            default:
                return "border-white/20 bg-white/10 text-white/70";
        }
    };


    if (loading) {
        return (
            <div
                className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center p-6"
                style={{
                    backgroundImage: "url('/images/dashboard.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-[2px]" />

                <div className="relative rounded-2xl border border-white/20 bg-white/10 px-8 py-7 text-center shadow-2xl backdrop-blur-2xl">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />

                    <p className="mt-4 text-sm font-medium text-white/80">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div
                className="relative min-h-screen overflow-hidden bg-cover bg-center p-4 sm:p-6 lg:p-8"
                style={{
                    backgroundImage: "url('/images/dashboard.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-blue-950/70" />

                <div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl">
                    <h2 className="font-semibold text-red-200">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm text-white/70">
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                        className="mt-4 rounded-lg border border-white/20 bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }


    if (!enrolment) {
        return (
            <div
                className="relative min-h-screen overflow-hidden bg-cover bg-center p-4 sm:p-6 lg:p-8"
                style={{
                    backgroundImage: "url('/images/dashboard.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-blue-950/65" />

                <div className="relative mx-auto max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-blue-500/20 text-blue-100">
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

                    <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-200">
                        Provider Registration
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Complete Your Enrolment
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/65">
                        Before you can receive and manage service
                        requests, you need to complete your provider
                        enrolment.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/provider/enrolment")
                        }
                        className="mt-7 rounded-lg border border-blue-300/30 bg-blue-500/80 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                    >
                        Complete Enrolment
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div
            className="relative min-h-screen overflow-hidden bg-cover bg-center bg-fixed p-3 sm:p-4 md:p-5 lg:p-6"
            style={{
                backgroundImage: "url('/images/dashboard.jpg')",
            }}
        >
            {/* Background overlay */}
            <div className="fixed inset-0 -z-0 bg-blue-950/65" />

            {/* Soft blue glow */}
            <div className="fixed -left-32 top-20 -z-0 h-80 w-80 rounded-full " />
            <div className="fixed -right-32 bottom-10 -z-0 h-96 w-96 rounded-full" />

            <div className="relative z-10 mx-auto w-full max-w-[1700px]">

                {/* Header */}
                <section className="mb-5">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                                    Welcome back
                                </p>

                                <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-white sm:text-3xl">
                                    {profile?.business_name ||
                                        username ||
                                        "Provider"}
                                </h1>

                                <p className="mt-1 max-w-2xl text-xs text-white/65 sm:text-sm">
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
                                className="w-full rounded-xl border border-blue-300/20 bg-blue-500/70 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 sm:w-auto"
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
                        className="group rounded-2xl border border-white/20 bg-white/10 p-4 text-left shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                            Total Requests
                        </p>

                        <p className="mt-1 text-3xl font-black text-white">
                            {requests.length}
                        </p>

                        <div className="mt-2 h-1 w-12 rounded-full bg-blue-400" />
                    </button>


                    {/* Pending */}
                    <button
                        onClick={() =>
                            navigate(
                                "/provider/service-requests"
                            )
                        }
                        className="group rounded-2xl border border-white/20 bg-white/10 p-4 text-left shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                            Pending
                        </p>

                        <p className="mt-1 text-3xl font-black text-white">
                            {pendingRequests.length}
                        </p>

                        <div className="mt-2 h-1 w-12 rounded-full bg-amber-300" />
                    </button>


                    {/* Accepted */}
                    <button
                        onClick={() =>
                            navigate(
                                "/provider/service-requests"
                            )
                        }
                        className="group rounded-2xl border border-white/20 bg-white/10 p-4 text-left shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                            Accepted
                        </p>

                        <p className="mt-1 text-3xl font-black text-white">
                            {acceptedRequests.length}
                        </p>

                        <div className="mt-2 h-1 w-12 rounded-full bg-emerald-300" />
                    </button>


                    {/* Conversations */}
                    <button
                        onClick={() =>
                            navigate("/messages")
                        }
                        className="group rounded-2xl border border-white/20 bg-white/10 p-4 text-left shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                            Conversations
                        </p>

                        <p className="mt-1 text-3xl font-black text-white">
                            {conversations.length}
                        </p>

                        <div className="mt-2 h-1 w-12 rounded-full bg-cyan-300" />
                    </button>

                </section>


                {/* Main Dashboard Grid */}
                <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">

                    {/* Request Activity */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl lg:col-span-2">

                        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-400/20 blur-3xl" />

                        <div className="relative flex items-start justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-white sm:text-base">
                                    Request Activity
                                </h2>

                                <p className="mt-1 text-[10px] text-white/55 sm:text-xs">
                                    Current service request breakdown
                                </p>
                            </div>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-blue-500/30 text-blue-100">
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
                                                    stopColor="#60a5fa"
                                                />

                                                <stop
                                                    offset="50%"
                                                    stopColor="#38bdf8"
                                                />

                                                <stop
                                                    offset="100%"
                                                    stopColor="#2563eb"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <path
                                            d="M 20 110 A 90 90 0 0 1 200 110"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.15)"
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
                                        <p className="text-2xl font-black text-white">
                                            {activityPercentage}%
                                        </p>

                                        <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200">
                                            Active
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-0.5 text-[10px] text-white/55">
                                    {activeRequests} of{" "}
                                    {requests.length} requests
                                </p>
                            </div>


                            {/* Breakdown */}
                            <div className="space-y-2">

                                <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-amber-300" />

                                        <span className="text-[10px] font-medium text-white/70">
                                            Pending
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-white">
                                        {requestPercentage(
                                            pendingRequests.length
                                        )}
                                        %
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-300" />

                                        <span className="text-[10px] font-medium text-white/70">
                                            Accepted
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-white">
                                        {requestPercentage(
                                            acceptedRequests.length
                                        )}
                                        %
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-blue-300" />

                                        <span className="text-[10px] font-medium text-white/70">
                                            Completed
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-white">
                                        {requestPercentage(
                                            completedRequests.length
                                        )}
                                        %
                                    </span>
                                </div>


                                <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-300" />

                                        <span className="text-[10px] font-medium text-white/70">
                                            Rejected
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-bold text-white">
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
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">

                        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-400/20 blur-3xl" />

                        <div className="relative flex items-center justify-between border-b border-white/15 px-3.5 py-3">

                            <div>
                                <h2 className="text-xs font-bold text-white sm:text-sm">
                                    Recent Requests
                                </h2>

                                <p className="mt-0.5 text-[9px] text-white/50">
                                    Latest customer activity
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="text-[10px] font-bold text-blue-200 transition hover:text-white"
                            >
                                View all
                            </button>
                        </div>


                        {requests.length === 0 ? (
                            <div className="px-3 py-8 text-center">
                                <p className="text-xs font-semibold text-white">
                                    No requests yet
                                </p>

                                <p className="mt-1 text-[10px] text-white/50">
                                    New requests will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="relative divide-y divide-white/10">
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
                                            className="w-full px-3.5 py-2.5 text-left transition hover:bg-white/10"
                                        >
                                            <div className="flex items-start justify-between gap-2">

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-[11px] font-bold text-white">
                                                        {request.service_title}
                                                    </h3>

                                                    <p className="mt-0.5 truncate text-[9px] text-white/55">
                                                        {request.customer}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-[9px] text-white/40">
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

                                            <p className="mt-1 text-[8px] text-white/35">
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
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">

                        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-400/20 blur-3xl" />

                        <div className="relative flex items-center justify-between border-b border-white/15 px-3.5 py-3">

                            <div>
                                <h2 className="text-xs font-bold text-white sm:text-sm">
                                    Recent Profile
                                </h2>

                                <p className="mt-0.5 text-[9px] text-white/50">
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
                                className="text-[10px] font-bold text-blue-200 transition hover:text-white"
                            >
                                View
                            </button>
                        </div>


                        <div className="relative space-y-2.5 p-3.5">

                            <div className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Business
                                </p>

                                <p className="mt-0.5 truncate text-[11px] font-bold text-white">
                                    {profile?.business_name ||
                                        "Not available"}
                                </p>
                            </div>


                            <div className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Category
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-white/70">
                                    {profile?.service_category ||
                                        "Not available"}
                                </p>
                            </div>


                            <div className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Location
                                </p>

                                <p className="mt-0.5 truncate text-[11px] text-white/70">
                                    {profile?.location ||
                                        "Not available"}
                                </p>
                            </div>


                            <div className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-2">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Experience
                                </p>

                                <p className="mt-0.5 text-[11px] text-white/70">
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
                                className="w-full rounded-lg border border-blue-300/20 bg-blue-500/70 py-2 text-[10px] font-bold text-white shadow-lg transition hover:bg-blue-500"
                            >
                                Manage Profile
                            </button>

                        </div>
                    </div>

                </section>


                {/* Provider Enrolment + Quick Actions */}
                <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

                    {/* Provider Enrolment */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">

                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />

                        <div className="relative flex items-center justify-between">

                            <div>
                                <h2 className="text-sm font-bold text-white">
                                    Provider Enrolment
                                </h2>

                                <p className="mt-1 text-[10px] text-white/50">
                                    Your FixIt provider account
                                </p>
                            </div>

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-blue-500/30 text-blue-100">
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

                            <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Enrolment
                                </p>

                                <span className="mt-1 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/15 px-2 py-1 text-[9px] font-bold capitalize text-emerald-100">
                                    {enrolment?.status ||
                                        "Unknown"}
                                </span>
                            </div>


                            <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Payment
                                </p>

                                <span
                                    className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[9px] font-bold capitalize ${
                                        enrolment?.payment_status ===
                                        "paid"
                                            ? "border-emerald-300/20 bg-emerald-400/15 text-emerald-100"
                                            : "border-amber-300/20 bg-amber-400/15 text-amber-100"
                                    }`}
                                >
                                    {enrolment?.payment_status ||
                                        "Unknown"}
                                </span>
                            </div>

                        </div>


                        {enrolment?.business_name && (
                            <div className="relative mt-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Registered Business
                                </p>

                                <p className="mt-0.5 truncate text-[11px] font-bold text-white">
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
                            className="relative mt-3 w-full rounded-xl border border-white/10 bg-blue-500/70 py-2 text-[10px] font-bold text-white transition hover:bg-blue-500"
                        >
                            View Enrolment
                        </button>

                    </div>


                    {/* Quick Actions */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">

                        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />

                        <div className="relative">
                            <h2 className="text-sm font-bold text-white">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-[10px] text-white/50">
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
                                className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/20 text-blue-200">
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
                                        <h3 className="truncate text-[10px] font-bold text-white">
                                            Requests
                                        </h3>

                                        <p className="truncate text-[8px] text-white/50">
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
                                className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/20 text-blue-200">
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
                                        <h3 className="truncate text-[10px] font-bold text-white">
                                            Messages
                                        </h3>

                                        <p className="truncate text-[8px] text-white/50">
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
                                className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/20 text-blue-200">
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
                                        <h3 className="truncate text-[10px] font-bold text-white">
                                            Profile
                                        </h3>

                                        <p className="truncate text-[8px] text-white/50">
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
                                className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-2">

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/20 text-blue-200">
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
                                        <h3 className="truncate text-[10px] font-bold text-white">
                                            Reviews
                                        </h3>

                                        <p className="truncate text-[8px] text-white/50">
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getMyProvider,
} from "../../services/providerService";

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

            const enrolmentData =
                await getMyProviderEnrolment();

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


    const activeRequests =
        pendingRequests.length +
        acceptedRequests.length;


    const requestPercentage = (count) => {
        if (requests.length === 0) {
            return 0;
        }

        return Math.round(
            (count / requests.length) * 100
        );
    };


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


    if (loading) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-4 text-sm text-slate-500">
                        Loading your dashboard...
                    </p>

                </div>

            </div>
        );
    }


    if (error) {
        return (
            <div className="p-5 sm:p-8">

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">

                    <h2 className="font-semibold text-red-800">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    if (!enrolment) {
        return (
            <div className="p-5 sm:p-8">

                <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

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
        <div className="p-5 sm:p-8">

            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <section className="mb-7">

                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

                    <div>

                        <p className="text-sm font-semibold text-blue-600">
                            Welcome back
                        </p>


                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {profile?.business_name ||
                                username ||
                                "Provider"}
                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
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
                        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        View Service Requests
                    </button>

                </div>

            </section>


            {/* =====================================================
                STATISTICS
            ====================================================== */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


                {/* Total */}

                <button
                    onClick={() =>
                        navigate(
                            "/provider/service-requests"
                        )
                    }
                    className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Requests
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {requests.length}
                            </p>

                        </div>


                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">

                            <svg
                                className="h-5 w-5"
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

                    </div>


                    <p className="mt-4 text-xs text-slate-400">
                        All customer requests
                    </p>

                </button>


                {/* Pending */}

                <button
                    onClick={() =>
                        navigate(
                            "/provider/service-requests"
                        )
                    }
                    className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Pending
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {pendingRequests.length}
                            </p>

                        </div>


                        <div className="rounded-lg bg-amber-50 p-3 text-amber-600">

                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                        </div>

                    </div>


                    <p className="mt-4 text-xs text-slate-400">
                        Awaiting your response
                    </p>

                </button>


                {/* Accepted */}

                <button
                    onClick={() =>
                        navigate(
                            "/provider/service-requests"
                        )
                    }
                    className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Accepted
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {acceptedRequests.length}
                            </p>

                        </div>


                        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">

                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>

                        </div>

                    </div>


                    <p className="mt-4 text-xs text-slate-400">
                        Requests you accepted
                    </p>

                </button>


                {/* Conversations */}

                <button
                    onClick={() =>
                        navigate("/messages")
                    }
                    className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Conversations
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {conversations.length}
                            </p>

                        </div>


                        <div className="rounded-lg bg-violet-50 p-3 text-violet-600">

                            <svg
                                className="h-5 w-5"
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

                    </div>


                    <p className="mt-4 text-xs text-slate-400">
                        Customer conversations
                    </p>

                </button>

            </section>


            {/* =====================================================
                RECENT REQUESTS + PROFILE
            ====================================================== */}

            <section className="mt-6 grid gap-6 xl:grid-cols-3">


                {/* Recent requests */}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Recent Service Requests
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Your latest customer activity
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    "/provider/service-requests"
                                )
                            }
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            View all
                        </button>

                    </div>


                    {requests.length === 0 ? (

                        <div className="px-6 py-14 text-center">

                            <p className="font-semibold text-slate-900">
                                No service requests yet
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Customer requests will appear here
                                when they become available.
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-slate-100">

                            {requests
                                .slice(0, 5)
                                .map((request) => (

                                    <button
                                        key={request.id}
                                        onClick={() =>
                                            navigate(
                                                "/provider/service-requests"
                                            )
                                        }
                                        className="flex w-full flex-col gap-3 px-6 py-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                    >

                                        <div className="min-w-0">

                                            <h3 className="truncate text-sm font-semibold text-slate-900">
                                                {request.service_title}
                                            </h3>


                                            <p className="mt-1 text-xs text-slate-500">
                                                Customer:{" "}
                                                {request.customer}
                                            </p>


                                            <p className="mt-1 text-xs text-slate-400">
                                                {request.location}
                                                {" • "}
                                                {formatDate(
                                                    request.created_at
                                                )}
                                            </p>

                                        </div>


                                        <span
                                            className={`
                                                self-start
                                                rounded-full
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                capitalize
                                                ${
                                                    request.status ===
                                                    "pending"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : request.status ===
                                                          "accepted"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : request.status ===
                                                              "rejected"
                                                                ? "bg-red-50 text-red-700"
                                                                : "bg-slate-100 text-slate-600"
                                                }
                                            `}
                                        >
                                            {request.status}
                                        </span>

                                    </button>

                                ))}

                        </div>

                    )}

                </div>


                {/* Business profile */}

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Business Profile
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Your provider information
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                profile?.id &&
                                navigate(
                                    `/providers/${profile.id}`
                                )
                            }
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            View
                        </button>

                    </div>


                    <div className="space-y-5 p-6">

                        <div>

                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Business Name
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {profile?.business_name ||
                                    "Not available"}
                            </p>

                        </div>


                        <div>

                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Service Category
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {profile?.service_category ||
                                    "Not available"}
                            </p>

                        </div>


                        <div>

                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Location
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {profile?.location ||
                                    "Not available"}
                            </p>

                        </div>


                        <div>

                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Experience
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
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
                            className="w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Manage Profile
                        </button>

                    </div>

                </div>

            </section>


            {/* =====================================================
                ACTIVITY + ENROLMENT
            ====================================================== */}

            <section className="mt-6 grid gap-6 lg:grid-cols-2">


                {/* Request activity */}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Request Activity
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Current request breakdown
                            </p>

                        </div>


                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">

                            <svg
                                className="h-5 w-5"
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


                    <div className="mt-7 space-y-5">

                        {/* Pending */}

                        <div>

                            <div className="mb-2 flex justify-between text-sm">

                                <span className="text-slate-600">
                                    Pending
                                </span>

                                <span className="font-semibold text-slate-900">
                                    {pendingRequests.length}
                                </span>

                            </div>


                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="h-full rounded-full bg-amber-400"
                                    style={{
                                        width: `${requestPercentage(
                                            pendingRequests.length
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>


                        {/* Accepted */}

                        <div>

                            <div className="mb-2 flex justify-between text-sm">

                                <span className="text-slate-600">
                                    Accepted
                                </span>

                                <span className="font-semibold text-slate-900">
                                    {acceptedRequests.length}
                                </span>

                            </div>


                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{
                                        width: `${requestPercentage(
                                            acceptedRequests.length
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>


                        {/* Completed */}

                        <div>

                            <div className="mb-2 flex justify-between text-sm">

                                <span className="text-slate-600">
                                    Completed
                                </span>

                                <span className="font-semibold text-slate-900">
                                    {completedRequests.length}
                                </span>

                            </div>


                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="h-full rounded-full bg-blue-500"
                                    style={{
                                        width: `${requestPercentage(
                                            completedRequests.length
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>


                        {/* Rejected */}

                        <div>

                            <div className="mb-2 flex justify-between text-sm">

                                <span className="text-slate-600">
                                    Rejected
                                </span>

                                <span className="font-semibold text-slate-900">
                                    {rejectedRequests.length}
                                </span>

                            </div>


                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="h-full rounded-full bg-red-400"
                                    style={{
                                        width: `${requestPercentage(
                                            rejectedRequests.length
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* Enrolment */}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="font-semibold text-slate-900">
                                Provider Enrolment
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Your FixIt provider account
                            </p>

                        </div>


                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">

                            <svg
                                className="h-5 w-5"
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


                    <div className="mt-7 rounded-xl bg-slate-50 p-5">

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-500">
                                Enrolment status
                            </span>

                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700">
                                {enrolment?.status ||
                                    "Unknown"}
                            </span>

                        </div>


                        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">

                            <span className="text-sm text-slate-500">
                                Payment status
                            </span>

                            <span
                                className={`
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    capitalize
                                    ${
                                        enrolment?.payment_status ===
                                        "paid"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                    }
                                `}
                            >
                                {enrolment?.payment_status ||
                                    "Unknown"}
                            </span>

                        </div>


                        {enrolment?.business_name && (
                            <div className="mt-5 border-t border-slate-200 pt-5">

                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    Registered Business
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {enrolment.business_name}
                                </p>

                            </div>
                        )}

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/provider/enrolment"
                            )
                        }
                        className="mt-5 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        View Enrolment
                    </button>

                </div>

            </section>


            {/* =====================================================
                QUICK ACTIONS
            ====================================================== */}

            <section className="mt-6 pb-8">

                <div className="mb-4">

                    <h2 className="font-semibold text-slate-900">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Quickly access the areas you use most.
                    </p>

                </div>


                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                    <button
                        onClick={() =>
                            navigate(
                                "/provider/service-requests"
                            )
                        }
                        className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                            <svg
                                className="h-5 w-5"
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


                        <h3 className="mt-4 font-semibold text-slate-900">
                            Manage Requests
                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Review and respond to customer requests.
                        </p>

                    </button>


                    <button
                        onClick={() =>
                            navigate("/messages")
                        }
                        className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">

                            <svg
                                className="h-5 w-5"
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


                        <h3 className="mt-4 font-semibold text-slate-900">
                            Messages
                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Communicate with your customers.
                        </p>

                    </button>


                    <button
                        onClick={() =>
                            profile?.id &&
                            navigate(
                                `/providers/${profile.id}`
                            )
                        }
                        className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

                            <svg
                                className="h-5 w-5"
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


                        <h3 className="mt-4 font-semibold text-slate-900">
                            My Profile
                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            View your public provider profile.
                        </p>

                    </button>


                    <button
                        onClick={() =>
                            profile?.id &&
                            navigate(
                                `/providers/${profile.id}/reviews`
                            )
                        }
                        className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">

                            <svg
                                className="h-5 w-5"
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


                        <h3 className="mt-4 font-semibold text-slate-900">
                            My Reviews
                        </h3>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            See feedback from your customers.
                        </p>

                    </button>

                </div>

            </section>

        </div>
    );
}

export default ProviderDashboard;
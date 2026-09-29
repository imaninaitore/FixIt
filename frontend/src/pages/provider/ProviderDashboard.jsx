import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getMyProvider } from "../../services/providerService";
import { getProviderServiceRequests } from "../../services/serviceRequestService";
import { getConversations } from "../../services/messagingService";
import { getMyProviderEnrolment } from "../../services/providerEnrolmentService";

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
            setRequests(requestsData);
            setConversations(conversationsData);

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

    return (
        <main className="min-h-screen bg-slate-950">

            <Navbar />

            {/* Hero */}
            <section
                className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-slate-950/40"></div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/25 to-slate-950/45"></div>

                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-24 lg:px-10">

                    <div className="w-full">

                        {/* Loading */}
                        {loading && (
                            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
                                <p className="text-white/80">
                                    Loading your provider dashboard...
                                </p>
                            </div>
                        )}


                        {/* Error */}
                        {!loading && error && (
                            <div className="max-w-2xl rounded-2xl border border-red-300/30 bg-red-500/10 p-8 text-red-100 backdrop-blur-xl">
                                <h2 className="text-xl font-semibold">
                                    Something went wrong
                                </h2>

                                <p className="mt-2">
                                    {error}
                                </p>
                            </div>
                        )}


                        {/* No enrolment */}
                        {!loading && !error && !enrolment && (
                            <div className="mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-10 text-center backdrop-blur-xl">

                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
                                    Provider Registration
                                </p>

                                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                                    Complete Your Enrolment
                                </h1>

                                <p className="mx-auto mt-5 max-w-xl leading-7 text-white/70">
                                    Before you can receive and manage service
                                    requests, you need to complete your
                                    provider enrolment.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/provider/enrolment")
                                    }
                                    className="mt-8 rounded-lg bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-blue-600"
                                >
                                    Complete Enrolment
                                </button>

                            </div>
                        )}


                        {/* Provider dashboard */}
                        {!loading && !error && enrolment && (
                            <>

                                {/* Hero content */}
                                <div className="max-w-3xl">

                                    <p className="mb-7 text-base font-medium text-blue-300">
                                        Welcome back
                                        {profile?.business_name
                                            ? `, ${profile.business_name}`
                                            : username
                                                ? `, ${username}`
                                                : ""}
                                    </p>

                                    <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-blue-300">
                                        Provider Dashboard
                                    </p>

                                    <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                                        Manage Your
                                        <span className="block text-blue-400">
                                            FixIt Business
                                        </span>
                                    </h1>

                                    <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                                        Manage customer requests, communicate
                                        with customers, maintain your profile,
                                        and keep track of your FixIt activity
                                        from one place.
                                    </p>

                                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/provider/service-requests"
                                                )
                                            }
                                            className="rounded-lg bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
                                        >
                                            View Service Requests
                                        </button>

                                        <button
                                            onClick={() =>
                                                profile?.id &&
                                                navigate(
                                                    `/providers/${profile.id}`
                                                )
                                            }
                                            className="rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                                        >
                                            View My Profile
                                        </button>

                                    </div>

                                </div>


                                {/* Glass feature cards */}
                                <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                                    {/* Service Requests */}
                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/provider/service-requests"
                                            )
                                        }
                                        className="group rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20"
                                    >
                                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/80 text-white">

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
                                                    d="M9 5h6M9 9h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                />
                                            </svg>

                                        </div>

                                        <h3 className="text-lg font-semibold text-white">
                                            Service Requests
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/65">
                                            View and respond to customer requests.
                                        </p>

                                        <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                            Manage requests →
                                        </span>
                                    </button>


                                    {/* Messages */}
                                    <button
                                        onClick={() =>
                                            navigate("/messages")
                                        }
                                        className="group rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20"
                                    >
                                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">

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
                                                    d="M21 11.5a8.38 8.38 0 01-9 8.5 9.17 9.17 0 01-4.5-1.2L3 20l1.2-4.5A8.38 8.38 0 013 11.5 8.5 8.5 0 1111.5 20"
                                                />
                                            </svg>

                                        </div>

                                        <h3 className="text-lg font-semibold text-white">
                                            Messages
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/65">
                                            Communicate directly with customers.
                                        </p>

                                        <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                            Open messages →
                                        </span>
                                    </button>


                                    {/* Profile */}
                                    <button
                                        onClick={() =>
                                            profile?.id &&
                                            navigate(
                                                `/providers/${profile.id}`
                                            )
                                        }
                                        className="group rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20"
                                    >
                                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">

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
                                                    d="M15 19a4 4 0 00-8 0M11 11a4 4 0 100-8 4 4 0 000 8zm6 8a4 4 0 00-4-4"
                                                />
                                            </svg>

                                        </div>

                                        <h3 className="text-lg font-semibold text-white">
                                            My Profile
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/65">
                                            Manage your public provider profile.
                                        </p>

                                        <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                            View profile →
                                        </span>
                                    </button>


                                    {/* Reviews */}
                                    <button
                                        onClick={() =>
                                            profile?.id &&
                                            navigate(
                                                `/providers/${profile.id}/reviews`
                                            )
                                        }
                                        className="group rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20"
                                    >
                                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">

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

                                        <h3 className="text-lg font-semibold text-white">
                                            My Reviews
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/65">
                                            See feedback from your customers.
                                        </p>

                                        <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                            View reviews →
                                        </span>
                                    </button>


                                    {/* Enrolment */}
                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/provider/enrolment"
                                            )
                                        }
                                        className="group rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20"
                                    >
                                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">

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

                                        <h3 className="text-lg font-semibold text-white">
                                            Enrolment
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-white/65">
                                            View your provider enrolment details.
                                        </p>

                                        <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                            View enrolment →
                                        </span>
                                    </button>

                                </div>

                            </>
                        )}

                    </div>
                </div>
            </section>


            {/* Statistics */}
            {!loading && !error && enrolment && (
                <section className="bg-slate-100 py-16">

                    <div className="mx-auto max-w-7xl px-6 lg:px-10">

                        <div className="mb-8">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                                Business Overview
                            </p>

                            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                                Your FixIt Activity
                            </h2>
                        </div>


                        <div className="grid gap-5 md:grid-cols-3">

                            {/* Pending */}
                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <p className="text-sm font-medium text-slate-500">
                                    Pending Requests
                                </p>

                                <p className="mt-2 text-4xl font-semibold text-slate-900">
                                    {pendingRequests.length}
                                </p>

                                <p className="mt-4 text-sm font-medium text-blue-600">
                                    View requests →
                                </p>
                            </button>


                            {/* Accepted */}
                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <p className="text-sm font-medium text-slate-500">
                                    Accepted Requests
                                </p>

                                <p className="mt-2 text-4xl font-semibold text-slate-900">
                                    {acceptedRequests.length}
                                </p>

                                <p className="mt-4 text-sm font-medium text-blue-600">
                                    Manage requests →
                                </p>
                            </button>


                            {/* Conversations */}
                            <button
                                onClick={() =>
                                    navigate("/messages")
                                }
                                className="rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <p className="text-sm font-medium text-slate-500">
                                    Conversations
                                </p>

                                <p className="mt-2 text-4xl font-semibold text-slate-900">
                                    {conversations.length}
                                </p>

                                <p className="mt-4 text-sm font-medium text-blue-600">
                                    View messages →
                                </p>
                            </button>

                        </div>

                    </div>

                </section>
            )}


            {/* Recent requests */}
            {!loading && !error && enrolment && (
                <section className="bg-slate-100 pb-20">

                    <div className="mx-auto max-w-7xl px-6 lg:px-10">

                        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                            <div>
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                                    Customer Activity
                                </p>

                                <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                                    Recent Service Requests
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                            >
                                View all requests →
                            </button>

                        </div>


                        {requests.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                                <h3 className="text-xl font-semibold text-slate-900">
                                    No service requests yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-lg text-slate-600">
                                    Customer requests will appear here when
                                    they are available for your services.
                                </p>

                            </div>
                        ) : (
                            <div className="grid gap-5 lg:grid-cols-2">

                                {requests.slice(0, 5).map((request) => (

                                    <div
                                        key={request.id}
                                        className="rounded-2xl border border-white/60 bg-white/75 p-6 shadow-lg shadow-slate-200/60 backdrop-blur-xl"
                                    >

                                        <div className="flex flex-col justify-between gap-5 sm:flex-row">

                                            <div>

                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {request.service_title}
                                                </h3>

                                                <p className="mt-2 text-sm text-slate-600">
                                                    Customer:{" "}
                                                    {request.customer}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-600">
                                                    Location:{" "}
                                                    {request.location}
                                                </p>

                                            </div>


                                            <span
                                                className={`self-start rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                                                    request.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : request.status === "accepted"
                                                            ? "bg-green-100 text-green-800"
                                                            : request.status === "rejected"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-slate-100 text-slate-700"
                                                }`}
                                            >
                                                {request.status}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                    </div>

                </section>
            )}


            {/* Final CTA */}
            {!loading && !error && enrolment && (
                <section className="bg-slate-950 py-20">

                    <div className="mx-auto max-w-5xl px-6 text-center">

                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
                            Grow your FixIt presence
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Keep your customers connected.
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-white/60">
                            Manage requests, communicate with customers,
                            and keep your provider profile up to date.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                            <button
                                onClick={() =>
                                    navigate(
                                        "/provider/service-requests"
                                    )
                                }
                                className="rounded-lg bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                                Manage Requests
                            </button>

                            <button
                                onClick={() =>
                                    profile?.id &&
                                    navigate(
                                        `/providers/${profile.id}`
                                    )
                                }
                                className="rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
                            >
                                View My Profile
                            </button>

                        </div>

                    </div>

                </section>
            )}


            <Footer />

        </main>
    );
}

export default ProviderDashboard;
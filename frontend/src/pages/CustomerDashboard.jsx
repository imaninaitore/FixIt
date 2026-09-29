import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getServiceRequests } from "../services/serviceRequestService";

function CustomerDashboard() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");

    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            setError(
                err.message ||
                "Failed to load your dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const pendingRequests = serviceRequests.filter(
        (request) => request.status === "pending"
    );

    return (
        <main className="min-h-screen bg-slate-950">
            <Navbar />

            {/* Hero section */}
            <section
                className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                {/* Background overlay */}
                <div className="absolute inset-0 bg-slate-950/35"></div>

                {/* Soft glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-slate-950/40"></div>

                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-24 lg:px-10">
                    <div className="w-full">

                        {/* Welcome */}
                        <div className="max-w-3xl">

                            {username && (
                                <div className="mb-7">
                                    <p className="text-base font-medium text-blue-300">
                                        Welcome back, {username}
                                    </p>
                                </div>
                            )}

                            {/* Small heading */}
                            <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-blue-300">
                                Your FixIt Dashboard
                            </p>

                            {/* Main heading */}
                            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                                Everything You Need
                                <span className="block text-blue-400">
                                    In One Place
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                                Find trusted professionals, manage your
                                service requests, communicate with providers,
                                and keep track of your FixIt activity.
                            </p>

                            {/* Main CTA buttons */}
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                                <button
                                    onClick={() => navigate("/providers")}
                                    className="rounded-lg bg-blue-500 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
                                >
                                    Find a Provider
                                </button>

                                <button
                                    onClick={() => navigate("/create-service-request")}
                                    className="rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 text-center text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                                >
                                    Create a Request
                                </button>

                            </div>

                        </div>

                        {/* Feature cards */}
                        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                            {/* Providers */}
                            <button
                                onClick={() => navigate("/providers")}
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
                                            d="M21 21l-4.35-4.35m2.35-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-lg font-semibold text-white">
                                    Find Providers
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-white/65">
                                    Browse trusted professionals available on FixIt.
                                </p>

                                <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                    Explore →
                                </span>
                            </button>


                            {/* Requests */}
                            <button
                                onClick={() => navigate("/service-requests")}
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
                                            d="M9 5h6M9 9h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-lg font-semibold text-white">
                                    My Requests
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-white/65">
                                    View and manage your service requests.
                                </p>

                                <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                    View requests →
                                </span>
                            </button>


                            {/* Messages */}
                            <button
                                onClick={() => navigate("/messages")}
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
                                    Communicate directly with providers.
                                </p>

                                <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                    Open messages →
                                </span>
                            </button>


                            {/* Reviews */}
                            <button
                                onClick={() => navigate("/reviews")}
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
                                    Reviews
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-white/65">
                                    Review providers after completed services.
                                </p>

                                <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                    My reviews →
                                </span>
                            </button>


                            {/* Profile */}
                            <button
                                onClick={() => navigate("/profile")}
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
                                    Manage your FixIt account details.
                                </p>

                                <span className="mt-4 inline-block text-sm font-medium text-blue-300 transition group-hover:text-blue-200">
                                    View profile →
                                </span>
                            </button>

                        </div>

                    </div>
                </div>
            </section>


            {/* Pending requests */}
            <section className="relative overflow-hidden bg-slate-100 py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">

                    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                                Your activity
                            </p>

                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                                Pending Requests
                            </h2>

                            <p className="mt-2 max-w-xl text-slate-600">
                                Keep track of service requests that are
                                currently waiting for a provider's response.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/service-requests")}
                            className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                        >
                            View all requests →
                        </button>

                    </div>


                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                            <p className="text-slate-600">
                                Loading your requests...
                            </p>
                        </div>
                    )}


                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                            {error}
                        </div>
                    )}


                    {!loading && !error && pendingRequests.length === 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                            <h3 className="text-xl font-semibold text-slate-900">
                                No pending requests
                            </h3>

                            <p className="mx-auto mt-2 max-w-lg text-slate-600">
                                You don't currently have any pending service
                                requests. Find a provider when you need help.
                            </p>

                            <button
                                onClick={() => navigate("/providers")}
                                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Find a Provider
                            </button>

                        </div>
                    )}


                    {!loading && !error && pendingRequests.length > 0 && (
                        <div className="grid gap-5 lg:grid-cols-2">

                            {pendingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-slate-200/60 backdrop-blur-xl"
                                >

                                    <div className="flex flex-col justify-between gap-5 sm:flex-row">

                                        <div>

                                            <div className="mb-3 flex items-center gap-3">
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {request.service_title}
                                                </h3>

                                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                                                    Pending
                                                </span>
                                            </div>

                                            <p className="text-sm leading-6 text-slate-600">
                                                {request.description}
                                            </p>

                                            <div className="mt-5 space-y-2 text-sm text-slate-600">

                                                <p>
                                                    <span className="font-semibold text-slate-800">
                                                        Provider:
                                                    </span>{" "}
                                                    {request.provider ||
                                                        "Waiting for provider"}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-slate-800">
                                                        Location:
                                                    </span>{" "}
                                                    {request.location}
                                                </p>

                                                <p>
                                                    <span className="font-semibold text-slate-800">
                                                        Preferred date:
                                                    </span>{" "}
                                                    {request.preferred_date}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </div>
            </section>


            {/* Final CTA */}
            <section className="bg-slate-950 py-20">
                <div className="mx-auto max-w-5xl px-6 text-center">

                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
                        Need something fixed?
                    </p>

                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Find the right professional for the job.
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-white/60">
                        Browse trusted providers or create a service request
                        and let FixIt help you get started.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                        <button
                            onClick={() => navigate("/providers")}
                            className="rounded-lg bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                        >
                            Find a Provider
                        </button>

                        <button
                            onClick={() => navigate("/create-service-request")}
                            className="rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
                        >
                            Create a Request
                        </button>

                    </div>

                </div>
            </section>


            <Footer />
        </main>
    );
}

export default CustomerDashboard;
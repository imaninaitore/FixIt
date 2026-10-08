import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ClipboardList,
    Clock3,
    CheckCircle2,
    Search,
    PlusCircle,
    ArrowRight,
} from "lucide-react";

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
                err.message || "Failed to load your dashboard."
            );
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

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/service-requests/create")
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9B99B]/50 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-[#D9B99B]/20"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Create a Request
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard overview */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-10">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#6B7280]">
                                    Total Requests
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#172A46]">
                                    {totalRequests}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172A46]/10">
                                <ClipboardList className="h-5 w-5 text-[#172A46]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#6B7280]">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#172A46]">
                                    {pendingRequests.length}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2D8CC]">
                                <Clock3 className="h-5 w-5 text-[#C66A4A]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#6B7280]">
                                    Accepted
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#172A46]">
                                    {acceptedRequests.length}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9B99B]/25">
                                <CheckCircle2 className="h-5 w-5 text-[#C66A4A]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#D9C2AD] bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#6B7280]">
                                    Completed
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#172A46]">
                                    {completedRequests.length}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C66A4A]/10">
                                <CheckCircle2 className="h-5 w-5 text-[#C66A4A]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pending requests */}
            <section className="bg-[#FFFDF9] py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
                    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C66A4A]">
                                Your activity
                            </p>

                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172A46]">
                                Pending Requests
                            </h2>

                            <p className="mt-2 max-w-xl text-[#536070]">
                                Keep track of service requests that are
                                currently waiting for a provider's response.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/service-requests")}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C66A4A] transition hover:text-[#172A46]"
                        >
                            View all requests
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    {loading && (
                        <div className="rounded-2xl border border-[#D9C2AD] bg-[#F4EDE5] p-8">
                            <p className="text-[#536070]">
                                Loading your requests...
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        pendingRequests.length === 0 && (
                            <div className="rounded-3xl border border-[#D9C2AD] bg-[#F4EDE5] p-8 text-center sm:p-10">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172A46]/10">
                                    <ClipboardList className="h-6 w-6 text-[#172A46]" />
                                </div>

                                <h3 className="mt-5 text-xl font-semibold text-[#172A46]">
                                    No pending requests
                                </h3>

                                <p className="mx-auto mt-2 max-w-lg text-[#536070]">
                                    You don't currently have any pending
                                    service requests. Find a provider when
                                    you need help.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate("/providers")}
                                    className="mt-6 rounded-xl bg-[#172A46] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#C66A4A]"
                                >
                                    Find a Provider
                                </button>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        pendingRequests.length > 0 && (
                            <div className="grid gap-5 lg:grid-cols-2">
                                {pendingRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="rounded-2xl border border-[#D9C2AD] bg-[#F4EDE5] p-5 shadow-sm sm:p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-xl font-semibold text-[#172A46]">
                                                        {request.service_title}
                                                    </h3>

                                                    <span className="rounded-full bg-[#F2D8CC] px-3 py-1 text-xs font-semibold text-[#C66A4A]">
                                                        Pending
                                                    </span>
                                                </div>

                                                <p className="mt-3 text-sm leading-6 text-[#536070]">
                                                    {request.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-2 text-sm text-[#536070]">
                                            <p>
                                                <span className="font-semibold text-[#172A46]">
                                                    Provider:
                                                </span>{" "}
                                                {request.provider ||
                                                    "Waiting for provider"}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#172A46]">
                                                    Location:
                                                </span>{" "}
                                                {request.location}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-[#172A46]">
                                                    Preferred date:
                                                </span>{" "}
                                                {request.preferred_date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </section>

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

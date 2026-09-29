import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    MessageSquare,
    Plus,
    Star,
    XCircle,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getServiceRequests } from "../../services/serviceRequestService";

function ServiceRequests() {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        loadServiceRequests();
    }, []);

    async function loadServiceRequests() {
        try {
            setLoading(true);
            setError("");

            const data = await getServiceRequests();

            setServiceRequests(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load your service requests.");
        } finally {
            setLoading(false);
        }
    }

    function getStatusStyles(status) {
        switch (status) {
            case "pending":
                return {
                    icon: Clock3,
                    container:
                        "bg-amber-50 text-amber-700 border-amber-200",
                    label: "Pending",
                };

            case "accepted":
                return {
                    icon: CheckCircle2,
                    container:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    label: "Accepted",
                };

            case "completed":
                return {
                    icon: CheckCircle2,
                    container:
                        "bg-blue-50 text-blue-700 border-blue-200",
                    label: "Completed",
                };

            case "rejected":
                return {
                    icon: XCircle,
                    container:
                        "bg-red-50 text-red-700 border-red-200",
                    label: "Rejected",
                };

            default:
                return {
                    icon: Clock3,
                    container:
                        "bg-slate-50 text-slate-600 border-slate-200",
                    label: status,
                };
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#071426] via-[#0d2b50] to-[#1769aa]">

                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"></div>

                <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"></div>

                <div className="relative mx-auto max-w-6xl px-6 py-14 lg:px-8">

                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

                        <div className="max-w-2xl">

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur-sm">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Your activity
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                My Service{" "}
                                <span className="text-blue-300">
                                    Requests
                                </span>
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-base">
                                Keep track of the services you have requested,
                                monitor their progress, and stay connected
                                with your service providers.
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/service-requests/create")
                            }
                            className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition duration-200 hover:scale-[1.02] hover:from-blue-400 hover:to-cyan-300"
                        >
                            <Plus className="h-4 w-4" />
                            Create Request
                        </button>

                    </div>

                </div>
            </section>


            {/* Main content */}
            <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="text-center">

                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

                            <p className="mt-4 text-sm text-slate-500">
                                Loading your service requests...
                            </p>

                        </div>

                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-7 shadow-sm">

                        <h2 className="font-semibold text-red-800">
                            Unable to load service requests
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            onClick={loadServiceRequests}
                            className="mt-5 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:from-red-700 hover:to-red-600"
                        >
                            Try Again
                        </button>

                    </div>
                )}


                {/* Empty state */}
                {!loading &&
                    !error &&
                    serviceRequests.length === 0 && (
                        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-blue-100/60 px-6 py-20 text-center shadow-sm">

                            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-200/30 blur-3xl"></div>

                            <div className="relative">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-200">
                                    <MessageSquare className="h-7 w-7" />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                                    No service requests yet
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                                    You haven't submitted a service request.
                                    Find a professional and create your first
                                    request when you're ready.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/providers")
                                    }
                                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-cyan-600"
                                >
                                    Find a Provider
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                            </div>

                        </div>
                    )}


                {/* Requests */}
                {!loading &&
                    !error &&
                    serviceRequests.length > 0 && (
                        <div className="space-y-6">

                            {serviceRequests.map((request) => {

                                const status =
                                    getStatusStyles(request.status);

                                const StatusIcon = status.icon;

                                return (
                                    <article
                                        key={request.id}
                                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                                    >

                                        {/* Gradient accent */}
                                        <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400"></div>


                                        {/* Request header */}
                                        <div className="border-b border-slate-100 px-6 py-6 sm:px-7">

                                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                                <div className="flex items-start gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md shadow-blue-100">
                                                        <MessageSquare className="h-5 w-5" />
                                                    </div>

                                                    <div>

                                                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                                                            Service Request
                                                        </p>

                                                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                                                            {request.service_title}
                                                        </h2>

                                                    </div>

                                                </div>


                                                <span
                                                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold ${status.container}`}
                                                >
                                                    <StatusIcon className="h-3.5 w-3.5" />

                                                    {status.label}
                                                </span>

                                            </div>

                                        </div>


                                        {/* Details */}
                                        <div className="px-6 py-7 sm:px-7">

                                            <p className="max-w-4xl text-sm leading-7 text-slate-600">
                                                {request.description}
                                            </p>


                                            {/* Information */}
                                            <div className="mt-7 grid gap-3 md:grid-cols-3">

                                                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

                                                    <div className="flex items-center gap-2">

                                                        <MapPin className="h-4 w-4 text-blue-600" />

                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Location
                                                        </p>

                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-slate-700">
                                                        {request.location}
                                                    </p>

                                                </div>


                                                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

                                                    <div className="flex items-center gap-2">

                                                        <CalendarDays className="h-4 w-4 text-blue-600" />

                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Preferred Date
                                                        </p>

                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-slate-700">
                                                        {request.preferred_date}
                                                    </p>

                                                </div>


                                                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">

                                                    <div className="flex items-center gap-2">

                                                        <Clock3 className="h-4 w-4 text-blue-600" />

                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Created
                                                        </p>

                                                    </div>

                                                    <p className="mt-2 text-sm font-semibold text-slate-700">
                                                        {new Date(
                                                            request.created_at
                                                        ).toLocaleDateString()}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Review */}
                                            {request.status === "completed" &&
                                                request.provider_user_id && (
                                                    <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/providers/${request.provider_user_id}/reviews/create?request=${request.id}`
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:from-blue-700 hover:to-cyan-600"
                                                        >
                                                            <Star className="h-4 w-4" />
                                                            Leave Review
                                                        </button>

                                                    </div>
                                                )}

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

            </main>

            <Footer />

        </div>
    );
}

export default ServiceRequests;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Briefcase,
    CheckCircle,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
} from "lucide-react";

import { getProvider } from "../../services/providerService";
import { createConversation } from "../../services/messagingService";

function ProviderProfile() {
    const { providerId } = useParams();
    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProvider();
    }, [providerId]);

    async function loadProvider() {
        try {
            setLoading(true);
            setError("");

            const data = await getProvider(providerId);

            setProvider(data);
        } catch (err) {
            setError(err.message || "Failed to load provider profile.");
        } finally {
            setLoading(false);
        }
    }

    async function handleMessageProvider() {
        try {
            const data = await createConversation(provider.user);

            const conversation = data.conversation || data;

            navigate(`/messages/${conversation.id}`);
        } catch (err) {
            console.error(err);

            alert(
                err.message ||
                "Failed to start conversation."
            );
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>

                    <p className="mt-5 text-sm font-medium text-slate-600">
                        Loading provider profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <span className="text-xl font-bold text-red-500">
                            !
                        </span>
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-slate-900">
                        Unable to load profile
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/providers")}
                        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Back to Providers
                    </button>
                </div>
            </div>
        );
    }

    if (!provider) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <section
                className="relative overflow-hidden bg-slate-950 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/mountain.jpg')",
                }}
            >

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-slate-950/75"></div>

                {/* Blue overlay */}
                <div className="absolute inset-0 bg-blue-950/20"></div>

                <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 lg:px-10">

                    {/* Back button */}
                    <button
                        onClick={() => navigate("/providers")}
                        className="mb-10 flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />

                        Back to providers
                    </button>

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                        {/* Provider identity */}
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                            {/* Provider initial */}
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-4xl font-bold text-white shadow-xl shadow-black/30">
                                {provider.business_name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>

                                <div className="mb-3 flex flex-wrap items-center gap-3">

                                    <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200 backdrop-blur-sm">
                                        Service Provider
                                    </span>

                                    <span
                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                            provider.is_available
                                                ? "border border-green-400/20 bg-green-500/15 text-green-300"
                                                : "border border-slate-500/20 bg-slate-700/60 text-slate-300"
                                        }`}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>

                                        {provider.is_available
                                            ? "Available"
                                            : "Currently unavailable"}
                                    </span>

                                </div>

                                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                    {provider.business_name}
                                </h1>

                                <p className="mt-3 text-lg text-slate-200">
                                    {provider.service_category}
                                </p>

                            </div>
                        </div>

                        {/* Experience / location summary */}
                        <div className="flex items-center gap-8 rounded-2xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-md">

                            <div>
                                <p className="text-3xl font-bold text-white">
                                    {provider.years_of_experience || 0}
                                </p>

                                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-300">
                                    Years experience
                                </p>
                            </div>

                            <div className="h-12 w-px bg-white/20"></div>

                            <div>
                                <div className="flex items-center gap-2">

                                    <MapPin className="h-4 w-4 text-blue-300" />

                                    <p className="text-sm font-semibold text-white">
                                        {provider.location ||
                                            "Location not provided"}
                                    </p>

                                </div>

                                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Service area
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Main information */}
                    <div className="space-y-8 lg:col-span-2">

                        {/* About */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        About this provider
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Learn more about their services
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-6">

                                <p className="text-[15px] leading-8 text-slate-600">
                                    {provider.description ||
                                        "This provider has not added a description yet."}
                                </p>

                            </div>

                        </section>

                        {/* Experience */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Experience
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Professional background
                                    </p>
                                </div>

                            </div>

                            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div className="rounded-2xl bg-slate-50 p-6">

                                    <p className="text-4xl font-bold text-blue-600">
                                        {provider.years_of_experience || 0}
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-slate-600">
                                        Years of experience
                                    </p>

                                </div>

                                <div className="rounded-2xl bg-slate-50 p-6">

                                    <p className="text-lg font-bold text-slate-900">
                                        {provider.service_category}
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-slate-600">
                                        Primary service
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* Service area */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Service area
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Where this provider operates
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 rounded-xl bg-slate-50 p-5">

                                <p className="font-medium text-slate-800">
                                    {provider.location ||
                                        "Location not provided"}
                                </p>

                            </div>

                        </section>

                    </div>

                    {/* Right column */}
                    <aside className="lg:col-span-1">

                        <div className="space-y-6 lg:sticky lg:top-6">

                            {/* Provider details */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

                                <h2 className="text-xl font-bold text-slate-900">
                                    Provider details
                                </h2>

                                <div className="mt-6 space-y-6">

                                    {/* Location */}
                                    <div className="flex gap-4">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-800">
                                                {provider.location ||
                                                    "Not provided"}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-4">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                            <Phone className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Phone
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-800">
                                                {provider.phone_number ||
                                                    "Not provided"}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Availability */}
                                    <div className="flex gap-4">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                            <CheckCircle className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Availability
                                            </p>

                                            <p
                                                className={`mt-1 text-sm font-semibold ${
                                                    provider.is_available
                                                        ? "text-green-600"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {provider.is_available
                                                    ? "Available for work"
                                                    : "Currently unavailable"}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            </section>

                            {/* Action card */}
                            <section className="overflow-hidden rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">

                                <div className="p-7">

                                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
                                        Ready to get started?
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-white">
                                        Need this service?
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-blue-100">
                                        Send a service request or contact the
                                        provider directly through FixIt.
                                    </p>

                                    <div className="mt-6 space-y-3">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/service-requests/create?provider=${provider.user}`
                                                )
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                                        >
                                            <Briefcase className="h-4 w-4" />

                                            Send Service Request
                                        </button>

                                        <button
                                            onClick={handleMessageProvider}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-blue-700/30 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            <MessageCircle className="h-4 w-4" />

                                            Message Provider
                                        </button>

                                    </div>
                                </div>
                            </section>

                            {/* Trust information */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">

                                <div className="flex gap-4">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                                        <ShieldCheck className="h-5 w-5 text-green-600" />
                                    </div>

                                    <div>

                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Find services with confidence
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Use FixIt to communicate with
                                            providers and manage your service
                                            requests in one place.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default ProviderProfile;
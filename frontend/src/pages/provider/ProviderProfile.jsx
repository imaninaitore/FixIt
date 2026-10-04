import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
            setError(
                err.message ||
                    "Failed to load provider profile."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleMessageProvider() {
    try {
        const data = await createConversation(provider.user);

        const conversation =
            data.conversation || data;

        navigate(`/messages/${conversation.id}`);
    } catch (err) {
        console.error(err);

        const message = err.message?.toLowerCase() || "";

        if (
            message.includes("authentication") ||
            message.includes("credentials") ||
            message.includes("token") ||
            message.includes("unauthorized")
        ) {
            navigate("/login");
            return;
        }

        alert(
            err.message ||
            "Failed to start conversation."
        );
    }
}
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">
                    <p className="text-sm text-slate-500">
                        Loading provider profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!provider) {
        return null;
    }

    const profileImage =
        provider.profile_image || null;

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="bg-slate-900 px-5 py-7 sm:px-7 lg:px-8">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={
                                            provider.business_name ||
                                            "Provider"
                                        }
                                        className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-white/10"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-semibold text-white ring-4 ring-white/10">
                                        {(
                                            provider.business_name ||
                                            "P"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="break-words text-2xl font-semibold text-white sm:text-3xl">
                                            {provider.business_name ||
                                                "Provider"}
                                        </h1>

                                        {provider.is_verified && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-200">
                                                <ShieldCheck
                                                    size={14}
                                                />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                                        <Briefcase size={16} />
                                        {provider.service_category ||
                                            "Service Provider"}
                                    </p>

                                    {provider.location && (
                                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                                            <MapPin size={16} />
                                            {provider.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7 lg:p-8">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    About this provider
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {provider.description ||
                                        "This provider has not added a description yet."}
                                </p>
                            </div>

                            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Briefcase
                                            size={17}
                                            className="text-blue-600"
                                        />
                                        Experience
                                    </div>

                                    <p className="mt-2 text-sm text-slate-600">
                                        {provider.years_of_experience ??
                                            0}{" "}
                                        years
                                    </p>
                                </div>

                                <div className="border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <MapPin
                                            size={17}
                                            className="text-blue-600"
                                        />
                                        Location
                                    </div>

                                    <p className="mt-2 text-sm text-slate-600">
                                        {provider.location ||
                                            "Not provided"}
                                    </p>
                                </div>

                                <div className="border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Phone
                                            size={17}
                                            className="text-blue-600"
                                        />
                                        Phone
                                    </div>

                                    <p className="mt-2 break-words text-sm text-slate-600">
                                        {provider.phone_number ||
                                            "Not provided"}
                                    </p>
                                </div>

                                <div className="border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <CheckCircle
                                            size={17}
                                            className={
                                                provider.is_available
                                                    ? "text-green-600"
                                                    : "text-slate-400"
                                            }
                                        />
                                        Availability
                                    </div>

                                    <p className="mt-2 text-sm text-slate-600">
                                        {provider.is_available
                                            ? "Available"
                                            : "Currently unavailable"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="h-fit">
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Need this service?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Contact this provider or send them a
                                service request.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/service-requests/create?provider=${provider.user}`
                                    )
                                }
                                className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Send Service Request
                            </button>

                            <button
                                onClick={handleMessageProvider}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <MessageCircle size={18} />
                                Message Provider
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default ProviderProfile;

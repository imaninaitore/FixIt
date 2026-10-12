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
                err.message || "Failed to load provider profile."
            );
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

            alert(err.message || "Failed to start conversation.");
        }
    }

    if (loading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-6"
                style={{
                    backgroundImage: "url('/images/tools.jpg')",
                }}
            >
                <div className="rounded-xl border border-white/40 bg-[#FFFDF9]/75 px-5 py-4 shadow-lg backdrop-blur-lg">
                    <p className="text-sm font-medium text-[#172A46]">
                        Loading provider profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-6 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: "url('/images/tools.jpg')",
                }}
            >
                <div className="mx-auto max-w-5xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-5 flex items-center gap-2 rounded-lg border border-white/40 bg-[#FFFDF9]/75 px-3.5 py-2 text-sm font-medium text-[#172A46] shadow-sm backdrop-blur-lg transition hover:bg-[#FFFDF9] hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <div className="rounded-xl border border-red-200/70 bg-[#FFFDF9]/85 p-4 text-sm text-red-700 shadow-lg backdrop-blur-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!provider) {
        return null;
    }

    const profileImage = provider.profile_image || null;

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/tools.jpg')",
            }}
        >
            <div className="min-h-screen bg-[#172A46]/10">
                <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center gap-2 rounded-lg border border-white/50 bg-[#FFFDF9]/75 px-3.5 py-2 text-sm font-medium text-[#172A46] shadow-sm backdrop-blur-lg transition hover:bg-[#FFFDF9] hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_270px]">
                        {/* Main Profile */}
                        <section className="overflow-hidden rounded-xl border border-white/50 bg-[#FFFDF9]/70 shadow-xl backdrop-blur-lg">
                            {/* Profile Header */}
                            <div className="border-b border-white/15 bg-[#172A46]/90 px-4 py-5 sm:px-5 sm:py-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={
                                                provider.business_name ||
                                                "Provider"
                                            }
                                            className="h-20 w-20 shrink-0 rounded-full object-cover shadow-md ring-2 ring-[#C66A4A]/70"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#C66A4A] text-2xl font-semibold text-[#FFFDF9] shadow-md ring-2 ring-white/30">
                                            {(
                                                provider.business_name || "P"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="break-words text-xl font-semibold text-[#FFFDF9] sm:text-2xl">
                                                {provider.business_name ||
                                                    "Provider"}
                                            </h1>

                                            {provider.is_verified && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-[#C66A4A]/50 bg-[#C66A4A]/20 px-2 py-1 text-xs font-medium text-[#F2D8CC]">
                                                    <ShieldCheck size={14} />
                                                    Verified
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 flex items-start gap-2 text-sm text-[#F4EDE5]">
                                            <Briefcase
                                                size={15}
                                                className="mt-0.5 shrink-0 text-[#E5A48B]"
                                            />
                                            <span>
                                                {provider.service_category ||
                                                    "Service Provider"}
                                            </span>
                                        </p>

                                        {provider.location && (
                                            <p className="mt-1 flex items-start gap-2 text-sm text-[#F4EDE5]">
                                                <MapPin
                                                    size={15}
                                                    className="mt-0.5 shrink-0 text-[#E5A48B]"
                                                />
                                                <span className="break-words">
                                                    {provider.location}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="space-y-4 p-4 sm:p-5">
                                <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-4 shadow-sm backdrop-blur-sm">
                                    <h2 className="text-base font-semibold text-[#172A46]">
                                        About this provider
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-[#43516A]">
                                        {provider.description ||
                                            "This provider has not added a description yet."}
                                    </p>
                                </div>

                                {/* Provider Details */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {/* Experience */}
                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <Briefcase
                                                size={16}
                                                className="shrink-0 text-[#C66A4A]"
                                            />
                                            Experience
                                        </div>

                                        <p className="mt-1.5 text-sm text-[#43516A]">
                                            {provider.years_of_experience ?? 0}{" "}
                                            years
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <MapPin
                                                size={16}
                                                className="shrink-0 text-[#C66A4A]"
                                            />
                                            Location
                                        </div>

                                        <p className="mt-1.5 break-words text-sm text-[#43516A]">
                                            {provider.location ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <Phone
                                                size={16}
                                                className="shrink-0 text-[#C66A4A]"
                                            />
                                            Phone
                                        </div>

                                        <p className="mt-1.5 break-words text-sm text-[#43516A]">
                                            {provider.phone_number ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    {/* Availability */}
                                    <div className="rounded-lg border border-white/60 bg-[#FFFDF9]/65 p-3.5 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172A46]">
                                            <CheckCircle
                                                size={16}
                                                className={
                                                    provider.is_available
                                                        ? "shrink-0 text-[#54816C]"
                                                        : "shrink-0 text-slate-500"
                                                }
                                            />
                                            Availability
                                        </div>

                                        <p className="mt-1.5 text-sm text-[#43516A]">
                                            {provider.is_available
                                                ? "Available"
                                                : "Currently unavailable"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Action Card */}
                        <aside className="min-w-0 lg:sticky lg:top-5">
                            <div className="rounded-xl border border-white/50 bg-[#FFFDF9]/75 p-4 shadow-xl backdrop-blur-lg sm:p-5">
                                <h2 className="text-base font-semibold text-[#172A46]">
                                    Need this service?
                                </h2>

                                <p className="mt-2 text-sm leading-5 text-[#43516A]">
                                    Contact this provider or send them a
                                    service request.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/service-requests/create?provider=${provider.id}`
                                        )
                                    }
                                    className="mt-4 w-full rounded-lg bg-[#C66A4A] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#AD563A] focus:outline-none focus:ring-2 focus:ring-[#C66A4A]/50 focus:ring-offset-2"
                                >
                                    Send Service Request
                                </button>

                                <button
                                    onClick={handleMessageProvider}
                                    className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#172A46]/20 bg-[#F4EDE5]/80 px-3.5 py-2.5 text-sm font-semibold text-[#172A46] transition hover:border-[#C66A4A]/50 hover:bg-[#F2D8CC]/70 hover:text-[#8E432E] focus:outline-none focus:ring-2 focus:ring-[#C66A4A]/40"
                                >
                                    <MessageCircle size={17} />
                                    Message Provider
                                </button>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ProviderProfile;

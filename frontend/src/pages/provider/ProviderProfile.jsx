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

            const message =
                err.message?.toLowerCase() || "";

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
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-cover
                    bg-center
                    bg-no-repeat
                    px-4
                "
                style={{
                    backgroundImage:
                        "url('/images/tools.png')",
                }}
            >
                <div
                    className="
                        rounded-2xl
                        border
                        border-white/30
                        bg-white/25
                        px-6
                        py-5
                        shadow-xl
                        backdrop-blur-md
                    "
                >
                    <p className="text-sm font-medium text-slate-700">
                        Loading provider profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="
                    min-h-screen
                    bg-cover
                    bg-center
                    bg-no-repeat
                    px-4
                    py-8
                    sm:px-6
                    lg:px-8
                "
                style={{
                    backgroundImage:
                        "url('/images/tools.png')",
                }}
            >
                <div className="mx-auto max-w-6xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="
                            mb-6
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/30
                            bg-white/25
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-slate-700
                            shadow-md
                            backdrop-blur-md
                            transition
                            hover:bg-white/40
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div
                        className="
                            rounded-2xl
                            border
                            border-red-300/40
                            bg-red-50/70
                            p-5
                            text-sm
                            text-red-700
                            shadow-xl
                            backdrop-blur-md
                        "
                    >
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
        <div
            className="
                min-h-screen
                bg-cover
                bg-center
                bg-no-repeat
            "
            style={{
                backgroundImage:
                    "url('/images/tools.png')",
            }}
        >
            <div className="min-h-screen bg-black/5">

                <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="
                            mb-6
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/30
                            bg-white/25
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-slate-700
                            shadow-md
                            backdrop-blur-md
                            transition
                            hover:bg-white/40
                            hover:text-blue-600
                        "
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

                        {/* Main Profile */}
                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/30
                                bg-white/20
                                shadow-2xl
                                backdrop-blur-md
                            "
                        >

                            {/* Profile Header */}
                            <div
                                className="
                                    border-b
                                    border-white/20
                                    bg-slate-950/75
                                    px-5
                                    py-7
                                    backdrop-blur-md
                                    sm:px-7
                                    lg:px-8
                                "
                            >
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={
                                                provider.business_name ||
                                                "Provider"
                                            }
                                            className="
                                                h-24
                                                w-24
                                                shrink-0
                                                rounded-full
                                                object-cover
                                                shadow-lg
                                                ring-4
                                                ring-white/20
                                            "
                                        />
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                h-24
                                                w-24
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-blue-600
                                                text-3xl
                                                font-semibold
                                                text-white
                                                shadow-lg
                                                ring-4
                                                ring-white/10
                                            "
                                        >
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
                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                        rounded-full
                                                        border
                                                        border-blue-400/30
                                                        bg-blue-500/20
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-blue-200
                                                    "
                                                >
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

                            {/* Profile Content */}
                            <div className="p-5 sm:p-7 lg:p-8">

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-white/30
                                        bg-white/25
                                        p-5
                                        shadow-sm
                                        backdrop-blur-sm
                                    "
                                >
                                    <h2 className="text-lg font-semibold text-slate-950">
                                        About this provider
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-slate-700">
                                        {provider.description ||
                                            "This provider has not added a description yet."}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* Experience */}
                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-white/30
                                            bg-white/30
                                            p-4
                                            shadow-sm
                                            backdrop-blur-sm
                                        "
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                            <Briefcase
                                                size={17}
                                                className="text-blue-600"
                                            />
                                            Experience
                                        </div>

                                        <p className="mt-2 text-sm text-slate-700">
                                            {provider.years_of_experience ??
                                                0}{" "}
                                            years
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-white/30
                                            bg-white/30
                                            p-4
                                            shadow-sm
                                            backdrop-blur-sm
                                        "
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                            <MapPin
                                                size={17}
                                                className="text-blue-600"
                                            />
                                            Location
                                        </div>

                                        <p className="mt-2 text-sm text-slate-700">
                                            {provider.location ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-white/30
                                            bg-white/30
                                            p-4
                                            shadow-sm
                                            backdrop-blur-sm
                                        "
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                            <Phone
                                                size={17}
                                                className="text-blue-600"
                                            />
                                            Phone
                                        </div>

                                        <p className="mt-2 break-words text-sm text-slate-700">
                                            {provider.phone_number ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                    {/* Availability */}
                                    <div
                                        className="
                                            rounded-xl
                                            border
                                            border-white/30
                                            bg-white/30
                                            p-4
                                            shadow-sm
                                            backdrop-blur-sm
                                        "
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                            <CheckCircle
                                                size={17}
                                                className={
                                                    provider.is_available
                                                        ? "text-green-600"
                                                        : "text-slate-500"
                                                }
                                            />
                                            Availability
                                        </div>

                                        <p className="mt-2 text-sm text-slate-700">
                                            {provider.is_available
                                                ? "Available"
                                                : "Currently unavailable"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Action Card */}
                        <aside className="h-fit">

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-white/30
                                    bg-white/25
                                    p-5
                                    shadow-2xl
                                    backdrop-blur-md
                                    sm:p-6
                                "
                            >
                                <h2 className="text-lg font-semibold text-slate-950">
                                    Need this service?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                    Contact this provider or send them a
                                    service request.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/service-requests/create?provider=${provider.user}`
                                        )
                                    }
                                    className="
                                        mt-5
                                        w-full
                                        rounded-xl
                                        bg-blue-600
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        transition
                                        hover:bg-blue-700
                                        hover:shadow-xl
                                    "
                                >
                                    Send Service Request
                                </button>

                                <button
                                    onClick={
                                        handleMessageProvider
                                    }
                                    className="
                                        mt-3
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/50
                                        bg-white/35
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                        shadow-sm
                                        backdrop-blur-sm
                                        transition
                                        hover:bg-white/55
                                        hover:text-blue-700
                                    "
                                >
                                    <MessageCircle size={18} />
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

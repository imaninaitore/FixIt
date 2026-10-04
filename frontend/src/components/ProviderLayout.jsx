import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getMyProvider } from "../services/providerService";
import { getProviderServiceRequests } from "../services/serviceRequestService";
import { logoutUser } from "../services/authService";
import { getConversations } from "../services/messagingService";

function ProviderLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username");

    const [profile, setProfile] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    


    useEffect(() => {
    loadProviderData();
    loadMessageCount();

    const interval = setInterval(() => {
        loadMessageCount();
    }, 10000);

    return () => clearInterval(interval);
}, []);


    const loadProviderData = async () => {
        try {
            const profileData = await getMyProvider();

            setProfile(profileData);
        } catch (error) {
            console.error("Failed to load provider profile:", error);
        }


        try {
            const requestsData = await getProviderServiceRequests();

            const pending = (requestsData || []).filter(
                (request) => request.status === "pending"
            );

            setPendingCount(pending.length);
        } catch (error) {
            console.error("Failed to load service request count:", error);
        }
    };


    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("username");

            navigate("/");
        }
    };


    const goTo = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };


    const isActive = (path) => {
        if (path === "/provider-dashboard") {
            return location.pathname === "/provider-dashboard";
        }

        return location.pathname.startsWith(path);
    };


    const profilePath = profile?.id
        ? `/providers/${profile.id}`
        : "/provider-dashboard";


    const reviewsPath = profile?.id
        ? `/providers/${profile.id}/reviews`
        : "/provider-dashboard";

    
    const loadMessageCount = async () => {
    try {
        const conversations = await getConversations();

        const totalUnread = (conversations || []).reduce(
            (total, conversation) =>
                total + (conversation.unread_count || 0),
            0
        );

        setMessageCount(totalUnread);
    } catch (error) {
        console.error(
            "Failed to load message notification count:",
            error
        );
    }
};    


    return (
        <div className="min-h-screen bg-slate-100">

            {/* Mobile overlay */}

            {mobileMenuOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
                />
            )}


            {/* =====================================================
                SIDEBAR
            ====================================================== */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    w-64
                    flex-col
                    bg-slate-950
                    text-white
                    transition-transform
                    duration-300
                    md:translate-x-0
                    ${
                        mobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* Logo */}

                <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">

                    <button
                        onClick={() => goTo("/provider-dashboard")}
                        className="text-left"
                    >
                        <h1 className="text-2xl font-bold tracking-tight">
                            Fix<span className="text-blue-500">It</span>
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Provider Portal
                        </p>
                    </button>


                    {/* Mobile close button */}

                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                </div>


                {/* =================================================
                    SCROLLABLE NAVIGATION
                ================================================== */}

                <div className="flex-1 overflow-y-auto px-4 py-6">

                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Main Menu
                    </p>


                    <nav className="space-y-1">

                        {/* Dashboard */}

                        <button
                            onClick={() =>
                                goTo("/provider-dashboard")
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-3
                                text-sm
                                font-medium
                                transition
                                ${
                                    isActive("/provider-dashboard")
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >

                            <svg
                                className="h-5 w-5 shrink-0"
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

                            <span>Dashboard</span>

                        </button>


                        {/* Service Requests */}

                        <button
                            onClick={() =>
                                goTo("/provider/service-requests")
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-3
                                text-sm
                                font-medium
                                transition
                                ${
                                    isActive("/provider/service-requests")
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >

                            <svg
                                className="h-5 w-5 shrink-0"
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

                            <span>Service Requests</span>


                            {pendingCount > 0 && (
                                <span
                                    className={`
                                        ml-auto
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center
                                        rounded-full
                                        px-1.5
                                        text-[10px]
                                        font-bold
                                        ${
                                            isActive(
                                                "/provider/service-requests"
                                            )
                                                ? "bg-white text-blue-600"
                                                : "bg-blue-600 text-white"
                                        }
                                    `}
                                >
                                    {pendingCount}
                                </span>
                            )}

                        </button>


                        {/* Messages */}

                        <button
                            onClick={() => goTo("/messages")}
                            className={`
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-3
                                text-sm
                                font-medium
                                transition
                                ${
                                    isActive("/messages")
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >

                            <svg
                                className="h-5 w-5 shrink-0"
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

                            <span>Messages</span>

{messageCount > 0 && (
    <span
        className={`
            ml-auto
            flex
            h-5
            min-w-5
            items-center
            justify-center
            rounded-full
            px-1.5
            text-[10px]
            font-bold
            ${
                isActive("/messages")
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
            }
        `}
    >
        {messageCount > 99 ? "99+" : messageCount}
    </span>
)}

                        </button>


                       {/* My Profile */}

<button
    onClick={() => goTo("/provider/profile")}
    className={`
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-3
        text-sm
        font-medium
        transition
        ${
            location.pathname === "/provider/profile"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
        }
    `}
>
    <svg
        className="h-5 w-5 shrink-0"
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

    <span>My Profile</span>
</button>


                        {/* Reviews */}

                        <button
                            onClick={() => goTo(reviewsPath)}
                            className={`
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-3
                                text-sm
                                font-medium
                                transition
                                ${
                                    location.pathname.includes("/reviews")
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >

                            <svg
                                className="h-5 w-5 shrink-0"
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

                            <span>Reviews</span>

                        </button>


                        {/* Enrolment */}

                        <button
                            onClick={() =>
                                goTo("/provider/enrolment")
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-3
                                text-sm
                                font-medium
                                transition
                                ${
                                    isActive("/provider/enrolment")
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >

                            <svg
                                className="h-5 w-5 shrink-0"
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

                            <span>Enrolment</span>

                        </button>

                    </nav>


                    {/* General */}

                    <p className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        General
                    </p>


                    <nav>

                        <button
                            onClick={() => goTo("/")}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >

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
                                    d="M3 10.5L12 3l9 7.5M5 9v11h14V9"
                                />
                            </svg>

                            <span>Back to Home</span>

                        </button>

                    </nav>

                </div>


                {/* =================================================
                    USER / LOGOUT
                ================================================== */}

                <div className="shrink-0 border-t border-white/10 p-4">

                    <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 p-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">

                            {(profile?.business_name ||
                                username ||
                                "P"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-white">
                                {profile?.business_name ||
                                    username ||
                                    "Provider"}
                            </p>

                            <p className="text-xs text-slate-500">
                                Service Provider
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >

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
                                d="M10 17l5-5-5-5M15 12H3m12-7h4a2 2 0 012 2v10a2 2 0 01-2 2h-4"
                            />
                        </svg>

                        <span>Logout</span>

                    </button>

                </div>

            </aside>


            {/* =====================================================
                MAIN PAGE AREA
            ====================================================== */}

            <div className="min-h-screen md:ml-64">

                {/* Top bar */}

                <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">

                    <div className="flex h-full items-center justify-between px-5 sm:px-8">

                        {/* Mobile menu */}

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>


                        <div className="hidden md:block">

                            <p className="text-xs text-slate-400">
                                FixIt Provider Portal
                            </p>

                            <p className="text-sm font-semibold text-slate-800">
                                {profile?.business_name ||
                                    "Provider Dashboard"}
                            </p>

                        </div>


                        {/* Right side */}

                        <div className="ml-auto flex items-center gap-4">

                            <button
                                onClick={() => goTo("/messages")}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >

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

                            </button>


                            <div className="h-8 w-px bg-slate-200" />


                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">

                                    {(profile?.business_name ||
                                        username ||
                                        "P"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>


                                <div className="hidden sm:block">

                                    <p className="max-w-48 truncate text-sm font-semibold text-slate-800">
                                        {profile?.business_name ||
                                            username ||
                                            "Provider"}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Provider
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    SCROLLABLE CONTENT
                ================================================== */}

                <main className="min-h-[calc(100vh-4rem)] overflow-x-hidden">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default ProviderLayout;
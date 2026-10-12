import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getMyProvider } from "../services/providerService";
import { getProviderServiceRequests } from "../services/serviceRequestService";
import { logoutUser } from "../services/authService";
import { getConversations } from "../services/messagingService";
import { getMyProviderEnrolment } from "../services/providerEnrolmentService";

function ProviderLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username");

    const [profile, setProfile] = useState(null);
    const [enrolment, setEnrolment] = useState(null);

    const [pendingCount, setPendingCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        return (
            localStorage.getItem("providerSidebarCollapsed") === "true"
        );
    });

    const [providerStateLoading, setProviderStateLoading] = useState(true);

    useEffect(() => {
        loadProviderData();
    }, []);

    useEffect(() => {
        if (providerStateLoading || enrolment?.status !== "approved") {
            return;
        }

        loadMessageCount();

        const interval = setInterval(() => {
            loadMessageCount();
        }, 10000);

        return () => clearInterval(interval);
    }, [providerStateLoading, enrolment?.status]);

    useEffect(() => {
        if (providerStateLoading) {
            return;
        }

        /*
         * Allow the dashboard to show the enrolment-required
         * state when no enrolment exists.
         */
        if (!enrolment) {
            if (
                location.pathname !== "/provider/enrolment" &&
                location.pathname !== "/provider-dashboard"
            ) {
                navigate("/provider/enrolment", {
                    replace: true,
                });
            }

            return;
        }

        /*
         * Submitted applications go to the pending approval page.
         */
        if (enrolment.status === "submitted") {
            if (location.pathname !== "/provider/pending") {
                navigate("/provider/pending", {
                    replace: true,
                });
            }

            return;
        }

        /*
         * Rejected applications return to enrolment.
         */
        if (enrolment.status === "rejected") {
            if (location.pathname !== "/provider/enrolment") {
                navigate("/provider/enrolment", {
                    replace: true,
                });
            }

            return;
        }

        /*
         * Draft applications remain in the enrolment process.
         */
        if (enrolment.status === "draft") {
            if (location.pathname !== "/provider/enrolment") {
                navigate("/provider/enrolment", {
                    replace: true,
                });
            }
        }
    }, [
        providerStateLoading,
        enrolment,
        location.pathname,
        navigate,
    ]);

   
const loadProviderData = async () => {
    setProviderStateLoading(true);

    let enrolmentData;

    try {
        enrolmentData = await getMyProviderEnrolment();
        setEnrolment(enrolmentData);
    } catch (error) {
        console.error("Failed to load provider enrolment:", error);

        // Keep enrolment errors separate from profile and request errors.
        // Do not assume the provider has no enrolment when the request fails.
        setProviderStateLoading(false);
        return;
    }

    if (!enrolmentData) {
        setProfile(null);
        setPendingCount(0);
        setMessageCount(0);
        setProviderStateLoading(false);
        return;
    }

    if (enrolmentData.status !== "approved") {
        setProfile(null);
        setPendingCount(0);
        setMessageCount(0);
        setProviderStateLoading(false);
        return;
    }

    try {
        const [profileResult, requestsResult] = await Promise.allSettled([
            getMyProvider(),
            getProviderServiceRequests(),
        ]);

        if (profileResult.status === "fulfilled") {
            setProfile(profileResult.value);
        } else {
            console.error(
                "Failed to load provider profile:",
                profileResult.reason
            );
            setProfile(null);
        }

        if (requestsResult.status === "fulfilled") {
            const requestsData = requestsResult.value;

            const requests = Array.isArray(requestsData)
                ? requestsData
                : requestsData?.results || [];

            setPendingCount(
                requests.filter(
                    (request) => request.status === "pending"
                ).length
            );
        } else {
            console.error(
                "Failed to load provider service requests:",
                requestsResult.reason
            );
            setPendingCount(0);
        }
    } finally {
        setProviderStateLoading(false);
    }
};

    const loadMessageCount = async () => {
        try {
            const conversations = await getConversations();

            const items = Array.isArray(conversations)
                ? conversations
                : conversations?.results || [];

            const totalUnread = items.reduce(
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

    const toggleSidebar = () => {
        setSidebarCollapsed((current) => {
            const newState = !current;

            localStorage.setItem(
                "providerSidebarCollapsed",
                String(newState)
            );

            return newState;
        });
    };

    const isActive = (path) => {
        if (path === "/provider-dashboard") {
            return location.pathname === "/provider-dashboard";
        }

        return location.pathname.startsWith(path);
    };

    const reviewsPath = profile?.user
    ? `/providers/${profile.user}/reviews`
    : "/provider-dashboard";

    const sidebarWidth = sidebarCollapsed ? "md:w-20" : "md:w-64";
    const mainMargin = sidebarCollapsed ? "md:ml-20" : "md:ml-64";

    const activeLinkClasses =
        "bg-[#C66A4A] text-white shadow-sm shadow-black/10";

    const inactiveLinkClasses =
        "text-[#D7DCE5] hover:bg-white/10 hover:text-white";

    /*
     * Avoid briefly displaying the portal before the enrolment
     * status has been determined.
     */
    if (providerStateLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#172A46]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-[#C66A4A]" />

                    <p className="mt-4 text-sm text-[#D9B99B]">
                        Checking your provider account...
                    </p>
                </div>
            </div>
        );
    }

    if (enrolment?.status === "submitted") {
        return null;
    }

    if (
        enrolment?.status === "rejected" ||
        enrolment?.status === "draft"
    ) {
        return null;
    }

    if (
        !enrolment &&
        location.pathname !== "/provider-dashboard" &&
        location.pathname !== "/provider/enrolment"
    ) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F4EDE5]">
            {/* Mobile overlay */}

            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-[#172A46]/65 backdrop-blur-sm md:hidden"
                />
            )}

            {/* Sidebar */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    w-64
                    flex-col
                    border-r
                    border-white/10
                    bg-[#172A46]
                    text-white
                    shadow-xl
                    shadow-[#172A46]/10
                    transition-all
                    duration-300
                    md:translate-x-0
                    ${sidebarWidth}
                    ${
                        mobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* Logo / Sidebar header */}

                <div
                    className={`
                        relative
                        flex
                        h-20
                        shrink-0
                        items-center
                        border-b
                        border-white/10
                        ${
                            sidebarCollapsed
                                ? "justify-center px-3"
                                : "px-6"
                        }
                    `}
                >
                    <button
                        type="button"
                        onClick={() => goTo("/provider-dashboard")}
                        className="text-left"
                    >
                        {sidebarCollapsed ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C66A4A] text-lg font-bold text-white shadow-md shadow-black/10">
                                F
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    Fix
                                    <span className="text-[#D9B99B]">
                                        It
                                    </span>
                                </h1>

                                <p className="mt-1 text-xs tracking-wide text-[#D9B99B]">
                                    Provider Portal
                                </p>
                            </>
                        )}
                    </button>

                    {/* Desktop collapse button */}

                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label={
                            sidebarCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                        title={
                            sidebarCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                        className={`
                            hidden
                            rounded-lg
                            p-2
                            text-[#D9B99B]
                            transition
                            hover:bg-white/10
                            hover:text-white
                            md:block
                            ${
                                sidebarCollapsed
                                    ? "absolute right-[-14px] top-6 bg-[#172A46] shadow-md"
                                    : "ml-auto"
                            }
                        `}
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {sidebarCollapsed ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 5l-7 7 7 7"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Mobile close button */}

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close sidebar"
                        className="ml-auto rounded-lg p-2 text-[#D9B99B] transition hover:bg-white/10 hover:text-white md:hidden"
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

                {/* Scrollable navigation */}

                <div className="flex-1 overflow-y-auto px-3 py-6">
                    {!sidebarCollapsed && (
                        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9B99B]/75">
                            Main Menu
                        </p>
                    )}

                    <nav className="space-y-1">
                        {/* Dashboard */}

                        <button
                            type="button"
                            onClick={() => goTo("/provider-dashboard")}
                            title={
                                sidebarCollapsed ? "Dashboard" : undefined
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    sidebarCollapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
                                }
                                ${
                                    isActive("/provider-dashboard")
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
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

                            {!sidebarCollapsed && <span>Dashboard</span>}
                        </button>

                        {/* Service Requests */}

                        <button
                            type="button"
                            onClick={() =>
                                goTo("/provider/service-requests")
                            }
                            title={
                                sidebarCollapsed
                                    ? "Service Requests"
                                    : undefined
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    sidebarCollapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
                                }
                                ${
                                    isActive("/provider/service-requests")
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
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

                            {!sidebarCollapsed && (
                                <span>Service Requests</span>
                            )}

                            {pendingCount > 0 && (
                                <span
                                    className={`
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
                                            sidebarCollapsed
                                                ? "absolute ml-7 mt-[-18px] bg-[#C66A4A] text-white"
                                                : "ml-auto"
                                        }
                                        ${
                                            !sidebarCollapsed &&
                                            isActive(
                                                "/provider/service-requests"
                                            )
                                                ? "bg-white text-[#172A46]"
                                                : !sidebarCollapsed
                                                  ? "bg-[#D9B99B] text-[#172A46]"
                                                  : ""
                                        }
                                    `}
                                >
                                    {pendingCount > 99 ? "99+" : pendingCount}
                                </span>
                            )}
                        </button>

                        {/* Messages */}

                        <button
                            type="button"
                            onClick={() => goTo("/messages")}
                            title={
                                sidebarCollapsed ? "Messages" : undefined
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    sidebarCollapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
                                }
                                ${
                                    isActive("/messages")
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
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

                            {!sidebarCollapsed && <span>Messages</span>}

                            {messageCount > 0 && (
                                <span
                                    className={`
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
                                            sidebarCollapsed
                                                ? "absolute ml-7 mt-[-18px] bg-[#C66A4A] text-white"
                                                : "ml-auto"
                                        }
                                        ${
                                            !sidebarCollapsed &&
                                            isActive("/messages")
                                                ? "bg-white text-[#172A46]"
                                                : !sidebarCollapsed
                                                  ? "bg-[#D9B99B] text-[#172A46]"
                                                  : ""
                                        }
                                    `}
                                >
                                    {messageCount > 99 ? "99+" : messageCount}
                                </span>
                            )}
                        </button>

                        {/* My Profile */}

                        <button
                            type="button"
                            onClick={() => goTo("/provider/profile")}
                            title={
                                sidebarCollapsed ? "My Profile" : undefined
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    sidebarCollapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
                                }
                                ${
                                    location.pathname === "/provider/profile"
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
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

                            {!sidebarCollapsed && <span>My Profile</span>}
                        </button>

                        {/* Reviews */}

                        <button
                            type="button"
                            onClick={() => goTo(reviewsPath)}
                            title={
                                sidebarCollapsed ? "Reviews" : undefined
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    sidebarCollapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
                                }
                                ${
                                    location.pathname.includes("/reviews")
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
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

                            {!sidebarCollapsed && <span>Reviews</span>}
                        </button>

                        {/* Enrolment */}

                        <button
                            type="button"
                            onClick={() => goTo("/provider/enrolment")}
                            title={
                                sidebarCollapsed ? "Enrolment" : undefined
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                transition-all
                                duration-200
                                ${
                                    sidebarCollapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
                                }
                                ${
                                    isActive("/provider/enrolment")
                                        ? activeLinkClasses
                                        : inactiveLinkClasses
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

                            {!sidebarCollapsed && <span>Enrolment</span>}
                        </button>
                    </nav>

                    {/* General */}

                    {!sidebarCollapsed && (
                        <p className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9B99B]/75">
                            General
                        </p>
                    )}

                    <nav className="mt-8">
                        <button
                            type="button"
                            onClick={() => goTo("/")}
                            title={
                                sidebarCollapsed ? "Back to Home" : undefined
                            }
                            className={`
                                flex
                                w-full
                                items-center
                                rounded-xl
                                py-3
                                text-sm
                                font-medium
                                text-[#D7DCE5]
                                transition-all
                                duration-200
                                hover:bg-white/10
                                hover:text-white
                                ${
                                    sidebarCollapsed
                                        ? "justify-center px-2"
                                        : "gap-3 px-3"
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
                                    d="M3 10.5L12 3l9 7.5M5 9v11h14V9"
                                />
                            </svg>

                            {!sidebarCollapsed && <span>Back to Home</span>}
                        </button>
                    </nav>
                </div>

                {/* User / Logout */}

                <div className="shrink-0 border-t border-white/10 p-4">
                    <div
                        className={`
                            mb-3
                            flex
                            items-center
                            rounded-xl
                            border
                            border-white/5
                            bg-white/[0.06]
                            p-3
                            ${
                                sidebarCollapsed
                                    ? "justify-center"
                                    : "gap-3"
                            }
                        `}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D9B99B] text-sm font-semibold text-[#172A46]">
                            {(
                                profile?.business_name ||
                                username ||
                                "P"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        {!sidebarCollapsed && (
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-white">
                                    {profile?.business_name ||
                                        username ||
                                        "Provider"}
                                </p>

                                <p className="text-xs text-[#D9B99B]">
                                    Service Provider
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        title={sidebarCollapsed ? "Logout" : undefined}
                        className={`
                            flex
                            w-full
                            items-center
                            rounded-xl
                            py-3
                            text-sm
                            font-medium
                            text-[#D7DCE5]
                            transition-all
                            duration-200
                            hover:bg-[#C66A4A]/15
                            hover:text-[#E9A58D]
                            ${
                                sidebarCollapsed
                                    ? "justify-center px-2"
                                    : "gap-3 px-3"
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
                                d="M10 17l5-5-5-5M15 12H3m12-7h4a2 2 0 012 2v10a2 2 0 01-2 2h-4"
                            />
                        </svg>

                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main page area */}

            <div
                className={`
                    min-h-screen
                    transition-all
                    duration-300
                    ${mainMargin}
                `}
            >
                {/* Top bar */}

                <header className="sticky top-0 z-30 h-16 border-b border-[#D9B99B]/50 bg-[#FFFDF9]/95 backdrop-blur-md">
                    <div className="flex h-full items-center justify-between px-5 sm:px-8">
                        {/* Mobile menu */}

                        <button
                            type="button"
                            aria-label="Open sidebar"
                            onClick={() => setMobileMenuOpen(true)}
                            className="rounded-lg p-2 text-[#172A46] transition hover:bg-[#F4EDE5] md:hidden"
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
                            <p className="text-xs text-[#536070]">
                                FixIt Provider Portal
                            </p>

                            <p className="text-sm font-semibold text-[#172A46]">
                                {profile?.business_name ||
                                    "Provider Dashboard"}
                            </p>
                        </div>

                        {/* Right side */}

                        <div className="ml-auto flex items-center gap-4">
                            <button
                                type="button"
                                aria-label="Open messages"
                                onClick={() => goTo("/messages")}
                                className="relative rounded-xl p-2 text-[#536070] transition hover:bg-[#F4EDE5] hover:text-[#172A46]"
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

                                {messageCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C66A4A] px-1 text-[9px] font-bold text-white ring-2 ring-[#FFFDF9]">
                                        {messageCount > 99
                                            ? "99+"
                                            : messageCount}
                                    </span>
                                )}
                            </button>

                            <div className="h-8 w-px bg-[#D9B99B]/70" />

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9B99B] bg-[#F4EDE5] text-sm font-semibold text-[#172A46]">
                                    {(
                                        profile?.business_name ||
                                        username ||
                                        "P"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="hidden sm:block">
                                    <p className="max-w-48 truncate text-sm font-semibold text-[#172A46]">
                                        {profile?.business_name ||
                                            username ||
                                            "Provider"}
                                    </p>

                                    <p className="text-xs text-[#536070]">
                                        Provider
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}

                <main className="min-h-[calc(100vh-4rem)] overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default ProviderLayout;

import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Search,
    ClipboardList,
    MessageSquare,
    Star,
    Home,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    LogOut,
} from "lucide-react";

import { logoutUser } from "../services/authService";
import { getConversations } from "../services/messagingService";

function CustomerDashboardLayout() {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function loadUnreadMessages() {
            try {
                const data = await getConversations();

                const conversations = Array.isArray(data)
                    ? data
                    : data?.results || data?.conversations || [];

                const totalUnread = conversations.reduce(
                    (total, conversation) => {
                        const unread =
                            conversation.unread_count ??
                            conversation.unread_messages_count ??
                            conversation.unread_messages ??
                            0;

                        return total + (Number(unread) || 0);
                    },
                    0
                );

                if (isMounted) {
                    setUnreadMessages(totalUnread);
                }
            } catch (error) {
                console.error(
                    "Failed to load unread message count:",
                    error
                );
            }
        }

        loadUnreadMessages();

        const intervalId = setInterval(loadUnreadMessages, 10000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    const navigationItems = [
        {
            name: "Dashboard",
            path: "/customer-dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Find Providers",
            path: "/providers",
            icon: Search,
        },
        {
            name: "My Requests",
            path: "/service-requests",
            icon: ClipboardList,
        },
        {
            name: "Messages",
            path: "/messages",
            icon: MessageSquare,
        },
        {
            name: "Reviews",
            path: "/reviews",
            icon: Star,
        },
    ];

    const closeMobileSidebar = () => {
        setMobileOpen(false);
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#F4EDE5]">
            {/* Mobile menu button */}
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#172A46] text-white shadow-xl transition hover:bg-[#C66A4A] md:hidden"
                aria-label="Open customer navigation"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <button
                    type="button"
                    onClick={closeMobileSidebar}
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    aria-label="Close navigation"
                />
            )}

            <div className="flex min-h-screen">
                {/* Desktop sidebar */}
                <aside
                    className={`
                        sticky top-0 hidden h-screen shrink-0 flex-col
                        border-r border-[#D9B99B]/20 bg-[#172A46] text-white shadow-2xl
                        transition-all duration-300 md:flex
                        ${collapsed ? "w-20" : "w-64"}
                    `}
                >
                    {/* Sidebar header */}
                    <div className="flex h-20 shrink-0 items-center border-b border-[#D9B99B]/20 px-4">
                        <div
                            className={`
                                flex items-center
                                ${collapsed ? "justify-center w-full" : "gap-3"}
                            `}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C66A4A] text-sm font-bold text-white ring-1 ring-[#D9B99B]/30">
                                F
                            </div>

                            {!collapsed && (
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        FixIt
                                    </p>

                                    <p className="text-xs text-[#D9B99B]">
                                        Customer
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrollable navigation */}
                    <div className="flex-1 overflow-y-auto px-3 py-5">
                        <nav className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isMessages = item.path === "/messages";

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={
                                            item.path ===
                                            "/customer-dashboard"
                                        }
                                        onClick={closeMobileSidebar}
                                        className={({ isActive }) => `
                                            group flex items-center rounded-xl
                                            transition-all duration-200
                                            ${
                                                collapsed
                                                    ? "justify-center px-2 py-3.5"
                                                    : "gap-3 px-4 py-3.5"
                                            }
                                            ${
                                                isActive
                                                    ? "bg-[#C66A4A] text-white shadow-lg shadow-black/10"
                                                    : "text-[#D6D0CB] hover:bg-[#243754] hover:text-white"
                                            }
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    className={`
                                                        h-5 w-5 shrink-0
                                                        ${
                                                            isActive
                                                                ? "text-white"
                                                                : "text-[#D9B99B]"
                                                        }
                                                    `}
                                                />

                                                {!collapsed && (
                                                    <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                                                        <span className="text-sm font-medium">
                                                            {item.name}
                                                        </span>

                                                        {isMessages &&
                                                            unreadMessages > 0 && (
                                                                <span
                                                                    className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#C66A4A] px-1.5 text-[11px] font-bold leading-none text-white ring-1 ring-white/20"
                                                                    aria-label={`${unreadMessages} unread messages`}
                                                                >
                                                                    {unreadMessages > 99
                                                                        ? "99+"
                                                                        : unreadMessages}
                                                                </span>
                                                            )}
                                                    </span>
                                                )}

                                                {collapsed &&
                                                    isMessages &&
                                                    unreadMessages > 0 && (
                                                        <span
                                                            className="absolute ml-9 -mt-7 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C66A4A] px-1 text-[9px] font-bold text-white ring-2 ring-[#172A46]"
                                                            aria-label={`${unreadMessages} unread messages`}
                                                        >
                                                            {unreadMessages > 99
                                                                ? "99+"
                                                                : unreadMessages}
                                                        </span>
                                                    )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom controls */}
                    <div className="shrink-0 space-y-2 border-t border-[#D9B99B]/20 p-3">
                        {/* Home */}
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className={`
                                flex w-full items-center rounded-xl
                                text-[#D6D0CB] transition
                                hover:bg-[#243754] hover:text-white
                                ${
                                    collapsed
                                        ? "justify-center px-2 py-3.5"
                                        : "gap-3 px-4 py-3.5"
                                }
                            `}
                            title="Home"
                        >
                            <Home className="h-5 w-5 shrink-0 text-[#D9B99B]" />

                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    Home
                                </span>
                            )}
                        </button>

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={`
                                flex w-full items-center rounded-xl
                                text-[#E8B6A5]
                                transition
                                hover:bg-[#C66A4A]/15 hover:text-[#F0C8BA]
                                ${
                                    collapsed
                                        ? "justify-center px-2 py-3.5"
                                        : "gap-3 px-4 py-3.5"
                                }
                            `}
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5 shrink-0" />

                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    Logout
                                </span>
                            )}
                        </button>

                        {/* Collapse */}
                        <button
                            type="button"
                            onClick={() => setCollapsed(!collapsed)}
                            className={`
                                flex w-full items-center rounded-xl
                                border border-[#D9B99B]/20
                                bg-[#243754]/70
                                text-[#E8DED2]
                                transition
                                hover:bg-[#C66A4A]
                                ${
                                    collapsed
                                        ? "justify-center px-2 py-3"
                                        : "justify-between px-4 py-3"
                                }
                            `}
                            title={
                                collapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            {!collapsed && (
                                <span className="text-sm font-medium">
                                    Collapse sidebar
                                </span>
                            )}

                            {collapsed ? (
                                <ChevronRight className="h-5 w-5 text-[#D9B99B]" />
                            ) : (
                                <ChevronLeft className="h-5 w-5 text-[#D9B99B]" />
                            )}
                        </button>
                    </div>
                </aside>

                {/* Mobile sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 flex w-72 flex-col
                        border-r border-[#D9B99B]/20 bg-[#172A46] text-white shadow-2xl
                        transition-transform duration-300 md:hidden
                        ${
                            mobileOpen
                                ? "translate-x-0"
                                : "-translate-x-full"
                        }
                    `}
                >
                    {/* Mobile header */}
                    <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#D9B99B]/20 px-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C66A4A] text-sm font-bold text-white ring-1 ring-[#D9B99B]/30">
                                F
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-white">
                                    FixIt
                                </p>

                                <p className="text-xs text-[#D9B99B]">
                                    Customer
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={closeMobileSidebar}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#D6D0CB] transition hover:bg-[#C66A4A] hover:text-white"
                            aria-label="Close customer navigation"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Mobile navigation */}
                    <div className="flex-1 overflow-y-auto px-3 py-5">
                        <nav className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isMessages = item.path === "/messages";

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={
                                            item.path ===
                                            "/customer-dashboard"
                                        }
                                        onClick={closeMobileSidebar}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 rounded-xl
                                            px-4 py-3.5 text-sm font-medium
                                            transition
                                            ${
                                                isActive
                                                    ? "bg-[#C66A4A] text-white shadow-lg shadow-black/10"
                                                    : "text-[#D6D0CB] hover:bg-[#243754] hover:text-white"
                                            }
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    className={`
                                                        h-5 w-5 shrink-0
                                                        ${
                                                            isActive
                                                                ? "text-white"
                                                                : "text-[#D9B99B]"
                                                        }
                                                    `}
                                                />

                                                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                                                    <span>{item.name}</span>

                                                    {isMessages &&
                                                        unreadMessages > 0 && (
                                                            <span
                                                                className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#C66A4A] px-1.5 text-[11px] font-bold leading-none text-white ring-1 ring-white/20"
                                                                aria-label={`${unreadMessages} unread messages`}
                                                            >
                                                                {unreadMessages > 99
                                                                    ? "99+"
                                                                    : unreadMessages}
                                                            </span>
                                                        )}
                                                </span>
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mobile bottom controls */}
                    <div className="shrink-0 border-t border-[#D9B99B]/20 p-3">
                        {/* Home */}
                        <button
                            type="button"
                            onClick={() => {
                                closeMobileSidebar();
                                navigate("/");
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[#D6D0CB] transition hover:bg-[#243754] hover:text-white"
                        >
                            <Home className="h-5 w-5 text-[#D9B99B]" />

                            <span className="text-sm font-medium">
                                Home
                            </span>
                        </button>

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-[#E8B6A5] transition hover:bg-[#C66A4A]/15 hover:text-[#F0C8BA]"
                        >
                            <LogOut className="h-5 w-5" />

                            <span className="text-sm font-medium">
                                Logout
                            </span>
                        </button>
                    </div>
                </aside>

                {/* Current customer page */}
                <main className="min-w-0 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default CustomerDashboardLayout;
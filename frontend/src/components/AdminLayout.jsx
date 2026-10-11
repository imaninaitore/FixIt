
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    FileCheck2,
    CreditCard,
    ChartNoAxesCombined,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Home,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

import { logoutUser } from "../services/authService";

const NAVIGATION = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: "Users",
        path: "/admin/users",
        icon: Users,
    },
    {
        label: "Provider Enrolments",
        path: "/admin/enrolments",
        icon: FileCheck2,
    },
    {
        label: "Service Requests",
        path: "/admin/requests",
        icon: ClipboardList,
    },
    {
        label: "Payments",
        path: "/admin/payments",
        icon: CreditCard,
    },
    {
        label: "Reports",
        path: "/admin/reports",
        icon: ChartNoAxesCombined,
    },
];

function AdminLayout() {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [username, setUsername] = useState("Admin");

    useEffect(() => {
        setUsername(localStorage.getItem("username") || "Admin");
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            navigate("/", { replace: true });
        }
    };

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    const sidebarWidth = collapsed ? "lg:w-20" : "lg:w-64";

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/adminpic.jpg')" }}
        >
            <div className="min-h-screen bg-[#172A46]/75">
                {/* Mobile top bar */}
                <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#172A46] px-4 shadow-lg lg:hidden">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-xl font-bold text-[#FFFDF9]"
                        aria-label="Go to admin dashboard"
                    >
                        Fix<span className="text-[#C66A4A]">It</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((open) => !open)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#FFFDF9] transition hover:bg-white/10"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={23} /> : <Menu size={23} />}
                    </button>
                </header>

                {/* Mobile backdrop */}
                {mobileOpen && (
                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        onClick={closeMobileMenu}
                        className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
                    />
                )}

                {/* Fixed sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-[#172A46] text-[#FFFDF9] shadow-2xl transition-[width,transform] duration-300 ease-in-out ${sidebarWidth} ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }`}
                >
                    {/* Logo */}
                    <div
                        className={`flex min-h-[88px] items-center border-b border-white/10 ${
                            collapsed
                                ? "justify-center px-3"
                                : "justify-between px-5"
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                navigate("/admin/dashboard");
                                closeMobileMenu();
                            }}
                            className={`font-bold tracking-tight ${
                                collapsed ? "text-xl" : "text-2xl"
                            }`}
                            aria-label="FixIt admin dashboard"
                        >
                            Fix
                            <span className="text-[#C66A4A]">It</span>
                        </button>

                        {!collapsed && (
                            <span className="rounded-md bg-[#C66A4A]/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#F2D8CC]">
                                Admin
                            </span>
                        )}
                    </div>

                    {/* Collapse button: desktop only */}
                    <button
                        type="button"
                        onClick={() => setCollapsed((value) => !value)}
                        className="absolute -right-3 top-[105px] hidden h-7 w-7 items-center justify-center rounded-full border border-[#C66A4A]/40 bg-[#FFFDF9] text-[#172A46] shadow-md transition hover:bg-[#F2D8CC] lg:flex"
                        aria-label={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                        title={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {collapsed ? (
                            <ChevronRight size={16} />
                        ) : (
                            <ChevronLeft size={16} />
                        )}
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-6">
                        {!collapsed && (
                            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Management
                            </p>
                        )}

                        <div className="space-y-1.5">
                            {NAVIGATION.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        onClick={closeMobileMenu}
                                        title={collapsed ? item.label : undefined}
                                        className={({ isActive }) =>
                                            `group flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                                                isActive
                                                    ? "bg-[#C66A4A] text-white shadow-md shadow-black/10"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                            } ${
                                                collapsed
                                                    ? "justify-center"
                                                    : ""
                                            }`
                                        }
                                    >
                                        <Icon
                                            size={19}
                                            strokeWidth={1.9}
                                            className="shrink-0"
                                        />

                                        <span className={collapsed ? "truncate lg:hidden" : "truncate"}>
                                             {item.label}
                                         </span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </nav>

                    {/* User and bottom actions */}
                    <div className="border-t border-white/10 p-3">
                        <div
                            className={`mb-3 flex items-center gap-3 rounded-lg bg-white/5 p-2 ${
                                collapsed ? "justify-center" : ""
                            }`}
                            title={collapsed ? username : undefined}
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C66A4A] text-sm font-bold text-white">
                                {username.charAt(0).toUpperCase()}
                            </div>

                            {!collapsed && (
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {username}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Administrator
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                navigate("/");
                                closeMobileMenu();
                            }}
                            title={collapsed ? "Back to Home" : undefined}
                            className={`mb-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white ${
                                collapsed ? "justify-center" : ""
                            }`}
                        >
                            <Home size={19} className="shrink-0" />
                            {!collapsed && <span>Back to Home</span>}
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            title={collapsed ? "Log Out" : undefined}
                            className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#F2D8CC] transition hover:bg-[#C66A4A]/15 hover:text-white ${
                                collapsed ? "justify-center" : ""
                            }`}
                        >
                            <LogOut size={19} className="shrink-0" />
                            {!collapsed && <span>Log Out</span>}
                        </button>

                        {/* Alternative way to expand when collapsed */}
                        {collapsed && (
                            <button
                                type="button"
                                onClick={() => setCollapsed(false)}
                                className="mt-2 hidden min-h-11 w-full items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white lg:flex"
                                title="Expand sidebar"
                                aria-label="Expand sidebar"
                            >
                                <PanelLeftOpen size={19} />
                            </button>
                        )}

                        {!collapsed && (
                            <button
                                type="button"
                                onClick={() => setCollapsed(true)}
                                className="mt-2 hidden min-h-10 w-full items-center justify-center gap-2 rounded-lg text-xs text-slate-400 transition hover:bg-white/10 hover:text-white lg:flex"
                                title="Collapse sidebar"
                            >
                                <PanelLeftClose size={16} />
                                <span>Collapse sidebar</span>
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main content adjusts to the sidebar width */}
                <main
                    className={`min-h-screen pt-16 transition-[margin] duration-300 ease-in-out lg:pt-0 ${
                        collapsed ? "lg:ml-20" : "lg:ml-64"
                    }`}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;

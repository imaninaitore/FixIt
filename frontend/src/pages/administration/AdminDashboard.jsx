
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    FileCheck2,
    ClipboardList,
    CreditCard,
    ChartNoAxesCombined,
    ArrowUpRight,
    Wrench,
    ShieldCheck,
    Activity,
    ArrowRight,
    LayoutDashboard,
    ExternalLink,
} from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("Admin");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername || "Admin");
    }, []);

    const overviewCards = [
        {
            title: "User Management",
            heading: "Users",
            description: "View and manage FixIt user accounts.",
            action: "Manage users",
            path: "/admin/users",
            icon: Users,
        },
        {
            title: "Provider Management",
            heading: "Enrolments",
            description: "Review provider applications and approvals.",
            action: "View enrolments",
            path: "/admin/enrolments",
            icon: FileCheck2,
        },
        {
            title: "Platform Activity",
            heading: "Service Requests",
            description: "Monitor customer service requests.",
            action: "View requests",
            path: "/admin/requests",
            icon: ClipboardList,
        },
        {
            title: "Financial Activity",
            heading: "Payments",
            description: "Monitor provider subscription payments.",
            action: "View payments",
            path: "/admin/payments",
            icon: CreditCard,
        },
    ];

    const quickActions = [
        {
            title: "Manage Users",
            description:
                "View user accounts and manage account status.",
            path: "/admin/users",
            icon: Users,
        },
        {
            title: "Review Enrolments",
            description:
                "Review and process service provider applications.",
            path: "/admin/enrolments",
            icon: ShieldCheck,
        },
        {
            title: "Service Requests",
            description:
                "Monitor requests between customers and providers.",
            path: "/admin/requests",
            icon: ClipboardList,
        },
        {
            title: "Payment Management",
            description: "Review provider payment activity.",
            path: "/admin/payments",
            icon: CreditCard,
        },
        {
            title: "Reports",
            description: "View platform reports and statistics.",
            path: "/admin/reports",
            icon: ChartNoAxesCombined,
        },
        {
            title: "Back to FixIt",
            description: "Return to the main FixIt website.",
            path: "/",
            icon: ExternalLink,
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Dashboard header */}
            <header className="border-b border-[#172A46]/10 bg-[#FFFDF9]/95 backdrop-blur-md">
                <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div>
                        <div className="mb-1 flex items-center gap-2 text-sm font-medium text-[#C66A4A]">
                            <LayoutDashboard size={16} />
                            <span>Administration</span>
                        </div>

                        <h1 className="text-xl font-bold text-[#172A46] sm:text-2xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage the FixIt platform from one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#172A46] font-semibold text-[#FFFDF9] ring-4 ring-[#C66A4A]/10">
                            {username.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#172A46]">
                                {username}
                            </p>
                            <p className="text-xs text-slate-500">
                                Administrator
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* Welcome section */}
                <section
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-cover bg-center shadow-xl"
                    style={{
                        backgroundImage: "url('/adminpic.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-[#172A46]/85" />

                    <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-[#C66A4A]/20" />

                    <div className="relative z-10 max-w-3xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#F2D8CC]/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#F2D8CC]">
                            <Wrench size={14} />
                            FixIt Administration
                        </div>

                        <h2 className="mt-5 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                            Welcome back, {username}
                        </h2>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                            Monitor users, provider applications,
                            service requests, payments, and platform
                            reports from your administration panel.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/reports")}
                            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#C66A4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#AD5639] focus:outline-none focus:ring-2 focus:ring-[#F2D8CC] focus:ring-offset-2 focus:ring-offset-[#172A46]"
                        >
                            View reports
                            <ArrowRight size={17} />
                        </button>
                    </div>
                </section>

                {/* Overview cards */}
                <section>
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Platform Overview
                            </h2>
                            <p className="mt-1 text-sm text-slate-200">
                                Quick access to the main management areas.
                            </p>
                        </div>

                        <span className="text-xs text-slate-300">
                            Administration tools
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {overviewCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <button
                                    key={card.path}
                                    type="button"
                                    onClick={() => navigate(card.path)}
                                    className="group flex min-w-0 flex-col rounded-xl border border-white/30 bg-[#FFFDF9] p-5 text-left shadow-md transition duration-200 hover:-translate-y-1 hover:border-[#C66A4A]/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C66A4A] sm:p-6"
                                >
                                    <div className="flex w-full items-start justify-between gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C66A4A]/10 text-[#C66A4A] transition group-hover:bg-[#C66A4A] group-hover:text-white">
                                            <Icon size={21} />
                                        </div>

                                        <ArrowUpRight
                                            size={19}
                                            className="text-slate-400 transition group-hover:text-[#C66A4A]"
                                        />
                                    </div>

                                    <p className="mt-5 text-xs font-medium uppercase tracking-wide text-slate-500">
                                        {card.title}
                                    </p>

                                    <h3 className="mt-1 text-xl font-bold text-[#172A46]">
                                        {card.heading}
                                    </h3>

                                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                                        {card.description}
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C66A4A]">
                                        {card.action}
                                        <ArrowRight
                                            size={16}
                                            className="transition group-hover:translate-x-1"
                                        />
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Quick actions */}
                <section className="pb-6">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-white">
                            Quick Actions
                        </h2>
                        <p className="mt-1 text-sm text-slate-200">
                            Quickly access the main administration tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <button
                                    key={action.path}
                                    type="button"
                                    onClick={() => navigate(action.path)}
                                    className="group flex min-w-0 items-start gap-4 rounded-xl border border-white/20 bg-[#FFFDF9]/95 p-5 text-left shadow-md transition duration-200 hover:border-[#C66A4A]/50 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C66A4A]"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172A46] text-[#FFFDF9] transition group-hover:bg-[#C66A4A]">
                                        <Icon size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-[#172A46]">
                                            {action.title}
                                        </h3>

                                        <p className="mt-1.5 text-sm leading-5 text-slate-600">
                                            {action.description}
                                        </p>
                                    </div>

                                    <ArrowUpRight
                                        size={18}
                                        className="mt-1 shrink-0 text-slate-400 transition group-hover:text-[#C66A4A]"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/20 py-5 text-center text-xs text-slate-300">
                    FixIt Administration
                    <span className="mx-2 text-[#C66A4A]">•</span>
                    Platform management
                </footer>
            </div>
        </div>
    );
}

export default AdminDashboard;

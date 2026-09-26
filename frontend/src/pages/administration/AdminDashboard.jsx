import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../../services/authService";

function AdminDashboard() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername || "Admin");
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            window.location.href = "/";
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-slate-900 text-white">

                {/* Logo */}
                <div className="border-b border-slate-700 px-6 py-6">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-2xl font-bold"
                    >
                        Fix<span className="text-blue-400">It</span>
                    </button>

                    <p className="mt-1 text-sm text-slate-400">
                        Admin Panel
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Management
                    </p>

                    <div className="space-y-2">

                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="flex w-full items-center rounded-lg bg-blue-600 px-4 py-3 text-left text-sm font-medium text-white"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() => navigate("/admin/users")}
                            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Users
                        </button>

                        <button
                            onClick={() => navigate("/admin/enrolments")}
                            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Provider Enrolments
                        </button>

                        <button
                            onClick={() => navigate("/admin/requests")}
                            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Service Requests
                        </button>

                        <button
                            onClick={() => navigate("/admin/payments")}
                            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Payments
                        </button>

                        <button
                            onClick={() => navigate("/admin/reports")}
                            className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Reports
                        </button>

                    </div>

                </nav>

                {/* Bottom actions */}
                <div className="border-t border-slate-700 p-4">

                    <button
                        onClick={() => navigate("/")}
                        className="mb-2 flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        Back to Home
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                        Log Out
                    </button>

                </div>

            </aside>

            {/* Main content */}
            <main className="ml-64 min-h-screen">

                {/* Top bar */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between px-8 py-5">

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Manage the FixIt platform from one place.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                {username.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {username}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>

                        </div>

                    </div>
                </header>

                {/* Dashboard content */}
                <div className="px-8 py-8">

                    {/* Welcome section */}
                    <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">

                        <p className="text-sm font-medium text-blue-100">
                            Welcome back
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {username}
                        </h2>

                        <p className="mt-3 max-w-2xl text-blue-100">
                            Monitor users, provider applications, service
                            requests, payments, and platform reports from
                            your administration panel.
                        </p>

                    </section>

                    {/* Overview cards */}
                    <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                        <button
                            onClick={() => navigate("/admin/users")}
                            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <p className="text-sm font-medium text-gray-500">
                                User Management
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-gray-900">
                                Users
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                View and manage FixIt users.
                            </p>

                            <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                                Manage Users →
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/admin/enrolments")}
                            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <p className="text-sm font-medium text-gray-500">
                                Provider Management
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-gray-900">
                                Enrolments
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Review provider applications and approvals.
                            </p>

                            <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                                View Enrolments →
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/admin/requests")}
                            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <p className="text-sm font-medium text-gray-500">
                                Platform Activity
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-gray-900">
                                Service Requests
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Monitor customer service requests.
                            </p>

                            <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                                View Requests →
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/admin/payments")}
                            className="rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <p className="text-sm font-medium text-gray-500">
                                Financial Activity
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-gray-900">
                                Payments
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Monitor provider subscription payments.
                            </p>

                            <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                                View Payments →
                            </span>
                        </button>

                    </section>

                    {/* Quick actions */}
                    <section className="mt-10">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Quickly access the main administration tools.
                            </p>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                            <button
                                onClick={() => navigate("/admin/users")}
                                className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Manage Users
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    View user accounts and manage account
                                    status.
                                </p>
                            </button>

                            <button
                                onClick={() => navigate("/admin/enrolments")}
                                className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Review Enrolments
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Review and process service provider
                                    applications.
                                </p>
                            </button>

                            <button
                                onClick={() => navigate("/admin/requests")}
                                className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Service Requests
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Monitor requests between customers and
                                    providers.
                                </p>
                            </button>

                            <button
                                onClick={() => navigate("/admin/payments")}
                                className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Payment Management
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Review provider payment activity.
                                </p>
                            </button>

                            <button
                                onClick={() => navigate("/admin/reports")}
                                className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Reports
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    View platform reports and statistics.
                                </p>
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-blue-300 hover:shadow-md"
                            >
                                <h3 className="font-semibold text-gray-900">
                                    Back to FixIt
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Return to the main FixIt website.
                                </p>
                            </button>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;
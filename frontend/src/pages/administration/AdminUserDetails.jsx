
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    UserRound,
    ShieldCheck,
    CalendarDays,
    Clock3,
    RefreshCw,
} from "lucide-react";

import {
    getAdminUser,
    updateUserStatus,
} from "../../services/adminService";

function AdminUserDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadUser();
    }, [userId]);

    async function loadUser() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const data = await getAdminUser(userId);
            setUser(data);
        } catch (err) {
            setError(err.message || "Unable to load user details.");
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange() {
        if (!user || updating) return;

        const newStatus = !user.is_active;
        const confirmed = window.confirm(
            `Are you sure you want to ${
                newStatus ? "activate" : "deactivate"
            } this account?`
        );

        if (!confirmed) return;

        try {
            setUpdating(true);
            setError("");
            setMessage("");

            const data = await updateUserStatus(user.id, newStatus);

            setUser((currentUser) => ({
                ...currentUser,
                is_active: data.is_active,
            }));

            setMessage(data.message || "Account status updated successfully.");
        } catch (err) {
            setError(err.message || "Unable to update account status.");
        } finally {
            setUpdating(false);
        }
    }

    function formatDate(date) {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString();
    }

    function DetailItem({ label, value, breakAll = false }) {
        return (
            <div className="min-w-0 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-[#172A46]/55">
                    {label}
                </p>
                <p
                    className={`mt-1 text-sm leading-6 text-[#172A46] ${
                        breakAll ? "break-all" : "break-words"
                    }`}
                >
                    {value ?? "Not provided"}
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#F2D8CC] border-t-[#C66A4A]" />
                    <p className="mt-4 text-sm text-[#172A46]/65">
                        Loading user details...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
                <div className="rounded-2xl border border-[#E8D9CE] bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-xl font-semibold text-[#172A46]">
                        Unable to load user
                    </h1>
                    <p className="mt-3 break-words text-sm leading-6 text-[#172A46]/70">
                        {error}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={loadUser}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#172A46] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#243B5C]"
                        >
                            <RefreshCw size={16} />
                            Try again
                        </button>

                        <button
                            onClick={() => navigate("/admin/users")}
                            className="rounded-lg border border-[#E8D9CE] px-4 py-2.5 text-sm font-medium text-[#172A46] transition hover:bg-[#F8F5F0]"
                        >
                            Back to users
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#172A46]">
            <header className="border-b border-[#E8D9CE] bg-[#FFFDF9]">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#172A46]/70 transition hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={16} />
                        Back to users
                    </button>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F2D8CC]/65">
                            <UserRound size={26} className="text-[#C66A4A]" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C66A4A]">
                                User details
                            </p>
                            <h1 className="mt-1 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                                {user.username}
                            </h1>
                            <p className="mt-1 break-all text-sm text-[#172A46]/65">
                                {user.email || "No email provided"}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {message && (
                    <div
                        role="status"
                        className="mb-5 rounded-xl border border-[#C9DDCD] bg-[#EDF5EE] px-4 py-3 text-sm text-[#356344]"
                    >
                        {message}
                    </div>
                )}

                {error && user && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-[#EACBC4] bg-[#FBEFEC] px-4 py-3 text-sm text-[#963F32]"
                    >
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <section className="h-fit rounded-2xl border border-[#E8D9CE] bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-[#C66A4A]" />
                            <h2 className="font-semibold">Account status</h2>
                        </div>

                        <div className="mt-5 border-t border-[#F0E8E0] pt-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#172A46]/55">
                                Current status
                            </p>

                            <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                                    user.is_active
                                        ? "bg-[#E8F0E9] text-[#356344]"
                                        : "bg-[#FBE9E6] text-[#9A3F32]"
                                }`}
                            >
                                {user.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="mt-4 space-y-3 border-t border-[#F0E8E0] pt-4 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[#172A46]/60">
                                    Staff account
                                </span>
                                <span className="font-medium">
                                    {user.is_staff ? "Yes" : "No"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[#172A46]/60">
                                    Superuser
                                </span>
                                <span className="font-medium">
                                    {user.is_superuser ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleStatusChange}
                            disabled={updating}
                            className={`mt-6 w-full rounded-lg px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#C66A4A] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                                user.is_active
                                    ? "border border-[#EACBC4] bg-white text-[#963F32] hover:bg-[#FBEFEC]"
                                    : "bg-[#172A46] text-white hover:bg-[#243B5C]"
                            }`}
                        >
                            {updating
                                ? "Updating..."
                                : user.is_active
                                  ? "Deactivate account"
                                  : "Activate account"}
                        </button>

                        <p className="mt-3 text-xs leading-5 text-[#172A46]/55">
                            Changing this status affects whether the account is active.
                        </p>
                    </section>

                    <section className="rounded-2xl border border-[#E8D9CE] bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
                        <h2 className="font-semibold">User information</h2>
                        <p className="mt-1 text-sm text-[#172A46]/60">
                            Account and registration details.
                        </p>

                        <div className="mt-4 grid grid-cols-1 divide-y divide-[#F0E8E0] sm:grid-cols-2 sm:gap-x-6 sm:divide-y-0">
                            <DetailItem
                                label="Username"
                                value={user.username}
                            />
                            <DetailItem
                                label="Account type"
                                value={user.account_type || "Not specified"}
                            />
                            <DetailItem
                                label="First name"
                                value={user.first_name || "Not provided"}
                            />
                            <DetailItem
                                label="Last name"
                                value={user.last_name || "Not provided"}
                            />
                            <DetailItem
                                label="Email address"
                                value={user.email || "Not provided"}
                                breakAll
                            />
                            <DetailItem
                                label="Date joined"
                                value={formatDate(user.date_joined)}
                            />
                            <DetailItem
                                label="Last login"
                                value={formatDate(user.last_login)}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#E8D9CE] bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
                        <div className="flex items-center gap-3">
                            <CalendarDays
                                size={20}
                                className="text-[#C66A4A]"
                            />
                            <div>
                                <h2 className="font-semibold">
                                    Account activity
                                </h2>
                                <p className="mt-1 text-sm text-[#172A46]/60">
                                    Registration and sign-in information.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-xl bg-[#F8F5F0] p-4">
                                <CalendarDays
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#C66A4A]"
                                />
                                <div className="min-w-0">
                                    <p className="text-xs text-[#172A46]/60">
                                        Registered
                                    </p>
                                    <p className="mt-1 break-words text-sm font-medium">
                                        {formatDate(user.date_joined)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-[#F8F5F0] p-4">
                                <Clock3
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#C66A4A]"
                                />
                                <div className="min-w-0">
                                    <p className="text-xs text-[#172A46]/60">
                                        Last login
                                    </p>
                                    <p className="mt-1 break-words text-sm font-medium">
                                        {formatDate(user.last_login)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default AdminUserDetails;

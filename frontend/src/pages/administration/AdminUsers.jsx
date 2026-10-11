
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Users,
    RefreshCw,
    ChevronRight,
} from "lucide-react";

import { getAdminUsers } from "../../services/adminService";

const PAGE_SIZE = 10;

function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminUsers();

            setUsers(data.users || []);
            setCount(data.count || 0);
            setCurrentPage(1);
        } catch (err) {
            setError(err.message || "Unable to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function formatDate(date) {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString();
    }

    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    const safePage = Math.min(currentPage, Math.max(totalPages, 1));
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const displayedUsers = users.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    function getDisplayName(user) {
        const fullName = `${user.first_name || ""} ${
            user.last_name || ""
        }`.trim();

        return fullName || "No name provided";
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#F2D8CC] border-t-[#C66A4A]" />
                    <p className="mt-4 text-sm text-[#172A46]/70">
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
                <div className="rounded-2xl border border-[#E8D9CE] bg-white p-6 shadow-sm sm:p-8">
                    <h1 className="text-xl font-semibold text-[#172A46]">
                        Unable to load users
                    </h1>

                    <p className="mt-2 break-words text-sm leading-6 text-[#172A46]/70">
                        {error}
                    </p>

                    <button
                        onClick={loadUsers}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#172A46] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#243B5C] focus:outline-none focus:ring-2 focus:ring-[#C66A4A] focus:ring-offset-2"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#172A46]">
            <header className="border-b border-[#E8D9CE] bg-[#FFFDF9]">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#172A46]/70 transition hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </button>

                    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C66A4A]">
                                Administration
                            </p>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                User accounts
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#172A46]/65 sm:text-base">
                                View registered users and manage their account details.
                            </p>
                        </div>

                        <div className="flex w-fit items-center gap-3 rounded-xl border border-[#E8D9CE] bg-white px-4 py-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2D8CC]/60">
                                <Users size={20} className="text-[#C66A4A]" />
                            </div>

                            <div>
                                <p className="text-xs text-[#172A46]/60">
                                    Total users
                                </p>
                                <p className="text-xl font-bold tabular-nums">
                                    {count}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <section className="overflow-hidden rounded-2xl border border-[#E8D9CE] bg-white shadow-sm">
                    <div className="flex flex-col gap-1 border-b border-[#E8D9CE] px-4 py-4 sm:px-6">
                        <h2 className="text-base font-semibold sm:text-lg">
                            All users
                        </h2>

                        <p className="text-sm text-[#172A46]/60">
                            Select a user to view their full account details.
                        </p>
                    </div>

                    {users.length === 0 ? (
                        <div className="px-5 py-14 text-center sm:px-8">
                            <Users
                                size={30}
                                className="mx-auto text-[#C66A4A]/70"
                            />

                            <h3 className="mt-4 font-semibold">
                                No users found
                            </h3>

                            <p className="mt-2 text-sm text-[#172A46]/60">
                                There are currently no user accounts to display.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-[#F0E8E0]">
                                {displayedUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex flex-col gap-4 px-4 py-4 transition hover:bg-[#F8F5F0]/70 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2D8CC]/60 text-sm font-semibold text-[#172A46]">
                                                {(user.username || "?")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="break-words font-semibold text-[#172A46]">
                                                    {user.username || "Unknown user"}
                                                </p>

                                                <p className="mt-0.5 break-words text-sm text-[#172A46]/65">
                                                    {getDisplayName(user)}
                                                </p>

                                                <p className="mt-1 break-all text-sm text-[#172A46]/60">
                                                    {user.email || "No email provided"}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            user.is_staff
                                                                ? "bg-[#F2D8CC]/70 text-[#8D452F]"
                                                                : "bg-[#F3F0EA] text-[#172A46]/75"
                                                        }`}
                                                    >
                                                        {user.is_staff
                                                            ? "Admin / Staff"
                                                            : "User"}
                                                    </span>

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            user.is_active
                                                                ? "bg-[#E8F0E9] text-[#356344]"
                                                                : "bg-[#FBE9E6] text-[#9A3F32]"
                                                        }`}
                                                    >
                                                        {user.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 border-t border-[#F0E8E0] pt-3 md:min-w-[190px] md:justify-end md:border-0 md:pt-0">
                                            <div className="md:text-right">
                                                <p className="text-xs text-[#172A46]/55">
                                                    Date joined
                                                </p>
                                                <p className="mt-1 text-sm font-medium">
                                                    {formatDate(user.date_joined)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/users/${user.id}`)
                                                }
                                                aria-label={`View ${user.username || "user"} details`}
                                                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E8D9CE] px-3 py-2 text-sm font-medium text-[#172A46] transition hover:border-[#C66A4A] hover:bg-[#F2D8CC]/30 focus:outline-none focus:ring-2 focus:ring-[#C66A4A] focus:ring-offset-2"
                                            >
                                                View
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4 border-t border-[#E8D9CE] bg-[#FFFDF9] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <p className="text-sm text-[#172A46]/65">
                                    Showing{" "}
                                    <span className="font-semibold text-[#172A46]">
                                        {startIndex + 1}–{Math.min(
                                            startIndex + PAGE_SIZE,
                                            users.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-[#172A46]">
                                        {users.length}
                                    </span>{" "}
                                    loaded users
                                </p>

                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    <button
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.max(1, page - 1)
                                            )
                                        }
                                        disabled={safePage <= 1}
                                        className="inline-flex items-center gap-2 rounded-lg border border-[#E8D9CE] bg-white px-3 py-2 text-sm font-medium transition hover:border-[#C66A4A] hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ArrowLeft size={16} />
                                        Previous
                                    </button>

                                    <span className="whitespace-nowrap text-sm text-[#172A46]/70">
                                        Page {safePage} of {Math.max(totalPages, 1)}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.min(
                                                    Math.max(totalPages, 1),
                                                    page + 1
                                                )
                                            )
                                        }
                                        disabled={safePage >= totalPages}
                                        className="inline-flex items-center gap-2 rounded-lg border border-[#E8D9CE] bg-white px-3 py-2 text-sm font-medium transition hover:border-[#C66A4A] hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminUsers;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    CalendarDays,
    Mail,
} from "lucide-react";

import { getAdminUsers } from "../../services/adminService";

const PAGE_SIZE = 10;

function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getDisplayName(user) {
    const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || user.full_name || user.username || "Unnamed user";
}

function getRole(user) {
    if (user.is_superuser) return "Superadmin";
    if (user.is_staff) return "Admin";

    return (
        user.account_type ||
        user.role ||
        user.user_type ||
        "Customer"
    );
}

function getStatus(user) {
    if (user.is_active === false) return "Inactive";
    return "Active";
}

function getRoleStyles(role) {
    const normalizedRole = String(role).toLowerCase();

    if (normalizedRole.includes("superadmin")) {
        return "bg-[#172A46] text-white";
    }

    if (normalizedRole.includes("admin")) {
        return "bg-[#F2D8CC] text-[#8D422D]";
    }

    if (normalizedRole.includes("provider")) {
        return "bg-[#E8EAF0] text-[#344766]";
    }

    return "bg-[#F8F5F0] text-[#66594E]";
}

export default function AdminUsers() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadUsers() {
            try {
                setLoading(true);
                setError("");

                const data = await getAdminUsers();

                if (!isMounted) return;

                const fetchedUsers = Array.isArray(data)
                    ? data
                    : data?.users || [];

                setUsers(fetchedUsers);
                setCount(
                    Array.isArray(data)
                        ? data.length
                        : data?.count ?? fetchedUsers.length
                );
            } catch (err) {
                if (!isMounted) return;

                setError(
                    err?.message ||
                        "Unable to load users. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredUsers = users.filter((user) => {
        const query = search.trim().toLowerCase();

        if (!query) return true;

        return [
            user.username,
            user.first_name,
            user.last_name,
            user.full_name,
            user.email,
            user.account_type,
            user.role,
            user.user_type,
        ]
            .filter(Boolean)
            .some((value) =>
                String(value).toLowerCase().includes(query)
            );
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / PAGE_SIZE)
    );

    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * PAGE_SIZE;

    const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    const firstUser = filteredUsers.length ? startIndex + 1 : 0;
    const lastUser = Math.min(
        startIndex + PAGE_SIZE,
        filteredUsers.length
    );

    function handleSearchChange(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#FFFDF9_0%,#F2D8CC_35%,#C66A4A_65%,#172A46_100%)] px-3 py-5 text-[#172A46] sm:px-5 sm:py-7 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/50 bg-[#FFFDF9]/75 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:p-5">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A85237]">
                            <Users size={15} />
                            User management
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Users
                        </h1>

                        <p className="mt-1 text-sm text-[#66594E]">
                            Manage and review registered FixIt users.
                        </p>
                    </div>

                    <div className="flex w-fit items-center gap-3 rounded-xl border border-[#F2D8CC] bg-white/80 px-4 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2D8CC] text-[#A85237]">
                            <Users size={19} />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-[#75685E]">
                                Total users
                            </p>
                            <p className="text-xl font-bold leading-tight">
                                {count}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="overflow-hidden rounded-2xl border border-white/70 bg-[#FFFDF9]/95 shadow-xl shadow-[#172A46]/10 backdrop-blur-md">
                    <div className="flex flex-col gap-3 border-b border-[#EAE2DA] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div>
                            <h2 className="text-base font-bold">
                                Registered users
                            </h2>
                            <p className="mt-0.5 text-xs text-[#75685E]">
                                {filteredUsers.length}{" "}
                                {filteredUsers.length === 1
                                    ? "user"
                                    : "users"}{" "}
                                found
                            </p>
                        </div>

                        <div className="relative w-full sm:max-w-xs">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8178]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    handleSearchChange(event.target.value)
                                }
                                placeholder="Search users..."
                                className="w-full rounded-lg border border-[#E5D9CF] bg-white py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-[#A39A91] focus:border-[#C66A4A] focus:ring-2 focus:ring-[#C66A4A]/15"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-4 py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F2D8CC] border-t-[#C66A4A]" />
                            <p className="text-sm text-[#75685E]">
                                Loading users...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="px-5 py-12 text-center">
                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex min-h-52 flex-col items-center justify-center px-5 py-12 text-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2D8CC]/60 text-[#A85237]">
                                <Users size={22} />
                            </div>

                            <h3 className="text-sm font-semibold">
                                No users found
                            </h3>

                            <p className="mt-1 text-xs text-[#75685E]">
                                Try another search term.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-[#EEE6DF]">
                                {paginatedUsers.map((user) => {
                                    const role = getRole(user);
                                    const status = getStatus(user);
                                    const displayName =
                                        getDisplayName(user);

                                    return (
                                        <div
                                            key={user.id}
                                            className="flex flex-col gap-3 px-4 py-3 transition hover:bg-[#F8F5F0]/80 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2D8CC] text-sm font-bold text-[#8D422D]">
                                                    {String(
                                                        user.username ||
                                                            displayName
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                        <p className="truncate text-sm font-semibold text-[#172A46]">
                                                            {user.username ||
                                                                displayName}
                                                        </p>

                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getRoleStyles(role)}`}
                                                        >
                                                            {role}
                                                        </span>

                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                                status ===
                                                                "Active"
                                                                    ? "bg-[#E5F2E8] text-[#286640]"
                                                                    : "bg-[#FCE8E6] text-[#A33A32]"
                                                            }`}
                                                        >
                                                            {status}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex flex-col gap-x-4 gap-y-1 text-xs text-[#75685E] sm:flex-row sm:flex-wrap">
                                                        <span className="flex min-w-0 items-center gap-1.5">
                                                            <Users
                                                                size={13}
                                                                className="shrink-0"
                                                            />
                                                            <span className="truncate">
                                                                {displayName}
                                                            </span>
                                                        </span>

                                                        <span className="flex min-w-0 items-center gap-1.5">
                                                            <Mail
                                                                size={13}
                                                                className="shrink-0"
                                                            />
                                                            <span className="truncate">
                                                                {user.email ||
                                                                    "No email"}
                                                            </span>
                                                        </span>

                                                        <span className="flex items-center gap-1.5">
                                                            <CalendarDays
                                                                size={13}
                                                                className="shrink-0"
                                                            />
                                                            Joined{" "}
                                                            {formatDate(
                                                                user.date_joined ||
                                                                    user.created_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 justify-end sm:pl-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/users/${user.id}`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5D9CF] bg-white px-3 py-1.5 text-xs font-semibold text-[#172A46] transition hover:border-[#C66A4A] hover:bg-[#F2D8CC]/50"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col gap-3 border-t border-[#EAE2DA] bg-white/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <p className="text-xs text-[#75685E]">
                                    Showing{" "}
                                    <span className="font-semibold text-[#172A46]">
                                        {firstUser}–{lastUser}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-[#172A46]">
                                        {filteredUsers.length}
                                    </span>{" "}
                                    users
                                </p>

                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    <span className="text-xs text-[#75685E]">
                                        Page {safePage} of {totalPages}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage((page) =>
                                                    Math.max(1, page - 1)
                                                )
                                            }
                                            disabled={safePage === 1}
                                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E5D9CF] bg-white px-2.5 text-xs font-medium transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <ChevronLeft size={15} />
                                            Previous
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage((page) =>
                                                    Math.min(
                                                        totalPages,
                                                        page + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                safePage === totalPages
                                            }
                                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#172A46] bg-[#172A46] px-2.5 text-xs font-medium text-white transition hover:bg-[#263D5E] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                            <ChevronRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

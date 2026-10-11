
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    RefreshCw,
    ChartNoAxesColumn,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

import { getAdminServiceRequests } from "../../services/adminService";

function AdminServiceRequests() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminServiceRequests();
            const serviceRequests = Array.isArray(data.service_requests)
                ? data.service_requests
                : [];

            setRequests(serviceRequests);
            setCount(
                typeof data.count === "number"
                    ? data.count
                    : serviceRequests.length
            );
        } catch (err) {
            setError(err.message || "Failed to load service requests.");
        } finally {
            setLoading(false);
        }
    }

    const categoryStats = useMemo(() => {
        const totals = {};

        requests.forEach((request) => {
            const title = request.service_title?.trim();

            if (!title) return;

            const key = title.toLowerCase();

            if (!totals[key]) {
                totals[key] = {
                    name: title,
                    total: 0,
                };
            }

            totals[key].total += 1;
        });

        return Object.values(totals).sort(
            (a, b) => b.total - a.total
        );
    }, [requests]);

    const mostRequested = categoryStats[0] || null;

    const leastRequested =
        categoryStats.length > 0
            ? categoryStats.reduce((least, current) =>
                  current.total < least.total ? current : least
              )
            : null;

    const maxRequests = Math.max(
        ...categoryStats.map((item) => item.total),
        1
    );

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#172A46]/10 border-t-[#C66A4A]" />
                    <p className="mt-4 text-sm text-[#172A46]/65">
                        Loading service analysis...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-5">
                <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/65 p-7 text-center shadow-xl backdrop-blur-xl">
                    <h1 className="text-lg font-semibold text-[#172A46]">
                        Unable to load service analysis
                    </h1>

                    <p className="mt-3 break-words text-sm text-[#172A46]/65">
                        {error}
                    </p>

                    <button
                        onClick={loadRequests}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#172A46] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#263F60]"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F4EDE5] text-[#172A46]">
            <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-[#C66A4A]/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 top-96 h-72 w-72 rounded-full bg-[#172A46]/10 blur-3xl" />

            <main className="relative mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="mb-5 inline-flex items-center gap-2 text-sm text-[#172A46]/65 transition hover:text-[#C66A4A]"
                        >
                            <ArrowLeft size={17} />
                            Back to dashboard
                        </button>

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C66A4A]">
                            Administration / Analytics
                        </p>

                        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                            Service Requests
                        </h1>

                        <p className="mt-2 text-sm text-[#172A46]/65">
                            Explore which services customers request most.
                        </p>
                    </div>

                    <button
                        onClick={loadRequests}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/80 bg-white/55 px-4 py-2.5 text-sm font-medium shadow-sm backdrop-blur-xl transition hover:bg-white/85"
                    >
                        <RefreshCw size={16} />
                        Refresh analysis
                    </button>
                </header>

                <section className="rounded-2xl border border-white/75 bg-white/55 p-5 shadow-xl shadow-[#172A46]/5 backdrop-blur-xl sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <ChartNoAxesColumn
                                    size={21}
                                    className="text-[#C66A4A]"
                                />
                                <h2 className="text-lg font-semibold">
                                    Requests by service
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-[#172A46]/60">
                                Each bar represents the number of requests
                                recorded for a service.
                            </p>
                        </div>

                        <div className="rounded-xl border border-white/80 bg-white/50 px-4 py-3">
                            <p className="text-xs text-[#172A46]/60">
                                Total requests
                            </p>
                            <p className="mt-1 text-2xl font-bold tabular-nums">
                                {count}
                            </p>
                        </div>
                    </div>

                    {categoryStats.length === 0 ? (
                        <div className="py-14 text-center">
                            <ChartNoAxesColumn
                                size={32}
                                className="mx-auto text-[#172A46]/35"
                            />
                            <h3 className="mt-4 font-semibold">
                                No service data available
                            </h3>
                            <p className="mt-2 text-sm text-[#172A46]/60">
                                Service analysis will appear when requests
                                containing a service title are returned.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 space-y-5">
                            {categoryStats.map((category) => {
                                const barWidth =
                                    (category.total / maxRequests) * 100;

                                return (
                                    <div key={category.name}>
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <span className="break-words text-sm font-medium">
                                                {category.name}
                                            </span>

                                            <span className="shrink-0 text-sm font-semibold tabular-nums">
                                                {category.total}
                                            </span>
                                        </div>

                                        <div
                                            className="h-3 overflow-hidden rounded-full bg-[#172A46]/10"
                                            role="progressbar"
                                            aria-label={`${category.name}: ${category.total} requests`}
                                            aria-valuemin={0}
                                            aria-valuemax={maxRequests}
                                            aria-valuenow={category.total}
                                        >
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#172A46] to-[#C66A4A] transition-all duration-500"
                                                style={{
                                                    width: `${barWidth}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {categoryStats.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#172A46]/10 pt-6 md:grid-cols-2">
                            <div className="rounded-xl border border-white/80 bg-white/45 p-5">
                                <div className="flex items-center gap-2 text-[#B65B3C]">
                                    <TrendingUp size={19} />
                                    <p className="text-sm font-medium">
                                        Most requested service
                                    </p>
                                </div>

                                <p className="mt-3 break-words text-xl font-bold">
                                    {mostRequested.name}
                                </p>

                                <p className="mt-1 text-sm text-[#172A46]/60">
                                    {mostRequested.total}{" "}
                                    {mostRequested.total === 1
                                        ? "request"
                                        : "requests"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/80 bg-white/45 p-5">
                                <div className="flex items-center gap-2 text-[#172A46]/70">
                                    <TrendingDown size={19} />
                                    <p className="text-sm font-medium">
                                        Least requested service
                                    </p>
                                </div>

                                <p className="mt-3 break-words text-xl font-bold">
                                    {leastRequested.name}
                                </p>

                                <p className="mt-1 text-sm text-[#172A46]/60">
                                    {leastRequested.total}{" "}
                                    {leastRequested.total === 1
                                        ? "request"
                                        : "requests"}
                                </p>
                            </div>
                        </div>
                    )}

                    <p className="mt-5 text-xs leading-5 text-[#172A46]/50">
                        The analysis updates when you refresh the data or
                        reload this page. Counts are based on the requests
                        returned by the current admin API endpoint.
                    </p>
                </section>
            </main>
        </div>
    );
}

export default AdminServiceRequests;

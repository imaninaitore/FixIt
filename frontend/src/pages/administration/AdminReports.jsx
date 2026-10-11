
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Users,
    BriefcaseBusiness,
    ClipboardList,
    CreditCard,
    Banknote,
    RefreshCw,
    ArrowLeft,
    ChartNoAxesCombined,
    CircleAlert,
} from "lucide-react";

import { getAdminReports } from "../../services/adminService";

const COLORS = {
    navy: "#172A46",
    terracotta: "#C66A4A",
    sand: "#FFFDF9",
    lightTerracotta: "#F2D8CC",
    slate: "#94A3B8",
    muted: "#64748B",
    green: "#5B9279",
    red: "#C65D5D",
    gold: "#D6A64F",
};

const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString("en-KE");

const formatCurrency = (value) =>
    `KSh ${Number(value ?? 0).toLocaleString("en-KE", {
        maximumFractionDigits: 2,
    })}`;

function GlassCard({ children, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-white/40 bg-white/85 shadow-lg shadow-slate-950/5 backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    accent = "terracotta",
    currency = false,
}) {
    const accentClasses = {
        terracotta: "bg-[#C66A4A]/10 text-[#C66A4A]",
        navy: "bg-[#172A46]/10 text-[#172A46]",
        green: "bg-emerald-100 text-emerald-700",
        red: "bg-red-100 text-red-700",
    };

    return (
        <GlassCard className="min-w-0 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-[#172A46] sm:text-3xl">
                        {currency
                            ? formatCurrency(value)
                            : formatNumber(value)}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}
                >
                    <Icon size={21} />
                </div>
            </div>

            {description && (
                <p className="mt-4 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            )}
        </GlassCard>
    );
}

function ChartCard({ title, subtitle, children, className = "" }) {
    return (
        <GlassCard className={`min-w-0 p-5 sm:p-6 ${className}`}>
            <div className="mb-5">
                <h2 className="text-base font-bold text-[#172A46] sm:text-lg">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>

            {children}
        </GlassCard>
    );
}

function EmptyChart({ message }) {
    return (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-5 text-center">
            <ChartNoAxesCombined
                size={28}
                className="text-slate-400"
            />
            <p className="mt-3 text-sm font-medium text-slate-600">
                No chart data available
            </p>
            <p className="mt-1 text-xs text-slate-400">{message}</p>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl">
            {label && (
                <p className="mb-2 text-xs font-semibold text-slate-500">
                    {label}
                </p>
            )}

            {payload.map((entry, index) => (
                <div
                    key={`${entry.name}-${index}`}
                    className="flex items-center gap-2 py-1"
                >
                    <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: entry.color || entry.fill }}
                    />
                    <span className="text-sm text-slate-600">
                        {entry.name}:
                    </span>
                    <span className="text-sm font-bold text-[#172A46]">
                        {formatNumber(entry.value)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function DonutChart({ title, subtitle, data, emptyMessage }) {
    const chartData = data.filter((item) => item.value > 0);

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <ChartCard title={title} subtitle={subtitle}>
            {total === 0 ? (
                <EmptyChart message={emptyMessage} />
            ) : (
                <>
                    <div className="relative h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="55%"
                                    outerRadius="78%"
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {chartData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    content={<CustomTooltip />}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs font-medium text-slate-500">
                                Total
                            </span>
                            <span className="mt-1 text-2xl font-bold text-[#172A46]">
                                {formatNumber(total)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 space-y-3">
                        {chartData.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between gap-3 text-sm"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <span
                                        className="h-3 w-3 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />
                                    <span className="truncate text-slate-600">
                                        {item.name}
                                    </span>
                                </div>

                                <div className="shrink-0 text-right">
                                    <span className="font-semibold text-[#172A46]">
                                        {formatNumber(item.value)}
                                    </span>
                                    <span className="ml-2 text-xs text-slate-400">
                                        {((item.value / total) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </ChartCard>
    );
}

function AdminReports() {
    const navigate = useNavigate();

    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReports();
    }, []);

    async function loadReports() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminReports();
            setReports(data);
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-white/30 border-t-[#C66A4A]" />
                    <p className="mt-4 text-sm font-medium text-white">
                        Loading platform reports...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-10">
                <GlassCard className="w-full max-w-md p-7 text-center sm:p-9">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <CircleAlert size={24} />
                    </div>

                    <h1 className="mt-4 text-xl font-bold text-[#172A46]">
                        Unable to load reports
                    </h1>

                    <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadReports}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#C66A4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#AD5639]"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                </GlassCard>
            </div>
        );
    }

    if (!reports) {
        return (
            <div className="p-8 text-center text-white">
                No report data was returned.
            </div>
        );
    }

    const usersTotal = Number(reports.users?.total ?? 0);

    const providersTotal = Number(
        reports.providers?.total_profiles ?? 0
    );

    const enrolmentsTotal = Number(
        reports.providers?.total_enrolments ?? 0
    );

    const approved = Number(
        reports.providers?.approved_enrolments ?? 0
    );

    const pending = Number(
        reports.providers?.pending_enrolments ?? 0
    );

    const rejected = Number(
        reports.providers?.rejected_enrolments ?? 0
    );

    const requestsTotal = Number(
        reports.service_requests?.total ?? 0
    );

    const paymentsTotal = Number(
        reports.payments?.total ?? 0
    );

    const completedPayments = Number(
        reports.payments?.completed ?? 0
    );

    const failedPayments = Number(
        reports.payments?.failed ?? 0
    );

    const revenue = Number(
        reports.payments?.total_revenue ?? 0
    );

    const overviewData = [
        { name: "Users", total: usersTotal, color: COLORS.navy },
        {
            name: "Provider Profiles",
            total: providersTotal,
            color: COLORS.terracotta,
        },
        {
            name: "Enrolments",
            total: enrolmentsTotal,
            color: COLORS.gold,
        },
        {
            name: "Service Requests",
            total: requestsTotal,
            color: COLORS.green,
        },
        {
            name: "Payments",
            total: paymentsTotal,
            color: COLORS.slate,
        },
    ];

    const enrolmentData = [
        { name: "Approved", value: approved, color: COLORS.green },
        { name: "Pending", value: pending, color: COLORS.gold },
        { name: "Rejected", value: rejected, color: COLORS.red },
    ];

    const paymentData = [
        {
            name: "Completed",
            value: completedPayments,
            color: COLORS.green,
        },
        {
            name: "Failed",
            value: failedPayments,
            color: COLORS.red,
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Page heading */}
            <header className="border-b border-white/20 bg-[#FFFDF9]/95 backdrop-blur-xl">
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/dashboard")}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#172A46] transition hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={17} />
                        Back to dashboard
                    </button>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C66A4A]">
                                Administration / Analytics
                            </p>

                            <h1 className="mt-2 text-2xl font-bold text-[#172A46] sm:text-3xl">
                                Platform Reports
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Visual insights into users, provider
                                enrolments, service requests, and
                                subscription payments.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadReports}
                            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#172A46]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#172A46] shadow-sm transition hover:border-[#C66A4A]/50 hover:text-[#C66A4A] sm:self-auto"
                        >
                            <RefreshCw size={16} />
                            Refresh reports
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* Summary metrics */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-white">
                            Key Metrics
                        </h2>
                        <p className="mt-1 text-sm text-slate-200">
                            Current totals returned by the reporting API.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            title="Total Users"
                            value={usersTotal}
                            description="Registered platform users"
                            icon={Users}
                            accent="navy"
                        />

                        <SummaryCard
                            title="Provider Profiles"
                            value={providersTotal}
                            description="Provider profiles recorded"
                            icon={BriefcaseBusiness}
                            accent="terracotta"
                        />

                        <SummaryCard
                            title="Service Requests"
                            value={requestsTotal}
                            description="Total recorded service requests"
                            icon={ClipboardList}
                            accent="green"
                        />

                        <SummaryCard
                            title="Total Revenue"
                            value={revenue}
                            description="Revenue value returned by the API"
                            icon={Banknote}
                            accent="navy"
                            currency
                        />
                    </div>
                </section>

                {/* Overview bar chart */}
                <section>
                    <ChartCard
                        title="Platform Overview"
                        subtitle="Comparison of reported totals across key areas"
                    >
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={overviewData}
                                    margin={{
                                        top: 10,
                                        right: 8,
                                        left: -18,
                                        bottom: 35,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E2E8F0"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tick={{
                                            fill: COLORS.muted,
                                            fontSize: 11,
                                        }}
                                        angle={-20}
                                        textAnchor="end"
                                        interval={0}
                                        height={65}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fill: COLORS.muted,
                                            fontSize: 11,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: "#172A46", opacity: 0.05 }}
                                    />

                                    <Bar
                                        dataKey="total"
                                        name="Total"
                                        radius={[7, 7, 0, 0]}
                                        maxBarSize={58}
                                    >
                                        {overviewData.map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </section>

                {/* Distribution charts */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-white">
                            Status Analysis
                        </h2>
                        <p className="mt-1 text-sm text-slate-200">
                            Distribution of provider enrolments and payment outcomes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <DonutChart
                            title="Provider Enrolments"
                            subtitle="Approved, pending, and rejected applications"
                            data={enrolmentData}
                            emptyMessage="No provider enrolment records have been reported."
                        />

                        <DonutChart
                            title="Payment Outcomes"
                            subtitle="Completed and failed payments reported by the API"
                            data={paymentData}
                            emptyMessage="No completed or failed payment records have been reported."
                        />
                    </div>
                </section>

                {/* Detailed provider and payment cards */}
                <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <GlassCard className="p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C66A4A]/10 text-[#C66A4A]">
                                <BriefcaseBusiness size={20} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#172A46]">
                                    Provider Breakdown
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Enrolment status totals
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-5">
                            {[
                                {
                                    label: "Approved",
                                    value: approved,
                                    color: COLORS.green,
                                },
                                {
                                    label: "Pending",
                                    value: pending,
                                    color: COLORS.gold,
                                },
                                {
                                    label: "Rejected",
                                    value: rejected,
                                    color: COLORS.red,
                                },
                            ].map((item) => {
                                const percentage =
                                    enrolmentsTotal > 0
                                        ? Math.min(
                                              (item.value / enrolmentsTotal) * 100,
                                              100
                                          )
                                        : 0;

                                return (
                                    <div key={item.label}>
                                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                            <span className="text-slate-600">
                                                {item.label}
                                            </span>
                                            <span className="font-semibold text-[#172A46]">
                                                {formatNumber(item.value)}
                                            </span>
                                        </div>

                                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Total Enrolments
                                </span>
                                <span className="font-bold text-[#172A46]">
                                    {formatNumber(enrolmentsTotal)}
                                </span>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172A46]/10 text-[#172A46]">
                                <CreditCard size={20} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#172A46]">
                                    Payment Breakdown
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Reported payment activity
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-4">
                                <p className="text-sm text-emerald-700">
                                    Completed
                                </p>
                                <p className="mt-2 text-2xl font-bold text-emerald-800">
                                    {formatNumber(completedPayments)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-red-100 bg-red-50/80 p-4">
                                <p className="text-sm text-red-700">
                                    Failed
                                </p>
                                <p className="mt-2 text-2xl font-bold text-red-800">
                                    {formatNumber(failedPayments)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-[#172A46]/10 bg-[#172A46]/5 p-4">
                            <p className="text-sm text-slate-500">
                                Total Payments
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[#172A46]">
                                {formatNumber(paymentsTotal)}
                            </p>
                        </div>

                        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                            <Banknote
                                size={16}
                                className="mt-0.5 shrink-0 text-[#C66A4A]"
                            />
                            <p>
                                Total revenue:{" "}
                                <span className="font-semibold text-[#172A46]">
                                    {formatCurrency(revenue)}
                                </span>
                            </p>
                        </div>
                    </GlassCard>
                </section>

                <footer className="border-t border-white/20 py-5 text-center text-xs text-slate-300">
                    FixIt Administration · Reports and analytics
                </footer>
            </main>
        </div>
    );
}

export default AdminReports;

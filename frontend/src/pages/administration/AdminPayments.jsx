import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";

import { getAdminPayments } from "../../services/adminService";

const PAYMENTS_PER_PAGE = 8;

function AdminPayments() {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminPayments();

            setPayments(data.payments || []);
            setCount(data.count || 0);
            setCurrentPage(1);
        } catch (err) {
            setError(err.message || "Failed to load payments.");
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.max(
        1,
        Math.ceil(payments.length / PAYMENTS_PER_PAGE)
    );

    const currentPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * PAYMENTS_PER_PAGE;

        return payments.slice(
            startIndex,
            startIndex + PAYMENTS_PER_PAGE
        );
    }, [payments, currentPage]);

    const firstPayment = payments.length
        ? (currentPage - 1) * PAYMENTS_PER_PAGE + 1
        : 0;

    const lastPayment = Math.min(
        currentPage * PAYMENTS_PER_PAGE,
        payments.length
    );

    function formatDate(date) {
        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString();
    }

    function getStatusClasses(status) {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "failed":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-amber-50 text-amber-700 border-amber-200";
        }
    }

    const glassPanel =
        "rounded-2xl border border-white/70 bg-white/65 shadow-[0_8px_30px_rgba(23,42,70,0.07)] backdrop-blur-xl";

    const paginationButton =
        "inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-[#172A46]/15 bg-white/75 px-3 text-sm font-medium text-[#172A46] transition hover:border-[#C66A4A]/60 hover:bg-[#F2D8CC]/50 disabled:cursor-not-allowed disabled:opacity-40";

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F4EDE5] via-[#FFFDF9] to-[#F2D8CC]/70 px-4">
                <div className={`${glassPanel} p-8 text-center`}>
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#172A46]/10 border-t-[#C66A4A]" />

                    <p className="mt-4 text-sm font-medium text-[#172A46]">
                        Loading payments...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F4EDE5] via-[#FFFDF9] to-[#F2D8CC]/70 px-4 py-8">
                <div className={`${glassPanel} w-full max-w-md p-6 text-center sm:p-8`}>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2D8CC]/70 text-[#172A46]">
                        <CreditCard size={23} />
                    </div>

                    <h1 className="mt-4 text-xl font-semibold text-[#172A46]">
                        Unable to load payments
                    </h1>

                    <p className="mt-3 break-words text-sm leading-6 text-[#172A46]/70">
                        {error}
                    </p>

                    <button
                        onClick={loadPayments}
                        className="mt-6 rounded-lg bg-[#172A46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243D60]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4EDE5] via-[#FFFDF9] to-[#F2D8CC]/70 text-[#172A46]">
            {/* Header */}
            <header className="relative overflow-hidden border-b border-white/20 bg-gradient-to-br from-[#172A46] via-[#203957] to-[#8C5145]">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#C66A4A]/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#F2D8CC]/15 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </button>

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2D8CC]">
                                Administration
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Payments
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                                Monitor provider subscription payments and transaction records.
                            </p>
                        </div>

                        <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-xl sm:w-auto sm:min-w-48">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2D8CC]/15 text-[#F2D8CC]">
                                    <CreditCard size={21} />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-white/65">
                                        Total Payments
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-white">
                                        {count}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {payments.length === 0 ? (
                    <section className={`${glassPanel} px-5 py-12 text-center sm:px-8`}>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2D8CC]/70 text-[#172A46]">
                            <CreditCard size={25} />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-[#172A46]">
                            No payments found
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#172A46]/65">
                            There are currently no payments recorded.
                        </p>
                    </section>
                ) : (
                    <section className={`${glassPanel} overflow-hidden`}>
                        <div className="flex flex-col gap-3 border-b border-[#172A46]/10 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[#172A46]">
                                    Payment Records
                                </h2>

                                <p className="mt-1 text-sm text-[#172A46]/60">
                                    Subscription transactions recorded by FixIt.
                                </p>
                            </div>

                            <span className="w-fit rounded-full border border-[#C66A4A]/20 bg-[#F2D8CC]/50 px-3 py-1.5 text-xs font-semibold text-[#172A46]">
                                {payments.length} records loaded
                            </span>
                        </div>

                        {/* Scrollable table on smaller screens */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1050px] border-collapse text-left">
                                <thead className="border-b border-[#172A46]/10 bg-[#172A46]/[0.035]">
                                    <tr>
                                        {[
                                            "Payment",
                                            "Provider",
                                            "Phone",
                                            "Plan",
                                            "Amount",
                                            "Transaction",
                                            "Date",
                                            "Status",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#172A46]/60"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#172A46]/[0.07]">
                                    {currentPayments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="transition hover:bg-[#F2D8CC]/25"
                                        >
                                            <td className="whitespace-nowrap px-5 py-5">
                                                <span className="font-semibold text-[#172A46]">
                                                    #{payment.id}
                                                </span>
                                            </td>

                                            <td className="px-5 py-5">
                                                <p className="font-medium text-[#172A46]">
                                                    {payment.provider_username || "Unknown provider"}
                                                </p>

                                                <p className="mt-1 text-xs text-[#172A46]/55">
                                                    ID: {payment.provider_id ?? "Not available"}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-5 text-sm text-[#172A46]/75">
                                                {payment.phone_number || "Not provided"}
                                            </td>

                                            <td className="px-5 py-5 text-sm text-[#172A46]/75">
                                                {payment.plan || "Not specified"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-5">
                                                <span className="font-semibold text-[#172A46]">
                                                    KSh {payment.amount ?? "0.00"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-5">
                                                <span className="font-mono text-xs text-[#172A46]/75">
                                                    {payment.transaction_code || "Not available"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-5 text-sm text-[#172A46]/65">
                                                {formatDate(payment.payment_date)}
                                            </td>

                                            <td className="px-5 py-5">
                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                                        payment.status
                                                    )}`}
                                                >
                                                    {payment.status || "Unknown"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-4 border-t border-[#172A46]/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-sm text-[#172A46]/65">
                                Showing{" "}
                                <span className="font-semibold text-[#172A46]">
                                    {firstPayment}–{lastPayment}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-[#172A46]">
                                    {payments.length}
                                </span>{" "}
                                payments
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) => Math.max(1, page - 1))
                                    }
                                    disabled={currentPage === 1}
                                    className={paginationButton}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                    <span>Previous</span>
                                </button>

                                <span className="px-2 text-sm font-medium text-[#172A46]">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(totalPages, page + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className={paginationButton}
                                    aria-label="Next page"
                                >
                                    <span>Next</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default AdminPayments;

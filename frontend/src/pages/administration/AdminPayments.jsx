import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import {
    getAdminPayments,
    approveAdminPayment,
    rejectAdminPayment,
} from "../../services/adminService";

const PAYMENTS_PER_PAGE = 8;

function AdminPayments() {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingId, setProcessingId] = useState(null);
    const [paymentModal, setPaymentModal] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments(showLoading = true) {
        try {
            if (showLoading) {
                setLoading(true);
            }

            setError("");

            const data = await getAdminPayments();
            const records = data.payments || [];

            setPayments(records);
            setCount(data.count ?? records.length);

            const pageCount = Math.max(
                1,
                Math.ceil(records.length / PAYMENTS_PER_PAGE)
            );

            setCurrentPage((page) => Math.min(page, pageCount));
        } catch (err) {
            setError(err.message || "Failed to load payments.");
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }

    function requestPaymentAction(payment, action) {
        setPaymentModal({
            type: "confirm",
            action,
            payment,
        });
    }

    async function confirmPaymentAction() {
        if (!paymentModal || modalLoading) return;

        const { payment, action } = paymentModal;
        const isApproval = action === "approve";

        try {
            setModalLoading(true);
            setProcessingId(payment.id);

            if (isApproval) {
                await approveAdminPayment(payment.id);
            } else {
                await rejectAdminPayment(payment.id);
            }

            setPaymentModal({
                type: "success",
                action,
                payment,
                message: isApproval
                    ? "The payment has been approved successfully."
                    : "The payment has been rejected successfully.",
            });

            await loadPayments(false);
        } catch (err) {
            setPaymentModal({
                type: "error",
                action,
                payment,
                message:
                    err.message || "Unable to update this payment.",
            });
        } finally {
            setModalLoading(false);
            setProcessingId(null);
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

    const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    function formatDate(date) {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString();
    }

    function getStatusClasses(status) {
        switch (status?.toLowerCase()) {
            case "completed":
                return "border-emerald-200 bg-emerald-50 text-emerald-700";

            case "failed":
                return "border-red-200 bg-red-50 text-red-700";

            default:
                return "border-amber-200 bg-amber-50 text-amber-700";
        }
    }

    function canReviewPayment(payment) {
        const status = payment.status?.toLowerCase();

        return status !== "completed" && status !== "failed";
    }

    const glassPanel =
        "rounded-2xl border border-white/70 bg-white/75 shadow-[0_8px_30px_rgba(23,42,70,0.08)] backdrop-blur-xl";

    const paginationButton =
        "inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-[#172A46]/15 bg-white/80 px-3 text-sm font-medium text-[#172A46] transition hover:border-[#C66A4A]/60 hover:bg-[#F2D8CC]/60 disabled:cursor-not-allowed disabled:opacity-40";

    const pageButton =
        "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition";

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#D9C2AD] via-[#F4EDE5] to-[#F2D8CC] px-4">
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
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#D9C2AD] via-[#F4EDE5] to-[#F2D8CC] px-4 py-8">
                <div className={`${glassPanel} w-full max-w-md p-6 text-center sm:p-8`}>
                    <CreditCard
                        size={25}
                        className="mx-auto text-[#172A46]"
                    />

                    <h1 className="mt-4 text-xl font-semibold text-[#172A46]">
                        Unable to load payments
                    </h1>

                    <p className="mt-3 break-words text-sm leading-6 text-[#172A46]/70">
                        {error}
                    </p>

                    <button
                        onClick={() => loadPayments()}
                        className="mt-6 rounded-lg bg-[#172A46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243D60]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#D9C2AD] via-[#F4EDE5] to-[#F2D8CC] text-[#172A46]">
            <header className="relative overflow-hidden border-b border-white/20 bg-gradient-to-br from-[#172A46] via-[#203957] to-[#8C5145]">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#C66A4A]/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#F2D8CC]/20 blur-3xl" />

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
                                Review provider subscription payments,
                                verify transaction records, and manage
                                payment approvals.
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

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {payments.length === 0 ? (
                    <section className={`${glassPanel} px-5 py-12 text-center sm:px-8`}>
                        <CreditCard
                            size={25}
                            className="mx-auto text-[#172A46]"
                        />

                        <h2 className="mt-4 text-lg font-semibold">
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
                                <h2 className="text-lg font-semibold">
                                    Payment Records
                                </h2>

                                <p className="mt-1 text-sm text-[#172A46]/60">
                                    Review submitted transactions and
                                    take action on outstanding payments.
                                </p>
                            </div>

                            <span className="w-fit rounded-full border border-[#C66A4A]/20 bg-[#F2D8CC]/60 px-3 py-1.5 text-xs font-semibold">
                                {payments.length} records loaded
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1250px] border-collapse text-left">
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
                                            "Actions",
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
                                    {currentPayments.map((payment) => {
                                        const reviewable =
                                            canReviewPayment(payment);

                                        return (
                                            <tr
                                                key={payment.id}
                                                className="transition hover:bg-[#F2D8CC]/30"
                                            >
                                                <td className="whitespace-nowrap px-5 py-5 font-semibold">
                                                    #{payment.id}
                                                </td>

                                                <td className="px-5 py-5">
                                                    <p className="font-medium">
                                                        {payment.provider_username ||
                                                            "Unknown provider"}
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#172A46]/55">
                                                        ID:{" "}
                                                        {payment.provider_id ??
                                                            "Not available"}
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-5 text-sm text-[#172A46]/75">
                                                    {payment.phone_number ||
                                                        "Not provided"}
                                                </td>

                                                <td className="px-5 py-5 text-sm text-[#172A46]/75">
                                                    {payment.plan ||
                                                        "Not specified"}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-5 font-semibold">
                                                    KSh {payment.amount ?? "0.00"}
                                                </td>

                                                <td className="px-5 py-5">
                                                    <span className="font-mono text-xs text-[#172A46]/75">
                                                        {payment.transaction_code ||
                                                            "Not available"}
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

                                                <td className="px-5 py-5">
                                                    {reviewable ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    requestPaymentAction(
                                                                        payment,
                                                                        "approve"
                                                                    )
                                                                }
                                                                disabled={processingId !== null}
                                                                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#172A46] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#243D60] disabled:opacity-50"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                                Approve
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    requestPaymentAction(
                                                                        payment,
                                                                        "reject"
                                                                    )
                                                                }
                                                                disabled={processingId !== null}
                                                                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                                            >
                                                                <XCircle size={14} />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs font-medium text-[#172A46]/55">
                                                            No action needed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

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
                                        setCurrentPage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className={paginationButton}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>

                                {pageNumbers.map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        aria-current={
                                            currentPage === page
                                                ? "page"
                                                : undefined
                                        }
                                        className={`${pageButton} ${
                                            currentPage === page
                                                ? "border-[#172A46] bg-[#172A46] text-white shadow-sm"
                                                : "border-[#172A46]/15 bg-white/80 text-[#172A46] hover:border-[#C66A4A]/60 hover:bg-[#F2D8CC]/60"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

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
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {paymentModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172A46]/65 px-4 py-6 backdrop-blur-sm"
                    onClick={() => {
                        if (!modalLoading) setPaymentModal(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="payment-modal-title"
                        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-[#FFFDF9] via-[#FFFDF9] to-[#F2D8CC]/60 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="h-1.5 bg-gradient-to-r from-[#172A46] via-[#C66A4A] to-[#F2D8CC]" />

                        <div className="p-6 sm:p-7">
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                                    paymentModal.type === "error"
                                        ? "bg-red-50 text-red-600"
                                        : paymentModal.type === "success"
                                          ? "bg-emerald-50 text-emerald-700"
                                          : paymentModal.action === "approve"
                                            ? "bg-[#F2D8CC] text-[#172A46]"
                                            : "bg-red-50 text-red-600"
                                }`}
                            >
                                {paymentModal.type === "success" ? (
                                    <CheckCircle2 size={27} />
                                ) : paymentModal.type === "error" ? (
                                    <XCircle size={27} />
                                ) : paymentModal.action === "approve" ? (
                                    <CheckCircle2 size={27} />
                                ) : (
                                    <XCircle size={27} />
                                )}
                            </div>

                            <h2
                                id="payment-modal-title"
                                className="mt-5 text-xl font-bold text-[#172A46]"
                            >
                                {paymentModal.type === "success"
                                    ? "Payment updated"
                                    : paymentModal.type === "error"
                                      ? "Action unsuccessful"
                                      : paymentModal.action === "approve"
                                        ? "Approve payment?"
                                        : "Reject payment?"}
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[#172A46]/70">
                                {paymentModal.type === "confirm"
                                    ? paymentModal.action === "approve"
                                        ? `Are you sure you want to approve payment #${paymentModal.payment.id} from ${paymentModal.payment.provider_username || "this provider"}?`
                                        : `Are you sure you want to reject payment #${paymentModal.payment.id} from ${paymentModal.payment.provider_username || "this provider"}?`
                                    : paymentModal.message}
                            </p>

                            {paymentModal.type === "confirm" && (
                                <div className="mt-4 rounded-xl border border-[#172A46]/10 bg-[#F4EDE5]/80 p-4">
                                    <div className="flex justify-between gap-4 text-sm">
                                        <span className="text-[#172A46]/60">
                                            Transaction
                                        </span>

                                        <span className="break-all text-right font-medium text-[#172A46]">
                                            {paymentModal.payment.transaction_code ||
                                                "Not provided"}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex justify-between gap-4 text-sm">
                                        <span className="text-[#172A46]/60">
                                            Amount
                                        </span>

                                        <span className="font-semibold text-[#172A46]">
                                            KSh {paymentModal.payment.amount ?? "0.00"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                {paymentModal.type === "confirm" ? (
                                    <>
                                        <button
                                            type="button"
                                            disabled={modalLoading}
                                            onClick={() => setPaymentModal(null)}
                                            className="rounded-lg border border-[#172A46]/15 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#172A46] transition hover:bg-[#F4EDE5] disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            disabled={modalLoading}
                                            onClick={confirmPaymentAction}
                                            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                paymentModal.action === "approve"
                                                    ? "bg-[#172A46] hover:bg-[#243D60]"
                                                    : "bg-[#A94442] hover:bg-[#8F3533]"
                                            }`}
                                        >
                                            {modalLoading && (
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            )}

                                            {modalLoading
                                                ? "Processing..."
                                                : paymentModal.action === "approve"
                                                  ? "Confirm Approval"
                                                  : "Confirm Rejection"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setPaymentModal(null)}
                                        className="rounded-lg bg-[#172A46] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243D60]"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPayments;


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    FileText,
    Building2,
    UserRound,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertCircle,
    X,
} from "lucide-react";

import {
    getAdminEnrolment,
    approveEnrolment,
    rejectEnrolment,
    downloadQualificationDocument,
} from "../../services/adminService";

function AdminEnrolmentDetails() {
    const { enrolmentId } = useParams();
    const navigate = useNavigate();

    const [enrolment, setEnrolment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [documentLoading, setDocumentLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        loadEnrolment();
    }, [enrolmentId]);

    async function loadEnrolment(showLoading = true) {
        try {
            if (showLoading) setLoading(true);
            setError("");

            const data = await getAdminEnrolment(enrolmentId);
            setEnrolment(data);
        } catch (err) {
            setError(err.message || "Unable to load enrolment.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }

    function requestConfirmation(action) {
        setConfirmAction({
            type: "confirm",
            action,
            message:
                action === "approve"
                    ? "Are you sure you want to approve this provider enrolment?"
                    : "Are you sure you want to reject this provider enrolment?",
        });
    }

    async function handleApprove() {
        try {
            setActionLoading(true);
            setError("");

            const data = await approveEnrolment(enrolmentId);

            setConfirmAction({
                type: "success",
                action: "approve",
                message:
                    data.message ||
                    "Provider enrolment approved successfully.",
            });

            await loadEnrolment(false);
        } catch (err) {
            setConfirmAction({
                type: "error",
                action: "approve",
                message:
                    err.message || "Failed to approve enrolment.",
            });
        } finally {
            setActionLoading(false);
        }
    }

    async function handleReject() {
        try {
            setActionLoading(true);
            setError("");

            const data = await rejectEnrolment(enrolmentId);

            setConfirmAction({
                type: "success",
                action: "reject",
                message:
                    data.message ||
                    "Provider enrolment rejected successfully.",
            });

            await loadEnrolment(false);
        } catch (err) {
            setConfirmAction({
                type: "error",
                action: "reject",
                message:
                    err.message || "Failed to reject enrolment.",
            });
        } finally {
            setActionLoading(false);
        }
    }

    async function confirmDecision() {
        if (!confirmAction || actionLoading) return;

        if (confirmAction.action === "approve") {
            await handleApprove();
        } else {
            await handleReject();
        }
    }

    async function handleDownloadDocument() {
        try {
            setDocumentLoading(true);
            setError("");

            await downloadQualificationDocument(enrolmentId);
        } catch (err) {
            setError(
                err.message ||
                    "Failed to download qualification document."
            );
        } finally {
            setDocumentLoading(false);
        }
    }

    function getStatusStyle(status) {
        const styles = {
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
            submitted: "bg-[#F2D8CC] text-[#9A4B32]",
            draft: "bg-gray-100 text-gray-700",
            withdrawn: "bg-gray-100 text-gray-700",
            pending: "bg-amber-100 text-amber-700",
            completed: "bg-green-100 text-green-700",
            failed: "bg-red-100 text-red-700",
        };

        return styles[status] || "bg-gray-100 text-gray-700";
    }

    function formatDate(value) {
        if (!value) return "Not provided";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleDateString("en-KE", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function formatDateTime(value) {
        if (!value) return "Not available";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return String(value);
        }

        return date.toLocaleString("en-KE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function displayValue(value) {
        return value !== null && value !== undefined && value !== ""
            ? value
            : "Not provided";
    }

    function Detail({ label, value }) {
        return (
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
                    {label}
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-900">
                    {displayValue(value)}
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#172A46] via-[#D9C2AD] to-[#F2D8CC] px-4">
                <div className="rounded-xl bg-[#FFFDF9] px-6 py-5 text-center shadow-sm">
                    <p className="text-sm text-gray-600">
                        Loading enrolment...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !enrolment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#172A46] via-[#D9C2AD] to-[#F2D8CC] px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate("/admin/enrolments")}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#172A46] transition hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={16} />
                        Back to Enrolments
                    </button>

                    <div className="rounded-xl border border-red-200 bg-[#FFFDF9] p-5 shadow-sm sm:p-6">
                        <h2 className="font-semibold text-red-800">
                            Unable to load enrolment
                        </h2>
                        <p className="mt-2 text-sm text-red-700">{error}</p>
                        <button
                            onClick={() => loadEnrolment()}
                            className="mt-4 rounded-lg bg-[#172A46] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#244866]"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!enrolment) return null;

    const payments = Array.isArray(enrolment.payments)
        ? enrolment.payments
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#172A46] via-[#D9C2AD] to-[#F2D8CC]">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#172A46] to-[#35435B] text-white shadow-md">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                    <button
                        onClick={() => navigate("/admin/enrolments")}
                        className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white sm:text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Enrolments
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="text-xl font-bold sm:text-2xl">
                                Provider Enrolment #{enrolment.id}
                            </h1>
                            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                                Review the provider's application, documents,
                                and payment information.
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                                enrolment.status
                            )}`}
                        >
                            {enrolment.status || "Unknown"}
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
                {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                        <button
                            onClick={() => setError("")}
                            className="ml-auto text-red-700 hover:text-red-900"
                            aria-label="Dismiss error"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-5">
                    <div className="min-w-0 space-y-4 lg:col-span-2">
                        {/* Business Information */}
                        <section className="rounded-xl border border-[#E7D8C5] bg-[#FFFDF9]/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#172A46]">
                                    <Building2 size={19} />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#172A46] sm:text-lg">
                                        Business Information
                                    </h2>
                                    <p className="text-xs text-gray-500 sm:text-sm">
                                        Details submitted by the applicant
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
                                <Detail
                                    label="Business Name"
                                    value={enrolment.business_name}
                                />
                                <Detail
                                    label="Service Category"
                                    value={enrolment.service_category}
                                />
                                <Detail
                                    label="County / Location"
                                    value={enrolment.location}
                                />
                                <Detail
                                    label="Years of Experience"
                                    value={
                                        enrolment.years_of_experience !== null &&
                                        enrolment.years_of_experience !== undefined
                                            ? `${enrolment.years_of_experience} years`
                                            : null
                                    }
                                />
                                <Detail
                                    label="Business Phone"
                                    value={enrolment.phone_number}
                                />
                                <Detail
                                    label="Application Submitted"
                                    value={formatDateTime(enrolment.created_at)}
                                />
                                <Detail
                                    label="Last Updated"
                                    value={formatDateTime(enrolment.updated_at)}
                                />
                                <Detail
                                    label="Provider Username"
                                    value={enrolment.provider}
                                />
                                <Detail
                                    label="Provider Email"
                                    value={enrolment.provider_email}
                                />
                                <Detail
                                    label="Provider ID"
                                    value={enrolment.provider_id}
                                />
                            </div>

                            <div className="mt-5 border-t border-gray-100 pt-4">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
                                    Service Description
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {displayValue(enrolment.description)}
                                </p>
                            </div>
                        </section>

                        {/* Referee Information */}
                        <section className="rounded-xl border border-[#E7D8C5] bg-[#FFFDF9]/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#172A46]">
                                    <UserRound size={19} />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#172A46] sm:text-lg">
                                        Referee Information
                                    </h2>
                                    <p className="text-xs text-gray-500 sm:text-sm">
                                        Contact details for reference checks
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <Detail
                                    label="Referee Name"
                                    value={enrolment.referee_name}
                                />
                                <Detail
                                    label="Referee Email"
                                    value={enrolment.referee_email}
                                />
                                <Detail
                                    label="Referee Phone"
                                    value={enrolment.referee_phone}
                                />
                            </div>
                        </section>

                        {/* Qualification Document */}
                        <section className="rounded-xl border border-[#E7D8C5] bg-[#FFFDF9]/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#172A46]">
                                        <FileText size={19} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-[#172A46] sm:text-lg">
                                            Qualification Document
                                        </h2>
                                        <p className="text-xs text-gray-500 sm:text-sm">
                                            Professional certificate or qualification evidence
                                        </p>
                                    </div>
                                </div>

                                {enrolment.has_qualification_document && (
                                    <button
                                        onClick={handleDownloadDocument}
                                        disabled={documentLoading}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#172A46] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#244866] disabled:opacity-60 sm:text-sm"
                                    >
                                        <Download size={15} />
                                        {documentLoading
                                            ? "Downloading..."
                                            : "Download Document"}
                                    </button>
                                )}
                            </div>

                            <div className="mt-4 rounded-lg bg-[#F4EDE5] p-3">
                                <p className="break-all text-sm font-medium text-gray-800">
                                    {displayValue(
                                        enrolment.qualification_document
                                    )}
                                </p>

                                {!enrolment.has_qualification_document && (
                                    <p className="mt-1 text-xs text-red-600 sm:text-sm">
                                        No qualification document is available
                                        for this application.
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Payment Information */}
                        <section className="rounded-xl border border-[#E7D8C5] bg-[#FFFDF9]/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#172A46]">
                                    <CreditCard size={19} />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#172A46] sm:text-lg">
                                        Payment Information
                                    </h2>
                                    <p className="text-xs text-gray-500 sm:text-sm">
                                        Payment records for this application
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <Detail
                                    label="Enrolment Payment Status"
                                    value={enrolment.payment_status}
                                />
                                <Detail
                                    label="Payment Reference"
                                    value={enrolment.payment_reference}
                                />
                                <Detail
                                    label="Paid At"
                                    value={formatDateTime(enrolment.paid_at)}
                                />
                            </div>

                            {payments.length === 0 ? (
                                <div className="mt-4 rounded-lg bg-[#F4EDE5] p-3 text-sm text-gray-600">
                                    No payment records were returned for this
                                    application.
                                </div>
                            ) : (
                                <div className="mt-4 overflow-x-auto rounded-lg border border-gray-100">
                                    <table className="w-full min-w-[600px] text-left text-sm">
                                        <thead className="bg-[#F4EDE5]">
                                            <tr className="text-[10px] uppercase tracking-wide text-[#172A46] sm:text-xs">
                                                <th className="px-3 py-2.5">Transaction</th>
                                                <th className="px-3 py-2.5">Amount</th>
                                                <th className="px-3 py-2.5">Phone</th>
                                                <th className="px-3 py-2.5">Payment Date</th>
                                                <th className="px-3 py-2.5">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {payments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="px-3 py-3">
                                                        <p className="font-medium text-gray-900">
                                                            {displayValue(
                                                                payment.transaction_code
                                                            )}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-gray-500">
                                                            {displayValue(payment.plan)}
                                                        </p>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3 text-gray-800">
                                                        KES {displayValue(payment.amount)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3 text-gray-700">
                                                        {displayValue(payment.phone_number)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3 text-gray-700">
                                                        {formatDate(payment.payment_date)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold capitalize sm:text-xs ${getStatusStyle(
                                                                payment.status
                                                            )}`}
                                                        >
                                                            {displayValue(payment.status)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Review sidebar */}
                    <aside className="min-w-0 space-y-4 lg:sticky lg:top-5">
                        <section className="rounded-xl border border-[#E7D8C5] bg-[#FFFDF9]/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                            <div className="flex items-center gap-3">
                                <ShieldCheck
                                    size={21}
                                    className="shrink-0 text-[#C66A4A]"
                                />
                                <h2 className="text-base font-semibold text-[#172A46] sm:text-lg">
                                    Review Decision
                                </h2>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Check the submitted details, qualification
                                document, and payment record before deciding
                                whether to approve this provider.
                            </p>

                            {enrolment.status === "submitted" ? (
                                <div className="mt-5 space-y-2">
                                    <button
                                        onClick={() =>
                                            requestConfirmation("approve")
                                        }
                                        disabled={actionLoading}
                                        className="w-full rounded-lg bg-[#172A46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244866] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Approve Enrolment
                                    </button>

                                    <button
                                        onClick={() =>
                                            requestConfirmation("reject")
                                        }
                                        disabled={actionLoading}
                                        className="w-full rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Reject Enrolment
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-lg bg-[#F4EDE5] p-3">
                                    <p className="text-sm font-medium capitalize text-[#172A46]">
                                        Application {enrolment.status || "processed"}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                                        No review action is available for this
                                        application status.
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-xl border border-[#E7D8C5] bg-[#FFFDF9]/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
                            <h2 className="text-base font-semibold text-[#172A46]">
                                Navigation
                            </h2>

                            <button
                                onClick={() => navigate("/admin/enrolments")}
                                className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#F4EDE5]"
                            >
                                Back to All Enrolments
                            </button>

                            <button
                                onClick={() => navigate("/admin/dashboard")}
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-[#F4EDE5]"
                            >
                                Admin Dashboard
                            </button>
                        </section>
                    </aside>
                </div>
            </main>

            {/* Confirmation and result modal */}
            {confirmAction && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#172A46]/60 px-4 py-6 backdrop-blur-sm"
                    onClick={() => {
                        if (!actionLoading) setConfirmAction(null);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="enrolment-modal-title"
                        className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#E7D8C5] bg-[#FFFDF9] shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="h-1.5 bg-gradient-to-r from-[#172A46] via-[#C66A4A] to-[#F2D8CC]" />

                        <div className="p-5 sm:p-6">
                            <div
                                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${
                                    confirmAction.type === "success"
                                        ? "bg-green-100 text-green-700"
                                        : confirmAction.type === "error"
                                          ? "bg-red-100 text-red-600"
                                          : confirmAction.action === "reject"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-[#F2D8CC] text-[#C66A4A]"
                                }`}
                            >
                                {confirmAction.type === "success" ? (
                                    <CheckCircle2 size={23} />
                                ) : confirmAction.type === "error" ? (
                                    <AlertCircle size={23} />
                                ) : confirmAction.action === "reject" ? (
                                    <XCircle size={23} />
                                ) : (
                                    <ShieldCheck size={23} />
                                )}
                            </div>

                            <h2
                                id="enrolment-modal-title"
                                className="text-lg font-bold text-[#172A46]"
                            >
                                {confirmAction.type === "success"
                                    ? "Decision Completed"
                                    : confirmAction.type === "error"
                                      ? "Action Unsuccessful"
                                      : confirmAction.action === "approve"
                                        ? "Approve Enrolment?"
                                        : "Reject Enrolment?"}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                {confirmAction.message}
                            </p>

                            {confirmAction.type === "confirm" && (
                                <div className="mt-3 rounded-lg bg-[#F4EDE5] px-3 py-2.5">
                                    <p className="text-sm font-semibold text-[#172A46]">
                                        Provider Enrolment #{enrolment.id}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {enrolment.business_name ||
                                            enrolment.provider ||
                                            "Provider"}
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                {confirmAction.type === "confirm" ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConfirmAction(null)
                                            }
                                            disabled={actionLoading}
                                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={confirmDecision}
                                            disabled={actionLoading}
                                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                confirmAction.action === "approve"
                                                    ? "bg-[#172A46] hover:bg-[#244866]"
                                                    : "bg-red-600 hover:bg-red-700"
                                            }`}
                                        >
                                            {actionLoading
                                                ? "Processing..."
                                                : confirmAction.action === "approve"
                                                  ? "Yes, Approve"
                                                  : "Yes, Reject"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setConfirmAction(null)
                                        }
                                        className="rounded-lg bg-[#172A46] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244866]"
                                    >
                                        Okay
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

export default AdminEnrolmentDetails;

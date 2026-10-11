
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
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        loadEnrolment();
    }, [enrolmentId]);

    async function loadEnrolment() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminEnrolment(enrolmentId);
            setEnrolment(data);
        } catch (err) {
            setError(err.message || "Unable to load enrolment.");
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove() {
        if (
            !window.confirm(
                "Are you sure you want to approve this provider enrolment?"
            )
        ) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setActionMessage("");

            const data = await approveEnrolment(enrolmentId);

            setActionMessage(
                data.message || "Provider enrolment approved successfully."
            );

            await loadEnrolment();
        } catch (err) {
            setError(err.message || "Failed to approve enrolment.");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleReject() {
        if (
            !window.confirm(
                "Are you sure you want to reject this provider enrolment?"
            )
        ) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setActionMessage("");

            const data = await rejectEnrolment(enrolmentId);

            setActionMessage(
                data.message || "Provider enrolment rejected successfully."
            );

            await loadEnrolment();
        } catch (err) {
            setError(err.message || "Failed to reject enrolment.");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDownloadDocument() {
        try {
            setDocumentLoading(true);
            setError("");

            await downloadQualificationDocument(enrolmentId);
        } catch (err) {
            setError(
                err.message || "Failed to download qualification document."
            );
        } finally {
            setDocumentLoading(false);
        }
    }

    function getStatusStyle(status) {
        const styles = {
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
            submitted: "bg-yellow-100 text-yellow-800",
            draft: "bg-gray-100 text-gray-700",
            withdrawn: "bg-gray-100 text-gray-700",
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
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
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
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading enrolment...
                </p>
            </div>
        );
    }

    if (error && !enrolment) {
        return (
            <div className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate("/admin/enrolments")}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#17324D] hover:text-[#C66A4A]"
                    >
                        <ArrowLeft size={16} />
                        Back to Enrolments
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h2 className="font-semibold text-red-800">
                            Unable to load enrolment
                        </h2>
                        <p className="mt-2 text-sm text-red-700">{error}</p>
                        <button
                            onClick={loadEnrolment}
                            className="mt-4 rounded-lg bg-[#17324D] px-4 py-2 text-sm font-medium text-white"
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
        <div className="min-h-screen bg-[#F8F5F0]">
            <header className="bg-[#17324D] text-white">
                <div className="mx-auto max-w-7xl px-6 py-6">
                    <button
                        onClick={() => navigate("/admin/enrolments")}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to Enrolments
                    </button>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Provider Enrolment #{enrolment.id}
                            </h1>
                            <p className="mt-1 text-sm text-slate-300">
                                Review the provider's application, documents,
                                and payment information.
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusStyle(
                                enrolment.status
                            )}`}
                        >
                            {enrolment.status || "Unknown"}
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {actionMessage && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
                        {actionMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-xl border border-[#E7D8C5] bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#17324D]">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-[#17324D]">
                                        Business Information
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Details submitted by the applicant
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
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

                            <div className="mt-6 border-t border-gray-100 pt-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Service Description
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                    {displayValue(enrolment.description)}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-xl border border-[#E7D8C5] bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#17324D]">
                                    <UserRound size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-[#17324D]">
                                        Referee Information
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Contact details for reference checks
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
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

                        <section className="rounded-xl border border-[#E7D8C5] bg-white p-6 shadow-sm">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#17324D]">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#17324D]">
                                            Qualification Document
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Professional certificate or qualification
                                            evidence
                                        </p>
                                    </div>
                                </div>

                                {enrolment.has_qualification_document && (
                                    <button
                                        onClick={handleDownloadDocument}
                                        disabled={documentLoading}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17324D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244866] disabled:opacity-60"
                                    >
                                        <Download size={16} />
                                        {documentLoading
                                            ? "Downloading..."
                                            : "Download Document"}
                                    </button>
                                )}
                            </div>

                            <div className="mt-5 rounded-lg bg-gray-50 p-4">
                                <p className="break-all text-sm font-medium text-gray-800">
                                    {displayValue(
                                        enrolment.qualification_document
                                    )}
                                </p>
                                {!enrolment.has_qualification_document && (
                                    <p className="mt-2 text-sm text-red-600">
                                        No qualification document is available
                                        for this application.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-xl border border-[#E7D8C5] bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#F2D8CC] p-2 text-[#17324D]">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-[#17324D]">
                                        Payment Information
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Payment records associated with this
                                        application
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                                <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                                    No payment records were returned for this
                                    application.
                                </div>
                            ) : (
                                <div className="mt-6 overflow-x-auto">
                                    <table className="w-full min-w-[650px] text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                                <th className="px-3 py-3">Transaction</th>
                                                <th className="px-3 py-3">Amount</th>
                                                <th className="px-3 py-3">Phone</th>
                                                <th className="px-3 py-3">Payment Date</th>
                                                <th className="px-3 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((payment) => (
                                                <tr
                                                    key={payment.id}
                                                    className="border-b border-gray-100 last:border-0"
                                                >
                                                    <td className="px-3 py-4">
                                                        <p className="font-medium text-gray-900">
                                                            {payment.transaction_code}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {payment.plan}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-4 text-gray-800">
                                                        KES {payment.amount}
                                                    </td>
                                                    <td className="px-3 py-4 text-gray-700">
                                                        {displayValue(payment.phone_number)}
                                                    </td>
                                                    <td className="px-3 py-4 text-gray-700">
                                                        {formatDate(payment.payment_date)}
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(payment.status)}`}
                                                        >
                                                            {payment.status}
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

                    <aside className="space-y-6">
                        <section className="rounded-xl border border-[#E7D8C5] bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={22} className="text-[#C66A4A]" />
                                <h2 className="text-lg font-semibold text-[#17324D]">
                                    Review Decision
                                </h2>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Check the submitted details, qualification
                                document, and payment record before deciding
                                whether to approve this provider.
                            </p>

                            {enrolment.status === "submitted" ? (
                                <div className="mt-6 space-y-3">
                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className="w-full rounded-lg bg-[#17324D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244866] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionLoading
                                            ? "Processing..."
                                            : "Approve Enrolment"}
                                    </button>

                                    <button
                                        onClick={handleReject}
                                        disabled={actionLoading}
                                        className="w-full rounded-lg border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionLoading
                                            ? "Processing..."
                                            : "Reject Enrolment"}
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm font-medium capitalize text-gray-800">
                                        Application {enrolment.status || "processed"}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        No review action is available for this
                                        application status.
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-xl border border-[#E7D8C5] bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#17324D]">
                                Navigation
                            </h2>

                            <button
                                onClick={() => navigate("/admin/enrolments")}
                                className="mt-4 w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Back to All Enrolments
                            </button>

                            <button
                                onClick={() => navigate("/admin/dashboard")}
                                className="mt-3 w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Admin Dashboard
                            </button>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default AdminEnrolmentDetails;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAdminEnrolment,
    approveEnrolment,
    rejectEnrolment,
} from "../../services/adminService";

function AdminEnrolmentDetails() {
    const { enrolmentId } = useParams();
    const navigate = useNavigate();

    const [enrolment, setEnrolment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove() {
        const confirmed = window.confirm(
            "Are you sure you want to approve this provider enrolment?"
        );

        if (!confirmed) {
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
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleReject() {
        const confirmed = window.confirm(
            "Are you sure you want to reject this provider enrolment?"
        );

        if (!confirmed) {
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
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    }

    function getStatusStyle(status) {
        if (status === "approved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "rejected") {
            return "bg-red-100 text-red-700";
        }

        if (status === "submitted") {
            return "bg-yellow-100 text-yellow-700";
        }

        if (status === "draft") {
            return "bg-gray-100 text-gray-700";
        }

        return "bg-gray-100 text-gray-700";
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">
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
                        className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Enrolments
                    </button>

                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h2 className="font-semibold text-red-800">
                            Unable to load enrolment
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>
                    </div>

                </div>
            </div>
        );
    }

    if (!enrolment) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-slate-900 text-white">
                <div className="mx-auto max-w-7xl px-6 py-6">

                    <button
                        onClick={() => navigate("/admin/enrolments")}
                        className="mb-4 text-sm font-medium text-slate-300 transition hover:text-white"
                    >
                        ← Back to Enrolments
                    </button>

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                        <div>
                            <h1 className="text-2xl font-bold">
                                Provider Enrolment #{enrolment.id}
                            </h1>

                            <p className="mt-1 text-sm text-slate-300">
                                Review this provider's enrolment application.
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
            </div>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Success message */}
                {actionMessage && (
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
                        {actionMessage}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Main information */}
                    <div className="lg:col-span-2">

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Enrolment Information
                            </h2>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Enrolment ID
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">
                                        #{enrolment.id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Provider
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">
                                        {enrolment.provider || "Unknown"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Status
                                    </p>

                                    <span
                                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                            enrolment.status
                                        )}`}
                                    >
                                        {enrolment.status || "Unknown"}
                                    </span>
                                </div>

                            </div>

                        </section>

                        {/* Submitted information */}
                        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Application Review
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Review the provider's submitted enrolment
                                information before approving or rejecting
                                the application.
                            </p>

                            <div className="mt-6 rounded-lg bg-gray-50 p-5">

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Provider
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {enrolment.provider || "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Application Status
                                        </p>

                                        <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
                                            {enrolment.status || "Not available"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>

                    {/* Right sidebar */}
                    <div>

                        <section className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Review Decision
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Approving an enrolment allows the provider
                                to become an approved service provider on
                                the platform.
                            </p>

                            {enrolment.status === "submitted" ? (
                                <div className="mt-6 space-y-3">

                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className="w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
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

                                    <p className="text-sm font-medium text-gray-700">
                                        No action required
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        This enrolment has already been{" "}
                                        {enrolment.status || "processed"}.
                                    </p>

                                </div>
                            )}

                        </section>

                        {/* Navigation */}
                        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Navigation
                            </h2>

                            <button
                                onClick={() =>
                                    navigate("/admin/enrolments")
                                }
                                className="mt-4 w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Back to All Enrolments
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/admin/dashboard")
                                }
                                className="mt-3 w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Admin Dashboard
                            </button>

                        </section>

                    </div>

                </div>

            </main>
        </div>
    );
}

export default AdminEnrolmentDetails;
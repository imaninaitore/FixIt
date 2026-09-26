import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminEnrolments,
} from "../../services/adminService";

function AdminEnrolments() {
    const navigate = useNavigate();

    const [enrolments, setEnrolments] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadEnrolments();
    }, []);

    async function loadEnrolments() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminEnrolments();

            setEnrolments(data.enrolments || []);
            setCount(data.count || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-slate-900 text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Provider Enrolments
                        </h1>

                        <p className="mt-1 text-sm text-slate-300">
                            Review and manage service provider applications.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Main content */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Summary */}
                <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Total Enrolments
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {count}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Pending Review
                        </p>

                        <p className="mt-2 text-3xl font-bold text-yellow-600">
                            {
                                enrolments.filter(
                                    (enrolment) =>
                                        enrolment.status === "submitted"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Approved
                        </p>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {
                                enrolments.filter(
                                    (enrolment) =>
                                        enrolment.status === "approved"
                                ).length
                            }
                        </p>
                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">
                            Loading provider enrolments...
                        </p>
                    </div>
                ) : enrolments.length === 0 ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            No enrolments found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            There are currently no provider enrolments to review.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                        {/* Table header */}
                        <div className="border-b border-gray-200 px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Provider Applications
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Select an enrolment to view the submitted information.
                            </p>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Enrolment ID
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Provider
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">

                                    {enrolments.map((enrolment) => (
                                        <tr
                                            key={enrolment.id}
                                            className="transition hover:bg-gray-50"
                                        >

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span className="font-semibold text-gray-900">
                                                    #{enrolment.id}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {enrolment.provider || "Unknown provider"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                        enrolment.status
                                                    )}`}
                                                >
                                                    {enrolment.status || "Unknown"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5 text-right">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/enrolments/${enrolment.id}`
                                                        )
                                                    }
                                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                                >
                                                    View Details
                                                </button>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default AdminEnrolments;
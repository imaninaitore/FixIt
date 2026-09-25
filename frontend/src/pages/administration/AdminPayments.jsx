import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminPayments,
} from "../../services/adminService";

function AdminPayments() {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(date) {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleString();
    }

    function getStatusClasses(status) {
        if (status === "completed") {
            return "bg-green-50 text-green-700";
        }

        if (status === "failed") {
            return "bg-red-50 text-red-700";
        }

        return "bg-yellow-50 text-yellow-700";
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading payments...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md text-center">

                    <h1 className="text-xl font-semibold text-gray-900">
                        Unable to load payments
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={loadPayments}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-blue-700">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="text-blue-100 hover:text-white text-sm mb-6"
                    >
                        Back to dashboard
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                        <div>
                            <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                                Administration
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                                Payments
                            </h1>

                            <p className="text-blue-100 mt-2">
                                Monitor provider subscription payments.
                            </p>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                            <p className="text-blue-200 text-xs uppercase tracking-wide">
                                Total Payments
                            </p>

                            <p className="text-white text-2xl font-bold mt-1">
                                {count}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">

                {payments.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">

                        <h2 className="text-xl font-semibold text-gray-900">
                            No payments found
                        </h2>

                        <p className="mt-2 text-gray-600">
                            There are currently no payments recorded.
                        </p>

                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                        <div className="px-6 py-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Payment Records
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Payment transactions recorded by FixIt.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">

                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Payment
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Provider
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Phone
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Plan
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Amount
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Transaction
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Date
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Status
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {payments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="hover:bg-gray-50 transition"
                                        >

                                            <td className="px-6 py-5">
                                                <span className="font-medium text-gray-900">
                                                    #{payment.id}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <p className="font-medium text-gray-900">
                                                    {payment.provider_username}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    ID: {payment.provider_id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5 text-gray-700">
                                                {payment.phone_number || "Not provided"}
                                            </td>

                                            <td className="px-6 py-5 text-gray-700">
                                                {payment.plan || "Not specified"}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="font-semibold text-gray-900">
                                                    KSh {payment.amount}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="font-mono text-sm text-gray-700">
                                                    {payment.transaction_code || "Not available"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-gray-600">
                                                {formatDate(payment.payment_date)}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusClasses(
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

                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminPayments;
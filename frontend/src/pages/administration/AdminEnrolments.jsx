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

            setEnrolments(data.provider_profiles || []);
            setCount(data.count || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading provider enrolments...
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
                        Unable to load enrolments
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={loadEnrolments}
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
                                Provider Enrolments
                            </h1>

                            <p className="text-blue-100 mt-2">
                                Review registered provider profiles.
                            </p>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                            <p className="text-blue-200 text-xs uppercase tracking-wide">
                                Total Profiles
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

                {enrolments.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No provider profiles found
                        </h2>

                        <p className="mt-2 text-gray-600">
                            There are currently no provider profiles available.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                        <div className="px-6 py-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Provider Profiles
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Select a profile to view its available details.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">

                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Profile ID
                                        </th>

                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Type
                                        </th>

                                        <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {enrolments.map((profile) => (
                                        <tr
                                            key={profile.id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-5">
                                                <span className="font-medium text-gray-900">
                                                    #{profile.id}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                                    Provider Profile
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/enrolments/${profile.id}`
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
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
            </div>
        </div>
    );
}

export default AdminEnrolments;
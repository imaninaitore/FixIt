import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAdminReports,
} from "../../services/adminService";

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
                        Loading reports...
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
                        Unable to load reports
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={loadReports}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    if (!reports) {
        return null;
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

                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                        Administration
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                        Reports
                    </h1>

                    <p className="text-blue-100 mt-2">
                        Overview of activity across the FixIt platform.
                    </p>

                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Users */}
                <section>

                    <h2 className="text-xl font-semibold text-gray-900">
                        Users
                    </h2>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">

                        <ReportCard
                            title="Total Users"
                            value={reports.users?.total ?? 0}
                        />

                    </div>

                </section>

                {/* Providers */}
                <section className="mt-10">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Providers
                    </h2>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                        <ReportCard
                            title="Provider Profiles"
                            value={reports.providers?.total_profiles ?? 0}
                        />

                        <ReportCard
                            title="Total Enrolments"
                            value={reports.providers?.total_enrolments ?? 0}
                        />

                        <ReportCard
                            title="Approved"
                            value={reports.providers?.approved_enrolments ?? 0}
                        />

                        <ReportCard
                            title="Pending"
                            value={reports.providers?.pending_enrolments ?? 0}
                        />

                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">

                        <ReportCard
                            title="Rejected"
                            value={reports.providers?.rejected_enrolments ?? 0}
                        />

                    </div>

                </section>

                {/* Service Requests */}
                <section className="mt-10">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Service Requests
                    </h2>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">

                        <ReportCard
                            title="Total Requests"
                            value={reports.service_requests?.total ?? 0}
                        />

                    </div>

                </section>

                {/* Payments */}
                <section className="mt-10">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Payments
                    </h2>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                        <ReportCard
                            title="Total Payments"
                            value={reports.payments?.total ?? 0}
                        />

                        <ReportCard
                            title="Completed"
                            value={reports.payments?.completed ?? 0}
                        />

                        <ReportCard
                            title="Failed"
                            value={reports.payments?.failed ?? 0}
                        />

                        <ReportCard
                            title="Total Revenue"
                            value={`KSh ${reports.payments?.total_revenue ?? 0}`}
                        />

                    </div>

                </section>

            </div>
        </div>
    );
}

function ReportCard({ title, value }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
                {value}
            </p>

        </div>
    );
}

export default AdminReports;
import { useEffect, useState } from "react";

import { getAdminDashboard } from "../../services/adminService";


function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadDashboard();
    }, []);


    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminDashboard();

            setDashboard(data);
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
                        Loading admin dashboard...
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
                        Unable to load dashboard
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={loadDashboard}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }


    if (!dashboard) {
        return null;
    }


    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-blue-700">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                        FixIt Administration
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                        Admin Dashboard
                    </h1>

                    <p className="text-blue-100 mt-3 max-w-2xl">
                        Monitor users, providers, service requests and platform
                        payments from one place.
                    </p>

                </div>
            </div>


            {/* Dashboard content */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* User statistics */}
                <section>

                    <h2 className="text-xl font-semibold text-gray-900">
                        Users
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Users
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {dashboard.users.total}
                            </p>
                        </div>


                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Customers
                            </p>

                            <p className="text-3xl font-bold text-blue-700 mt-2">
                                {dashboard.users.customers}
                            </p>
                        </div>


                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Provider Accounts
                            </p>

                            <p className="text-3xl font-bold text-blue-700 mt-2">
                                {dashboard.users.provider_accounts}
                            </p>
                        </div>

                    </div>

                </section>


                {/* Provider statistics */}
                <section className="mt-10">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Providers
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Provider Profiles
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {dashboard.providers.total_profiles}
                            </p>
                        </div>


                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Approved Providers
                            </p>

                            <p className="text-3xl font-bold text-blue-700 mt-2">
                                {dashboard.providers.approved}
                            </p>
                        </div>


                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Pending Providers
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {dashboard.providers.pending}
                            </p>
                        </div>

                    </div>

                </section>


                {/* Service requests */}
                <section className="mt-10">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Service Requests
                    </h2>

                    <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Total Service Requests
                        </p>

                        <p className="text-4xl font-bold text-blue-700 mt-2">
                            {dashboard.service_requests.total}
                        </p>

                    </div>

                </section>


                {/* Payment statistics */}
                <section className="mt-10">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Payments
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">

                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Payments
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {dashboard.payments.total}
                            </p>
                        </div>


                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Completed Payments
                            </p>

                            <p className="text-3xl font-bold text-blue-700 mt-2">
                                {dashboard.payments.completed}
                            </p>
                        </div>


                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Revenue
                            </p>

                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                KES {dashboard.payments.total_revenue}
                            </p>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}


export default AdminDashboard;
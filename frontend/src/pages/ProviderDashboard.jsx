import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getProvider,
} from "../services/providerService";
import {
    getMyProviderEnrolment,
} from "../services/providerEnrolmentService";

function ProviderDashboard() {
    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [enrolment, setEnrolment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            /*
             * The provider endpoint uses the logged-in user's account.
             * If your providerService currently only has getProvider(id),
             * we will add getMyProvider() to it.
             */

            const [providerData, enrolmentData] = await Promise.all([
                getMyProvider(),
                getMyProviderEnrolment(),
            ]);

            setProvider(providerData);
            setEnrolment(enrolmentData);

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
                        Loading your dashboard...
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
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Dashboard header */}
            <header className="bg-blue-700">

                <div className="max-w-7xl mx-auto px-6 py-10">

                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                        Provider Dashboard
                    </p>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                        <div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                                Welcome back
                            </h1>

                            <p className="text-blue-100 mt-2">
                                Manage your FixIt provider account.
                            </p>

                        </div>

                        <button
                            onClick={() => navigate("/providers")}
                            className="border border-white/30 text-white px-5 py-2.5 rounded-lg hover:bg-white/10 transition"
                        >
                            View Provider Directory
                        </button>

                    </div>

                </div>

            </header>


            {/* Dashboard content */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Provider overview */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <p className="text-sm text-gray-500">
                                Your business
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                {provider?.business_name || "Your Business"}
                            </h2>

                            <p className="text-blue-600 font-medium mt-1">
                                {provider?.service_category || "Service provider"}
                            </p>

                        </div>

                        <div className="flex items-center gap-3">

                            <span
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    provider?.is_available
                                        ? "bg-green-50 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {provider?.is_available
                                    ? "Available"
                                    : "Unavailable"}
                            </span>

                        </div>

                    </div>

                </section>


                {/* Status cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Enrolment status
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-3 capitalize">
                            {enrolment?.status || "Pending"}
                        </p>

                    </div>


                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Payment status
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-3 capitalize">
                            {enrolment?.payment_status || "Pending"}
                        </p>

                    </div>


                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Experience
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-3">
                            {provider?.years_of_experience || 0}
                            <span className="text-sm font-normal text-gray-500 ml-2">
                                years
                            </span>
                        </p>

                    </div>

                </section>


                {/* Management */}
                <section className="mt-10">

                    <h2 className="text-xl font-bold text-gray-900">
                        Manage your account
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">

                        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

                            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                                <span className="text-blue-600 text-lg">
                                    P
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mt-5">
                                Provider Profile
                            </h3>

                            <p className="text-gray-600 text-sm leading-6 mt-2">
                                Update your business information, service
                                category, location and availability.
                            </p>

                            <button
                                className="mt-5 border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-medium transition"
                            >
                                Edit Profile
                            </button>

                        </div>


                        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

                            <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                                <span className="text-gray-700 text-lg">
                                    E
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mt-5">
                                Provider Enrolment
                            </h3>

                            <p className="text-gray-600 text-sm leading-6 mt-2">
                                View your submitted enrolment information and
                                check your approval status.
                            </p>

                            <button
                                onClick={() => navigate("/provider-enrolment")}
                                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                            >
                                View Enrolment
                            </button>

                        </div>

                    </div>

                </section>


                {/* Contact / location */}
                <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

                    <h2 className="text-xl font-bold text-gray-900">
                        Business information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                                Location
                            </p>

                            <p className="text-gray-800 mt-2">
                                {provider?.location || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                                Phone
                            </p>

                            <p className="text-gray-800 mt-2">
                                {provider?.phone_number || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                                Service
                            </p>

                            <p className="text-gray-800 mt-2">
                                {provider?.service_category || "Not provided"}
                            </p>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default ProviderDashboard;
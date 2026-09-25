import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProvider } from "../services/providerService";

function ProviderProfile() {
    const { providerId } = useParams();
    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProvider();
    }, [providerId]);

    async function loadProvider() {
        try {
            setLoading(true);
            setError("");

            const data = await getProvider(providerId);

            setProvider(data);
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
                        Loading provider profile...
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
                        Unable to load profile
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/providers")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Back to Providers
                    </button>
                </div>
            </div>
        );
    }

    if (!provider) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-blue-700">
                <div className="max-w-6xl mx-auto px-6 py-10">

                    <button
                        onClick={() => navigate("/providers")}
                        className="text-blue-100 hover:text-white text-sm mb-8"
                    >
                        Back to providers
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div>
                            <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                                Service Provider
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                                {provider.business_name}
                            </h1>

                            <p className="text-blue-100 mt-2">
                                {provider.service_category}
                            </p>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                            <p className="text-blue-200 text-xs uppercase tracking-wide">
                                Availability
                            </p>

                            <p className="text-white font-semibold mt-1">
                                {provider.is_available
                                    ? "Available"
                                    : "Currently unavailable"}
                            </p>
                        </div>

                    </div>
                </div>
            </div>


            {/* Main content */}
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main information */}
                    <div className="lg:col-span-2 space-y-6">

                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">

                            <h2 className="text-xl font-semibold text-gray-900">
                                About this provider
                            </h2>

                            <p className="mt-4 text-gray-600 leading-7">
                                {provider.description ||
                                    "No description has been provided yet."}
                            </p>

                        </section>


                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Experience
                            </h2>

                            <div className="mt-5">

                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <p className="text-3xl font-bold text-blue-700">
                                        {provider.years_of_experience || 0}
                                    </p>

                                    <p className="text-gray-500 mt-1">
                                        Years of experience
                                    </p>
                                </div>

                            </div>

                        </section>

                    </div>


                    {/* Contact / summary */}
                    <div className="space-y-6">

                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Provider details
                            </h2>

                            <div className="mt-6 space-y-5">

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Service
                                    </p>

                                    <p className="text-gray-800 mt-1">
                                        {provider.service_category}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Location
                                    </p>

                                    <p className="text-gray-800 mt-1">
                                        {provider.location}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Phone
                                    </p>

                                    <p className="text-gray-800 mt-1">
                                        {provider.phone_number || "Not provided"}
                                    </p>
                                </div>

                            </div>

                        </section>


                        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-7">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Need this service?
                            </h2>

                            <p className="text-gray-600 text-sm leading-6 mt-2">
                                You can contact this provider or send a service
                                request through FixIt.
                            </p>

<button
    onClick={() =>
        navigate(`/service-requests/create?provider=${provider.user}`)
    }
    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
>
    Send Service Request
</button>

                        </section>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProviderProfile;
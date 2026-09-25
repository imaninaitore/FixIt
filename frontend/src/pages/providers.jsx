import { useEffect, useState } from "react";
import { getProviders } from "../services/providerService";
import { useNavigate } from "react-router-dom";

function Providers() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadProviders();
    }, []);

    async function loadProviders() {
        try {
            setLoading(true);
            setError("");

            const data = await getProviders();

            setProviders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading providers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-900">
                    Find a Service Provider
                </h1>

                <p className="mt-2 text-gray-600">
                    Find trusted professionals for the services you need.
                </p>


                {providers.length === 0 ? (

                    <div className="mt-10 text-center">
                        <p className="text-gray-600">
                            No providers are currently available.
                        </p>
                    </div>

                ) : (

                    <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">

                        {providers.map((provider) => (

                            <div
                                key={provider.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            >

                                <h2 className="text-xl font-semibold text-gray-900">
                                    {provider.business_name}
                                </h2>

                                <p className="mt-2 text-blue-600 font-medium">
                                    {provider.service_category}
                                </p>

                                <p className="mt-3 text-gray-600">
                                    {provider.location}
                                </p>

                                <p className="mt-2 text-gray-600">
                                    {provider.description}
                                </p>

<button
    onClick={() => navigate(`/providers/${provider.id}`)}
    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
    View Profile
</button>
                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Providers;
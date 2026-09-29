import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    MapPin,
    Search,
    X,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getProviders } from "../../services/providerService";

function Providers() {
    const [providers, setProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        loadProviders();
    }, []);

    useEffect(() => {
        const searchTerm = search.trim().toLowerCase();

        if (!searchTerm) {
            setFilteredProviders(providers);
            return;
        }

        const filtered = providers.filter((provider) => {
            const businessName =
                provider.business_name?.toLowerCase() || "";

            const category =
                provider.service_category?.toLowerCase() || "";

            const location =
                provider.location?.toLowerCase() || "";

            const description =
                provider.description?.toLowerCase() || "";

            return (
                businessName.includes(searchTerm) ||
                category.includes(searchTerm) ||
                location.includes(searchTerm) ||
                description.includes(searchTerm)
            );
        });

        setFilteredProviders(filtered);
    }, [search, providers]);

    async function loadProviders() {
        try {
            setLoading(true);
            setError("");

            const data = await getProviders();

            setProviders(data);
            setFilteredProviders(data);
        } catch (err) {
            setError(
                err.message || "Failed to load service providers."
            );
        } finally {
            setLoading(false);
        }
    }

    function clearSearch() {
        setSearch("");
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            {/* Hero */}
            <section
                className="relative bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-slate-950/75"></div>

                <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">

                    <div className="max-w-3xl">

                        <p className="text-sm font-medium uppercase tracking-wider text-blue-300">
                            FixIt Service Providers
                        </p>

                        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                            Find a service provider
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                            Find trusted professionals for the services
                            you need in your area.
                        </p>

                    </div>

                    {/* Search */}
                    <div className="mt-9 max-w-3xl">

                        <div className="relative">

                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by service, provider or location..."
                                className="w-full rounded-xl border border-white/20 bg-white px-12 py-4 pr-12 text-sm text-slate-800 shadow-lg outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}

                        </div>

                    </div>

                </div>
            </section>

            {/* Providers */}
            <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">

                <div className="mb-8">

                    <h2 className="text-2xl font-bold text-slate-900">
                        Available providers
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {search
                            ? `${filteredProviders.length} provider${
                                  filteredProviders.length === 1
                                      ? ""
                                      : "s"
                              } found`
                            : `${providers.length} provider${
                                  providers.length === 1
                                      ? ""
                                      : "s"
                              } available`}
                    </p>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-[250px] items-center justify-center">

                        <div className="text-center">

                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                            <p className="mt-4 text-sm text-slate-500">
                                Loading providers...
                            </p>

                        </div>

                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-200 bg-white p-8 text-center">

                        <h2 className="font-semibold text-slate-900">
                            Unable to load providers
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                        <button
                            onClick={loadProviders}
                            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* No providers */}
                {!loading &&
                    !error &&
                    providers.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

                            <h2 className="font-semibold text-slate-900">
                                No providers available
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                There are currently no approved service
                                providers available.
                            </p>

                        </div>
                    )}

                {/* No search results */}
                {!loading &&
                    !error &&
                    providers.length > 0 &&
                    filteredProviders.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

                            <Search className="mx-auto h-8 w-8 text-slate-400" />

                            <h2 className="mt-4 font-semibold text-slate-900">
                                No providers found
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Try searching for a different service,
                                provider or location.
                            </p>

                            <button
                                onClick={clearSearch}
                                className="mt-5 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Clear search
                            </button>

                        </div>
                    )}

                {/* Provider cards */}
                {!loading &&
                    !error &&
                    filteredProviders.length > 0 && (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            {filteredProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                                >

                                    {/* Card header */}
                                    <div className="bg-slate-900 px-6 py-6">

                                        <div className="flex items-center justify-between gap-4">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
                                                {provider.business_name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            {provider.is_available && (
                                                <span className="text-xs font-medium text-green-400">
                                                    Available
                                                </span>
                                            )}

                                        </div>

                                        <h3 className="mt-5 text-lg font-semibold text-white">
                                            {provider.business_name}
                                        </h3>

                                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-300">

                                            <Briefcase className="h-4 w-4" />

                                            <span>
                                                {provider.service_category}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Card body */}
                                    <div className="p-6">

                                        <div className="flex items-center gap-2 text-sm text-slate-600">

                                            <MapPin className="h-4 w-4 text-blue-600" />

                                            <span>
                                                {provider.location ||
                                                    "Location not provided"}
                                            </span>

                                        </div>

                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                                            {provider.description ||
                                                "No description provided."}
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/providers/${provider.id}`
                                                )
                                            }
                                            className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            View Profile
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

            </main>

            <Footer />

        </div>
    );
}

export default Providers;
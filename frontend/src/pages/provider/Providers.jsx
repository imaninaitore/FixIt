import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Briefcase,
    MapPin,
    Search,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getProviders } from "../../services/providerService";

function Providers() {
    const [providers, setProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const providersPerPage = 8;

    useEffect(() => {
        loadProviders();
    }, []);

    useEffect(() => {
        const searchTerm = search.trim().toLowerCase();

        const filtered = providers.filter((provider) => {
            const businessName =
                provider.business_name?.toLowerCase() || "";

            const providerCategory =
                provider.service_category?.toLowerCase() || "";

            const location =
                provider.location?.toLowerCase() || "";

            const description =
                provider.description?.toLowerCase() || "";

            const matchesSearch =
                !searchTerm ||
                businessName.includes(searchTerm) ||
                providerCategory.includes(searchTerm) ||
                location.includes(searchTerm) ||
                description.includes(searchTerm);

            const matchesCategory =
                category === "all" ||
                providerCategory === category.toLowerCase();

            return matchesSearch && matchesCategory;
        });

        setFilteredProviders(filtered);
        setCurrentPage(1);
    }, [search, category, providers]);

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

    function clearFilters() {
        setSearch("");
        setCategory("all");
        setCurrentPage(1);
    }

    const categories = [
        ...new Set(
            providers
                .map((provider) => provider.service_category)
                .filter(Boolean)
        ),
    ];

    const totalPages = Math.ceil(
        filteredProviders.length / providersPerPage
    );

    const startIndex =
        (currentPage - 1) * providersPerPage;

    const endIndex =
        startIndex + providersPerPage;

    const currentProviders =
        filteredProviders.slice(
            startIndex,
            endIndex
        );

    function goToPage(page) {
        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 450,
            behavior: "smooth",
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e2eaf2] via-[#edf2f7] to-[#d5e0eb]">

            <Navbar />

            {/* Hero / Search */}
            <section
                className="relative bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-slate-950/70" />

                <div
                    className="
                        relative
                        mx-auto
                        max-w-5xl
                        px-5
                        pb-20
                        pt-32
                        text-center

                        sm:px-8
                        sm:pb-24
                        sm:pt-36

                        lg:px-10
                    "
                >
                    <p
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-blue-300

                            sm:text-sm
                        "
                    >
                        FixIt Service Providers
                    </p>

                    <h1
                        className="
                            mt-4
                            text-3xl
                            font-bold
                            tracking-tight
                            text-white

                            sm:text-4xl

                            lg:text-5xl
                        "
                    >
                        Find a service provider
                    </h1>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-sm
                            leading-7
                            text-slate-200

                            sm:text-base
                        "
                    >
                        Find trusted professionals for the services
                        you need in your area.
                    </p>

                    {/* Search Container */}
                    <div
                        className="
                            mx-auto
                            mt-9
                            w-full
                            max-w-4xl
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/10
                                p-3
                                shadow-2xl
                                backdrop-blur-md

                                md:flex-row
                            "
                        >
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        h-5
                                        w-5
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search provider, service or location..."
                                    className="
                                        h-12
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/20
                                        bg-white
                                        px-12
                                        pr-12
                                        text-sm
                                        text-slate-800
                                        shadow-sm
                                        outline-none
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-200
                                    "
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                            transition
                                            hover:text-slate-700
                                        "
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Category */}
                            <div
                                className="
                                    relative
                                    w-full

                                    md:w-60
                                "
                            >
                                <Briefcase
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-4
                                        top-1/2
                                        z-10
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <select
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                    className="
                                        h-12
                                        w-full
                                        appearance-none
                                        rounded-xl
                                        border
                                        border-white/20
                                        bg-white
                                        pl-11
                                        pr-10
                                        text-sm
                                        text-slate-700
                                        shadow-sm
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-200
                                    "
                                >
                                    <option value="all">
                                        All Categories
                                    </option>

                                    {categories.map((item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    className="
                                        pointer-events-none
                                        absolute
                                        right-4
                                        top-1/2
                                        h-4
                                        w-4
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Providers */}
            <main
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                    px-5
                    py-10

                    sm:px-8
                    sm:py-12

                    lg:px-10
                "
            >
                {/* Results Header */}
                <div
                    className="
                        mb-7
                        flex
                        flex-col
                        gap-3

                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >
                    <div>
                        <h2
                            className="
                                text-xl
                                font-bold
                                tracking-tight
                                text-slate-900

                                sm:text-2xl
                            "
                        >
                            Available providers
                        </h2>

                        <p className="mt-1.5 text-sm text-slate-500">
                            {search || category !== "all"
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

                    {(search || category !== "all") && (
                        <button
                            onClick={clearFilters}
                            className="
                                flex
                                w-fit
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-blue-600
                                transition
                                hover:text-blue-700
                            "
                        >
                            <X className="h-4 w-4" />
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div
                        className="
                            flex
                            min-h-[250px]
                            items-center
                            justify-center
                        "
                    >
                        <div className="text-center">
                            <div
                                className="
                                    mx-auto
                                    h-9
                                    w-9
                                    animate-spin
                                    rounded-full
                                    border-4
                                    border-slate-200
                                    border-t-blue-600
                                "
                            />

                            <p className="mt-4 text-sm text-slate-500">
                                Loading providers...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div
                        className="
                            rounded-2xl
                            border
                            border-red-200
                            bg-white
                            p-8
                            text-center
                            shadow-sm
                        "
                    >
                        <h2 className="font-semibold text-slate-900">
                            Unable to load providers
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                        <button
                            onClick={loadProviders}
                            className="
                                mt-5
                                rounded-lg
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-blue-700
                            "
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* No Providers */}
                {!loading &&
                    !error &&
                    providers.length === 0 && (
                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-10
                                text-center
                                shadow-sm
                            "
                        >
                            <h2 className="font-semibold text-slate-900">
                                No providers available
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                There are currently no approved service
                                providers available.
                            </p>
                        </div>
                    )}

                {/* No Search Results */}
                {!loading &&
                    !error &&
                    providers.length > 0 &&
                    filteredProviders.length === 0 && (
                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-10
                                text-center
                                shadow-sm
                            "
                        >
                            <Search className="mx-auto h-8 w-8 text-slate-400" />

                            <h2 className="mt-4 font-semibold text-slate-900">
                                No providers found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Try searching for a different provider,
                                service, location, or category.
                            </p>

                            <button
                                onClick={clearFilters}
                                className="
                                    mt-5
                                    text-sm
                                    font-medium
                                    text-blue-600
                                    transition
                                    hover:text-blue-700
                                "
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                {/* Provider Grid */}
                {!loading &&
                    !error &&
                    currentProviders.length > 0 && (
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4

                                sm:grid-cols-2

                                lg:grid-cols-3

                                xl:grid-cols-4
                            "
                        >
                            {currentProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="
                                        flex
                                        min-h-[190px]
                                        flex-col
                                        justify-between
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-5
                                        shadow-sm
                                        transition
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-blue-200
                                        hover:shadow-md
                                    "
                                >
                                    {/* Provider Info */}
                                    <div>
                                        {/* Initial + Name */}
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-blue-50
                                                    text-base
                                                    font-bold
                                                    text-blue-600
                                                "
                                            >
                                                {provider.business_name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "P"}
                                            </div>

                                            <h3
                                                className="
                                                    min-w-0
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-slate-900
                                                "
                                            >
                                                {provider.business_name ||
                                                    "Unnamed Provider"}
                                            </h3>
                                        </div>

                                        {/* Service */}
                                        <div
                                            className="
                                                mt-5
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-slate-600
                                            "
                                        >
                                            <Briefcase className="h-4 w-4 shrink-0 text-blue-600" />

                                            <span className="truncate">
                                                {provider.service_category ||
                                                    "Service not specified"}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        <div
                                            className="
                                                mt-3
                                                flex
                                                items-center
                                                gap-2
                                                text-sm
                                                text-slate-500
                                            "
                                        >
                                            <MapPin className="h-4 w-4 shrink-0 text-blue-600" />

                                            <span className="truncate">
                                                {provider.location ||
                                                    "Location not provided"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* View Details */}
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/providers/${provider.id}`
                                            )
                                        }
                                        className="
                                            mt-5
                                            w-full
                                            rounded-lg
                                            bg-blue-600
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-blue-700
                                        "
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                {/* Pagination */}
                {!loading &&
                    !error &&
                    filteredProviders.length > providersPerPage && (
                        <div
                            className="
                                mt-9
                                flex
                                flex-col
                                items-center
                                gap-4

                                sm:flex-row
                                sm:justify-between
                            "
                        >
                            {/* Results */}
                            <p className="text-xs text-slate-500 sm:text-sm">
                                Showing{" "}
                                <span className="font-medium text-slate-700">
                                    {startIndex + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-slate-700">
                                    {Math.min(
                                        endIndex,
                                        filteredProviders.length
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-slate-700">
                                    {filteredProviders.length}
                                </span>{" "}
                                providers
                            </p>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-1.5">

                                {/* Previous */}
                                <button
                                    onClick={() =>
                                        goToPage(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-white
                                        text-slate-600
                                        transition
                                        hover:border-blue-200
                                        hover:text-blue-600
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Pages */}
                                {Array.from(
                                    {
                                        length: totalPages,
                                    },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() =>
                                            goToPage(page)
                                        }
                                        className={`
                                            flex
                                            h-9
                                            min-w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            px-2
                                            text-xs
                                            font-medium
                                            transition

                                            ${
                                                currentPage === page
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next */}
                                <button
                                    onClick={() =>
                                        goToPage(currentPage + 1)
                                    }
                                    disabled={
                                        currentPage === totalPages
                                    }
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-white
                                        text-slate-600
                                        transition
                                        hover:border-blue-200
                                        hover:text-blue-600
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
            </main>

            <Footer />
        </div>
    );
}

export default Providers;
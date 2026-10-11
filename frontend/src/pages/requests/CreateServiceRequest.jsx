import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createServiceRequest } from "../../services/serviceRequestService";
import { getProvider } from "../../services/providerService";

const serviceCategories = [
    "Packers & Movers",
    "Plumber",
    "Appliances Repair",
    "Water Tank Refill",
    "Painters",
    "Electrical",
    "Carpenters",
    "Pest Control",
];

const kenyanCounties = [
    "Baringo",
    "Bomet",
    "Bungoma",
    "Busia",
    "Elgeyo-Marakwet",
    "Embu",
    "Garissa",
    "Homa Bay",
    "Isiolo",
    "Kajiado",
    "Kakamega",
    "Kericho",
    "Kiambu",
    "Kilifi",
    "Kirinyaga",
    "Kisii",
    "Kisumu",
    "Kitui",
    "Kwale",
    "Laikipia",
    "Lamu",
    "Machakos",
    "Makueni",
    "Mandera",
    "Marsabit",
    "Meru",
    "Migori",
    "Mombasa",
    "Murang'a",
    "Nairobi",
    "Nakuru",
    "Nandi",
    "Narok",
    "Nyamira",
    "Nyandarua",
    "Nyeri",
    "Samburu",
    "Siaya",
    "Taita-Taveta",
    "Tana River",
    "Tharaka-Nithi",
    "Trans Nzoia",
    "Turkana",
    "Uasin Gishu",
    "Vihiga",
    "Wajir",
    "West Pokot",
];

const fieldClassName =
    "w-full min-w-0 rounded-lg border border-[#D9C2AD] bg-white px-3 py-2.5 text-sm text-[#172A46] outline-none transition focus:border-[#C66A4A] focus:ring-2 focus:ring-[#C66A4A]/20";

const labelClassName =
    "mb-1.5 block text-sm font-medium text-[#172A46]";

function CreateServiceRequest() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const providerId = searchParams.get("provider");

    const [providerProfile, setProviderProfile] = useState(null);
    const [providerLoading, setProviderLoading] = useState(
        Boolean(providerId)
    );
    const [providerError, setProviderError] = useState("");

    const [formData, setFormData] = useState({
        service_title: "",
        description: "",
        location: "",
        preferred_date: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadSelectedProvider() {
            if (!providerId || !Number.isInteger(Number(providerId)) ||
                Number(providerId) <= 0) {
                setProviderProfile(null);
                setProviderLoading(false);
                setProviderError(
                    "Please select a provider first by opening the request form from their profile."
                );
                return;
            }

            setProviderLoading(true);
            setProviderError("");

            try {
                const provider = await getProvider(providerId);

                if (cancelled) return;

                if (!provider?.id || !provider.service_category) {
                    throw new Error(
                        "The selected provider has no service category configured."
                    );
                }

                setProviderProfile(provider);

                setFormData((previousData) => ({
                    ...previousData,
                    service_title: provider.service_category,
                }));
            } catch (err) {
                if (cancelled) return;

                console.error("Failed to load selected provider:", err);

                setProviderProfile(null);
                setProviderError(
                    err.message ||
                        "Could not load the selected provider. Please return to their profile and try again."
                );
            } finally {
                if (!cancelled) {
                    setProviderLoading(false);
                }
            }
        }

        loadSelectedProvider();

        return () => {
            cancelled = true;
        };
    }, [providerId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!providerId || !providerProfile || providerLoading || providerError) {
            setError(
                "Please select a valid provider before submitting your request."
            );
            return;
        }

        if (Number(providerProfile.id) !== Number(providerId)) {
            setError(
                "The selected provider could not be verified. Please try again."
            );
            return;
        }

        setLoading(true);

        try {
            const requestData = {
    service_title: providerProfile.service_category,
    description: formData.description,
    location: formData.location,
    preferred_date: formData.preferred_date,
    provider_id: Number(providerProfile.user),};

            await createServiceRequest(requestData);

            setSuccess(
                "Service request submitted successfully. Redirecting to your dashboard..."
            );

            setTimeout(() => {
                navigate("/customer-dashboard");
            }, 1500);
        } catch (err) {
            console.error(err);

            if (err.response?.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError(
                    err.message || "Failed to submit service request."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F4EDE5] px-3 py-5 sm:px-5 sm:py-8">
            <div className="mx-auto max-w-2xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-3 text-sm font-medium text-[#C66A4A] transition hover:text-[#A95238]"
                >
                    Back
                </button>

                <header className="mb-5">
                    <h1 className="text-2xl font-bold tracking-tight text-[#172A46] sm:text-3xl">
                        Request a Service
                    </h1>

                    <p className="mt-1.5 text-sm leading-5 text-[#536070]">
                        Tell us what you need and where the service is required.
                    </p>
                </header>

                {success && (
                    <div
                        role="status"
                        className="mb-4 rounded-lg border border-[#D9B99B] bg-[#FFFDF9] px-4 py-3 text-sm text-[#536070]"
                    >
                        {success}
                    </div>
                )}

                {(error || providerError) && (
                    <div
                        role="alert"
                        className="mb-4 break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error || providerError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-[#D9C2AD] bg-[#FFFDF9] p-4 shadow-sm sm:p-6"
                >
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="service_title"
                                className={labelClassName}
                            >
                                Service needed
                            </label>

                            <select
                                id="service_title"
                                name="service_title"
                                value={formData.service_title}
                                onChange={handleChange}
                                required
                                disabled={
                                    providerLoading ||
                                    Boolean(providerId) ||
                                    !providerId
                                }
                                className={`${fieldClassName} disabled:cursor-not-allowed disabled:bg-[#F4EDE5] disabled:text-[#536070]`}
                            >
                                <option value="" disabled>
                                    {providerLoading
                                        ? "Loading provider's service..."
                                        : "Select a service"}
                                </option>

                                {serviceCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}

                                {providerProfile?.service_category &&
                                    !serviceCategories.includes(
                                        providerProfile.service_category
                                    ) && (
                                        <option
                                            value={providerProfile.service_category}
                                        >
                                            {providerProfile.service_category}
                                        </option>
                                    )}
                            </select>

                            {providerProfile && (
                                <p className="mt-1.5 text-xs text-[#6B7280]">
                                    Service offered by{" "}
                                    {providerProfile.business_name || "your selected provider"}.
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="location"
                                className={labelClassName}
                            >
                                County
                            </label>

                            <select
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className={fieldClassName}
                            >
                                <option value="" disabled>
                                    Select your county
                                </option>

                                {kenyanCounties.map((county) => (
                                    <option key={county} value={county}>
                                        {county}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="description"
                                className={labelClassName}
                            >
                                Describe the service
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Briefly explain the work needed..."
                                rows={3}
                                required
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>

                        <div className="sm:col-span-1">
                            <label
                                htmlFor="preferred_date"
                                className={labelClassName}
                            >
                                Preferred date
                            </label>

                            <input
                                id="preferred_date"
                                name="preferred_date"
                                type="date"
                                min={new Date().toLocaleDateString("en-CA")}
                                value={formData.preferred_date}
                                onChange={handleChange}
                                required
                                className={fieldClassName}
                            />
                        </div>
                    </div>

                    {providerProfile && (
                        <div className="mt-4 rounded-lg border border-[#D9B99B] bg-[#F4EDE5] px-3 py-2.5">
                            <p className="text-sm text-[#172A46]">
                                Your request will be sent to{" "}
                                <span className="font-semibold">
                                    {providerProfile.business_name || "your selected provider"}
                                </span>
                                .
                            </p>
                        </div>
                    )}

                    <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#E8DDD1] pt-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full rounded-lg border border-[#D9C2AD] px-4 py-2.5 text-sm font-medium text-[#172A46] transition hover:bg-[#F4EDE5] sm:w-auto"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                providerLoading ||
                                !providerProfile ||
                                Boolean(providerError)
                            }
                            className="w-full rounded-lg bg-[#C66A4A] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#A95238] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default CreateServiceRequest;

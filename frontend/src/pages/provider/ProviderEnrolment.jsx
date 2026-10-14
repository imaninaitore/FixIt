
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    BriefcaseBusiness,
    CalendarDays,
    CreditCard,
    FileText,
    MapPin,
    Phone,
    Send,
    UserRound,
    Mail,
    Upload,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
    getMyProviderEnrolment,
    submitProviderEnrolment,
} from "../../services/providerEnrolmentService";

const serviceCategories = [
    { label: "Packers & Movers", value: "Packers & Movers" },
    { label: "Plumber", value: "Plumber" },
    { label: "Appliances Repair", value: "Appliances Repair" },
    { label: "Water Tank Refill", value: "Water Tank Refill" },
    { label: "Painters", value: "Painters" },
    { label: "Electrical", value: "Electrical." },
    { label: "Carpenters", value: "Carpentry" },
    { label: "Pest Control", value: "Pest Control" },
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

const inputClass =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-[#C66A4A]";

const optionClass = "bg-slate-900 text-white";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
];

const ALLOWED_FILE_EXTENSIONS = /\.(pdf|jpg|jpeg|png)$/i;

function ProviderEnrolment() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        business_name: "",
        service_category: "",
        description: "",
        location: "",
        years_of_experience: "",
        phone_number: "",
        referee_name: "",
        referee_email: "",
        referee_phone: "",
        qualification_document: null,
        plan: "provider_subscription",
        amount: "50.00",
        transaction_code: "",
        payment_date: "",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        checkExistingEnrolment();
    }, []);

    async function checkExistingEnrolment() {
        try {
            setLoading(true);
            setError("");

            const enrolment = await getMyProviderEnrolment();

            if (!enrolment) {
                return;
            }

            if (enrolment.status === "submitted") {
                navigate("/provider/pending", { replace: true });
                return;
            }

            if (enrolment.status === "approved") {
                navigate("/provider-dashboard", { replace: true });
                return;
            }

            if (enrolment.status === "rejected") {
                setError(
                    "Your previous provider application was rejected. Please contact the FixIt administration team for assistance."
                );
            }
        } catch (err) {
            console.error("Failed to check provider enrolment:", err);

            setError(
                err?.message ||
                "Unable to check your existing application. Please refresh the page and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value, files } = event.target;

        if (name === "qualification_document") {
            const file = files?.[0] || null;

            if (file && file.size > MAX_FILE_SIZE) {
                setError(
                    "Your professional qualification certificate exceeds the 5 MB limit. Please choose a smaller file."
                );

                event.target.value = "";
                return;
            }

            if (file && !ALLOWED_FILE_EXTENSIONS.test(file.name)) {
                setError(
                    "Unsupported certificate format. Please upload a PDF, JPG, JPEG, or PNG file."
                );

                event.target.value = "";
                return;
            }

            if (
                file &&
                file.type &&
                !ALLOWED_FILE_TYPES.includes(file.type)
            ) {
                setError(
                    "The selected file type is not supported. Please upload a PDF, JPG, JPEG, or PNG certificate."
                );

                event.target.value = "";
                return;
            }

            setError("");

            setFormData((previous) => ({
                ...previous,
                qualification_document: file,
            }));

            return;
        }

        setError("");

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const certificate = formData.qualification_document;

        if (!(certificate instanceof File)) {
            setError(
                "Please select your professional qualification certificate before submitting your application."
            );
            return;
        }

        if (certificate.size > MAX_FILE_SIZE) {
            setError(
                "Your professional qualification certificate must not exceed 5 MB."
            );
            return;
        }

        if (!ALLOWED_FILE_EXTENSIONS.test(certificate.name)) {
            setError(
                "Please upload your certificate as a PDF, JPG, JPEG, or PNG file."
            );
            return;
        }

        if (
            !formData.years_of_experience.trim() ||
            !Number.isInteger(Number(formData.years_of_experience)) ||
            Number(formData.years_of_experience) < 0
        ) {
            setError(
                "Enter a valid whole number of years of professional experience."
            );
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "qualification_document") {
                    return;
                }

                if (value !== null && value !== undefined) {
                    const formattedValue =
                        key === "amount"
                            ? Number(value).toFixed(2)
                            : String(value);

                    payload.append(key, formattedValue);
                }
            });

            payload.set(
                "years_of_experience",
                String(Number(formData.years_of_experience))
            );

            // Append the actual File object, not its name or string value.
            payload.append("qualification_document", certificate, certificate.name);

            // Keep this as FormData. Do not manually set Content-Type.
            const data = await submitProviderEnrolment(payload);

            if (data?.enrolment?.status === "submitted") {
                navigate("/provider/pending", { replace: true });
                return;
            }

            setError(
                "Your application was sent, but we could not confirm its submission status. Please check your application before trying again."
            );
        } catch (err) {
            console.error("Provider enrolment submission failed:", err);

            setError(
                err?.message ||
                "We couldn't submit your provider enrolment. Please check your details and try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#C66A4A]" />
                        <p className="text-sm text-slate-300">
                            Checking your provider application...
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main
                className="relative min-h-[calc(100vh-80px)] bg-cover bg-center"
                style={{ backgroundImage: "url('/images/bg.png')" }}
            >
                <div className="absolute inset-0 bg-slate-950/45" />

                <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Provider Enrolment
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                            Complete your provider application and submit your
                            payment details for admin review.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7"
                    >
                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="mb-6 whitespace-pre-line rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200"
                            >
                                <p className="mb-1 font-semibold">
                                    Please check the following:
                                </p>
                                {error}
                            </div>
                        )}

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Business Name
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your business name"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Service Category
                                </label>
                                <div className="relative">
                                    <BriefcaseBusiness className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <select
                                        name="service_category"
                                        value={formData.service_category}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} appearance-none pl-10`}
                                    >
                                        <option className={optionClass} value="">
                                            Select a service category
                                        </option>
                                        {serviceCategories.map((category) => (
                                            <option
                                                className={optionClass}
                                                key={category.value}
                                                value={category.value}
                                            >
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    County
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} appearance-none pl-10`}
                                    >
                                        <option className={optionClass} value="">
                                            Select your county
                                        </option>
                                        {kenyanCounties.map((county) => (
                                            <option
                                                className={optionClass}
                                                key={county}
                                                value={county}
                                            >
                                                {county}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="years_of_experience"
                                    value={formData.years_of_experience}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    required
                                    placeholder="Years of experience"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Business Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. 0712345678"
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Payment Amount (KES)
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        readOnly
                                        className={`${inputClass} pl-10 text-slate-300`}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Service Description
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        placeholder="Describe the services you provide..."
                                        className={`${inputClass} resize-none pl-10`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-white/15 pt-6">
                            <h2 className="text-lg font-semibold">
                                Referee Details
                            </h2>
                            <p className="mt-1 text-sm text-slate-300">
                                Provide contact details for someone who can
                                verify your professional experience.
                            </p>

                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Referee Name
                                    </label>
                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            name="referee_name"
                                            value={formData.referee_name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Full name"
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Referee Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            name="referee_email"
                                            value={formData.referee_email}
                                            onChange={handleChange}
                                            required
                                            placeholder="referee@example.com"
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Referee Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            name="referee_phone"
                                            value={formData.referee_phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. 0712345678"
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Professional Qualification Document
                                    </label>
                                    <div className="relative">
                                        <Upload className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="file"
                                            name="qualification_document"
                                            onChange={handleChange}
                                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                            required
                                            className="w-full rounded-xl border border-white/15 bg-white/10 py-2.5 pl-10 pr-3 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-[#C66A4A] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-slate-300">
                                        PDF, JPG, JPEG, or PNG. Maximum size: 5 MB.
                                    </p>

                                    {formData.qualification_document && (
                                        <p className="mt-2 break-all text-xs text-slate-200">
                                            Selected:{" "}
                                            {formData.qualification_document.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-white/15 pt-6">
                            <h2 className="text-lg font-semibold">
                                Payment Information
                            </h2>
                            <p className="mt-1 text-sm text-slate-300">
                                send enrolment fee of Ksh 50 to  <span className="text-orange-300 text-lg">0716869670</span>
                            </p>

                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Transaction Code
                                    </label>
                                    <input
                                        type="text"
                                        name="transaction_code"
                                        value={formData.transaction_code}
                                        onChange={handleChange}
                                        required
                                        placeholder="Payment transaction code"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">
                                        Payment Date
                                    </label>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="date"
                                            name="payment_date"
                                            value={formData.payment_date}
                                            onChange={handleChange}
                                            required
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#C66A4A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#AD573B] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Send className="h-4 w-4" />
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Application"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default ProviderEnrolment;

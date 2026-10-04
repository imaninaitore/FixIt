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
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
    getMyProviderEnrolment,
    submitProviderEnrolment,
} from "../../services/providerEnrolmentService";

function ProviderEnrolment() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        business_name: "",
        service_category: "",
        description: "",
        location: "",
        years_of_experience: "",
        phone_number: "",
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

    const checkExistingEnrolment = async () => {
        try {
            setLoading(true);
            setError("");

            const enrolment = await getMyProviderEnrolment();

            if (!enrolment) {
                setLoading(false);
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
            setError("Unable to check your existing application.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const data = await submitProviderEnrolment({
                ...formData,
                years_of_experience: Number(formData.years_of_experience),
                amount: Number(formData.amount),
            });

            if (data?.enrolment?.status === "submitted") {
                navigate("/provider/pending", { replace: true });
                return;
            }

            setError(
                "Your application was submitted, but its status could not be confirmed."
            );
        } catch (err) {
            console.error("Provider enrolment submission failed:", err);

            setError(
                err?.message ||
                    "Failed to submit your provider enrolment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar />

                <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />

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
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
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
                        className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7"
                    >
                        {error && (
                            <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
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
                                        className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Service Category
                                </label>

                                <div className="relative">
                                    <BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        name="service_category"
                                        value={formData.service_category}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Electrical"
                                        className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Location
                                </label>

                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your service area"
                                        className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                                    />
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
                                    required
                                    placeholder="Years of experience"
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                        placeholder="Phone number"
                                        className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Payment Amount
                                </label>

                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        readOnly
                                        className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-slate-300 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-200">
                                    Description
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
                                        className="w-full resize-none rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
                                    />
                                </div>
                            </div>

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
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400"
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
                                        className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
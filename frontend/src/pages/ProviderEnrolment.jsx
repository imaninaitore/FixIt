import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitProviderEnrolment } from "../services/providerEnrolmentService";

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

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);
try {
    const data = await submitProviderEnrolment({
        ...formData,
        years_of_experience: Number(formData.years_of_experience),
        amount: Number(formData.amount),
    });

    setSuccessMessage(
        data.message || "Your provider enrolment was submitted successfully."
    );

    // Clear the form
    setFormData({
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

} catch (error) {
    setError(error.message);
} finally {
    setLoading(false);
}

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10">

            <div className="mx-auto max-w-4xl">

                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        FixIt Provider
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
                        Become a Service Provider
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-500">
                        Tell us about your business and submit your
                        subscription payment details for review.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {successMessage && (
    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">

        <div className="flex items-start gap-3">

            <div>
                <h2 className="font-semibold text-green-800">
                    Submitted Successfully
                </h2>

                <p className="mt-1 text-sm text-green-700">
                    {successMessage}
                </p>

                <p className="mt-2 text-sm text-green-700">
                    Your application has been submitted and is awaiting
                    admin review.
                </p>
            </div>

        </div>

    </div>
)}

                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-2xl bg-white shadow-lg"
                >

                    {/* Business information */}
                    <div className="border-b border-slate-200 p-6 md:p-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Business Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Provide information about the service you offer.
                        </p>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Business Name
                                </label>

                                <input
                                    type="text"
                                    name="business_name"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Imani Electrical Services"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Service Category
                                </label>

                                <input
                                    type="text"
                                    name="service_category"
                                    value={formData.service_category}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Electrical"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Describe the services you provide..."
                                    className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Nairobi"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Years of Experience
                                </label>

                                <input
                                    type="number"
                                    name="years_of_experience"
                                    value={formData.years_of_experience}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    placeholder="e.g. 5"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 0712345678"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                        </div>
                    </div>


                    {/* Payment information */}
                    <div className="border-b border-slate-200 bg-slate-50 p-6 md:p-8">

                        <h2 className="text-xl font-bold text-slate-800">
                            Subscription Payment
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Enter the payment details for your provider subscription.
                        </p>

                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Provider Subscription
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-slate-800">
                                        KSh 50
                                    </p>
                                </div>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                    Subscription
                                </span>
                            </div>

                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Transaction Code
                                </label>

                                <input
                                    type="text"
                                    name="transaction_code"
                                    value={formData.transaction_code}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter transaction code"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Payment Date
                                </label>

                                <input
                                    type="date"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                        </div>

                    </div>


                    {/* Submit */}
                    <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">

                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                Ready to submit?
                            </p>

                            <p className="text-xs text-slate-500">
                                Your application will be reviewed by an administrator.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Application"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ProviderEnrolment;
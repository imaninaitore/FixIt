import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    CheckCircle2,
    Clock3,
    MapPin,
    BriefcaseBusiness,
    CreditCard,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getMyProviderEnrolment } from "../../services/providerEnrolmentService";

function ProviderPendingApproval() {
    const navigate = useNavigate();

    const [enrolment, setEnrolment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadEnrolment();
    }, []);

    const loadEnrolment = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyProviderEnrolment();

            if (!data) {
                navigate("/provider/enrolment", { replace: true });
                return;
            }

            if (data.status === "approved") {
                navigate("/provider-dashboard", { replace: true });
                return;
            }

            setEnrolment(data);
        } catch (err) {
            console.error("Failed to load provider enrolment:", err);
            setError("Unable to load your application details.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                <div className="text-center text-white">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
                    <p className="text-sm text-slate-300">
                        Loading your application...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 text-center text-white shadow-xl backdrop-blur-xl">
                    <p className="mb-5 text-sm text-red-300">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadEnrolment}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!enrolment) {
        return null;
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

                <div className="relative mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <div className="w-full max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 ring-1 ring-blue-400/30">
                                <Clock3 className="h-8 w-8 text-blue-300" />
                            </div>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Application Submitted
                            </h1>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                                Your provider application has been submitted
                                successfully and is currently waiting for admin
                                approval.
                            </p>
                        </div>

                        <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                                <div>
                                    <p className="text-sm font-semibold text-emerald-200">
                                        Application received
                                    </p>

                                    <p className="mt-1 text-sm leading-5 text-slate-300">
                                        Our administration team will review your
                                        application before your provider account
                                        is activated.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                <div className="mb-3 flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-blue-300" />
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Business
                                    </span>
                                </div>

                                <p className="font-medium text-white">
                                    {enrolment.business_name}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                <div className="mb-3 flex items-center gap-3">
                                    <BriefcaseBusiness className="h-5 w-5 text-blue-300" />
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Service Category
                                    </span>
                                </div>

                                <p className="font-medium text-white">
                                    {enrolment.service_category}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                <div className="mb-3 flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-blue-300" />
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Location
                                    </span>
                                </div>

                                <p className="font-medium text-white">
                                    {enrolment.location}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                                <div className="mb-3 flex items-center gap-3">
                                    <CreditCard className="h-5 w-5 text-blue-300" />
                                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Payment Status
                                    </span>
                                </div>

                                <p className="font-medium capitalize text-white">
                                    {enrolment.payment_status}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-blue-300">
                                        Application Status
                                    </p>

                                    <p className="mt-1 text-lg font-semibold capitalize text-white">
                                        {enrolment.status}
                                    </p>
                                </div>

                                <div className="rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold capitalize text-blue-200">
                                    {enrolment.status}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-400">
                                You can return to the homepage while your
                                application is being reviewed.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default ProviderPendingApproval;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
    getMyProviderEnrolment,
} from "../../services/providerEnrolmentService";

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
                navigate("/provider/enrolment", {
                    replace: true,
                });
                return;
            }

            if (data.status === "approved") {
                navigate("/provider-dashboard", {
                    replace: true,
                });
                return;
            }

            setEnrolment(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Failed to load your application status."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div
                className="min-h-screen bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('/images/bg.png')",
                }}
            >
                <div className="min-h-screen bg-blue-950/35">
                    <Navbar />

                    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
                        <div className="rounded-2xl border border-white/20 bg-white/10 px-7 py-6 text-center shadow-xl backdrop-blur-xl">
                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-white" />

                            <p className="mt-3 text-sm text-white/70">
                                Checking your application...
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="min-h-screen bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('/images/bg.png')",
                }}
            >
                <div className="min-h-screen bg-blue-950/35">
                    <Navbar />

                    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 ">
                        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
                            <h1 className="text-lg font-bold text-white">
                                Unable to load application
                            </h1>

                            <p className="mt-2 text-sm leading-5 text-white/65">
                                {error}
                            </p>

                            <button
                                onClick={loadEnrolment}
                                className="mt-5 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                                Try Again
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage:
                    "url('/images/bg.png')",
            }}
        >
            <div className="min-h-screen bg-blue-950/30">
                <Navbar />

                <main className="flex min-h-[calc(100vh-80px)] items-start justify-center px-3 py-6 sm:px-5 sm:py-8 lg:items-center lg:px-6 lg:py-10 ">
                    <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl sm:p-6 lg:p-7 mt-20">

                        {/* Header */}

                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                                <svg
                                    className="h-6 w-6 text-amber-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeWidth="1.8"
                                        d="M12 7v5l3 2"
                                    />
                                </svg>
                            </div>

                            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
                                Provider Application
                            </p>

                            <h1 className="mt-1.5 text-xl font-black text-white sm:text-2xl">
                                Application Pending Approval
                            </h1>

                            <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-white/65 sm:text-sm">
                                Your provider application has been
                                submitted successfully and is waiting
                                for administrator approval.
                            </p>
                        </div>

                        {/* Application details */}

                        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                            <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Business
                                </p>

                                <p className="mt-1 truncate text-xs font-semibold text-white sm:text-sm">
                                    {enrolment?.business_name ||
                                        "Not available"}
                                </p>
                            </div>

                            <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Category
                                </p>

                                <p className="mt-1 truncate text-xs font-semibold text-white sm:text-sm">
                                    {enrolment?.service_category ||
                                        "Not available"}
                                </p>
                            </div>

                            <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Location
                                </p>

                                <p className="mt-1 truncate text-xs font-semibold text-white sm:text-sm">
                                    {enrolment?.location ||
                                        "Not available"}
                                </p>
                            </div>

                            <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Submitted
                                </p>

                                <p className="mt-1 text-xs font-semibold text-white sm:text-sm">
                                    {formatDate(
                                        enrolment?.created_at
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Status */}

                        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:gap-3">
                            <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-amber-200/70">
                                    Application
                                </p>

                                <span className="mt-1.5 inline-flex rounded-full border border-amber-300/20 bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold capitalize text-amber-100">
                                    {enrolment?.status ||
                                        "Submitted"}
                                </span>
                            </div>

                            <div className="rounded-lg border border-blue-300/20 bg-blue-400/10 p-3">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200/70">
                                    Payment
                                </p>

                                <span className="mt-1.5 inline-flex rounded-full border border-blue-300/20 bg-blue-400/15 px-2.5 py-1 text-[10px] font-bold capitalize text-blue-100">
                                    {enrolment?.payment_status ||
                                        "Pending"}
                                </span>
                            </div>
                        </div>

                        {/* Information */}

                        <div className="mt-3 rounded-lg border border-white/10 bg-black/10 px-3.5 py-3">
                            <p className="text-xs leading-5 text-white/60">
                                Your application is currently being
                                reviewed. You do not need to submit it
                                again. Once approved, your provider
                                profile will be created automatically.
                            </p>
                        </div>

                        {/* Actions */}

                        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                            <button
                                onClick={loadEnrolment}
                                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15 sm:w-auto sm:min-w-32"
                            >
                                Check Status
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="w-full rounded-lg bg-blue-500/90 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-600 sm:w-auto sm:min-w-32"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default ProviderPendingApproval;
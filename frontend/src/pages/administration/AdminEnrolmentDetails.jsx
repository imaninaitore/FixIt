import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAdminEnrolment,
} from "../../services/adminService";

function AdminEnrolmentDetails() {
    const { enrolmentId } = useParams();
    const navigate = useNavigate();

    const [enrolment, setEnrolment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadEnrolment();
    }, [enrolmentId]);

    async function loadEnrolment() {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminEnrolment(enrolmentId);

            setEnrolment(data);
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
                        Loading enrolment details...
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
                        Unable to load enrolment
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/admin/enrolments")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Back to Enrolments
                    </button>
                </div>
            </div>
        );
    }

    if (!enrolment) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-blue-700">
                <div className="max-w-6xl mx-auto px-6 py-8">

                    <button
                        onClick={() => navigate("/admin/enrolments")}
                        className="text-blue-100 hover:text-white text-sm mb-6"
                    >
                        Back to enrolments
                    </button>

                    <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                        Administration
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                        Enrolment Details
                    </h1>

                    <p className="text-blue-100 mt-2">
                        Provider profile #{enrolment.id}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main information */}
                    <div className="lg:col-span-2">

                        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Provider Profile
                            </h2>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Profile ID
                                    </p>

                                    <p className="mt-2 text-gray-900 font-medium">
                                        #{enrolment.id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Profile Type
                                    </p>

                                    <p className="mt-2 text-gray-900 font-medium">
                                        Service Provider
                                    </p>
                                </div>

                            </div>

                        </section>

                        <section className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-7">

                            <h2 className="text-lg font-semibold text-gray-900">
                                More information required
                            </h2>

                            <p className="mt-2 text-gray-600 leading-6">
                                The current admin enrolment detail endpoint
                                only returns the provider profile ID. Provider
                                business information, enrolment status, payment
                                information, and submitted documents are not
                                currently returned by this endpoint.
                            </p>

                        </section>

                    </div>

                    {/* Status */}
                    <div>

                        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Enrolment Status
                            </h2>

                            <div className="mt-5 bg-gray-50 border border-gray-100 rounded-xl p-5">

                                <p className="text-sm text-gray-500">
                                    Current status
                                </p>

                                <p className="mt-2 text-gray-900 font-semibold">
                                    Information unavailable
                                </p>

                                <p className="mt-2 text-sm text-gray-500 leading-5">
                                    The current API response does not include
                                    the enrolment status.
                                </p>

                            </div>

                        </section>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default AdminEnrolmentDetails;
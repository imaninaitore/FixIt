import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getServiceRequests,
    updateServiceRequest,
} from "../../services/serviceRequestService";

function ProviderServiceRequests() {
    const navigate = useNavigate();

    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadServiceRequests();
    }, []);

    async function loadServiceRequests() {
        try {
            setLoading(true);
            setError("");

            const data = await getServiceRequests();

            setServiceRequests(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load service requests."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusUpdate(requestId, newStatus) {
        try {
            setUpdatingId(requestId);
            setError("");

            const updatedRequest = await updateServiceRequest(
                requestId,
                {
                    status: newStatus,
                }
            );

            setServiceRequests((previousRequests) =>
                previousRequests.map((request) =>
                    request.id === requestId
                        ? updatedRequest
                        : request
                )
            );

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to update the service request."
            );
        } finally {
            setUpdatingId(null);
        }
    }

    function getStatusClasses(status) {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";

            case "accepted":
                return "bg-green-100 text-green-800";

            case "rejected":
                return "bg-red-100 text-red-800";

            case "in_progress":
                return "bg-blue-100 text-blue-800";

            case "completed":
                return "bg-gray-100 text-gray-800";

            case "cancelled":
                return "bg-gray-100 text-gray-600";

            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading service requests...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">

            <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Service Requests
                        </h1>

                        <p className="mt-2 text-gray-600">
                            View and manage service requests from customers.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/provider-dashboard")}
                        className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg font-medium transition"
                    >
                        Back to Dashboard
                    </button>

                </div>


                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4 text-red-700">
                        {error}
                    </div>
                )}


                {/* Empty state */}
                {!error && serviceRequests.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">

                        <h2 className="text-xl font-semibold text-gray-900">
                            No service requests
                        </h2>

                        <p className="mt-2 text-gray-600">
                            You currently have no service requests from customers.
                        </p>

                    </div>
                )}


                {/* Requests */}
                {serviceRequests.length > 0 && (
                    <div className="space-y-6">

                        {serviceRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7"
                            >

                                {/* Top section */}
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Request #{request.id}
                                        </p>

                                        <h2 className="text-xl font-semibold text-gray-900 mt-1">
                                            {request.service_title}
                                        </h2>
                                    </div>

                                    <span
                                        className={`inline-block w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusClasses(
                                            request.status
                                        )}`}
                                    >
                                        {request.status}
                                    </span>

                                </div>


                                {/* Request details */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                            Customer
                                        </p>

                                        <p className="mt-1 text-gray-800">
                                            {request.customer}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                            Location
                                        </p>

                                        <p className="mt-1 text-gray-800">
                                            {request.location}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                            Preferred date
                                        </p>

                                        <p className="mt-1 text-gray-800">
                                            {request.preferred_date}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                            Submitted
                                        </p>

                                        <p className="mt-1 text-gray-800">
                                            {new Date(
                                                request.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                </div>


                                {/* Description */}
                                <div className="mt-6">

                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Description
                                    </p>

                                    <p className="mt-2 text-gray-600 leading-7">
                                        {request.description}
                                    </p>

                                </div>


                                {/* Actions */}
                                {request.status === "pending" && (
                                    <div className="mt-7 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">

                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    request.id,
                                                    "accepted"
                                                )
                                            }
                                            disabled={
                                                updatingId === request.id
                                            }
                                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
                                        >
                                            {updatingId === request.id
                                                ? "Updating..."
                                                : "Accept Request"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    request.id,
                                                    "rejected"
                                                )
                                            }
                                            disabled={
                                                updatingId === request.id
                                            }
                                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
                                        >
                                            Reject Request
                                        </button>

                                    </div>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default ProviderServiceRequests;
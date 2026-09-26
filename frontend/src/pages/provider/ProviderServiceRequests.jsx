import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getProviderServiceRequests,
    updateServiceRequest,
} from "../../services/serviceRequestService";

function ProviderServiceRequests() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProviderServiceRequests();

            setRequests(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load service requests."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, status) => {
        try {
            setUpdatingId(requestId);
            setError("");

            const updatedRequest = await updateServiceRequest(
                requestId,
                { status }
            );

            setRequests((previousRequests) =>
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
                "Failed to update request."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <button
                        onClick={() =>
                            navigate("/provider-dashboard")
                        }
                        className="text-2xl font-bold text-blue-600"
                    >
                        FixIt
                    </button>

                    <div className="flex items-center gap-6">

                        <button
                            onClick={() =>
                                navigate("/provider-dashboard")
                            }
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate("/provider/service-requests")
                            }
                            className="font-medium text-blue-600"
                        >
                            Service Requests
                        </button>

                        <button
                            onClick={() =>
                                navigate("/messages")
                            }
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Messages
                        </button>

                    </div>

                </div>
            </nav>


            {/* Main content */}
            <main className="mx-auto max-w-6xl px-6 py-10">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Service Requests
                    </h1>

                    <p className="mt-2 text-gray-600">
                        View and manage service requests sent to you.
                    </p>

                </div>


                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}


                {/* Loading */}
                {loading && (
                    <div className="rounded-xl bg-white p-8 shadow">
                        <p className="text-gray-600">
                            Loading service requests...
                        </p>
                    </div>
                )}


                {/* Empty state */}
                {!loading && requests.length === 0 && !error && (
                    <div className="rounded-xl bg-white p-10 text-center shadow">

                        <h2 className="text-xl font-semibold text-gray-900">
                            No service requests yet
                        </h2>

                        <p className="mt-2 text-gray-600">
                            Service requests sent to you will appear here.
                        </p>

                    </div>
                )}


                {/* Requests */}
                {!loading && requests.length > 0 && (
                    <div className="space-y-5">

                        {requests.map((request) => (

                            <div
                                key={request.id}
                                className="rounded-xl bg-white p-6 shadow"
                            >

                                <div className="flex flex-col justify-between gap-4 md:flex-row">

                                    <div>

                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {request.service_title}
                                        </h2>

                                        <p className="mt-2 text-gray-600">
                                            {request.description}
                                        </p>

                                    </div>


                                    <span
                                        className={`h-fit rounded-full px-3 py-1 text-sm font-medium ${
                                            request.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : request.status === "accepted"
                                                ? "bg-green-100 text-green-700"
                                                : request.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {request.status}
                                    </span>

                                </div>


                                <div className="mt-6 grid gap-4 border-t pt-5 md:grid-cols-3">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Customer
                                        </p>

                                        <p className="font-medium text-gray-900">
                                            {request.customer}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Location
                                        </p>

                                        <p className="font-medium text-gray-900">
                                            {request.location}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Preferred date
                                        </p>

                                        <p className="font-medium text-gray-900">
                                            {request.preferred_date}
                                        </p>
                                    </div>

                                </div>


                                {/* Actions */}
                                {request.status === "pending" && (
                                    <div className="mt-6 flex gap-3">

                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    request.id,
                                                    "accepted"
                                                )
                                            }
                                            disabled={
                                                updatingId === request.id
                                            }
                                            className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    request.id,
                                                    "rejected"
                                                )
                                            }
                                            disabled={
                                                updatingId === request.id
                                            }
                                            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Reject
                                        </button>

                                    </div>
                                )}

                            </div>

                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}

export default ProviderServiceRequests;
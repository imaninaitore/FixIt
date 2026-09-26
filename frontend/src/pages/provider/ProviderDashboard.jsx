import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProvider } from "../../services/providerService";
import { getProviderServiceRequests } from "../../services/serviceRequestService";
import { getConversations } from "../../services/messagingService";

function ProviderDashboard() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [conversations, setConversations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [profileData, requestsData, conversationsData] =
                await Promise.all([
                    getMyProvider(),
                    getProviderServiceRequests(),
                    getConversations(),
                ]);

            setProfile(profileData);
            setRequests(requestsData);
            setConversations(conversationsData);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load your provider dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const pendingRequests = requests.filter(
        (request) => request.status === "pending"
    );

    const acceptedRequests = requests.filter(
        (request) => request.status === "accepted"
    );

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <button
                        onClick={() => navigate("/")}
                        className="text-2xl font-bold text-blue-600"
                    >
                        FixIt
                    </button>

                    <div className="flex items-center gap-6">

                        <button
                            onClick={() =>
                                navigate("/provider/service-requests")
                            }
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Service Requests
                        </button>

                        <button
                            onClick={() => navigate("/messages")}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Messages
                        </button>

                    </div>

                </div>
            </nav>


            {/* Main content */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Loading */}
                {loading && (
                    <div className="rounded-xl bg-white p-8 shadow">
                        <p className="text-gray-600">
                            Loading your dashboard...
                        </p>
                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl bg-red-50 p-6 text-red-700">
                        {error}
                    </div>
                )}


                {!loading && !error && (
                    <>

                        {/* Welcome */}
                        <section>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back
                                {profile?.business_name
                                    ? `, ${profile.business_name}`
                                    : ""}
                            </h1>

                            <p className="mt-2 text-gray-600">
                                Manage your service requests, messages,
                                profile, and reviews from here.
                            </p>

                        </section>


                        {/* Statistics */}
                        <section className="mt-8 grid gap-6 md:grid-cols-3">

                            {/* Pending */}
                            <div className="rounded-xl bg-white p-6 shadow">

                                <p className="text-sm font-medium text-gray-500">
                                    Pending Requests
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {pendingRequests.length}
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/provider/service-requests"
                                        )
                                    }
                                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View requests
                                </button>

                            </div>


                            {/* Accepted */}
                            <div className="rounded-xl bg-white p-6 shadow">

                                <p className="text-sm font-medium text-gray-500">
                                    Accepted Requests
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {acceptedRequests.length}
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/provider/service-requests"
                                        )
                                    }
                                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Manage requests
                                </button>

                            </div>


                            {/* Conversations */}
                            <div className="rounded-xl bg-white p-6 shadow">

                                <p className="text-sm font-medium text-gray-500">
                                    Conversations
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {conversations.length}
                                </p>

                                <button
                                    onClick={() => navigate("/messages")}
                                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View messages
                                </button>

                            </div>

                        </section>


                        {/* Quick Actions */}
                        <section className="mt-10">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Quick Actions
                            </h2>

                            <div className="mt-5 grid gap-5 md:grid-cols-4">

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/provider/service-requests"
                                        )
                                    }
                                    className="rounded-xl bg-white p-6 text-left shadow transition hover:shadow-md"
                                >
                                    <h3 className="font-semibold text-gray-900">
                                        Service Requests
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-600">
                                        View and respond to customer requests.
                                    </p>
                                </button>


                                <button
                                    onClick={() => navigate("/messages")}
                                    className="rounded-xl bg-white p-6 text-left shadow transition hover:shadow-md"
                                >
                                    <h3 className="font-semibold text-gray-900">
                                        Messages
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Communicate with your customers.
                                    </p>
                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/providers/${profile?.id}`
                                        )
                                    }
                                    className="rounded-xl bg-white p-6 text-left shadow transition hover:shadow-md"
                                >
                                    <h3 className="font-semibold text-gray-900">
                                        My Profile
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-600">
                                        View your public provider profile.
                                    </p>
                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/providers/${profile?.id}/reviews`
                                        )
                                    }
                                    className="rounded-xl bg-white p-6 text-left shadow transition hover:shadow-md"
                                >
                                    <h3 className="font-semibold text-gray-900">
                                        My Reviews
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-600">
                                        See reviews from your customers.
                                    </p>
                                </button>

                            </div>

                        </section>


                        {/* Recent Requests */}
                        <section className="mt-10">

                            <div className="flex items-center justify-between">

                                <h2 className="text-xl font-semibold text-gray-900">
                                    Recent Service Requests
                                </h2>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/provider/service-requests"
                                        )
                                    }
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View all
                                </button>

                            </div>


                            <div className="mt-5 space-y-4">

                                {requests.length === 0 ? (
                                    <div className="rounded-xl bg-white p-8 text-center shadow">

                                        <p className="text-gray-600">
                                            You do not have any service
                                            requests yet.
                                        </p>

                                    </div>
                                ) : (
                                    requests.slice(0, 5).map((request) => (

                                        <div
                                            key={request.id}
                                            className="rounded-xl bg-white p-6 shadow"
                                        >

                                            <div className="flex flex-col justify-between gap-4 md:flex-row">

                                                <div>

                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {request.service_title}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Customer:{" "}
                                                        {request.customer}
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Location:{" "}
                                                        {request.location}
                                                    </p>

                                                </div>


                                                <span
                                                    className={`self-start rounded-full px-4 py-2 text-sm font-medium ${
                                                        request.status ===
                                                        "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : request.status ===
                                                              "accepted"
                                                            ? "bg-green-100 text-green-800"
                                                            : request.status ===
                                                              "rejected"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {request.status}
                                                </span>

                                            </div>

                                        </div>

                                    ))
                                )}

                            </div>

                        </section>

                    </>
                )}

            </main>

        </div>
    );
}

export default ProviderDashboard;
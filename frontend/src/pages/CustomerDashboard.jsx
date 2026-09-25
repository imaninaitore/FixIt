import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServiceRequests } from "../services/serviceRequestService";

function CustomerDashboard() {
    const navigate = useNavigate();

    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getServiceRequests();

            setServiceRequests(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load your dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const pendingRequests = serviceRequests.filter(
        (request) => request.status === "pending"
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
                            onClick={() => navigate("/")}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Home
                        </button>

                        <button
                            onClick={() => navigate("/providers")}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Providers
                        </button>

                        <button
                            onClick={() => navigate("/service-requests")}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            My Requests
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

                {/* Welcome section */}
                <section className="mb-10 rounded-2xl bg-blue-600 p-8 text-white">

                    <h1 className="text-3xl font-bold">
                        Welcome to your FixIt Dashboard
                    </h1>

                    <p className="mt-3 max-w-2xl text-blue-100">
                        Find trusted service providers, manage your
                        service requests, and communicate with providers
                        from one place.
                    </p>

                    <button
                        onClick={() => navigate("/providers")}
                        className="mt-6 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-gray-100"
                    >
                        Find a Service Provider
                    </button>

                </section>


                {/* Loading */}
                {loading && (
                    <div className="rounded-xl bg-white p-6 shadow">
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

                        {/* Quick actions */}
                        <section className="mb-10">

                            <h2 className="mb-5 text-2xl font-bold text-gray-900">
                                Quick Actions
                            </h2>

                            <div className="grid gap-5 md:grid-cols-3">

                                <button
                                    onClick={() => navigate("/providers")}
                                    className="rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Find a Provider
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        Browse approved service providers
                                        available on FixIt.
                                    </p>
                                </button>


                                <button
                                    onClick={() => navigate("/service-requests")}
                                    className="rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        My Requests
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        View and manage all your service
                                        requests.
                                    </p>
                                </button>


                                <button
                                    onClick={() => navigate("/messages")}
                                    className="rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Messages
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        Communicate with service providers.
                                    </p>
                                </button>

                            </div>

                        </section>


                        {/* Pending requests */}
                        <section className="mb-10">

                            <div className="mb-5 flex items-center justify-between">

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Pending Requests
                                    </h2>

                                    <p className="mt-1 text-gray-600">
                                        Requests waiting for a provider's response.
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/service-requests")}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    View all
                                </button>

                            </div>


                            {pendingRequests.length === 0 ? (

                                <div className="rounded-xl bg-white p-8 text-center shadow">

                                    <h3 className="text-lg font-semibold text-gray-800">
                                        No pending requests
                                    </h3>

                                    <p className="mt-2 text-gray-600">
                                        You don't currently have any pending
                                        service requests.
                                    </p>

                                    <button
                                        onClick={() => navigate("/providers")}
                                        className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                                    >
                                        Find a Provider
                                    </button>

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {pendingRequests.map((request) => (

                                        <div
                                            key={request.id}
                                            className="rounded-xl bg-white p-6 shadow"
                                        >

                                            <div className="flex flex-col justify-between gap-5 md:flex-row">

                                                <div>

                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {request.service_title}
                                                    </h3>

                                                    <p className="mt-2 text-gray-600">
                                                        {request.description}
                                                    </p>

                                                    <div className="mt-4 space-y-1 text-sm text-gray-600">

                                                        <p>
                                                            <span className="font-medium">
                                                                Provider:
                                                            </span>{" "}
                                                            {request.provider || "Waiting for provider"}
                                                        </p>

                                                        <p>
                                                            <span className="font-medium">
                                                                Location:
                                                            </span>{" "}
                                                            {request.location}
                                                        </p>

                                                        <p>
                                                            <span className="font-medium">
                                                                Preferred date:
                                                            </span>{" "}
                                                            {request.preferred_date}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div>

                                                    <span className="inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800">
                                                        Pending
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </section>


                        {/* Messages section */}
                        <section className="rounded-2xl bg-white p-8 shadow">

                            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                                <div>

                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Messages
                                    </h2>

                                    <p className="mt-2 text-gray-600">
                                        Stay connected with the service
                                        providers handling your requests.
                                    </p>

                                </div>

                                <button
                                    onClick={() => navigate("/messages")}
                                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                                >
                                    Open Messages
                                </button>

                            </div>

                        </section>

                    </>
                )}

            </main>

        </div>
    );
}

export default CustomerDashboard;
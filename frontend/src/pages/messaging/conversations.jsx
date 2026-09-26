import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getConversations,
    createConversation,
} from "../../services/messagingService";

function Conversations() {
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getConversations();

            setConversations(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load your conversations."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStartConversation = async () => {
        const providerId = window.prompt(
            "Enter the provider ID you want to message:"
        );

        if (!providerId) {
            return;
        }

        try {
            const data = await createConversation(providerId);

            const conversation = data.conversation || data;

            navigate(`/messages/${conversation.id}`);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to start conversation."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <button
                        onClick={() => navigate("/customer-dashboard")}
                        className="text-2xl font-bold text-blue-600"
                    >
                        FixIt
                    </button>

                    <div className="flex items-center gap-6">

                        <button
                            onClick={() => navigate("/customer-dashboard")}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Dashboard
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

                    </div>

                </div>
            </nav>


            {/* Main content */}
            <main className="mx-auto max-w-5xl px-6 py-10">

                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Messages
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Communicate with service providers about your requests.
                        </p>
                    </div>

                    <button
                        onClick={handleStartConversation}
                        className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                    >
                        Start Conversation
                    </button>

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
                            Loading conversations...
                        </p>
                    </div>
                )}


                {/* Empty state */}
                {!loading && !error && conversations.length === 0 && (
                    <div className="rounded-xl bg-white p-10 text-center shadow">

                        <h2 className="text-xl font-semibold text-gray-900">
                            No conversations yet
                        </h2>

                        <p className="mt-2 text-gray-600">
                            Once you start communicating with a service
                            provider, your conversations will appear here.
                        </p>

                        <button
                            onClick={() => navigate("/providers")}
                            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            Find a Provider
                        </button>

                    </div>
                )}


                {/* Conversations */}
                {!loading && conversations.length > 0 && (
                    <div className="space-y-4">

                        {conversations.map((conversation) => (

                            <button
                                key={conversation.id}
                                onClick={() =>
                                    navigate(
                                        `/messages/${conversation.id}`
                                    )
                                }
                                className="w-full rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="flex items-center justify-between gap-4">

                                    <div>

                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {conversation.provider}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Customer: {conversation.customer}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-500">
                                            Last updated:{" "}
                                            {new Date(
                                                conversation.updated_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>


                                    <div className="flex items-center gap-3">

                                        {conversation.is_archived && (
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                Archived
                                            </span>
                                        )}

                                        <span className="text-blue-600">
                                            View
                                        </span>

                                    </div>

                                </div>

                            </button>

                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}

export default Conversations;
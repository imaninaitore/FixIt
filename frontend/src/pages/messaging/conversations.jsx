import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    MessageSquare,
    Search,
    ArrowRight,
    Archive,
    Clock,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getConversations } from "../../services/messagingService";

function Conversations() {
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        const searchTerm = search.trim().toLowerCase();

        if (!searchTerm) {
            setFilteredConversations(conversations);
            return;
        }

        const filtered = conversations.filter((conversation) => {
            const provider =
                conversation.provider?.toLowerCase() || "";

            const customer =
                conversation.customer?.toLowerCase() || "";

            return (
                provider.includes(searchTerm) ||
                customer.includes(searchTerm)
            );
        });

        setFilteredConversations(filtered);
    }, [search, conversations]);

    async function loadConversations() {
        try {
            setLoading(true);
            setError("");

            const data = await getConversations();

            setConversations(data);
            setFilteredConversations(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load your conversations."
            );
        } finally {
            setLoading(false);
        }
    }

    function getInitial(name) {
        if (!name) {
            return "?";
        }

        return name.charAt(0).toUpperCase();
    }

    function formatDate(date) {
        if (!date) {
            return "No recent activity";
        }

        return new Date(date).toLocaleString();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <section
                className="relative overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/bg.png')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-blue-950/80"></div>

                <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-32 lg:px-10">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
                            FixIt Messages
                        </p>

                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                            Your conversations
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                            Keep track of your conversations with service
                            providers and stay connected throughout your
                            service requests.
                        </p>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-6 py-12 lg:px-10">

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Messages
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {conversations.length}{" "}
                            {conversations.length === 1
                                ? "conversation"
                                : "conversations"}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/providers")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Find a Provider
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                {conversations.length > 0 && (
                    <div className="mb-7">
                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search conversations..."
                                className="w-full rounded-lg border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                        <div>
                            <p className="text-sm font-medium text-red-800">
                                Unable to load messages
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="rounded-xl border border-slate-200 bg-white p-10">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

                            <p className="text-sm text-slate-500">
                                Loading conversations...
                            </p>
                        </div>
                    </div>
                )}

                {!loading &&
                    !error &&
                    conversations.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                                <MessageSquare className="h-7 w-7 text-blue-600" />
                            </div>

                            <h2 className="mt-5 text-xl font-semibold text-slate-900">
                                No conversations yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Once you contact a service provider, your
                                conversations will appear here.
                            </p>

                            <button
                                onClick={() => navigate("/providers")}
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Find a Provider
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    conversations.length > 0 &&
                    filteredConversations.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
                            <Search className="mx-auto h-7 w-7 text-slate-400" />

                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                No conversations found
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Try searching for a different provider.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredConversations.length > 0 && (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Recent conversations
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {filteredConversations.length} shown
                                    </p>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-200">
                                {filteredConversations.map(
                                    (conversation) => (
                                        <button
                                            key={conversation.id}
                                            onClick={() =>
                                                navigate(
                                                    `/messages/${conversation.id}`
                                                )
                                            }
                                            className="group w-full px-6 py-5 text-left transition hover:bg-slate-50"
                                        >
                                            <div className="flex items-center gap-4">

                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-semibold text-white">
                                                    {getInitial(
                                                        conversation.provider
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                        <h3 className="truncate text-base font-semibold text-slate-900">
                                                            {
                                                                conversation.provider
                                                            }
                                                        </h3>

                                                        {conversation.is_archived && (
                                                            <span className="inline-flex w-fit items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                                                                <Archive className="h-3.5 w-3.5" />
                                                                Archived
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Customer:{" "}
                                                        {
                                                            conversation.customer
                                                        }
                                                    </p>

                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Clock className="h-3.5 w-3.5" />

                                                        <span>
                                                            {formatDate(
                                                                conversation.updated_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <ArrowRight className="hidden h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600 sm:block" />
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}
            </main>

            <Footer />
        </div>
    );
}

export default Conversations;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MessageSquare,
    Search,
    ArrowRight,
    Archive,
    Clock,
} from "lucide-react";

import {
    getConversations,
} from "../../services/messagingService";


function Conversations() {
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadConversations();

        const interval = setInterval(() => {
            loadConversations(true);
        }, 10000);

        return () => clearInterval(interval);
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


    async function loadConversations(silent = false) {
        try {
            if (!silent) {
                setLoading(true);
            }

            setError("");

            const data = await getConversations();

            setConversations(data);
            setFilteredConversations(data);
        } catch (err) {
            console.error(err);

            if (!silent) {
                setError(
                    err.message ||
                    "Failed to load your conversations."
                );
            }
        } finally {
            if (!silent) {
                setLoading(false);
            }
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


    function getConversationName(conversation) {
        return (
            conversation.customer ||
            conversation.provider ||
            "Conversation"
        );
    }


    const totalUnread = conversations.reduce(
        (total, conversation) =>
            total + (conversation.unread_count || 0),
        0
    );


    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-100">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                            FixIt Messages
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Conversations
                            </h1>

                            {totalUnread > 0 && (
                                <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                                    {totalUnread} unread
                                </span>
                            )}
                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Communicate with customers about their service
                            requests and keep track of your conversations.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/providers")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Find Providers
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>


                <div className="mb-6">
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search conversations..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>


                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-800">
                            Unable to load messages
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}


                {loading && (
                    <div className="rounded-xl border border-slate-200 bg-white p-10 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                            <p className="text-sm text-slate-500">
                                Loading conversations...
                            </p>
                        </div>
                    </div>
                )}


                {!loading &&
                    !error &&
                    conversations.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                                <MessageSquare className="h-7 w-7 text-blue-600" />
                            </div>

                            <h2 className="mt-5 text-xl font-semibold text-slate-900">
                                No conversations yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Your conversations with customers will
                                appear here.
                            </p>
                        </div>
                    )}


                {!loading &&
                    !error &&
                    conversations.length > 0 &&
                    filteredConversations.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                            <Search className="mx-auto h-7 w-7 text-slate-400" />

                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                No conversations found
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Try searching for a different customer.
                            </p>
                        </div>
                    )}


                {!loading &&
                    !error &&
                    filteredConversations.length > 0 && (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

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
                                    (conversation) => {

                                        const unread =
                                            conversation.unread_count || 0;

                                        return (
                                            <button
                                                key={conversation.id}
                                                onClick={() =>
                                                    navigate(
                                                        `/messages/${conversation.id}`
                                                    )
                                                }
                                                className={`
                                                    group w-full px-6 py-5 text-left
                                                    transition hover:bg-slate-50
                                                    ${
                                                        unread > 0
                                                            ? "bg-blue-50/40"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-4">

                                                    <div
                                                        className={`
                                                            flex h-12 w-12 shrink-0
                                                            items-center justify-center
                                                            rounded-full text-base
                                                            font-semibold
                                                            ${
                                                                unread > 0
                                                                    ? "bg-blue-600 text-white"
                                                                    : "bg-slate-900 text-white"
                                                            }
                                                        `}
                                                    >
                                                        {getInitial(
                                                            getConversationName(
                                                                conversation
                                                            )
                                                        )}
                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex items-center justify-between gap-3">

                                                            <h3
                                                                className={`
                                                                    truncate text-base
                                                                    ${
                                                                        unread > 0
                                                                            ? "font-bold text-slate-900"
                                                                            : "font-semibold text-slate-900"
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    getConversationName(
                                                                        conversation
                                                                    )
                                                                }
                                                            </h3>


                                                            <div className="flex shrink-0 items-center gap-2">

                                                                {unread > 0 && (
                                                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-[11px] font-bold text-white">
                                                                        {unread > 99
                                                                            ? "99+"
                                                                            : unread}
                                                                    </span>
                                                                )}

                                                                {conversation.is_archived && (
                                                                    <span className="hidden items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
                                                                        <Archive className="h-3.5 w-3.5" />
                                                                        Archived
                                                                    </span>
                                                                )}

                                                            </div>

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
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}

            </div>
        </div>
    );
}


export default Conversations;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MessageSquare,
    Search,
    ArrowRight,
    Archive,
    Clock,
} from "lucide-react";

import { getConversations } from "../../services/messagingService";

function Conversations() {
    const navigate = useNavigate();

    const accountType = localStorage.getItem("account_type");

    const isCustomer = accountType === "customer";

    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadConversations(silent = false) {
            try {
                if (!silent && isMounted) {
                    setLoading(true);
                }

                if (isMounted) {
                    setError("");
                }

                const data = await getConversations();

                if (!isMounted) return;

                const conversationList = Array.isArray(data) ? data : [];

                setConversations(conversationList);
            } catch (err) {
                console.error("Failed to load conversations:", err);

                if (isMounted && !silent) {
                    setError(
                        err.message ||
                            "Failed to load your conversations."
                    );
                }
            } finally {
                if (isMounted && !silent) {
                    setLoading(false);
                }
            }
        }

        loadConversations();

        const interval = setInterval(() => {
            loadConversations(true);
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const searchTerm = search.trim().toLowerCase();

        if (!searchTerm) {
            setFilteredConversations(conversations);
            return;
        }

        const filtered = conversations.filter((conversation) => {
            const name = getConversationName(conversation).toLowerCase();

            const customer = String(
                conversation.customer ?? ""
            ).toLowerCase();

            const provider = String(
                conversation.provider ?? ""
            ).toLowerCase();

            return (
                name.includes(searchTerm) ||
                customer.includes(searchTerm) ||
                provider.includes(searchTerm)
            );
        });

        setFilteredConversations(filtered);
    }, [search, conversations, accountType]);

    function getConversationName(conversation) {
        if (isCustomer) {
            return conversation.provider || "Provider";
        }

        return conversation.customer || "Customer";
    }

    function getInitial(name) {
        if (!name) return "?";

        return String(name).charAt(0).toUpperCase();
    }

    function formatDate(date) {
        if (!date) return "No recent activity";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "No recent activity";
        }

        return parsedDate.toLocaleString();
    }

    const totalUnread = conversations.reduce(
        (total, conversation) =>
            total + (Number(conversation.unread_count) || 0),
        0
    );

    return (
        <div
            className="
                min-h-[calc(100vh-4rem)]
                bg-cover
                bg-center
                bg-fixed
                bg-no-repeat
            "
            style={{
                backgroundImage: "url('/images/mountain.jpg')",
            }}
        >
            <div className="min-h-[calc(100vh-4rem)] bg-black/10">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                    {/* Header */}
                    <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div
                            className="
                                rounded-2xl
                                border border-white/30
                                bg-white/20
                                p-5
                                shadow-xl
                                backdrop-blur-md
                                sm:p-6
                            "
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                                FixIt Messages
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                    Conversations
                                </h1>

                                {totalUnread > 0 && (
                                    <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                                        {totalUnread} unread
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                                {isCustomer
                                    ? "Communicate with service providers about your service requests and keep track of your conversations."
                                    : "Communicate with customers about their service requests and keep track of your conversations."}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate(
                                    isCustomer
                                        ? "/providers"
                                        : "/provider/service-requests"
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border border-blue-500/30
                                bg-blue-600
                                px-8
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                transition
                                hover:bg-blue-700
                                hover:shadow-xl
                            "
                        >
                            {isCustomer
                                ? "Find Providers"
                                : "View Service Requests"}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div
                            className="
                                relative
                                max-w-xl
                                rounded-xl
                                border border-white/30
                                bg-white/25
                                shadow-lg
                                backdrop-blur-md
                            "
                        >
                            <Search
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    h-5
                                    w-5
                                    -translate-y-1/2
                                    text-slate-600
                                "
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder={
                                    isCustomer
                                        ? "Search providers..."
                                        : "Search customers..."
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border-0
                                    bg-transparent
                                    py-3.5
                                    pl-12
                                    pr-4
                                    text-sm
                                    font-medium
                                    text-slate-900
                                    outline-none
                                    placeholder:text-slate-600
                                    focus:ring-2
                                    focus:ring-blue-500/60
                                "
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className="
                                mb-6
                                rounded-2xl
                                border border-red-300/40
                                bg-red-50/70
                                p-4
                                shadow-lg
                                backdrop-blur-md
                            "
                        >
                            <p className="text-sm font-semibold text-red-800">
                                Unable to load messages
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>

                            <button
                                onClick={() => window.location.reload()}
                                className="mt-3 text-sm font-semibold text-red-800 underline"
                            >
                                Reload page
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div
                            className="
                                rounded-2xl
                                border border-white/30
                                bg-white/25
                                p-8
                                shadow-xl
                                backdrop-blur-md
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        h-5
                                        w-5
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-white/60
                                        border-t-blue-600
                                    "
                                />

                                <p className="text-sm font-medium text-slate-700">
                                    Loading conversations...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* No conversations */}
                    {!loading &&
                        !error &&
                        conversations.length === 0 && (
                            <div
                                className="
                                    rounded-2xl
                                    border border-white/30
                                    bg-white/25
                                    px-6
                                    py-16
                                    text-center
                                    shadow-xl
                                    backdrop-blur-md
                                "
                            >
                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-blue-600/90
                                        shadow-lg
                                    "
                                >
                                    <MessageSquare className="h-7 w-7 text-white" />
                                </div>

                                <h2 className="mt-5 text-xl font-semibold text-slate-950">
                                    No conversations yet
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-700">
                                    {isCustomer
                                        ? "Your conversations with service providers will appear here."
                                        : "Your conversations with customers will appear here."}
                                </p>
                            </div>
                        )}

                    {/* No search results */}
                    {!loading &&
                        !error &&
                        conversations.length > 0 &&
                        filteredConversations.length === 0 && (
                            <div
                                className="
                                    rounded-2xl
                                    border border-white/30
                                    bg-white/25
                                    px-6
                                    py-14
                                    text-center
                                    shadow-xl
                                    backdrop-blur-md
                                "
                            >
                                <Search className="mx-auto h-7 w-7 text-slate-600" />

                                <h2 className="mt-4 text-lg font-semibold text-slate-950">
                                    No conversations found
                                </h2>

                                <p className="mt-2 text-sm text-slate-700">
                                    Try searching for a different{" "}
                                    {isCustomer ? "provider" : "customer"}.
                                </p>
                            </div>
                        )}

                    {/* Conversations */}
                    {!loading &&
                        !error &&
                        filteredConversations.length > 0 && (
                            <div
                                className="
                                    overflow-hidden
                                    rounded-2xl
                                    border border-white/30
                                    bg-white/20
                                    shadow-2xl
                                    backdrop-blur-md
                                "
                            >
                                {/* List header */}
                                <div
                                    className="
                                        border-b
                                        border-white/30
                                        bg-white/20
                                        px-4
                                        py-4
                                        sm:px-6
                                    "
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-900">
                                            Recent conversations
                                        </p>

                                        <p className="text-xs font-medium text-slate-600">
                                            {filteredConversations.length} shown
                                        </p>
                                    </div>
                                </div>

                                {/* Conversation list */}
                                <div className="divide-y divide-white/30">
                                    {filteredConversations.map(
                                        (conversation) => {
                                            const unread =
                                                Number(
                                                    conversation.unread_count
                                                ) || 0;

                                            const participantName =
                                                getConversationName(
                                                    conversation
                                                );

                                            return (
                                                <button
                                                    key={conversation.id}
                                                    onClick={() =>
                                                        navigate(
                                                            `/messages/${conversation.id}`
                                                        )
                                                    }
                                                    className={`
                                                        group
                                                        w-full
                                                        px-4
                                                        py-4
                                                        text-left
                                                        transition
                                                        hover:bg-white/30
                                                        sm:px-6
                                                        sm:py-5
                                                        ${
                                                            unread > 0
                                                                ? "bg-blue-500/10"
                                                                : ""
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3 sm:gap-4">

                                                        {/* Participant avatar */}
                                                        <div
                                                            className={`
                                                                flex
                                                                h-11
                                                                w-11
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                text-base
                                                                font-semibold
                                                                shadow-md
                                                                ${
                                                                    unread > 0
                                                                        ? "bg-blue-600 text-white"
                                                                        : "bg-slate-900/90 text-white"
                                                                }
                                                            `}
                                                        >
                                                            {getInitial(
                                                                participantName
                                                            )}
                                                        </div>

                                                        {/* Conversation details */}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <h3
                                                                    className={`
                                                                        truncate
                                                                        text-sm
                                                                        sm:text-base
                                                                        ${
                                                                            unread > 0
                                                                                ? "font-bold text-slate-950"
                                                                                : "font-semibold text-slate-900"
                                                                        }
                                                                    `}
                                                                >
                                                                    {participantName}
                                                                </h3>

                                                                <div className="flex shrink-0 items-center gap-2">
                                                                    {unread > 0 && (
                                                                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-[11px] font-bold text-white shadow-sm">
                                                                            {unread > 99
                                                                                ? "99+"
                                                                                : unread}
                                                                        </span>
                                                                    )}

                                                                    {conversation.is_archived && (
                                                                        <span className="hidden items-center gap-1 rounded-md bg-white/40 px-2 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
                                                                            <Archive className="h-3.5 w-3.5" />
                                                                            Archived
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <p className="mt-1 truncate text-sm text-slate-700">
                                                                {isCustomer
                                                                    ? "Service provider"
                                                                    : "Customer"}
                                                            </p>

                                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                                                                <Clock className="h-3.5 w-3.5 shrink-0" />

                                                                <span className="truncate">
                                                                    {formatDate(
                                                                        conversation.updated_at
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Arrow */}
                                                        <ArrowRight
                                                            className="
                                                                hidden
                                                                h-5
                                                                w-5
                                                                shrink-0
                                                                text-slate-500
                                                                transition
                                                                group-hover:translate-x-1
                                                                group-hover:text-blue-600
                                                                sm:block
                                                            "
                                                        />
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
        </div>
    );
}

export default Conversations;
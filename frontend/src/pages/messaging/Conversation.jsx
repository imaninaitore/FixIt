import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Clock,
    Send,
    MessageSquare,
} from "lucide-react";

import {
    getConversation,
    getConversationMessages,
    sendMessage,
} from "../../services/messagingService";

function Conversation() {
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadConversation();
    }, [conversationId]);

    async function loadConversation() {
        try {
            setLoading(true);
            setError("");

            const conversationData = await getConversation(
                conversationId
            );

            const messagesData = await getConversationMessages(
                conversationId
            );

            setConversation(conversationData);
            setMessages(messagesData);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load conversation."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSendMessage(event) {
        event.preventDefault();

        if (!messageText.trim()) {
            return;
        }

        try {
            setSending(true);
            setError("");

            const newMessage = await sendMessage(
                conversationId,
                messageText.trim()
            );

            setMessages((previousMessages) => [
                ...previousMessages,
                newMessage,
            ]);

            setMessageText("");
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to send message."
            );
        } finally {
            setSending(false);
        }
    }

    function getInitial(name) {
        if (!name) {
            return "?";
        }

        return name.charAt(0).toUpperCase();
    }

    function formatTime(date) {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString();
    }

    return (
        <div className="min-h-screen bg-[#081426]">

            {/* Application header */}
            <header className="border-b border-white/10 bg-[#081426]">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-8">

                    <button
                        onClick={() => navigate("/")}
                        className="text-2xl font-bold tracking-tight text-white"
                    >
                        Fix<span className="text-blue-400">It</span>
                    </button>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => navigate("/messages")}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />

                            <span className="hidden sm:inline">
                                Messages
                            </span>
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="hidden text-sm font-medium text-slate-400 transition hover:text-white sm:block"
                        >
                            Home
                        </button>

                    </div>
                </div>
            </header>


            {/* Messaging area */}
            <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden">

                {/* Calm background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#081426] via-[#102442] to-[#183a63]"></div>

                <div className="absolute left-0 top-0 h-full w-1/2 bg-blue-900/10"></div>


                <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1400px] p-4 sm:p-6 lg:p-8">

                    {/* Main conversation window */}
                    <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">

                        {/* Conversation information column */}
                        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50 lg:block">

                            <div className="border-b border-slate-200 px-6 py-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Messages
                                </p>

                                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                    Conversations
                                </h2>
                            </div>

                            {!loading && conversation && (
                                <div className="px-4 py-4">

                                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                                {getInitial(
                                                    conversation.provider
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {conversation.provider}
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Service Provider
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                        </aside>


                        {/* Conversation */}
                        <section className="flex min-w-0 flex-1 flex-col">

                            {/* Conversation header */}
                            {!loading && conversation && (
                                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">

                                    <div className="flex min-w-0 items-center gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                            {getInitial(
                                                conversation.provider
                                            )}
                                        </div>

                                        <div className="min-w-0">

                                            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                                                {conversation.provider}
                                            </h1>

                                            <p className="truncate text-xs text-slate-500 sm:text-sm">
                                                Customer:{" "}
                                                {
                                                    conversation.customer
                                                }
                                            </p>

                                        </div>

                                    </div>

                                    {conversation.is_archived && (
                                        <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                                            Archived
                                        </span>
                                    )}

                                </div>
                            )}


                            {/* Loading */}
                            {loading && (
                                <div className="flex flex-1 items-center justify-center bg-slate-50">

                                    <div className="text-center">

                                        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

                                        <p className="mt-4 text-sm text-slate-500">
                                            Loading conversation...
                                        </p>

                                    </div>

                                </div>
                            )}


                            {/* Error */}
                            {!loading && error && (
                                <div className="flex flex-1 items-center justify-center bg-slate-50 px-6">

                                    <div className="max-w-md text-center">

                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Unable to load conversation
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            {error}
                                        </p>

                                        <button
                                            onClick={loadConversation}
                                            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            Try Again
                                        </button>

                                    </div>

                                </div>
                            )}


                            {/* Messages */}
                            {!loading &&
                                !error &&
                                conversation && (
                                    <>
                                        <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-7">

                                            {messages.length === 0 ? (
                                                <div className="flex h-full min-h-[350px] items-center justify-center">

                                                    <div className="text-center">

                                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                                                            <MessageSquare className="h-5 w-5 text-blue-600" />
                                                        </div>

                                                        <h2 className="mt-4 font-semibold text-slate-800">
                                                            No messages yet
                                                        </h2>

                                                        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                                            Send a message below
                                                            to start the
                                                            conversation.
                                                        </p>

                                                    </div>

                                                </div>
                                            ) : (
                                                <div className="mx-auto max-w-4xl space-y-4">

                                                    {messages.map(
                                                        (message) => (
                                                            <div
                                                                key={
                                                                    message.id
                                                                }
                                                                className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                                                            >

                                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                                                    <p className="text-sm font-semibold text-slate-900">
                                                                        {
                                                                            message.sender
                                                                        }
                                                                    </p>

                                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                                        <Clock className="h-3.5 w-3.5" />

                                                                        <span>
                                                                            {formatTime(
                                                                                message.created_at
                                                                            )}
                                                                        </span>
                                                                    </div>

                                                                </div>

                                                                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                                                    {
                                                                        message.content
                                                                    }
                                                                </p>

                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                        </div>


                                        {/* Composer */}
                                        {!conversation.is_archived ? (
                                            <form
                                                onSubmit={
                                                    handleSendMessage
                                                }
                                                className="border-t border-slate-200 bg-white p-4 sm:p-5"
                                            >

                                                <div className="mx-auto max-w-4xl">

                                                    <div className="flex items-end gap-3 rounded-xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

                                                        <textarea
                                                            value={
                                                                messageText
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setMessageText(
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Write a message..."
                                                            rows="2"
                                                            className="min-h-[52px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                                        />

                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                sending ||
                                                                !messageText.trim()
                                                            }
                                                            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Send className="h-4 w-4" />

                                                            <span className="hidden sm:inline">
                                                                {sending
                                                                    ? "Sending..."
                                                                    : "Send"}
                                                            </span>
                                                        </button>

                                                    </div>

                                                </div>

                                            </form>
                                        ) : (
                                            <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 text-center">
                                                <p className="text-sm text-slate-500">
                                                    This conversation has been
                                                    archived.
                                                </p>
                                            </div>
                                        )}

                                    </>
                                )}

                        </section>

                    </div>

                </div>
            </main>
        </div>
    );
}

export default Conversation;
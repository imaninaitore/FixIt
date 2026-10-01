import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Send,
    MoreVertical,
    Archive,
} from "lucide-react";

import {
    getConversation,
    getMessages,
    sendMessage,
    markConversationRead,
} from "../../services/messagingService";


function Conversation() {
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const messagesEndRef = useRef(null);

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");


    const username =
        localStorage.getItem("username") || "";


    useEffect(() => {
        loadConversation();

        const interval = setInterval(() => {
            loadMessages(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [conversationId]);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    async function loadConversation() {
        try {
            setLoading(true);
            setError("");

            const conversationData =
                await getConversation(conversationId);

            setConversation(conversationData);

            const messageData =
                await getMessages(conversationId);

            setMessages(messageData);

            await markConversationRead(conversationId);
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Failed to load this conversation."
            );
        } finally {
            setLoading(false);
        }
    }


    async function loadMessages(silent = false) {
        try {
            const messageData =
                await getMessages(conversationId);

            setMessages(messageData);

            const unreadMessages = messageData.filter(
                (message) =>
                    !message.is_read &&
                    message.sender !== username
            );

            if (unreadMessages.length > 0) {
                await markConversationRead(conversationId);
            }
        } catch (err) {
            console.error(
                "Failed to refresh messages:",
                err
            );

            if (!silent) {
                setError(
                    "Failed to load messages."
                );
            }
        }
    }


    async function handleSendMessage(event) {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent || sending) {
            return;
        }

        try {
            setSending(true);
            setError("");

            const newMessage = await sendMessage(
                conversationId,
                trimmedContent
            );

            setMessages((current) => [
                ...current,
                newMessage,
            ]);

            setContent("");
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


    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }


    function formatTime(date) {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    }


    if (loading) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                    <p className="text-sm text-slate-500">
                        Loading conversation...
                    </p>
                </div>
            </div>
        );
    }


    if (error && !conversation) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-slate-100 p-8">
                <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="font-semibold text-red-800">
                        Unable to open conversation
                    </p>

                    <p className="mt-2 text-sm text-red-700">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/messages")}
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Back to Messages
                    </button>
                </div>
            </div>
        );
    }


    const otherPerson =
        conversation?.customer === username
            ? conversation?.provider
            : conversation?.customer;


    return (
        <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col bg-slate-100">

            <div className="shrink-0 border-b border-slate-200 bg-white">

                <div className="flex h-16 items-center gap-4 px-5 sm:px-8">

                    <button
                        onClick={() => navigate("/messages")}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>


                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {otherPerson?.charAt(0).toUpperCase()}
                    </div>


                    <div className="min-w-0 flex-1">

                        <h1 className="truncate text-sm font-bold text-slate-900">
                            {otherPerson || "Conversation"}
                        </h1>

                        <p className="text-xs text-slate-400">
                            FixIt conversation
                        </p>

                    </div>


                    <button
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                </div>

            </div>


            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">

                <div className="mx-auto flex max-w-4xl flex-col gap-3">

                    {messages.length === 0 && (
                        <div className="my-auto flex min-h-64 flex-col items-center justify-center text-center">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                                <Send className="h-6 w-6 text-blue-600" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                                Start the conversation
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Send a message to begin communicating.
                            </p>

                        </div>
                    )}


                    {messages.map((message) => {

                        const isMine =
                            message.sender === username;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${
                                    isMine
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >

                                <div
                                    className={`
                                        max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
                                        ${
                                            isMine
                                                ? "rounded-br-md bg-blue-600 text-white"
                                                : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                                        }
                                    `}
                                >

                                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                        {message.content}
                                    </p>


                                    <div
                                        className={`
                                            mt-1 text-[10px]
                                            ${
                                                isMine
                                                    ? "text-blue-100"
                                                    : "text-slate-400"
                                            }
                                        `}
                                    >
                                        {formatTime(
                                            message.created_at
                                        )}
                                    </div>

                                </div>

                            </div>
                        );
                    })}


                    <div ref={messagesEndRef} />

                </div>

            </div>


            {error && (
                <div className="shrink-0 border-t border-red-100 bg-red-50 px-5 py-2">
                    <p className="text-center text-xs text-red-700">
                        {error}
                    </p>
                </div>
            )}


            <form
                onSubmit={handleSendMessage}
                className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 sm:px-8"
            >

                <div className="mx-auto flex max-w-4xl items-end gap-3">

                    <textarea
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" &&
                                !event.shiftKey
                            ) {
                                event.preventDefault();
                                handleSendMessage(event);
                            }
                        }}
                        rows={1}
                        placeholder="Type a message..."
                        className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />


                    <button
                        type="submit"
                        disabled={
                            sending ||
                            !content.trim()
                        }
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>

                </div>

            </form>

        </div>
    );
}


export default Conversation;
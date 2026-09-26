import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

    const loadConversation = async () => {
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
    };

    const handleSendMessage = async (event) => {
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
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="border-b bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

                    <button
                        onClick={() => navigate("/customer-dashboard")}
                        className="text-2xl font-bold text-blue-600"
                    >
                        FixIt
                    </button>

                    <button
                        onClick={() => navigate("/messages")}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        Back to Messages
                    </button>

                </div>
            </nav>


            <main className="mx-auto max-w-4xl px-6 py-8">

                {/* Loading */}
                {loading && (
                    <div className="rounded-xl bg-white p-8 text-center shadow">
                        <p className="text-gray-600">
                            Loading conversation...
                        </p>
                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl bg-red-50 p-6 text-red-700">
                        {error}
                    </div>
                )}


                {/* Conversation */}
                {!loading && !error && conversation && (
                    <div className="overflow-hidden rounded-xl bg-white shadow">

                        {/* Conversation header */}
                        <div className="border-b px-6 py-5">

                            <h1 className="text-xl font-bold text-gray-900">
                                {conversation.provider}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Customer: {conversation.customer}
                            </p>

                            {conversation.is_archived && (
                                <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                    Archived
                                </span>
                            )}

                        </div>


                        {/* Messages */}
                        <div className="min-h-[400px] space-y-4 bg-gray-50 p-6">

                            {messages.length === 0 && (
                                <div className="py-16 text-center">
                                    <p className="text-gray-500">
                                        No messages yet.
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Send a message to start the conversation.
                                    </p>
                                </div>
                            )}


                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className="rounded-lg bg-white p-4 shadow-sm"
                                >

                                    <div className="flex items-center justify-between gap-4">

                                        <p className="font-medium text-gray-900">
                                            {message.sender}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {new Date(
                                                message.created_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <p className="mt-2 text-gray-700">
                                        {message.content}
                                    </p>

                                </div>
                            ))}

                        </div>


                        {/* Send message */}
                        {!conversation.is_archived && (
                            <form
                                onSubmit={handleSendMessage}
                                className="border-t bg-white p-6"
                            >

                                <label
                                    htmlFor="message"
                                    className="mb-2 block font-medium text-gray-700"
                                >
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    value={messageText}
                                    onChange={(event) =>
                                        setMessageText(event.target.value)
                                    }
                                    placeholder="Write your message..."
                                    rows="4"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />

                                <div className="mt-4 flex justify-end">

                                    <button
                                        type="submit"
                                        disabled={
                                            sending ||
                                            !messageText.trim()
                                        }
                                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {sending
                                            ? "Sending..."
                                            : "Send Message"}
                                    </button>

                                </div>

                            </form>
                        )}

                    </div>
                )}

            </main>

        </div>
    );
}

export default Conversation;
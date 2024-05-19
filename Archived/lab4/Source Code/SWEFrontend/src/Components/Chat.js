import getChatMessages from "../APICalls/getChatMessages";
import sendChatMessage from "../APICalls/sendChatMessage";

import { useEffect, useState } from "react";

function Chat({ role }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let isPollingAllowed = true; // Flag to control polling

        const fetchMessages = async () => {
            const chatMessages = await getChatMessages();
            setMessages(chatMessages);
        };

        const startPolling = () => {
            const pollingInterval = setInterval(async () => {
                if (!isPollingAllowed) {
                    clearInterval(pollingInterval);
                    return;
                }
                fetchMessages();
            }, 500);
        };

        fetchMessages();
        startPolling();

        return () => {
            isPollingAllowed = false;
        };
    }, []);

    const sendMessage = async () => {
        if (message.trim() !== "") {
            const dateTime = new Date();
            dateTime.setHours(dateTime.getHours() + 8);
            const success = await sendChatMessage(message, role);
            if (success) {
                setMessages([...messages, { message: message, role: role, time: dateTime.toISOString() }]);
                setMessage("");
            }
        }
    };

    if (!messages) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-3 flex justify-center">
            <div className="my-5 w-full max-w-md">
                <div className="bg-gray-100 p-4 rounded-lg w-full">
                    <h1 className="text-center mb-4 text-xl font-bold">Chat</h1>
                    <div className="flex flex-col w-full h-80 overflow-y-auto" style={{scrollPaddingBottom: '999px', scrollBehavior: "smooth" }} >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === role ? "self-end" : "self-start"} mb-2`}
                            >
                                <div className="bg-white rounded-lg p-2 max-w-[270px]">
                                    <p className="text-gray-600 text-sm">{msg.role === role ? "You" : role === "requester" ? "Driver": "Customer"} - {msg.time.substring(11, 19)}</p>
                                    <p className="text-black">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex mt-4">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 border-2 border-gray-500 rounded-md p-1 mr-2"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Send
                        </button>
                    </div>

                </div>
                
            </div>
        </div>
    );
}

export default Chat;
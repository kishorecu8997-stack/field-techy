import { useState } from "react";
import { mockChat } from "@/dummy_data/supportChat";
import { FiMessageSquare, FiX } from "react-icons/fi"; // Icons

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(mockChat);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { sender: "user", message: input },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
      >
        <FiMessageSquare className="w-5 h-5" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b font-semibold text-gray-800 dark:text-gray-100">
            <span>Live Support</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded max-w-[75%] break-words ${
                  msg.sender === "support"
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    : "bg-teal-500 text-white ml-auto"
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-3 border-t gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={sendMessage}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChatWidget;

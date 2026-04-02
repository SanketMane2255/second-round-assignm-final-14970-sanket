import { User, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { type Message as MessageType } from "../features/chat/chatSlice";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`flex items-start max-w-[70%] gap-3 ${isUser ? "flex-row" : "flex-row-reverse"}`}
      >
        <div className={`flex-shrink-0`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUser ? "bg-blue-500" : "bg-green-500"
            }`}
          >
            {isUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
        <div
          className={`rounded-lg px-4 py-3 shadow-md ${
            isUser
              ? "bg-blue-100 text-gray-800"
              : "bg-white text-gray-800 border border-gray-200"
          }`}
        >
          {message.images && message.images.length > 0 && (
            <div
              className="grid grid-cols-3 gap-1.5 mb-2"
              style={{ maxWidth: "300px" }}
            >
              {message.images.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={img}
                    alt={`User uploaded ${index + 1}`}
                    className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ width: "88px", height: "88px" }}
                  />
                </div>
              ))}
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <span className="text-xs text-gray-500 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;

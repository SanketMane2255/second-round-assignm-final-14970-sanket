import { User, Bot } from 'lucide-react';
import { type Message as MessageType } from '../features/chat/chatSlice';

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}>
      <div className={`flex items-start max-w-[70%] ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 ${isUser ? 'mr-3' : 'ml-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
          </div>
        </div>
        <div className={`rounded-lg px-4 py-3 shadow-md ${
          isUser
            ? 'bg-blue-100 text-gray-800'
            : 'bg-green-100 text-gray-800'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <span className="text-xs text-gray-500 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;

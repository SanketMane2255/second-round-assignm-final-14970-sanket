import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, MessageSquare } from 'lucide-react';
import { type RootState, type AppDispatch } from '../app/store';
import { sendMessage, addUserMessage, clearChat, clearError } from '../features/chat/chatSlice';
import Message from './Message';
import InputBox from './InputBox';
import Loader from './Loader';

const ChatBox = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading, error } = useSelector((state: RootState) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (content: string) => {
    dispatch(addUserMessage(content));
    dispatch(sendMessage(content));
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      dispatch(clearChat());
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">AI Chatbox</h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-700 hover:text-red-900 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Start a Conversation</h2>
              <p className="text-gray-500">Send a message to begin chatting with AI</p>
            </div>
          )}

          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {loading && <Loader />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <InputBox onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatBox;

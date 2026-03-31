import { useState, type KeyboardEvent,  } from 'react';
import { Send } from 'lucide-react';

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const InputBox = ({ onSend, disabled }: InputBoxProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          style={{ minHeight: '48px', minWidth: '48px' }}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift + Enter for new line</p>
    </div>
  );
};

export default InputBox;

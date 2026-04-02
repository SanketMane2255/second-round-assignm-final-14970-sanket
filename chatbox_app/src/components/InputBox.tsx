
import { useState,type KeyboardEvent, useRef,type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { convertFileToBase64, createImagePreviewUrl, isValidImageFile } from '../utils/fileHelpers';
import { useDispatch, useSelector } from 'react-redux';
import {  addAttachments, removeAttachment, clearAttachment } from '../features/chat/chatSlice';
import { type RootState } from '../app/store';
import useSpeech from '../hooks/useSpeech';
import ImagePreview from './ImagePreview';
import type { Attachment } from '../features/chat/chatAPI';

interface InputBoxProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  disabled: boolean;
}

const InputBox = ({ onSend, disabled }: InputBoxProps) => {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
const attachments = useSelector((state: RootState) => state.chat.attachments);

  const { isRecording, toggleRecording } = useSpeech({
    onResult: (transcript: string) => {
      setInput((prev) => prev + (prev ? ' ' : '') + transcript);
    },
    onError: (error: string) => {
      console.error('Speech recognition error:', error);
    },
  });

  const handleSend = () => {
  if (input.trim() && !disabled) {
    onSend(input.trim(), attachments);
    setInput('');
    if (attachments.length > 0) {
      dispatch(clearAttachment());
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }
};

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const validFiles = files.filter(isValidImageFile);
  if (validFiles.length === 0) return;

  try {
    const newAttachments = await Promise.all(
      validFiles.map(async (file) => {
        const base64 = await convertFileToBase64(file);
        const preview = createImagePreviewUrl(file);
        return { file, base64, preview };
      })
    );
    dispatch(addAttachments(newAttachments));
  } catch (error) {
    console.error('Error reading files:', error);
  }
};
  
  const handleRemoveAttachment = (index: number) => {
  dispatch(removeAttachment(index));
  if (attachments.length === 1 && fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};


  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {attachments.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-2">
    {attachments.map((attachment, index) => (
      <ImagePreview
        key={index}
        preview={attachment.preview}
        filename={attachment.file.name}
        onRemove={() => handleRemoveAttachment(index)}
      />
    ))}
  </div>
)}
      <div className="flex items-end gap-2 mt-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 p-3 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRecording}
          disabled={disabled}
          className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
            isRecording ? 'bg-red-100' : 'hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <MicOff className="w-5 h-5 text-red-600" />
            </motion.div>
          ) : (
            <Mic className="w-5 h-5 text-gray-600" />
          )}
        </motion.button>

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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="flex-shrink-0 bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          style={{ minHeight: '48px', minWidth: '48px' }}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift + Enter for new line</p>
    </div>
  );
};

export default InputBox;

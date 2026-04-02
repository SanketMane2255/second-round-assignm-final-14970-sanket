import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import { sendMessageToAPI,type ChatMessage } from './chatAPI';

export interface Attachment {
  file: File;
  base64: string;
  preview: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  images?: string[];
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  attachments: Attachment[];
  isRecording: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  attachments: [],
  isRecording: false,
};

export interface SendMessagePayload {
  content: string;
  attachments?: Attachment[]; // ← plural, remove old 'attachment'
}


export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (payload: SendMessagePayload, { getState }) => {
    const state = getState() as { chat: ChatState };
    const conversationHistory: ChatMessage[] = state.chat.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
    const response = await sendMessageToAPI(conversationHistory, {
      content: payload.content,
      attachments: payload.attachments, // ← plural
    });
    return response;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<{ content: string; images?: string[] }>) => {
  const newMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: action.payload.content,
    timestamp: Date.now(),
    images: action.payload.images,
  };
  state.messages.push(newMessage);
  state.error = null;
},
    setAttachment: (state, action: PayloadAction<Attachment[]>) => {
  state.attachments = action.payload;
},
addAttachments: (state, action: PayloadAction<Attachment[]>) => {
  state.attachments = [...state.attachments, ...action.payload];
},
removeAttachment: (state, action: PayloadAction<number>) => {
  const removed = state.attachments[action.payload];
  if (removed?.preview) URL.revokeObjectURL(removed.preview);
  state.attachments = state.attachments.filter((_, i) => i !== action.payload);
},
clearAttachment: (state) => {
  state.attachments.forEach(a => {
    if (a?.preview) URL.revokeObjectURL(a.preview);
  });
  state.attachments = [];
},
    toggleRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
clearChat: (state) => {
  state.messages = [];
  state.error = null;
  state.attachments.forEach(a => {
    if (a?.preview) URL.revokeObjectURL(a.preview);
  });
  state.attachments = [];
},
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: action.payload,
          timestamp: Date.now(),
        };
        state.messages.push(aiMessage);
      
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { addUserMessage, setAttachment, addAttachments, removeAttachment, clearAttachment, toggleRecording, clearChat, clearError } = chatSlice.actions;
export default chatSlice.reducer;

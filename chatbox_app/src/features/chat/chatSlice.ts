import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { sendMessageToAPI, type ChatMessage,  } from './chatAPI';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (content: string, { getState }) => {
    const state = getState() as { chat: ChatState };

    const conversationHistory: ChatMessage[] = state.chat.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    conversationHistory.push({
      role: 'user',
      content: content,
    });

    const response = await sendMessageToAPI(conversationHistory);
    return response;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: action.payload,
        timestamp: Date.now(),
      };
      state.messages.push(newMessage);
      state.error = null;
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
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

export const { addUserMessage, clearChat, clearError } = chatSlice.actions;
export default chatSlice.reducer;

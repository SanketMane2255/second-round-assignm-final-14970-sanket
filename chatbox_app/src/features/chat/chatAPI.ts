import axios from 'axios';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent'; // ← fixed model name

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Attachment {
  file: File;
  base64: string;
  preview: string;
}

interface TextPart {
  text: string;
}

interface InlineDataPart {
  inline_data: {
    mime_type: string;
    data: string;
  };
}

type GeminiPart = TextPart | InlineDataPart;

export interface SendMessagePayload {
  content: string;
  attachments?: Attachment[]; // ← plural, remove old 'attachment'
}

export interface ChatAPIResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const sendMessageToAPI = async (
  messages: ChatMessage[],
  payload: SendMessagePayload
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    throw new Error('Please set your API key in the .env file');
  }

  try {
    // Build parts: text first, then all images
 const parts: GeminiPart[] = [{ text: payload.content }];

if (payload.attachments && payload.attachments.length > 0) {
  payload.attachments.forEach((attachment) => {
    parts.push({
      inline_data: {
        mime_type: attachment.file.type || 'image/jpeg',
        data: attachment.base64,
      },
    });
  });
}

    const response = await axios.post<ChatAPIResponse>(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          ...messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
          {
            role: 'user',
            parts: parts, // ← includes all images
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your API key.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Check API permissions.');
      } else if (error.response?.status === 404) {
        throw new Error('Model not found. Please check model name.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response) {
        throw new Error(
          `API Error: ${error.response.data?.error?.message || 'Unknown error'}`
        );
      } else if (error.request) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    throw new Error('Failed to send message. Please try again.');
  }
};

















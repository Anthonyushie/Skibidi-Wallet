import { useState, useCallback } from 'react';
import { ChatMessage } from '../models/ChatMessage';
import { openAIService } from '../services/openAIService';

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Yo yo yo! Welcome to the skibidi zone! 🚀 Ask me anything about Bitcoin, Lightning, or just vibe with me!',
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await openAIService.chatWithBot(text, messages);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Bruh, my brain is buffering rn 🤖💀 Try again in a sec!',
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  return {
    messages,
    loading,
    sendMessage,
  };
};
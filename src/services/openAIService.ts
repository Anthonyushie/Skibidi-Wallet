import OpenAI from 'openai';
import { ChatMessage } from '../models/ChatMessage';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    });
  }

  async chatWithBot(message: string, history: ChatMessage[]): Promise<string> {
    try {
      const systemPrompt = `You are Skibidi Bot, a Gen Z AI assistant for a Bitcoin wallet app. 
      You speak in meme language, use terms like "skibidi", "rizz", "cap/no cap", "fr fr", "bussin", etc.
      You're knowledgeable about Bitcoin and Lightning Network but explain things in a fun, meme way.
      Keep responses short and engaging. Always be helpful but maintain the skibidi energy!`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...history.slice(-10).map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text,
        })),
        { role: 'user' as const, content: message },
      ];

      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages,
        max_tokens: 150,
        temperature: 0.8,
      });

      return response.choices[0]?.message?.content || 'Bruh my brain is lagging rn 💀';
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw error;
    }
  }

  async generateTransactionNarration(transaction: { type: 'send' | 'receive'; amount: number }): Promise<string> {
    try {
      const prompt = `Generate a short, meme-filled celebration message for a Bitcoin ${transaction.type} transaction of ${transaction.amount} sats. Use Gen Z slang like "skibidi", "rizz", "bussin", "no cap", etc. Keep it under 20 words.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
        temperature: 0.9,
      });

      return response.choices[0]?.message?.content || 'Your sats are moving with skibidi energy! 🚀';
    } catch (error) {
      console.error('Transaction narration error:', error);
      return 'Sats go brrrr! 💸✨';
    }
  }

  async generateAvatar(prompt: string): Promise<string> {
    try {
      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '256x256',
        quality: 'standard',
        n: 1,
      });

      if (response.data && response.data.length > 0 && response.data[0].url) {
        return response.data[0].url;
      }

      console.warn('No image URL returned from OpenAI');
      return '';
    } catch (error) {
      console.error('Avatar generation error:', error);
      return '';
    }
  }
}

export const openAIService = new OpenAIService();

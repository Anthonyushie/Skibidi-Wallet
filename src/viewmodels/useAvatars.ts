import { useState, useEffect, useCallback } from 'react';
import { Avatar } from '../models/ChatMessage';
import { openAIService } from '../services/openAIService';

export const useAvatars = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(false);

  const generateAvatars = useCallback(async () => {
    try {
      setLoading(true);
      const prompts = [
        'skibidi warrior cartoon avatar with neon colors',
        'cyber punk bitcoin hodler avatar with glowing eyes',
        'lightning bolt mascot character with sunglasses',
        'diamond hands ape wearing a crown meme avatar',
      ];

      const avatarPromises = prompts.map(async (prompt, index) => {
        const url = await openAIService.generateAvatar(prompt);
        return {
          id: index.toString(),
          url,
          prompt,
        };
      });

      const generatedAvatars = await Promise.all(avatarPromises);
      setAvatars(generatedAvatars);
    } catch (err) {
      console.error('Failed to generate avatars:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    generateAvatars();
  }, [generateAvatars]);

  return {
    avatars,
    loading,
    generateAvatars,
  };
};
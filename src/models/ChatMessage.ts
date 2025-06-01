export interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: number;
  }
  
  export interface Avatar {
    id: string;
    url: string;
    prompt: string;
  }
export interface WalletModel {
    isInitialized: boolean;
    onchainBalance: number;
    lightningBalance: number;
    seedPhrase?: string;
    isOnboarded: boolean;
  }
  
  export interface Transaction {
    id: string;
    amount: number;
    type: 'send' | 'receive';
    timestamp: number;
    description?: string;
    aiNarration?: string;
  }
  
  export interface PaymentRequest {
    bolt11?: string;
    address?: string;
    amount: number;
    description?: string;
  }
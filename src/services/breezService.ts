// ✅ Update your BreezService class to include `generateSeed`, `createWallet`, and `restoreWallet`

import {
    connect,
    defaultConfig,
    disconnect,
    SdkEvent,
    LiquidNetwork,
    PayAmountVariant,
  } from '@breeztech/react-native-breez-sdk-liquid';
  import * as FileSystem from 'expo-file-system';
  import bip39 from '@dawar2151/bip39-expo';
  
  export class BreezService {
    private sdk: any = null;
  
    // ✅ Add generateSeed
    async generateSeed(): Promise<string> {
      return await bip39.generateMnemonic();
    }
  
    // ✅ Create wallet with new seed
    async createWallet(): Promise<string> {
      const mnemonic = await this.generateSeed();
      const success = await this.initializeSDK(mnemonic);
      if (!success) throw new Error('Failed to initialize SDK');
      return mnemonic;
    }
  
    // ✅ Restore wallet with existing seed
    async restoreWallet(mnemonic: string): Promise<void> {
      const success = await this.initializeSDK(mnemonic);
      if (!success) throw new Error('Failed to restore wallet');
    }
  
    // ✅ Allow initializeSDK to accept optional mnemonic
    async initializeSDK(mnemonic?: string): Promise<boolean> {
      try {
        const seed = mnemonic || await this.generateSeed();
        const apiKey = process.env.EXPO_PUBLIC_BREEZ_API_KEY!;
        const config = await defaultConfig(LiquidNetwork.MAINNET, apiKey);
        config.workingDir = `${FileSystem.documentDirectory}breez_data`;
        this.sdk = await connect({ config, mnemonic: seed });
  
        this.sdk.addEventListener((event: SdkEvent) => {
          console.log('Breez SDK Event:', event);
        });
  
        return true;
      } catch (error) {
        console.error('Failed to initialize Breez SDK:', error);
        return false;
      }
    }
  
    async getBalances(): Promise<{ onchain: number; lightning: number }> {
      if (!this.sdk) throw new Error('SDK not initialized');
      const info = await this.sdk.getInfo();
      return {
        onchain: info.onchainBalance ?? 0,
        lightning: info.channelBalance ?? 0,
      };
    }
  
    async payInvoice(bolt11: string): Promise<string> {
      if (!this.sdk) throw new Error('SDK not initialized');
      const payment = await this.sdk.payInvoice(bolt11);
      return payment.id;
    }
  
    async sendOnChain(address: string, amount: number): Promise<string> {
      if (!this.sdk) throw new Error('SDK not initialized');
      const payment = await this.sdk.sendOnchain(address, amount);
      return payment.txid;
    }
  
    async generateInvoice(amount: number, description?: string): Promise<string> {
      if (!this.sdk) throw new Error('SDK not initialized');
      const invoice = await this.sdk.receivePayment(amount, description);
      return invoice.bolt11;
    }
  
    async disconnectSDK(): Promise<void> {
      if (this.sdk) {
        await disconnect();
        this.sdk = null;
      }
    }
  }
  
  export const breezService = new BreezService();
  
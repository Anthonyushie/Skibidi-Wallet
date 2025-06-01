import { useState, useEffect, useCallback } from 'react';
import { WalletModel, Transaction, PaymentRequest } from '../models/WalletModel';
import { breezService } from '../services/breezService';
import { openAIService } from '../services/openAIService';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletModel>({
    isInitialized: false,
    onchainBalance: 0,
    lightningBalance: 0,
    isOnboarded: false,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeWallet = useCallback(async (mnemonic?: string) => {
    try {
      setLoading(true);
      const initialized = await breezService.initializeSDK(mnemonic);
      if (initialized) {
        const balances = await breezService.getBalances();
        setWallet(prev => ({
          ...prev,
          isInitialized: true,
          onchainBalance: balances.onchain,
          lightningBalance: balances.lightning,
          isOnboarded: true,
        }));
      }
    } catch (err) {
      setError('Failed to initialize wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  const createWallet = useCallback(async () => {
    try {
      setLoading(true);
      const mnemonic = await breezService.generateSeed();
      await initializeWallet(mnemonic);
      return mnemonic;
    } catch (err) {
      setError('Failed to create wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [initializeWallet]);

  const restoreWallet = useCallback(async (mnemonic: string) => {
    try {
      setLoading(true);
      await initializeWallet(mnemonic);
    } catch (err) {
      setError('Failed to restore wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [initializeWallet]);

  const sendPayment = useCallback(async (paymentRequest: PaymentRequest) => {
    try {
      setLoading(true);
      let txId: string;

      if (paymentRequest.bolt11) {
        txId = await breezService.payInvoice(paymentRequest.bolt11);
      } else if (paymentRequest.address) {
        txId = await breezService.sendOnChain(paymentRequest.address, paymentRequest.amount);
      } else {
        throw new Error('Invalid payment request');
      }

      const aiNarration = await openAIService.generateTransactionNarration({
        type: 'send',
        amount: paymentRequest.amount,
      });

      const transaction: Transaction = {
        id: txId,
        amount: paymentRequest.amount,
        type: 'send',
        timestamp: Date.now(),
        description: paymentRequest.description,
        aiNarration,
      };

      setTransactions(prev => [transaction, ...prev]);

      const balances = await breezService.getBalances();
      setWallet(prev => ({
        ...prev,
        onchainBalance: balances.onchain,
        lightningBalance: balances.lightning,
      }));

      return { transaction, aiNarration };
    } catch (err) {
      setError('Failed to send payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateInvoice = useCallback(async (amount: number, description?: string) => {
    try {
      setLoading(true);
      const invoice = await breezService.generateInvoice(amount, description);
      return invoice;
    } catch (err) {
      setError('Failed to generate invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBalances = useCallback(async () => {
    try {
      const balances = await breezService.getBalances();
      setWallet(prev => ({
        ...prev,
        onchainBalance: balances.onchain,
        lightningBalance: balances.lightning,
      }));
    } catch (err) {
      setError('Failed to refresh balances');
    }
  }, []);

  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  return {
    wallet,
    transactions,
    loading,
    error,
    sendPayment,
    generateInvoice,
    refreshBalances,
    createWallet,
    restoreWallet,
    clearError: () => setError(null),
  };
};












// import { useState, useEffect, useCallback } from 'react';
// import { WalletModel, Transaction, PaymentRequest } from '../models/WalletModel';
// import { breezService } from '../services/breezService';
// import { openAIService } from '../services/openAIService';

// export const useWallet = () => {
//   const [wallet, setWallet] = useState<WalletModel>({
//     isInitialized: false,
//     onchainBalance: 0,
//     lightningBalance: 0,
//     isOnboarded: false,
//   });
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const initializeWallet = useCallback(async () => {
//     try {
//       setLoading(true);
//       const initialized = await breezService.initializeSDK();
//       if (initialized) {
//         const balances = await breezService.getBalances();
//         setWallet(prev => ({
//           ...prev,
//           isInitialized: true,
//           onchainBalance: balances.onchain,
//           lightningBalance: balances.lightning,
//           isOnboarded: true,
//         }));
//       }
//     } catch (err) {
//       setError('Failed to initialize wallet');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const sendPayment = useCallback(async (paymentRequest: PaymentRequest) => {
//     try {
//       setLoading(true);
//       let txId: string;

//       if (paymentRequest.bolt11) {
//         txId = await breezService.payInvoice(paymentRequest.bolt11);
//       } else if (paymentRequest.address) {
//         txId = await breezService.sendOnChain(paymentRequest.address, paymentRequest.amount);
//       } else {
//         throw new Error('Invalid payment request');
//       }

//       const aiNarration = await openAIService.generateTransactionNarration({
//         type: 'send',
//         amount: paymentRequest.amount,
//       });

//       const transaction: Transaction = {
//         id: txId,
//         amount: paymentRequest.amount,
//         type: 'send',
//         timestamp: Date.now(),
//         description: paymentRequest.description,
//         aiNarration,
//       };

//       setTransactions(prev => [transaction, ...prev]);

//       const balances = await breezService.getBalances();
//       setWallet(prev => ({
//         ...prev,
//         onchainBalance: balances.onchain,
//         lightningBalance: balances.lightning,
//       }));

//       return { transaction, aiNarration };
//     } catch (err) {
//       setError('Failed to send payment');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const generateInvoice = useCallback(async (amount: number, description?: string) => {
//     try {
//       setLoading(true);
//       const invoice = await breezService.generateInvoice(amount, description);
//       return invoice;
//     } catch (err) {
//       setError('Failed to generate invoice');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const refreshBalances = useCallback(async () => {
//     try {
//       const balances = await breezService.getBalances();
//       setWallet(prev => ({
//         ...prev,
//         onchainBalance: balances.onchain,
//         lightningBalance: balances.lightning,
//       }));
//     } catch (err) {
//       setError('Failed to refresh balances');
//     }
//   }, []);

//   useEffect(() => {
//     initializeWallet();
//   }, [initializeWallet]);

//   return {
//     wallet,
//     transactions,
//     loading,
//     error,
//     sendPayment,
//     generateInvoice,
//     refreshBalances,
//     clearError: () => setError(null),
//   };
// };

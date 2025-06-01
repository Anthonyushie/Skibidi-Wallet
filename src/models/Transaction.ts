// src/models/Transactions.ts

export type TransactionType = 'lightning' | 'onchain'

export type TransactionStatus =
  | 'confirmed'
  | 'failed'
  | 'expired'

export interface BaseTransaction {
  id: string // unique identifier from Breez SDK
  type: TransactionType
  amountSats: number
  timestamp: number // UNIX epoch in milliseconds
  status: TransactionStatus
  memo?: string
  narration?: string // optional AI-generated message
}

export interface LightningTransaction extends BaseTransaction {
  type: 'lightning'
  invoice: string // original BOLT11 invoice
  paymentHash: string
  feeSats?: number
}

export interface OnchainTransaction extends BaseTransaction {
  type: 'onchain'
  address: string
  txid: string
  feeSats: number
  confirmations: number
}

export type WalletTransaction = LightningTransaction | OnchainTransaction

import { TransactionDirection, WalletType } from "@prisma/client";
export type WalletIdentity = { address: string; type: WalletType; isTracked: boolean };
const whale = (wallet?: WalletIdentity) => wallet?.type === WalletType.WHALE;
const exchange = (wallet?: WalletIdentity) => wallet?.type === WalletType.EXCHANGE;
export function classifyTransaction(source?: WalletIdentity, destination?: WalletIdentity): TransactionDirection { if (whale(source) && exchange(destination)) return TransactionDirection.WHALE_TO_EXCHANGE; if (exchange(source) && whale(destination)) return TransactionDirection.EXCHANGE_TO_WHALE; if (whale(source) && whale(destination)) return TransactionDirection.WHALE_TO_WHALE; if (exchange(source) && exchange(destination)) return TransactionDirection.EXCHANGE_TO_EXCHANGE; return TransactionDirection.UNKNOWN; }

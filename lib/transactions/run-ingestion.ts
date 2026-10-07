import { mempoolProvider } from "@/lib/blockchain/mempool-provider";
import { getBtcMarketData } from "@/lib/market/binance";
import { processTransactionSignal } from "@/lib/signals/process";
import { ingestTransaction } from "./ingest";
export async function runRecentIngestion() { const market = await getBtcMarketData(); if (!market) throw new Error("Market data unavailable; ingestion deferred"); const recent = await mempoolProvider.getLatestTransactions(); const results = await Promise.all(recent.map((raw) => ingestTransaction(raw, market.price))); const created = results.filter((result): result is NonNullable<typeof result> => Boolean(result && result.created)); for (const result of created) { try { await processTransactionSignal(result.transaction, market); } catch (error) { console.error("Signal processing error", error); } } return { provider: "mempool.space", scanned: recent.length, stored: results.filter(Boolean).length, alertsEvaluated: created.length }; }

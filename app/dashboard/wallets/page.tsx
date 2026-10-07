import { db } from "@/lib/database/client";
import { WalletManager } from "@/components/wallet-manager";
export const dynamic = "force-dynamic";
export default async function WalletsPage() { const wallets = await db.wallet.findMany({ orderBy: { updatedAt: "desc" }, include: { _count: { select: { sentTransactions: true, receivedTransactions: true } } } }); return <div className="space-y-5"><div><p className="text-xs font-bold tracking-[.2em] text-cyan-400">VERIFIED LABELS ONLY</p><h1 className="mt-2 text-3xl font-bold">Wallet Watchlist</h1></div><WalletManager initialWallets={JSON.parse(JSON.stringify(wallets))} /></div>; }

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/database/client";
export const runtime = "nodejs";
export const walletSchema = z.object({ address: z.string().trim().min(14).max(90), label: z.string().trim().max(80).optional().transform((value) => value || null), type: z.enum(["UNKNOWN", "WHALE", "EXCHANGE", "CUSTODY", "INSTITUTION", "MINER", "OTHER"]), isTracked: z.boolean().default(true) });
export async function GET() { return NextResponse.json(await db.wallet.findMany({ orderBy: { updatedAt: "desc" }, include: { _count: { select: { sentTransactions: true, receivedTransactions: true } } } })); }
export async function POST(request: Request) { try { const input = walletSchema.parse(await request.json()); const wallet = await db.wallet.create({ data: input }); return NextResponse.json(wallet, { status: 201 }); } catch (error) { const message = error instanceof z.ZodError ? error.issues : "Unable to create wallet. The address may already be on the watchlist."; return NextResponse.json({ error: message }, { status: 400 }); } }

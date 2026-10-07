import { NextResponse } from "next/server";
import { getBtcMarketData } from "@/lib/market/binance";
export async function GET() { const data = await getBtcMarketData(); return NextResponse.json({ status: data ? "LIVE" : "UNAVAILABLE", data }); }

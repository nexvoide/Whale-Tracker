import { NextResponse } from "next/server";
import { runRecentIngestion } from "@/lib/transactions/run-ingestion";
export async function POST() { try { return NextResponse.json(await runRecentIngestion()); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Ingestion failed" }, { status: 503 }); } }

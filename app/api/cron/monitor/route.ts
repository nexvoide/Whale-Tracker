import { NextResponse } from "next/server";
import { runtimeConfig } from "@/lib/config";
import { runRecentIngestion } from "@/lib/transactions/run-ingestion";
export const runtime = "nodejs";
export async function GET(request: Request) { if (!runtimeConfig.cronSecret || request.headers.get("authorization") !== `Bearer ${runtimeConfig.cronSecret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { return NextResponse.json(await runRecentIngestion()); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Monitoring run failed" }, { status: 503 }); } }

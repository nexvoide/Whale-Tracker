import { NextResponse } from "next/server";
import { runtimeConfig } from "@/lib/config";
import { runDiscovery } from "@/lib/discovery/service";
export const runtime = "nodejs";
export async function POST() { try { return NextResponse.json(await runDiscovery(runtimeConfig.discoveryLimit)); } catch (error) { const message = error instanceof Error ? error.message : "Discovery failed"; console.error("Discovery error", error); return NextResponse.json({ error: message }, { status: 503 }); } }

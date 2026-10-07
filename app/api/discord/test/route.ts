import { NextResponse } from "next/server";
import { sendDiscordTestMessage } from "@/lib/alerts/discord";
export async function POST() { const sent = await sendDiscordTestMessage(); return NextResponse.json({ sent, message: sent ? "Discord test alert sent" : "Discord is not configured or unavailable" }, { status: sent ? 200 : 503 }); }

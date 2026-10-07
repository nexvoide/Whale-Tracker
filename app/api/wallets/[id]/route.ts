import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/database/client";
import { walletSchema } from "../route";

const paramsSchema = z.object({ id: z.string().cuid() });
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) { try { const { id } = paramsSchema.parse(await context.params); const input = walletSchema.parse(await request.json()); return NextResponse.json(await db.wallet.update({ where: { id }, data: input })); } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? error.issues : "Unable to update wallet" }, { status: 400 }); } }
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) { try { const { id } = paramsSchema.parse(await context.params); await db.wallet.delete({ where: { id } }); return new NextResponse(null, { status: 204 }); } catch { return NextResponse.json({ error: "Unable to delete wallet" }, { status: 400 }); } }

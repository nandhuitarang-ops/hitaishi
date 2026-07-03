import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { messages } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ conversationId: string; messageId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { messageId } = await params;
    
    // Verify ownership
    const [msg] = await db.select().from(messages).where(eq(messages.id, messageId)).limit(1);
    if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (msg.senderId !== user.id) return NextResponse.json({ error: "Cannot delete others' messages" }, { status: 403 });
    
    await db.delete(messages).where(eq(messages.id, messageId));
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest } from "next/server";
import { store } from "@/lib/store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const idx = store.memberships.findIndex((m) => m.id === id);
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  store.memberships[idx] = { ...store.memberships[idx], ...body, id };
  return Response.json(store.memberships[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = store.memberships.findIndex((m) => m.id === id);
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  store.memberships.splice(idx, 1);
  return Response.json({ success: true });
}

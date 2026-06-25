import { store } from "@/lib/store";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const idx = store.services.findIndex((s) => s.id === id);
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  store.services[idx] = { ...store.services[idx], ...body, id };
  return Response.json(store.services[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = store.services.findIndex((s) => s.id === id);
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  store.services.splice(idx, 1);
  return Response.json({ success: true });
}

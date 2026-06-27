import { NextRequest } from "next/server";
import { store } from "@/lib/store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const idx = store.gallery.findIndex((g) => g.id === id);
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  store.gallery[idx] = { ...store.gallery[idx], ...body, id };
  return Response.json(store.gallery[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = store.gallery.findIndex((g) => g.id === id);
  if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
  store.gallery.splice(idx, 1);
  return Response.json({ success: true });
}

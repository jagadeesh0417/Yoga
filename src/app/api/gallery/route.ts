import { NextRequest } from "next/server";
import { store, type StoredGalleryItem } from "@/lib/store";

export async function GET() {
  return Response.json([...store.gallery].reverse());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item: StoredGalleryItem = {
      id: String(store.galleryNextId++),
      title: body.title || "",
      category: body.category || "Yoga Classes",
      image: body.image || "",
      featured: body.featured || false,
      order: body.order || 0,
    };
    store.gallery.push(item);
    return Response.json(item, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to add gallery image" }, { status: 500 });
  }
}

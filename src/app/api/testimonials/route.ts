import { NextRequest } from "next/server";
import { store, type StoredTestimonial } from "@/lib/store";

export async function GET() {
  return Response.json([...store.testimonials].reverse());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item: StoredTestimonial = {
      id: String(store.testimonialsNextId++),
      name: body.name || "",
      location: body.location || "",
      rating: body.rating || 5,
      text: body.text || "",
      image: body.image || "",
      featured: body.featured || false,
      createdAt: new Date().toISOString(),
    };
    store.testimonials.push(item);
    return Response.json(item, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

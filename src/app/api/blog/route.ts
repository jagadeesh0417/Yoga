import { NextRequest } from "next/server";
import { store, type StoredBlog } from "@/lib/store";

export async function GET() {
  return Response.json([...store.blogs].reverse());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blog: StoredBlog = {
      id: String(store.blogsNextId++),
      title: body.title || "",
      slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `post-${store.blogsNextId}`,
      excerpt: body.excerpt || "",
      content: body.content || "",
      image: body.image || "",
      tags: body.tags || [],
      published: body.published || false,
      featured: body.featured || false,
      readTime: body.readTime || "",
      createdAt: new Date().toISOString(),
    };
    store.blogs.push(blog);
    return Response.json(blog, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

import { store, type StoredService } from "@/lib/store";

export async function GET() {
  return Response.json(store.services.filter((s) => s.published !== false));
}

export async function POST(req: Request) {
  const body = await req.json();
  const service: StoredService = {
    id: String(store.servicesNextId++),
    slug: body.title?.toLowerCase().replace(/\s+/g, "-") || `s-${store.servicesNextId}`,
    published: true,
    ...body,
  };
  store.services.push(service);
  return Response.json(service, { status: 201 });
}

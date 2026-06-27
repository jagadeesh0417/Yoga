import { NextRequest } from "next/server";
import { store, type StoredMembership } from "@/lib/store";

export async function GET() {
  return Response.json([...store.memberships].reverse());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item: StoredMembership = {
      id: String(store.membershipsNextId++),
      name: body.name || "",
      price: body.price || 0,
      interval: body.interval || "month",
      features: body.features || [],
      popular: body.popular || false,
      published: body.published !== undefined ? body.published : true,
      stripePriceId: body.stripePriceId || "",
    };
    store.memberships.push(item);
    return Response.json(item, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create membership plan" }, { status: 500 });
  }
}

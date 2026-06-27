import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const status = searchParams.get("status") || "";

    let orders = (store as any).orders || [];

    if (status) {
      orders = orders.filter((o: any) => o.orderStatus === status);
    }

    if (query) {
      orders = orders.filter((o: any) =>
        o.orderId.toLowerCase().includes(query) ||
        o.customer?.name?.toLowerCase().includes(query) ||
        o.customer?.email?.toLowerCase().includes(query) ||
        o.customer?.phone?.toLowerCase().includes(query)
      );
    }

    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ orders, total: orders.length });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

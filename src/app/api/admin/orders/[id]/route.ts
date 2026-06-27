import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus } = body;

    const orders = (store as any).orders || [];
    const order = orders.find((o: any) => o.id === id || o.orderId === id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    order.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orders = (store as any).orders || [];
    const order = orders.find((o: any) => o.id === id || o.orderId === id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

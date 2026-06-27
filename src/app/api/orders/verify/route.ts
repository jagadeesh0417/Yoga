import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const orders = (store as any).orders || [];
    const order = orders.find((o: any) => o.razorpayOrderId === razorpay_order_id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature || "";
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.updatedAt = new Date().toISOString();

    if (!Array.isArray((store as any).payments)) {
      (store as any).payments = [];
    }
    (store as any).payments.push({
      id: "pay_" + Date.now(),
      orderId: order.orderId,
      paymentId: razorpay_payment_id,
      amount: order.total,
      currency: order.currency,
      status: "paid",
      customer: order.customer,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

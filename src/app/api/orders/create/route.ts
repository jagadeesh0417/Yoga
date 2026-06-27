import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productName, productImage, price, quantity, currency, customer } = body;

    if (!productId || !customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const total = price * quantity;

    const order = {
      id: orderId,
      orderId,
      items: [{ productId, name: productName || "Product", price, quantity, image: productImage || "" }],
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        country: customer.country || "",
        state: customer.state || "",
        city: customer.city || "",
        address: customer.address || "",
        pincode: customer.pincode || "",
      },
      subtotal: total,
      discount: 0,
      shipping: 0,
      total,
      currency: currency || "HKD",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      razorpayOrderId: "order_" + Date.now(),
      razorpayPaymentId: null,
      razorpaySignature: null,
      orderStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!Array.isArray((store as any).orders)) {
      (store as any).orders = [];
    }
    (store as any).orders.push(order);

    return NextResponse.json({
      success: true,
      order,
      razorpay_order_id: order.razorpayOrderId,
      amount: total * 100,
      currency: "INR",
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

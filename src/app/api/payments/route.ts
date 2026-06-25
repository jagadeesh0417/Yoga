import { NextRequest } from "next/server";
import { store, type StoredPayment } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    let name: string, email: string, phone: string, plan: string, paymentMethod: string, reference: string, message: string;

    const ct = req.headers.get("content-type") || "";
    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      name = fd.get("name") as string;
      email = fd.get("email") as string;
      phone = (fd.get("phone") as string) || "";
      plan = fd.get("plan") as string;
      paymentMethod = fd.get("paymentMethod") as string;
      reference = fd.get("reference") as string;
      message = (fd.get("message") as string) || "";
    } else {
      const body = await req.json();
      name = body.name;
      email = body.email;
      phone = body.phone || "";
      plan = body.plan;
      paymentMethod = body.paymentMethod;
      reference = body.reference;
      message = body.message || "";
    }

    if (!name || !email || !plan || !paymentMethod || !reference) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (store.payments.some((p) => p.reference === reference)) {
      return Response.json({ error: "Duplicate submission" }, { status: 409 });
    }

    const submission: StoredPayment = {
      id: String(store.paymentsNextId++),
      name,
      email,
      phone: phone || null,
      plan,
      paymentMethod,
      reference,
      message: message || null,
      screenshot: null,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    store.payments.push(submission);

    return Response.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("Payment submission error:", error);
    return Response.json({ error: "Failed to process payment submission" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let result = [...store.payments];

    if (status && status !== "ALL") {
      result = result.filter((p) => p.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q)
      );
    }

    return Response.json({ payments: result.reverse() });
  } catch (error) {
    console.error("Payment fetch error:", error);
    return Response.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const idx = store.payments.findIndex((p) => p.id === id);
    if (idx === -1) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    store.payments[idx].status = status;
    return Response.json({ success: true, submission: store.payments[idx] });
  } catch (error) {
    console.error("Payment update error:", error);
    return Response.json({ error: "Failed to update payment status" }, { status: 500 });
  }
}

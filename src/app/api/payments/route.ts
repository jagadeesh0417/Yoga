import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    let name: string, email: string, phone: string, plan: string, paymentMethod: string, reference: string, message: string;
    let screenshot: string | null = null;

    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      name = fd.get("name") as string;
      email = fd.get("email") as string;
      phone = (fd.get("phone") as string) || "";
      plan = fd.get("plan") as string;
      paymentMethod = fd.get("paymentMethod") as string;
      reference = fd.get("reference") as string;
      message = (fd.get("message") as string) || "";
      const file = fd.get("screenshot") as File | null;
      if (file && file.size > 0) {
        const ext = file.name.split(".").pop() || "png";
        const filename = `pay-${reference}.${ext}`;
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(join(uploadDir, filename), buffer);
        screenshot = `/uploads/${filename}`;
      }
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
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.paymentSubmission.findUnique({
      where: { reference },
    });

    if (existing) {
      return Response.json(
        { error: "Duplicate submission" },
        { status: 409 }
      );
    }

    const submission = await prisma.paymentSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        plan,
        paymentMethod,
        reference,
        message: message || null,
        screenshot,
        status: "PENDING",
      },
    });

    return Response.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("Payment submission error:", error);
    return Response.json(
      { error: "Failed to process payment submission" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
      ];
    }

    const payments = await prisma.paymentSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ payments });
  } catch (error) {
    console.error("Payment fetch error:", error);
    return Response.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const submission = await prisma.paymentSubmission.update({
      where: { id },
      data: { status },
    });

    return Response.json({ success: true, submission });
  } catch (error) {
    console.error("Payment update error:", error);
    return Response.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}

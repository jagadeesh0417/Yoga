import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || "";
    const message = (formData.get("message") as string) || "";
    const paymentMethod = formData.get("paymentMethod") as string;
    const reference = formData.get("reference") as string;
    const screenshot = formData.get("screenshot") as File | null;

    if (!name || !email || !paymentMethod || !reference) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    let screenshotPath: string | null = null;

    if (screenshot && screenshot.size > 0) {
      const ext = screenshot.name.split(".").pop() || "png";
      const filename = `enquiry-${reference}.${ext}`;
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await screenshot.arrayBuffer());
      await writeFile(join(uploadDir, filename), buffer);
      screenshotPath = `/uploads/${filename}`;
    }

    await prisma.enquirySubmission.create({
      data: { name, email, phone, message, paymentMethod, reference, screenshot: screenshotPath },
    });

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const submissions = await prisma.enquirySubmission.findMany({ orderBy: { createdAt: "desc" } });
    return Response.json(submissions);
  } catch {
    return Response.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return Response.json({ error: "Missing id or status" }, { status: 400 });
    }
    const updated = await prisma.enquirySubmission.update({
      where: { id },
      data: { status },
    });
    return Response.json(updated);
  } catch {
    return Response.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

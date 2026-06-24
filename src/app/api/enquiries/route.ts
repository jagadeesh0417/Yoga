import { NextRequest , NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    const enquiry = await prisma.enquiry.create({
      data: { name, email, phone: phone || null, message: message || null },
    });
    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(enquiries);
  } catch {
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

import { NextRequest , NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log("Received:", body)

    const enquiry = await prisma.enquiry.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message || null,
      },
    })

    console.log("Saved:", enquiry)

    return NextResponse.json({
      success: true,
      enquiry,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    )
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

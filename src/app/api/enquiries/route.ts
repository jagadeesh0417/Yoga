import { NextRequest, NextResponse } from "next/server";
import { store, type StoredEnquiry } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const enquiry: StoredEnquiry = {
      id: String(store.enquiriesNextId++),
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      message: body.message || null,
      createdAt: new Date().toISOString(),
    };
    store.enquiries.push(enquiry);
    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json([...store.enquiries].reverse());
}

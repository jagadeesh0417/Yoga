import { NextRequest } from "next/server";
import { store, type StoredContact } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();
    if (!name || !email || !message) {
      return Response.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const contact: StoredContact = {
      id: String(store.contactsNextId++),
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      createdAt: new Date().toISOString(),
    };
    store.contacts.push(contact);

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json([...store.contacts].reverse());
}

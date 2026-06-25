import { NextRequest } from "next/server";
import { store, type StoredBooking } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, name, email, phone, country, notes, date, time } = body;

    if (!serviceId || !name || !email || !phone || !country || !date || !time) {
      return Response.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    const service = store.services.find((s) => s.id === serviceId);
    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    const booking: StoredBooking = {
      id: String(store.bookingsNextId++),
      serviceId,
      name,
      email,
      phone,
      country,
      notes: notes || null,
      date,
      time,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    store.bookings.push(booking);

    return Response.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

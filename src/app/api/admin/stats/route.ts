import { store } from "@/lib/store";

export async function GET() {
  return Response.json({
    totalUsers: 0,
    totalBookings: store.bookings.length,
    totalCourses: store.services.length,
    totalRevenue: 0,
    recentBookings: [...store.bookings].reverse().slice(0, 5),
    recentMessages: [...store.contacts].reverse().slice(0, 5),
  });
}

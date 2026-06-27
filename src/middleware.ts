import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const expiresAt = parseInt(sessionCookie.value, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

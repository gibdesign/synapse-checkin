import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeRole(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("synapse_auth")?.value;
  const role = decodeRole(token);
  const pathname = request.nextUrl.pathname;

  // Protect /dashboard (requires USER role)
  if (pathname.startsWith("/dashboard") && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect /cs (requires CS or ADMIN role)
  if (pathname.startsWith("/cs") && !(role === "CS" || role === "ADMIN")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect /admin (requires ADMIN role)
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/cs/:path*", "/admin/:path*"],
};

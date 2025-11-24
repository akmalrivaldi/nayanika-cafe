import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Cek apakah user sedang mencoba akses halaman admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 2. Cek apakah user punya cookie "admin_session"
    const isAdmin = request.cookies.get("admin_session");

    // 3. Jika TIDAK punya cookie, tendang ke halaman login
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang dijaga middleware ini
export const config = {
  matcher: ["/admin/:path*"], // Semua route di bawah /admin dilindungi
};

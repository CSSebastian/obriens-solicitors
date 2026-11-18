import { NextResponse, type NextRequest } from "next/server";

/**
 * Password-protects /admin (the saved enquiries). Uses the browser's built-in
 * sign-in box: any username, password = ENQUIRIES_ADMIN_PASSWORD. Without that
 * variable the admin area is switched off entirely.
 */
export function proxy(request: NextRequest) {
  const password = process.env.ENQUIRIES_ADMIN_PASSWORD;
  if (!password) return new NextResponse("Not found", { status: 404 });

  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    const supplied = decoded.slice(decoded.indexOf(":") + 1);
    if (timingSafeEqual(supplied, password)) {
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
  }

  return new NextResponse("Sign in required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="O\'Briens enquiries", charset="UTF-8"' },
  });
}

/** Constant-time string comparison (no early exit on the first mismatch). */
function timingSafeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export const config = { matcher: ["/admin/:path*"] };

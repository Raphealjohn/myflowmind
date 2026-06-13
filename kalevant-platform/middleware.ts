import { NextResponse, type NextRequest } from "next/server";
import { RETURN_VISIT_COOKIE, UTM_COOKIE, utmFromSearchParams } from "@/lib/utm";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 90, // 90 days
};

/**
 * First-party attribution: persist incoming utm_* params and mark return
 * visits so the scoring layer can credit them on form submit.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const utm = utmFromSearchParams(request.nextUrl.searchParams);
  if (Object.keys(utm).length > 0) {
    response.cookies.set(UTM_COOKIE, encodeURIComponent(JSON.stringify(utm)), COOKIE_OPTS);
  }

  if (request.cookies.has(RETURN_VISIT_COOKIE)) {
    // Promote to a long-lived "returning" marker readable by the API layer.
    response.cookies.set(RETURN_VISIT_COOKIE, "returning", COOKIE_OPTS);
  } else {
    response.cookies.set(RETURN_VISIT_COOKIE, "new", COOKIE_OPTS);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};

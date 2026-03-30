import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_ACTIVATION_COOKIE_KEY,
  isValidAccessCode,
  normalizeAccessCode,
} from "@/lib/access-codes";

const protectedPrefixes = ["/project/new", "/workspace", "/api/projects"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const rawCode = request.cookies.get(ACCESS_ACTIVATION_COOKIE_KEY)?.value;

  if (rawCode && isValidAccessCode(normalizeAccessCode(rawCode))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ success: false, error: "请先输入访问码。" }, { status: 401 });
  }

  const homeUrl = new URL("/", request.url);
  homeUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(homeUrl);
}

export const config = {
  matcher: ["/project/new", "/project/new/:path*", "/workspace/:path*", "/api/projects", "/api/projects/:path*"],
};

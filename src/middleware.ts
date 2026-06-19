import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

function createMatcher(pattern: string) {
  const regex = new RegExp(`^${pattern}$`);
  return (pathname: string) => regex.test(pathname);
}

const matchers = Object.entries(routeAccessMap).map(([route, roles]) => ({
  matcher: createMatcher(route),
  allowedRoles: roles,
}));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("__session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  let role: string;
  try {
    const { payload } = await jwtVerify(token, secret);
    role = payload.role as string;
  } catch {
    const res = NextResponse.redirect(new URL("/sign-in", req.url));
    res.cookies.delete("__session");
    return res;
  }

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(pathname) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

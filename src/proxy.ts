import { jwtVerify } from "jose";
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

function getCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const entry = cookieHeader
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return entry?.split("=").slice(1).join("=");
}

export async function proxy(request: Request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/api/auth")) {
    return;
  }

  const token = getCookie(request, "__session");

  if (!token) {
    return Response.redirect(new URL("/sign-in", request.url));
  }

  let role: string;
  try {
    const { payload } = await jwtVerify(token, secret);
    role = payload.role as string;
  } catch {
    const response = Response.redirect(new URL("/sign-in", request.url));
    response.headers.set(
      "Set-Cookie",
      "__session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
    );
    return response;
  }

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(pathname) && !allowedRoles.includes(role)) {
      return Response.redirect(new URL(`/${role}`, request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

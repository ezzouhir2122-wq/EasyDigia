import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createSupabaseMiddleware } from "./lib/supabase-server";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "ezzouhir2122@gmail.com";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes (any locale): /fr/admin/... /en/admin/... /ar/admin/...
  const adminMatch = pathname.match(/^\/(fr|en|ar)\/admin(\/.*)?$/);
  const isLoginPage = /^\/(fr|en|ar)\/admin\/login/.test(pathname);

  if (adminMatch && !isLoginPage) {
    const locale = adminMatch[1];
    const response = NextResponse.next({ request });
    const supabase = createSupabaseMiddleware(request, response);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(fr|en|ar)/:path*"],
};

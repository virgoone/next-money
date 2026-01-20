import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { get } from "@vercel/edge-config";
import createMiddleware from "next-intl/middleware";

import { kvKeys } from "@/config/kv";
import { env } from "@/env.mjs";
import countries from "@/lib/countries.json";
import { getIP } from "@/lib/ip";
import { redis } from "@/lib/redis";

import { routing } from "./i18n/routing";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

const isProtectedRoute = createRouteMatcher([
  "/:locale/app(.*)",
  "/:locale/admin(.*)",
]);

const handleI18nRouting = createMiddleware(routing);

export default clerkMiddleware(async (auth, req) => {
  const { nextUrl, geo } = req as any;
  const isApi = nextUrl.pathname.startsWith("/api/");
  
  // 调试日志：确认 middleware 被调用
  console.log("clerkMiddleware running for:", nextUrl.pathname);

  // 对于受保护的路由，强制要求认证
  if (isProtectedRoute(req)) {
    await (auth as any).protect();
  }

  // IP 封禁检查
  if (process.env.EDGE_CONFIG && env.VERCEL_ENV !== "development") {
    const blockedIPs = await get<string[]>("blocked_ips");
    const ip = getIP(req);
    console.log("ip-->", ip);

    if (blockedIPs?.includes(ip)) {
      if (isApi) {
        return NextResponse.json(
          { error: "You have been blocked." },
          { status: 403 },
        );
      }

      nextUrl.pathname = "/blocked";
      return NextResponse.rewrite(nextUrl);
    }

    if (nextUrl.pathname === "/blocked") {
      nextUrl.pathname = "/";
      return NextResponse.redirect(nextUrl);
    }
  }

  // 地理位置记录（仅非 API 路由）
  if (geo && !isApi && env.VERCEL_ENV !== "development") {
    console.log("geo-->", geo);
    const country = geo.country;
    const city = geo.city;

    const countryInfo = countries.find((x) => x.cca2 === country);
    if (countryInfo) {
      const flag = countryInfo.flag;
      await redis.set(kvKeys.currentVisitor, { country, city, flag });
    }
  }

  // 非 API 路由：应用国际化中间件
  // API 路由不需要国际化处理，直接让 clerkMiddleware 处理
  if (!isApi) {
    return handleI18nRouting(req);
  }

});

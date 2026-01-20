import { type NextRequest } from "next/server";

export function getIP(request: Request | NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");
  if ("ip" in request && (request as any).ip) {
    return (request as any).ip as string;
  }

  if (xff === "::1") {
    return "127.0.0.1";
  }

  if (xff) return xff.split(",")[0]?.trim() ?? "127.0.0.1";

  return xRealIp?.trim() ?? "127.0.0.1";
}

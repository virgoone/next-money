import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_SITE_URL;

export const siteConfig: SiteConfig = {
  name: "SaaS Starter",
  description:
    "Get your project off to an explosive start with SaaS Starter! Harness the power of Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    twitter: "https://x.com/koyaguo",
    github: "https://github.com/virgoone",
  },
  mailSupport: "support@fluxaipro.art",
};

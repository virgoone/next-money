import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Index",
      items: [
        {
          title: "Index",
          href: "/app",
          icon: "post",
        },
        {
          title: "Generate",
          href: "/app/generate",
        },
        {
          title: "Gift Code",
          href: "/app/giftcode",
          icon: "Gift",
        },
        {
          title: "History",
          href: "/app/history",
          icon: "Eraser",
        },
        {
          title: "Billing",
          href: "/app/billing",
          icon: "billing",
        },
      ],
    },
  ],
};

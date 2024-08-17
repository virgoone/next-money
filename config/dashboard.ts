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
      title: "App",
      items: [
        {
          title: "Index",
          href: "/app",
          icon: "HomeIcon",
        },
        {
          title: "Generate",
          href: "/app/generate",
          icon: "Eraser"
        },
        {
          title: "History",
          href: "/app/history",
          icon: "History",
        },
        {
          title: "Gift Code",
          href: "/app/giftcode",
          icon: "Gift",
        },
        {
          title: "Charge Order",
          href: "/app/order",
          icon: "billing",
        },
      ],
    },
  ],
};

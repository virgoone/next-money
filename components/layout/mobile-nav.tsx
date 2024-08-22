"use client";

import { useEffect, useState } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import { Menu, X } from "lucide-react";

import { Icons } from "@/components/shared/icons";
import { dashboardConfig } from "@/config/dashboard";
import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { UserInfo } from "../user-info";
import { ModeToggle } from "./mode-toggle";

export function NavMobile() {
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();
  const dashBoard = selectedLayout === "dashboard";
  const documentation = selectedLayout === "docs";
  const links = documentation
    ? docsConfig.mainNav
    : dashBoard
      ? dashboardConfig.mainNav
      : marketingConfig.mainNav;

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-2 top-2.5 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          open && "hover:bg-muted active:bg-muted",
        )}
      >
        {open ? (
          <X className="size-5 text-muted-foreground" />
        ) : (
          <Menu className="size-5 text-muted-foreground" />
        )}
      </button>

      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full overflow-auto bg-background px-5 py-16 lg:hidden",
          open && "block",
        )}
      >
        <ul className="grid divide-y divide-muted">
          {links.map(({ title, href }) => (
            <li key={href} className="py-3">
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="flex w-full font-medium capitalize"
              >
                {title}
              </Link>
            </li>
          ))}

          <UserInfo />
        </ul>

        <div className="mt-5 flex items-center justify-end space-x-4">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Icons.gitHub className="size-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <ModeToggle />
        </div>
      </nav>
    </>
  );
}

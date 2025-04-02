"use client";
import React from "react";
import LogoutButton from "./components/logout-button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const adminLinks = [
    {
      label: "Shuttle Bookings",
      href: "/admin/shuttle-bookings",
    },
    {
      label: "Travel Packages",
      href: "/admin/packages-setting",
    },
    {
      label: "MICE Settings",
      href: "/admin/mice-settings",
    },
    {
      label: "FAQ Settings",
      href: "/admin/faq-settings",
    },
    {
      label: "Reviews",
      href: "/admin/reviews-settings",
    },
    {
      label: "Newsletters",
      href: "/admin/newsletters",
    },
    {
      label: "Inquiries",
      href: "/admin/inquiries",
    },
    {
      label: "Settings",
      href: "/admin/settings",
    },
  ];
  return (
    <div className="max-w-screen-2xl mx-auto">
      <nav className="py-6 flex gap-4 font-medium overflow-x-scroll">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              pathname.includes(link.href) && "text-highlight-blue"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <main className="min-h-[min(60rem,80vh)]">{children}</main>
      <LogoutButton />
    </div>
  );
};

export default AdminLayout;

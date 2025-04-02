"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import React from "react";

const AdminNav = () => {
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
      label: "MICE Setting",
      href: "/admin/mice-setting",
    },
    {
      label: "FAQ Settings",
      href: "/admin/faq-setting",
    },
    {
      label: "Reviews",
      href: "/admin/reviews-setting",
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

  if (!pathname.includes("/admin") || pathname.includes("/login")) return null;
  return (
    <nav className="py-6 flex gap-4 font-medium overflow-x-scroll">
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(pathname.includes(link.href) && "text-highlight-blue")}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default AdminNav;

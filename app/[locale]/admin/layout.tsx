import React from "react";
import LogoutButton from "./components/logout-button";
import AdminNav from "./components/admi-nav";
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    return redirect({
      href: "/login",
      locale: "en",
    });
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <AdminNav />
      <main className="min-h-[min(60rem,80vh)]">{children}</main>
      <LogoutButton />
    </div>
  );
};

export default AdminLayout;

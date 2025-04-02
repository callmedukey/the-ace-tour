import React from "react";
import LogoutButton from "./components/logout-button";
import AdminNav from "./components/admi-nav";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <AdminNav />
      <main className="min-h-[min(60rem,80vh)]">{children}</main>
      <LogoutButton />
    </div>
  );
};

export default AdminLayout;

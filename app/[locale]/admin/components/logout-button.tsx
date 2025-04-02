"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "@/i18n/navigation";

const LogoutButton = () => {
  const pathname = usePathname();

  if (pathname.includes("login")) {
    return null;
  }

  return (
    <div className="flex justify-center mb-12">
      <Button
        variant="outline"
        className="w-24 mx-auto inline-block"
        onClick={() =>
          signOut({
            redirectTo: "/en/admin/login",
          })
        }
      >
        Log out
      </Button>
    </div>
  );
};

export default LogoutButton;

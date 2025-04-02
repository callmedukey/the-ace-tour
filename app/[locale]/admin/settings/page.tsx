import React from "react";
import { PasswordResetForm } from "./components/password-reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Update admin settings",
};

const SettingsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <PasswordResetForm />
      </div>
    </div>
  );
};

export default SettingsPage;

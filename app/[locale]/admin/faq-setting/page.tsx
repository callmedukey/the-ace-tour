export const dynamic = "force-dynamic";

import { getDB } from "@/db";
import React from "react";
import { FaqForm } from "./components/faq-form";
import { FaqList } from "./components/faq-list";

const FaqSettingPage = async () => {
  const db = await getDB();
  const faqs = await db.query.faqs.findMany({
    orderBy: (faqs, { asc }) => [asc(faqs.id)],
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">FAQ Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your frequently asked questions. Changes will be reflected on the
        support page.
      </p>

      <div className="border rounded-lg p-6 mb-12 bg-white shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Create New FAQ</h2>
        <FaqForm isNew={true} />
      </div>

      <FaqList faqs={faqs} />
    </div>
  );
};

export default FaqSettingPage;

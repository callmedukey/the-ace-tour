import { getDB } from "@/db";
import React from "react";
import { PackageCard } from "./components/package-card";

export const dynamic = "force-dynamic";

const PackagesSettingPage = async () => {
  const db = await getDB();
  const packages = await db.query.packages.findMany({
    with: {
      images: true,
    },
    orderBy: (packages, { desc }) => [desc(packages.id)],
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Travel Packages Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your travel packages information and images. Changes will be
        reflected on the travel packages page.
      </p>

      <div className="space-y-8">
        {packages.map((packageItem) => (
          <PackageCard key={packageItem.id} packageData={packageItem} />
        ))}
      </div>
    </div>
  );
};

export default PackagesSettingPage;

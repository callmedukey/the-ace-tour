import { setRequestLocale } from "next-intl/server";
import React from "react";
import { SupportHero } from "./components/support-hero";
const SupportPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  setRequestLocale((await params).locale);

  return (
    <main className="bg-[#E5EFF7]">
      <SupportHero />
    </main>
  );
};

export default SupportPage;

import React from "react";
import { ShuttleHero } from "./components/shuttle-hero";
import { setRequestLocale } from "next-intl/server";
import { ShuttleCards } from "./components/shuttle-cards";
const ShuttleServicePage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="max-w-screen-2xl mx-auto px-4">
      <ShuttleHero />
      <ShuttleCards />
    </main>
  );
};

export default ShuttleServicePage;

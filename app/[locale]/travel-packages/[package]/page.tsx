import React from "react";
import { TravelPackages } from "./components/TravelPackages";
import { setRequestLocale } from "next-intl/server";

export const generateStaticParams = async () => {
  return [
    { package: "la-departure" },
    { package: "las-vegas-departure" },
    { package: "semi-package" },
  ];
};

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <TravelPackages />
    </main>
  );
};

export default page;

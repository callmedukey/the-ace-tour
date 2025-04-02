import React from "react";
import { TravelPackages } from "./components/travel-packages";
import { setRequestLocale } from "next-intl/server";

export const generateStaticParams = async () => {
  return [
    { package: "la-departure" },
    { package: "las-vegas-departure" },
    { package: "semi-package" },
  ];
};

export const revalidate = 604800;

const page = async ({
  params,
}: {
  params: Promise<{
    locale: string;
    package: string;
  }>;
}) => {
  const { locale, package: packageType } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <TravelPackages
        packageType={
          packageType as "la-departure" | "las-vegas-departure" | "semi-package"
        }
      />
    </main>
  );
};

export default page;

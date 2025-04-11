import React from "react";
import { ShuttleHero } from "./components/shuttle-hero";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShuttleCards } from "./components/shuttle-cards";
import { Metadata, Viewport } from "next";

export const revalidate = 604800; // 1 week

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.ShuttleService" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theace.ai';

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/shuttle-service`,
      images: [
        {
          url: `${baseUrl}/shuttle-service/shuttle-card-patternbg.png`,
          width: 1200,
          height: 630,
          alt: t("imageAlt"),
        },
      ],
    },
    twitter: {
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/shuttle-service/shuttle-card-patternbg.png`],
    },
  };
}
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

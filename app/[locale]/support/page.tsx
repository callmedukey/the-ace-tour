import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";
import { SupportHero } from "./components/support-hero";
import { SupportFAQ } from "./components/support-faqs";
import { Metadata, Viewport } from "next";

export const revalidate = 604800;

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
  const t = await getTranslations({ locale, namespace: "Metadata.Support" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theace.ai';

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/support`,
      images: [
        {
          url: `${baseUrl}/support/support-pattern.png`,
          width: 1200,
          height: 630,
          alt: t("imageAlt"),
        },
      ],
    },
    twitter: {
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/support/support-pattern.png`],
    },
  };
}

const SupportPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  setRequestLocale((await params).locale);

  return (
    <main className="bg-[#E5EFF7]">
      <SupportHero />
      <SupportFAQ />
    </main>
  );
};

export default SupportPage;

import { redirect } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "Metadata.TravelPackages" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theace.ai';

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/travel-packages`,
      images: [
        {
          url: `${baseUrl}/travel-packages/travels-package-bg.png`,
          width: 1200,
          height: 630,
          alt: t("imageAlt"),
        },
      ],
    },
    twitter: {
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/travel-packages/travels-package-bg.png`],
    },
  };
}

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({
    href: "/travel-packages/la-departure",
    locale: locale,
  });
  return null;
};

export default page;

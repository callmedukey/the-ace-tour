import { MiceHero } from "./components/mice-hero";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata, Viewport } from "next";
import MiceStandOut from "./components/mice-stand-out";
import MiceServices from "./components/mice-services";
import MiceConsulting from "./components/mice-consulting";
import MiceShowcase from "./components/mice-showcase";

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
  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: "Metadata.MiceSolutions",
  });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://theace.ai";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/mice-solutions`,
    },
    twitter: {
      title: t("title"),
      description: t("description"),
    },
  };
}

const MICEPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  setRequestLocale((await params).locale);
  return (
    <main className="">
      <MiceHero />
      <MiceStandOut />
      <MiceServices />
      <MiceConsulting />
      <MiceShowcase />
    </main>
  );
};

export default MICEPage;

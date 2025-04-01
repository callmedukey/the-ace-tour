import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { getTranslations } from "next-intl/server";
import HeroSection from "./components/hero-section";
import FirstSvgSeparator from "./components/first-svg-separator";
import OurMissionSection from "./components/our-mission-section";
import SecondSVGSeparator from "./components/second-svg-separator";
import HowItWorksSection from "./components/how-it-works-section";
import UsersStorySection from "./components/users-story-section";

export const revalidate = 604800; //7 days in seconds

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  setRequestLocale(locale);

  return (
    <main className="py-4 md:py-8 lg:py-12 max-w-screen-2xl mx-auto px-4">
      <HeroSection />
      <FirstSvgSeparator />
      <OurMissionSection />
      <SecondSVGSeparator />
      <HowItWorksSection />
      <SecondSVGSeparator />
      <UsersStorySection />
    </main>
  );
}

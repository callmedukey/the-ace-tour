import { MiceHero } from "./components/mice-hero";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MiceCards } from "./components/mice-cards";
import { Link } from "@/i18n/navigation";
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
  const t = await getTranslations({ locale, namespace: "Metadata.MiceSolutions" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theace.ai';

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/mice-solutions`,
      images: [
        {
          url: `${baseUrl}/mice-solutions/pattern.png`,
          width: 1200,
          height: 630,
          alt: t("imageAlt"),
        },
      ],
    },
    twitter: {
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/mice-solutions/pattern.png`],
    },
  };
}

const MICEPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  setRequestLocale((await params).locale);
  const t = await getTranslations("MiceCTA");
  return (
    <main className="">
      <MiceHero />
      <MiceCards />
      <div className="flex w-full items-center justify-center mb-16">
        <Link
          href="/support"
          className="group inline-flex h-12 w-[251px] items-center justify-between rounded-[10px] bg-highlight-blue hover:bg-highlight-blue/80 pl-5 pr-1 text-white transition-all"
        >
          <span className="text-base font-medium leading-6">{t("button")}</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white">
            <svg
              className="h-5 w-5 transform text-[#1976D2] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-105"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.83331 14.1667L14.1666 5.83334M14.1666 5.83334H6.66665M14.1666 5.83334V13.3333"
                stroke="currentColor"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default MICEPage;

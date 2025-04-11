import React from "react";
import { TravelPackages } from "./components/travel-packages";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata, Viewport } from "next";

export const generateStaticParams = async () => {
  return [
    { package: "la-departure" },
    { package: "las-vegas-departure" },
    { package: "semi-package" },
  ];
};

export const revalidate = 604800;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string; package: string }>;
}): Promise<Metadata> => {
  const { locale, package: packageType } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.TravelPackages" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theace.ai';

  // Get package-specific translations
  const packageKey = packageType.replace(/-/g, '_');
  
  let title = t("title");
  let description = t("description");
  let keywords = t("keywords");
  let imageUrl = `${baseUrl}/travel-packages/travels-package-bg.png`;
  const imageAlt = t("imageAlt");

  // Override with package-specific metadata if available
  try {
    title = t(`${packageKey}.title`);
    description = t(`${packageKey}.description`);
    keywords = t(`${packageKey}.keywords`);
    
    // Use package-specific image if available
    if (packageType === "la-departure") {
      imageUrl = `${baseUrl}/travel-packages/la-departure-bb141224-e281-40dd-ac9d-9d77bf94bfb3.png`;
    } else if (packageType === "las-vegas-departure") {
      imageUrl = `${baseUrl}/travel-packages/sample-img-2.png`;
    } else if (packageType === "semi-package") {
      imageUrl = `${baseUrl}/travel-packages/sample-img-3.webp`;
    }
  } catch {
    // Fallback to default metadata if package-specific translations are not available
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/travel-packages/${packageType}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};

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

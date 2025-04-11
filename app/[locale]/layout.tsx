import localFont from "next/font/local";
import "../globals.css";
import { cn } from "@/lib/cn";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Metadata, Viewport } from "next";
import Header from "./components/layout/header";
import { Toaster } from "sonner";
import { Footer } from "./components/layout/footer";

const Pretendard = localFont({
  src: [
    {
      path: "../PretendardVariable.woff2",
      weight: "45 920",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theace.ai';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${t("siteName")}`,
      default: t("siteName"),
    },
    description: t("siteDescription"),
    keywords: t("siteKeywords"),
    authors: [{ name: "The Ace Tour" }],
    creator: "The Ace Tour",
    publisher: "The Ace Tour",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: locale,
      alternateLocale: locale === "en" ? "ko" : "en",
      siteName: t("siteName"),
      title: t("siteName"),
      description: t("siteDescription"),
      url: baseUrl,
      images: [
        {
          url: `${baseUrl}/the-ace-logo.webp`,
          width: 1200,
          height: 630,
          alt: t("logoAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("siteDescription"),
      images: [`${baseUrl}/the-ace-logo.webp`],
    },
    icons: {
      icon: "/favicon.ico",
    },
    category: "travel",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={cn(
          "antialiased bg-white isolate break-keep",
          Pretendard.variable,
          "font-pretendard"
        )}
      >
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

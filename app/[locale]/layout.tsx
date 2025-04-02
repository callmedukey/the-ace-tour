import localFont from "next/font/local";
import "../globals.css";
import { cn } from "@/lib/cn";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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

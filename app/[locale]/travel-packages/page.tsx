import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

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

import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

const page = async () => {
  const locale = await getLocale();

  redirect({
    href: "/admin/settings",
    locale,
  });

  return null;
};

export default page;

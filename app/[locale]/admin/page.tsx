import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

const page = async () => {
  const session = await auth();
  const locale = await getLocale();

  if (!session) {
    redirect({
      href: "/admin/login",
      locale,
    });
  }

  redirect({
    href: "/admin/shuttle-bookings",
    locale,
  });

  return null;
};

export default page;

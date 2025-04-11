import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function NotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  // We're not using translations here, but keeping the pattern consistent with other pages
  // const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Post Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The post you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/mice-solutions"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-highlight-blue hover:bg-highlight-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-blue"
      >
        Back to MICE Solutions
      </Link>
    </div>
  );
}
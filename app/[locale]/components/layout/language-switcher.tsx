"use client";

import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useLocale } from "next-intl";

import EnglishFlag from "@/public/flags/uk.png";
import KoreanFlag from "@/public/flags/kr.png";
import { cn } from "@/lib/cn";

export default function LanguageSwitcher({wrapperClassName}: { wrapperClassName?: string }) {
  const currentLocale = useLocale();
  const pathname = usePathname();

  const isEnglish = currentLocale === "en";

  return (
    <div className={cn("flex items-center space-x-2", wrapperClassName)}>
      <Link
        href={pathname}
        locale={isEnglish ? "ko" : "en"}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors"
        aria-label="Toggle Language between Korean and English"
      >
        <span className="text-base font-medium text-gray-900">
          {isEnglish ? "ENG" : "한국어"}
        </span>
        {isEnglish ? (
          <Image
            src={EnglishFlag}
            alt={"English Flag"}
            className="w-5 h-auto"
            quality={100}
            priority={true}
          />
        ) : (
          <Image
            src={KoreanFlag}
            alt={"Korean Flag"}
            className="w-5 h-auto"
            quality={100}
            priority={true}
          />
        )}
      </Link>
    </div>
  );
}

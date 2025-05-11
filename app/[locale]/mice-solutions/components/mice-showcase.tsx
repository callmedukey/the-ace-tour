import React from "react";
import Image from "next/image";
import PatternBg from "@/public/mice-solutions/pattern-2.webp";
import { getTranslations } from "next-intl/server";
import { MiceCards } from "./mice-cards";

const MiceShowcase = async () => {
  const t = await getTranslations("MiceShowcase");
  return (
    <section className="">
      <div className="w-full relative rounded-t-2xl text-white pt-24 pb-60 px-4 overflow-clip">
        <Image
          src={PatternBg}
          alt="Pattern Background"
          fill
          className="object-cover absolute -z-10"
          sizes="100vw"
          quality={100}
        />
        <div className="flex items-center justify-center w-[16.5rem] h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-highlight-yellow p-2 mb-4 sm:mb-6 bg-[#FFF8F0] mx-auto">
          <span className="badge-text text-highlight-yellow">{t("badge")}</span>
        </div>
        <h2 className="text-4xl font-bold text-center z-20">{t("title")}</h2>
        <p className="text-center text-base max-w-[35rem] mx-auto mt-8">
          {t("accentText")}
        </p>
      </div>
      <MiceCards />
    </section>
  );
};

export default MiceShowcase;

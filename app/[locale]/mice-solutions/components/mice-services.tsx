import { getTranslations } from "next-intl/server";
import React from "react";
import MiceServicesList from "./mice-services-list";
import { Link } from "@/i18n/navigation";

const MiceServices = async () => {
  const t = await getTranslations("MicePlanAndServices");
  return (
    <section className="py-16 bg-[#1976D2]/10 rounded-2xl">
      <div className="flex items-center justify-center w-[16.5rem] h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-highlight-yellow p-2 mb-4 sm:mb-6 bg-highlight-yellow/10 mx-auto">
        <span className="badge-text text-highlight-yellow">{t("badge")}</span>
      </div>
      <h2 className="text-4xl font-bold text-center">{t("title")}</h2>
      <p className="text-center text-base max-w-[35rem] mx-auto mt-8">
        {t("accentText")}
      </p>
      <div className="px-4">
        <MiceServicesList />
        <div className="flex w-full items-center">
          <Link
            href="/support"
            className="group flex mx-auto mt-16 h-12 w-[11rem] items-center justify-between rounded-[10px] bg-highlight-blue hover:bg-highlight-blue/80 pl-5 pr-1 text-white transition-all"
          >
            <span className="text-base font-medium leading-6">
              {t("button")}
            </span>
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
      </div>
    </section>
  );
};

export default MiceServices;

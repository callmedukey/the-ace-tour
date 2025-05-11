import React from "react";
import Image from "next/image";
import PatternBg from "@/public/mice-solutions/pattern.webp";
import { getTranslations } from "next-intl/server";

import CES from "@/public/mice-solutions/ces.webp";
import MARKET from "@/public/mice-solutions/market.webp";
import SCM from "@/public/mice-solutions/scm.webp";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Link } from "@/i18n/navigation";

const MiceConsulting = async () => {
  const t = await getTranslations("MiceConsulting");

  const list = [
    {
      image: CES,
      title: t("list.ces.title"),
      description: t("list.ces.description"),
    },
    {
      image: MARKET,
      title: t("list.market.title"),
      description: t("list.market.description"),
    },
    {
      image: SCM,
      title: t("list.scm.title"),
      description: t("list.scm.description"),
    },
  ];

  const secondList = [
    {
      number: "127",
      title: t("secondList.number1.title"),
      suffix: t("secondList.number1.suffix"),
    },
    {
      number: "18",
      title: t("secondList.number2.title"),
      suffix: t("secondList.number2.suffix"),
    },
    {
      number: "1286",
      title: t("secondList.number3.title"),
      suffix: t("secondList.number3.suffix"),
    },
  ];
  return (
    <section className="py-16 relative">
      <Image
        src={PatternBg}
        alt="Pattern Background"
        fill
        className="object-cover -z-20 absolute"
        sizes="100vw"
        quality={100}
      />
      <div className="flex items-center justify-center w-[16.5rem] h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-highlight-yellow p-2 mb-4 sm:mb-6 bg-highlight-yellow/10 mx-auto z-10">
        <span className="badge-text text-highlight-yellow">{t("badge")}</span>
      </div>
      <h2 className="text-4xl font-bold text-center">{t("title")}</h2>
      <p className="text-center text-lg mt-6 max-w-[50rem] mx-auto">
        {t("accentText")}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-screen-2xl  mx-auto mt-12 px-4">
        {list.map((item) => (
          <li key={item.title}>
            <Image src={item.image} alt={item.title} />
            <h3 className="text-2xl font-bold mt-6">{item.title}</h3>
            <p className="text-base mt-6">{item.description}</p>
          </li>
        ))}
      </ul>
      <div className="px-4 max-w-screen-2xl mx-auto">
        <p className="text-left mt-16 py-2 px-4 text-[#1976D2] border border-[#1976D2] rounded-full w-fit">
          {t("guide")}
        </p>
      </div>
      <div className="flex items-center justify-center w-[16.5rem] mt-24 h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-highlight-yellow p-2 mb-4 sm:mb-6 bg-highlight-yellow/10 mx-auto z-10">
        <span className="badge-text text-highlight-yellow">{t("badge")}</span>
      </div>
      <h2 className="text-4xl font-bold text-center">{t("secondTitle")}</h2>
      <p className="text-center text-lg mt-6 max-w-[50rem] mx-auto">
        {t("secondAccentText")}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-screen-2xl  mx-auto my-18 px-4">
        {secondList.map((item) => (
          <li
            key={item.number}
            className="flex flex-col items-center bg-[#1B365D] text-white rounded-3xl rounded-br-none p-16"
          >
            <span className="text-2xl font-bold">
              <span className="text-7xl">
                <NumberTicker value={parseInt(item.number)} />
              </span>
              <span className="text-4xl">{item.suffix}</span>
            </span>
            <span className="text-2xl font-bold mt-2">{item.title}</span>
          </li>
        ))}
      </ul>
      <div className="flex w-full items-center">
        <Link
          href="/support"
          className="group flex mx-auto mt-16 h-12 w-[11rem] items-center justify-between rounded-[10px] bg-highlight-blue hover:bg-highlight-blue/80 pl-5 pr-1 text-white transition-all"
        >
          <span className="text-base font-medium leading-6">{t("button")}</span>
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
    </section>
  );
};

export default MiceConsulting;

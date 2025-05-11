import { getTranslations } from "next-intl/server";
import Image from "next/image";

import FirstImage from "@/public/mice-solutions/business-icon.svg";
import SecondImage from "@/public/mice-solutions/send.svg";
import ThirdImage from "@/public/mice-solutions/check-list.svg";
import FourthImage from "@/public/mice-solutions/global.svg";
import MainImage from "@/public/mice-solutions/main.webp";
import { Link } from "@/i18n/navigation";

const MiceStandOut = async () => {
  const t = await getTranslations("MiceStandOut");

  const list = [
    {
      image: FirstImage,
      title: t("list.list1.title"),
      text: t("list.list1.text"),
    },
    {
      image: SecondImage,
      title: t("list.list2.title"),
      text: t("list.list2.text"),
    },
    {
      image: ThirdImage,
      title: t("list.list3.title"),
      text: t("list.list3.text"),
    },
    {
      image: FourthImage,
      title: t("list.list4.title"),
      text: t("list.list4.text"),
    },
  ];
  return (
    <section className="py-16 max-w-screen-2xl mx-auto px-4 2xl:px-0">
      <h2 className="text-4xl font-bold">{t("title")}</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <ul className="grid grid-cols-2 gap-4 py-16 order-2 lg:order-1">
          {list.map((item) => (
            <li key={item.title} className="flex flex-col gap-4">
              <Image
                src={item.image}
                alt={item.title}
                unoptimized
                className="size-12"
              />
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="text-lg">{item.text}</p>
            </li>
          ))}
        </ul>
        <div className="relative order-1 lg:order-2">
          <Image
            src={MainImage}
            alt="Main Image"
            className="w-full h-full object-cover mt-8 lg:mt-0"
            quality={100}
          />
        </div>
      </div>
      <div className="flex w-full items-center">
        <Link
          href="/support"
          className="group inline-flex h-12 w-[11rem] items-center justify-between rounded-[10px] bg-highlight-blue hover:bg-highlight-blue/80 pl-5 pr-1 text-white transition-all"
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

export default MiceStandOut;

import DOMPurify from "isomorphic-dompurify";

import * as motion from "motion/react-client";

import Image from "next/image";
import Airplanes from "@/public/home/airplanes.svg";

import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

const HeroSection = async () => {
  const t = await getTranslations("HeroSection");

  const locale = await getLocale();

  return (
    <section className="">
      <div className="flex">
        <motion.h1
          className={cn(
            "title-text text-3xl text-gray-800 md:text-[3.25rem]  max-w-[36rem] tracking-[-0.02em] font-semibold",
            locale === "en" && "max-w-[40.1rem]"
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.8 }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              t.markup("title", {
                important: (chunks) =>
                  `<span class="text-highlight-yellow inline">${chunks}</span>`,
              })
            ),
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "ml-auto mr-18 hidden lg:block",
            locale === "ko" && "mr-2"
          )}
        >
          <Image src={Airplanes} alt="Airplanes" unoptimized />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="md:w-auto py-4 sm:py-6 lg:py-8 flex justify-between items-center flex-wrap gap-4"
      >
        <Link
          href="/travel-packages/la-departure"
          className="group inline-flex h-12 w-[251px] items-center justify-between rounded-[10px] bg-highlight-blue hover:bg-highlight-blue/80 pl-5 pr-1 text-white transition-all"
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
        <p className="text-sm md:text-base font-medium leading-6 text-gray-80 max-w-[22rem] ">
          {t("description")}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative rounded-2xl border border-[#EAECF0] overflow-hidden w-full aspect-[2.017]"
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          // loop
          muted
          playsInline
        >
          <source src={"/home/hollywood-la.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </section>
  );
};

export default HeroSection;

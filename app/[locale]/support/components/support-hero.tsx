import * as motion from "motion/react-client";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Pattern from "@/public/support/support-pattern.png";
import { SupportForm } from "./support-form";

export async function SupportHero() {
  const t = await getTranslations("SupportHero");
  const locale = await getLocale();
  const isEnglish = locale === "en";

  const featureCards = [
    {
      text: t("cards.card1.title"),
      content: t("cards.card1.content"),
      media: {
        url: "/support/icons/clock-contact.png",
        alt: "Clock icon",
      },
    },
    {
      text: t("cards.card2.title"),
      content: t("cards.card2.content"),
      media: {
        url: "/support/icons/email-contact.png",
        alt: "Email icon",
      },
    },
    {
      text: t("cards.card3.title"),
      content: t("cards.card3.content"),
      media: {
        url: "/support/icons/phone-contact.png",
        alt: "Phone icon",
      },
    },
  ];

  return (
    <section className="relative flex justify-center w-full min-h-[min(55rem,100vh)] overflow-hidden">
      <div className="absolute w-full h-full">
        <Image
          src={Pattern}
          alt="Background pattern"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <div className="w-full max-w-[344px] lg:w-[344px] pt-6 sm:pt-8 md:pt-10 lg:pt-[59px] px-4 sm:px-6 lg:px-0 lg:ml-[140px]">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.6 }}
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight sm:leading-[40px] md:leading-[44px] lg:leading-[48px] tracking-[0px] text-[#262626] text-center lg:text-left ${
                isEnglish ? "mb-4 sm:mb-6 lg:mb-8" : "mb-8 sm:mb-10 lg:mb-12"
              }`}
            >
              {t("title")}
            </motion.h1>

            {/* Contact Information Cards */}
            <div className="space-y-4 sm:space-y-[25px] flex flex-col items-start">
              {featureCards.map((card, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="flex items-start gap-2 sm:gap-2.5 bg-transparent rounded-[1rem] xs:rounded-[1.375rem]"
                  >
                    <div className="w-4 h-4 sm:w-4 sm:h-4 mt-3 sm:mt-3.5">
                      <Image
                        src={card.media.url}
                        alt={card.media.alt}
                        width={16}
                        height={16}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-[14px] sm:text-[16px] ${
                          isEnglish ? "font-medium" : "font-semibold"
                        } text-[#262626] mb-[4px] sm:mb-1 whitespace-nowrap`}
                      >
                        {card.text}
                      </h3>
                      <p className="text-xs sm:text-sm font-normal leading-[16px] sm:leading-[20px] tracking-[0px] text-[#262626] whitespace-nowrap">
                        {card.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-1/2 mt-8 lg:mt-[59px]"
          >
            <SupportForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { getLocale, getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import React from "react";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { BookingForm } from "./booking-form";

export async function ShuttleHero() {
  const t = await getTranslations("ShuttleHero");
  const locale = await getLocale();
  const isEnglish = locale === "en";

  const featureCards = [
    {
      icon: "/shuttle-service/icons/clock-shuttle.png",
      text: t("features.feature1"),
    },
    {
      icon: "/shuttle-service/icons/bus-shuttle.png",
      text: t("features.feature2"),
    },
  ];

  return (
    <section className="relative w-full min-h-[min(60rem,100vh)] bg-white py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-screen-xl mx-auto">
          {/* Left Content */}
          <div className="w-full lg:w-auto max-w-[28.75rem] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`px-4 sm:px-5 md:pl-4 pt-4 sm:pt-5 md:pt-4 rounded-[20px] border border-[#E5E5E5] bg-[#F0F7FE] overflow-hidden ${
                isEnglish ? "h-auto md:h-[23rem]" : "h-auto md:h-[19.063rem]"
              }`}
            >
              {/* Badge */}
              <div
                className={`${
                  isEnglish ? "w-full sm:w-[16.563rem]" : "w-fit"
                } px-6 sm:px-8 md:px-[35px] py-2 sm:py-3 md:py-2.5 rounded-full border border-[#F6B600] bg-[#F6B600]/10`}
              >
                <div className="flex justify-center items-center">
                  <span className="text-sm sm:text-base md:text-lg text-center font-medium text-[#F6B600]">
                    {t("badge")}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="w-full sm:w-[90%] md:max-w-[26.75rem]">
                <h2
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${
                    isEnglish ? "mt-[15px] mb-[50px]" : "mt-[10px] mb-[40px]"
                  }`}
                >
                  {t("title")}
                </h2>
              </div>
              <div className="w-full sm:w-[90%] md:w-[25.5rem] h-auto md:h-[5.875rem]">
                <p
                  className={`${
                    isEnglish
                      ? "text-left font-medium text-sm sm:text-base leading-[20px] sm:leading-[22px] md:leading-[24px] mb-[35px]"
                      : "text-left font-medium text-sm sm:text-base leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%] align-middle mb-[50px]"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      t.markup("description", {
                        important: (chunks) => `${chunks}<br />`,
                      })
                    ),
                  }}
                />
              </div>
            </motion.div>

            {/* Feature Cards */}
            <div className="mt-4 sm:mt-5 md:mt-6 space-y-3 sm:space-y-4 md:space-y-5">
              {featureCards.map((card, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="flex items-center h-[60px] sm:h-[70px] md:h-[80px] gap-3 sm:gap-4 md:gap-5 rounded-[22px] border px-3 sm:px-4 py-4 sm:py-5 md:py-6 bg-white border-[#E5E5E5] hover:border-highlight-blue transition-colors"
                  >
                    <div className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px] flex-shrink-0">
                      <Image
                        src={card.icon}
                        alt="Feature icon"
                        width={32}
                        height={32}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <span className="text-sm sm:text-base md:text-lg font-medium text-[#262626]">
                      {isEnglish
                        ? card.text.split("!").map((text, index, array) => (
                            <React.Fragment key={index}>
                              {text}
                              {index < array.length - 1 && (
                                <>
                                  {`!`}
                                  <br />
                                </>
                              )}
                            </React.Fragment>
                          ))
                        : card.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-auto mt-8 lg:mt-0 flex justify-center lg:justify-start flex-shrink-0"
          >
            <BookingForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

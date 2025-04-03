import * as motion from "motion/react-client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import PatternBackgroundImage from "@/public/travel-packages/travels-package-bg.png";
import { getLocale, getTranslations } from "next-intl/server";
import getPackageData from "../queries/getPackageData";
import TravelPackagesMedia from "./travel-packages-media";

export async function TravelPackages({
  packageType,
}: {
  packageType: "la-departure" | "las-vegas-departure" | "semi-package";
}) {
  const t = await getTranslations("TravelPackages");
  const locale = await getLocale();

  const tourPackage = await getPackageData(packageType);

  const features = tourPackage
    ? [
        {
          text:
            locale === "ko"
              ? tourPackage.KOfirstPoint
              : tourPackage.ENGfirstPoint,
        },
        {
          text:
            locale === "ko"
              ? tourPackage.KOsecondPoint
              : tourPackage.ENGsecondPoint,
        },
        {
          text:
            locale === "ko"
              ? tourPackage.KOthirdPoint
              : tourPackage.ENGthirdPoint,
        },
      ]
    : [
        {
          text: t("laPackages.features.feature1"),
        },
        {
          text: t("laPackages.features.feature2"),
        },
        {
          text: t("laPackages.features.feature3"),
        },
      ];

  const getNextRoute = () => {
    if (packageType === "la-departure") {
      return `/travel-packages/las-vegas-departure`;
    } else if (packageType === "las-vegas-departure") {
      return `/travel-packages/semi-package`;
    } else if (packageType === "semi-package") {
      return `/travel-packages/la-departure`;
    }
    return `/travel-packages/la-departure`;
  };

  return (
    <section className="relative">
      {/* Original blue background */}
      <div className="absolute inset-x-0 top-0 w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[566px] bg-highlight-blue" />

      {/* Background image with color overlay */}
      <div className="absolute inset-x-0 top-0 w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[566px] overflow-hidden">
        <div className="absolute w-full h-full">
          <Image
            src={PatternBackgroundImage}
            alt="Background pattern"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 pt-[30px] sm:pt-[40px] md:pt-[50px]"
        >
          {/* Badge */}
          <div className="inline-flex items-center justify-center w-[14rem] sm:w-[15rem] md:w-[16.5rem] h-[2rem] sm:h-[2.25rem] md:h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-[#F6B600] border-[1px] p-[0.5rem] mb-[10px] sm:mb-[12px] md:mb-[15px] bg-[#FFF8F0]">
            <span className="text-xs sm:text-sm font-medium text-[#F6B600]">
              {t("badge")}
            </span>
          </div>

          <div className="w-full sm:w-[37.5rem] md:w-[49.75rem] mx-auto px-4 sm:px-0">
            <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] leading-[36px] sm:leading-[40px] md:leading-[44px] lg:leading-[48px] tracking-[0px] font-semibold text-white text-center">
              {t("title")}
            </h2>
          </div>

          <p className="text-white/90 w-full sm:w-[37.5rem] md:w-[49.75rem] mx-auto text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[26px] md:leading-[28px] tracking-[0%] font-medium text-center align-middle mt-[12px] sm:mt-[15px] md:mt-[18px]">
            {t("description")}
          </p>
        </motion.div>

        {/* Card and Gallery Container */}
        <div className="flex flex-col lg:flex-row justify-center gap-[20px] sm:gap-[30px] lg:gap-[10px] items-center lg:items-start max-w-[1174px] mx-auto">
          {/* Package Card */}
          {tourPackage && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-white overflow-hidden w-full sm:w-[372px] h-auto sm:h-[484.89px] border border-gray-200 rounded-[20px] pt-[16px] pr-[24px] pb-[24px] pl-[24px] mb-4 lg:mb-0"
            >
              {/* Most Popular Banner */}
              {tourPackage.mostPopular && (
                <div className="absolute top-0 left-0 right-0 bg-[#FFC107] text-center py-2 sm:py-3 text-white text-sm sm:text-base font-medium">
                  {t("popularBadge")}
                </div>
              )}

              {/* Card Content */}
              <div
                className={`${
                  tourPackage.mostPopular ? "pt-[30px] sm:pt-[36px]" : ""
                }`}
              >
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#1B365D] mb-3 sm:mb-4">
                  {locale === "ko"
                    ? tourPackage.KOaccentText
                    : tourPackage.ENGaccentText}
                </h3>

                {/* Starting Price */}
                <div className="flex items-center gap-2 mb-[30px] sm:mb-[50px]">
                  <span className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] tracking-[0%] font-medium text-gray-600">
                    Starting at
                  </span>
                  <div className="inline-flex w-[100px] sm:w-[122px] h-[36px] sm:h-[40px] items-center justify-center rounded-[22px] bg-[#1B365D] p-[8px] gap-[8px]">
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {locale === "ko"
                        ? tourPackage.KOprice
                        : tourPackage.ENGprice}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-[30px] sm:space-y-[50px] mb-[35px] sm:mb-[55px]">
                  {features.map((item, i, array) => (
                    <div key={i} className="relative">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1B365D] flex items-center justify-center mr-2 sm:mr-3">
                          <svg
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600 text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] tracking-[0%] font-normal">
                          {item.text}
                        </p>
                      </div>
                      {i < array.length - 1 && (
                        <div className="absolute w-full h-[1px] bg-[#F5F5F5] transform rotate-[-0.17deg] left-0 top-[30px] sm:top-[50px]" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Book Now Button */}

                <Link
                  href={tourPackage.buttonLink ?? "/"}
                  className="group inline-flex w-full h-[44px] sm:h-[48px] items-center justify-between rounded-[22px] bg-highlight-blue hover:bg-highlight-blue/90 pt-2 pr-1 pb-2 pl-4 sm:pl-6 text-white transition-all"
                >
                  <span className="text-sm sm:text-base leading-[20px] sm:leading-[24px] tracking-[0%] font-medium">
                    {tourPackage.KObuttonText && tourPackage.ENGbuttonText
                      ? locale === "ko"
                        ? tourPackage.KObuttonText
                        : tourPackage.ENGbuttonText
                      : "Book Now"}
                  </span>
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 transform text-highlight-blue transition-transform duration-200 group-hover:translate-x-1"
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
            </motion.div>
          )}

          {/* Media Section */}
          <TravelPackagesMedia
            images={
              (tourPackage &&
                tourPackage?.images.length > 0 &&
                tourPackage?.images.map((image) => ({
                  src: image.path,
                  alt: locale === "ko" ? image.KOalt : image.ENGalt,
                }))) || [
                {
                  src: "/travel-packages/sample-img-2.png",
                  alt: "Travel Package",
                },
                {
                  src: "/travel-packages/sample-img-1.webp",
                  alt: "Palm Trees",
                },
                {
                  src: "/travel-packages/sample-img-3.webp",
                  alt: "Travel Package",
                },
              ]
            }
          />
        </div>

        {/* Buttons Section */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[1174px] mx-auto mt-6 lg:mt-5"
        >
          <div className="w-full flex justify-center lg:justify-end">
            <Link
              href={getNextRoute()}
              className="w-[160px] mb-3 sm:w-[180px] md:w-[203px] h-[36px] sm:h-[38px] md:h-[40px] flex items-center justify-center rounded-[20px] border border-highlight-blue pt-[8px] pr-[16px] sm:pr-[18px] md:pr-[20px] pb-[8px] pl-[16px] sm:pl-[18px] md:pl-[20px] bg-white text-highlight-blue hover:bg-white/90 transition-colors duration-300"
            >
              <span className=" text-[14px] sm:text-[15px] md:text-[16px] leading-[20px] sm:leading-[22px] md:leading-[24px] tracking-[0%] font-medium">
                {t("viewAllButton")}
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Navigation Arrows */}

        <div className="flex justify-center mt-[20px] sm:mt-[25px] md:mt-[30px] gap-2 mb-6 sm:mb-7 md:mb-8">
          <button className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300">
            <svg
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300">
            <svg
              className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

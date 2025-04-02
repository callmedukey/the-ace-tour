import { NumberTicker } from "@/components/magicui/number-ticker";
import Image from "next/image";
import * as motion from "motion/react-client";
import PatternBG from "@/public/mice-solutions/pattern.png";
import { getLocale } from "next-intl/server";
import { cn } from "@/lib/cn";
import { getMiceData } from "../queries/getMiceData";

export async function MiceHero() {
  const locale = await getLocale();

  let pageData: {
    ENGtitle: string;
    KOtitle: string;
    firstValue: number;
    firstValueENGText: string;
    firstValueKOText: string;
    secondValue: number;
    secondValueENGText: string;
    secondValueKOText: string;
    thirdValue: number;
    thirdValueENGText: string;
    thirdValueKOText: string;
    posts: {
      id: string;
      ENGtitle: string;
      KOtitle: string;
      ENGcontent: string;
      KOcontent: string;
      imgPath: string;
      imgENGAlt: string;
      imgKOAlt: string;
    }[];
  } = {
    ENGtitle:
      "Successful MICE Events in the Western USA: Customized Solutions with The ACE",
    KOtitle:
      "미국 서부에서의 성공적인 MICE 행사: The ACE와 함께하는 맞춤형 솔루션",
    firstValue: 33,
    firstValueENGText:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
    firstValueKOText:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
    secondValue: 37,
    secondValueENGText:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
    secondValueKOText:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
    thirdValue: 73,
    thirdValueENGText:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
    thirdValueKOText:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
    posts: [
      {
        id: "1",
        ENGtitle: "Lorem ipsum dolor sit amet consectetur.",
        KOtitle: "Lorem ipsum dolor sit amet consectetur.",
        ENGcontent:
          "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
        KOcontent:
          "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
        imgPath: "",
        imgENGAlt: "Lorem ipsum dolor sit amet consectetur.",
        imgKOAlt: "Lorem ipsum dolor sit amet consectetur.",
      },
    ],
  };

  const miceData = await getMiceData();

  if (miceData) {
    pageData = miceData;
  }

  const cards = [
    {
      value: pageData.firstValue,
      valueENGText: pageData.firstValueENGText,
      valueKOText: pageData.firstValueKOText,
    },
    {
      value: pageData.secondValue,
      valueENGText: pageData.secondValueENGText,
      valueKOText: pageData.secondValueKOText,
    },
    {
      value: pageData.thirdValue,
      valueENGText: pageData.thirdValueENGText,
      valueKOText: pageData.thirdValueKOText,
    },
  ];

  return (
    <section className="relative flex justify-center w-full min-h-[min(50rem,80vh)] bg-white overflow-hidden isolate">
      {/* Pattern Background */}
      <Image
        src={PatternBG}
        alt="Background pattern"
        fill
        className="object-cover opacity-60 -z-10 absolute"
        sizes="100vw"
        priority
      />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24 z-10 max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center w-full"
        >
          {/* Title */}

          <h1
            className={cn(
              "max-w-[50rem] text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-800 leading-[1.3] sm:leading-[1.4] tracking-[0] text-center mb-8 sm:mb-12 md:mb-16 lg:mb-24 mx-auto"
            )}
          >
            {locale === "ko" ? pageData.KOtitle : pageData.ENGtitle}
          </h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[1112px] mx-auto">
            {cards.map((card, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-6 p-4"
                >
                  <span className="gradient-text text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-bold leading-none mice-values">
                    +
                    <NumberTicker value={parseInt(card.value.toString())} />
                  </span>
                  {locale === "ko" ? (
                    <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium leading-[1.4] sm:leading-[1.5] md:leading-[1.6] lg:leading-[1.7] tracking-[0%] text-center text-[#475467] max-w-[280px] sm:max-w-[320px] lg:max-w-[348px]">
                      {card.valueKOText}
                    </p>
                  ) : (
                    <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-medium leading-[1.4] sm:leading-[1.5] md:leading-[1.6] lg:leading-[1.7] tracking-[0%] text-center text-[#475467] max-w-[280px] sm:max-w-[320px] lg:max-w-[348px]">
                      {card.valueENGText}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

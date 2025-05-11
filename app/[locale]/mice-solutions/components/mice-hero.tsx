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
    ENGaccentContent: string;
    KOaccentContent: string;
    ENGcontent: string;
    KOcontent: string;
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
    ENGaccentContent: `THE ACE is your MICE specialist team that ensures your success at global events like CES. 

With our local networks in LA, Las Vegas, San Francisco, and San Diego, breaking into the North American market becomes much easier. From planning to installation, marketing, and operation - drop your worries and create your global success story with THE ACE!`,
    KOaccentContent: `THE ACE는 CES 등 글로벌 행사에서 당신의 성공을 책임지는 MICE 전문팀입니다. 

LA, 라스베가스, 샌프란시스코, 샌디에고 현지 네트워크로 무장한 우리와 함께라면 북미 시장 진출이 훨씬 쉬워집니다.
기획부터 설치, 마케팅, 운영까지 - 걱정은 내려놓고 THE ACE와 함께 글로벌 성공 스토리를 만들어보세요!`,
    ENGcontent:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
    KOcontent:
      "Lorem ipsum dolor sit amet consectetur. Aliquet ipsum vitae eget tellus erat a.",
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
    pageData = { ...pageData, ...miceData };
  }

  // const cards = [
  //   {
  //     value: pageData.firstValue,
  //     valueENGText: pageData.firstValueENGText,
  //     valueKOText: pageData.firstValueKOText,
  //   },
  //   {
  //     value: pageData.secondValue,
  //     valueENGText: pageData.secondValueENGText,
  //     valueKOText: pageData.secondValueKOText,
  //   },
  //   {
  //     value: pageData.thirdValue,
  //     valueENGText: pageData.thirdValueENGText,
  //     valueKOText: pageData.thirdValueKOText,
  //   },
  // ];

  return (
    <section className="relative flex justify-center items-center w-full min-h-[min(50rem,80vh)] bg-[#1B365D] overflow-hidden isolate text-white rounded-t-2xl">
      {/* Pattern Background */}
      <Image
        src={PatternBG}
        alt="Background pattern"
        fill
        className="object-cover -z-10 absolute brightness-125"
        sizes="100vw"
        priority
      />

      <div className="relative w-http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpattern.27f68dd4.png&w=3840&q=75full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24 z-10 max-w-screen-2xl mx-auto">
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
              "max-w-[50rem] xl:text-7xl text-4xl font-bold leading-[1.3] sm:leading-[1.4] tracking-[0] text-center mb-8 sm:mb-12 md:mb-16 lg:mb-24 mx-auto"
            )}
          >
            {locale === "ko" ? pageData.KOtitle : pageData.ENGtitle}
          </h1>

          <p className="text-center text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] lg:text-[1.25rem] font-medium leading-[1.3] sm:leading-[1.4] tracking-[0] mx-auto whitespace-pre-line">
            {locale === "ko"
              ? pageData.KOaccentContent
              : pageData.ENGaccentContent}
          </p>

          {/* Statistics Cards
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
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}

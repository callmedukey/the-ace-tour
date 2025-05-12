import Image from "next/image";
import * as motion from "motion/react-client";
import PatternBG from "@/public/mice-solutions/pattern.png";
import { getLocale } from "next-intl/server";
import { cn } from "@/lib/cn";
import { getMiceData } from "../queries/getMiceData";

export async function MiceHero() {
  const locale = await getLocale();
  const miceData = await getMiceData();

  let pageData: {
    ENGtitle: string;
    KOtitle: string;
    ENGaccentText: string;
    KOaccentText: string;
  } = {
    KOtitle: "CES 전문가와 함께하는 글로벌 MICE 솔루션",
    ENGtitle: "Conquer Global Stages with CES Experts",
    KOaccentText: `THE ACE는 CES 등 글로벌 행사에서 당신의 성공을 책임지는 MICE 전문팀입니다. 

LA, 라스베가스, 샌프란시스코, 샌디에고 현지 네트워크로 무장한 우리와 함께라면 북미 시장 진출이 훨씬 쉬워집니다.
기획부터 설치, 마케팅, 운영까지 - 걱정은 내려놓고 THE ACE와 함께 글로벌 성공 스토리를 만들어보세요!`,
    ENGaccentText: `THE ACE is your MICE specialist team that ensures your success at global events like CES. 

With our local networks in LA, Las Vegas, San Francisco, and San Diego, breaking into the North American market becomes much easier. From planning to installation, marketing, and operation - drop your worries and create your global success story with THE ACE!`,
  };

  if (miceData) {
    pageData = { ...pageData, ...miceData };
  }

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
            {locale === "ko" ? pageData.KOaccentText : pageData.ENGaccentText}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

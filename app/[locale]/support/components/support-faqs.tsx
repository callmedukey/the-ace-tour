import * as motion from "motion/react-client";
import { getLocale, getTranslations } from "next-intl/server";
import Pattern from "@/public/support/support-pattern.png";
import Image from "next/image";
import getFaqData from "../queries/getFaqData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function SupportFAQ() {
  const t = await getTranslations("SupportFAQ");
  const locale = await getLocale();
  const isEnglish = locale === "en";

  const faqs = await getFaqData();
  const defaultCards = [
    {
      id: "1",
      ENGquestion: t("cards.card1.title"),
      KOquestion: t("cards.card1.title"),
      ENGanswer: t("cards.card1.content"),
      KOanswer: t("cards.card1.content"),
    },
    {
      id: "2",
      ENGquestion: t("cards.card2.title"),
      KOquestion: t("cards.card2.title"),
      ENGanswer: t("cards.card2.content"),
      KOanswer: t("cards.card2.content"),
    },
    {
      id: "3",
      ENGquestion: t("cards.card3.title"),
      KOquestion: t("cards.card3.title"),
      ENGanswer: t("cards.card3.content"),
      KOanswer: t("cards.card3.content"),
    },
    {
      id: "4",
      ENGquestion: t("cards.card4.title"),
      KOquestion: t("cards.card4.title"),
      ENGanswer: t("cards.card4.content"),
      KOanswer: t("cards.card4.content"),
    },
  ];

  // Limit to maximum 6 cards
  const displayCards = faqs && faqs?.length ? faqs : defaultCards;

  return (
    <section className="relative flex justify-center w-full min-h-[min(60rem,100vh)] pb-[31.25rem] overflow-hidden">
      <div className="absolute w-full h-full">
        <Image
          src={Pattern}
          alt="Background pattern"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative w-full max-w-7xl px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12 lg:py-16">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 sm:space-y-6 lg:space-y-8"
        >
          <div className="inline-flex items-center justify-center w-full max-w-[16.5rem] min-h-[2.5rem] gap-2 rounded-[1.375rem] border border-[#F6B600] p-2 bg-[#FFF8F0]">
            <span className="text-xs sm:text-sm font-medium text-[#F6B600] px-2">
              {t("title")}
            </span>
          </div>
          <div
            className={`mx-auto px-3 sm:px-4 lg:px-0 ${
              isEnglish ? "w-full lg:w-[60.875rem]" : "w-full md:w-[49.75rem]"
            }`}
          >
            <h2
              className={`font-semibold text-center text-gray-900 ${
                isEnglish
                  ? "text-xl sm:text-2xl lg:text-[3.25rem] leading-tight lg:leading-[1.1]"
                  : "text-lg sm:text-2xl md:text-[2.5rem] leading-tight md:leading-[1.2]"
              } tracking-[0] break-words`}
            >
              {t("content")}
            </h2>
          </div>
        </motion.div>

        {/* FAQ Cards */}
        <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-5 max-w-[47.375rem] mx-auto mt-6 sm:mt-8 lg:mt-12">
          <Accordion type="single" collapsible className="w-full">
            {displayCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full mb-6"
              >
                <AccordionItem value={card.id.toString()}>
                  <AccordionTrigger className="bg-white px-2 rounded-2xl py-6 font-medium flex items-center">
                    {isEnglish ? card.ENGquestion : card.KOquestion}
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 bg-white p-4 rounded-2xl">
                    {isEnglish ? card.ENGanswer : card.KOanswer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

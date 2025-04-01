import DOMpurify from "isomorphic-dompurify";
import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";

const OurMissionSection = async () => {
  const t = await getTranslations("OurMission");

  const cards = [
    {
      title: t("card1.title"),
      content: t("card1.content"),
    },
    {
      title: t("card2.title"),
      content: t("card2.content"),
    },
    {
      title: t("card3.title"),
      content: t("card3.content"),
    },
  ];

  return (
    <section className="py-4 md:py-8 lg:py-12 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center mb-8 sm:mb-12 md:mb-16"
      >
        <div className="inline-flex items-center justify-center w-[16.5rem] h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-highlight-yellow p-[0.5rem] mb-4 sm:mb-6 bg-highlight-yellow/10">
          <span className="badge-text text-highlight-yellow">{t("title")}</span>
        </div>

        <div className="w-full sm:w-[37.5rem] md:w-[49.75rem] mx-auto px-4 sm:px-0">
          <h2
            className="title-text font-semibold text-gray-900 text-center"
            dangerouslySetInnerHTML={{
              __html: DOMpurify.sanitize(
                t.markup("content", {
                  important: (chunks) => `${chunks}<br/>`,
                })
              ),
            }}
          />
        </div>
      </motion.div>
      <div className="flex gap-8 items-center justify-center flex-wrap">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="basis-full md:basis-[20.5rem] lg:basis-[24rem] h-[15rem] md:h-[18.75rem] bg-dark-blue rounded-tl-xl rounded-tr-xl rounded-bl-xl sm:rounded-tl-2xl sm:rounded-tr-2xl sm:rounded-bl-2xl p-6 sm:p-7 md:p-8 text-white border border-[#1B365C] flex flex-col"
          >
            <h3 className="text-lg sm:text-xl leading-[1.5rem] font-semibold mb-4 align-middle basis-[1rem]">
              {card.title}
            </h3>
            <div className="space-y-4">
              <p className="text-base font-medium align-middle text-white/90">
                {card.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurMissionSection;

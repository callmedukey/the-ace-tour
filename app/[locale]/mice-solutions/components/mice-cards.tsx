import Image from "next/image";
import * as motion from "motion/react-client";
import { getMiceData } from "../queries/getMiceData";
import { getLocale } from "next-intl/server";

export async function MiceCards() {
  const miceData = await getMiceData();
  const cards = miceData?.posts;
  const locale = await getLocale();
  const defaultCards = [
    {
      id: "1",
      ENGtitle: "Meeting Room",
      KOtitle: "미팅 룸",
      ENGcontent: "Lorem ipsum dolor sit amet consectetur.",
      KOcontent: "Lorem ipsum dolor sit amet consectetur.",
      imgPath: "",
      imgENGAlt: "Lorem ipsum dolor sit amet consectetur.",
      imgKOAlt: "Lorem ipsum dolor sit amet consectetur.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      ENGtitle: "Conference Room",
      KOtitle: "회의실",
      ENGcontent: "Lorem ipsum dolor sit amet consectetur.",
      KOcontent: "Lorem ipsum dolor sit amet consectetur.",
      imgPath: "",
      imgENGAlt: "Lorem ipsum dolor sit amet consectetur.",
      imgKOAlt: "Lorem ipsum dolor sit amet consectetur.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      ENGtitle: "Lounge",
      KOtitle: "라운지",
      ENGcontent: "Lorem ipsum dolor sit amet consectetur.",
      KOcontent: "Lorem ipsum dolor sit amet consectetur.",
      imgPath: "",
      imgENGAlt: "Lorem ipsum dolor sit amet consectetur.",
      imgKOAlt: "Lorem ipsum dolor sit amet consectetur.",
      createdAt: new Date().toISOString(),
    },
  ];

  const displayCards = cards && cards.length > 0 ? cards : defaultCards;

  return (
    <section className="relative flex justify-center w-full px-4 sm:px-6 lg:px-8 bg-white">
      <div className="relative w-full max-w-7xl py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mx-auto">
          {displayCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col w-full bg-white overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[1.58] rounded-t-[1.25rem] rounded-bl-[1.25rem] overflow-hidden">
                {card.imgPath ? (
                  <Image
                    src={card.imgPath}
                    alt={card.imgENGAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={100}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600" />
                )}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center justify-center h-10 bg-[#FAFAFA80] border border-white/20 rounded-[1.375rem] px-4 text-sm sm:text-base font-semibold leading-[1.5rem] tracking-[0] text-[#FAFAFA] max-w-fit">
                    {locale === "ko" ? card.KOtitle : card.ENGtitle}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="flex flex-col justify-center w-full py-3 sm:py-4 bg-white">
                <span className="text-sm sm:text-[0.875rem] font-semibold leading-5 tracking-[0] text-[#262626]/80">
                  {card.createdAt
                    ? new Date(card.createdAt).toLocaleDateString(
                        locale === "ko" ? "ko-KR" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : new Date().toLocaleDateString(
                        locale === "ko" ? "ko-KR" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                </span>
                <p className="text-base sm:text-[1.0625rem] font-semibold leading-6 sm:leading-7 tracking-[0] text-[#262626] line-clamp-1">
                  {card.ENGcontent}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

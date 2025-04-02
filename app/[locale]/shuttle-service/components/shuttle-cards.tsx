import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import Marquee from "react-fast-marquee";

import Card1 from "@/public/shuttle-service/shuttle-card-1.png";
import Card2 from "@/public/shuttle-service/shuttle-card-2.png";
import Card3 from "@/public/shuttle-service/shuttle-card-3.webp";
import Card4 from "@/public/shuttle-service/shuttle-card-4.webp";
import RouteIcon from "@/public/shuttle-service/icons/route.png";
import WhereIcon from "@/public/shuttle-service/icons/where.png";

import PatternBackgroundImage from "@/public/shuttle-service/shuttle-card-patternbg.png";
import Image from "next/image";
export async function ShuttleCards() {
  const t = await getTranslations("CardsShuttle");

  return (
    <section>
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="title-text font-bold text-center"
      >
        {t("title")}
      </motion.h2>

      <Marquee className="py-24" autoFill speed={40}>
        <div className="flex gap-6 mr-6 items-center">
          <div className="flex flex-col gap-6">
            <Image src={Card1} alt="Card 1" className="w-80" quality={100} />

            <Image src={Card2} alt="Card 2" className="w-80" quality={100} />
          </div>
          <div className="bg-highlight-blue rounded-2xl relative w-70 h-90 flex items-end p-4">
            <Image
              src={PatternBackgroundImage}
              alt="Pattern Background"
              fill
              className="object-cover"
            />
            <div className="flex flex-col gap-6">
              <Image src={RouteIcon} alt="Route Icon" />
              <p className="text-white h-18">{t("cards.card1.content")}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mr-6 items-center">
          <div className="flex flex-col gap-6">
            <Image
              src={Card3}
              alt="Card 3"
              className="w-80 rounded-none"
              quality={100}
            />

            <Image
              src={Card4}
              alt="Card 4"
              className="w-80 rounded-none"
              quality={100}
            />
          </div>
          <div className="bg-highlight-yellow rounded-2xl relative w-70 h-90 flex items-end p-4 isolate">
            <Image
              src={PatternBackgroundImage}
              alt="Pattern Background"
              fill
              className="object-cover"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(13%) sepia(32%) saturate(1492%) hue-rotate(182deg) brightness(94%) contrast(95%)",
              }}
            />
            <div className="flex flex-col gap-6">
              <Image src={WhereIcon} alt="Where Icon" />
              <p className="text-white h-18">{t("cards.card2.content")}</p>
            </div>
          </div>
        </div>
      </Marquee>
    </section>
  );
}

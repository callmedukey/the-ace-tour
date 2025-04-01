import { getDB } from "@/db";
import { ReviewTypeNoDate } from "@/db/schemas";
import { Link } from "@/i18n/navigation";
import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import Marquee from "react-fast-marquee";
import DOMPurify from "isomorphic-dompurify";

const UsersStorySection = async () => {
  const db = await getDB();
  const t = await getTranslations("UserStories");

  const reviews = await db.query.reviews.findMany();
  const defaultStories: ReviewTypeNoDate[] = [
    {
      id: 1,
      initial: t("story1.initial"),
      name: t("story1.name"),
      content: t("story1.text"),
    },
    {
      id: 2,
      initial: t("story2.initial"),
      name: t("story2.name"),
      content: t("story2.text"),
    },
    {
      id: 3,
      initial: t("story3.initial"),
      name: t("story3.name"),
      content: t("story3.text"),
    },
  ];

  const stories = reviews && reviews.length > 0 ? reviews : defaultStories;

  return (
    <motion.section className="py-4 md:py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center mb-8 sm:mb-12 md:mb-16"
      >
        <div className="inline-flex items-center justify-center w-[12.5rem] sm:w-[14.5rem] md:w-[16.5rem] h-[2rem] sm:h-[2.25rem] md:h-[2.5rem] gap-[0.5rem] rounded-[1.375rem] border border-highlight-yellow p-[0.375rem] sm:p-[0.4375rem] md:p-[0.5rem] mb-4 sm:mb-5 md:mb-6 bg-highlight-yellow/10">
          <span className="badge-text font-medium text-highlight-yellow">
            {t("title")}
          </span>
        </div>
        <div className="w-full sm:w-[37.5rem] md:w-[49.75rem] mx-auto px-4 sm:px-0">
          <h2 className="text-[#262626] title-text font-semibold text-center">
            {t("description")}
          </h2>
        </div>
      </motion.div>

      <motion.div
        className="bg-secondary-blue py-12 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Marquee className="gap-0" autoFill speed={40}>
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              initial={story.initial}
              name={story.name}
              content={story.content}
            />
          ))}
        </Marquee>
        <Marquee className="mt-6" autoFill direction="right" speed={40}>
          {stories.reverse().map((story) => (
            <StoryCard
              key={story.id}
              initial={story.initial}
              name={story.name}
              content={story.content}
            />
          ))}
        </Marquee>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full mt-6 flex justify-center"
      >
        <Link
          href={"/contact"}
          className="group inline-flex gap-4 items-center justify-between rounded-[0.5rem] bg-highlight-blue py-2 pl-5 pr-1 text-white transition-all hover:bg-highlight-blue/80"
        >
          <span
            className="text-sm sm:text-base font-medium leading-6 tracking-[0]"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                t.markup("button.label", {
                  important: (chunks) =>
                    `<span class="text-highlight-yellow">${chunks}</span>`,
                })
              ),
            }}
          />

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <svg
              className="h-5 w-5 transform text-highlight-blue transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-105"
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
      </motion.div>
    </motion.section>
  );
};

export default UsersStorySection;

function StoryCard({
  initial,
  name,
  content,
}: {
  initial: string;
  name: string;
  content: string;
}) {
  return (
    <div className="flex flex-col items-start justify-center w-[28rem] h-[15rem] mx-auto p-8 bg-white ml-6 rounded-xl">
      <span className="md:text-xl text-base sm:text-lg text-highlight-blue font-semibold bg-secondary-blue/20 rounded-full size-6 flex items-center justify-center p-4">
        {initial}
      </span>
      <span className="md:text-xl text-base sm:text-lg text-highlight-blue font-semibold mt-2">
        {name}
      </span>
      <span className="text-highlight-blue md:text-base text-sm font-normal mt-4 line-clamp-6">
        {content}
      </span>
    </div>
  );
}
